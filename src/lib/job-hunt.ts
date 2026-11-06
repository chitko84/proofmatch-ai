import {COMPANIES,OPPORTUNITIES,type Opportunity} from './career-catalog.ts';
import {findSkillMention,type EvidenceMatch} from './resume-insights.ts';

/** Source-grounded application preparation. Never add credentials, dates, employers or achievements not in the CV. */
export type LetterTone='formal'|'confident'|'concise';
export type JobHuntPreferences={query:string;sector:string;location:string;mode:string};
export type JobHuntResult={job:Opportunity;companyName:string;matches:EvidenceMatch[];missing:string[];coverage:number;compatibility:string[];rank:number};
export type TailorResult={text:string;matches:EvidenceMatch[];missing:string[];sections:string[];sourceLines:string[]};
export type PreparedLetter={text:string;sourceEvidence:string[]};

const headingPatterns:[string,RegExp][]=[
 ['PROFILE',/^(?:professional\s+)?(?:profile|summary|objective|about\s+me|career\s+objective)\s*:?$/i],
 ['SKILLS',/^(?:core|technical|professional|key)?\s*(?:skills|competenc(?:ies|y)|expertise)\s*:?$/i],
 ['EXPERIENCE',/^(?:professional|work|employment|relevant)?\s*(?:experience|work history|employment history)\s*:?$/i],
 ['EDUCATION',/^(?:education|academic background|academic qualifications|qualifications)\s*:?$/i],
 ['PROJECTS',/^(?:selected|key|academic|personal)?\s*(?:projects|portfolio)\s*:?$/i],
 ['CERTIFICATIONS',/^(?:certificates?|certifications?|licenses?|awards|achievements)\s*:?$/i]
];
export function validateResume(text:string):string{
 const trimmed=text.replace(/\r\n?/g,'\n').trim();
 if(trimmed.length<75)throw new Error('Upload or paste a résumé containing at least 75 characters.');
 if(trimmed.length>35000)throw new Error('Résumé text must be shorter than 35,000 characters.');
 return trimmed;
}
function headingFor(line:string){return headingPatterns.find(([,re])=>re.test(line.trim()))?.[0]||null}
export function splitResume(text:string):{name:string;contact:string[];sections:Record<string,string[]>}{
 const source=validateResume(text);
 const lines=source.split('\n').map(line=>line.trimEnd());
 const first=lines.findIndex(l=>Boolean(l.trim()));
 const candidate=lines[first]?.trim()||'Candidate';
 const name=headingFor(candidate)||candidate.includes('@')||candidate.length>90?'Candidate':candidate;
 const sections:Record<string,string[]>={};const contact:string[]=[];
 let section='PROFILE';let inSection=false;
 for(let i=first+1;i<lines.length;i++){
  const line=lines[i].trim();if(!line)continue;
  const heading=headingFor(line);
  if(heading){section=heading;inSection=true;if(!sections[section])sections[section]=[];continue}
  if(!inSection&&contact.length<3&&(/@|\+\d|\d{3}[-\s]\d{3}|linkedin|portfolio|github|\|/.test(line)||line.length<70)){contact.push(line);continue}
  (sections[section]??=[]).push(line);
 }
 return {name,contact,sections};
}
function uniqueSkills(job:Opportunity){return [...new Set(job.skills.map(s=>s.trim()).filter(Boolean))]}
export function evidenceForJob(cvText:string,job:Opportunity){
 const source=cvText.trim();const skills=uniqueSkills(job);
 const matches=skills.map(skill=>findSkillMention(source,skill)).filter((item):item is EvidenceMatch=>Boolean(item));
 return {matches,missing:skills.filter(skill=>!matches.some(m=>m.skill===skill)),coverage:Math.round(matches.length/Math.max(1,skills.length)*100)};
}
function sourceLinesForJob(cvText:string,skills:string[]):string[]{
 const lines=cvText.replace(/\r/g,'').split('\n').map(x=>x.replace(/^\s*[-•*]\s*/,'').trim()).filter(x=>x.length>=26&&x.length<=360);
 const relevant=lines.filter(line=>skills.some(s=>Boolean(findSkillMention(line,s))));
 return [...new Set(relevant)].slice(0,4);
}
export function tailorResume(cvText:string,job:Opportunity):TailorResult{
 const source=validateResume(cvText),parsed=splitResume(source);const evidence=evidenceForJob(source,job);
 const lines=[parsed.name,...parsed.contact,'',`TARGET ROLE: ${job.title}`];
 const sections:string[]=[];
 const profile=parsed.sections.PROFILE||[];
 if(profile.length){sections.push('PROFILE');lines.push('','PROFESSIONAL PROFILE',...profile)}
 if(evidence.matches.length){sections.push('RELEVANT SKILLS');lines.push('','RELEVANT SKILLS',evidence.matches.map(m=>m.skill).join(' | '))}
 // Preserve original employment, education, and project claims verbatim; changing their meaning is forbidden.
 for(const [key,title] of [['EXPERIENCE','PROFESSIONAL EXPERIENCE'],['PROJECTS','PROJECTS & PORTFOLIO'],['EDUCATION','EDUCATION'],['CERTIFICATIONS','CERTIFICATIONS & ACHIEVEMENTS'],['SKILLS','ADDITIONAL SKILLS']] as const){
  const content=parsed.sections[key]?.filter(Boolean)||[];
  if(content.length){sections.push(key);lines.push('',title,...content)}
 }
 if(!sections.length){sections.push('SOURCE EXPERIENCE');lines.push('','DOCUMENTED BACKGROUND',...source.split('\n').filter(Boolean).slice(1))}
 return {text:lines.join('\n').trim(),matches:evidence.matches,missing:evidence.missing,sections,sourceLines:sourceLinesForJob(source,evidence.matches.map(m=>m.skill))};
}
export function buildCoverLetter(cvText:string,job:Opportunity,tone:LetterTone='formal',senderName?:string,employerName?:string):PreparedLetter{
 const source=validateResume(cvText),parsed=splitResume(source),evidence=evidenceForJob(source,job);
 const company=employerName||COMPANIES.find(c=>c.id===job.companyId)?.name||'Hiring Team';
 const name=(senderName||parsed.name||'Candidate').trim().slice(0,90);
 const lines=sourceLinesForJob(source,evidence.matches.map(m=>m.skill)).slice(0,tone==='concise'?2:3);
 const skills=evidence.matches.slice(0,5).map(m=>m.skill);
 const lead=tone==='confident'
   ? `I am eager to be considered for the ${job.title} position at ${company}. I would welcome the opportunity to demonstrate how the experience recorded in my résumé relates to the work your team is recruiting for.`
   : tone==='concise'
   ? `I am applying for the ${job.title} position at ${company}. I am interested in discussing the requirements and contributing to the team's work.`
   : `I am writing to express my interest in the ${job.title} position at ${company}. After reviewing the advertised responsibilities, I would appreciate the opportunity to explain how the experience documented in my résumé may relate to the role.`;
 const keyResponsibilities=job.skills.slice(0,3).join(', ');
 const roleContext=`The role highlights ${keyResponsibilities||'the responsibilities described in the vacancy'}. I am interested in understanding how those requirements translate into the team's current projects, what challenges the position is expected to address, and how success would be evaluated. I would approach the opportunity with a willingness to clarify expectations and continue developing the skills needed for the work.`;
 const evidenceIntro=skills.length
   ? `In relation to the listed requirements, my résumé includes references to ${skills.join(', ')}. These are documented mentions rather than independent verification, and I would be glad to provide the context behind them in an interview.`
   : `My résumé does not directly mention the main skill keywords in the advertisement. I would therefore value a conversation to establish which parts of my background may be transferable and which requirements I would need to develop.`;
 const exact=lines.length?`Selected examples recorded in my résumé include:
${lines.map(line=>`• ${line}`).join('\n')}`:'';
 const contribution=`If given the opportunity to discuss this application, I would like to connect the examples above with the specific responsibilities of the ${job.title} position. I would be happy to explain the work involved, the contribution I personally made, and any additional supporting material that would help your hiring team assess relevance. Where my résumé does not provide enough information, I would prefer to clarify the gap rather than make an unsupported claim.`;
 const collaboration=`I am particularly interested in understanding how ${company} supports collaboration, feedback, and professional development in this role. I believe a conversation about working style, expectations, and opportunities to learn would help both sides decide whether there is a worthwhile match. I am also open to constructive feedback about the skills and experience most important to your team.`;
 const finish=tone==='confident'
   ? `I welcome the opportunity to discuss how my documented experiences may be relevant to your team. Thank you for reviewing my application, and I look forward to the possibility of a conversation.`
   : tone==='concise'
   ? `Thank you for considering my application. I would welcome an interview to clarify my relevant experience and the role's expectations.`
   : `Thank you for the time and consideration given to my application. I would be grateful for an opportunity to discuss the position, share further examples where appropriate, and learn about your team's priorities.`;
 const text=[`Dear Hiring Team at ${company},`,'',lead,'',roleContext,'',evidenceIntro,exact,'',contribution,'',collaboration,'',finish,'','Sincerely,',name].filter((item,i,a)=>!(item===''&&a[i-1]==='')).join('\n');
 return {text,sourceEvidence:lines};
}
export function rankJobs(cvText:string,prefs:JobHuntPreferences,jobs:Opportunity[]=OPPORTUNITIES,limit=20,companies=COMPANIES):JobHuntResult[]{
 const source=cvText.trim().slice(0,35000),query=prefs.query.trim().toLowerCase();
 const keywords=query.split(/[,\s]+/).filter(x=>x.length>=3);
 const results=jobs.filter(job=>prefs.sector==='All industries'||job.sector===prefs.sector).map(job=>{
  const companyName=companies.find(c=>c.id===job.companyId)?.name||'Company';
  const {matches,missing,coverage}=evidenceForJob(source,job);
  const compatibility:string[]=[];
  const modeOk=!prefs.mode||prefs.mode==='Any work style'||prefs.mode===job.mode;
  const locationOk=!prefs.location.trim()||[job.location,companyName].join(' ').toLowerCase().includes(prefs.location.toLowerCase());
  if(modeOk&&prefs.mode!=='Any work style'&&prefs.mode)compatibility.push(`${job.mode} arrangement`);
  if(locationOk&&prefs.location.trim())compatibility.push('Preferred location');
  const hay=[job.title,job.description,job.sector,...job.skills,companyName].join(' ').toLowerCase();
  const relevance=keywords.length?keywords.filter(k=>hay.includes(k)).length/keywords.length:0;
  // A shortlist-ordering signal, never a hiring likelihood or suitability certification.
  const rank=coverage*.74+relevance*19+(modeOk?4:0)+(locationOk?3:0);
  return {job,companyName,matches,missing,coverage,compatibility,rank};
 });
 const ordered=results.sort((a,b)=>b.rank-a.rank||b.matches.length-a.matches.length||a.job.id.localeCompare(b.job.id));
 const count=Math.min(50,Math.max(1,limit)),chosen:JobHuntResult[]=[],perRole=new Map<string,number>();
 // Balance job relevance with variety: avoid showing one career title repeatedly at the top.
 for(const result of ordered){if(chosen.length>=count)break;const used=perRole.get(result.job.title)||0;if(used>=3)continue;chosen.push(result);perRole.set(result.job.title,used+1)}
 if(chosen.length<count)for(const result of ordered){if(chosen.length>=count)break;if(!chosen.includes(result))chosen.push(result)}
 return chosen;
}

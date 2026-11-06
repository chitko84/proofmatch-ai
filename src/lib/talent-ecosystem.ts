/** Deterministic, entirely fictional profiles used in the self-contained talent workspace.
 * Names, credentials, evidence notes and job opportunities are not verified people or vacancies.
 */
import {CAREER_SECTORS,COMPANIES,OPPORTUNITIES,ROLE_CATALOG,type Opportunity,type CareerRoleInfo} from './career-catalog.ts';

export type TalentEvidence={skill:string;kind:'portfolio_example'|'self_report';source:string;excerpt:string};
export type TalentCandidate={id:string;name:string;title:string;roleId:string;sector:string;location:string;experienceYears:number;level:string;education:string;skills:string[];evidence:TalentEvidence[];bio:string;workMode:'Remote'|'Hybrid'|'On-site';salaryExpectation:number;openToWork:boolean;appliedJobId:string;interests:string[];available:string};
const given=['Aisha','Daniel','Priya','Amir','Nur','Chen','Maria','Farah','Kevin','Hana','Arjun','Sara','Iskandar','Leila','Zoe','Ravi','Maya','Oliver','Aina','Nadia','Ethan','Siti','Adam','Mei','Rizwan','Kavitha','Farid','Grace','Yasmin','Aidan','Sofia','Hakim','Jasmine','Reuben','Hafiz','Anjali','Zara','Irfan','Melissa','Rayyan','Nisha','Suresh','Liyana','Dinesh','Mariam','Wei','Imran','Hannah','Khalid','Vanessa'];
const family=['Rahman','Lim','Nair','Hakim','Sofia','Wei','Santos','Idris','Tan','Lee','Patel','Malik','Azmi','Hassan','Wong','Kumar','Abdullah','Chen','Yusuf','Karim','Low','Amina','Ng','Aziz','Khan','Pillai','Osman','Cheong','Gan','Mahmud','Ali','Ong','Joseph','Ibrahim','Sulaiman','Rajan','Goh','Bakar','David','Ahmad','Shah','Koh','Anwar','Balan','Rashid','Chandra','Kaur','Rao','Ismail','Fernando'];
const locations=['Kuala Lumpur','Penang','Johor Bahru','Alor Setar','Shah Alam','Ipoh','Kuching','Kota Kinabalu','Melaka','Seremban','Petaling Jaya','Cyberjaya'];
const credentials=['Diploma','Bachelor’s degree','Professional certificate','Bachelor’s degree','Master’s degree','Vocational qualification'];
const settings=['Remote','Hybrid','On-site'] as const;
const experienceLevels=['Graduate','Early career','Associate','Mid-career','Senior'];
const projectFormats=['Portfolio project','Coursework case study','Work sample','Training assignment','Process review','Research exercise'];
const jobByRole=new Map<string,Opportunity[]>();
for(const job of OPPORTUNITIES){const arr=jobByRole.get(job.title)||[];arr.push(job);jobByRole.set(job.title,arr)}
export const TALENT_CANDIDATES:TalentCandidate[]=Array.from({length:1200},(_,i)=>{
 const role=ROLE_CATALOG[(i*29+Math.floor(i/ROLE_CATALOG.length))%ROLE_CATALOG.length];
 const name=`${given[i%given.length]} ${family[Math.floor(i/given.length)%family.length]}`;
 const experienceYears=(i*7+Math.floor(i/11))%16;
 const levels=experienceYears===0?experienceLevels[0]:experienceYears<3?experienceLevels[1]:experienceYears<6?experienceLevels[2]:experienceYears<10?experienceLevels[3]:experienceLevels[4];
 const listed=[...role.skills];
 const supporting=listed.slice(0,(i%4===0)?1:2);
 const format=projectFormats[i%projectFormats.length];
 const evidence:TalentEvidence[]=listed.map((skill,index)=>({skill,kind:index<supporting.length?'portfolio_example':'self_report',source:index<supporting.length?`${format}: ${role.focus}`:'Candidate profile',excerpt:index<supporting.length?`Describes applying ${skill} in a ${format.toLowerCase()} focused on ${role.focus}. Supporting material has not been independently checked.`:`Lists ${skill} among relevant skills and interests.`}));
 const possible=jobByRole.get(role.title)||[];
 const alternate=OPPORTUNITIES[(i*11)%OPPORTUNITIES.length];
 const application=i%5===0?alternate:(possible[i%Math.max(1,possible.length)]||alternate);
 return {id:`talent-${String(i+1).padStart(4,'0')}`,name,title:role.title,roleId:role.id,sector:role.sector,location:locations[(i*5+Math.floor(i/30))%locations.length],experienceYears,level:levels,education:credentials[i%credentials.length],skills:listed,evidence,bio:`${levels} professional interested in ${role.focus}, collaborative problem-solving and continued development in ${role.sector.toLowerCase()}.`,workMode:settings[i%3],salaryExpectation:2500+Math.floor(experienceYears*430)+(i%5)*350,openToWork:i%13!==0,appliedJobId:application.id,interests:[role.focus,listed[0],listed[1]||listed[0]],available:i%3===0?'Within 2 weeks':i%3===1?'Within 1 month':'Flexible'};
});
export const talentById=(id:string)=>TALENT_CANDIDATES.find(candidate=>candidate.id===id);
export const companyPositions=(companyId:string)=>OPPORTUNITIES.filter(job=>job.companyId===companyId);
export type SkillFit={skill:string;status:'supported'|'claimed'|'not_mentioned'};
export type JobFit={score:number;matched:number;total:number;requirements:SkillFit[];summary:string;preferenceNotes:string[]};
const normalize=(s:string)=>s.trim().toLowerCase().replace(/[^a-z0-9\s/+.-]/g,'').replace(/\s+/g,' ');
export function assessTalentForJob(candidate:TalentCandidate,job:Opportunity):JobFit{
 const requirements=job.skills.map(skill=>{
  const found=candidate.evidence.find(e=>normalize(e.skill)===normalize(skill));
  return {skill,status:found?.kind==='portfolio_example'?'supported':found?'claimed':'not_mentioned'} as SkillFit;
 });
 const total=requirements.length;
 const points=requirements.reduce((sum,item)=>sum+(item.status==='supported'?1:item.status==='claimed'?0.4:0),0);
 const score=total?Math.round(points/total*100):0;
 const matched=requirements.filter(item=>item.status!=='not_mentioned').length;
 const preferenceNotes=[] as string[];
 if(candidate.workMode!==job.mode)preferenceNotes.push(`Candidate prefers ${candidate.workMode.toLowerCase()} work; this role is ${job.mode.toLowerCase()}.`);
 const estimatedMin=Number((job.salary.match(/RM\s*([\d,]+)/)||[])[1]?.replaceAll(',','')||0);
 if(estimatedMin&&candidate.salaryExpectation>estimatedMin*1.55)preferenceNotes.push('Confirm that compensation expectations align.');
 return {score,matched,total,requirements,summary:matched===total?'All listed requirements are mentioned, with different supporting evidence levels.':`${matched} of ${total} listed requirements are mentioned in the candidate profile.`,preferenceNotes};
}
export function bestCompanyAlternatives(candidate:TalentCandidate,companyId:string,excludeId?:string,limit=5){
 return companyPositions(companyId).filter(j=>j.id!==excludeId).map(job=>({job,fit:assessTalentForJob(candidate,job)})).filter(x=>x.fit.matched>0).sort((a,b)=>b.fit.score-a.fit.score||b.fit.matched-a.fit.matched).slice(0,limit);
}
export type RadarQuery={raw:string;sector:string|null;role:string|null;location:string|null;mode:string|null;skills:string[];minimumYears:number};
export function parseTalentSearch(raw:string):RadarQuery{
 const q=normalize(raw);const sectors=[...CAREER_SECTORS].sort((a,b)=>b.length-a.length);
 const sector=sectors.find(s=>q.includes(normalize(s)))||null;
 const roles=ROLE_CATALOG.filter(r=>q.includes(normalize(r.title))).sort((a,b)=>b.title.length-a.title.length);
 const location=locations.find(s=>q.includes(normalize(s)))||null;
 const mode=['Remote','Hybrid','On-site'].find(m=>q.includes(m.toLowerCase()))||null;
 const skills=[...new Set(ROLE_CATALOG.flatMap(r=>r.skills))].filter(s=>normalize(s).length>2&&q.includes(normalize(s))).sort((a,b)=>b.length-a.length).slice(0,10);
 const years=raw.match(/(?:at least|min(?:imum)?\s*|over\s*|more than\s*|with\s*)?(\d{1,2})\s*\+?\s*(?:years?|yrs?)(?:\s+of\s+experience)?/i);
 return {raw:raw.trim(),sector,role:roles[0]?.title||null,location,mode,skills,minimumYears:years?Math.min(40,Number(years[1])):0};
}
export type RadarResult={candidate:TalentCandidate;score:number;reasons:string[];gaps:string[]};
export function searchTalent(raw:string,limit=24,people:TalentCandidate[]=TALENT_CANDIDATES):RadarResult[]{
 const q=parseTalentSearch(raw);
 const words=normalize(raw).split(' ').filter(w=>w.length>=4&&!['find','with','candidate','someone','people','experience','years','year','looking','need','hire','from','have','work','who','that','and','for'].includes(w));
 const results=people.map(candidate=>{
  const reasons:string[]=[];const gaps:string[]=[];
  const matchedSkills=q.skills.filter(s=>candidate.skills.some(cs=>normalize(cs)===normalize(s)));
  if(matchedSkills.length)reasons.push(`Relevant skills: ${matchedSkills.join(', ')}`);
  if(q.role&&candidate.title===q.role)reasons.push(`Current field: ${candidate.title}`);
  if(q.sector&&candidate.sector===q.sector)reasons.push(`Industry: ${candidate.sector}`);
  if(q.location&&candidate.location===q.location)reasons.push(`Located in ${candidate.location}`);
  if(q.minimumYears&&candidate.experienceYears>=q.minimumYears)reasons.push(`${candidate.experienceYears} years of stated experience`);
  if(q.mode&&candidate.workMode===q.mode)reasons.push(`Prefers ${q.mode} work`);
  for(const s of q.skills.filter(s=>!matchedSkills.includes(s)))gaps.push(`No stated evidence for ${s}`);
  const keywordHits=words.filter(w=>[candidate.title,candidate.sector,candidate.location,...candidate.skills,...candidate.interests].join(' ').toLowerCase().includes(w)).length;
  const skillScore=q.skills.length?matchedSkills.length/q.skills.length:0;
  const roleScore=q.role?(candidate.title===q.role?1:0):0;
  const industryScore=q.sector?(candidate.sector===q.sector?1:0):0;
  const locationScore=q.location?(candidate.location===q.location?1:0):0;
  const modeScore=q.mode?(candidate.workMode===q.mode?1:0):0;
  const yearsScore=q.minimumYears?(candidate.experienceYears>=q.minimumYears?1:candidate.experienceYears/Math.max(1,q.minimumYears)):0;
  const applicable=(q.skills.length?40:0)+(q.role?28:0)+(q.sector?15:0)+(q.location?9:0)+(q.mode?4:0)+(q.minimumYears?4:0);
  const numerator=skillScore*40+roleScore*28+industryScore*15+locationScore*9+modeScore*4+yearsScore*4;
  const score=applicable?Math.round(numerator/applicable*100):Math.min(100,Math.round(keywordHits/Math.max(1,words.length)*100));
  if(!reasons.length&&keywordHits)reasons.push('Related profile terminology');
  if(!reasons.length)reasons.push('Review professional profile for possible transferable skills');
  return {candidate,score,reasons,gaps};
 });
 return results.sort((a,b)=>b.score-a.score||(b.candidate.openToWork?1:0)-(a.candidate.openToWork?1:0)||a.candidate.id.localeCompare(b.candidate.id)).slice(0,Math.min(120,Math.max(1,limit)));
}
export const talentCountsBySector=()=>CAREER_SECTORS.map(sector=>({sector,count:TALENT_CANDIDATES.filter(c=>c.sector===sector).length})).filter(x=>x.count>0);
export const companyByIdIncludingCatalog=(id:string)=>COMPANIES.find(c=>c.id===id);

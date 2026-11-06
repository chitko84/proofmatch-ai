import {ROLE_CATALOG} from './career-catalog.ts';
/** A document-mention assessment, NOT a measurement of ability or likelihood of hiring. */
export type EvidenceMatch={skill:string;excerpt:string};
export type ResumeRoleResult={id:string;title:string;sector:string;covered:number;total:number;percentage:number;matches:EvidenceMatch[];missing:string[]};
const synonyms:Record<string,string[]>={
 'react':['react','react.js','reactjs'],'typescript':['typescript','type script'],'javascript':['javascript','js development'],
 'sql':['sql','mysql','postgresql','postgres','database querying'],'python':['python','pandas','numpy'],
 'testing':['testing','test automation','unit tests','software tests'], 'test cases':['test case','test plan','test script'],
 'communication':['communication','presentations','public speaking','customer correspondence'],
 'stakeholder communication':['stakeholder communication','stakeholder presentations','business presentations'],
 'customer support':['customer support','customer service','help desk'],
 'data analysis':['data analysis','data analytics','analyzing data','analysing data'],
 'visualization':['visualization','visualisation','dashboard','tableau','power bi'],
 'planning':['planning','project scheduling','work planning'],
 'risk management':['risk management','risk analysis','risk register'],
 'teamwork':['teamwork','team collaboration','cross-functional team'],
 'leadership':['leadership','team lead','team leader','leading a team'],
 'excel':['excel','spreadsheets','pivot tables'],
 'marketing':['marketing','digital campaigns','social media campaigns'],
 'research':['research','literature review','research methods'],
 'financial reporting':['financial reporting','financial statements','budget reporting'],
 'teaching':['teaching','lesson plans','classroom instruction'],
};
const cachedSkillPatterns=new Map<string,RegExp>();
function pattern(term:string){
 const cached=cachedSkillPatterns.get(term);if(cached)return cached;
 const result=new RegExp(`(^|[^\\p{L}\\p{N}])${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+')}($|[^\\p{L}\\p{N}])`,'iu');
 if(cachedSkillPatterns.size>650)cachedSkillPatterns.clear();
 cachedSkillPatterns.set(term,result);return result;
}
export function findSkillMention(source:string,skill:string):EvidenceMatch|null{
 const terms=[skill,...(synonyms[skill.toLowerCase()]||[])];
 for(const term of terms){const m=pattern(term).exec(source);if(!m)continue;
  const index=m.index+(m[1]?.length||0),start=Math.max(0,index-52),end=Math.min(source.length,index+term.length+90);
  return {skill,excerpt:(start?'…':'')+source.slice(start,end).replace(/\s+/g,' ').trim()+(end<source.length?'…':'')};
 }
 return null;
}
export function analyzeResume(source:string,sector='All industries'):ResumeRoleResult[]{
 const text=source.slice(0,35000).trim();if(text.length<40)throw new Error('Please provide at least 40 characters of résumé text.');
 return ROLE_CATALOG.filter(role=>sector==='All industries'||role.sector===sector).map(role=>{
  const matches=role.skills.map(skill=>findSkillMention(text,skill)).filter((item):item is EvidenceMatch=>!!item);
  return {id:role.id,title:role.title,sector:role.sector,covered:matches.length,total:role.skills.length,percentage:Math.round(matches.length/Math.max(1,role.skills.length)*100),matches,missing:role.skills.filter(skill=>!matches.some(m=>m.skill===skill))};
 }).sort((a,b)=>b.covered-a.covered||b.percentage-a.percentage||a.title.localeCompare(b.title));
}

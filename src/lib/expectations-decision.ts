import type {Opportunity} from './career-catalog.ts';
import {findSkillMention} from './resume-insights.ts';
export type ExpectationInput={role:string;location:string;mode:string;salaryMin:string;salaryMax:string;strengths:string;flexibility:string};
export type ExpectationSignal={label:string;ok:boolean|null;note:string};
export type ExpectationDecision={signals:ExpectationSignal[];matchedSkills:string[];aligned:number;level:'consider'|'clarify'|'explore';headline:string;reasons:string[];questions:string[]};
export function salaryRange(raw:string):{min:number;max:number}|null{
 const nums=[...raw.matchAll(/[\d,]+/g)].map(x=>Number(x[0].replaceAll(',',''))).filter(x=>x>=1000);
 return nums.length?{min:nums[0],max:nums[1]??nums[0]}:null;
}
export function compareExpectations(data:ExpectationInput,job:Opportunity):ExpectationDecision{
 const range=salaryRange(job.salary),min=Number(data.salaryMin),max=Number(data.salaryMax);
 const salaryFit=range?min<=range.max&&max>=range.min:null;
 const modeFit=data.mode.trim().toLowerCase()===job.mode.toLowerCase();
 const remote=job.mode.toLowerCase()==='remote';
 const normalizedLocation=data.location.trim().toLowerCase();
 const locationFit: boolean|null=remote?null:normalizedLocation?job.location.toLowerCase().includes(normalizedLocation):null;
 const matchedSkills=job.skills.filter(skill=>findSkillMention(data.strengths,skill)!==null);
 const skillFit=matchedSkills.length>=Math.max(1,Math.ceil(job.skills.length*.5));
 const signals:ExpectationSignal[]=[
  {label:'Salary range',ok:salaryFit,note:range?`Employer: ${job.salary}; your target: RM ${min.toLocaleString()}–${max.toLocaleString()}`:'Employer salary not specified — ask HR'},
  {label:'Work arrangement',ok:modeFit,note:`Preferred: ${data.mode}; advertised: ${job.mode}`},
  {label:'Location',ok:locationFit,note:remote?'Remote vacancy: confirm eligibility and any office attendance with HR':`Preferred: ${data.location||'Not specified'}; advertised: ${job.location}`},
  {label:'Skill evidence',ok:skillFit,note:`${matchedSkills.length}/${job.skills.length} advertised skill terms appear in your self-reported examples`}
 ];
 const aligned=signals.filter(s=>s.ok===true).length;
 const substantiveSkill=matchedSkills.length>0;
 const level:ExpectationDecision['level']=!substantiveSkill?'explore':aligned>=3&&skillFit&&salaryFit!==false?'consider':aligned>=2?'clarify':'explore';
 const headline=level==='consider'?'YES — Consider applying':level==='clarify'?'MAYBE — Clarify before applying':'NOT YET — Explore other roles';
 const reasons=[...signals.filter(s=>s.ok===true).map(s=>`${s.label} aligns`),...signals.filter(s=>s.ok===false).map(s=>`${s.label} needs discussion`),...signals.filter(s=>s.ok===null).map(s=>`${s.label} is not fully specified`)];
 const questions=[...(salaryFit===false?['Is the compensation range negotiable?']:[]),...(!modeFit?['Can the work arrangement accommodate my preferred schedule?']:[]),...(locationFit===false?['Is relocation or remote attendance possible?']:[]),...(!skillFit?['Which competencies are essential on day one, and which can be learned?']:[]),...(!range?['What salary range is budgeted for this position?']:[])];
 return {signals,matchedSkills,aligned,level,headline,reasons,questions};
}

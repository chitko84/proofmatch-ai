/** Deterministic résumé-to-vacancy comparison for the self-contained demo.
 * Mentions are NOT verified competencies, hiring probabilities or external live jobs.
 */
import {findSkillMention} from './resume-insights.ts';
import type {Opportunity} from './career-catalog.ts';
import type {JobFit} from './talent-ecosystem.ts';

export function assessCvForJob(cvText:string,job:Opportunity):JobFit{
 const source=cvText.slice(0,35000);
 const requirements=job.skills.map(skill=>({skill,status:(findSkillMention(source,skill)?'claimed':'not_mentioned') as 'claimed'|'not_mentioned'}));
 const matched=requirements.filter(item=>item.status==='claimed').length;
 const total=requirements.length;
 return {score:total?Math.round(100*matched/total):0,matched,total,requirements,
  summary:`${matched} of ${total} advertised skill terms appear in the CV. Mentions must be checked by a human; absent terms are not evidence of lacking competence.`,
  preferenceNotes:[]};
}
export function rankCvJobs(cvText:string,jobs:Opportunity[],excludeJobId='',limit=12){
 return jobs.filter(job=>job.id!==excludeJobId).map(job=>({job,fit:assessCvForJob(cvText,job)}))
  .sort((a,b)=>b.fit.score-a.fit.score||b.fit.matched-a.fit.matched||a.job.title.localeCompare(b.job.title)||a.job.id.localeCompare(b.job.id))
  .slice(0,Math.max(1,limit));
}
/** Balance distinct job titles at the top so cross-industry paths remain discoverable. */
export function diverseCvJobs(cvText:string,jobs:Opportunity[],excludeJobId='',limit=12){
 const previouslyAppliedTitle=jobs.find(j=>j.id===excludeJobId)?.title;
 const ranked=rankCvJobs(cvText,jobs,excludeJobId,jobs.length).filter(item=>item.fit.matched>0&&item.job.title!==previouslyAppliedTitle),selected:ReturnType<typeof rankCvJobs>=[];
 const seen=new Set<string>();
 for(const item of ranked){if(seen.has(item.job.title))continue;selected.push(item);seen.add(item.job.title);if(selected.length>=limit)return selected;}
 for(const item of ranked){if(selected.length>=limit)break;if(!selected.includes(item))selected.push(item);}
 return selected;
}

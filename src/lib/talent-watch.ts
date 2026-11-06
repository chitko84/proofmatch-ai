import type {WatchSignal} from './proofwatch.ts';
/** Curated cross-industry discoveries from the existing candidate and vacancy pool.
 * Each signal is checked against both the originally applied vacancy and the
 * alternative vacancy; never present a weaker match as a stronger one.
 * This bounded selection avoids scoring 1,200 x 800 jobs during page load.
 */
import type {TalentCandidate} from './talent-ecosystem.ts';
import type {Opportunity} from './career-catalog.ts';
import {assessTalentForJob} from './talent-ecosystem.ts';
const FEATURED_TALENT:[string,string][]=[
 ['talent-0006','Tax Associate'],
 ['talent-0016','Media Producer'],
 ['talent-0036','Business Development Executive'],
 ['talent-0051','Cloud Engineer'],
 ['talent-0066','Scriptwriter'],
 ['talent-0026','Social Worker'],
];
export function getTalentWatchSignals(people:TalentCandidate[],jobs:Opportunity[]):WatchSignal[]{
 const byPerson=new Map(people.map(person=>[person.id,person]));
 const byJob=new Map(jobs.map(job=>[job.id,job]));
 const byTitle=new Map<string,Opportunity>();
 for(const job of jobs)if(!byTitle.has(job.title))byTitle.set(job.title,job);
 return FEATURED_TALENT.flatMap(([id,title])=>{
  const person=byPerson.get(id);
  const applied=person&&byJob.get(person.appliedJobId);
  const alternative=byTitle.get(title);
  if(!person||!applied||!alternative||applied.id===alternative.id)return [];
  const before=assessTalentForJob(person,applied);
  const after=assessTalentForJob(person,alternative);
  if(after.score<=before.score)return [];
  const evidence=person.evidence.find(item=>item.kind==='portfolio_example'&&alternative.skills.includes(item.skill));
  if(!evidence)return [];
  return [{candidateId:person.id,candidateName:person.name,appliedRole:applied.title,
   alternativeRole:alternative.title,alternativeRoleId:alternative.id,
   evidenceLine:evidence.excerpt,evidenceSource:evidence.source}];
 });
}

/** Recruiter analytics calculated from the project's eight fictional candidates.
 * Dates are authored presentation-demo intake dates, NOT real activity history.
 * Evidence coverage is not a hiring score, success likelihood or model accuracy. */
import { candidates, roles } from './data.ts';
import { assessMatch, rankRoles } from './engine.ts';
import type { Candidate, Role, WorkMode } from './types.ts';

export const DEMO_INTAKE: Record<string,string> = {
  C01:'2026-09-30', C02:'2026-10-03', C03:'2026-10-07', C04:'2026-10-10',
  C05:'2026-10-13', C06:'2026-10-16', C07:'2026-10-19', C08:'2026-10-22',
};
export const DEMO_WEEKS = [
  {label:'Sep 28',from:'2026-09-28',to:'2026-10-04'},
  {label:'Oct 05',from:'2026-10-05',to:'2026-10-11'},
  {label:'Oct 12',from:'2026-10-12',to:'2026-10-18'},
  {label:'Oct 19',from:'2026-10-19',to:'2026-10-25'},
] as const;

export type InsightFilters = {
  appliedRole: string;
  location: string;
  workMode: 'all'|WorkMode;
  range: 'all'|'last2'|'latest';
};
export const DEFAULT_INSIGHT_FILTERS:InsightFilters = {appliedRole:'all',location:'all',workMode:'all',range:'all'};

export function getFilteredCandidates(filters:InsightFilters):Candidate[] {
  const lower = filters.range==='latest'?'2026-10-19':filters.range==='last2'?'2026-10-12':'2026-09-28';
  return candidates.filter(c => (filters.appliedRole==='all'||c.appliedRoleId===filters.appliedRole)
    && (filters.location==='all'||c.location===filters.location)
    && (filters.workMode==='all'||c.preferredModes.includes(filters.workMode))
    && DEMO_INTAKE[c.id]>=lower);
}
export function getInsights(filters:InsightFilters){
  const people=getFilteredCandidates(filters);
  const reports=people.flatMap(c=>roles.map(r=>assessMatch(c,r)));
  const ranked=people.map(c=>({person:c,best:rankRoles(c,roles)[0],applied:assessMatch(c,roles.find(r=>r.id===c.appliedRoleId)!)}));
  const alternative=ranked.filter(x=>x.best.alternativeToApplied);
  const requirementChecks=reports.flatMap(r=>r.assessments);
  const backed=requirementChecks.filter(a=>a.support==='artifact').length;
  const coverage=reports.length?Math.round(reports.reduce((sum,r)=>sum+r.coverage,0)/reports.length*100):0;
  const intakes=DEMO_WEEKS.map(w=>({label:w.label,count:people.filter(c=>DEMO_INTAKE[c.id]>=w.from&&DEMO_INTAKE[c.id]<=w.to).length}));
  const jobCounts=roles.map(r=>({id:r.id,title:r.title,count:people.filter(c=>c.appliedRoleId===r.id).length,alternatives:alternative.filter(x=>x.best.roleId===r.id).length}));
  const tiers=['strong','partial','limited'] as const;
  const tierCounts=tiers.map(t=>({tier:t,count:reports.filter(r=>r.tier===t).length}));
  const recent=[...people].sort((a,b)=>DEMO_INTAKE[b.id].localeCompare(DEMO_INTAKE[a.id])).slice(0,5).map(person=>({person,date:DEMO_INTAKE[person.id],role:roles.find(r=>r.id===person.appliedRoleId)!}));
  return {people,ranked,alternative,roleComparisons:reports.length,backed,coverage,intakes,jobCounts,tierCounts,recent,requirementsChecked:requirementChecks.length};
}
export function roleName(id:string):string {return roles.find(r=>r.id===id)?.title||id}
export function bestNextRole(person:Candidate):{role:Role;coverage:number}|null {
  const best=rankRoles(person,roles)[0];
  if(!best.alternativeToApplied)return null;
  return {role:roles.find(r=>r.id===best.roleId)!,coverage:best.coverage};
}

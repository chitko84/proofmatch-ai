import { assessMatch, rankRoles } from './engine.ts';
import { candidates, roles } from './data.ts';
import type { Candidate, Evidence, Role, WorkMode } from './types.ts';

/** Phase 3 domain logic is deterministic and inspectable. All profiles are fictional. */
export type CandidateReply = {
  id: string;
  candidateId: string;
  skillId: string;
  note: string;
  createdAt: string;
  kind: 'self_report';
  origin?: 'fairshot';
  taskId?: string;
};
export const REPLIES_STORAGE_KEY = 'proofmatch-phase3-replies-v1';
export const MAX_REPLIES = 30;

export function validateReply(raw: unknown): CandidateReply {
  if (!raw || typeof raw !== 'object') throw new Error('Please add a clarification.');
  const x = raw as Record<string,unknown>;
  const candidate = candidates.find(c => c.id === x.candidateId);
  if (!candidate) throw new Error('Choose a sample candidate.');
  const allSkills = new Set(roles.flatMap(r => r.requirements.map(q => q.skillId)));
  if (typeof x.skillId !== 'string' || !allSkills.has(x.skillId)) throw new Error('Choose a skill to clarify.');
  if (typeof x.note !== 'string' || x.note.trim().length < 15 || x.note.length > 800) throw new Error('Please write 15–800 characters.');
  const date = typeof x.createdAt === 'string' && !Number.isNaN(Date.parse(x.createdAt)) ? x.createdAt : new Date().toISOString();
  const id = typeof x.id === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(x.id) ? x.id : `${candidate.id}-${Date.now()}`;
  return { id, candidateId: candidate.id, skillId: x.skillId, note: x.note.trim(), createdAt: date, kind: 'self_report',
    ...(x.origin === 'fairshot' ? {origin: 'fairshot' as const, ...(typeof x.taskId === 'string' && /^[a-z0-9-]{1,30}$/.test(x.taskId) ? {taskId: x.taskId}: {})} : {}),
  };
}
export function validatedReplies(raw: unknown): CandidateReply[] {
  if (!Array.isArray(raw)) return [];
  return raw.slice(-MAX_REPLIES).flatMap(v => { try { return [validateReply(v)]; } catch { return []; } });
}
export function readReplies(): CandidateReply[] {
  if (typeof window === 'undefined') return [];
  try { return validatedReplies(JSON.parse(window.localStorage.getItem(REPLIES_STORAGE_KEY) || '[]')); } catch { return []; }
}
export function writeReplies(items: CandidateReply[]): void {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(REPLIES_STORAGE_KEY, JSON.stringify(validatedReplies(items))); window.dispatchEvent(new Event('proofmatch-replies-updated')); } catch { /* unavailable */ }
}
/** A reply is never silently upgraded to independent artifact proof. */
export function candidateWithReplies(candidate: Candidate, replies: CandidateReply[]): Candidate {
  const added: Evidence[] = validatedReplies(replies).filter(r => r.candidateId === candidate.id).map(r => ({
    skillId: r.skillId, kind: 'self_report', sourceLabel: r.origin === 'fairshot' ? 'FairShot work-sample answer (not independently checked)' : 'Candidate correction (not independently checked)', excerpt: r.note,
  }));
  return { ...candidate, evidence: [...candidate.evidence, ...added] };
}
export function previewPreference(candidate: Candidate, role: Role, skillId: string, proposedWeight: number) {
  const req = role.requirements.find(r => r.skillId === skillId);
  if (!req) throw new Error('Select a preference from this job role.');
  if (!Number.isInteger(proposedWeight) || proposedWeight < 1 || proposedWeight > 5) throw new Error('Preference importance must be from 1 to 5.');
  // Illustrative coverage weights only. We do not waive or change any legal, safety or mandatory requirement.
  const simulated: Role = {...role,requirements:role.requirements.map(r=>r.skillId===skillId?{...r,weight:proposedWeight}:r)};
  const before = assessMatch(candidate, role);
  const after = assessMatch(candidate, simulated);
  return {before,after,changedSkillId:skillId,oldWeight:req.weight,newWeight:proposedWeight};
}

export type ExpectationsResult = {
  workMode: 'overlap' | 'needs_discussion';
  workModeMessage: string;
  careerGoal: 'related_interest' | 'not_established';
  careerGoalMessage: string;
  nextStep: string;
};
/** Career goals are never used to silently exclude someone. */
export function compareExpectations(candidate: Candidate, role: Role, statedGoal: string = ''): ExpectationsResult {
  const workMode: ExpectationsResult['workMode'] = candidate.preferredModes.some(m=>role.acceptedModes.includes(m))?'overlap':'needs_discussion';
  const goal = statedGoal.trim().toLowerCase();
  const tags = goal ? [goal] : candidate.interests.map(i=>i.toLowerCase());
  const roleTopics: Record<string,string[]> = {
    frontend:['frontend','design','user experience','ui','react','web','product engineering'],
    qa:['test','quality','automation','qa','reliability'],
    analyst:['data','analytics','analysis','business','dashboard'],
  };
  const hasRelatedInterest = tags.some(t=>(roleTopics[role.id]||[]).some(s=>t.includes(s)||s.includes(t)));
  return {
    workMode,
    workModeMessage:workMode==='overlap'?'The stated work preferences overlap with the role. Confirm location and hours before proceeding.':'The stated work arrangements do not overlap. Ask the candidate whether this would work for them.',
    careerGoal:hasRelatedInterest?'related_interest':'not_established',
    careerGoalMessage:hasRelatedInterest?'The candidate has mentioned an interest related to this type of work.':'We do not have enough information to confirm how this job supports their goals.',
    nextStep:workMode==='overlap'?'Ask what they hope to learn or work on in this role.':'Clarify the work arrangement before making any decision.',
  };
}

export type CareerMilestone = { title: string; description: string; skills: string[] };
export type CareerTrack = {id:string;name:string;subtitle:string;roles:CareerMilestone[]};
/** Fictional company pathway examples; not individual performance forecasts or guaranteed promotions. */
export const CAREER_TRACKS: CareerTrack[] = [
  {id:'software',name:'Software building',subtitle:'Create and improve digital products',roles:[
    {title:'Junior Developer',description:'Contribute small, reviewed features.',skills:['react','typescript','css']},
    {title:'Software Developer',description:'Own features and coordinate with the team.',skills:['react','typescript','api_integration']},
    {title:'Senior Developer',description:'Guide technical decisions and mentor others.',skills:['typescript','api_integration','test_automation']},
    {title:'Technical Lead',description:'Help a team deliver dependable software.',skills:['api_integration','cicd','test_automation']},
  ]},
  {id:'quality',name:'Software quality',subtitle:'Make apps more dependable',roles:[
    {title:'Junior QA Tester',description:'Learn to plan and document test cases.',skills:['python']},
    {title:'QA Automation Engineer',description:'Build useful repeatable tests.',skills:['python','test_automation','api_testing']},
    {title:'Senior QA Engineer',description:'Improve test strategy and delivery quality.',skills:['test_automation','api_testing','cicd']},
    {title:'QA Lead',description:'Coordinate quality work across projects.',skills:['test_automation','cicd']},
  ]},
  {id:'analytics',name:'Data and insights',subtitle:'Turn information into useful decisions',roles:[
    {title:'Junior Data Analyst',description:'Clean data and prepare small reports.',skills:['sql','cleaning']},
    {title:'Data Analyst',description:'Use data to answer business questions.',skills:['sql','python','dashboard']},
    {title:'Senior Data Analyst',description:'Guide analysis and explain complex findings.',skills:['sql','dashboard','cleaning']},
    {title:'Analytics Lead',description:'Help teams use evidence in decisions.',skills:['sql','dashboard']},
  ]},
];
export function evaluateCareerMilestone(candidate: Candidate, item: CareerMilestone) {
  const skills = item.skills.map(skillId => ({ skillId, evidence: candidate.evidence.find(e=>e.skillId===skillId && e.kind==='artifact') ? 'project example' : candidate.evidence.some(e=>e.skillId===skillId)? 'self-reported' : 'not documented' }));
  return { skills, documented: skills.filter(s=>s.evidence==='project example').length };
}
export function bestRoleSummary(candidateId:string) {
  const candidate=candidates.find(c=>c.id===candidateId);
  if (!candidate) return null;
  const best=rankRoles(candidate,roles)[0];
  const role=roles.find(r=>r.id===best.roleId)!;
  const evidence=best.assessments.filter(a=>a.support==='artifact').map(a=>a.requirement.label);
  const unknown=best.assessments.filter(a=>a.support!=='artifact').map(a=>a.requirement.label);
  return {candidate,role,best,evidence,unknown};
}

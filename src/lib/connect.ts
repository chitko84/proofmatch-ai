import { candidates, roles } from './data.ts';
import { assessMatch } from './engine.ts';
import type { WorkMode } from './types.ts';

/** Fictional demonstration contacts. Do not connect real applicants without consent/privacy work. */
export type CandidateInterest = 'interested' | 'learn_more' | 'not_now';
export type InvitationReply = {
  interest: CandidateInterest;
  workMode: WorkMode | 'not_sure';
  note: string;
  repliedAt: string;
  source: 'passport' | 'telegram';
};
export type Invitation = {
  token: string;
  candidateId: string;
  roleId: string;
  createdAt: string;
  reply: InvitationReply | null;
};
export const CONNECT_LOCAL_KEY = 'proofmatch-connect-demo-v1';

export function checkCandidateRole(candidateId: unknown, roleId: unknown) {
  const candidate = candidates.find(c => c.id === candidateId);
  const role = roles.find(r => r.id === roleId);
  if (!candidate || !role) throw new Error('Please choose a sample person and an open job.');
  return { candidate, role };
}
export function validateInterest(input: unknown): CandidateInterest {
  if (input === 'interested' || input === 'learn_more' || input === 'not_now') return input;
  throw new Error('Please choose how you feel about the opportunity.');
}
export function validateWorkMode(input: unknown): InvitationReply['workMode'] {
  if (input === 'remote' || input === 'hybrid' || input === 'onsite' || input === 'not_sure') return input;
  throw new Error('Please choose a working style.');
}
export function validateCandidateReply(input: unknown, source: InvitationReply['source']): InvitationReply {
  if (!input || typeof input !== 'object') throw new Error('Please check your response.');
  const obj = input as Record<string, unknown>;
  if (typeof obj.note !== 'string' || obj.note.length > 450) throw new Error('Please use a shorter note.');
  return { interest: validateInterest(obj.interest), workMode: validateWorkMode(obj.workMode), note: obj.note.trim(), repliedAt: new Date().toISOString(), source };
}
export function validateInvitation(input: unknown): Invitation | null {
  if (!input || typeof input !== 'object') return null;
  const obj = input as Record<string, unknown>;
  try {
    checkCandidateRole(obj.candidateId, obj.roleId);
    if (typeof obj.token !== 'string' || !/^[A-Za-z0-9_-]{16,80}$/.test(obj.token)) return null;
    if (typeof obj.createdAt !== 'string' || !Number.isFinite(Date.parse(obj.createdAt))) return null;
    let reply: InvitationReply | null = null;
    if (obj.reply) {
      const r = obj.reply as Record<string, unknown>;
      const basic = validateCandidateReply(r, r.source === 'telegram' ? 'telegram' : 'passport');
      reply = { ...basic, repliedAt: typeof r.repliedAt === 'string' && !Number.isNaN(Date.parse(r.repliedAt)) ? r.repliedAt : basic.repliedAt };
    }
    return { token: obj.token, candidateId: obj.candidateId as string, roleId: obj.roleId as string, createdAt: obj.createdAt, reply };
  } catch { return null; }
}
export type InterviewQuestion = { id: string; title: string; question: string; why: string };
/** Clear, consistent sample interview questions derived from the actual job requirements and evidence. */
export function prepareInterviewQuestions(candidateId: string, roleId: string): InterviewQuestion[] {
  const { candidate, role } = checkCandidateRole(candidateId, roleId);
  const report = assessMatch(candidate, role);
  const missing = report.assessments.filter(a => a.support !== 'artifact');
  const documented = report.assessments.filter(a => a.support === 'artifact');
  const prompts: InterviewQuestion[] = missing.slice(0, 2).map((a, index) => ({
    id: `gap-${index}-${a.requirement.skillId}`,
    title: `Learn about ${a.requirement.label}`,
    question: `Can you tell us about a time you used ${a.requirement.label} in a project, or how you would approach a task involving it?`,
    why: 'We could not find a clear project example for this yet. This question gives the candidate a chance to explain.',
  }));
  if (documented.length) prompts.push({
    id: 'project-followup', title: 'Explore a project',
    question: `Your application mentions ${documented[0].requirement.label}. What was your own contribution, and what did you learn?`,
    why: 'A supplied project excerpt is useful context, but we still need to understand the person’s contribution.',
  });
  prompts.push({ id: 'expectations', title: 'Check what works for both sides',
    question: `This role is based in ${role.location} and offers ${role.acceptedModes.join(' or ')} working arrangements. Would that suit you, and what would you hope to learn here?`,
    why: 'A good match should work for the employer and the candidate.',
  });
  return prompts.slice(0, 4);
}

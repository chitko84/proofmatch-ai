/** Fictional practice dialogue, not messages from a real candidate or recruiter. */
import {candidates,roles} from './data.ts';
import type {MeetingSpeaker,DemoMeeting} from './liveroom.ts';

export type PracticeTopic={label:string;question:string};
export const PRACTICE_TOPICS:PracticeTopic[]=[
 {label:'Why this role?',question:'What interests you about this other open role?'},
 {label:'Work preferences',question:'Would hybrid working suit you, and what do you prefer?'},
 {label:'Project experience',question:'Could you share a recent project that relates to this job?'},
 {label:'Next steps',question:'What would you like to know about the next steps?'},
];
export function meetingPracticeReply(message:string,from:MeetingSpeaker,meeting:Pick<DemoMeeting,'candidateId'|'roleId'>):string {
 const q=message.toLowerCase();
 const person=candidates.find(c=>c.id===meeting.candidateId)||candidates[0];
 const role=roles.find(r=>r.id===meeting.roleId)||roles[0];
 if(from==='recruiter'){
  if(/hybrid|remote|on.site|work preference|working arrangement|work mode/.test(q))return `Thanks for asking. My sample preference is ${person.preferredModes.join(' or ')}. Could we discuss what a typical week looks like for the ${role.title} team?`;
  if(/project|experience|test|python|skill|portfolio|evidence/.test(q)){
   const excerpt=person.evidence.find(e=>e.kind==='artifact')?.excerpt;
   return excerpt?`One example I supplied was: “${excerpt}” I'd be happy to walk through the actual project and answer questions.`:'I could share a recent project or complete a short work sample to help you understand my skills.';
  }
  if(/salary|pay|budget|compensation/.test(q))return 'I would appreciate learning the salary range first. I would also like to understand the role and working arrangements before making a decision.';
  if(/why|interest|another|different|role|opportunity/.test(q))return `I am interested in learning about ${role.title}. It connects with my stated interest in ${person.interests[0]||'developing my skills'}. I would like to understand the day-to-day responsibilities.`;
  if(/next|question|interview|step|process/.test(q))return 'Thank you. Could you explain the next steps and whether there will be a short work sample or a conversation with the team?';
  return `Thanks for explaining. Could you share more about the ${role.title} position and what success in the first few months would look like?`;
 }
 if(/hybrid|remote|on.site|work|flexib/.test(q))return `This example ${role.title} role currently offers ${role.acceptedModes.join(' or ')} working. We can discuss the details and check whether it fits your preferences.`;
 if(/salary|pay|budget/.test(q))return 'Good question. We should confirm the approved salary range with HR before making any promises. I can record that as a follow-up.';
 if(/why|different|another|role|qa|interested/.test(q))return `We noticed relevant examples in your supplied projects for the open ${role.title} role. That is only a reason to start a conversation, not a job offer.`;
 if(/project|test|skill|interview|fairshot/.test(q))return 'We can review the project examples you shared, then offer an optional, job-related work sample if we need more evidence.';
 if(/next|when|decision|follow/.test(q))return 'After this conversation, HR can review your interest, clarify any missing information, and tell you the next step. You are not being automatically selected.';
 return 'Thanks for raising that. We can discuss your interests, the job requirements, and whether there is a good fit for both sides.';
}
export function practiceSummary(meeting:Pick<DemoMeeting,'candidateId'|'roleId'|'messages'|'scheduledLocal'>){
 const person=candidates.find(c=>c.id===meeting.candidateId)||candidates[0];
 const role=roles.find(r=>r.id===meeting.roleId)||roles[0];
 const discussed=meeting.messages.map(m=>m.text.toLowerCase()).join(' ');
 return {
  heading:`${person.alias} · ${role.title}`,
  topics:[discussed.match(/remote|hybrid|on.site|working/)?'Work arrangement discussed':'Work arrangement still to confirm',discussed.match(/project|python|test|experience|portfolio/)?'Project examples discussed':'Work examples still to discuss',discussed.match(/next|interview|step|follow/)?'Next steps discussed':'Next steps still to confirm'],
  action:'HR should confirm candidate interest, any unanswered questions, and the next appropriate human review step.',
 };
}

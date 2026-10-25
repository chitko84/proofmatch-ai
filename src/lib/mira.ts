import { candidates,roles } from './data.ts';
import { rankRoles } from './engine.ts';
export const MIRA_QUESTIONS = [
  'Which role has the most supporting evidence?',
  'Why might this person suit a different job?',
  'What should HR ask next?',
  'Do their work preferences match?',
];
/** Produce a trusted, minimal factual record for the assistant. Never use model output as hiring proof. */
export function miraContext(candidateId:string,focusRoleId?:string):string | null {
 const c=candidates.find(x=>x.id===candidateId);if(!c)return null;
 const summaries=rankRoles(c,roles).map(m=>{
  const r=roles.find(x=>x.id===m.roleId)!;
  return {role:r.title,appliedRole:m.roleId===c.appliedRoleId,coverageLabel:m.tier,coverage:Math.round(m.coverage*100),workArrangement:m.logistics,requirements:m.assessments.map(a=>({skill:a.requirement.label,status:a.support,source:a.evidence?.sourceLabel||'not supplied',excerpt:a.evidence?.excerpt||null})),clarificationQuestions:m.questions};
 });
 return JSON.stringify({candidate:c.alias,focusRole:roles.find(r=>r.id===focusRoleId)?.title||null,appliedRole:roles.find(r=>r.id===c.appliedRoleId)?.title,location:c.location,preferredModes:c.preferredModes,interests:c.interests,roles:summaries});
}
export function demoMiraAnswer(candidateId:string,question:string,focusRoleId?:string):string {
 const c=candidates.find(x=>x.id===candidateId);
 if(!c)return 'Please choose a fictional candidate to explore.';
 const ordered=rankRoles(c,roles);const m=ordered.find(x=>x.roleId===focusRoleId)||ordered[0],role=roles.find(r=>r.id===m.roleId)!;
 const supported=m.assessments.filter(x=>x.support==='artifact').map(x=>x.requirement.label);
 const uncertain=m.assessments.filter(x=>x.support!=='artifact').map(x=>x.requirement.label);
 const q=question.toLowerCase();
 if(/which role|best role|most supporting evidence|strongest role|strongest match/.test(q)){const top=ordered[0],topRole=roles.find(r=>r.id===top.roleId)!;return `In this fictional example, ${topRole.title} has the strongest documented coverage for ${c.alias}. The examples are candidate-supplied, not independently verified, and HR should review the sources before deciding next steps.`;}
 if(/question|ask|missing|check|unknown|clarif/.test(q))return `For ${c.alias}, I'd ask: ${m.questions[0]||'Can you share a recent example of your work?'} This will help clarify ${uncertain.slice(0,2).join(' and ')||'the supplied evidence'}.`;
 if(/preference|remote|onsite|hybrid|work mode/.test(q))return m.logistics==='compatible'?`${c.alias} has a stated work preference that overlaps with ${role.title}. Please confirm location, schedule and expectations directly.`:`${c.alias}'s preferred work arrangement does not overlap with ${role.title}. HR should ask before making a decision.`;
 if(/how.*(proofmatch|system|match)|how.*work|what.*(proofmatch|evidence|score)|explain.*(matching|evidence)/.test(q))return `ProofMatch compares ${c.alias}'s candidate-supplied project examples with the requirements of open jobs. For ${role.title}, the supplied examples support ${supported.slice(0,2).join(' and ')||'some of the requirements'}. Anything missing is shown as a question for HR, not an automatic rejection.`;
 if(/salary|pay|wage|compensation|budget/.test(q))return `Salary needs a direct discussion between the candidate and HR. Our fictional profile doesn't prove an agreed salary. Start by asking about the role's confirmed budget and the candidate's expectations.`;
 if(/meeting|schedule|telegram|invite|liveroom|interview/.test(q))return `If the recruiter wants to explore ${role.title}, they can prepare a meeting invitation in ProofMatch LiveRoom. The candidate can accept, decline or suggest another time before any conversation. This sample does not imply a real job offer.`;
 if(/fair|bias|safe|privacy|human|decision|hire/.test(q))return `For fairness, show the exact candidate-supplied evidence, ask for missing details when needed, and let a human recruiter review the decision. Matching evidence isn't proof of job performance, and no hiring decision should be automatic.`;
 if(/who are you|hello|hi mira|introduce yourself|what can you do/.test(q))return `Hi, I'm Mira, your ProofMatch guide. I can explain the sample matches, what evidence supports them, what's still missing, and useful questions for an HR discussion.`;
 const applied=roles.find(r=>r.id===c.appliedRoleId)!;
 if(/different|another|alternative|blindspot/.test(q)){
  const top=ordered[0],topRole=roles.find(r=>r.id===top.roleId)!;
  const appliedReport=ordered.find(x=>x.roleId===c.appliedRoleId)!;
  if(top.roleId!==c.appliedRoleId&&top.coverage>appliedReport.coverage){
   const supportedTop=top.assessments.filter(x=>x.support==='artifact').map(x=>x.requirement.label);
   return `${c.alias} applied for ${applied.title}, but ${topRole.title} has stronger supplied evidence in this example. The examples mention ${supportedTop.slice(0,3).join(', ')||'relevant work'}. This is a reason to investigate, not a hiring prediction.`;
  }
  return `In this fictional record, we don't have evidence that a different role is stronger than ${applied.title}. HR can still explore all three roles.`;
 }

 return `Based on the sample information, ${role.title} has ${focusRoleId?"the following documented evidence":"the strongest documented coverage"} for ${c.alias}. Examples mention ${supported.slice(0,3).join(', ')||'some relevant work'}. ${uncertain.length?`We still need to clarify ${uncertain.slice(0,2).join(' and ')}.`:'We would still need a real skills assessment.'} This is guidance for HR, not a hiring decision.`;
}

/** Fictional, browser-local workplace roleplay. Choice outcomes are scripted, never hiring evaluations. */
export type HrFollowUp={label:string;reply:string;outcome:string;good:boolean};
export type HrRoute={label:string;reply:string;prompt:string;followups:[HrFollowUp,HrFollowUp]};
export type HrScene={id:string;person:string;role:string;time:string;setting:string;opening:string;routes:[HrRoute,HrRoute,HrRoute]};
export type HrStoryResult={primary:number;followup:number;outcome:string;reply:string;good:boolean;at:string};
const end=(label:string,reply:string,outcome:string,good:boolean):HrFollowUp=>({label,reply,outcome,good});
const path=(label:string,reply:string,prompt:string,a:HrFollowUp,b:HrFollowUp):HrRoute=>({label,reply,prompt,followups:[a,b]});
export const HR_STORY_STORAGE_KEY='proofmatch-hr-manager-stories-v1';
export const HR_STORIES:Record<string,HrScene>={
 'hr-reception':{
  id:'hr-reception',person:'Maya Lim',role:'Front Desk Coordinator',time:'08:40 AM',setting:'Main lobby · Visitor arrivals',
  opening:'Morning, manager! A candidate has arrived thirty minutes early, and another visitor is asking for a private employee appointment. We have one quiet meeting room left. How should I welcome them?',
  routes:[
   path('Check the appointments and offer both guests a discreet waiting option.','That helps. I can confirm who is expected without announcing anyone’s private purpose.','The early candidate asks if you can tell them what the interview panel values.',end('Explain the interview format and role-related expectations.','Thank you. I will share the schedule and what to prepare, without giving anyone an unfair advantage.','Visitors feel welcome and candidate preparation stays fair.',true),end('Give them the panel’s confidential ratings sheet.','I cannot share internal scoring notes. We should protect the process.','The visitor remains supported, but the scoring sheet is withheld.',false)),
   path('Ask the early candidate to leave until the exact appointment time.','They look worried about the journey they made. We could give them a comfortable waiting option.','A desk colleague asks whether they can make a small exception.',end('Offer a seat and confirm the interview schedule.','They are relieved. I will escort them once the interviewer is ready.','The reception experience recovers through simple courtesy.',true),end('Refuse to speak until the appointment begins.','The visitor leaves without clarity, although we had an available waiting space.','The candidate experience suffers unnecessarily.',false)),
   path('Tell everyone why the employee visitor has come to HR.','I would rather keep that appointment private. People can hear us at the desk.','How should we handle the visitor’s identity and purpose instead?',end('Verify the appointment quietly and guide them to the private room.','Agreed. Only the colleagues who need the appointment details will see them.','The sensitive visit stays confidential.',true),end('Announce the purpose on the public waiting-room screen.','That would expose personal information. I will not post it.','The confidentiality risk is flagged and the plan needs correction.',false))
  ]
 },
 'hr-inbox':{
  id:'hr-inbox',person:'Aisha Rahman',role:'Head of People Operations',time:'09:00 AM',setting:'HR briefing desk · Morning priorities',
  opening:'Welcome to your shift. Two interviews, one urgent employee concern, and an awards proposal are on today’s board. We cannot treat them all as equally urgent. What is your plan?',
  routes:[
   path('Check deadlines and confidentiality, then assign time slots.','Good start. Let’s protect the private concern and notify the interview panel about their slots.','An interviewer unexpectedly reports a fifteen-minute delay.',end('Notify the candidate and provide an updated arrival time.','I will message them now. We can recover the schedule without leaving anyone in the dark.','Your workday begins with a clear, respectful plan.',true),end('Make the candidate wait without telling them.','That creates uncertainty. We should communicate the delay.','The candidate experiences unnecessary waiting.',false)),
   path('Cancel everything and focus only on the employee event.','The event matters, but we would abandon committed interviews and a sensitive concern.','The interviews are already on the calendar. How would you recover the day fairly?',end('Reschedule deliberately and notify everyone affected.','I can contact candidates and reserve time for the concern.','You recover a workable priority plan.',true),end('Let everyone discover cancellations themselves.','That would undermine trust in the team and in our hiring process.','The day remains disorganized.',false)),
   path('Send the employee’s private concern to the whole company.','That would expose a colleague’s personal situation. We need a smaller, confidential response.','Who should receive the concern?',end('Limit access to the HR staff responsible for resolving it.','That gives us accountability without exposing the colleague.','The concern is assigned confidentially.',true),end('Put the details on a public HR noticeboard.','I must decline that approach. The details do not belong in a public space.','A privacy risk is identified before publication.',false))
  ]
 },
 'hr-interview':{
  id:'hr-interview',person:'Alex Tan',role:'Operations candidate',time:'10:15 AM',setting:'Interview Suite A · Hiring conversation',
  opening:'Thanks for meeting me. In my last project I helped improve a handover process, but I am not sure how to prove the impact. I would love to tell you what I actually did.',
  routes:[
   path('Ask Alex for a concrete example, responsibilities and evidence.','I mapped delays with my teammates and prepared a new checklist. We piloted it for two weeks.','Alex has no formal performance figure. How do you respond?',end('Record the project example and mark the impact as unverified.','That feels fair. I can share the checklist with permission and explain my contribution.','The interview produces useful, appropriately qualified evidence.',true),end('Write “improved efficiency by 50%” without proof.','I never claimed that number. Please do not put it in my record.','An unsupported claim would distort the assessment.',false)),
   path('Ask whether Alex looks confident enough for the company.','I am nervous, but I can explain the actual process I handled.','Alex offers to walk you through the project.',end('Return to consistent role-specific questions.','I appreciate having a chance to show my work rather than my nerves.','You restore an evidence-based interview.',true),end('Reject Alex because of speaking style alone.','That would not tell you whether I can do the role.','The evaluation misses relevant job evidence.',false)),
   path('Promise the job immediately to put Alex at ease.','Thank you, but has the panel finished the selection process?','The recruiter asks how to clarify the decision status.',end('Explain the remaining review stages and expected communication.','That is helpful. I know what happens next without assuming a decision.','The candidate receives a transparent timeline.',true),end('Tell Alex the offer is final even though approvals are pending.','I would be making plans on an unconfirmed promise.','The conversation creates a misleading expectation.',false))
  ]
 },
 'hr-applicant':{
  id:'hr-applicant',person:'Noor Izzati',role:'Talent Acquisition Partner',time:'11:00 AM',setting:'Talent review desk · Alternative role discovery',
  opening:'A candidate applied for Frontend Developer, but the strongest documented work points toward QA Automation. We have a QA opening. What is the respectful next step?',
  routes:[
   path('Show the source evidence and invite the candidate to consider QA.','I can explain which testing projects align with the QA requirements, including the remaining gaps.','The candidate is interested but asks what will be shared.',end('Seek consent before sharing the CV with the QA team.','Agreed. The candidate can choose whether their evidence is reviewed for the other opening.','A consent-led alternative-role pathway opens.',true),end('Send the CV first and ask for permission afterwards.','We cannot retroactively make private sharing consensual.','The transfer is held for permission.',false)),
   path('Reject the candidate without checking other open roles.','But our QA position matches several documented examples. The candidate might appreciate the option.','The hiring manager asks whether a second look is worthwhile.',end('Review the relevant opening and explain the match transparently.','We can assess that evidence without claiming skills the candidate has not shown.','A missed-fit opportunity is recovered.',true),end('Close every application because Frontend was a weak fit.','That would overlook evidence for another real vacancy.','The candidate loses a relevant opportunity.',false)),
   path('Forward the résumé to external partners without asking.','The partner might be interested, but company connections and candidate consent matter.','What must happen before an external referral?',end('Verify employer connections and obtain candidate consent.','Yes. We will only initiate the referral if the permissions and connection are valid.','The potential referral remains compliant and candidate-led.',true),end('Send it to every company in the catalog.','That is excessive and outside the candidate’s permission.','The proposed mass sharing is blocked.',false))
  ]
 },
 'hr-employee':{
  id:'hr-employee',person:'Priya Nair',role:'Customer Support Specialist',time:'11:45 AM',setting:'Private employee lounge · Workplace support',
  opening:'Can we talk privately? My shift was changed again without notice. I have caring responsibilities, and I am worried about being treated differently if I speak up.',
  routes:[
   path('Listen privately and ask what outcome would help.','Thanks for listening. I would like advance notice and a predictable handover where possible.','Her manager says operational coverage is difficult this month.',end('Review the roster fairly and explore a documented adjustment.','I am happy to discuss realistic options without sharing personal details broadly.','An impartial, practical resolution process begins.',true),end('Promise she will never need to change a shift again.','I appreciate the thought, but that promise might not be possible.','An absolute promise creates unrealistic expectations.',false)),
   path('Call her manager into the room immediately without her agreement.','I was hoping to explain everything first. I am not comfortable with a confrontation right now.','Priya asks whether her information will remain private.',end('Clarify confidentiality limits and agree on the next discussion.','That helps me feel able to continue.','Trust is rebuilt before the issue escalates.',true),end('Repeat her personal situation to unrelated colleagues.','Please do not do that. My private circumstances are not general office news.','The employee’s confidentiality is put at risk.',false)),
   path('Tell her the team is too busy to handle the problem.','I understand it is busy, but this affects my ability to work. Is there another way to raise it?','What will you do with the concern now?',end('Record the issue and arrange a specific confidential follow-up.','Thank you. Knowing the concern has a next step makes a difference.','The concern enters a fair follow-up process.',true),end('Ignore the request and close the case.','I feel like nobody has heard me.','The concern remains unresolved.',false))
  ]
 },
 'hr-events':{
  id:'hr-events',person:'Farah Aziz',role:'Employee Engagement Lead',time:'01:15 PM',setting:'Events studio · Staff recognition',
  opening:'We have a small budget to celebrate the team. Some colleagues work evening shifts, and the venue we liked has steps at its entrance. How should we design the event?',
  routes:[
   path('Confirm budget, accessibility and shift coverage first.','Great. We can offer a hybrid or repeated session and find an accessible location.','The venue suggests a cheaper but inaccessible room.',end('Choose the accessible plan and adjust the format or budget.','That makes participation possible for more of our colleagues.','The event plan is inclusive and feasible.',true),end('Book the inaccessible room without alternatives.','Some colleagues would be excluded from the celebration.','The event risks excluding employees.',false)),
   path('Invite only the daytime team to save time.','That leaves out the evening crew who made the same contribution.','A night-shift colleague asks how their work will be acknowledged.',end('Add an equivalent recognition opportunity for other shifts.','Thank you. We can celebrate without requiring everyone to attend at one hour.','Recognition becomes fairer across shifts.',true),end('Tell them their schedule is their problem.','That would make a team celebration feel unfair.','Staff engagement suffers.',false)),
   path('Award prizes based on who is closest to management.','That may discourage the team. People want criteria tied to genuine work.','How should awards be decided instead?',end('Publish transparent criteria and include documented contributions.','Now everyone understands the basis for recognition.','The awards have defensible criteria.',true),end('Keep the criteria secret until the winners are announced.','That invites concerns about favoritism.','The awards lack transparency.',false))
  ]
 },
 'hr-training':{
  id:'hr-training',person:'Daniel Wong',role:'New Product Analyst',time:'02:00 PM',setting:'Learning zone · New-hire onboarding',
  opening:'I am starting next week. The team uses a reporting tool I have never used before. I am excited, but I do not want to slow everyone down.',
  routes:[
   path('Ask what Daniel knows and agree on an achievable learning plan.','I have used spreadsheets and basic dashboards. A guided task and mentor would really help.','The lead can spare only twenty minutes a day.',end('Set short practice tasks, a mentor check-in and clear milestones.','That gives me a way to improve without pretending I know everything.','A realistic onboarding pathway is created.',true),end('List Daniel as fully qualified in the tool immediately.','I would rather my profile reflect the skills I have actually demonstrated.','Training needs are incorrectly hidden.',false)),
   path('Tell Daniel to learn everything independently over the weekend.','I can study, but I also need to understand our actual workflows and expectations.','He asks whether the team offers documented examples.',end('Share safe examples and arrange a short orientation.','That makes the training feel relevant to the job.','Onboarding gets the guidance it needs.',true),end('Refuse to explain how company systems work.','That would make it harder to perform reliably.','The onboarding experience remains confusing.',false)),
   path('Give Daniel access to live confidential reports for practice.','I would not be comfortable experimenting with private employee or customer data.','Which environment should he train in?',end('Use anonymized practice data and least-privilege access.','Now I can learn without risking sensitive information.','Training proceeds with appropriate safeguards.',true),end('Tell him to download private files to his personal device.','That would create a data-handling risk.','The proposed training data is unsafe.',false))
  ]
 },
 'hr-awards':{
  id:'hr-awards',person:'Ravi Kumar',role:'Team Representative',time:'02:40 PM',setting:'Recognition hall · Team achievements',
  opening:'Our team is proud of this quarter’s work. One colleague quietly helped several new starters, but the nominations mostly mention the loudest presenters. How can recognition be more balanced?',
  routes:[
   path('Ask for documented contributions across different types of work.','We can include peer mentoring, process improvements and reliability, not only presentations.','A colleague asks whether quiet contributors can be nominated.',end('Allow evidence-backed peer nominations with consistent criteria.','That means good work can be seen regardless of visibility.','Recognition reflects a broader range of genuine contributions.',true),end('Let managers choose winners without any stated criteria.','People may not know how the decision was reached.','The awards become difficult to explain.',false)),
   path('Pick the best-known person to keep the ceremony simple.','The team might wonder why steady behind-the-scenes work does not count.','Someone brings an example of a mentor’s impact.',end('Review the example alongside the published award criteria.','The mentor’s work finally has a fair opportunity to be considered.','The recognition process improves.',true),end('Ignore all contributions outside the spotlight.','That sends the wrong message about teamwork.','Valuable work remains unseen.',false)),
   path('Let employees vote publicly on who they like most.','A popularity vote could discourage less visible teammates.','What should determine the final award?',end('Use clear, role-relevant criteria and reviewed nominations.','We can still invite feedback without replacing evidence.','The award reflects meaningful achievements.',true),end('Publish everyone’s private performance notes.','Those notes are not appropriate for public circulation.','Private performance information is exposed.',false))
  ]
 },
 'hr-wellbeing':{
  id:'hr-wellbeing',person:'Sofia Lee',role:'Service Team Lead',time:'03:05 PM',setting:'Wellbeing corner · Workload check-in',
  opening:'The team seems exhausted after a busy release. Two people are working late every night, and one has stopped attending lunch. I want to help without diagnosing anyone.',
  routes:[
   path('Ask about workload and support needs without assumptions.','That is exactly what I need. We can check schedules and ask employees what would help.','One colleague reports repeated overtime and a missed handover.',end('Review resourcing and agree on practical workload changes.','We can adjust the handover and check whether the new plan works.','A respectful workload action plan begins.',true),end('Assume the colleague has a specific medical condition.','We should not diagnose people from work patterns.','An inappropriate assumption enters the discussion.',false)),
   path('Demand that Sofia share everyone’s private health information.','I cannot provide medical details. I can describe the work patterns we have observed.','What information can HR use appropriately?',end('Use workload evidence and voluntary, confidential support channels.','That keeps the focus on practical, respectful workplace support.','The team receives support without unnecessary disclosures.',true),end('Circulate personal health rumors to management.','That would harm employee trust.','Private information is mishandled.',false)),
   path('Suggest a mandatory motivational event after office hours.','The team is already tired. More mandatory time might make things worse.','What alternative might actually reduce strain?',end('Ask the team, reduce pressure points and offer voluntary support.','Thank you. A change in workload would matter more than a forced event.','Wellbeing support addresses the underlying concern.',true),end('Require more unpaid time together.','That would add to the problem.','The proposed plan increases pressure.',false))
  ]
 },
 'hr-report':{
  id:'hr-report',person:'Marcus Ong',role:'People Analytics Specialist',time:'04:10 PM',setting:'Analytics room · Leadership update',
  opening:'The board wants to know how hiring and employee support went today. We have interviews completed, alternative-role discussions started and concerns still being reviewed. How should I present the numbers?',
  routes:[
   path('Separate confirmed actions from pending decisions and safeguards.','I can show interviews conducted, consent requests pending and issues under review.','A director asks for the number of confirmed hires.',end('Report only signed-off hires and explain the pending pipeline.','The figures remain trustworthy, even if the number is smaller.','Leadership receives a clear, evidence-based report.',true),end('Count every interview as a new employee.','That would confuse activity with an actual employment decision.','The dashboard exaggerates outcomes.',false)),
   path('Make all metrics green so the team looks successful.','That would be visually impressive but misleading. We need real status definitions.','How should an unresolved concern appear?',end('Mark it as in review with a responsible follow-up.','That gives leadership an accountable status without inventing completion.','The report becomes accurate and useful.',true),end('Mark it resolved because HR spoke to someone.','A conversation alone does not mean the problem is solved.','The report misstates case resolution.',false)),
   path('Include employees’ private case notes in the public dashboard.','We can communicate trends without publishing personal case details.','What is a privacy-safe alternative?',end('Use aggregate indicators and controlled access to sensitive records.','That gives useful insight while respecting employee privacy.','The report balances insight and confidentiality.',true),end('Upload the raw notes to the company homepage.','That would expose sensitive information unnecessarily.','The dashboard would violate privacy expectations.',false))
  ]
 },
 'hr-manager-office':{
  id:'hr-manager-office',person:'Ms. Tan',role:'Director of People',time:'04:45 PM',setting:'Manager office · Final decisions',
  opening:'You have handled a full HR shift. I want to understand what you learned—not just a list of perfect answers. Tell me what you will carry into tomorrow.',
  routes:[
   path('Review what was resolved, what needs follow-up and what evidence is missing.','That is the kind of judgement I expect. HR decisions need clear reasoning and honesty about what is not yet known.','What should the team prioritize tomorrow?',end('Confirm owners, deadlines and consent-sensitive handoffs.','Excellent. We can keep improving without overstating today’s progress.','The day closes with an accountable handover.',true),end('Treat every case as complete to avoid follow-ups.','That might hide an employee concern or candidate request.','Important work risks being forgotten.',false)),
   path('Say that every employee issue has already been solved.','Even good conversations do not always resolve difficult situations immediately.','How will you report the unresolved items?',end('Document pending actions and agree on check-in dates.','That gives affected people a real route to resolution.','The next workday has clear follow-ups.',true),end('Delete all unresolved items from the tracker.','That would remove accountability.','The case history becomes unreliable.',false)),
   path('Focus only on increasing the hiring numbers.','Hiring results matter, but so do fairness, candidate consent and employee wellbeing.','What would a balanced success measure include?',end('Track evidence-based decisions, candidate experience and employee support.','Good. That tells us whether our hiring process is both effective and responsible.','Leadership sees the broader value of HR work.',true),end('Ignore candidate consent and staff concerns.','Those are not optional considerations.','The plan misses core HR responsibilities.',false))
  ]
 }
};
export const getHrStory=(id:string):HrScene|undefined=>HR_STORIES[id];
export function safeHrResults(raw:unknown):Record<string,HrStoryResult>{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
 const valid:Record<string,HrStoryResult>={};
 for(const [id,value] of Object.entries(raw)){
  const story=getHrStory(id);
  if(!story||!value||typeof value!=='object')continue;
  const candidate=value as Partial<HrStoryResult>;
  const p=candidate.primary, f=candidate.followup;
  if(!Number.isInteger(p)||p===undefined||p<0||p>=story.routes.length||!Number.isInteger(f)||f===undefined||f<0||f>=2)continue;
  const end=story.routes[p].followups[f];
  valid[id]={primary:p,followup:f,outcome:end.outcome,reply:end.reply,good:end.good,at:typeof candidate.at==='string'?candidate.at:''};
 }
 return valid;
}

/** Small, deterministic callbacks make later stations react to earlier decisions. */
export function hrStoryContext(stationId:string,completed:Record<string,HrStoryResult>):string|null{
 const state=(id:string)=>completed[id]?.good;
 if(stationId==='hr-interview'&&'hr-reception' in completed)return state('hr-reception')
  ?'Earlier today, Maya from reception arranged a welcoming check-in for our visitor.'
  :'Reception flagged a candidate-experience concern. The interview is a chance to restore trust.';
 if(stationId==='hr-applicant'&&'hr-interview' in completed)return state('hr-interview')
  ?'The interview team recorded actual project evidence without inventing results. You can build on that approach.'
  :'The earlier interview left gaps in the documented evidence. Be especially careful about alternative-role claims.';
 if(stationId==='hr-training'&&'hr-inbox' in completed)return state('hr-inbox')
  ?'The morning briefing protected time for important work. Can onboarding receive the same care?'
  :'The morning schedule was difficult. A clear onboarding plan can help the team recover.';
 if(stationId==='hr-events'&&'hr-employee' in completed)return state('hr-employee')
  ?'A colleague raised a scheduling concern earlier. Please remember shift accessibility when you plan this event.'
  :'An employee scheduling concern is still sensitive. Avoid planning an event that makes it worse.';
 if(stationId==='hr-awards'&&'hr-events' in completed)return state('hr-events')
  ?'The events team worked toward inclusive participation. Recognition should be equally fair.'
  :'The event plan raised fairness concerns. This award decision is a chance to address them.';
 if(stationId==='hr-wellbeing'&&'hr-employee' in completed)return state('hr-employee')
  ?'The earlier employee support discussion emphasized private, practical help. Keep that approach here.'
  :'A private employee concern remains unresolved. Be especially thoughtful about confidentiality and workload.';
 if(stationId==='hr-report'){
  const notes:string[]=[];
  if('hr-interview' in completed)notes.push(state('hr-interview')?'interview evidence documented':'interview evidence needs review');
  if('hr-applicant' in completed)notes.push(state('hr-applicant')?'alternative-role permissions respected':'alternative-role sharing needs correction');
  if('hr-employee' in completed)notes.push(state('hr-employee')?'employee support follow-up started':'employee concern still needs action');
  return notes.length?`Your earlier cases matter to this report: ${notes.slice(0,3).join('; ')}.`:null;
 }
 if(stationId==='hr-manager-office'){
  if('hr-report' in completed)return state('hr-report')
   ?'Marcus has prepared a careful report from your decisions. The director now wants your final handover.'
   :'Marcus flagged reporting issues. You can still finish the day with an accurate, accountable handover.';
  if(Object.keys(completed).length>0)return `You have worked through ${Object.keys(completed).length} HR conversations today. Your choices shape what the director needs to hear.`;
 }
 return null;
}

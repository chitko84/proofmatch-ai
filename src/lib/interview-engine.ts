import type {PresentationContext,SavedDeck} from './interview-presentation.ts';
/** Career Experience: private, educational mock-interview practice. No hiring decisions. */
import {ROLE_CATALOG} from './career-catalog.ts';
export type CareerRole = string;
export type InterviewLevel = 'student' | 'junior' | 'experienced';
export type InterviewFocus = 'balanced' | 'technical' | 'behavioral';
export type InterviewStyle = 'supportive' | 'focused' | 'challenging';
export type QuestionCount = 4 | 6 | 8;
export type QuestionCategory = 'Introduction' | 'Role knowledge' | 'Experience' | 'Problem solving' | 'Collaboration' | 'Reflection' | 'Communication' | 'Scenario';
export type InterviewConfig = {
  role: CareerRole; level: InterviewLevel; focus: InterviewFocus; style: InterviewStyle;
  count: QuestionCount; profile: string; customTitle?: string; customSkills?: string;
};
export type PracticeQuestion = { id:string; category:QuestionCategory; question:string; context:string; suggestedSeconds:number };
export type PracticeFeedback = { summary:string; strength:string; improve:string; example:string; dimensions:{relevance:number; detail:number; structure:number}; source:'ai'|'structured'; };
export type PracticeTurn = { question:PracticeQuestion; answer:string; feedback:PracticeFeedback; answeredAt:string; skipped:boolean; presentation?:PresentationContext };
export type InterviewSession = { id:string; config:InterviewConfig; startedAt:string; updatedAt:string; completedAt?:string; turns:PracticeTurn[]; currentQuestion:PracticeQuestion|null; paused:boolean; elapsedSeconds:number; draftAnswer?:string; questionElapsedSeconds?:number; status:'active'|'completed'; presentation?:SavedDeck };
export const CAREER_ROLES:Record<CareerRole,{title:string;focus:string;skills:string[]}> = Object.fromEntries(ROLE_CATALOG.map(({id,title,focus,skills})=>[id,{title,focus,skills}]));
export function resolvedRole(config:InterviewConfig){
 if(config.role!=='custom')return CAREER_ROLES[config.role]||CAREER_ROLES.frontend;
 const title=(config.customTitle||'').trim().slice(0,90)||'Your chosen profession';
 const terms=(config.customSkills||'').split(',').map(s=>s.trim()).filter(Boolean).slice(0,4);
 const skills=[...terms,'professional communication','problem solving','teamwork','time management'].slice(0,4);
 return {title,focus:`effective work as a ${title}`,skills};
}
export const DEFAULT_INTERVIEW_CONFIG:InterviewConfig={role:'frontend',level:'student',focus:'balanced',style:'supportive',count:6,profile:''};
export const CATEGORY_PLAN:ReadonlyArray<QuestionCategory> = ['Introduction','Role knowledge','Experience','Problem solving','Collaboration','Reflection','Scenario','Communication'];
const formatList=(items:string[])=>items.slice(0,3).join(', ');
function roleSpecific(config:InterviewConfig,category:QuestionCategory):string{
 const role=resolvedRole(config); const s=role.skills;
 switch(category){
 case 'Introduction':return `Tell me about yourself and what interests you about becoming a ${role.title}.`;
 case 'Role knowledge':return `What does good ${role.focus} look like to you? Walk me through one of the tools or methods you would use.`;
 case 'Experience':return `Describe a project, course assignment, or experience where you used ${s[0]} or ${s[1]}. What was your personal contribution?`;
 case 'Problem solving':return `Imagine a task involving ${s[0]} is not going as expected. How would you investigate the problem, and what would you do first?`;
 case 'Collaboration':return `Tell me about a time you worked with another person on a difficult task. How did you handle different opinions?`;
 case 'Reflection':return `Which skill would you most like to strengthen for this ${role.title} role, and what steps would you take to improve it?`;
 case 'Scenario':return `A teammate asks you to deliver a solution involving ${s[2]} urgently, but some requirements are unclear. How would you respond?`;
 case 'Communication':return `How would you explain an important finding about ${s[3]} to a colleague who does not have your technical background?`;
 }
}
export function questionPlan(config:InterviewConfig):QuestionCategory[]{
 const all= config.focus==='technical'
  ? ['Introduction','Role knowledge','Problem solving','Experience','Scenario','Reflection','Communication','Collaboration']
  : config.focus==='behavioral'
  ? ['Introduction','Experience','Collaboration','Scenario','Reflection','Communication','Problem solving','Role knowledge']
  : [...CATEGORY_PLAN];
 return all.slice(0,config.count) as QuestionCategory[];
}
export function createQuestion(config:InterviewConfig,step:number):PracticeQuestion{
 const plan=questionPlan(config); const category=plan[step];
 if(!category)throw new Error('Question index out of range');
 const prefix=config.level==='student'?'You may draw on coursework, volunteering, personal projects, or part-time work. ':config.level==='experienced'&&category==='Experience'?'Use a professional example with a clear outcome. ':'';
 const tone=config.style==='supportive'?'Take your time. ':config.style==='challenging'?'Please give a precise, concrete answer. ':'';
 const skillFromProfile=resolvedRole(config).skills.find(skill=>config.profile.toLowerCase().includes(skill.toLowerCase()));
 const personalized=skillFromProfile&&category==='Experience'?` You can refer to ${skillFromProfile} if relevant.`:'';
 return {id:`${config.role}-${config.focus}-${step+1}`,category,question:tone+prefix+roleSpecific(config,category)+personalized,context:category==='Introduction'?'Open with a clear overview.': category==='Experience'?'Try a situation, action, result structure.':'Provide a concrete example and explain your reasoning.',suggestedSeconds:category==='Introduction'?90:120};
}
const tokenize=(text:string)=>text.toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
const specifics=/\b(for example|for instance|such as|specifically|when i|i built|i created|i tested|i fixed|i used|our team|my role|the result|we achieved|i learned|i measured|because|therefore|first|then|finally|after|before|during|as a result|%|percent)\b/i;
const sequence=/\b(first|next|then|after|finally|therefore|because|result|outcome|learned|situation|action)\b/gi;
/** Transparent practice writing heuristics, not an assessment of competence or hiring suitability. */
export function structuredFeedback(question:PracticeQuestion,answer:string):PracticeFeedback{
 const words=tokenize(answer).length; const hasExample=specifics.test(answer); const steps=(answer.match(sequence)||[]).length;
 const relevantTokens=tokenize(question.question).filter(word=>word.length>5&& !['yourself','describe','explain','about','would','could','where','which','their','someone','becoming','interests','personal'].includes(word));
 const common=[...new Set(relevantTokens)].filter(w=>answer.toLowerCase().includes(w)).length;
 const relevance=Math.max(1,Math.min(4,1+(common>0?1:0)+(words>=24?1:0)+(words>=65?1:0)));
 const detail=Math.max(1,Math.min(4,1+(words>=30?1:0)+(hasExample?1:0)+(words>=90?1:0)));
 const structure=Math.max(1,Math.min(4,1+(words>=24?1:0)+(steps>0?1:0)+(steps>=2?1:0)));
 if(words<5)return {summary:'There is not enough detail yet for meaningful practice feedback.',strength:'You have started answering. You can build from here.',improve:'Try a complete answer explaining what you did, why you did it and what happened.',example:'A useful structure: situation → your action → result → what you learned.',dimensions:{relevance:1,detail:1,structure:1},source:'structured'};
 return {summary:words>=60?'A substantial answer. Refine the evidence and takeaway.':'You have a starting point. Make your answer easier to evaluate with a specific example.',strength:hasExample?'Your answer contains language that indicates a specific action, example or reason.':'You responded to the question and have a foundation to build on.',improve:!hasExample?'Add a concrete personal example, including what you personally did.':words<60?'Expand on the outcome and what you learned.':'Make the result measurable where possible and remove less relevant details.',example:'Use STAR: Situation (context), Task (responsibility), Action (what you did), Result (what changed).',dimensions:{relevance,detail,structure},source:'structured'};
}
export function skippedFeedback():PracticeFeedback{return {summary:'Question skipped.',strength:'You can revisit this type of question in another practice session.',improve:'Prepare one concrete example relevant to the question.',example:'Try the STAR structure to organize a future answer.',dimensions:{relevance:0,detail:0,structure:0},source:'structured'};}
export function isValidConfig(value:unknown):value is InterviewConfig{
 if(!value||typeof value!=='object')return false;
 const c=value as Partial<InterviewConfig>;
 return typeof c.role==='string'&&(Object.hasOwn(CAREER_ROLES,c.role)||(c.role==='custom'&&typeof c.customTitle==='string'&&c.customTitle.trim().length>=2&&c.customTitle.length<=90&&(!c.customSkills||(typeof c.customSkills==='string'&&c.customSkills.length<=220))))&&['student','junior','experienced'].includes(c.level||'')&&['balanced','technical','behavioral'].includes(c.focus||'')&&['supportive','focused','challenging'].includes(c.style||'')&&[4,6,8].includes(c.count||0)&&typeof c.profile==='string'&&c.profile.length<=1600;
}
export function safeTurn(value:unknown):value is PracticeTurn{
 if(!value||typeof value!=='object')return false;const t=value as Partial<PracticeTurn>;
 return !!t.question&&typeof t.question.question==='string'&&t.question.question.length<=650&&typeof t.answer==='string'&&t.answer.length<=5000&&typeof t.answeredAt==='string'&&typeof t.skipped==='boolean';
}
export function reportFor(session:InterviewSession){
 const answered=session.turns.filter(t=>!t.skipped);
 const dimensions=(['relevance','detail','structure'] as const).map(key=>({key,value:answered.length?Math.round(answered.reduce((sum,t)=>sum+t.feedback.dimensions[key],0)/answered.length*25):0}));
 const duration=Math.max(0,Math.round(session.elapsedSeconds/60));
 const strengths=answered.filter(t=>t.feedback.dimensions.detail>=3).length;
 return {answered:answered.length,skipped:session.turns.length-answered.length,dimensions,durationMinutes:duration,examples:strengths,suggestedNext:dimensions.length?dimensions.reduce((low,d)=>d.value<low.value?d:low).key:'detail'};
}
export function sessionText(session:InterviewSession):string{
 const r=reportFor(session);
 return [`PROOFMATCH AI | MOCK INTERVIEW PRACTICE`,`${resolvedRole(session.config).title} · ${session.config.level} · ${session.config.focus}`,`Started: ${new Date(session.startedAt).toLocaleString()}`,`Completed: ${session.completedAt?new Date(session.completedAt).toLocaleString():'In progress'}`,`Answered: ${r.answered} / ${session.turns.length}`,`Practice feedback is educational and is not a hiring assessment.`,...session.turns.flatMap((t,i)=>['',`QUESTION ${i+1} — ${t.question.category}`,t.question.question,`ANSWER: ${t.skipped?'[Skipped]':t.answer}`, ...(t.presentation?[`PRESENTED: ${t.presentation.deckTitle} — slide ${t.presentation.slideNumber}/${t.presentation.slideCount} — ${t.presentation.slideTitle}`,`PRESENTER NOTES: ${t.presentation.presenterNotes}`]:[]),`FEEDBACK: ${t.feedback.summary}`,`WHAT WENT WELL: ${t.feedback.strength}`,`TRY NEXT: ${t.feedback.improve}`])].join('\n');
}

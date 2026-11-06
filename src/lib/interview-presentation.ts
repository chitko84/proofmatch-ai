/** Presentation metadata and safety utilities for the interview practice room.
 * No uploaded binary file is saved in session history or transmitted to Gemini. */
export type DeckKind='pdf'|'pptx'|'images'|'native';
export type PresentationSlide={id:string;title:string;body:string;notes:string};
export type SavedDeck={name:string;kind:DeckKind;slides:PresentationSlide[];activeIndex:number;visited:number[]};
export type PresentationContext={deckTitle:string;slideNumber:number;slideCount:number;slideTitle:string;slideText:string;presenterNotes:string};
export const MAX_SLIDES=60;
export const MAX_DECK_SIZE=10*1024*1024;
/** Profession-neutral practice presentation that stays editable and is persisted with the session. */
export function sampleInterviewDeck():SavedDeck {
 const slides:PresentationSlide[]=[
  {id:'slide-1',title:'My professional introduction',body:'Profile: Business Operations / Analyst\nStrengths: analysis, communication, continuous improvement\nObjective: help teams make clearer decisions with evidence.',notes:'Introduce yourself and explain the role you are seeking.'},
  {id:'slide-2',title:'The business challenge',body:'A team needed faster reporting and fewer manual errors.\nData lived in several spreadsheets, making review time-consuming.\nMy responsibility was to identify the gaps and propose an achievable improvement.',notes:'Describe the initial problem, stakeholders and what success would mean.'},
  {id:'slide-3',title:'My approach',body:'1. Interview stakeholders and map the workflow.\n2. Clean a small, representative dataset.\n3. Design a dashboard with clear measures.\n4. Test the results with end users and revise.',notes:'Explain your personal contribution and why you chose these steps.'},
  {id:'slide-4',title:'Results and lessons learned',body:'Example practice outcome: reporting time reduced from 4 hours to 2.5 hours.\nQuality improved through clearer validation checks.\nLesson: collaborate early and document assumptions.',notes:'These are illustrative figures for presentation practice; replace with evidence from your own work.'},
  {id:'slide-5',title:'Why I fit this role',body:'Evidence: structured problem solving, clear stakeholder communication and practical reporting.\nNext step: deepen analytical skills and contribute to collaborative projects.\nThank you. I welcome your questions.',notes:'Connect your experience to the actual job requirements and invite the interviewer to ask a question.'}
 ];
 return {name:'Professional Portfolio Presentation',kind:'native',slides,activeIndex:0,visited:[0]};
}
export const safeLabel=(s:string,n=180)=>s.replace(/[\u0000-\u001f\u007f]/g,' ').replace(/\s+/g,' ').trim().slice(0,n);
export function isPresentationContext(value:unknown):value is PresentationContext {
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 const x=value as Partial<PresentationContext>;
 return typeof x.deckTitle==='string'&&x.deckTitle.length<=180&&typeof x.slideTitle==='string'&&x.slideTitle.length<=180&&
 typeof x.slideText==='string'&&x.slideText.length<=1800&&typeof x.presenterNotes==='string'&&x.presenterNotes.length<=1200&&
 Number.isInteger(x.slideNumber)&&Number.isInteger(x.slideCount)&&(x.slideCount as number)>=1&&(x.slideCount as number)<=MAX_SLIDES&&(x.slideNumber as number)>=1&&(x.slideNumber as number)<=(x.slideCount as number);
}
export function contextFromDeck(deck:SavedDeck):PresentationContext|null {
 const slide=deck.slides[deck.activeIndex];if(!slide)return null;
 return {deckTitle:safeLabel(deck.name),slideNumber:deck.activeIndex+1,slideCount:deck.slides.length,slideTitle:safeLabel(slide.title),slideText:slide.body.slice(0,1800),presenterNotes:slide.notes.slice(0,1200)};
}
export function slideQuestion(context:PresentationContext):string {
 const subject=context.slideTitle&&context.slideTitle!==`Slide ${context.slideNumber}`?` on “${context.slideTitle}”`:'';
 return `Let's discuss slide ${context.slideNumber}${subject}. What is its main message, which evidence supports it, and how does it relate to the role you are interviewing for?`;
}
/** A portable record; visual binary URLs are deliberately excluded. */
export function sanitizedDeck(deck:SavedDeck):SavedDeck {
 return {name:safeLabel(deck.name),kind:deck.kind,activeIndex:Math.max(0,Math.min(deck.activeIndex,deck.slides.length-1)),visited:deck.visited.filter(n=>Number.isInteger(n)&&n>=0&&n<deck.slides.length).slice(0,MAX_SLIDES),slides:deck.slides.slice(0,MAX_SLIDES).map((s,i)=>({id:`slide-${i+1}`,title:safeLabel(s.title),body:s.body.slice(0,1800),notes:s.notes.slice(0,1200)}))};
}
/** Basic PDF page estimate for navigating via the browser's native PDF viewer.
 * Browser PDF viewers may expose a different page count for complex PDFs. */
export function pdfPageCount(bytes:Uint8Array):number {
 const raw=new TextDecoder('latin1').decode(bytes);
 const matches=raw.match(/\/Type\s*\/Page\b/g);
 if(matches?.length)return Math.min(MAX_SLIDES,matches.length);
 const counts=[...raw.matchAll(/\/Count\s+(\d+)/g)].map(m=>Number(m[1])).filter(n=>n>0&&n<=MAX_SLIDES);
 return counts.length?Math.max(...counts):1;
}

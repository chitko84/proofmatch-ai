/** ProofMatch LiveRoom — explicitly fictional, browser-local judging workflow. */
export type MeetingStatus = 'awaiting' | 'accepted' | 'reschedule_requested' | 'declined';
export type MeetingSpeaker = 'recruiter' | 'candidate';
export type MeetingMessage = { id:string; speaker:MeetingSpeaker; text:string; at:string };
export type DemoMeeting = {
 id:string; candidateId:string; roleId:string; scheduledLocal:string; durationMinutes:number;
 status:MeetingStatus; candidateNote:string; requestedLocal:string|null;
 createdAt:string; updatedAt:string; messages:MeetingMessage[]; isFictional:true;
};
export const LIVE_ROOM_STORE_KEY = 'proofmatch-liveroom-demo-v1';
export const LIVE_ROOM_EVENT = 'proofmatch-liveroom-updated';
const MAX_MEETINGS = 40;
const pad = (n:number)=>String(n).padStart(2,'0');
export function defaultMeetingTime(now=new Date()):string {
 const d=new Date(now.getTime()+48*60*60*1000);
 d.setHours(15,0,0,0);
 return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
export function isValidMeetingTime(value:string):boolean {
 if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value))return false;
 const parsed=new Date(value);
 return !Number.isNaN(parsed.getTime()) && parsed.getFullYear()===Number(value.slice(0,4)) && parsed.getMonth()+1===Number(value.slice(5,7)) && parsed.getDate()===Number(value.slice(8,10)) && parsed.getHours()===Number(value.slice(11,13)) && parsed.getMinutes()===Number(value.slice(14,16));
}
export function humanMeetingTime(value:string):string {
 if(!isValidMeetingTime(value))return 'Time to be arranged';
 return new Intl.DateTimeFormat('en-MY',{weekday:'short',day:'numeric',month:'short',year:'numeric',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(value));
}
export function buildMeeting(args:{candidateId:string;roleId:string;scheduledLocal:string;durationMinutes:number}, id:string, now=new Date()):DemoMeeting {
 if(!/^[a-zA-Z0-9_-]{2,20}$/.test(args.candidateId) || !/^[a-zA-Z0-9_-]{2,20}$/.test(args.roleId))throw Error('Choose a valid candidate and open job.');
 if(!isValidMeetingTime(args.scheduledLocal))throw Error('Please choose a valid date and time.');
 if(![15,20,30,45,60].includes(args.durationMinutes))throw Error('Choose a meeting duration.');
 if(!/^[a-zA-Z0-9_-]{8,90}$/.test(id))throw Error('Could not create an invitation link.');
 const stamp=now.toISOString();
 return {id,candidateId:args.candidateId,roleId:args.roleId,scheduledLocal:args.scheduledLocal,durationMinutes:args.durationMinutes,status:'awaiting',candidateNote:'',requestedLocal:null,createdAt:stamp,updatedAt:stamp,messages:[],isFictional:true};
}
export function answerMeeting(meeting:DemoMeeting,status:'accepted'|'declined'|'reschedule_requested',note:string,requestedLocal:string|null=null,now=new Date()):DemoMeeting {
 if(status==='reschedule_requested' && (!requestedLocal || !isValidMeetingTime(requestedLocal)))throw Error('Choose the date and time you would prefer.');
 return {...meeting,status,candidateNote:note.trim().slice(0,500),requestedLocal:status==='reschedule_requested'?requestedLocal:null,updatedAt:now.toISOString()};
}
export function confirmSuggestedTime(meeting:DemoMeeting,now=new Date()):DemoMeeting {
 if(meeting.status!=='reschedule_requested'||!meeting.requestedLocal||!isValidMeetingTime(meeting.requestedLocal))throw Error('There is no new time to confirm.');
 return {...meeting,scheduledLocal:meeting.requestedLocal,status:'accepted',requestedLocal:null,updatedAt:now.toISOString()};
}
export function addRoomMessage(meeting:DemoMeeting,speaker:MeetingSpeaker,text:string,id:string,now=new Date()):DemoMeeting {
 const body=text.trim();
 if(!body||body.length>600)throw Error('Write a message of up to 600 characters.');
 if(meeting.status!=='accepted')throw Error('The candidate must accept the invitation before the discussion.');
 return {...meeting,messages:[...meeting.messages,{id,speaker,text:body,at:now.toISOString()}].slice(-80),updatedAt:now.toISOString()};
}
export function isMeetingShape(m:unknown):m is DemoMeeting {
 if(!m||typeof m!=='object')return false;
 const x=m as Partial<DemoMeeting>;
 return typeof x.id==='string'&&/^[a-zA-Z0-9_-]{8,90}$/.test(x.id)&&typeof x.candidateId==='string'&&typeof x.roleId==='string'&&isValidMeetingTime(String(x.scheduledLocal))&&['awaiting','accepted','reschedule_requested','declined'].includes(String(x.status))&&Array.isArray(x.messages)&&x.messages.length<=80;
}
export function readMeetings():DemoMeeting[] {
 if(typeof window==='undefined')return [];
 try{const raw=window.localStorage.getItem(LIVE_ROOM_STORE_KEY);if(!raw)return [];const data=JSON.parse(raw) as unknown;return Array.isArray(data)?data.filter(isMeetingShape).slice(-MAX_MEETINGS):[];}catch{return []}
}
export function saveMeeting(record:DemoMeeting):boolean {
 if(typeof window==='undefined'||!isMeetingShape(record))return false;
 try{const current=readMeetings().filter(x=>x.id!==record.id);window.localStorage.setItem(LIVE_ROOM_STORE_KEY,JSON.stringify([...current,record].slice(-MAX_MEETINGS)));window.dispatchEvent(new Event(LIVE_ROOM_EVENT));return true;}catch{return false}
}
export function readMeeting(id:string):DemoMeeting|null {return readMeetings().find(x=>x.id===id)||null}
export function newMeetingId():string {
 if(typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function')return `meet-${crypto.randomUUID().replaceAll('-','')}`;
 return `meet-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,15)}`;
}
export function makeCalendarFile(m:DemoMeeting,title:string):string {
 if(!isValidMeetingTime(m.scheduledLocal))throw Error('Meeting time is invalid.');
 const start=new Date(m.scheduledLocal);const end=new Date(start.getTime()+m.durationMinutes*60000);
 const asUtc=(d:Date)=>`${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
 const clean=(v:string)=>v.replace(/[\\,;]/g,'\\$&').replace(/\r?\n/g,'\\n');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ProofMatch//LiveRoom Demo//EN','BEGIN:VEVENT',`UID:${m.id}@proofmatch.example`,`DTSTAMP:${asUtc(new Date(m.createdAt))}`,`DTSTART:${asUtc(start)}`,`DTEND:${asUtc(end)}`,`SUMMARY:${clean(title)}`,'DESCRIPTION:Fictional ProofMatch demonstration invitation. Not a real confirmed interview.','END:VEVENT','END:VCALENDAR'].join('\r\n');
}
export function createReadyDemoMeeting(now=new Date()):DemoMeeting {
 const scheduledLocal=defaultMeetingTime(now);
 let meeting=buildMeeting({candidateId:'C01',roleId:'qa',scheduledLocal,durationMinutes:20},'meet-proofmatch-showcase',now);
 meeting=answerMeeting(meeting,'accepted','Demo candidate: I would like to learn more about the QA team and hybrid working.',null,now);
 return addRoomMessage(meeting,'recruiter','Hi! Thanks for exploring the QA Automation Engineer role. What would you like to know?', 'sample-hr-1',now);
}

/**
 * Portable demo invitation: embeds only public fictional job details so a different
 * device can display the invitation without needing access to this browser's storage.
 * Responses on the other device remain local until real shared storage is configured.
 */
export function portableDemoInvitation(origin:string,record:DemoMeeting):string {
 const url=new URL(`/invite/${encodeURIComponent(record.id)}`,new URL(origin).origin);
 url.searchParams.set('candidate',record.candidateId);
 url.searchParams.set('role',record.roleId);
 url.searchParams.set('at',record.scheduledLocal);
 url.searchParams.set('mins',String(record.durationMinutes));
 url.searchParams.set('demo','1');
 return url.toString();
}

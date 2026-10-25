import {sharedRedisCommand} from './connect-store.ts';
import {isMeetingShape,type DemoMeeting} from './liveroom.ts';
const chatKey='proofmatch:telegram:paired-demo-recipient';
const meetingKey=(id:string)=>`proofmatch:liveroom:shared:${id}`;
export type SharedMeeting={meeting:DemoMeeting;ticket:string};
export async function saveDemoRecipient(chatId:number) {
 if(!Number.isSafeInteger(chatId)||chatId<=0)throw Error('Invalid private Telegram chat.');
 await sharedRedisCommand(['SET',chatKey,String(chatId),'EX',86400*30]);
}
export async function getDemoRecipient():Promise<number|null> {
 const saved=await sharedRedisCommand(['GET',chatKey]);
 const value=typeof saved==='string'?Number(saved):NaN;
 return Number.isSafeInteger(value)&&value>0?value:null;
}
export async function saveSharedMeeting(meeting:SharedMeeting) {
 if(!isMeetingShape(meeting.meeting)||!/^[a-zA-Z0-9_-]{24,90}$/.test(meeting.ticket))throw Error('Invalid meeting data.');
 await sharedRedisCommand(['SET',meetingKey(meeting.meeting.id),JSON.stringify(meeting),'EX',86400*7]);
}
export async function getSharedMeeting(id:string):Promise<SharedMeeting|null> {
 if(!/^[a-zA-Z0-9_-]{8,90}$/.test(id))return null;
 const value=await sharedRedisCommand(['GET',meetingKey(id)]);
 if(typeof value!=='string')return null;
 try{const obj=JSON.parse(value) as SharedMeeting;
   return obj&&isMeetingShape(obj.meeting)&&obj.meeting.id===id&&typeof obj.ticket==='string'&&/^[a-zA-Z0-9_-]{24,90}$/.test(obj.ticket)?obj:null;
 }catch{return null}
}

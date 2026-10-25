import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMeeting,answerMeeting,saveMeeting,readMeeting,readMeetings,addRoomMessage,LIVE_ROOM_STORE_KEY} from '../src/lib/liveroom.ts';

test('browser-only recruiter and candidate views share the same invitation and chat record',()=>{
 const values=new Map<string,string>();
 const original=Reflect.get(globalThis,'window');
 const listeners:string[]=[];
 Reflect.set(globalThis,'window',{
  localStorage:{getItem:(key:string)=>values.get(key)||null,setItem:(key:string,value:string)=>{values.set(key,value)}},
  dispatchEvent:(event:Event)=>{listeners.push(event.type)}
 });
 try{
  const a=buildMeeting({candidateId:'C01',roleId:'qa',scheduledLocal:'2026-10-29T15:00',durationMinutes:20},'meet-same-browser-check');
  assert.equal(saveMeeting(a),true);
  assert.equal(readMeetings().length,1);
  assert.equal(readMeeting(a.id)?.status,'awaiting');
  const b=answerMeeting(readMeeting(a.id)!, 'accepted', 'Demo candidate accepts');
  assert.equal(saveMeeting(b),true);
  assert.equal(readMeeting(a.id)?.status,'accepted');
  const c=addRoomMessage(readMeeting(a.id)!,'recruiter','Hello from recruiter','msg-hr-01');
  assert.equal(saveMeeting(c),true);
  const d=addRoomMessage(readMeeting(a.id)!,'candidate','Hello from candidate','msg-person-01');
  assert.equal(saveMeeting(d),true);
  assert.deepEqual(readMeeting(a.id)?.messages.map(x=>x.text),['Hello from recruiter','Hello from candidate']);
  assert.ok(values.has(LIVE_ROOM_STORE_KEY));
  assert.equal(listeners.length,4);
 } finally {if(original===undefined)Reflect.deleteProperty(globalThis,'window');else Reflect.set(globalThis,'window',original)}
});

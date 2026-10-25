import test from 'node:test';
import assert from 'node:assert/strict';
import {buildMeeting,answerMeeting,confirmSuggestedTime,addRoomMessage,defaultMeetingTime,humanMeetingTime,makeCalendarFile,createReadyDemoMeeting,isValidMeetingTime,portableDemoInvitation} from '../src/lib/liveroom.ts';
const clock=new Date('2026-10-24T07:00:00Z');
const meeting=buildMeeting({candidateId:'C01',roleId:'qa',scheduledLocal:'2026-10-27T15:00',durationMinutes:20},'meet-example-00000001',clock);
test('meeting scheduling captures a valid candidate, job, time and duration',()=>{assert.equal(meeting.status,'awaiting');assert.equal(meeting.durationMinutes,20);assert.equal(meeting.candidateId,'C01');assert.match(humanMeetingTime(meeting.scheduledLocal),/27/)});
test('invalid meeting time is rejected',()=>{assert.equal(isValidMeetingTime('2026-02-30T10:00'),false);assert.throws(()=>buildMeeting({candidateId:'C01',roleId:'qa',scheduledLocal:'no',durationMinutes:20},'meet-example-00000001'));});
test('candidate can accept an invitation with note',()=>{const updated=answerMeeting(meeting,'accepted','I prefer hybrid.');assert.equal(updated.status,'accepted');assert.equal(updated.candidateNote,'I prefer hybrid.');});
test('candidate can decline',()=>{const updated=answerMeeting(meeting,'declined','Not available');assert.equal(updated.status,'declined')});
test('candidate can request another time and HR can confirm',()=>{const requested=answerMeeting(meeting,'reschedule_requested','Please choose another date','2026-10-28T16:30');assert.equal(requested.requestedLocal,'2026-10-28T16:30');const confirmed=confirmSuggestedTime(requested);assert.equal(confirmed.scheduledLocal,'2026-10-28T16:30');assert.equal(confirmed.status,'accepted')});
test('a meeting cannot be entered for chat before acceptance',()=>assert.throws(()=>addRoomMessage(meeting,'candidate','Hello','msg-01')));
test('two-way room messages are saved in order',()=>{const accepted=answerMeeting(meeting,'accepted','');const a=addRoomMessage(accepted,'recruiter','Welcome','msg-01');const b=addRoomMessage(a,'candidate','Can we discuss hybrid work?','msg-02');assert.deepEqual(b.messages.map(m=>m.speaker),['recruiter','candidate']);});
test('empty and oversized messages are blocked',()=>{const accepted=answerMeeting(meeting,'accepted','');assert.throws(()=>addRoomMessage(accepted,'candidate',' ','msg-1'));assert.throws(()=>addRoomMessage(accepted,'candidate','A'.repeat(601),'msg-1'))});
test('calendar file contains a real ICS event and demo disclaimer',()=>{const ics=makeCalendarFile(meeting,'QA role discussion');assert.match(ics,/BEGIN:VEVENT/);assert.match(ics,/DTSTART:/);assert.match(ics,/Fictional/)});
test('ready-made scenario has a real saved conversation starter',()=>{const sample=createReadyDemoMeeting(clock);assert.equal(sample.status,'accepted');assert.equal(sample.messages.length,1);assert.equal(sample.isFictional,true)});
test('default meeting date starts two days in the future',()=>{const result=defaultMeetingTime(new Date('2026-10-24T10:00:00'));assert.match(result,/2026-10-26T15:00/)});

test('meeting IDs can be embedded in accepted scan codes',async()=>{const {parseInvitationQr}=await import('../src/lib/qr-scan.ts');const scanned=parseInvitationQr('https://proofmatch.example/invite/meet-example-00000001','https://proofmatch.example');assert.equal(scanned.mode,'meeting');assert.equal(scanned.url,'https://proofmatch.example/invite/meet-example-00000001');assert.throws(()=>parseInvitationQr('https://unsafe.example/invite/meet-example-00000001','https://proofmatch.example'))});

test('portable QR invitation carries enough fictional data to display on another device',async()=>{
 const url=portableDemoInvitation('https://proofmatch.example',meeting);
 const {parseInvitationQr}=await import('../src/lib/qr-scan.ts');
 const parsed=parseInvitationQr(url,'https://proofmatch.example');
 assert.equal(new URL(parsed.url).pathname,new URL(url).pathname);
 assert.match(parsed.url,/candidate=C01/);
 assert.match(parsed.url,/role=qa/);
 assert.match(parsed.url,/mins=20/);
});

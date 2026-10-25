import test from 'node:test';
import assert from 'node:assert/strict';
import {meetingPracticeReply,PRACTICE_TOPICS,practiceSummary} from '../src/lib/meeting-simulation.ts';
import {addRoomMessage,createReadyDemoMeeting} from '../src/lib/liveroom.ts';
import {demoMiraAnswer} from '../src/lib/mira.ts';

test('meeting practice responds to a real fictional candidate and selected role',()=>{
 const m=createReadyDemoMeeting();
 const message=meetingPracticeReply('Can you share your recent testing project?','recruiter',m);
 assert.match(message,/pytest|Python|fixture|test suite/i);
 assert.match(message,/supplied|walk through/i);
 assert.doesNotMatch(message,/guaranteed|hired|verified skills/i);
});
test('meeting practice discusses the candidate preference rather than inventing eligibility',()=>{
 const meeting=createReadyDemoMeeting();
 assert.match(meetingPracticeReply('Is hybrid work possible?','recruiter',meeting),/hybrid/);
 assert.match(meetingPracticeReply('What salary is offered?','candidate',meeting),/confirm|HR/i);
});
test('a guided discussion can be recorded and summarized',()=>{
 const m=createReadyDemoMeeting();
 let current=m;
 for(const item of PRACTICE_TOPICS.slice(0,3)){
  current=addRoomMessage(current,'recruiter',item.question,`hr-${item.label}`);
  current=addRoomMessage(current,'candidate',meetingPracticeReply(item.question,'recruiter',current),`c-${item.label}`);
 }
 const summary=practiceSummary(current);
 assert.equal(summary.topics.length,3);
 assert.match(summary.topics.join(' '),/Work arrangement|Project/);
 assert.equal(current.messages.length,m.messages.length+6);
});
test('Mira provides meaningful candidate-specific offline answers',()=>{
 assert.match(demoMiraAnswer('C01','Which role is strongest?','qa'),/QA Automation Engineer/);
 assert.match(demoMiraAnswer('C01','What else should HR ask?','qa'),/ask/i);
});

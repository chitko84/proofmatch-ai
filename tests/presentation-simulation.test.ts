import {readFileSync,existsSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {demoMiraAnswer} from '../src/lib/mira.ts';
import {meetingPracticeReply,practiceSummary} from '../src/lib/meeting-simulation.ts';
import {createReadyDemoMeeting} from '../src/lib/liveroom.ts';
const src=(name:string)=>readFileSync(new URL(name,import.meta.url),'utf8');
test('Mira has instant offline response mode, voice test and microphone fallback',()=>{
 const page=src('../src/app/demo/mira/page.tsx');
 for(const text of ['Instant guided answers','Try live Gemini AI','Hear Mira speak','Speak a question','playRecordedVoice']) assert.ok(page.includes(text),text);
});
test('LiveRoom includes actual demo controls and an actionable summary',()=>{
 const room=src('../src/app/liveroom/[id]/page.tsx');
 for(const text of ['Join practice meeting','Finish meeting','Play sample conversation','Download discussion notes','SpeechRecognition','getUserMedia','Sample participant replies']) assert.ok(room.includes(text),text);
});
test('Bundled Mira backup voice audio clips have MP3 headers',()=>{
 for(const name of ['mira-welcome-demo.mp3','mira-sample-demo.mp3']){
  const path=new URL(`../public/audio/${name}`,import.meta.url);
  assert.ok(existsSync(path));const buffer=readFileSync(path);assert.ok(buffer.length>10000);assert.equal(buffer.toString('ascii',0,3),'ID3');
 }
});
test('Standalone backup is self-contained and contains six working paths',()=>{
 const html=src('../PRESENTATION_OFFLINE_BACKUP.html');
 for(const section of ['id="dashboard"','id="blindspot"','id="evidence"','id="invite"','id="meeting"','id="mira"','data:audio/mpeg;base64','function meetingStart()','function askMira(q)']) assert.ok(html.includes(section),section);
 assert.ok(!html.includes('__AUDIO_'));
});
test('Offline Mira answers remain grounded and distinguish unknown claims',()=>{
 assert.match(demoMiraAnswer('C01','How does ProofMatch work?','qa'),/project examples|requirements/i);
 assert.match(demoMiraAnswer('C01','How can I invite this person to a meeting?','qa'),/meeting invitation/i);
 assert.match(demoMiraAnswer('C01','What about fair hiring decisions?','qa'),/human recruiter/i);
 assert.match(demoMiraAnswer('C01','Can we discuss salary?','qa'),/direct discussion/i);
});
test('The meeting practice does not invent a promised salary or job offer',()=>{
 const meeting=createReadyDemoMeeting();
 const text=meetingPracticeReply('How much salary do you offer?','candidate',meeting);
 assert.match(text,/confirm|HR/i);assert.doesNotMatch(text,/RM\s*[0-9]|guarantee/i);
 const summary=practiceSummary(meeting);assert.match(summary.action,/HR should confirm/i);
});

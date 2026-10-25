import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildMeeting,defaultMeetingTime} from '../src/lib/liveroom.ts';
import {telegramMeetingText,validSendMeeting,demoTelegramPairingUrl} from '../src/lib/live-telegram.ts';

test('real Telegram invitation displays role, candidate, MYT and a private https RSVP link',()=>{
 const m=buildMeeting({candidateId:'C01',roleId:'qa',scheduledLocal:defaultMeetingTime(),durationMinutes:20},'meet-example-12345678');
 const content=telegramMeetingText(m,'https://proofmatch.example/invite/meet-example-12345678?ticket=abc');
 assert.match(content,/QA Automation Engineer/);
 assert.match(content,/Malaysia time, UTC\+8/);
 assert.match(content,/https:\/\/proofmatch.example\/invite/);
 assert.match(content,/fictional candidate and job/);
 assert.ok(validSendMeeting(m));
});
test('real Telegram forbids expired meetings and rejects an HTTP link',()=>{
 const m=buildMeeting({candidateId:'C01',roleId:'qa',scheduledLocal:'2022-01-01T10:00',durationMinutes:20},'meet-example-12345678');
 assert.equal(validSendMeeting(m),false);
 assert.throws(()=>telegramMeetingText(m,'http://localhost:3000/invite/abc'),/HTTPS/);
});
test('private Telegram pairing URL uses the real bot deep-link format',()=>{
 assert.equal(demoTelegramPairingUrl('ProofMatchBot','my_private_code_9480'),'https://t.me/ProofMatchBot?start=link_my_private_code_9480');
 assert.throws(()=>demoTelegramPairingUrl('bad*bot','abc'),/Check/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {parseInvitationQr,demoInvitationUrl} from '../src/lib/qr-scan.ts';
const origin='https://proofmatch-demo.vercel.app';
test('sample QR link loads an actual fictional candidate and open job',()=>{
 const result=parseInvitationQr(demoInvitationUrl(origin),origin);
 assert.equal(result.mode,'fictional');assert.match(result.label,/QA Automation Engineer/);
 assert.equal(result.url,origin+'/passport?candidate=C01&role=qa');
});
test('private Telegram-linked invitation QR has a valid unguessable token format',()=>{
 const token='abcdefghijklmnopqrstuvwx';
 const result=parseInvitationQr(origin+'/passport?token='+token,origin);
 assert.equal(result.mode,'shared');assert.match(result.url,/token=/);
 assert.throws(()=>parseInvitationQr(origin+'/passport?token=oops',origin));
});
test('Telegram QR only opens the bot verified for this demo',()=>{
 const token='abcdefghijklmnopqrstuvwx';
 const url=`https://t.me/ProofMatchTestBot?start=${token}`;
 assert.equal(parseInvitationQr(url,origin,'ProofMatchTestBot').mode,'telegram');
 assert.throws(()=>parseInvitationQr(url,origin));
 assert.throws(()=>parseInvitationQr(url,origin,'AnotherBot'));
});
test('scanner cannot redirect to a malicious domain or unrelated feature',()=>{
 assert.throws(()=>parseInvitationQr('https://bad.example/passport?candidate=C01&role=qa',origin));
 assert.throws(()=>parseInvitationQr('javascript:alert(1)',origin));
 assert.throws(()=>parseInvitationQr(origin+'/demo/guide',origin));
 assert.throws(()=>parseInvitationQr(origin+'/passport?candidate=GHOST&role=qa',origin));
 assert.throws(()=>parseInvitationQr(origin+'/passport?candidate=C01&role=madeup',origin));
});
test('scan recognizes local and public same-origin links, not a different device localhost',()=>{
 assert.equal(parseInvitationQr('http://localhost:3000/passport?candidate=C01&role=qa','http://localhost:3000').mode,'fictional');
 assert.throws(()=>parseInvitationQr('http://localhost:3000/passport?candidate=C01&role=qa',origin));
});

test('scan preserves an exact browser-only invitation identifier without treating it as shared storage',()=>{
 const token='local-demo-abcdefghijklmnop';
 const parsed=parseInvitationQr(`${origin}/passport?candidate=C01&role=qa&demo=${token}`,origin);
 assert.equal(parsed.mode,'fictional');
 assert.equal(parsed.url,`${origin}/passport?candidate=C01&role=qa&demo=${token}`);
 assert.throws(()=>parseInvitationQr(`${origin}/passport?candidate=C01&role=qa&demo=bad`,origin));
});

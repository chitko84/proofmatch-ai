import assert from 'node:assert/strict';
import test from 'node:test';
import {presentationSamples,preparePresentationExamples,PRESENTATION_SAMPLE_ID,PRESENTATION_INVITE_TOKEN} from '../src/lib/demo-preset.ts';
import {validateInvitation} from '../src/lib/connect.ts';
import {eligibleWorkSamples} from '../src/lib/fairshot.ts';
import {candidates,roles} from '../src/lib/data.ts';
import {compareExampleSalary} from '../src/lib/demo-expectations.ts';

test('presentation preset includes two valid fictional invitations and role-specific work reply',()=>{
 const sample=presentationSamples('2026-10-21T12:00:00.000Z');
 assert.equal(sample.invites.length,2);
 for(const invitation of sample.invites)assert.ok(validateInvitation(invitation));
 assert.equal(sample.invites[0].token,PRESENTATION_INVITE_TOKEN);
 assert.equal(sample.invites[0].reply?.source,'passport');
 assert.ok(sample.invites[0].reply?.note.includes('Fictional'));
 assert.equal(sample.reply.id,PRESENTATION_SAMPLE_ID);
 assert.equal(sample.reply.kind,'self_report');
 assert.equal(sample.reply.origin,'fairshot');
 const c=candidates.find(c=>c.id==='C01')!,r=roles.find(r=>r.id==='qa')!;
 assert.ok(eligibleWorkSamples(c,r).some(task=>task.id==='qa-api'));
});

test('salary discussion is labeled sample context, not hiring score',()=>{
 const c01=compareExampleSalary('C01','qa');
 assert.equal(c01?.overlap,true);
 const c02=compareExampleSalary('C02','qa');
 assert.equal(c02?.overlap,true);
 assert.equal(compareExampleSalary('C08','qa')?.overlap,false);
 assert.equal(compareExampleSalary('UNKNOWN','qa'),null);
});

test('one-click demo preset is idempotent and preserves previously chosen reviews',()=>{
 const saved=new Map<string,string>();
 const storage={getItem:(k:string)=>saved.get(k)||null,setItem:(k:string,v:string)=>{saved.set(k,v);},removeItem:(k:string)=>{saved.delete(k)}};
 const old=Object.getOwnPropertyDescriptor(globalThis,'window');
 Object.defineProperty(globalThis,'window',{configurable:true,value:{localStorage:storage,dispatchEvent:(_event:Event)=>true}});
 try{
  saved.set('proofmatch-phase1-reviews',JSON.stringify({'C01:qa':'clarification'}));
  preparePresentationExamples('2026-10-21T12:00:00.000Z');
  preparePresentationExamples('2026-10-21T12:00:00.000Z');
  const reviews=JSON.parse(saved.get('proofmatch-phase1-reviews')||'{}');
  assert.equal(reviews['C01:qa'],'clarification');
  assert.equal(reviews['C02:frontend'],'clarification');
  const replies=JSON.parse(saved.get('proofmatch-phase3-replies-v1')||'[]');
  assert.equal(replies.filter((r:{id:string})=>r.id===PRESENTATION_SAMPLE_ID).length,1);
  const invitations=JSON.parse(saved.get('proofmatch-connect-demo-v1')||'[]');
  assert.equal(invitations.length,2);
  assert.ok(invitations.find((r:{token:string})=>r.token===PRESENTATION_INVITE_TOKEN)?.reply);
 }finally {if(old)Object.defineProperty(globalThis,'window',old);else Reflect.deleteProperty(globalThis,'window');}
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {candidates,roles} from '../src/lib/data.ts';
import {eligibleWorkSamples,validateFairShotSubmission,WORK_SAMPLES} from '../src/lib/fairshot.ts';
import {candidateWithReplies,validateReply} from '../src/lib/phase3.ts';
import {assessMatch} from '../src/lib/engine.ts';

test('each work sample is uniquely defined for one job skill and uses fixed prompts',()=>{
 const ids=WORK_SAMPLES.map(t=>t.id);
 assert.equal(new Set(ids).size,ids.length);
 for(const task of WORK_SAMPLES){
  assert.ok(roles.find(r=>r.id===task.roleId)?.requirements.some(s=>s.skillId===task.skillId));
  assert.ok(task.prompt.length>45);
  assert.equal(task.reviewChecks.length,2);
 }
});
test('C01 may get QA API testing prompt but not a documented Python prompt',()=>{
 const c=candidates[0],qa=roles.find(r=>r.id==='qa')!;
 const prompts=eligibleWorkSamples(c,qa);
 assert.ok(prompts.some(t=>t.skillId==='api_testing'));
 assert.ok(!prompts.some(t=>t.skillId==='python'));
});
test('a submission is rejected if role and skill have a documented project example',()=>{
 assert.throws(()=>validateFairShotSubmission('C01','qa-py','A practical test can compare keys and flag duplicate rows clearly.'),/not applicable/);
 assert.throws(()=>validateFairShotSubmission('C01','qa-api','Short'),/35/);
 assert.throws(()=>validateFairShotSubmission('NOT-A-CANDIDATE','qa-api','A long enough example of testing idempotency and retry behavior.'),/fictional/);
});
test('saved work samples remain self-reported, never promote to independent artifacts',()=>{
 const response='I would repeat the same order request with a stable key and check whether retries created duplicates. I would log the request IDs and status codes.';
 const valid=validateFairShotSubmission('C01','qa-api',response);
 const entry=validateReply({id:'sample-001',candidateId:'C01',skillId:valid.task.skillId,note:valid.response,origin:'fairshot',taskId:valid.task.id,createdAt:'2026-10-20T00:00:00.000Z'});
 const augmented=candidateWithReplies(candidates[0],[entry]);
 assert.equal(augmented.evidence.at(-1)?.kind,'self_report');
 assert.match(augmented.evidence.at(-1)!.sourceLabel,/FairShot/);
 const reviewed=assessMatch(augmented,roles[1]);
 assert.equal(reviewed.assessments.find(a=>a.requirement.skillId==='api_testing')?.support,'self_report');
});
test('without Gemini, the role-linked follow-up is prewritten and not a grade', async()=>{
 const {sampleFairShotFollowup}=await import('../src/lib/fairshot.ts');
 const task=WORK_SAMPLES.find(t=>t.id==='qa-api')!;
 const question=sampleFairShotFollowup(task);
 assert.match(question,/practical step/i);
 assert.ok(!/pass|fail|hire|reject|%/.test(question));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {candidates,roles} from '../src/lib/data.ts';
import {rankRoles} from '../src/lib/engine.ts';
import {eligibleWorkSamples,validateFairShotSubmission} from '../src/lib/fairshot.ts';
import {validateReply,candidateWithReplies,compareExpectations} from '../src/lib/phase3.ts';
import {validateCandidateReply,validateInvitation,prepareInterviewQuestions} from '../src/lib/connect.ts';

test('preselected judge example identifies an actual alternative open QA role',()=>{
 const c=candidates.find(x=>x.id==='C01')!;
 assert.equal(c.appliedRoleId,'frontend');
 assert.equal(rankRoles(c,roles)[0].roleId,'qa');
 assert.ok(rankRoles(c,roles)[0].alternativeToApplied);
});
test('autofilled sample work answer is long enough and remains a human-reviewed statement',()=>{
 const c=candidates.find(x=>x.id==='C01')!;
 const role=roles.find(x=>x.id==='qa')!;
 const task=eligibleWorkSamples(c,role)[0];
 assert.ok(task,'demo needs an unanswered skill');
 const sample=`In this fictional work example, I would start by understanding the requirements for ${task.title.toLowerCase()}. I would identify a small test case, explain the steps I would take, record the results, and ask the team to review my approach before calling it complete.`;
 const result=validateFairShotSubmission(c.id,task.id,sample);
 const statement=validateReply({id:'fs-demo-sample',candidateId:c.id,skillId:result.task.skillId,note:result.response,createdAt:'2026-10-21T00:00:00.000Z',origin:'fairshot',taskId:task.id});
 assert.equal(statement.kind,'self_report');
 assert.ok(candidateWithReplies(c,[statement]).evidence.some(e=>e.kind==='self_report'));
});
test('sample candidate invitation and reply are consistent and valid',()=>{
 const reply=validateCandidateReply({interest:'interested',workMode:'hybrid',note:'Fictional demo: I would like to learn more about this open role and the team.'},'passport');
 const invitation=validateInvitation({token:'example-demo-invitation-token-2026',candidateId:'C01',roleId:'qa',createdAt:'2026-10-21T04:00:00.000Z',reply});
 assert.ok(invitation);assert.equal(invitation.reply?.workMode,'hybrid');assert.equal(invitation.reply?.source,'passport');
});
test('the preloaded interview, expectations, and alternative roles all have content',()=>{
 assert.ok(prepareInterviewQuestions('C01','qa').length>=2);
 const result=compareExpectations(candidates.find(c=>c.id==='C05')!,roles.find(r=>r.id==='qa')!,'I want remote work');
 assert.equal(result.workMode,'needs_discussion');
 assert.equal(roles.length,3);
});

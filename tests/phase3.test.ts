import test from 'node:test';
import assert from 'node:assert/strict';
import {candidates,roles} from '../src/lib/data.ts';
import {assessMatch} from '../src/lib/engine.ts';
import {bestRoleSummary, candidateWithReplies,compareExpectations, previewPreference,validateReply,validatedReplies,evaluateCareerMilestone,CAREER_TRACKS} from '../src/lib/phase3.ts';
import {demoMiraAnswer,miraContext} from '../src/lib/mira.ts';
const c=candidates[0];const qa=roles.find(r=>r.id==='qa')!;
test('criteria preview does not mutate actual role requirements or candidate',()=>{
 const weight=qa.requirements[0].weight, original=assessMatch(c,qa);
 const diff=previewPreference(c,qa,'python',1);
 assert.equal(diff.oldWeight,weight);assert.equal(diff.newWeight,1);assert.notEqual(diff.before.coverage,diff.after.coverage);
 assert.deepEqual(assessMatch(c,qa),original);assert.equal(qa.requirements[0].weight,weight);
});
test('criteria preview validates weights and roles',()=>{
 assert.throws(()=>previewPreference(c,qa,'fake',1));
 assert.throws(()=>previewPreference(c,qa,'python',0));
 assert.throws(()=>previewPreference(c,qa,'python',99));
});
test('candidate reply is always self-reported and cannot become artifact evidence',()=>{
 const r=validateReply({id:'a',candidateId:c.id,skillId:'api_testing',note:'I worked with HTTP testing in a classroom project.',kind:'artifact',createdAt:'2026-10-20T00:00:00Z'});
 assert.equal(r.kind,'self_report');
 const changed=candidateWithReplies(c,[r]);
 assert.equal(c.evidence.length+1,changed.evidence.length);
 const after=assessMatch(changed,qa),before=assessMatch(c,qa);
 assert.equal(before.assessments.find(a=>a.requirement.skillId==='api_testing')!.support,'missing');
 assert.equal(after.assessments.find(a=>a.requirement.skillId==='api_testing')!.support,'self_report');
 assert.ok(after.coverage>before.coverage);
 assert.equal(c.evidence.length,4);
});
test('invalid corrections are ignored at rehydration and no arbitrary roles can be inserted',()=>{
 assert.throws(()=>validateReply({candidateId:'UNKNOWN',skillId:'python',note:'I have done an example of Python.'}));
 assert.throws(()=>validateReply({candidateId:c.id,skillId:'INVALID',note:'I have done an example of Python.'}));
 assert.equal(validatedReplies([{candidateId:'fake',skillId:'python',note:'Lots of experience'}]).length,0);
});
test('expectations show a conflict without excluding a candidate',()=>{
 const remote=candidates.find(c=>c.id==='C05')!;
 const res=compareExpectations(remote,qa);
 assert.equal(res.workMode,'needs_discussion');
 assert.ok(res.nextStep.includes('Clarify'));
 assert.equal(assessMatch(remote,qa).logistics,'review_needed');
});
test('career path shows evidence without predicting promotion',()=>{
 assert.equal(CAREER_TRACKS.length,3);
 const step=CAREER_TRACKS[1].roles[1];
 const res=evaluateCareerMilestone(c,step);
 assert.ok(res.skills.some(s=>s.skillId==='python'&&s.evidence==='project example'));
 assert.equal(res.skills.find(s=>s.skillId==='api_testing')!.evidence,'not documented');
});
test('Mira context is sourced from existing matching results',()=>{
 const context=miraContext('C01')!;
 const data=JSON.parse(context);
 assert.equal(data.roles.length,3);
 assert.ok(data.roles.some((r:{role:string})=>r.role==='QA Automation Engineer'));
 assert.equal(miraContext('fake'),null);
});
test('offline Mira guide is grounded and does not invent hired employee performance',()=>{
 const answer=demoMiraAnswer('C01','Which role might fit best?');
 assert.match(answer,/QA Automation Engineer/);
 assert.doesNotMatch(answer,/will definitely be promoted|guaranteed to be hired/);
 const q=demoMiraAnswer('C01','What should HR ask next?');
 assert.match(q,/ask/i);
});

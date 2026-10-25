import assert from 'node:assert/strict';
import test from 'node:test';
import {candidates,roles} from '../src/lib/data.ts';
import {rankRoles} from '../src/lib/engine.ts';
import {eligibleWorkSamples} from '../src/lib/fairshot.ts';
import {prepareInterviewQuestions} from '../src/lib/connect.ts';
import {CAREER_TRACKS} from '../src/lib/phase3.ts';
import {exampleCandidateSalary,exampleRoleSalary} from '../src/lib/demo-expectations.ts';

test('every fictional candidate and job has enough visible content for a demo',()=>{
 assert.ok(candidates.length>=8);
 assert.equal(roles.length,3);
 for(const candidate of candidates){
  assert.ok(candidate.alias&&candidate.location&&candidate.evidence.length>=2);
  assert.ok(candidate.evidence.every(item=>Boolean(item.excerpt.trim())));
  assert.ok(roles.some(role=>role.id===candidate.appliedRoleId));
  assert.ok(exampleCandidateSalary[candidate.id]);
  assert.equal(rankRoles(candidate,roles).length,roles.length);
  for(const role of roles){
   assert.ok(prepareInterviewQuestions(candidate.id,role.id).length>=2);
  }
 }
 for(const role of roles){
  assert.ok(role.requirements.length>=4);
  assert.ok(exampleRoleSalary[role.id]);
 }
});

test('the seven-step demo has work examples, career paths and interview questions',()=>{
 const c=candidates.find(c=>c.id==='C01')!,r=roles.find(x=>x.id==='qa')!;
 assert.ok(eligibleWorkSamples(c,r).length>=1);
 assert.ok(prepareInterviewQuestions(c.id,r.id).length>=2);
 assert.ok(CAREER_TRACKS.length>=3 && CAREER_TRACKS.every(track=>track.roles.length>=3));
});

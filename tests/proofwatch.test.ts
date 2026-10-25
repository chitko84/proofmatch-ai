import test from 'node:test';
import assert from 'node:assert/strict';
import {candidates,roles} from '../src/lib/data.ts';
import {rankRoles} from '../src/lib/engine.ts';
import {getWatchSignals} from '../src/lib/proofwatch.ts';
import {demoMiraAnswer,miraContext} from '../src/lib/mira.ts';

test('ProofWatch signals are derived from real, stronger alternative-role evidence',()=>{
 const signals=getWatchSignals(candidates,roles);
 assert.ok(signals.length>=1);
 for(const signal of signals){
  const person=candidates.find(c=>c.id===signal.candidateId)!;
  const ranked=rankRoles(person,roles);
  const applied=ranked.find(r=>r.roleId===person.appliedRoleId)!;
  assert.equal(signal.alternativeRoleId,ranked[0].roleId);
  assert.ok(ranked[0].coverage>applied.coverage,'ties cannot trigger a watch alert');
  assert.ok(person.evidence.some(e=>e.kind==='artifact'&&e.excerpt===signal.evidenceLine));
  assert.ok(roles.some(r=>r.title===signal.alternativeRole));
 }
});
test('ProofWatch creates no signal when the applied role is strongest',()=>{
 const person=candidates.find(c=>c.id==='C07')!;
 assert.equal(rankRoles(person,roles)[0].roleId,person.appliedRoleId);
 assert.equal(getWatchSignals([person],roles).length,0);
 assert.deepEqual(getWatchSignals([],roles),[]);
});
test('Mira role selection changes the context while preserving all three role assessments',()=>{
 const raw=miraContext('C01','frontend');
 assert.ok(raw);
 const context=JSON.parse(raw!);
 assert.equal(context.focusRole,'Frontend Developer');
 assert.equal(context.roles.length,3);
 assert.equal(miraContext('INVALID','frontend'),null);
 assert.match(demoMiraAnswer('C01','Why this role?','frontend'),/Frontend Developer/);
});
test('Mira answering a best-role question does not misleadingly use a weaker selected role',()=>{
 const response=demoMiraAnswer('C01','Which role has the most supporting evidence?','frontend');
 assert.match(response,/QA Automation Engineer/);
 assert.doesNotMatch(response,/hired|definitely promoted/);
});

test('An alternative-role answer never says a weaker applied role is strongest',()=>{
 const text=demoMiraAnswer('C01','Why might this person suit a different job?','frontend');
 assert.match(text,/QA Automation Engineer/);
 assert.doesNotMatch(text,/original role.*strongest/);
});

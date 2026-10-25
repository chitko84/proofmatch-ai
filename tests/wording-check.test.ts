import test from 'node:test';
import assert from 'node:assert/strict';
import {candidates,roles} from '../src/lib/data.ts';
import {compareEquivalentEvidence} from '../src/lib/wording-check.ts';

test('equivalent evidence labels with rewritten phrases do not change deterministic role ranking',()=>{
 for(const candidate of candidates){
  const result=compareEquivalentEvidence(candidate,roles);
  assert.equal(result.sameRank,true);
  assert.equal(result.sameCoverage,true);
  assert.notEqual(result.rewritten.evidence[0].excerpt,candidate.evidence[0].excerpt);
 }
});

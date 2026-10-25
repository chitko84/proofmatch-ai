import test from 'node:test';
import assert from 'node:assert/strict';
import {highlightSourceQuote} from '../src/lib/evidence-xray.ts';

test('highlights only source text that exists; never adds new words',()=>{
  const source='Built a pytest regression suite for account workflows.';
  const pieces=highlightSourceQuote(source,'test_automation');
  assert.equal(pieces.map(p=>p.text).join(''),source);
  assert.ok(pieces.some(p=>p.highlighted && p.text.toLowerCase()==='pytest'));
  assert.ok(pieces.some(p=>p.highlighted && p.text.toLowerCase()==='regression'));
});
test('unknown source terms are left intact rather than faked',()=>{
  assert.deepEqual(highlightSourceQuote('I enjoy collaborative work','cicd'),[{text:'I enjoy collaborative work',highlighted:false}]);
  assert.deepEqual(highlightSourceQuote('','react'),[]);
});

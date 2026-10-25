import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLiveResult, findAlternative, parseStoredAnalysis, validateExtractedEvidence, validateLiveInput } from '../src/lib/live-analysis.ts';
import { rankRoles } from '../src/lib/engine.ts';
import { roles } from '../src/lib/data.ts';

const input = validateLiveInput({
  label:'Candidate Z', appliedRoleId:'frontend', location:'Penang',preferredModes:['hybrid'],
  cvText:'I have some experience with React, although I have not yet shared a React project.',
  projectText:'Built a pytest regression suite for account workflows. Configured GitHub Actions to run Python test utilities.',
});
test('validates user text and roles',()=>{
  assert.equal(input.label,'Candidate Z');
  assert.throws(()=>validateLiveInput({...input,appliedRoleId:'ceo'}));
  assert.throws(()=>validateLiveInput({...input,cvText:'short'}));
});
test('rejects model hallucinations, unknown skill names and wrong sources',()=>{
  const result=validateExtractedEvidence({evidence:[
    {skillId:'test_automation',sourceId:'project',quote:'Built a pytest regression suite for account workflows.'},
    {skillId:'react',sourceId:'cv',quote:'I have some experience with React'},
    {skillId:'api_testing',sourceId:'project',quote:'Fabricated API testing project'},
    {skillId:'quantum',sourceId:'cv',quote:'I have some experience with React'},
    {skillId:'python',sourceId:'cv',quote:'Python test utilities'},
  ]},{cv:input.cvText,project:input.projectText});
  assert.equal(result.evidence.length,2);
  assert.equal(result.rejected,3);
  assert.equal(result.evidence[0].kind,'artifact');
  assert.equal(result.evidence[1].kind,'self_report');
});
test('model output schema must be structured',()=>{
  assert.throws(()=>validateExtractedEvidence({skills:['Python']},{cv:input.cvText,project:input.projectText}));
});
test('verified excerpts enter all three role assessments deterministically',()=>{
  const result=buildLiveResult(input,{evidence:[
    {skillId:'python',sourceId:'project',quote:'Python test utilities'},
    {skillId:'test_automation',sourceId:'project',quote:'Built a pytest regression suite for account workflows.'},
    {skillId:'cicd',sourceId:'project',quote:'Configured GitHub Actions to run Python test utilities.'},
    {skillId:'react',sourceId:'cv',quote:'I have some experience with React'},
  ]},'test-model',new Date('2026-10-20T00:00:00Z'));
  assert.equal(result.evidenceAccepted,4);
  assert.equal(rankRoles(result.candidate,roles)[0].roleId,'qa');
  assert.equal(findAlternative(result.candidate)?.best.roleId,'qa');
  assert.equal(parseStoredAnalysis(JSON.stringify(result))?.candidate.id,'LIVE');
  assert.equal(parseStoredAnalysis('{broken json'),null);
});
test('do not force an alternative when evidence is too thin',()=>{
  const result=buildLiveResult(input,{evidence:[{skillId:'python',sourceId:'project',quote:'Python test utilities'}]},'test');
  assert.equal(findAlternative(result.candidate),null);
});


test('stored analysis ignores malformed entries and revalidates quotes against original sources',()=>{
  const original=buildLiveResult(input,{evidence:[
    {skillId:'test_automation',sourceId:'project',quote:'Built a pytest regression suite for account workflows.'},
  ]},'test-model');
  const stored=JSON.parse(JSON.stringify(original)) as {candidate:{evidence:unknown[]}};
  stored.candidate.evidence.push(null, 'not an evidence record', {kind:'artifact',skillId:'python',excerpt:'Fabricated Python artifact'},
    {kind:'unrecognized',skillId:'react',excerpt:'I have some experience with React'});
  const parsed=parseStoredAnalysis(JSON.stringify(stored));
  assert.ok(parsed);
  assert.equal(parsed.evidenceAccepted,1);
  assert.equal(parsed.candidate.evidence[0].excerpt,'Built a pytest regression suite for account workflows.');
});

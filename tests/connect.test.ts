import test from 'node:test';
import assert from 'node:assert/strict';
import { checkCandidateRole, validateCandidateReply, validateInvitation, prepareInterviewQuestions } from '../src/lib/connect.ts';

test('candidate passport only allows fictional candidates and real sample open roles',()=>{
  assert.equal(checkCandidateRole('C01','qa').role.title,'QA Automation Engineer');
  assert.throws(()=>checkCandidateRole('UNLISTED','qa'));
  assert.throws(()=>checkCandidateRole('C01','unknown'));
});
test('response is a candidate statement, requires selected interest and a known working style',()=>{
  const reply=validateCandidateReply({interest:'interested',workMode:'hybrid',note:'Could we discuss the hours?'},'passport');
  assert.equal(reply.source,'passport');assert.equal(reply.interest,'interested');
  assert.throws(()=>validateCandidateReply({interest:'hired',workMode:'hybrid',note:''},'passport'));
  assert.throws(()=>validateCandidateReply({interest:'interested',workMode:'made_up',note:''},'passport'));
  assert.throws(()=>validateCandidateReply({interest:'interested',workMode:'hybrid',note:'x'.repeat(500)},'passport'));
});
test('invitation record cannot inject an unknown candidate or arbitrary role',()=>{
  const clean={token:'abcdefghijklmnopqrstuvwx', candidateId:'C01',roleId:'qa',createdAt:'2026-10-21T04:00:00.000Z',reply:null};
  assert.ok(validateInvitation(clean));
  assert.equal(validateInvitation({...clean,roleId:'administrator'}),null);
  assert.equal(validateInvitation({...clean,token:'insecure'}),null);
});
test('interview questions are role-specific and include human two-way expectations',()=>{
  const qa=prepareInterviewQuestions('C01','qa');
  const analyst=prepareInterviewQuestions('C01','analyst');
  assert.ok(qa.length>=2);assert.ok(qa.length<=4);
  assert.ok(qa.some(q=>q.question.includes('work')||q.title.includes('both sides')));
  assert.ok(analyst.some(q=>q.question.includes('SQL')));
  assert.ok(qa.every(q=>!q.question.toLowerCase().includes('age')&&!q.question.toLowerCase().includes('gender')));
  assert.notDeepEqual(qa.map(q=>q.question),analyst.map(q=>q.question));
});

test('two same-role browser invitations have separate Passport links and do not cross-contaminate',async()=>{
 const {browserPassportUrl}=await import('../src/lib/connect-client.ts');
 const common={candidateId:'C01',roleId:'qa',createdAt:'2026-10-22T01:00:00.000Z',reply:null};
 const a=browserPassportUrl('https://proofmatch.test',{...common,token:'local-demo-aaaaaaaaaaaaaaaa'});
 const b=browserPassportUrl('https://proofmatch.test',{...common,token:'local-demo-bbbbbbbbbbbbbbbb'});
 assert.notEqual(a,b);
 assert.match(a,/demo=local-demo-aaaaaaaaaaaaaaaa/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {assessCvForJob,diverseCvJobs,rankCvJobs} from '../src/lib/cv-job-matching.ts';
import {OPPORTUNITIES} from '../src/lib/career-catalog.ts';

test('CV comparison reflects only uploaded text, not a fictional candidate',()=>{
 const job=OPPORTUNITIES.find(j=>j.title==='Scriptwriter')!;
 const fit=assessCvForJob('I developed film storytelling and scriptwriting skills and worked on character development in a production team.',job);
 assert.equal(fit.matched,3);
 assert.equal(fit.requirements.filter(s=>s.status!=='not_mentioned').length,fit.matched);
 assert.equal(fit.score,75);
 assert.ok(fit.requirements.every(r=>r.status!=='supported'));
});
test('matching does not count substring false positives',()=>{
 const job=OPPORTUNITIES.find(j=>j.title==='Scriptwriter')!;
 const fit=assessCvForJob('No relevant experience in editing or storytelling; unrelated context',job);
 assert.ok(fit.matched<=2);
});
test('alternative jobs exclude original and show distinct titles across industries',()=>{
 const cv='Scriptwriting, storytelling, editing, creative direction, production planning, communication, teaching, planning, research.';
 const original=OPPORTUNITIES.find(j=>j.title==='Film Director')!;
 const alternatives=diverseCvJobs(cv,OPPORTUNITIES,original.id,12);
 assert.equal(alternatives.length,12);
 assert.ok(alternatives.every(r=>r.job.id!==original.id&&r.job.title!==original.title));
 assert.equal(new Set(alternatives.map(r=>r.job.title)).size,12);
 assert.ok(alternatives.some(r=>r.job.title==='Scriptwriter'));
 assert.ok(rankCvJobs(cv,OPPORTUNITIES,original.id,6).every(r=>r.job.id!==original.id));
});

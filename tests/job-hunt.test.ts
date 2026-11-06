import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {COMPANIES,OPPORTUNITIES} from '../src/lib/career-catalog.ts';
import {CLINIC_SAMPLES} from '../src/lib/resume-clinic.ts';
import {validateResume,splitResume,evidenceForJob,tailorResume,buildCoverLetter,rankJobs} from '../src/lib/job-hunt.ts';
import {createDocx} from '../src/lib/job-hunt-export.ts';
const sample=CLINIC_SAMPLES['Business & Management'];
const job=OPPORTUNITIES.find(j=>j.sector==='Business & Management'&&j.skills.some(s=>/excel/i.test(s)))||OPPORTUNITIES.find(j=>j.sector==='Business & Management')!;

test('career application tools integrate existing seeded vacancy and industry catalog',()=>{
 assert.ok(OPPORTUNITIES.length>=800);assert.ok(COMPANIES.length>=200);
 assert.ok(job);assert.ok(job.companyId);assert.ok(job.skills.length>0);
 for(const [sector,text] of Object.entries(CLINIC_SAMPLES)){
  assert.ok(validateResume(text).length>75,sector);
  assert.ok(rankJobs(text,{query:'',sector,location:'',mode:'Any work style'},OPPORTUNITIES,5).length>0,sector);
 }
});
test('résumé tailoring contains only supplied experience and matched skills',()=>{
 const parsed=splitResume(sample);assert.equal(parsed.name,'Aisha Rahman');
 const result=tailorResume(sample,job);assert.ok(result.text.includes('Aisha Rahman'));
 assert.ok(result.text.includes('Business Analyst Intern | Meridian Projects | 2025–2026'));
 assert.ok(result.text.includes('Coordinated workshops with 12 stakeholders'));
 assert.ok(result.text.includes('TARGET ROLE: '+job.title));
 assert.ok(!result.text.includes('Google')&&!result.text.includes('Award-winning'));
 for(const mention of result.matches)assert.ok(evidenceForJob(sample,job).matches.some(x=>x.skill===mention.skill));
 for(const missing of result.missing)assert.ok(!result.matches.some(x=>x.skill===missing));
 assert.ok(result.sections.length>0);
});
test('cover letter drafting uses source evidence and respects three tones',()=>{
 for(const tone of ['formal','confident','concise'] as const){
  const result=buildCoverLetter(sample,job,tone,'Aisha Rahman');
  assert.match(result.text,/Dear Hiring Team at/);
  assert.match(result.text,/Sincerely,/);
  assert.match(result.text,/Aisha Rahman/);
  assert.match(result.text,new RegExp(job.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  for(const cited of result.sourceEvidence)assert.ok(sample.includes(cited),cited);
  assert.ok(!result.text.includes('world-class')&&!result.text.includes('perfect candidate'));
 }
});
test('ranking responds to job preferences and never implies hiring likelihood',()=>{
 const shortlist=rankJobs(sample,{query:'analyst',sector:'Business & Management',location:'',mode:'Any work style'},OPPORTUNITIES,14);
 assert.equal(shortlist.length,14);assert.ok(shortlist.every(x=>x.coverage>=0&&x.coverage<=100));
 assert.ok(shortlist.every(x=>x.job.sector==='Business & Management'));
 assert.ok(shortlist.every(x=>x.matches.every(m=>Boolean(evidenceForJob(sample,x.job).matches.find(e=>e.skill===m.skill)))));
 assert.ok(shortlist.every(x=>Number.isFinite(x.rank)));
});
test('empty or short CV is not silently turned into invented experience',()=>{
 assert.throws(()=>validateResume('Short CV'),/at least 75/);
 assert.throws(()=>tailorResume('I have no evidence',job),/at least 75/);
});
test('Word export emits genuine OOXML package bytes with escaped content',()=>{
 const bytes=createDocx('Aisha Rahman\nPROJECTS\nWorked with <approved> clients & stakeholders','Application');
 assert.equal(String.fromCharCode(...bytes.slice(0,4)),'PK\x03\x04');
 const raw=new TextDecoder().decode(bytes);
 assert.ok(raw.includes('word/document.xml'));
 assert.ok(raw.includes('&lt;approved&gt; clients &amp; stakeholders'));
 assert.ok(raw.includes('[Content_Types].xml'));
});
test('all three candidate workflows are linked from the main candidate workspace',()=>{
 const shell=readFileSync('src/components/workspace-shell.tsx','utf8');
 const candidate=readFileSync('src/app/demo/candidate/page.tsx','utf8');
 const jobs=readFileSync('src/app/demo/opportunities/page.tsx','utf8');
 for(const pathname of ['/demo/job-hunt','/demo/resume-tailor','/demo/cover-letter']){
  assert.ok(shell.includes(pathname));assert.ok(candidate.includes(pathname));
 }
 assert.ok(jobs.includes('/demo/job-hunt'));
 for(const p of ['src/app/demo/job-hunt/page.tsx','src/app/demo/resume-tailor/page.tsx','src/app/demo/cover-letter/page.tsx'])assert.ok(readFileSync(p,'utf8').includes('JobHuntStudio'));
});

test('Clinic and job application views share the prepared local documents through one storage key',()=>{
 const clinic=readFileSync('src/app/demo/resume-clinic/page.tsx','utf8');
 const jobs=readFileSync('src/app/demo/opportunities/page.tsx','utf8');
 for(const src of [clinic,jobs])assert.ok(src.includes('proofmatch.application.studio.v1'));
 assert.ok(clinic.includes('openStudio'));assert.ok(jobs.includes('usePreparedApplication'));
 assert.ok(jobs.includes('Use prepared CV &amp; letter'));
});
test('the application tools localize their main actions without an AI API',async()=>{
 const {lookupTranslation}=await import('../src/lib/i18n.ts');
 for(const lang of ['ms','ta','zh'] as const){
  for(const text of ['AI Job Hunt Copilot','AI Résumé Tailor','Cover Letter Generator','Generate cover letter','Download DOCX','Generate tailored résumé']){
   assert.notEqual(lookupTranslation(text,lang),null,`${lang}:${text}`);
   assert.notEqual(lookupTranslation(text,lang),text,`${lang}:${text}`);
  }
 }
});

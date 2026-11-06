import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {TALENT_CANDIDATES,assessTalentForJob} from '../src/lib/talent-ecosystem.ts';
import {ROLE_CATALOG,OPPORTUNITIES,CAREER_SECTORS} from '../src/lib/career-catalog.ts';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {companyEmployeeFor} from '../src/lib/company-people.ts';
import {lookupTranslation} from '../src/lib/i18n.ts';
import {sampleReviews} from '../src/lib/focused-reviews.ts';
const read=(f:string)=>readFileSync(f,'utf8');
test('focused HR and candidate menus preserve four career experiences',()=>{
 const src=read('src/components/workspace-shell.tsx');
 for(const route of ['/demo/studio','/demo/discover','/demo/futurepath','/demo/interview','/demo/partners','/demo/criteria','/demo/reviews','/demo/career/accelerator','/demo/career/interview','/demo/career/company','/demo/comics','/demo/my-referrals','/demo/applications','/demo/my-resume'])assert.ok(src.includes(`href:'${route}'`),route);
 for(const removed of ["href:'/demo/career/simulator'","href:'/demo/career/talent-explorer'","href:'/demo/guide'","href:'/demo/proof-over-polish'","href:'/demo/insights'"])assert.ok(!src.includes(removed),removed);
});
test('comic library includes six covers and exact five multilingual Heyzine books',()=>{
 const src=read('src/app/demo/comics/page.tsx');
 for(const id of ['825f855bdd','37c9eaee51','ab5b7f1476','dec1dffbef','76a7eefcea'])assert.ok(src.includes(id));
 for(let n=1;n<=6;n++)assert.ok(existsSync(`public/comics/book-${n}.svg`));
 assert.match(src,/Coming Soon/);assert.match(src,/<iframe/);
});
test('resume insights has CV upload and five meaningful chart choices, no CSV upload',()=>{
 const src=read('src/app/demo/studio/page.tsx');
 for(const item of ['analyzeResume','resume-extract','bar','horizontal','line','pie','donut','file','text'])assert.ok(src.includes(item),item);
 assert.ok(!src.includes('CsvStudio'));assert.ok(!src.includes('parseCsv'));
});
test('candidate directory and comparison use cross-industry data',()=>{
 assert.equal(TALENT_CANDIDATES.length,1200);assert.ok(CAREER_SECTORS.length>=20);
 assert.ok(ROLE_CATALOG.some(r=>r.title==='Film Director'));assert.ok(ROLE_CATALOG.some(r=>r.title==='Scriptwriter'));
 assert.ok(ROLE_CATALOG.some(r=>r.title==='Business Analyst'));
 const candidate=TALENT_CANDIDATES[0],job=OPPORTUNITIES[0];assert.ok(assessTalentForJob(candidate,job).score>=0);
 const dir=read('src/app/demo/discover/page.tsx');assert.match(dir,/TALENT_CANDIDATES/);assert.match(dir,/candidate-compare/);
 const compare=read('src/app/demo/candidate-compare/page.tsx');assert.match(compare,/salaryAligned/);assert.match(compare,/writeFocusedReview/);
});
test('future paths support multi-select, interview questions generate on click',()=>{
 const future=read('src/app/demo/futurepath/page.tsx');assert.match(future,/chosen\.includes/);assert.match(future,/type="checkbox"/);assert.match(future,/Potential career progression/);
 const interview=read('src/app/demo/interview/page.tsx');assert.match(interview,/function generate/);assert.match(interview,/setQuestions/);assert.match(interview,/Generate Interview Questions/);
});
test('company referrals preserve consent gating and incoming review',()=>{
 const hr=read('src/app/demo/partners/page.tsx'),candidate=read('src/app/demo/my-referrals/page.tsx');
 assert.match(hr,/requestReferral/);assert.match(hr,/sendReferral/);assert.match(hr,/reviewReferral/);assert.match(hr,/connectedCompanyIds/);
 assert.match(candidate,/decideReferralConsent/);assert.match(candidate,/Approve/);assert.match(candidate,/Decline/);
});
test('company 3D includes a conversation partner at every department station',()=>{
 for(const floor of careerWorlds.company)for(const point of floor.points){if(point.id.startsWith('tower-elevator'))continue;assert.ok(companyEmployeeFor(point,floor),point.id)}
 const src=read('src/components/interactive-career-world.tsx');assert.match(src,/conversationFollowUp/);assert.match(src,/Can you tell me more/);
 assert.ok(!read('src/components/workspace-shell.tsx').includes("href:'/demo/career/simulator'"));
});
test('Telegram backend and original pairing UI remain available',()=>{
 for(const route of ['src/app/api/liveroom/telegram/route.ts','src/app/api/connect/telegram/route.ts','src/app/demo/telegram/page.tsx'])assert.ok(existsSync(route));
 const telegram=read('src/app/demo/telegram/page.tsx');assert.match(telegram,/sendRealTest/);assert.match(telegram,/scheduleAndSend/);assert.match(telegram,/checkTelegram/);
});
test('review list includes populated examples and can update status',()=>{
 assert.ok(sampleReviews.length>=4);assert.ok(new Set(sampleReviews.map(x=>x.status)).size>=4);
 const src=read('src/app/demo/reviews/page.tsx');assert.match(src,/writeFocusedReview/);
});
test('core navigation labels localize across all five languages',()=>{
 for(const locale of ['ms','ta','zh','my'] as const)for(const phrase of ['Comic Books','Candidate Directory','Resume Insights','Future Path AI','Company Referrals','My Referrals','My Applications']){
  const translated=lookupTranslation(phrase,locale);assert.ok(translated&&translated!==phrase,`${locale}: ${phrase}`);
 }
});

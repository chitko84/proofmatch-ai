import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LOCALES,lookupTranslation,lookupInterpolated,formatLocalizedNumber,localeInfo} from '../src/lib/i18n.ts';
import {LANDING_HERO_COPY} from '../src/lib/i18n-landing.ts';
import {careerWorlds,scoreWorld} from '../src/lib/career-worlds.ts';

const shell=readFileSync(new URL('../src/components/workspace-shell.tsx',import.meta.url),'utf8');
test.skip('candidate and recruiter keep separate short primary navigations',()=>{
 const candidate=shell.slice(shell.indexOf('const candidateSections='),shell.indexOf('const candidateExtras='));
 const recruiter=shell.slice(shell.indexOf('const hrSections='),shell.indexOf('const hrExtras='));
 assert.match(candidate,/\/demo\/job-hunt/);
 assert.match(candidate,/\/demo\/resume-tailor/);
 assert.match(candidate,/\/demo\/cover-letter/);
 assert.doesNotMatch(candidate,/\/demo\/talent'/);
 assert.doesNotMatch(candidate,/\/demo\/reviews'/);
 assert.doesNotMatch(candidate,/\/demo\/career\/simulator'/);
 assert.match(recruiter,/\/demo\/talent/);
 assert.match(recruiter,/\/demo\/reviews/);
 assert.match(recruiter,/\/demo\/career\/simulator/);
 assert.doesNotMatch(recruiter,/\/demo\/resume-tailor'/);
 assert.doesNotMatch(recruiter,/\/demo\/cover-letter'/);
 assert.match(shell,/setShowMore/);
 assert.match(shell,/aria-expanded=\{showMore\}/);
 assert.match(shell,/candidateOnly/);
 assert.match(shell,/recruiterOnly/);
});

test('Burmese is selectable and critical navigation/action translations work offline',()=>{
 assert.deepEqual(LOCALES.map(x=>x.code),['en','ms','ta','zh','my']);
 assert.equal(localeInfo('my').nativeName,'မြန်မာ');
 for(const phrase of [
  'Language','Candidate View','HR View','CANDIDATE WORKSPACE','HIRING WORKSPACE',
  'MY CAREER','APPLICATIONS & MESSAGES','LEARN & EXPLORE','TEAM & PERFORMANCE',
  'More tools','AI Job Hunt Copilot','Résumé Clinic','AI Résumé Tailor',
  'Cover Letter Generator','Talent Intelligence','See what changes',
  'My referrals & consent','Company Connections & Referrals','Career Experience',
  'Career News','Messages','AI Mock Interview','HR Manager Simulator',
  'Search','Save','Send','Cancel','Apply now','Upload CV','Analyze CV',
  'Matched skills','Skill gaps','Share screen','Download','Close'
 ]){
  const translated=lookupTranslation(phrase,'my');
  assert.ok(translated&&translated!==phrase,`Untranslated Burmese core label: ${phrase}`);
 }
 assert.equal(lookupTranslation('Message Aye Aye…','my'),'Aye Aye ထံ မက်ဆေ့ချ်ပို့ရန်…');
 assert.equal(lookupInterpolated('Page 3 of 12','my'),'စာမျက်နှာ 3 / 12');
 assert.ok(formatLocalizedNumber(1530,'my'));
});

test('Burmese landing experience works without a translation API',()=>{
 assert.ok(LANDING_HERO_COPY.my.description.includes('ProofMatch AI'));
 assert.ok(LANDING_HERO_COPY.my.lineOne.length>4);
 const hero=readFileSync(new URL('../src/components/landing-hero-copy.tsx',import.meta.url),'utf8');
 assert.match(hero,/my:'အလုပ်လျှောက်ထားသူ မြင်ကွင်း'/);
 const lang=readFileSync(new URL('../src/components/language-provider.tsx',import.meta.url),'utf8');
 assert.match(lang,/locale==='my'/);
 assert.match(lang,/LOCALES\.map/);
});

test('expanded HR office keeps six existing decision tasks plus optional exploration stops',()=>{
 const mission=careerWorlds.simulator[0];
 assert.ok(mission.points.length>=10);
 assert.equal(mission.points.filter(p=>p.task).length,6);
 assert.equal(scoreWorld({},mission).total,6);
 assert.ok(mission.points.some(p=>p.id==='hr-reception'));
});

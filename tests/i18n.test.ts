import test from 'node:test';
import assert from 'node:assert/strict';
import {LOCALES,curatedPhraseCount,isLocale,localeInfo,lookupTranslation} from '../src/lib/i18n.ts';
import {CAREER_SECTORS,ROLE_CATALOG} from '../src/lib/career-catalog.ts';

test('website languages include English, Malay, Tamil, Chinese and Burmese',()=>{
 assert.deepEqual(LOCALES.map(language=>language.code),['en','ms','ta','zh','my']);
 assert.equal(isLocale('ta'),true);
 assert.equal(isLocale('invalid'),false);
 assert.equal(localeInfo('ms').speechLang,'ms-MY');
 assert.equal(localeInfo('my').htmlLang,'my');
 assert.equal(localeInfo('my').speechLang,'my-MM');
});
test('offline UI dictionary covers critical workflows',()=>{
 assert.ok(curatedPhraseCount()>=200);
 for(const lang of ['ms','ta','zh'] as const){
  for(const phrase of ['Your workspace','Find jobs & companies','Messages','AI Mock Interview','Share screen','Apply now','Publish post','My applications','Upload slides']){
   const result=lookupTranslation(phrase,lang);
   assert.ok(result&&result!==phrase,`Missing ${lang} translation: ${phrase}`);
  }
 }
});
test('translation restores original source without modifying app state',()=>{
 assert.equal(lookupTranslation('  Search posts  ','ms'),'  Cari siaran  ');
 assert.equal(lookupTranslation('Save','ta'),'சேமி');
 assert.equal(lookupTranslation('Welcome back','en'),'Welcome back');
 assert.equal(lookupTranslation('ProofMatch AI','ms'),null);
 assert.equal(lookupTranslation('Save!','zh'),'保存!');
 assert.equal(lookupTranslation('  ','ms'),'  ');
});

test('Mandarin uses simplified Chinese script and Chinese speech locale',()=>{
 const mandarin=localeInfo('zh');
 assert.match(mandarin.label,/Mandarin/);
 assert.equal(mandarin.htmlLang,'zh-Hans');
 assert.equal(mandarin.speechLang,'zh-CN');
 assert.match(mandarin.nativeName,/普通话/);
});

test('four-language glossary includes all essential platform areas offline',()=>{
 assert.ok(curatedPhraseCount()>=500,'Expected detailed curated glossary');
 const areas=[
  'Browse jobs','Companies','Apply for this role','Recruiter desk','Full name',
  'Messages','Send a message','Community feed','Publish post',
  'Start interview','Share screen','Choose slides','Speaker notes','Interview report',
  'Analyze CV','Matched skills','Evidence source','Skill gaps','See the evidence'
 ];
 for(const locale of ['ms','ta','zh'] as const){
  for(const text of areas){
   const translated=lookupTranslation(text,locale);
   assert.ok(translated&&translated!==text,`${locale}: missing ${text}`);
  }
 }
});

test('dynamic counts are localized without modifying numeric values',()=>{
 assert.equal(lookupTranslation('Page 3 of 12','ms'),'Halaman 3 daripada 12');
 assert.equal(lookupTranslation('Page 3 of 12','zh'),'第 3 页，共 12 页');
 assert.equal(lookupTranslation('38 companies','ta'),'38 நிறுவனங்கள்');
 assert.equal(lookupTranslation('85 positions match your search','zh'),'85 个职位符合您的搜索条件');
});

test('every career and industry is available in Malay, Tamil and Mandarin offline',()=>{
 assert.ok(ROLE_CATALOG.length>=109);
 assert.ok(CAREER_SECTORS.length>=26);
 for(const locale of ['ms','ta','zh'] as const){
  for(const role of ROLE_CATALOG){assert.ok(lookupTranslation(role.title,locale),`${locale}: ${role.title}`)}
  for(const sector of CAREER_SECTORS){assert.ok(lookupTranslation(sector,locale),`${locale}: ${sector}`)}
 }
});

test('critical actions and dialogs use all four supported languages without a network request',()=>{
 const actions=[
  'Fill this with sample','Add to calendar','All candidates','Analyze new CV','Browse all jobs',
  'View company profile','Set up interview','Export transcript','Share screen','Upload slides',
  'Send my response','Clear selection','Review the evidence','Open messages','View report',
  'Delete this post?','Remove this conversation from this workspace?'
 ];
 for(const target of ['ms','ta','zh'] as const){
  for(const action of actions){
   const translated=lookupTranslation(action,target);
   assert.ok(translated&&translated!==action,`Untranslated ${target} interface action: ${action}`);
  }
 }
});

test('dynamic action labels localize the frame but preserve private names and values',()=>{
 assert.equal(lookupTranslation('Message Aisha Rahman…','ms'),'Mesej kepada Aisha Rahman…');
 assert.equal(lookupTranslation('Follow Priya Nair','zh'),'关注 Priya Nair');
 assert.equal(lookupTranslation('Go to slide 4','ta'),'ஸ்லைடு 4-க்குச் செல்');
 assert.equal(lookupTranslation('PDF slide 12','zh'),'PDF 第 12 张幻灯片');
 assert.equal(lookupTranslation('Slide 3: Project results','ms'),'Slaid 3: Project results');
 assert.equal(lookupTranslation('Page 3 of 12','en'),'Page 3 of 12');
});

test('the browser tab title is localized while the brand remains the same',()=>{
 for(const locale of ['ms','ta','zh'] as const){
  const title=lookupTranslation('ProofMatch AI | Great talent deserves to be seen',locale);
  assert.ok(title?.startsWith('ProofMatch AI | '));
  assert.notEqual(title,'ProofMatch AI | Great talent deserves to be seen');
 }
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {STATIC_UI_PHRASES} from '../src/lib/i18n-ui-phrases.ts';
import {curatedPhraseCount} from '../src/lib/i18n.ts';
const read=(file:string)=>readFileSync(new URL(file,import.meta.url),'utf8');

test('the translated interface includes the entire authored-page UI vocabulary',()=>{
 assert.ok(STATIC_UI_PHRASES.size>=1700,'Expected source-derived site-wide UI vocabulary');
 assert.ok(curatedPhraseCount()>=850,'Expected expanded offline translations for critical labels');
 for(const phrase of ['Messages','New message','Your workspace','AI Mock Interview','Share screen','Browse jobs','Speaker notes']){
  assert.ok(STATIC_UI_PHRASES.has(phrase),`Missing app-authored phrase: ${phrase}`);
 }
});

test('all routes and native action labels share one automatic translation engine',()=>{
 const provider=read('../src/components/language-provider.tsx');
 assert.match(provider,/scan\(document\.body\)/);
 assert.match(provider,/MutationObserver/);
 assert.match(provider,/\['placeholder','aria-label','aria-description','aria-placeholder','aria-roledescription','title','alt','data-tooltip'\]/);
 assert.match(provider,/HTMLInputElement/);
 assert.match(provider,/canCloudTranslate\(source,node\)/);
 assert.doesNotMatch(provider,/pathname\s*!==\s*['"]\/demo\/analyze['"]\s*&&/);
});

test('applicant records, typed messages and interview answers are protected from automatic cloud translation',()=>{
 const provider=read('../src/components/language-provider.tsx');
 const messages=read('../src/app/demo/network/messages/page.tsx');
 const interview=read('../src/app/demo/career/interview/page.tsx');
 const opportunities=read('../src/app/demo/opportunities/page.tsx');
 assert.match(provider,/\[data-private-content\]/);
 assert.match(messages,/data-private-content=\{\/\^m-/);
 assert.match(interview,/data-private-content=\{turn\.skipped\?/);
 assert.match(opportunities,/data-private-content="true">\{a\.fullName\}/);
});

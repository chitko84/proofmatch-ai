import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANDING_HERO_COPY} from '../src/lib/i18n-landing.ts';
import {lookupTranslation} from '../src/lib/i18n.ts';

const read=(path:string)=>readFileSync(new URL('../'+path,import.meta.url),'utf8');

test('landing headline, description and CTAs are translated in all four languages without an API',()=>{
 for(const locale of ['en','ms','zh','ta'] as const){
  const copy=LANDING_HERO_COPY[locale];
  for(const key of ['eyebrow','lineOne','lineTwo','highlight','description','explore','seeHow','meeting','hint'] as const){
   assert.ok(copy[key].trim().length>=2,`${locale} missing ${key}`);
  }
  assert.ok(copy.description.includes('ProofMatch'));
  if(locale!=='en')assert.notEqual(copy.description,LANDING_HERO_COPY.en.description);
 }
 const hero=read('src/components/landing-hero-copy.tsx');
 assert.match(hero,/LANDING_HERO_COPY\[locale\]/);
 assert.match(hero,/copy\.description/);
 assert.match(hero,/\/demo\/candidate/);
 assert.match(hero,/\/demo"/);
 assert.match(read('src/app/page.tsx'),/<LandingHeroCopy\/>/);
});

test.skip('workspace has separate role menus, an active top switcher and local preference',()=>{
 const shell=read('src/components/workspace-shell.tsx');
 assert.match(shell,/candidateSections/);
 assert.match(shell,/hrSections/);
 assert.match(shell,/localStorage\.setItem\(VIEW_KEY,next\)/);
 assert.match(shell,/aria-pressed=\{view==='candidate'\}/);
 assert.match(shell,/aria-pressed=\{view==='hr'\}/);
 assert.match(shell,/router\.push\(next==='candidate'\?'\/demo\/candidate':'\/demo'\)/);
 for(const route of ['/demo/talent','/demo/partners','/demo/career/company','/demo/career/simulator','/demo/network/messages'])assert.ok(shell.includes(route),route);
});

test('role switch labels localize instantly',()=>{
 for(const language of ['ms','zh','ta'] as const){
  for(const phrase of ['Candidate View','HR View','HIRING WORKSPACE','CANDIDATE WORKSPACE','NEWS & COMMUNITY']){
   const localized=lookupTranslation(phrase,language);
   assert.ok(localized&&localized!==phrase,`${language} ${phrase}`);
  }
 }
});

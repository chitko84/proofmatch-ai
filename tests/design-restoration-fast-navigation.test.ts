import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {getTalentWatchSignals} from '../src/lib/talent-watch.ts';
import {directorySignals} from '../src/lib/featured-watch-signals.ts';
import {TALENT_CANDIDATES,assessTalentForJob} from '../src/lib/talent-ecosystem.ts';
import {OPPORTUNITIES} from '../src/lib/career-catalog.ts';

const read=(relative:string)=>readFileSync(new URL(relative,import.meta.url),'utf8');
test('premium HR Overview restores the original hero, metrics, watch and quick actions',()=>{
 const source=read('../src/app/demo/page.tsx');
 for(const piece of ['workspace-welcome','welcome-picture','workspace-stats','metric-card','ProofWatch mode="directory"','two-column-grid','quick-actions'])assert.ok(source.includes(piece),`Missing restored dashboard feature: ${piece}`);
 for(const route of ['/demo/studio','/demo/discover','/demo/futurepath','/demo/interview','/demo/partners','/demo/reviews'])assert.ok(source.includes(route));
});
test('Blindspot Rescue keeps the premium watch and a responsive 1,200-person candidate directory',()=>{
 const source=read('../src/app/demo/discover/page.tsx');
 for(const piece of ['discovery-hero','ProofWatch compact mode="directory"','useDeferredValue','searchIndex','PAGE_SIZE=12','pm-directory-person','/demo/candidate-compare?candidate=','onPointerEnter','onFocus'])assert.ok(source.includes(piece),`Missing directory feature: ${piece}`);
 const css=read('../src/app/demo/discover/rescue-polish.css');
 assert.match(css,/pm-directory-grid/);
 assert.match(css,/@media\(max-width:760px\)/);
});
test('ProofWatch featured role discoveries are grounded in the actual fictional records',()=>{
 const recalculated=getTalentWatchSignals(TALENT_CANDIDATES,OPPORTUNITIES);
 assert.deepEqual(directorySignals,recalculated);
 assert.ok(directorySignals.length>=5);
 for(const signal of directorySignals){
  const candidate=TALENT_CANDIDATES.find(c=>c.id===signal.candidateId);
  const original=OPPORTUNITIES.find(j=>j.id===candidate?.appliedJobId);
  const alternative=OPPORTUNITIES.find(j=>j.id===signal.alternativeRoleId);
  assert.ok(candidate&&original&&alternative);
  assert.ok(assessTalentForJob(candidate,alternative).score>assessTalentForJob(candidate,original).score);
  assert.ok(candidate.evidence.some(e=>e.kind==='portfolio_example'&&e.excerpt===signal.evidenceLine));
 }
});
test('navigation keeps immediate urgent prefetch, bounded background warmups and no click timer',()=>{
 const source=read('../src/components/workspace-shell.tsx');
 assert.match(source,/onPointerEnter=\{\(\)=>warmRoute\(item.href,true\)\}/);
 assert.match(source,/onPointerDown=\{\(\)=>warmRoute\(item.href,true\)\}/);
 assert.match(source,/\.slice\(0,2\)/);
 assert.match(source,/router\.push\(next==='candidate'/);
 assert.doesNotMatch(source,/setTimeout\([^)]*router\.push/);
});

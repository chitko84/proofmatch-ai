import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {candidates,roles} from '../src/lib/data.ts';
import {assessMatch} from '../src/lib/engine.ts';
import {DEMO_INTAKE,DEMO_WEEKS,DEFAULT_INSIGHT_FILTERS,getFilteredCandidates,getInsights} from '../src/lib/analytics.ts';

test('Every existing demo candidate has one intake date within the four-week story',()=>{
 assert.equal(Object.keys(DEMO_INTAKE).length,candidates.length);
 for(const c of candidates){assert.match(DEMO_INTAKE[c.id],/^2026-\d\d-\d\d$/);assert.ok(DEMO_WEEKS.some(w=>DEMO_INTAKE[c.id]>=w.from&&DEMO_INTAKE[c.id]<=w.to))}
});
test('Recruiter metrics are derived from the candidate dataset and matching rules',()=>{
 const data=getInsights(DEFAULT_INSIGHT_FILTERS);
 assert.equal(data.people.length,candidates.length);
 assert.equal(data.roleComparisons,candidates.length*roles.length);
 assert.equal(data.intakes.reduce((s,v)=>s+v.count,0),candidates.length);
 assert.equal(data.jobCounts.reduce((s,v)=>s+v.count,0),candidates.length);
 assert.equal(data.tierCounts.reduce((s,v)=>s+v.count,0),candidates.length*roles.length);
 assert.equal(data.requirementsChecked,candidates.length*roles.reduce((s,r)=>s+r.requirements.length,0));
 assert.equal(data.backed,candidates.flatMap(c=>roles.map(r=>assessMatch(c,r))).flatMap(r=>r.assessments).filter(a=>a.support==='artifact').length);
 assert.ok(data.alternative.some(x=>x.person.id==='C01'&&x.best.roleId==='qa'));
});
test('Filtered KPIs, trend, job chart, and alternatives agree with each other',()=>{
 for(const range of ['all','last2','latest'] as const)for(const job of ['all',...roles.map(r=>r.id)])for(const location of ['all','Penang','Kuala Lumpur','Kedah']){
  const opts={...DEFAULT_INSIGHT_FILTERS,range,appliedRole:job,location};
  const data=getInsights(opts);
  assert.equal(data.people.length,getFilteredCandidates(opts).length);
  assert.equal(data.intakes.reduce((s,v)=>s+v.count,0),data.people.length);
  assert.equal(data.jobCounts.reduce((s,v)=>s+v.count,0),data.people.length);
  assert.equal(data.jobCounts.reduce((s,v)=>s+v.alternatives,0),data.alternative.length);
  assert.ok(data.coverage>=0&&data.coverage<=100);
 }
});
test('Work-style filters restrict results to people who selected that preference',()=>{
 for(const mode of ['remote','hybrid','onsite'] as const){const data=getInsights({...DEFAULT_INSIGHT_FILTERS,workMode:mode});assert.ok(data.people.every(c=>c.preferredModes.includes(mode)))}
});
test('An impossible filter gives a safe, fully empty dataset rather than misleading percentages',()=>{
 const data=getInsights({...DEFAULT_INSIGHT_FILTERS,appliedRole:'analyst',location:'Kedah',workMode:'onsite'});
 assert.equal(data.people.length,0);assert.equal(data.coverage,0);assert.equal(data.roleComparisons,0);assert.equal(data.intakes.reduce((s,v)=>s+v.count,0),0);
});
test('New homepage visual is interactive and references genuine role comparisons',()=>{
 const src=fs.readFileSync('src/components/talent-orbit.tsx','utf8');
 assert.match(src,/assessMatch\(/);assert.match(src,/aria-pressed=/);assert.match(src,/onClick=/);assert.match(src,/role=\$\{role.id\}/);assert.match(src,/Not independently verified/);
 assert.match(fs.readFileSync('src/app/page.tsx','utf8'),/<TalentOrbit\/>/);
});
test('Navigation, overview, and guided demo link to the newly added insights page',()=>{
 for(const f of ['src/components/workspace-shell.tsx','src/app/demo/page.tsx','src/app/demo/guide/page.tsx'])assert.match(fs.readFileSync(f,'utf8'),/\/demo\/insights/);
 assert.ok(fs.existsSync('src/app/demo/insights/page.tsx'));
});
test('Charts and filters are interactive and their data is explicitly fictional',()=>{
 const src=fs.readFileSync('src/app/demo/insights/page.tsx','utf8');
 for(const keyword of ['getInsights(filters)','useMemo','onChange=','Reset filters','svg','conic-gradient','data.recent','data.alternative','fictional','roleComparisons'])assert.ok(src.includes(keyword),keyword);
});

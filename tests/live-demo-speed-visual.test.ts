import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {addStudioFinish,buildCareerWorldGeometry,makeOfficeEmployeeGeometry,makePersonGeometry,MATERIAL} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';

const read=(name:string)=>readFileSync(new URL(name,import.meta.url),'utf8');

test('all-workspace navigation avoids prefetch storms while warming likely and hovered pages',()=>{
 const shell=read('../src/components/workspace-shell.tsx');
 assert.match(shell,/prefetch=\{false\}/);
 assert.match(shell,/onMouseEnter=\{\(\)=>warmRoute\(item\.href\)\}/);
 assert.match(shell,/warmedRoutes/);
 assert.match(shell,/\.slice\(0,2\)/);
 assert.match(shell,/workspace-route-progress/);
 assert.doesNotMatch(shell,/1600\);/);
});

test('sitewide repeated entrance visits are instantaneous and first entrance is bounded',()=>{
 const intro=read('../src/components/landing-door-intro.tsx');
 const portal=read('../src/components/door-portal.tsx');
 assert.match(intro,/proofmatch-entrance-seen/);
 assert.match(intro,/setOpening\(true\), 160/);
 assert.match(intro,/dismiss\(\), 930/);
 const click=portal.slice(portal.indexOf('function enter('),portal.indexOf('function skip('));
 assert.match(click,/router\.push\('\/demo'\)/);
 assert.doesNotMatch(click,/setTimeout\(\(\) => router\.push/);
});

test.skip('large job and talent directories keep typing responsive using deferred filters',()=>{
 for(const file of ['../src/app/demo/talent/page.tsx','../src/app/demo/opportunities/page.tsx']){
  const content=read(file);
  assert.match(content,/useDeferredValue\(query\)/);
  assert.match(content,/deferredQuery/);
 }
});

test('premium 3D floors have new lighting/furnishing detail within the existing laptop budget',()=>{
 for(const kind of ['company','simulator'] as const){
  for(const mission of careerWorlds[kind]){
   const faces=buildCareerWorldGeometry(mission,kind);
   const bytes=packWorldFaces(faces).byteLength;
   assert.ok(bytes<1_500_000,`${mission.id}: ${bytes} bytes exceeds the 1.5MB budget`);
   assert.ok(faces.some(f=>f.material===MATERIAL.glass));
   assert.ok(faces.some(f=>f.material===MATERIAL.display&&f.glow));
  }
 }
 const studio=read('../src/lib/career-world-geometry.ts');
 assert.match(studio,/addStudioFinish\(out,mission,kind\)/);
 const employee=makeOfficeEmployeeGeometry(0,0,'#339988');
 const hero=makePersonGeometry(0,0,Math.PI,{shirt:'#339988'});
 assert.ok(packWorldFaces(employee).byteLength<packWorldFaces(hero).byteLength*.5);
 assert.ok(employee.some(f=>Array.isArray(f.normals)),'Even light background people retain smooth shading');
});

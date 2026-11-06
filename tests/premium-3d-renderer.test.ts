import assert from 'node:assert/strict';
import test from 'node:test';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {buildCareerWorldGeometry,MATERIAL} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';
import {readFileSync} from 'node:fs';

const component=readFileSync(new URL('../src/components/interactive-career-world.tsx',import.meta.url),'utf8');
const arena=readFileSync(new URL('../src/components/career-accelerator.tsx',import.meta.url),'utf8');

test('all career worlds have rich, theme-specific 3D scene geometry',()=>{
 for(const kind of ['company','simulator','crisis'] as const){
  for(const mission of careerWorlds[kind]){
   const faces=buildCareerWorldGeometry(mission,kind);
   assert.ok(faces.length>350,`${mission.id} needs a richly furnished scene`);
   assert.ok(faces.some(face=>face.material===MATERIAL.floor));
   assert.ok(faces.some(face=>face.material===MATERIAL.glass));
   assert.ok(faces.some(face=>face.material===MATERIAL.metal));
   assert.ok(faces.some(face=>face.material===MATERIAL.display&&face.glow));
   assert.ok(faces.every(face=>face.vertices.length>=3&&face.vertices.every(v=>v.length===3&&v.every(Number.isFinite))));
  }
 }
});

test('GPU vertex packing is deterministic, correctly strided, finite and bounded',()=>{
 const mission=careerWorlds.company[0];
 const scene=buildCareerWorldGeometry(mission,'company');
 const a=packWorldFaces(scene),b=packWorldFaces(scene);
 assert.ok(a.length>10_000);
 assert.equal(a.length%11,0);
 assert.ok(a.length<2_000_000,'scene must remain practical for integrated GPUs');
 assert.deepEqual(a,b);
 assert.ok(a.every(Number.isFinite));
 assert.ok(a.some((v,i)=>i%11===9&&v===1),'glowing workstation materials must be present');
});

test('premium career worlds retain accessible controls and a compatibility renderer',()=>{
 assert.match(component,/PremiumWorldRenderer/);
 assert.match(component,/drawWorldMarkers/);
 assert.match(component,/drawWorld\(ctx/);
 assert.match(component,/worldPositionBlocked/);
 assert.match(component,/setActive\(null\)/);
 assert.match(component,/requestFullscreen/);
 assert.match(component,/localStorage\.setItem/);
 assert.match(component,/cw-gpu-layer/);
 assert.match(component,/cw-input-layer/);
});

test('CareerVerse quiz uses the working question bank in a polished website interface',()=>{
 assert.match(arena,/ac-arena-flat/);
 assert.match(arena,/ac-answer-platform/);
 assert.match(arena,/ac-answer-platform/);
 assert.match(arena,/CAREER_QUIZ_CATEGORIES/);
 assert.match(arena,/onClick=\{\(\)=>answer\(i\)\}/);
});

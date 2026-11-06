import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {buildCareerWorldGeometry,worldVisualProfile,MATERIAL} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';

test('all four company floors have distinct visual themes and complete 3D scene palettes',()=>{
 const themeNames=careerWorlds.company.map(m=>worldVisualProfile(m,'company').theme);
 assert.equal(new Set(themeNames).size,4);
 for(const floor of careerWorlds.company){
  const p=worldVisualProfile(floor,'company');
  for(const value of [p.wall,p.floor,p.ceiling,p.trim,p.warm,p.dark])assert.match(value,/^#[a-f0-9]{6}$/i);
  const geometry=buildCareerWorldGeometry(floor,'company');
  assert.ok(geometry.length>2750,`Floor ${floor.id} should have a richly authored environment`);
  assert.ok(geometry.every(f=>f.vertices.length>=3&&/^#[a-f0-9]{6}$/i.test(f.color)));
  assert.ok(geometry.some(f=>f.material===MATERIAL.wood));
  assert.ok(geometry.some(f=>f.material===MATERIAL.glass));
  assert.ok(geometry.some(f=>f.material===MATERIAL.display&&f.glow));
  const packed=packWorldFaces(geometry);
  assert.equal(packed.length%11,0);
  assert.ok(packed.byteLength<1_500_000,'Scene meshes should remain compact for integrated laptops');
  assert.ok(packed.every(Number.isFinite));
 }
});

test('HR manager simulation receives the cinematic environment improvements',()=>{
 for(const kind of ['simulator'] as const){
  for(const scene of careerWorlds[kind]){
   const faces=buildCareerWorldGeometry(scene,kind);
   assert.ok(faces.length>2200,scene.id);
   assert.ok(faces.every(f=>/^#[0-9a-f]{6}$/i.test(f.color)));
   assert.ok(faces.some(f=>f.glow&&f.material===MATERIAL.display));
  }
 }
});

test('GPU rendering has material highlights, floor reflections, and context-loss fallback',()=>{
 const source=readFileSync('src/components/premium-world-webgl.ts','utf8');
 for(const phrase of ['float fresnel','softReflections','float trace','filmic tonemap'])assert.ok(source.includes(phrase),phrase);
 const component=readFileSync('src/components/interactive-career-world.tsx','utf8');
 for(const phrase of ['webglcontextlost','webglcontextrestored','drawWorld(ctx','rotate(${player.yaw-Math.PI}rad)'])assert.ok(component.includes(phrase),phrase);
});

test('tower retains the complete interactive elevator and building directory',()=>{
 const component=readFileSync('src/components/interactive-career-world.tsx','utf8');
 for(const phrase of ['cw-tower-floor','cw-lift-floor-grid','cw-elevator-transition','setMissionId(id)','worldPositionBlocked'])assert.ok(component.includes(phrase),phrase);
 const styles=readFileSync('src/components/interactive-career-world.css','utf8');
 for(const phrase of ['cw-tower-visual:hover','cw-map-person:after','prefers-reduced-motion:reduce'])assert.ok(styles.includes(phrase),phrase);
});

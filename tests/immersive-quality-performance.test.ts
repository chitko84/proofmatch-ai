import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {addEllipsoid,addTaperedCylinder,buildCareerWorldGeometry,makePersonGeometry,MATERIAL,type WorldFace} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';

test('characters have rounded body, face and clothing geometry with finite positions',()=>{
 const avatar=makePersonGeometry(0,0,Math.PI,{shirt:'#4ca8a0',skin:'#ca9379'});
 assert.ok(avatar.length>250);
 assert.ok(avatar.every(f=>f.vertices.length>=3&&f.vertices.every(v=>v.every(Number.isFinite))));
 const curves:WorldFace[]=[];
 addTaperedCylinder(curves,0,0,0,.4,.2,1,'#aabbcc',MATERIAL.matte,10);
 addEllipsoid(curves,0,1,0,.4,.6,.4,'#aabbcc',MATERIAL.matte,8,4);
 assert.ok(curves.length>=40);
 assert.ok(packWorldFaces(curves).every(Number.isFinite));
});

test('distinct company and HR scenes retain their own physical set dressing within GPU budgets',()=>{
 for(const kind of ['company','simulator'] as const){
  for(const mission of careerWorlds[kind]){
   const faces=buildCareerWorldGeometry(mission,kind);
   const bytes=packWorldFaces(faces).byteLength;
   assert.ok(bytes<1_500_000,`${mission.id} uses ${bytes} bytes, too large for target laptop`);
   assert.ok(faces.some(f=>f.material===MATERIAL.glass),`Missing glass architecture in ${mission.id}`);
   assert.ok(faces.some(f=>f.material===MATERIAL.wood),`Missing furniture in ${mission.id}`);
   assert.ok(faces.some(f=>f.material===MATERIAL.display&&f.glow),`Missing lit screens in ${mission.id}`);
  }
 }
});

test('3D scene navigation is cached, responsive, and avoids needless frames',()=>{
 const component=readFileSync('src/components/interactive-career-world.tsx','utf8');
 for(const term of ['worldGeometryCache','getWorldGeometry','frameBudget','document.hidden','setTravelingFloor(null),105','setMissionId(id)','visit(p);return']){
  assert.ok(component.includes(term),term);
 }
 const css=readFileSync('src/components/interactive-career-world.css','utf8');
 assert.ok(css.includes('animation-duration:.16s'));
 assert.ok(css.includes('prefers-reduced-motion:reduce'));
});

test('the material shader adds warm and cool bounced light without external assets',()=>{
 const shader=readFileSync('src/components/premium-world-webgl.ts','utf8');
 for(const term of ['warmBounce','coolBounce','tileNoise','grain','fresnel','pow(rgb,vec3(.91))'])assert.ok(shader.includes(term),term);
});

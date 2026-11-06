import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {buildCareerWorldGeometry,makePersonGeometry,MATERIAL} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';

test('curved avatar parts use physically meaningful smooth unit normals that follow body rotation',()=>{
 const avatar=makePersonGeometry(1,2,Math.PI+.7,{shirt:'#32a78c',skin:'#b98469'},.25);
 const smoothed=avatar.filter(face=>face.normals?.length===face.vertices.length);
 assert.ok(smoothed.length>80,'avatar should contain detailed smooth surfaces');
 for(const face of smoothed){
  for(const normal of face.normals??[]){
   assert.ok(normal.every(Number.isFinite));
   assert.ok(Math.abs(Math.hypot(...normal)-1)<.03,'smooth normals should be unit vectors');
  }
 }
 for(const mat of [MATERIAL.skin,MATERIAL.fabric,MATERIAL.leather]){
  assert.ok(avatar.some(face=>face.material===mat),`character should have dedicated material ${mat}`);
 }
 const packed=packWorldFaces(avatar);
 assert.ok(packed.every(Number.isFinite));
 const differentNormals=new Set<string>();
 for(let i=0;i<packed.length;i+=11)differentNormals.add(`${packed[i+3].toFixed(2)},${packed[i+4].toFixed(2)},${packed[i+5].toFixed(2)}`);
 assert.ok(differentNormals.size>50,'curved surfaces should not be flat shaded');
});

test('floor lighting receives bounded station coordinates and has a low-cost falloff',()=>{
 const shader=readFileSync('src/components/premium-world-webgl.ts','utf8');
 const world=readFileSync('src/components/interactive-career-world.tsx','utf8');
 assert.match(shader,/uniform vec2 uStations\[8\]/);
 assert.match(shader,/uStationCount/);
 assert.match(shader,/this\.stationCount=Math\.min\(8,stationPoints\.length\)/);
 assert.match(shader,/stationShade=max\(stationShade/);
 assert.match(shader,/gl\.uniform2fv\(this\.uniforms\.uStations,this\.stations\)/);
 assert.match(world,/mission\.accent,geom\.current,mission\.points/);
 assert.match(world,/overlayOpen\.current\?10/);
 const company=careerWorlds.company[0];
 assert.ok(company.points.length<=8,'shader station array supports all floor interaction points');
});

test('the polished scenes remain practical to buffer and maintain browser-local interactions',()=>{
 for(const kind of ['company','simulator'] as const){
  for(const mission of careerWorlds[kind]){
   const mesh=packWorldFaces(buildCareerWorldGeometry(mission,kind));
   assert.ok(mesh.length<2_000_000,`${mission.id}: must stay within reasonable GPU upload size`);
   assert.ok(mesh.every(Number.isFinite));
  }
 }
 const world=readFileSync('src/components/interactive-career-world.tsx','utf8');
 assert.match(world,/worldGeometryCache/);
 assert.match(world,/getWorldGeometry/);
 assert.match(world,/setTravelingFloor\(null\),105/);
 assert.match(world,/setActive\(p\)/);
 assert.match(world,/localStorage\.setItem/);
});

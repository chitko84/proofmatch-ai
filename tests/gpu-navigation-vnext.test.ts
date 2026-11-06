import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {addSignatureInteriors,buildCareerWorldGeometry,MATERIAL} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';
const source=(path:string)=>readFileSync(new URL(path,import.meta.url),'utf8');

test('WebGL program and per-floor GPU mesh buffers are reused rather than compiled on every click',()=>{
 const renderer=source('../src/components/premium-world-webgl.ts');
 const world=source('../src/components/interactive-career-world.tsx');
 for(const part of ['floorBuffers=new WeakMap','ownedFloorBuffers=new Set','setScene(kind:WorldKind','this.floorBuffers.get(geometry)','this.floorBuffers.set(geometry,existing)'])assert.ok(renderer.includes(part),part);
 assert.ok(world.includes('sharedRenderer.current.setScene(kind,mission.accent,geom.current,mission.points)'));
 assert.ok(world.includes('sharedRenderer.current?.dispose()'));
 assert.ok(!world.includes('renderer?.dispose();')); // Do not destroy the program on elevator rides.
 assert.ok(world.includes('setTravelingFloor(null),105'));
});

test('each company floor has distinct signature interior identity inside a bounded GPU budget',()=>{
 const tags=['atrium','technology','business','people'];
 for(const [i,floor] of careerWorlds.company.entries()){
  const faces=buildCareerWorldGeometry(floor,'company');
  const finish=[] as typeof faces;
  addSignatureInteriors(finish,floor,'company');
  assert.ok(finish.length>15,`${tags[i]} lacks new focal architecture`);
  assert.ok(faces.some(face=>face.material===MATERIAL.glass));
  assert.ok(faces.some(face=>face.material===MATERIAL.wood));
  assert.ok(packWorldFaces(faces).byteLength<1_500_000,`${floor.id} exceeds graphics bandwidth budget`);
 }
 const hr=[] as ReturnType<typeof buildCareerWorldGeometry>;
 addSignatureInteriors(hr,careerWorlds.simulator[0],'simulator');
 assert.ok(hr.length>20);
 assert.ok(hr.some(f=>f.material===MATERIAL.wood));
});

test('adaptive 3D quality and idle UI avoids unnecessary React updates',()=>{
 const world=source('../src/components/interactive-career-world.tsx');
 for(const part of ['graphicsMode',"'auto'|'quality'|'performance'", "graphicsMode==='quality'?2", "graphicsMode==='performance'?1", '(isMoving||isLooking||turn!==0)', 'sharedRenderer'])assert.ok(world.includes(part),part);
});

test.skip('site-wide navigation and both large directories use deduplication and search indexes',()=>{
 const shell=source('../src/components/workspace-shell.tsx');
 const talent=source('../src/app/demo/talent/page.tsx');
 const jobs=source('../src/app/demo/opportunities/page.tsx');
 for(const part of ['warmedRoutes','45000','warmRoute(target)','onTouchStart={()=>warmRoute(item.href)}','router.prefetch(href)'])assert.ok(shell.includes(part),part);
 assert.ok(talent.includes('candidateSearchIndex'));
 assert.ok(jobs.includes('jobSearchIndex'));
 assert.ok(jobs.includes('companyJobCounts'));
});

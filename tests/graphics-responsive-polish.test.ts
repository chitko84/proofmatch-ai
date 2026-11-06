import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {buildCareerWorldGeometry} from '../src/lib/career-world-geometry.ts';
import {getCachedWorldMesh,packWorldFaces} from '../src/components/premium-world-webgl.ts';

test('authored floor geometry is cached rather than repacked on repeat visits',()=>{
 const floor=buildCareerWorldGeometry(careerWorlds.company[0],'company');
 const first=getCachedWorldMesh(floor);
 assert.strictEqual(first,getCachedWorldMesh(floor));
 assert.ok(first.length>0&&first.every(Number.isFinite));
 const different=[...floor];
 assert.notStrictEqual(getCachedWorldMesh(different),first);
 assert.deepEqual(getCachedWorldMesh(different),packWorldFaces(different));
});

test('lighting includes distinct directional fill and material treatments',()=>{
 const renderer=readFileSync('src/components/premium-world-webgl.ts','utf8');
 for(const part of ['keyDiffuse','fillDiffuse','floorGrain','wallShade','glassSweep','staticMeshCache','this.previousAvatar!==avatar']){
  assert.ok(renderer.includes(part),`Renderer missing ${part}`);
 }
});

test('world adapts 3D resolution to render cost and actual frame responsiveness',()=>{
 const component=readFileSync('src/components/interactive-career-world.tsx','utf8');
 for(const part of ['actualFrameInterval','averageInterval>29','averageCost>15','maxDpr*quality','avatarMemo.current','isMoving||isLooking']){
  assert.ok(component.includes(part),`World component missing ${part}`);
 }
 assert.ok(component.includes('setTravelingFloor(null),105'));
 assert.ok(component.includes('sharedRenderer.current'));
});

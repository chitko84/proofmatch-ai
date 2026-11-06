import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {careerWorlds,worldById,scoreWorld,worldPositionBlocked,isCompanyElevator} from '../src/lib/career-worlds.ts';
import {COMPANIES} from '../src/lib/career-catalog.ts';
import {lookupTranslation} from '../src/lib/i18n.ts';
import {companyPhoto} from '../src/lib/company-photography.ts';

test('four-floor company tour and HR manager game contain meaningful playable points',()=>{
 assert.equal(careerWorlds.company.length,4);
 assert.ok(careerWorlds.company.every((floor,i)=>floor.field.startsWith(`Floor ${i+1}`)));
 assert.ok(careerWorlds.simulator.length===1);
 assert.ok(careerWorlds.crisis.length===0);
 for(const [kind,missions] of Object.entries(careerWorlds))for(const mission of missions){
  assert.ok(mission.points.length>=3,kind);
  assert.equal(new Set(mission.points.map(p=>p.id)).size,mission.points.length);
  assert.ok(mission.points.every(p=>p.name&&p.details&&Number.isFinite(p.x)&&Number.isFinite(p.z)));
  assert.equal(worldById(kind as keyof typeof careerWorlds,mission.id).title,mission.title);
  if(kind!=='company'){
   const taskPoints=mission.points.filter(p=>p.task);
   assert.ok(taskPoints.length>=6);
   assert.ok(taskPoints.every(p=>p.task!.choices.length===3));
   assert.ok(taskPoints.every(p=>p.task!.choices.filter(c=>c.correct).length===1));
   assert.ok(taskPoints.every(p=>new Set(p.task!.choices.map(c=>c.label)).size===3));
   assert.ok(taskPoints.every(p=>p.task!.choices.every(c=>c.effect.length>25)));
  }
 }
});
test('mission scores report only completed decisions',()=>{
 const m=careerWorlds.simulator[0];assert.deepEqual(scoreWorld({},m),{answered:0,total:6,correct:0});
 const tasks=m.points.filter(p=>p.task);
 assert.deepEqual(scoreWorld({[tasks[0].id]:true,[tasks[1].id]:false},m),{answered:2,total:6,correct:1});
});
test('opportunities has separate recruiter and candidate views and CV clinic entry points',()=>{
 const src=readFileSync('src/app/demo/opportunities/page.tsx','utf8');
 for(const term of ['switchView','Candidate view','HR / hiring view','/demo/resume-clinic','/demo/talent','/demo/partners','companyPhoto'])assert.ok(src.includes(term),term);
});
test.skip('new 3D worlds are navigable from career hub and workspace navigation',()=>{
 const files=['src/components/workspace-shell.tsx','src/app/demo/career/page.tsx'];
 for(const page of ['company','simulator','talent-explorer']){
  assert.ok(existsSync(`src/app/demo/career/${page}/page.tsx`));
  for(const file of files)assert.ok(readFileSync(file,'utf8').includes(`/demo/career/${page}`),`${file}:${page}`);
 }
 const scene=readFileSync('src/components/interactive-career-world.tsx','utf8');
 for(const control of ['onPointerMove','keydown','requestFullscreen','localStorage','onClick={()=>tapMove(key)}','cw-minimap','scoreWorld'])assert.ok(scene.includes(control),control);
});
test('workplace photos vary between companies and use external licensed-source imagery',()=>{
 const different=COMPANIES.slice(0,40).map(c=>companyPhoto(c));
 assert.ok(new Set(different).size>=6);
 assert.ok(different.every(url=>url.startsWith('https://images.unsplash.com/')));
});

test('first-person navigation cannot pass through walls and desks',()=>{
 const mission=careerWorlds.company[0];
 assert.equal(worldPositionBlocked(0,10,mission),true);
 assert.equal(worldPositionBlocked(0,0,mission),true);
 assert.equal(worldPositionBlocked(mission.points[0].x,mission.points[0].z,mission),true);
 assert.equal(worldPositionBlocked(0,7,mission),false);
});

test('new career 3D navigation has curated translations in Malay, Tamil and Mandarin',()=>{
 for(const locale of ['ms','ta','zh'] as const){
  for(const label of ['Inside the Company','Career Crisis Arena','Candidate view','HR / hiring view','Restart experience']){
   const translated=lookupTranslation(label,locale);
   assert.ok(translated&&translated!==label,`${label}:${locale}`);
  }
 }
});


test('four-floor tower provides a working elevator destination from every level',()=>{
 assert.equal(careerWorlds.company.length,4);
 const visited=new Set<string>();
 careerWorlds.company.forEach((floor,index)=>{
  const lifts=floor.points.filter(isCompanyElevator);
  assert.equal(lifts.length,1,`floor ${index+1}`);
  assert.equal(lifts[0].id,`tower-elevator-${index+1}`);
  assert.equal(lifts[0].kind,'door');
  assert.ok(!worldPositionBlocked(4,7, floor));
  assert.ok(!visited.has(lifts[0].id));
  visited.add(lifts[0].id);
 });
 const ui=readFileSync('src/components/interactive-career-world.tsx','utf8');
 for(const token of ['cw-tower-model','cw-lift-floor-grid','cw-elevator-transition','setMissionId(id)','setTravelingFloor(destination.title)','missions.map((m,index)']){
  assert.ok(ui.includes(token),`Tower UI missing: ${token}`);
 }
});

test('in-world lift has rendered sliding doors and a floor control panel',()=>{
 const geometry=readFileSync('src/lib/career-world-geometry.ts','utf8');
 for(const token of ['tower-elevator-','Distinct double sliding lift doors','MATERIAL.display'])assert.ok(geometry.includes(token));
 const styles=readFileSync('src/components/interactive-career-world.css','utf8');
 for(const className of ['.cw-tower-floor.is-active','.cw-lift-floor-grid','.cw-elevator-transition'])assert.ok(styles.includes(className));
});

test('tower navigation has offline labels in English, Malay, Tamil and Mandarin',()=>{
 for(const label of ['BUILDING OVERVIEW','FLOOR DIRECTORY','Tower Elevator','ELEVATOR IN MOTION','Places discovered']){
  for(const locale of ['ms','ta','zh'] as const){
   const translated=lookupTranslation(label,locale);
   assert.ok(translated&&translated!==label,`${label}:${locale}`);
  }
 }
});

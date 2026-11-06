import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {careerWorlds} from '../src/lib/career-worlds.ts';
import {HR_STORIES,getHrStory,safeHrResults,hrStoryContext} from '../src/lib/hr-manager-story.ts';
import {LANDING_HERO_COPY} from '../src/lib/i18n-landing.ts';
import {buildCareerWorldGeometry,MATERIAL} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';
const read=(path:string)=>readFileSync(path,'utf8');
test('every HR workstation starts a branching conversation with a named fictional colleague',()=>{
 const points=careerWorlds.simulator[0].points;
 assert.ok(points.length>=11);
 for(const p of points){const s=getHrStory(p.id);assert.ok(s,`Missing story for ${p.id}`);assert.equal(s.id,p.id);assert.ok(s.person.includes(' '));assert.ok(s.opening.length>110);assert.equal(s.routes.length,3);for(const route of s.routes){assert.ok(route.reply.length>35);assert.ok(route.prompt.length>30);assert.equal(route.followups.length,2);assert.notEqual(route.followups[0].outcome,route.followups[1].outcome);}}
 assert.equal(Object.keys(HR_STORIES).length,points.length);
});
test('choices branch to distinct follow-up stories and endings, with reliable saved progression',()=>{
 const story=getHrStory('hr-interview')!;
 assert.notEqual(story.routes[0].reply,story.routes[1].reply);
 assert.notEqual(story.routes[1].prompt,story.routes[2].prompt);
 const valid=safeHrResults({'hr-interview':{primary:0,followup:0,outcome:'manipulated',good:false,reply:'faked',at:'today'},'unknown':{primary:0,followup:0},'hr-events':{primary:22,followup:0}});
 assert.deepEqual(Object.keys(valid),['hr-interview']);
 assert.equal(valid['hr-interview'].good,true);
 assert.equal(valid['hr-interview'].outcome,story.routes[0].followups[0].outcome);
 assert.deepEqual(safeHrResults(null),{});
 assert.match(hrStoryContext('hr-report',{'hr-applicant':valid['hr-interview']})??'',/alternative-role/i);
 assert.equal(hrStoryContext('hr-reception',{}),null);
});
test('HR free roam supports third person, immediate station dialogue and old decision task continuity',()=>{
 const ui=read('src/components/interactive-career-world.tsx');
 assert.match(ui,/kind==='company'\|\|kind==='simulator'/);
 assert.match(ui,/HrManagerDialogue/);
 assert.match(ui,/HR_STORY_STORAGE_KEY/);
 assert.match(ui,/getHrStory\(active.id\)/);
 assert.equal(careerWorlds.simulator[0].points.filter(p=>p.task).length,6);
 assert.match(ui,/visit\(p\);return/);
});
test('all HR character meshes and new story locations stay under the 1.5MB GPU budget',()=>{
 const geometry=buildCareerWorldGeometry(careerWorlds.simulator[0],'simulator');
 assert.ok(packWorldFaces(geometry).byteLength<1_500_000);
 assert.ok(geometry.some(f=>f.material===MATERIAL.skin));
 assert.ok(geometry.some(f=>f.material===MATERIAL.glass));
});
test('Myanmar landing typography scales independently and desktop navigation collapses safely',()=>{
 const css=read('src/components/language.css');
 assert.match(css,/html\[lang="my"\] \.hero-copy h1/);
 assert.match(css,/html\[lang="my"\] \.landing-hero/);
 assert.match(css,/html\[lang="my"\] \.public-links\.public-links-open/);
 assert.match(css,/max-width:1450px/);
 assert.match(css,/max-width:420px/);
 assert.ok(LANDING_HERO_COPY.my.lineOne.length<32);
 assert.ok(LANDING_HERO_COPY.my.description.length>100);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {careerWorlds,isCompanyElevator} from '../src/lib/career-worlds.ts';
import {companyEmployeeFor,employeeResponse} from '../src/lib/company-people.ts';
import {buildCareerWorldGeometry,makePersonGeometry} from '../src/lib/career-world-geometry.ts';
import {packWorldFaces} from '../src/components/premium-world-webgl.ts';
import {lookupTranslation} from '../src/lib/i18n.ts';

test('Company X is four connected floors with unique elevators and 20 conversations',()=>{
 assert.equal(careerWorlds.company.length,4);
 let employees=0;
 for(const [index,floor] of careerWorlds.company.entries()){
  assert.equal(floor.points.filter(isCompanyElevator).length,1);
  assert.ok(floor.field.startsWith(`Floor ${index+1}`));
  for(const point of floor.points){
   const employee=companyEmployeeFor(point,floor);
   if(isCompanyElevator(point)){assert.equal(employee,null);continue;}
   assert.ok(employee,`${floor.id}/${point.id}`);
   assert.ok(employee.name&&employee.greeting.length>25&&employee.role.length>4);
   for(const topic of ['work','skills','culture'] as const)assert.ok(employeeResponse(employee,topic).length>40);
   employees++;
  }
 }
 assert.ok(employees>=20);
});

test('third-person character and staff are rendered as actual 3D geometry',()=>{
 const character=makePersonGeometry(0,1,Math.PI,{shirt:'#40bda2'},.6);
 assert.ok(character.length>40);
 assert.ok(packWorldFaces(character).every(Number.isFinite));
 const scene=buildCareerWorldGeometry(careerWorlds.company[0],'company');
 assert.ok(scene.length>3000);
 const ui=readFileSync('src/components/interactive-career-world.tsx','utf8');
 assert.ok(ui.includes('thirdPerson'));
 assert.ok(ui.includes('makePersonGeometry'));
 assert.ok(ui.includes('companyEmployeeFor'));
 assert.ok(ui.includes("setConversationTopic('work')"));
 assert.ok(ui.includes("setConversationTopic('skills')"));
 assert.ok(ui.includes("setConversationTopic('culture')"));
 const gpu=readFileSync('src/components/premium-world-webgl.ts','utf8');
 assert.ok(gpu.includes('this.bindLayout(this.buffer)'));
 assert.ok(gpu.includes('this.bindLayout(this.avatarBuffer)'));
});

test.skip('HR Manager game replaces old unrelated workplace and crisis games',()=>{
 assert.equal(careerWorlds.simulator.length,1);
 assert.equal(careerWorlds.crisis.length,0);
 const mission=careerWorlds.simulator[0];
 assert.ok(mission.title.includes('HR Manager'));
 assert.ok(mission.points.length>=10,'HR free-roam world should have exploration locations beyond the six decisions');
 const tasks=mission.points.filter(p=>p.task);
 assert.equal(tasks.length,6);
 assert.ok(tasks.every(p=>p.task?.choices.length===3&&p.task.choices.filter(c=>c.correct).length===1));
 const crisis=readFileSync('src/app/demo/career/crisis/page.tsx','utf8');
 assert.ok(crisis.includes("redirect('/demo/career/simulator')"));
});

test('quiz is rendered as flat accessible website game with original question bank',()=>{
 const quiz=readFileSync('src/components/career-accelerator.tsx','utf8');
 const css=readFileSync('src/app/demo/career/accelerator/accelerator.css','utf8');
 assert.ok(quiz.includes('ac-arena-flat'));
 assert.ok(css.includes('.ac-arena-flat .ac-arena-world'));
 assert.ok(quiz.includes('CAREER_QUESTIONS'));
 assert.ok(quiz.includes('saveQuizResult'));
});

test('new view and conversation actions have offline display translations',()=>{
 for(const lang of ['ms','ta','zh'] as const){
  for(const label of ['HR Manager Simulator','MEET THE TEAM','What skills matter here?','Start quiz']){
   assert.notEqual(lookupTranslation(label,lang),label,`${lang}/${label}`);
  }
 }
});

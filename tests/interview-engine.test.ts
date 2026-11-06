import test from 'node:test';
import assert from 'node:assert/strict';
import {CAREER_ROLES,DEFAULT_INTERVIEW_CONFIG,createQuestion,questionPlan,structuredFeedback,reportFor,isValidConfig,sessionText,type InterviewSession,type PracticeTurn} from '../src/lib/interview-engine.ts';
import {advanceInterview} from '../src/lib/interview-ai.ts';

test('all roles offer distinct, meaningful role-related practice questions',()=>{
 for(const role of Object.keys(CAREER_ROLES) as Array<keyof typeof CAREER_ROLES>){
  const config={...DEFAULT_INTERVIEW_CONFIG,role};
  for(const step of [0,1,2,3,4,5]){
   const q=createQuestion(config,step);
   assert.ok(q.question.length>40);assert.ok(q.category);assert.equal(q.id,`${role}-balanced-${step+1}`);
  }
 }
});
test('focus and length change the interview plan',()=>{
 assert.notDeepEqual(questionPlan({...DEFAULT_INTERVIEW_CONFIG,focus:'technical'}),questionPlan({...DEFAULT_INTERVIEW_CONFIG,focus:'behavioral'}));
 assert.equal(questionPlan({...DEFAULT_INTERVIEW_CONFIG,count:4}).length,4);
 assert.equal(questionPlan({...DEFAULT_INTERVIEW_CONFIG,count:8}).length,8);
});
test('invalid configurations and profile lengths are rejected',()=>{
 assert.ok(isValidConfig(DEFAULT_INTERVIEW_CONFIG));
 assert.ok(!isValidConfig({...DEFAULT_INTERVIEW_CONFIG,role:'astronaut'}));
 assert.ok(!isValidConfig({...DEFAULT_INTERVIEW_CONFIG,count:100}));
 assert.ok(!isValidConfig({...DEFAULT_INTERVIEW_CONFIG,profile:'x'.repeat(1601)}));
});
test('structured feedback is a reproducible practice heuristic, not a hiring score',()=>{
 const q=createQuestion(DEFAULT_INTERVIEW_CONFIG,0);
 const short=structuredFeedback(q,'hello');
 const long=structuredFeedback(q,'First, in a class project I built a responsive interface. I used React to display data because the team needed a clearer view. Then I tested the layout with several screen sizes. The result was a working presentation and I learned how to explain my choices to teammates.');
 assert.ok(long.dimensions.detail>short.dimensions.detail);
 assert.equal(long.source,'structured');
});
test('advance without a Gemini key is usable with a valid next question',async()=>{
 const config=DEFAULT_INTERVIEW_CONFIG;const q=createQuestion(config,0);
 const t:PracticeTurn={question:q,answer:'I made an accessible React website for my course.',feedback:structuredFeedback(q,'I made an accessible React website for my course.'),answeredAt:new Date().toISOString(),skipped:false};
 const result=await advanceInterview(config,[t]);
 assert.ok(result.feedback.summary);assert.equal(result.nextQuestion?.id,'frontend-balanced-2');
});
test('reports and exports cover saved practice',()=>{
 const q=createQuestion(DEFAULT_INTERVIEW_CONFIG,0);
 const answer='First I built a web application, then I tested it, and the results were good.';
 const s:InterviewSession={id:'test',config:DEFAULT_INTERVIEW_CONFIG,startedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),turns:[{question:q,answer,feedback:structuredFeedback(q,answer),answeredAt:new Date().toISOString(),skipped:false}],currentQuestion:null,paused:false,elapsedSeconds:200,status:'completed'};
 assert.equal(reportFor(s).answered,1);assert.match(sessionText(s),/QUESTION 1/);assert.match(sessionText(s),/not a hiring assessment/i);
});

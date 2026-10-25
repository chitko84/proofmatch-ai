import { candidates, roles } from './data.ts';
import { assessMatch } from './engine.ts';
import type {Candidate, Role} from './types.ts';

/** Consistent, fixed, skills-focused scenarios for comparable candidates.
 *  This is a work-sample REQUEST, not an ability test or automatic grade. */
export type WorkSample = {
  roleId:string;
  skillId:string;
  id:string;
  title:string;
  scenario:string;
  prompt:string;
  reviewChecks:string[];
};

export const WORK_SAMPLES: WorkSample[] = [
  {roleId:'frontend',skillId:'react',id:'fe-react',title:'Keeping a page in sync',scenario:'A student portal needs to display new course registrations without refreshing the whole page.',prompt:'Describe how you would structure React components and state for this experience. What would you test?',reviewChecks:['Does the response describe a practical component/state approach?','Does it address user feedback or testing?']},
  {roleId:'frontend',skillId:'typescript',id:'fe-ts',title:'Handling an incomplete API response',scenario:'A course-list API sometimes omits the optional room number.',prompt:'How would you model this response with TypeScript and prevent the interface from crashing? Give a small example or explanation.',reviewChecks:['Does the response distinguish optional from required data?','Does it discuss safe handling of missing values?']},
  {roleId:'frontend',skillId:'css',id:'fe-css',title:'A layout on every screen',scenario:'An event registration form is difficult to use on small phones.',prompt:'Explain what layout and accessibility changes you would make and how you would check the result.',reviewChecks:['Does the response describe mobile and keyboard needs?','Does it offer a realistic testing approach?']},
  {roleId:'frontend',skillId:'api_integration',id:'fe-api',title:'When a request fails',scenario:'An app fetches scholarships from a REST endpoint, but the network sometimes fails.',prompt:'How would you show loading, empty and error states? What would happen if someone tries again?',reviewChecks:['Does the response cover loading, errors and retry?','Does it avoid losing user input?']},
  {roleId:'qa',skillId:'python',id:'qa-py',title:'Checking repeated results',scenario:'A nightly export contains thousands of attendance records, and duplicate rows are possible.',prompt:'Describe a short Python-based check you would create to find unexpected duplicate records.',reviewChecks:['Does the response identify an appropriate uniqueness key?','Does it describe a clear repeatable check?']},
  {roleId:'qa',skillId:'test_automation',id:'qa-auto',title:'A checkout regression',scenario:'A checkout button worked last week but sometimes fails after a new deployment.',prompt:'Outline a small automated regression test: setup, action, expected result and when it should run.',reviewChecks:['Does the response include a clear assertion?','Does it address repeatability or CI?']},
  {roleId:'qa',skillId:'api_testing',id:'qa-api',title:'Duplicate orders in an API',scenario:'A fictional orders API sometimes appears to create duplicate orders after a retry.',prompt:'What would you check first? Describe a positive case, a failure case and what evidence you would collect.',reviewChecks:['Does the response discuss retry behavior and duplicate prevention?','Does it offer test cases and observable evidence?']},
  {roleId:'qa',skillId:'cicd',id:'qa-ci',title:'Tests before a release',scenario:'A small team wants its regression tests to run every time code is proposed for merging.',prompt:'Sketch a simple CI workflow. What would trigger it and what should happen when tests fail?',reviewChecks:['Does the response name a suitable trigger?','Does it explain how failures become visible?']},
  {roleId:'analyst',skillId:'sql',id:'da-sql',title:'Counting customers, not orders',scenario:'The orders table contains multiple orders per customer. The team needs monthly unique-customer counts.',prompt:'Explain the SQL approach you would take to count distinct customers per month and check the result.',reviewChecks:['Does the response distinguish customers from orders?','Does it address grouping and a validation check?']},
  {roleId:'analyst',skillId:'python',id:'da-py',title:'Combining messy files',scenario:'Two spreadsheets have different date formats and need to become one consistent dataset.',prompt:'Describe how you might clean and combine them in Python. What would you check before reporting?',reviewChecks:['Does the response handle dates and data types?','Does it mention validation and missing values?']},
  {roleId:'analyst',skillId:'cleaning',id:'da-clean',title:'Unexpected sales duplicates',scenario:'A monthly sales report counts some transactions twice.',prompt:'Explain how you would identify duplicates, avoid removing legitimate repeat purchases, and record the changes.',reviewChecks:['Does the response consider an appropriate record identifier?','Does it avoid blindly dropping duplicate-looking rows?']},
  {roleId:'analyst',skillId:'dashboard',id:'da-dash',title:'A dashboard people can understand',scenario:'A program manager wants to see signups, attendance and completion over time.',prompt:'What charts or indicators would you show? Explain one common misleading interpretation to guard against.',reviewChecks:['Does the response link charts to a decision?','Does it discuss misleading comparisons or definitions?']},
];

export function eligibleWorkSamples(candidate: Candidate, role:Role):WorkSample[] {
  const needs=assessMatch(candidate,role).assessments.filter(a=>a.support!=='artifact');
  return needs.flatMap(a=>WORK_SAMPLES.filter(task=>task.roleId===role.id && task.skillId===a.requirement.skillId));
}

export function validateFairShotSubmission(candidateId:string, taskId:string, response:string){
  const candidate=candidates.find(c=>c.id===candidateId);
  if(!candidate)throw new Error('Choose a fictional candidate.');
  const task=WORK_SAMPLES.find(t=>t.id===taskId);
  if(!task)throw new Error('Choose a work example.');
  const role=roles.find(r=>r.id===task.roleId)!;
  if(!eligibleWorkSamples(candidate,role).some(t=>t.id===task.id))throw new Error('This example is not applicable to the selected candidate.');
  if(typeof response!=='string'||response.trim().length<35||response.length>800)throw new Error('Write a 35–800 character fictional response.');
  return {candidate,role,task,response:response.trim()};
}

/** Clearly labeled fallback: this is not generated AI and never grades an answer. */
export function sampleFairShotFollowup(task:WorkSample):string {
  return `For the ${task.title.toLowerCase()} example, could you describe the first practical step you would take and what result you would check?`;
}

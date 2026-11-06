import test from 'node:test';
import assert from 'node:assert/strict';
import {CAREER_SECTORS,ROLE_CATALOG,COMPANIES,OPPORTUNITIES,companyById} from '../src/lib/career-catalog.ts';
import {CAREER_ROLES,DEFAULT_INTERVIEW_CONFIG,createQuestion,isValidConfig,resolvedRole} from '../src/lib/interview-engine.ts';
import {createWorkspace,NETWORK_PEOPLE,SEED_POSTS,SEED_THREADS,loadWorkspace,saveWorkspace,STORAGE_KEY} from '../src/lib/network-store.ts';

test('career catalog covers diverse industries, people and opportunities',()=>{
 assert.ok(CAREER_SECTORS.length>=12);assert.ok(ROLE_CATALOG.length>=80);assert.ok(COMPANIES.length>=30);assert.ok(OPPORTUNITIES.length>=160);
 assert.equal(new Set(ROLE_CATALOG.map(r=>r.id)).size,ROLE_CATALOG.length);
 assert.equal(new Set(COMPANIES.map(c=>c.id)).size,COMPANIES.length);
 for(const career of ROLE_CATALOG){assert.ok(career.title.length>=3);assert.ok(career.skills.length>=4);assert.ok(career.focus.length>=10);assert.ok(CAREER_SECTORS.includes(career.sector as (typeof CAREER_SECTORS)[number]));assert.ok(CAREER_ROLES[career.id]);}
 for(const job of OPPORTUNITIES){assert.ok(companyById(job.companyId));assert.ok(job.skills.length>=4);assert.ok(job.description.length>=50);assert.ok(['Hybrid','On-site','Remote'].includes(job.mode));}
 for(const sector of CAREER_SECTORS){assert.ok(OPPORTUNITIES.some(job=>job.sector===sector),`Missing ${sector}`)}
});
test('mock interview supports any custom career title and useful questions',()=>{
 const setup={...DEFAULT_INTERVIEW_CONFIG,role:'custom',customTitle:'Marine Biologist',customSkills:'marine sampling, fieldwork, biodiversity, public speaking'};
 assert.ok(isValidConfig(setup));assert.equal(resolvedRole(setup).title,'Marine Biologist');assert.match(createQuestion(setup,2).question,/marine sampling/);
 assert.equal(isValidConfig({...setup,customTitle:' '}),false);assert.equal(isValidConfig({...setup,customSkills:'x'.repeat(250)}),false);
});
test('community comes with a populated feed and realistic conversation records',()=>{
 assert.ok(NETWORK_PEOPLE.length>=200);assert.ok(SEED_POSTS.length>=60);assert.ok(SEED_THREADS.length>=20);
 const people=new Set(NETWORK_PEOPLE.map(p=>p.id));
 for(const post of SEED_POSTS){assert.ok(people.has(post.authorId));assert.ok(post.body.length>60);assert.ok(post.comments.every(comment=>people.has(comment.authorId)));}
 for(const thread of SEED_THREADS){assert.ok(people.has(thread.contactId));assert.ok(thread.messages.length>=2);}
});
test('workspace state has separate application, messages and social collections',()=>{
 const state=createWorkspace();assert.equal(state.identity,'candidate');assert.equal(state.applications.length,0);assert.equal(state.savedJobs.length,0);assert.ok(state.threads.length>20);assert.ok(state.posts.length>50);
});
test('workspace persists changes locally without mutating original seed records',()=>{
 const data=new Map<string,string>();
 const memory={getItem:(key:string)=>data.get(key)||null,setItem:(key:string,value:string)=>{data.set(key,value)},removeItem:(key:string)=>{data.delete(key)}};
 const oldStorage=(globalThis as any).localStorage;const oldWindow=(globalThis as any).window;
 (globalThis as any).localStorage=memory;(globalThis as any).window={dispatchEvent:()=>{}};
 try{const state=createWorkspace();const next={...state,savedJobs:['job-frontend-1'],likedPosts:['post-001'],identity:'recruiter' as const};assert.ok(saveWorkspace(next));const restored=loadWorkspace();assert.deepEqual(restored.savedJobs,['job-frontend-1']);assert.deepEqual(restored.likedPosts,['post-001']);assert.equal(restored.identity,'recruiter');assert.ok(data.has(STORAGE_KEY));assert.deepEqual(createWorkspace().savedJobs,[])}finally{(globalThis as any).localStorage=oldStorage;(globalThis as any).window=oldWindow}
});

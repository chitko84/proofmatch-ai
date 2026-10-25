'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,BookOpenCheck,Check,ClipboardList,FileCheck2,Info,ShieldCheck,Sparkles} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {assessMatch} from '@/lib/engine';
import {candidateWithReplies,readReplies,writeReplies,validateReply,type CandidateReply} from '@/lib/phase3';
import {eligibleWorkSamples,validateFairShotSubmission} from '@/lib/fairshot';

export default function FairShotPage(){
 const [candidateId,setCandidateId]=useState('C01');
 const [roleId,setRoleId]=useState('qa');
 const [taskId,setTaskId]=useState('qa-api');
 const [response,setResponse]=useState('');
 const [replies,setReplies]=useState<CandidateReply[]>([]);
 const [result,setResult]=useState('');
 const [error,setError]=useState('');
 const [aiQuestion,setAiQuestion]=useState('');const [aiMode,setAiMode]=useState('');const [aiBusy,setAiBusy]=useState(false);const [accessCode,setAccessCode]=useState('');
 useEffect(()=>{
  setReplies(readReplies());
  const params=new URLSearchParams(window.location.search);
  const candidate=params.get('candidate'); const role=params.get('role'); const skill=params.get('skill');
  const chosen=candidates.find(c=>c.id===candidate)||candidates[0];
  const requested=roles.find(r=>r.id===role)||roles[1];
  setCandidateId(chosen.id);setRoleId(requested.id);
  const options=eligibleWorkSamples(chosen,requested);
  setTaskId(options.find(t=>t.skillId===skill)?.id||options[0]?.id||'');
 },[]);
 const person=candidates.find(c=>c.id===candidateId)!;
 const role=roles.find(r=>r.id===roleId)!;
 const tasks=useMemo(()=>eligibleWorkSamples(person,role),[person,role]);
 const task=tasks.find(t=>t.id===taskId)||tasks[0];
 const previous=assessMatch(person,role);
 const updated=assessMatch(candidateWithReplies(person,replies),role);
 const saved=replies.filter(r=>r.candidateId===candidateId && r.origin==='fairshot' && r.taskId===task?.id);
 function selectPerson(id:string){const p=candidates.find(c=>c.id===id)!;setCandidateId(id);const options=eligibleWorkSamples(p,role);setTaskId(options[0]?.id||'');setResponse('');setResult('');setError('');setAiQuestion('')}
 function selectRole(id:string){const r=roles.find(r=>r.id===id)!;setRoleId(id);const options=eligibleWorkSamples(person,r);setTaskId(options[0]?.id||'');setResponse('');setResult('');setError('');setAiQuestion('')}
 async function askFollowup(){
  if(!task || aiBusy)return;setAiBusy(true);setAiQuestion('');setAiMode('');setError('');
  try{
   const res=await fetch('/api/fairshot',{method:'POST',headers:{'Content-Type':'application/json',...(accessCode?{'x-demo-access-code':accessCode}:{})},body:JSON.stringify({candidateId,taskId:task.id,response})});
   const data:{question?:string;mode?:string;error?:string}=await res.json();
   if(!res.ok)throw new Error(data.error||'Could not suggest a follow-up.');
   setAiQuestion(data.question||'');setAiMode(data.mode==='gemini'?'Gemini AI suggestion':'Prewritten example question');
  }catch(e){setError(e instanceof Error?e.message:'Please check the sample.')}finally{setAiBusy(false)}
 }
 function save(event:React.FormEvent<HTMLFormElement>){
  event.preventDefault();setResult('');setError('');
  try{
   const submission=validateFairShotSubmission(candidateId,task?.id||'',response);
   const entry=validateReply({id:`fs-${Date.now()}`,candidateId,skillId:submission.task.skillId,note:submission.response,createdAt:new Date().toISOString(),origin:'fairshot',taskId:submission.task.id});
   const next=[...replies,entry].slice(-30);writeReplies(next);setReplies(next);setResponse('');
   setResult('Fictional work-sample response saved on this device for human review. It is not graded, certified, or verified.');
  }catch(e){setError(e instanceof Error?e.message:'Please check this fictional response.')}
 }
 return <main className="workspace-page">
  <div className="page-title-row"><div><span className="small-eyebrow">FAIRSHOT · SHOW WHAT YOU CAN DO</span><h1>Show what you can do.</h1><p>A short, consistent work example can give someone an opportunity to add information their CV did not contain.</p></div><BookOpenCheck size={30}/></div>
  <div className="gentle-note prominent-note"><ShieldCheck size={19}/><span><strong>This is a simulation using fictional candidates.</strong> Answers are not automatically scored. The exercise is not an authenticated skills test or independent verification. Give comparable candidates equivalent opportunities and allow accessible alternative formats.</span></div>
  <div className="fairshot-showcase"><div className="fairshot-intro"><span><Sparkles size={17}/> A BETTER FOLLOW-UP</span><h2>An empty CV section shouldn't close a door.</h2><p>Ask one practical question about a missing requirement. Save the answer for HR to review alongside the original evidence.</p></div><div className="fairshot-symbol"><span>CV</span><ArrowRight size={26}/><span><Check size={36}/></span></div></div>
  <div className="p3-columns fairshot-columns"><section className="white-panel p3-controls">
   <div className="panel-heading"><div><span className="small-eyebrow">STEP 01 / CHOOSE</span><h2>Who needs a closer look?</h2></div><ClipboardList size={21}/></div>
   <label>Fictional candidate<select value={candidateId} onChange={e=>selectPerson(e.target.value)}>{candidates.map(c=><option key={c.id} value={c.id}>{c.alias}</option>)}</select></label>
   <label>Job role<select value={roleId} onChange={e=>selectRole(e.target.value)}>{roles.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
   <label>Choose an area without a project example<select value={task?.id||''} onChange={e=>{setTaskId(e.target.value);setResponse('');setResult('');setAiQuestion('')}} disabled={!tasks.length}>{tasks.length===0?<option value="">All requirements have supplied examples</option>:tasks.map(t=><option key={t.id} value={t.id}>{role.requirements.find(q=>q.skillId===t.skillId)?.label}</option>)}</select></label>
   <div className="fairshot-before"><span>Current evidence coverage</span><strong>{Math.round(previous.coverage*100)}%</strong><small>Not a hiring-success score; supplying an answer is not proof of competency.</small></div>
   <div className="fairshot-before fairshot-updated"><span>With saved candidate statements</span><strong>{Math.round(updated.coverage*100)}%</strong><small>Self-reported information is counted separately from project examples.</small></div>
   <Link href={`/demo/matches?candidate=${candidateId}&role=${roleId}`} className="button button-soft">Inspect original evidence <ArrowUpRight size={17}/></Link>
  </section>
  <section className="white-panel fairshot-task-panel">
   <div className="panel-heading"><div><span className="small-eyebrow">STEP 02 / GIVE A FAIR SHOT</span><h2>The same task for the same skill.</h2></div><FileCheck2 size={22}/></div>
   {task?<><div className="fairshot-task"><span className="fairshot-label">WORK SAMPLE · {role.title.toUpperCase()}</span><h3>{task.title}</h3><p>{task.scenario}</p><div className="fairshot-question"><strong>The question</strong><p>{task.prompt}</p></div></div>
    <form onSubmit={save} className="fairshot-form"><label htmlFor="fairshot-response">Candidate response (fictional example)</label><textarea id="fairshot-response" rows={6} minLength={35} maxLength={800} required value={response} onChange={e=>setResponse(e.target.value)} placeholder="Write a fictional explanation of the approach, examples and checks..."></textarea><span className="fairshot-charcount">{response.length} / 800 characters</span><div className="demo-form-actions"><button type="button" className="button button-secondary" onClick={()=>{if(task){setResponse(`In this fictional work example, I would start by understanding the requirements for ${task.title.toLowerCase()}. I would identify a small test case, explain the steps I would take, record the results, and ask the team to review my approach before calling it complete.`);setError("");setResult("Sample response filled in. Review and save it when ready.")}}}>Fill sample answer</button><button type="submit" className="button button-jade"><Check size={17}/> Save response for HR review</button></div></form>
    {error&&<p className="fairshot-error" role="alert">{error}</p>}
    {result&&<div className="p3-feedback" role="status"><Check size={18}/><div>{result} <Link href={`/demo/matches?candidate=${candidateId}&role=${roleId}`}><strong>Open updated match <ArrowRight size={13}/></strong></Link></div></div>}
    <div className="fairshot-ai-box"><div><Sparkles size={18}/><strong>Ask Mira for a follow-up</strong></div><p>Optional Gemini assistance. Mira can suggest a neutral clarification question, but will not grade or select candidates.</p><label>Demo access code (only if required)<input type="password" autoComplete="off" value={accessCode} onChange={e=>setAccessCode(e.target.value)} placeholder="Optional on local setup"/></label><button type="button" className="button button-soft" disabled={aiBusy||response.trim().length<35} onClick={()=>void askFollowup()}>{aiBusy?'Checking response…':'Suggest a follow-up question'} <ArrowUpRight size={16}/></button>{aiQuestion&&<div role="status" className="fairshot-ai-answer"><small>{aiMode}</small><p>{aiQuestion}</p></div>}</div>
    <div className="fairshot-rubric"><strong>What a recruiter could look for</strong>{task.reviewChecks.map(item=><p key={item}><Check size={15}/> {item}</p>)}<small>These are review prompts only, not a hidden grading algorithm.</small></div>
    {saved.length>0&&<div className="fairshot-history"><h3>{saved.length} saved response{saved.length>1?'s':''}</h3>{saved.map(r=><details key={r.id}><summary>Fictional answer · {new Date(r.createdAt).toLocaleString()}</summary><p>{r.note}</p></details>)}<Link href="/demo/candidate-reply">See all candidate statements <ArrowUpRight size={14}/></Link></div>}
   </>:<div className="p3-empty"><Info size={19}/> Every requirement for this role already has a supplied project example. No extra sample is requested. Try another candidate and role.</div>}
  </section></div>
  <p className="page-footnote">FairShot examples are prewritten and fixed by role and skill. The answers are fictional and stored in localStorage, not submitted to an employer. Written examples alone cannot confirm identity, authorship, or ability. AI is not used to grade candidates.</p>
 </main>
}

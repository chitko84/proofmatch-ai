'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,CheckCircle2,ClipboardList,Copy,MessageSquareText,ShieldCheck} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {prepareInterviewQuestions} from '@/lib/connect';
export default function InterviewPage(){
 const [candidateId,setCandidateId]=useState('C01'),[roleId,setRoleId]=useState('qa'),[selected,setSelected]=useState<string[]>([]),[message,setMessage]=useState(''),[copyFallback,setCopyFallback]=useState(false);
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const c=p.get('candidate'),r=p.get('role');if(c&&candidates.some(x=>x.id===c))setCandidateId(c);if(r&&roles.some(x=>x.id===r))setRoleId(r)},[]);
 const questions=useMemo(()=>prepareInterviewQuestions(candidateId,roleId),[candidateId,roleId]);
 function toggle(id:string){setSelected(items=>items.includes(id)?items.filter(x=>x!==id):[...items,id]);setMessage('')}
 const approved=questions.filter(q=>selected.includes(q.id));
 async function copy(){try{await navigator.clipboard.writeText(`ProofMatch – Suggested interview questions\n${candidates.find(c=>c.id===candidateId)?.alias} · ${roles.find(r=>r.id===roleId)?.title}\n\n${approved.map((q,i)=>`${i+1}. ${q.question}`).join('\n')}`);setMessage('Chosen questions copied. Share them only through your chosen process.')}catch{setCopyFallback(true);setMessage('Copy is blocked by the browser. Select the questions below to copy them manually.')}}
 return <main className="workspace-page">
  <div className="page-title-row"><div><span className="small-eyebrow">INTERVIEW COMPANION</span><h1>Make every conversation count.</h1><p>Prepare thoughtful questions about the job, the candidate's experience, and what matters to them.</p></div><MessageSquareText size={32}/></div>
  <div className="gentle-note prominent-note"><ShieldCheck size={19}/><span><strong>For HR to choose:</strong> These are consistent sample questions based on fictional job requirements and the information we have. We do not grade people or make hiring decisions.</span></div>
  <div className="connect-grid"><section className="white-panel connect-panel">
   <span className="small-eyebrow">STEP 1 · CHOOSE</span><h2>Who are you meeting?</h2>
   <label>Person<select value={candidateId} onChange={e=>{setCandidateId(e.target.value);setSelected([])}}>{candidates.map(c=><option key={c.id} value={c.id}>{c.alias}</option>)}</select></label>
   <label>Open job<select value={roleId} onChange={e=>{setRoleId(e.target.value);setSelected([])}}>{roles.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
   <div className="connect-context"><strong>Ready to learn more?</strong><p>Pick the questions that would help you make a fair, informed decision.</p><Link href={`/demo/matches?candidate=${candidateId}&role=${roleId}`}>Review the matching evidence <ArrowRight size={15}/></Link></div>
   <Link href={`/demo/connect?candidate=${candidateId}&role=${roleId}`} className="button button-secondary">Invite to explore the job <ArrowRight size={15}/></Link>
  </section>
  <section className="white-panel connect-panel"><span className="small-eyebrow">STEP 2 · REVIEW QUESTIONS</span><h2>Your interview starter pack</h2>
   <div className="interview-question-list">{questions.map(q=><label key={q.id} className="interview-question"><input type="checkbox" checked={selected.includes(q.id)} onChange={()=>toggle(q.id)}/><div><strong>{q.title}</strong><p>{q.question}</p><small>Why ask: {q.why}</small></div></label>)}</div>
   <div className="connect-actions"><button className="button button-jade" disabled={approved.length===0} onClick={copy}><Copy size={16}/> Copy {approved.length} chosen question{approved.length===1?'':'s'}</button><button type="button" className="button button-secondary" onClick={()=>{setSelected(questions.slice(0,2).map(q=>q.id));setMessage("Two sample interview questions selected.");setCopyFallback(false)}}><ClipboardList size={15}/> Pick two sample questions</button><button type="button" className="button button-secondary" onClick={()=>{setSelected(selected.length===questions.length?[]:questions.map(q=>q.id));setMessage("");setCopyFallback(false)}}><ClipboardList size={15}/> {selected.length===questions.length?"Clear selection":"Choose all"}</button></div>
   {message&&<p className="p3-feedback" role="status"><CheckCircle2 size={16}/>{message}</p>}{copyFallback&&<label>Copy these questions manually<textarea readOnly rows={7} value={approved.map((q,i)=>`${i+1}. ${q.question}`).join("\n")}/></label>}
  </section></div>
  <p className="page-footnote">Interview Companion uses clear, prewritten question templates selected from actual sample job requirements; it does not claim to be a live Gemini-generated assessment. Keep candidate answers and final decisions under human review.</p>
 </main>;
}

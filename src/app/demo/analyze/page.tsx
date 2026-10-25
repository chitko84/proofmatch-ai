'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, FileText, Sparkles, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { candidates, roles } from '@/lib/data';
import { LIVE_STORAGE_KEY, type LiveResult } from '@/lib/live-analysis';
import type { WorkMode } from '@/lib/types';

export default function AnalyzePage() {
  const router = useRouter();
  const [label,setLabel]=useState('New candidate');
  const [role,setRole]=useState('frontend');
  const [location,setLocation]=useState('Penang');
  const [mode,setMode]=useState<WorkMode>('hybrid');
  const [cv,setCv]=useState('');
  const [project,setProject]=useState('');
  const [accessCode,setAccessCode]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [notice,setNotice]=useState('');
  function loadSample() {
    const person = candidates[0];
    setLabel('Demo Candidate A'); setRole(person.appliedRoleId);
    setLocation(person.location); setMode(person.preferredModes[0]);
    setCv('Applicant summary: I applied for a Frontend Developer role. I have some experience with React and would like to work on software testing and automation. I prefer hybrid work. I am looking for a role where I can continue growing my technical skills.');
    setProject('Project A — Account Testing Toolkit\n'+person.evidence.filter(e=>e.kind==='artifact').map(e=>`${e.sourceLabel}\n${e.excerpt}`).join('\n\n'));
    setNotice('Fictional example loaded. Click Check with Gemini to test real extraction.');setError('');
  }
  async function analyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('');setNotice('');
    try {
      const response = await fetch('/api/analyze',{
        method:'POST',headers:{'Content-Type':'application/json',...(accessCode?{'x-demo-access-code':accessCode}:{})},
        body:JSON.stringify({label,appliedRoleId:role,location,preferredModes:[mode],cvText:cv,projectText:project}),
      });
      const result: LiveResult & {error?: string} = await response.json();
      if(!response.ok) throw new Error(result.error || 'Analysis could not be completed.');
      sessionStorage.setItem(LIVE_STORAGE_KEY,JSON.stringify(result));
      router.push('/demo/matches?candidate=LIVE');
    }catch(err){setError(err instanceof Error?err.message:'Something went wrong. Try again.');}
    finally{setLoading(false);}
  }
  return <div className="workspace-page">
    <div className="page-title-row"><div><span className="small-eyebrow">REAL GEMINI AI · PHASE 2</span><h1>See what a CV can tell us.</h1><p>Paste a fictional CV and, if available, a project example. Gemini finds relevant mentions; we check every quote against the text you provided.</p></div><Link className="button button-secondary" href="/demo/matches">Explore ready-made matches <ArrowRight size={16}/></Link></div>
    <div className="gentle-note prominent-note"><ShieldCheck size={19}/><span><strong>Privacy for this demo:</strong> Use fictional or consented text only. On the free Gemini API tier, Google may use content to improve its products. Live analysis is sent to Gemini, but this demo doesn't save it on our server. Results remain in this browser tab.</span></div>
    <div className="analysis-layout">
      <form className="white-panel analysis-form" onSubmit={analyze}>
        <div className="panel-heading"><div><span className="small-eyebrow">CANDIDATE INFORMATION</span><h2>Add a person to explore</h2></div><FileText size={21}/></div>
        <div className="analysis-grid"><label>Candidate label<input value={label} onChange={e=>setLabel(e.target.value)} required maxLength={75}/></label><label>Applied for<select value={role} onChange={e=>setRole(e.target.value)}>{roles.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label></div>
        <div className="analysis-grid"><label>Location (optional)<input value={location} onChange={e=>setLocation(e.target.value)} maxLength={100}/></label><label>Preferred way of working<select value={mode} onChange={e=>setMode(e.target.value as WorkMode)}><option value="hybrid">Hybrid</option><option value="onsite">Onsite</option><option value="remote">Remote</option></select></label></div>
        <label>CV text <span className="field-muted">(required · 40–12,000 characters)</span><textarea required minLength={40} maxLength={12000} rows={7} value={cv} onChange={e=>setCv(e.target.value)} placeholder="Paste the candidate's fictional CV or experience here..." /></label>
        <label>Project or portfolio text <span className="field-muted">(optional · up to 10,000 characters)</span><textarea maxLength={10000} rows={6} value={project} onChange={e=>setProject(e.target.value)} placeholder="Paste a project description, code excerpt, or portfolio summary that the candidate supplied..."/></label>
        <label>Demo access code <span className="field-muted">(only if your deployment requires one)</span><input autoComplete="off" type="password" value={accessCode} onChange={e=>setAccessCode(e.target.value)} placeholder="Optional for local development"/></label>
        {notice&&<div className="analysis-feedback"><CheckCircle2 size={18}/>{notice}</div>}
        {error&&<div className="analysis-error" role="alert"><AlertCircle size={18}/>{error}</div>}
        <div className="analysis-actions"><button className="button button-jade" type="submit" disabled={loading||cv.trim().length<40}><Sparkles size={17}/>{loading?'Reading your example…':'Check with Gemini'}</button><button className="button button-secondary" type="button" onClick={loadSample} disabled={loading}>Fill sample CV</button><Link className="button button-secondary" href="/demo/matches?candidate=C01&role=qa">Show sample matches (no AI needed) <ArrowRight size={16}/></Link></div>
      </form>
      <aside className="white-panel analysis-help"><span className="small-eyebrow">WHAT HAPPENS NEXT</span><h2>From CV to clear reasons.</h2><div className="analysis-steps"><div><span>01</span><p><strong>Gemini reads the text</strong><br/>It looks for job-related skills and examples.</p></div><div><span>02</span><p><strong>We check the quotes</strong><br/>Any quote not found in the stated source is removed.</p></div><div><span>03</span><p><strong>Three roles are compared</strong><br/>Transparent rules show what is documented and what remains unknown.</p></div><div><span>04</span><p><strong>HR decides</strong><br/>See possible alternative roles, ask questions and save a review.</p></div></div><div className="gentle-note"><AlertCircle size={17}/> An AI-generated quote is not proof of competence or the person's contribution to a project.</div><p className="page-footnote">No Gemini key yet? The preloaded sample matching pages still work. Set <code>GEMINI_API_KEY</code> on your server to enable new text analysis.</p></aside>
    </div>
  </div>;
}

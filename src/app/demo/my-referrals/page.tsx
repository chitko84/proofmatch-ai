'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {HeartHandshake,Search} from 'lucide-react';
import {useCompanyNetwork} from '@/lib/use-company-network';
import {TALENT_CANDIDATES} from '@/lib/talent-ecosystem';
import {companyDirectory,allNetworkJobs,decideReferralConsent} from '@/lib/company-network';
export default function MyReferrals(){
 const {state,update}=useCompanyNetwork();
 const [candidateId,setCandidateId]=useState('talent-0001'),[query,setQuery]=useState('');
 const people=[...TALENT_CANDIDATES,...state.customCandidates];
 const companies=companyDirectory(state),jobs=allNetworkJobs(state);
 const choices=useMemo(()=>{const q=query.trim().toLowerCase();const filtered=(q?people.filter(c=>`${c.name} ${c.title} ${c.id}`.toLowerCase().includes(q)):people).slice(0,65);const current=people.find(c=>c.id===candidateId);if(current&&!filtered.some(c=>c.id===current.id))filtered.unshift(current);return filtered},[people,query,candidateId]);
 const items=state.referrals.filter(r=>r.candidateId===candidateId);
 useEffect(()=>{const c=new URLSearchParams(window.location.search).get('candidate');if(c&&TALENT_CANDIDATES.some(p=>p.id===c))setCandidateId(c)},[]);
 return <main className="workspace-page pm-my-referrals-page"><header className="pm-head"><div><span className="small-eyebrow">CANDIDATE · CONSENT</span><h1>My Referrals</h1><p>Review each referral request before deciding whether your profile can be shared with the receiving employer in this browser-local demonstration.</p></div><HeartHandshake size={32}/></header><section className="pm-card pm-stack"><p className="pm-note">For demonstration only, you can choose a fictional candidate identity. Production would require the actual candidate to authenticate and approve their own referrals.</p><label className="pm-field"><Search size={15} style={{display:'inline'}}/> Find your demo candidate<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Type a name or profile ID"/></label><label className="pm-field">Candidate profile<select value={candidateId} onChange={e=>setCandidateId(e.target.value)}>{choices.map(c=><option key={c.id} value={c.id}>{c.name} · {c.title}</option>)}</select></label>
 {items.length?items.map(r=><article className="pm-row" key={r.id}><span><strong>{companies.find(c=>c.id===r.toCompanyId)?.name||'Receiving employer'}</strong><small>Role: {jobs.find(j=>j.id===r.opportunityId)?.title||'Vacancy'} · Requested {r.createdAt.slice(0,10)}</small><small>Recommended by {companies.find(c=>c.id===r.fromCompanyId)?.name||'Partner company'}</small><small>Current consent: {r.consent} · Referral status: {r.status.replaceAll('_',' ')}</small></span><div className="pm-stack"><span className="pm-tag">{r.status==='permission_requested'?'Your permission is needed':r.status.replaceAll('_',' ')}</span>{r.status==='permission_requested'&&<div className="pm-button-row"><button type="button" className="pm-button" onClick={()=>update(s=>decideReferralConsent({...s,view:'candidate'},r.id,'approved'))}>Approve sharing</button><button type="button" className="pm-button ghost" onClick={()=>update(s=>decideReferralConsent({...s,view:'candidate'},r.id,'declined'))}>Decline</button></div>}</div></article>):<div className="pm-empty">No referral requests for this candidate yet. A recruiter must first create a referral request from the HR Workspace.</div>}
 <p className="pm-note">Approving a referral only prepares it for the referring HR to send in the local demo; no external company receives data.</p><Link className="pm-button secondary" href="/demo/candidate">Back to Candidate Dashboard</Link></section></main>;
}

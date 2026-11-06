'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {HeartHandshake,Send,CheckCircle2,ArrowRight,Building2,Search,ShieldCheck} from 'lucide-react';
import {useCompanyNetwork} from '@/lib/use-company-network';
import {COMPANIES,OPPORTUNITIES} from '@/lib/career-catalog';
import {TALENT_CANDIDATES,assessTalentForJob} from '@/lib/talent-ecosystem';
import {companyDirectory,allNetworkJobs,connectedCompanyIds,connectCompanies,decideConnection,requestReferral,sendReferral,reviewReferral,partnerStatus} from '@/lib/company-network';
import './referrals-refresh.css';

export default function CompanyReferrals(){
 const {state,update,ready,error:storageError}=useCompanyNetwork();
 const [candidateId,setCandidateId]=useState('talent-0001'),[candidateSearch,setCandidateSearch]=useState('');
 const [notice,setNotice]=useState(''),[companyId,setCompanyId]=useState(''),[selectedJob,setSelectedJob]=useState('');
 const [message,setMessage]=useState('');
 const companies=companyDirectory(state),jobs=allNetworkJobs(state),people=[...TALENT_CANDIDATES,...state.customCandidates];
 const active=companies.find(c=>c.id===state.activeCompanyId);
 const connectedIds=connectedCompanyIds(state,state.activeCompanyId);
 const eligibleCompanies=companies.filter(c=>c.id!==state.activeCompanyId&&jobs.some(j=>j.companyId===c.id));
 const targetCompany=eligibleCompanies.some(c=>c.id===companyId)?companyId:(eligibleCompanies.find(c=>connectedIds.includes(c.id))?.id||eligibleCompanies[0]?.id||'');
 const availableJobs=jobs.filter(j=>j.companyId===targetCompany);
 const candidate=people.find(c=>c.id===candidateId)||people[0];
 const targetJob=availableJobs.find(j=>j.id===selectedJob)||availableJobs[0];
 const best=candidate&&targetJob?{job:targetJob,fit:assessTalentForJob(candidate,targetJob)}:undefined;
 const status=targetCompany?partnerStatus(state,state.activeCompanyId,targetCompany):'none';
 const outgoing=state.referrals.filter(r=>r.fromCompanyId===state.activeCompanyId);
 const incoming=state.referrals.filter(r=>r.toCompanyId===state.activeCompanyId&&r.consent==='approved'&&(r.status==='sent'||r.status==='reviewed'));
 const pendingInvites=state.connections.filter(c=>c.secondId===state.activeCompanyId&&c.status==='pending');
 const selectableCandidates=useMemo(()=>{
  const q=candidateSearch.trim().toLowerCase();
  const matches=q?people.filter(c=>`${c.name} ${c.title} ${c.sector} ${c.id}`.toLowerCase().includes(q)).slice(0,65):people.slice(0,65);
  const chosen=people.find(c=>c.id===candidateId);
  if(chosen&&!matches.some(c=>c.id===chosen.id))matches.unshift(chosen);
  return matches;
 },[people,candidateId,candidateSearch]);
 useEffect(()=>{const params=new URLSearchParams(window.location.search);const c=params.get('candidate');const org=params.get('company');if(c&&TALENT_CANDIDATES.some(p=>p.id===c))setCandidateId(c);if(org&&COMPANIES.some(p=>p.id===org))setCompanyId(org)},[]);
 function sampleMessage(){if(!best||!candidate)return;
  const evidence=candidate.evidence.filter(e=>best.job.skills.some(skill=>skill.toLowerCase()===e.skill.toLowerCase()));
  const proof=evidence.slice(0,2).map(e=>e.excerpt).join(' ');
  setMessage(`Hello ${companies.find(c=>c.id===best.job.companyId)?.name||'Recruitment Team'},\n\nWe would like to recommend ${candidate.name} for the ${best.job.title} opening. Their fictional profile mentions ${best.fit.matched} of ${best.fit.total} advertised requirements${proof?`, including these unverified examples: ${proof}`:'.'}\n\nWith the candidate's permission, we would appreciate your review of their relevant experience and welcome a discussion about the role. Please contact our HR team through the approved referral process.`.slice(0,600));
 }
 function request(){if(!best||!candidate)return;
  if(status!=='accepted'){setNotice('A confirmed partnership is required first. Request a connection and have the receiving company approve it in the demo.');return}
  if(!message.trim()){setNotice('Please write or generate a recommendation message before requesting consent.');return}
   update(s=>requestReferral({...s,view:'recruiter'},candidate.id,best.job.companyId,best.job.id,message.trim()));
  setNotice(state.referrals.some(r=>r.candidateId===candidate.id&&r.opportunityId===best.job.id&&r.status!=='closed')?'An active referral already exists for this candidate and vacancy.':'Consent requested. Open Candidate → My Referrals, choose the same candidate, approve sharing, and return here to send the recommendation.');
 }
 function createConnection(){if(!targetCompany)return;update(s=>connectCompanies({...s,view:'recruiter'},s.activeCompanyId,targetCompany));setNotice('Partner request recorded in this browser. Switch to the receiving employer in the demo and accept the request before referring anyone.');}
 function switchEmployer(id:string){update(s=>({...s,activeCompanyId:id,view:'recruiter'}));setCompanyId('');setSelectedJob('');setNotice('You are viewing this employer’s simulated inbox. These are not authenticated external accounts.');}
 return <main className="workspace-page pm-referrals-page"><header className="pm-head"><div><span className="small-eyebrow">HR · CONSENT-BASED EMPLOYER NETWORK</span><h1>Company Referrals</h1><p>Select a candidate, partner company, and advertised role. Request candidate approval before sending a professional recommendation into the receiving employer’s demo inbox.</p></div><HeartHandshake size={32}/></header>
 <div className="pm-referral-summary"><div className="pm-metric"><strong>{connectedIds.length}</strong><small>Connected demo partners</small></div><div className="pm-metric"><strong>{jobs.filter(j=>j.companyId!==state.activeCompanyId).length}</strong><small>Open partner opportunities</small></div><div className="pm-metric"><strong>{outgoing.length}</strong><small>Outgoing referrals</small></div><div className="pm-metric"><strong>{incoming.length}</strong><small>Received referrals</small></div></div>
 <section className="pm-card pm-stack pm-employer-switch"><div><h2><Building2 size={19} style={{display:'inline'}}/> Simulated employer account</h2><p className="pm-note">Switch employers to demonstrate company-to-company workflows in this browser. Real companies cannot see this data.</p></div><label className="pm-field">Current HR workspace<select value={state.activeCompanyId} onChange={e=>switchEmployer(e.target.value)}>{companies.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label></section>
 <div className="pm-grid"><section className="pm-card pm-stack"><span className="small-eyebrow">01 · PREPARE A REFERRAL</span><h2>Recommend a candidate</h2><p className="pm-note">Referring from <strong>{active?.name||'Demo employer'}</strong>. All names and vacancies shown are fictional unless you have created your own local records.</p>
 <label className="pm-field"><Search size={15} style={{display:'inline'}}/> Search candidate<input value={candidateSearch} onChange={e=>setCandidateSearch(e.target.value)} placeholder="Search by name, role, sector or ID"/></label>
 <label className="pm-field">Candidate<select value={candidate?.id||''} onChange={e=>{setCandidateId(e.target.value);setMessage('');setNotice('')}}>{selectableCandidates.map(c=><option key={c.id} value={c.id}>{c.name} · {c.title}</option>)}</select></label>
 <label className="pm-field">Receiving company<select value={targetCompany} onChange={e=>{setCompanyId(e.target.value);setSelectedJob('');setMessage('');setNotice('')}}>{eligibleCompanies.length===0&&<option value="">No partner companies with vacancies</option>}{eligibleCompanies.map(c=><option key={c.id} value={c.id}>{c.name}{connectedIds.includes(c.id)?' · Connected':''}</option>)}</select></label>
 <label className="pm-field">Open position<select value={targetJob?.id||''} onChange={e=>{setSelectedJob(e.target.value);setMessage('')}}>{!availableJobs.length&&<option value="">No positions available</option>}{availableJobs.map(j=><option key={j.id} value={j.id}>{j.title} · {j.mode} · {j.location}</option>)}</select></label>
 <div className={`pm-referral-connection ${status==='accepted'?'active':''}`}><ShieldCheck size={18}/><div><strong>Partner relationship: {status==='accepted'?'Connected':status==='pending'?'Awaiting approval':'Not connected'}</strong><small>{status==='accepted'?'You may request consent for this company’s roles.':status==='pending'?'Switch to the receiving company to approve this demo connection.':'A partner connection is needed before private referrals can be shared.'}</small></div></div>
 {status==='none'&&targetCompany&&<button className="pm-button secondary" type="button" onClick={createConnection}>Request partner connection <ArrowRight size={16}/></button>}
 {status==='pending'&&<button className="pm-button secondary" type="button" onClick={()=>switchEmployer(targetCompany)}>Switch to receiving employer <ArrowRight size={16}/></button>}
 <label className="pm-field">Recommendation message<textarea rows={7} maxLength={600} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Summarize specific documented experience, why this vacancy may be relevant, and invite the receiving HR to review."/></label><div className="pm-button-row"><button className="pm-button secondary" type="button" onClick={sampleMessage} disabled={!best}>Fill with sample recommendation</button><small className="pm-note">{message.length}/600 characters</small></div>
 {best?<><div className="pm-status"><strong>Selected vacancy:</strong> {best.job.title} · {companies.find(c=>c.id===best.job.companyId)?.name}<p>{best.fit.matched}/{best.fit.total} requirements mentioned · {best.fit.score}% illustrative evidence score</p></div><p className="pm-note">{best.fit.summary}</p><button className="pm-button" type="button" disabled={status!=='accepted'||!message.trim()} onClick={request}><Send size={17}/> Request candidate consent</button></>:<div className="pm-empty">Choose a candidate and a receiving company with at least one listed vacancy.</div>}
 {notice&&<p role="status" className="pm-status">{notice}</p>}{storageError&&<p role="alert" className="pm-error">{storageError}</p>}
 <div className="pm-referral-steps"><strong>How the referral works</strong><p>1. Select candidate + vacancy → 2. Request permission → 3. Candidate approves in My Referrals → 4. Referring HR sends → 5. Receiving HR reviews.</p><Link href={`/demo/my-referrals?candidate=${encodeURIComponent(candidate?.id||'')}`}>Open candidate consent page <ArrowRight size={15}/></Link></div></section>
 <div className="pm-stack"><section className="pm-card pm-stack"><span className="small-eyebrow">02 · INCOMING</span><h2>Received referrals <span className="pm-tag">{incoming.length}</span></h2>{incoming.length?incoming.map(r=>{const c=people.find(c=>c.id===r.candidateId);const j=jobs.find(j=>j.id===r.opportunityId);return <div className="pm-referral-message" key={r.id}><div className="pm-row"><span><strong>{c?.name||'Candidate'}</strong><small>{j?.title} · From {companies.find(c=>c.id===r.fromCompanyId)?.name}</small></span><span className="pm-tag">{r.status==='reviewed'?'Reviewed':'New referral'}</span></div><p>{r.note}</p>{r.status==='sent'&&<button className="pm-button secondary" type="button" onClick={()=>update(s=>reviewReferral({...s,view:'recruiter'},r.id))}>Mark reviewed</button>}</div>}):<p className="pm-empty">No referrals have been sent to {active?.name||'this company'} yet. Submit a referral, obtain candidate consent and switch to the receiving company to see it here.</p>}</section>
 <section className="pm-card pm-stack"><span className="small-eyebrow">03 · OUTGOING</span><h2>Sent & pending referrals <span className="pm-tag">{outgoing.length}</span></h2>{outgoing.length?outgoing.map(r=><div className="pm-row" key={r.id}><span><strong>{people.find(c=>c.id===r.candidateId)?.name}</strong><small>{companies.find(c=>c.id===r.toCompanyId)?.name} · {jobs.find(j=>j.id===r.opportunityId)?.title}</small><small>Status: {r.status.replaceAll('_',' ')}{r.consent==='pending'?' · Awaiting candidate permission':''}</small></span>{r.status==='ready_to_send'?<button className="pm-button" type="button" onClick={()=>update(s=>sendReferral({...s,view:'recruiter'},r.id))}><CheckCircle2 size={15}/> Send approved referral</button>:<span className="pm-tag">{r.status.replaceAll('_',' ')}</span>}</div>):<p className="pm-empty">No outgoing referrals yet. Start with the form on the left.</p>}</section>
 <section className="pm-card pm-stack"><h2>Partner invitations <span className="pm-tag">{pendingInvites.length}</span></h2>{pendingInvites.length?pendingInvites.map(connection=><div className="pm-row" key={connection.id}><span><strong>{companies.find(c=>c.id===connection.firstId)?.name}</strong><small>Requests a simulated company connection</small></span><div className="pm-button-row"><button className="pm-button secondary" type="button" onClick={()=>update(s=>decideConnection(s,connection.id,'accepted',s.activeCompanyId))}>Accept</button><button className="pm-button ghost" type="button" onClick={()=>update(s=>decideConnection(s,connection.id,'declined',s.activeCompanyId))}>Decline</button></div></div>):<p className="pm-note">No new connection requests for this employer.</p>}
 <Link className="pm-button secondary" href="/demo/companies">Browse all registered companies <ArrowRight size={16}/></Link></section></div></div>
 <p className="pm-note" style={{marginTop:18}}>Demonstration limitation: employer switching, consent and referral inbox activity are recorded only in this browser’s local storage. No external companies are contacted and no real HR account authentication or messaging occurs.</p></main>;
}

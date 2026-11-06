'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {ArrowRight,CheckCircle2,ShieldCheck} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {validateCandidateReply,type CandidateInterest,type Invitation,type InvitationReply} from '@/lib/connect';
import {readLocalInvitations,saveLocalInvitation} from '@/lib/connect-client';
export default function PassportClient(){
 const params=useSearchParams(),token=params.get('token')||'';
 const demoToken=/^[A-Za-z0-9_-]{16,80}$/.test(params.get('demo')||'')?(params.get('demo')||''):'';
 const [candidateId,setCandidateId]=useState(params.get('candidate')||'C01'),[roleId,setRoleId]=useState(params.get('role')||'qa');
 const [record,setRecord]=useState<Invitation|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(Boolean(token));
 const [interest,setInterest]=useState<CandidateInterest>('learn_more'),[workMode,setWorkMode]=useState<InvitationReply['workMode']>('not_sure'),[note,setNote]=useState(''),[consent,setConsent]=useState(false),[saved,setSaved]=useState(false),[busy,setBusy]=useState(false);
 useEffect(()=>{
  if(!token){const local=readLocalInvitations();setRecord((demoToken?local.find(x=>x.token===demoToken):local.filter(x=>x.candidateId===candidateId&&x.roleId===roleId).at(-1))||null);return;}
  (async()=>{try{const response=await fetch(`/api/connect/status?token=${encodeURIComponent(token)}`,{cache:'no-store'});const data=await response.json() as {invitation?:Invitation;error?:string};
    if(!response.ok||!data.invitation)throw new Error(data.error||'This invitation is unavailable.');
    setRecord(data.invitation);setCandidateId(data.invitation.candidateId);setRoleId(data.invitation.roleId);
  }catch(e){setError(e instanceof Error?e.message:'Could not load invitation.')}finally{setLoading(false)}})();
 },[token,demoToken,candidateId,roleId]);
 const person=candidates.find(c=>c.id===candidateId),role=roles.find(r=>r.id===roleId);
 async function save(e:React.FormEvent){e.preventDefault();setError('');
  if(!consent){setError('Please confirm you want to share your reply.');return}
  if(!person||!role){setError('This invitation is not available.');return}
  setBusy(true);
  try{const reply=validateCandidateReply({interest,workMode,note},'passport');
   if(token){const response=await fetch('/api/connect/reply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...reply,token})});const data=await response.json() as {error?:string};if(!response.ok)throw new Error(data.error||'Could not save your response.');}
   else {saveLocalInvitation({token:demoToken||record?.token||`demonstration-${candidateId}-${roleId}-2026`,candidateId,roleId,createdAt:record?.createdAt||new Date().toISOString(),reply});}
   setSaved(true);
  }catch(e){setError(e instanceof Error?e.message:'Please try again.')}finally{setBusy(false)}
 }
 return <main className="passport-shell"><div className="passport-top"><strong>ProofMatch <span>AI</span></strong><span>Fictional candidate experience</span></div>
  <div className="passport-card"><span className="small-eyebrow">A NEW POSSIBILITY</span><h1>Another opportunity might suit you.</h1>
   <p>We'd like to know what matters to you before taking the next step.</p>
   {loading?<p role="status">Opening your invitation…</p>:error&&token&&!record?<p role="alert" className="connect-error">{error}</p>:person&&role&&(!token||record)?<>
    <div className="passport-role"><small>Open job</small><h2>{role.title}</h2><p>Location: {role.location}</p><p>Work style: {role.acceptedModes.join(' or ')}</p></div>
    <p className="passport-help">This invitation is for a sample person, {person.alias}. Being invited does not mean you've been shortlisted or offered a job.</p>
    {saved?<div className="passport-success"><CheckCircle2 size={25}/><h2>Thanks for sharing!</h2><p>Your response has been saved {token?'for the recruiter to review':'in this browser for the demo'}. You can close this page.</p><Link href={`/demo/connect?candidate=${candidateId}&role=${roleId}`} className="button button-secondary">Return to recruiter view <ArrowRight size={16}/></Link></div>:<form onSubmit={save} className="passport-form">
      <fieldset><legend>Would you like to explore this job?</legend>
       {([['interested',"Yes, I'm interested"],['learn_more','Tell me more first'],['not_now','Not right now']] as [CandidateInterest,string][]).map(([value,label])=><label key={value}><input type="radio" name="interest" value={value} checked={interest===value} onChange={()=>setInterest(value)}/>{label}</label>)}
      </fieldset>
      <label>What working style would suit you?<select value={workMode} onChange={e=>setWorkMode(e.target.value as InvitationReply['workMode'])}><option value="not_sure">I'm not sure yet</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></select></label>
      <label>Anything else you'd like the recruiter to know? <small>(optional)</small><textarea maxLength={450} value={note} onChange={e=>setNote(e.target.value)} rows={4} placeholder="For example, I'd like to understand the team and location…"/></label>
      <button type="button" className="button button-secondary" onClick={()=>{setInterest("interested");setWorkMode("hybrid");setNote("Fictional response: I am interested in learning more about the QA team, salary range, and hybrid working arrangements.");setConsent(true);setError("")}}>Fill demo reply</button><label className="passport-consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>I choose to share this response for a human recruiter to review.</label>
      {error&&<p role="alert" className="connect-error">{error}</p>}
      <button disabled={busy||!consent} className="button button-jade" type="submit">{busy?'Saving…':'Send my response'} <ArrowRight size={16}/></button>
    </form>}
   </>:<p role="alert">This invitation is unavailable. Please ask the recruiter for a new link.</p>}
    <p className="passport-small"><ShieldCheck size={15}/> This sample is not an official job application. No automatic hiring or rejection.</p>
  </div><footer className="passport-foot"><Link href="/">About ProofMatch</Link> · Illustrative profile</footer>
 </main>;
}

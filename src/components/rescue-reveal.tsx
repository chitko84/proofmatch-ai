'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Eye, MoveRight, Sparkles, ShieldCheck } from 'lucide-react';
import { candidates, roles } from '@/lib/data';
import { rankRoles } from '@/lib/engine';

const rescued = candidates.map(candidate => ({candidate, top:rankRoles(candidate,roles)[0]}))
  .filter(item => item.top.alternativeToApplied);

/** Motion is presentation only. All decisions remain reviewable and human-controlled. */
export function RescueReveal() {
  const [active,setActive] = useState<string>('');
  return <div className="rescue-experience">
    <div className="rescue-intro"><span className="section-eyebrow">LIVE INTERACTIVE DEMO</span><h2>Open a door someone else missed.</h2><p>Choose a fictional candidate to reveal the most source-supported alternative role. This is a recommendation for review, not a job offer.</p></div>
    <div className="rescue-selector" aria-label="Choose a candidate">
      {rescued.map(({candidate,top})=><button key={candidate.id} type="button" onClick={()=>setActive(candidate.id)} className={`rescue-person ${active===candidate.id?'active':''}`} aria-pressed={active===candidate.id}>
        <span className="profile-circle">{candidate.id.slice(-2)}</span><span><strong>{candidate.alias}</strong><small>Applied: {roles.find(r=>r.id===candidate.appliedRoleId)?.title}</small></span><ArrowRight size={17}/>
      </button>)}
    </div>
    {!active ? <div className="rescue-await"><div className="rescue-await-art"><span>?</span><Sparkles size={30}/></div><h3>There may be another role to explore.</h3><p>Select a candidate above to reveal the alternative role and see why the system suggested it.</p></div> : rescued.filter(({candidate})=>candidate.id===active).map(({candidate,top})=>{
      const applied=roles.find(r=>r.id===candidate.appliedRoleId)!;
      const alternate=roles.find(r=>r.id===top.roleId)!;
      const sourceExamples=top.assessments.filter(a=>a.support==='artifact'&&a.evidence);
      return <div className="rescue-reveal" key={active} aria-live="polite">
        <div className="rescue-dual">
          <div className="rescue-original"><span className="rescue-tiny">ORIGINAL APPLICATION</span><h3>{applied.title}</h3><p>The position the person originally selected.</p></div>
          <div className="rescue-direction"><MoveRight size={28}/><span>New possibility</span></div>
          <div className="rescue-alternative"><span className="rescue-tiny"><Sparkles size={14}/> WORTH ANOTHER LOOK</span><h3>{alternate.title}</h3><p>{sourceExamples.length} project excerpt{sourceExamples.length===1?'':'s'} supplied for this role.</p></div>
        </div>
        <div className="rescue-story">
          <div><span className="section-eyebrow">WHY THIS ROLE?</span><h3>Not a guess. Look at the sources.</h3><p>These examples were provided in the fictional profile. They still need human assessment.</p></div>
          <div className="rescue-proofs">{sourceExamples.map((a,i)=><details key={a.requirement.skillId} className="rescue-proof" open={i===0}><summary><span className="rescue-proof-index">0{i+1}</span><span>{a.requirement.label}</span><Eye size={17}/></summary><div><small>{a.evidence?.sourceLabel}</small><blockquote>“{a.evidence?.excerpt}”</blockquote></div></details>)}</div>
        </div>
        <div className="rescue-result-footer"><span><ShieldCheck size={17}/> HR makes the final decision.</span><Link className="button button-jade" href={`/demo/matches?candidate=${candidate.id}&role=${top.roleId}`}>Inspect the full match <ArrowUpRight size={17}/></Link></div>
      </div>;
    })}
  </div>;
}

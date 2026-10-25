'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowRight, BellRing, ChevronLeft, ChevronRight, Clock3, MessageCircle, ScanSearch, Watch} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {getWatchSignals} from '@/lib/proofwatch';

const signals=getWatchSignals(candidates,roles);

/** Premium but functional wearable-style demo notification. No fabricated live alert events. */
export function ProofWatch({compact=false}:{compact?:boolean}){
  const [index,setIndex]=useState(0);
  const [time,setTime]=useState('--:--');
  const [expanded,setExpanded]=useState(!compact);
  useEffect(()=>{
    const update=()=>setTime(new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit'}).format(new Date()));
    update();const interval=window.setInterval(update,30_000);return()=>window.clearInterval(interval);
  },[]);
  const signal=signals[index]||null;
  const change=(direction:number)=>setIndex(i=>(i+direction+signals.length)%signals.length);
  return <section className={`proofwatch-section ${compact?'proofwatch-compact':''}`} aria-label="ProofWatch fictional matching signals">
    <div className="proofwatch-intro">
      <span className="small-eyebrow"><Watch size={15}/> PROOFWATCH · SAMPLE SIGNALS</span>
      <h2>Good opportunities deserve a signal.</h2>
      <p>Our watch highlights people whose supplied work examples support a different role. These are sample findings, not live hiring alerts.</p>
      {signal&&<div className="proofwatch-summary" aria-live="polite">
        <span className="proofwatch-signal-mark"><BellRing size={19}/></span>
        <div><strong>{signal.candidateName} · Alternative to explore</strong>
          <span>Applied for {signal.appliedRole}. The sample evidence currently points more strongly to {signal.alternativeRole}.</span>
        </div>
      </div>}
      {signal?<div className="proofwatch-actions"><Link className="button button-jade" href={`/demo/matches?candidate=${encodeURIComponent(signal.candidateId)}&role=${encodeURIComponent(signal.alternativeRoleId)}`}>Review the evidence <ArrowRight size={16}/></Link><Link className="proofwatch-ask" href={`/demo/mira?candidate=${encodeURIComponent(signal.candidateId)}&role=${encodeURIComponent(signal.alternativeRoleId)}`}><MessageCircle size={16}/> Ask Mira</Link></div>:<p className="proofwatch-empty">No stronger alternative-role findings in these sample profiles.</p>}
      {signal&&<div className="proofwatch-navigation"><button type="button" aria-label="Previous sample signal" onClick={()=>change(-1)} disabled={signals.length<2}><ChevronLeft size={17}/></button><span>{index+1} of {signals.length} sample signals</span><button type="button" aria-label="Next sample signal" onClick={()=>change(1)} disabled={signals.length<2}><ChevronRight size={17}/></button></div>}
      {compact&&<button type="button" className="proofwatch-toggle" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>{expanded?'Hide details':'Show details'} <ChevronRight size={15}/></button>}
      {expanded&&signal&&<div className="proofwatch-evidence"><ScanSearch size={16}/><p><strong>Why it lit up</strong><span>{signal.evidenceLine}</span><small>Candidate-supplied excerpt · {signal.evidenceSource} · Not independently verified</small></p></div>}
    </div>
    <div className="proofwatch-visual" aria-hidden="true">
      <div className="proofwatch-halo"/>
      <div className="proofwatch-device">
        <div className="proofwatch-strap top"/><div className="proofwatch-crown"/>
        <div className="proofwatch-case"><div className="proofwatch-screen">
          <div className="proofwatch-face-top"><span>PROOFWATCH</span><Clock3 size={12}/></div>
          <div className="proofwatch-time">{time}</div>
          <div className="proofwatch-activity"><span className="proofwatch-pulse"/><span>Sample insight</span></div>
          <div className="proofwatch-alert"><BellRing size={19}/><strong>{signal?'Role worth exploring':'Ready to review'}</strong><span>{signal?signal.candidateName:'No signal available'}</span><small>{signal?signal.alternativeRole:'Try the demo workspace'}</small></div>
          <div className="proofwatch-face-bottom"><span>HUMANS DECIDE</span><span>{signals.length} signal{signals.length===1?'':'s'}</span></div>
        </div></div><div className="proofwatch-strap bottom"/>
      </div>
      <span className="proofwatch-orbit orbit-one"/><span className="proofwatch-orbit orbit-two"/>
    </div>
  </section>;
}

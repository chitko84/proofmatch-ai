'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowRight, BellRing, ChevronLeft, ChevronRight, Clock3, MessageCircle, ScanSearch, Watch} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {getWatchSignals} from '@/lib/proofwatch';
import {directorySignals} from '@/lib/featured-watch-signals';

const classicSignals=getWatchSignals(candidates,roles);

/** Premium but functional wearable-style demo notification. No fabricated live alert events. */
export function ProofWatch({compact=false,mode='classic'}:{compact?:boolean;mode?:'classic'|'directory'}){
  const signals=mode==='directory'?directorySignals:classicSignals;
  const [index,setIndex]=useState(0);
  const [time,setTime]=useState('--:--');
  const [expanded,setExpanded]=useState(!compact);
  useEffect(()=>{
    const update=()=>setTime(new Intl.DateTimeFormat(undefined,{hour:'2-digit',minute:'2-digit'}).format(new Date()));
    update();const interval=window.setInterval(update,30_000);return()=>window.clearInterval(interval);
  },[]);
  const signal=signals[index]||null;
  const change=(direction:number)=>setIndex(i=>(i+direction+signals.length)%signals.length);
  return <section className={`proofwatch-section ${compact?'proofwatch-compact':''}`} aria-label="ProofWatch candidate role discoveries">
    <div className="proofwatch-intro">
      <span className="small-eyebrow"><Watch size={15}/> PROOFWATCH · ROLE DISCOVERIES</span>
      <h2>Good opportunities deserve a signal.</h2>
      <p>Explore candidates whose documented experience may suit a different role. Each signal links to a detailed job comparison.</p>
      {signal&&<div className="proofwatch-summary" aria-live="polite">
        <span className="proofwatch-signal-mark"><BellRing size={19}/></span>
        <div><strong>{signal.candidateName} · Alternative to explore</strong>
          <span>Applied for {signal.appliedRole}. Their supplied evidence aligns more strongly with {signal.alternativeRole}.</span>
        </div>
      </div>}
      {signal?<div className="proofwatch-actions"><Link className="button button-jade" href={mode==='directory'?`/demo/candidate-compare?candidate=${encodeURIComponent(signal.candidateId)}&job=${encodeURIComponent(signal.alternativeRoleId)}`:`/demo/matches?candidate=${encodeURIComponent(signal.candidateId)}&role=${encodeURIComponent(signal.alternativeRoleId)}`}>Review the evidence <ArrowRight size={16}/></Link><Link className="proofwatch-ask" href={mode==='directory'?'/demo/discover':`/demo/mira?candidate=${encodeURIComponent(signal.candidateId)}&role=${encodeURIComponent(signal.alternativeRoleId)}`}><MessageCircle size={16}/> {mode==='directory'?'All candidates':'Ask Mira'}</Link></div>:<p className="proofwatch-empty">No stronger alternative-role findings in these sample profiles.</p>}
      {signal&&<div className="proofwatch-navigation"><button type="button" aria-label="Previous role discovery" onClick={()=>change(-1)} disabled={signals.length<2}><ChevronLeft size={17}/></button><span>{index+1} of {signals.length} role discoveries</span><button type="button" aria-label="Next role discovery" onClick={()=>change(1)} disabled={signals.length<2}><ChevronRight size={17}/></button></div>}
      {compact&&<button type="button" className="proofwatch-toggle" aria-expanded={expanded} onClick={()=>setExpanded(v=>!v)}>{expanded?'Hide details':'Show details'} <ChevronRight size={15}/></button>}
      {expanded&&signal&&<div className="proofwatch-evidence"><ScanSearch size={16}/><p><strong>Why it lit up</strong><span>{signal.evidenceLine}</span><small>Candidate-provided work example · {signal.evidenceSource}</small></p></div>}
    </div>
    <div className="proofwatch-visual" aria-hidden="true">
      <div className="proofwatch-halo"/>
      <div className="proofwatch-device">
        <div className="proofwatch-strap top"/><div className="proofwatch-crown"/>
        <div className="proofwatch-case"><div className="proofwatch-screen">
          <div className="proofwatch-face-top"><span>PROOFWATCH</span><Clock3 size={12}/></div>
          <div className="proofwatch-time">{time}</div>
          <div className="proofwatch-activity"><span className="proofwatch-pulse"/><span>Evidence insight</span></div>
          <div className="proofwatch-alert"><BellRing size={19}/><strong>{signal?'Role worth exploring':'Ready to review'}</strong><span>{signal?signal.candidateName:'No signal available'}</span><small>{signal?signal.alternativeRole:'Try the demo workspace'}</small></div>
          <div className="proofwatch-face-bottom"><span>HUMANS DECIDE</span><span>{signals.length} signal{signals.length===1?'':'s'}</span></div>
        </div></div><div className="proofwatch-strap bottom"/>
      </div>
      <span className="proofwatch-orbit orbit-one"/><span className="proofwatch-orbit orbit-two"/>
    </div>
  </section>;
}

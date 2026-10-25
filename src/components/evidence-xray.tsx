'use client';
import { useState } from 'react';
import { Check, Eye, FileSearch, Info, ScanEye } from 'lucide-react';
import type { MatchReport } from '@/lib/types';
import { highlightSourceQuote } from '@/lib/evidence-xray';

export function EvidenceXray({report, live}: {report:MatchReport;live:boolean}) {
  const [selected,setSelected] = useState<string | null>(null);
  const current = report.assessments.find(a => a.requirement.skillId === selected)
    || report.assessments.find(a => a.evidence) || report.assessments[0];
  const pieces = current?.evidence ? highlightSourceQuote(current.evidence.excerpt,current.requirement.skillId):[];
  return <div className="xray-wrapper">
    <div className="xray-eyebrow"><ScanEye size={17}/> WHERE WE FOUND THIS <span>Choose a skill to see the original words</span></div>
    <div className="xray-skill-list" role="group" aria-label="Select a requirement to inspect">
      {report.assessments.map(a => <button type="button" key={a.requirement.skillId} onClick={()=>setSelected(a.requirement.skillId)} className={`xray-skill ${a.requirement.skillId===current?.requirement.skillId?'selected':''}`} aria-pressed={a.requirement.skillId===current?.requirement.skillId}>
        <span className={`evidence-bubble ${a.support}`}><span>{a.support==='artifact'?<Check size={15}/>:a.support==='missing'?'?':'i'}</span></span>
        <span><strong>{a.requirement.label}</strong><small>{a.support==='artifact'?'Project example supplied':a.support==='self_report'?'Candidate statement':'No example supplied'}</small></span>
        <Eye size={17} className="xray-open-icon"/>
      </button>)}
    </div>
    {current && <div className="xray-source" aria-live="polite" key={`${report.candidateId}-${report.roleId}-${current.requirement.skillId}`}>
      <div className="xray-source-head"><div><FileSearch size={19}/><span>From the application</span></div><span>{current.support==='artifact'?'Project example':current.support==='self_report'?'Candidate statement':'Not shared'}</span></div>
      <h3>{current.requirement.label}</h3>
      {current.evidence ? <>
        <p className="xray-source-label">{current.evidence.sourceLabel}</p>
        <blockquote>“{pieces.map((part,i)=>part.highlighted?<mark key={i}>{part.text}</mark>:<span key={i}>{part.text}</span>)}”</blockquote>
        <p className="xray-disclaimer"><Info size={15}/> {live?'These words are in the supplied text, but we have not checked who wrote them or whether the person has this skill.':'Highlighted words are from the fictional example. They do not prove a skill on their own.'}</p>
      </> : <div className="xray-unknown">No source excerpt provided for this requirement. That does not establish the person lacks this skill. Try FairShot to request an example.</div>}
    </div>}
  </div>;
}

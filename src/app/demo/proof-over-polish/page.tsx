'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,CheckCircle2,FlaskConical,Info,ShieldCheck,TextCursorInput} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {compareEquivalentEvidence} from '@/lib/wording-check';
export default function ProofOverPolish(){
 const [id,setId]=useState('C01');const [expanded,setExpanded]=useState(false);
 const candidate=candidates.find(c=>c.id===id)!;
 const check=useMemo(()=>compareEquivalentEvidence(candidate,roles),[candidate]);
 return <div className="workspace-page">
  <div className="page-title-row"><div><span className="small-eyebrow">PROOF OVER POLISH · EVALUATION LAB</span><h1>Different words. Same evidence?</h1><p>Explore whether our rule-based comparison changes when supplied excerpts become more polished but the underlying evidence labels stay exactly the same.</p></div><FlaskConical size={30}/></div>
  <div className="gentle-note prominent-note"><Info size={18}/><span><strong>Important boundary:</strong> This test holds extracted skills and evidence categories fixed. It only tests the deterministic matching calculation, <strong>not</strong> whether Gemini extracts equivalent facts from differently written CVs, nor whether hiring is fair.</span></div>
  <div className="white-panel wording-lab"><div className="panel-heading"><div><span className="small-eyebrow">CONTROLLED COMPARISON</span><h2>Change presentation, not the evidence labels.</h2></div><TextCursorInput size={21}/></div>
   <label className="wording-select">Fictional candidate<select value={id} onChange={e=>{setId(e.target.value);setExpanded(false)}}>{candidates.map(c=><option key={c.id} value={c.id}>{c.alias}</option>)}</select></label>
   <div className="wording-compare"><div className="wording-version"><span className="wording-kicker">VERSION A</span><h3>Original sample wording</h3><p>{candidate.evidence[0]?.excerpt}</p></div><div className="wording-version rich"><span className="wording-kicker">VERSION B</span><h3>Longer, more polished wording</h3><p>{check.rewritten.evidence[0]?.excerpt}</p></div></div>
   <button type="button" onClick={()=>setExpanded(!expanded)} className="button button-jade">{expanded?'Hide comparison':'Run comparison'} <ArrowRight size={17}/></button>
   {expanded&&<div className="wording-results"><div className="wording-verdict"><CheckCircle2 size={23}/><div><strong>{check.sameRank&&check.sameCoverage?'Stable results in this controlled example':'A difference was found'}</strong><p>Both versions used the same extracted skill IDs and evidence categories.</p></div></div><div className="wording-result-grid">{check.original.map((report,i)=><div key={report.roleId} className="wording-role"><strong>{roles.find(r=>r.id===report.roleId)?.title}</strong><div><span>A: {Math.round(report.coverage*100)}%</span><span>B: {Math.round(check.restyled[i].coverage*100)}%</span></div><div className="coverage-bar"><span style={{width:`${Math.round(report.coverage*100)}%`}}/></div></div>)}</div><p className="page-footnote">Coverage percentages compare documented evidence weights, not suitability or selection probability. A real robustness study must separately test Gemini extraction on paraphrased, reordered and AI-assisted CVs; this lab does not do that.</p></div>}
  </div>
  <div className="wording-bottom"><ShieldCheck size={19}/><div><strong>How could we test this more thoroughly?</strong><p>Collect equivalent fictional CV variants, run independent Gemini extractions, compare quotation validity and match stability, and report failures instead of hiding them.</p></div><Link href="/demo/analyze" className="button button-soft">Try real Gemini extraction <ArrowUpRight size={15}/></Link></div>
 </div>
}

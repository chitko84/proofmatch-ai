'use client';
import { useEffect,useMemo,useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, CircleHelp, Compass, FileCheck2, MapPin, MessageCircleQuestion, ShieldCheck, Sparkles } from 'lucide-react';
import { candidates,roles } from '@/lib/data';
import { LIVE_STORAGE_KEY, parseStoredAnalysis, type LiveResult } from '@/lib/live-analysis';
import { assessMatch, rankRoles } from '@/lib/engine';
import { readReviews,writeReviews,type ReviewRecords,type ReviewStatus } from '@/lib/reviews';
import { candidateWithReplies, readReplies, type CandidateReply } from '@/lib/phase3';
import { EvidenceXray } from '@/components/evidence-xray';
import { ClipboardCheck } from 'lucide-react';

export default function MatchesPage(){
  const [candidateId,setCandidateId]=useState('C01');
  const [roleId,setRoleId]=useState('qa');
  const [reviews,setReviews]=useState<ReviewRecords>({});
  const [live,setLive]=useState<LiveResult|null>(null);
  const [replies,setReplies]=useState<CandidateReply[]>([]);
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const c=params.get('candidate');const r=params.get('role');
    const saved=parseStoredAnalysis(sessionStorage.getItem(LIVE_STORAGE_KEY));
    setLive(saved);
    if(c==='LIVE'&&saved){setCandidateId('LIVE');setRoleId(rankRoles(saved.candidate,roles)[0].roleId);}
    if(c&&candidates.some(x=>x.id===c)){setCandidateId(c);if(!r){const cd=candidates.find(x=>x.id===c)!;setRoleId(rankRoles(cd,roles)[0].roleId)}}
    if(r&&roles.some(x=>x.id===r))setRoleId(r);
    setReviews(readReviews());
    setReplies(readReplies());
    const refresh=()=>setReplies(readReplies());
    window.addEventListener('proofmatch-replies-updated',refresh);
    return ()=>window.removeEventListener('proofmatch-replies-updated',refresh);
  },[]);
  const originalCandidate=candidateId==='LIVE'&&live?live.candidate:candidates.find(c=>c.id===candidateId)||candidates[0];
  const candidate=useMemo(()=>candidateId==='LIVE'?originalCandidate:candidateWithReplies(originalCandidate,replies),[candidateId,originalCandidate,replies]);
  const role=roles.find(r=>r.id===roleId)!;
  const addedReplies=candidateId==='LIVE'?0:replies.filter(r=>r.candidateId===candidateId).length;
  const ranked=useMemo(()=>rankRoles(candidate,roles),[candidate]);
  const report=assessMatch(candidate,role);
  const key=`${candidateId}:${roleId}`;
  function setDecision(status:ReviewStatus){const next={...reviews,[key]:status};setReviews(next);writeReviews(next);}
  const originalRole=roles.find(r=>r.id===candidate.appliedRoleId)!;
  return <div className="workspace-page"><div className="page-title-row"><div><span className="small-eyebrow">EXPLORE THE MATCHES</span><h1>See why a job could be a good fit.</h1><p>Compare three jobs for one person, then open the supporting information.</p></div><Link href="/demo/analyze" className="button button-jade">Check a new CV <ArrowUpRight size={16}/></Link></div>
    <div className="gentle-note prominent-note"><CircleHelp size={18}/><span><strong>{candidateId==='LIVE'&&live?'Gemini analysis:':'Fictional example:'}</strong> {candidateId==='LIVE'&&live?`Gemini found information from the text you supplied. We removed ${live.evidenceRejected} part(s) that could not be matched to the original text. The job comparisons follow clear, fixed rules.`:'These job comparisons use fictional profiles and clearly defined rules. You can also try a fictional CV with Gemini.'}</span></div>
    {addedReplies>0&&<div className="gentle-note"><Check size={17}/>{addedReplies} candidate clarification(s) are included as self-reported statements, never independent proof. <Link href="/demo/candidate-reply">See the original and updates</Link>.</div>}
    {candidateId==='LIVE'&&live&&live.warnings.length>0&&<div className="gentle-note">{live.warnings.join(' ')}</div>}
    <section className="select-candidate-row"><label htmlFor="candidate-chooser"><span className="small-eyebrow">CHOOSE A CANDIDATE</span><select id="candidate-chooser" value={candidateId} onChange={e=>{const id=e.target.value;setCandidateId(id);const chosen=id==='LIVE'?live?.candidate:candidates.find(c=>c.id===id);if(chosen)setRoleId(rankRoles(chosen,roles)[0].roleId);}}>{live&&<option value="LIVE">{live.candidate.alias} — Gemini analysis</option>}{candidates.map(c=><option key={c.id} value={c.id}>{c.alias} — Applied for {roles.find(r=>r.id===c.appliedRoleId)?.title}</option>)}</select></label><div><span className="small-eyebrow">INTERESTS & LOCATION</span><p><MapPin size={15}/> {candidate.location} · {candidate.interests.length?candidate.interests.join(', '):'New text analysis'}</p></div></section>
    <section className="white-panel"><div className="panel-heading"><div><span className="small-eyebrow">THREE ROLES · ONE PERSON</span><h2>Which role has more supporting evidence?</h2></div><Link className="subtle-link" href="/demo/discover">Explore overlooked matches <ArrowUpRight size={17}/></Link></div><div className="match-role-grid">{ranked.map((m,i)=>{const r=roles.find(x=>x.id===m.roleId)!;return <button key={r.id} className={`match-role-card ${roleId===r.id?'match-role-selected':''}`} onClick={()=>setRoleId(r.id)} type="button"><div className="role-card-top"><span className="small-eyebrow">{m.alternativeToApplied?'ANOTHER ROLE':'APPLIED ROLE'}</span><span className={`match-tier tier-${m.tier}`}>{m.tier==='strong'?'Strong evidence':m.tier==='partial'?'Some evidence':'Needs more info'}</span></div><strong>{r.title}</strong><div className="coverage-bar"><span style={{width:`${Math.round(m.coverage*100)}%`}}/></div><div className="role-card-footer"><span>{i===0&&m.alternativeToApplied?'✦ Worth another look':'Review this role'}</span><ArrowRight size={17}/></div></button>})}</div><p className="page-footnote compact">The bars show how much supporting information we found for each job. They do not predict who will get hired.</p></section>
    <div className="two-column-grid result-grid"><section className="white-panel"><div className="panel-heading"><div><span className="small-eyebrow">WHERE WE FOUND THIS</span><h2>Why {role.title}?</h2></div><FileCheck2 size={22}/></div><div className="support-overview"><div className="support-overview-icon"><Sparkles size={22}/></div><div><strong>{report.tier==='strong'?'There is useful supporting information.':report.tier==='partial'?'Some requirements have supporting information.':'More information would help.'}</strong><p>Open each source below. A written project example does not by itself confirm someone can do the work.</p></div></div><EvidenceXray report={report} live={candidateId==='LIVE'}/></section>
    <section className="white-panel"><div className="panel-heading"><div><span className="small-eyebrow">YOUR NEXT STEP</span><h2>What should we check?</h2></div><MessageCircleQuestion size={22}/></div><div className="review-section-label">A question worth asking</div><div className="suggestion-box"><MessageCircleQuestion size={21}/><p>{report.questions[0]||'All listed requirements have source examples. A real skill assessment is still needed before hiring.'}</p></div><div className="review-section-label">Do working preferences match?</div><div className="expectation-row"><span className={`expect-icon ${report.logistics}`}><Compass size={18}/></span><div><strong>{report.logistics==='compatible'?'Work preferences overlap':'Let’s double-check work preferences'}</strong><p>{report.logisticsNote}</p></div></div>{candidateId!=='LIVE'?<Link href={`/demo/expectations?candidate=${candidateId}&role=${roleId}`} className="button button-secondary">Compare what both sides want <ArrowRight size={16}/></Link>:<p className="page-footnote">To explore two-way work preferences, choose a preloaded fictional candidate. New CV analysis is not silently replaced with another person.</p>}<div className="fairshot-inline-cta"><ClipboardCheck size={22}/><div><strong>Give this person a fair shot</strong><p>Invite a short, consistent skills example for an unclear requirement.</p></div><Link href={`/demo/fairshot?candidate=${candidateId==='LIVE' ? 'C01' : candidateId}&role=${roleId}`} className="button button-soft">Try FairShot <ArrowUpRight size={15}/></Link></div>{candidateId==='LIVE'&&<p className="page-footnote">FairShot currently uses only fictional preloaded profiles; choosing it opens Candidate 01.</p>}<div className="review-section-label">Your review decision</div><div className="action-buttons"><button className={`review-action ${reviews[key]==='clarification'?'review-action-active':''}`} type="button" onClick={()=>setDecision('clarification')}>Ask for more details</button><button className={`review-action ${reviews[key]==='review'?'review-action-active':''}`} type="button" onClick={()=>setDecision('review')}>Save for HR review</button></div>{reviews[key]&&<div className="saved-feedback"><Check size={17}/> Saved to <Link href="/demo/reviews">My review list</Link> in this browser.</div>}<div className="soft-divider"/>{candidateId!=='LIVE'&&<div className="connect-actions"><Link className="button button-secondary" href={`/demo/connect?candidate=${candidateId}&role=${roleId}`}>Invite to explore this open job <ArrowRight size={16}/></Link><Link className="button button-secondary" href={`/demo/interview?candidate=${candidateId}&role=${roleId}`}>Prepare interview questions <ArrowRight size={16}/></Link></div>}<div className="review-section-label">Original application</div><p className="original-role-note">{candidate.alias} originally applied for <strong>{originalRole.title}</strong>. {roleId!==candidate.appliedRoleId?'This is an alternative to explore, not an automatic change of application.':'You are reviewing the originally selected role.'}</p></section></div>
  </div>;
}

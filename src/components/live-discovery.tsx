'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { LIVE_STORAGE_KEY, findAlternative, parseStoredAnalysis, type LiveResult } from '@/lib/live-analysis';
import { roles } from '@/lib/data';

export function LiveDiscovery() {
  const [live,setLive]=useState<LiveResult|null>(null);
  useEffect(()=>{setLive(parseStoredAnalysis(sessionStorage.getItem(LIVE_STORAGE_KEY)));},[]);
  if(!live) return <div className="gentle-note">Want to try a new person? <Link href="/demo/analyze">Analyze fictional CV text with Gemini</Link>.</div>;
  const find=findAlternative(live.candidate);
  if(!find) return <div className="gentle-note"><Sparkles size={18}/>Your latest Gemini analysis did not reveal a clear, source-supported alternative role. This is a valid outcome—ProofMatch does not force a rescue. <Link href="/demo/matches?candidate=LIVE">View the full comparison</Link>.</div>;
  const applied=roles.find(r=>r.id===live.candidate.appliedRoleId);
  const alternative=roles.find(r=>r.id===find.best.roleId);
  return <article className="discovery-card live-discovery-card"><div className="discovery-card-person"><span className="profile-circle large">AI</span><div><span className="small-eyebrow">LATEST GEMINI ANALYSIS</span><h2>{live.candidate.alias}</h2><p>Applied for {applied?.title}</p></div></div><div className="discovery-card-recommendation"><span><Sparkles size={19}/> Another role worth checking</span><strong>{alternative?.title}</strong><p>{find.best.assessments.filter(a=>a.support==='artifact').length} source-linked project examples. HR must confirm qualifications.</p></div><Link className="button button-jade" href={`/demo/matches?candidate=LIVE&role=${find.best.roleId}`}>See the reasons <ArrowUpRight size={16}/></Link></article>;
}

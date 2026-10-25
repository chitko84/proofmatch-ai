'use client';
import Link from 'next/link';
import {useEffect,useMemo,useState} from 'react';
import {ArrowRight,ArrowUpRight,BarChart3,CheckCircle2,Compass,Filter,RotateCcw,ShieldCheck,Users,BriefcaseBusiness,Activity} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {DEFAULT_INSIGHT_FILTERS,getInsights,type InsightFilters} from '@/lib/analytics';
import {readReviews} from '@/lib/reviews';

const palette=['#137b6c','#c99b59','#5d7d99'];
const clamp=(n:number)=>Math.max(0,Math.min(100,n));
export default function Insights(){
 const [filters,setFilters]=useState<InsightFilters>({...DEFAULT_INSIGHT_FILTERS});
 const [spotlight,setSpotlight]=useState('C01');
 const [reviewed,setReviewed]=useState(0);
 const data=useMemo(()=>getInsights(filters),[filters]);
 useEffect(()=>{const refresh=()=>setReviewed(Object.keys(readReviews()).length);refresh();window.addEventListener('proofmatch-reviews-updated',refresh);return()=>window.removeEventListener('proofmatch-reviews-updated',refresh)},[]);
 const active=data.people.find(p=>p.id===spotlight)||data.people[0];
 const candidateRanks=active?data.ranked.find(r=>r.person.id===active.id):undefined;
 const high=Math.max(1,...data.intakes.map(w=>w.count));
 const trendPoints=data.intakes.map((w,i)=>`${38+i*121},${155-(w.count/high)*108}`).join(' ');
 const locations=[...new Set(candidates.map(c=>c.location))].sort();
 const roleSegments=data.jobCounts.map((r,i)=>({value:r.count,from:data.jobCounts.slice(0,i).reduce((s,v)=>s+v.count,0),color:palette[i]}));
 const total=data.people.length;
 const donut=total?`conic-gradient(${roleSegments.map(s=>`${s.color} ${s.from/total*100}% ${(s.from+s.value)/total*100}%`).join(', ')})`:'conic-gradient(#e3e9e6 0% 100%)';
 const change=<K extends keyof InsightFilters>(key:K,value:InsightFilters[K])=>setFilters(old=>({...old,[key]:value}));
 const reset=()=>{setFilters({...DEFAULT_INSIGHT_FILTERS});setSpotlight('C01')};
 return <main className="workspace-page insights-page">
  <div className="page-title-row"><div><span className="small-eyebrow">RECRUITER INSIGHTS · INTERACTIVE CHARTS</span><h1>Your talent, at a glance.</h1><p>Understand your candidate pool, spot overlooked possibilities, and choose where to look next.</p></div><Link href="/demo/guide" className="button button-jade">Follow the demo <ArrowUpRight size={17}/></Link></div>
  <div className="insights-integrity"><ShieldCheck size={19}/><p><strong>Illustrative recruitment analytics.</strong> All eight profiles and intake dates are fictional. Charts recalculate from the same candidate pool and matching rules. Percentages measure supplied evidence coverage—not hiring success, AI accuracy or real growth.</p></div>
  <section className="white-panel insights-filter-card" aria-label="Filter recruiter insights"><div className="insights-filter-heading"><span><Filter size={17}/> Explore the sample data</span><button className="insights-clear" type="button" onClick={reset}><RotateCcw size={15}/> Reset filters</button></div><div className="insights-filter-grid">
   <label>Applied job<select value={filters.appliedRole} onChange={e=>change('appliedRole',e.target.value)}><option value="all">All open jobs</option>{roles.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label>
   <label>Candidate location<select value={filters.location} onChange={e=>change('location',e.target.value)}><option value="all">All locations</option>{locations.map(x=><option key={x} value={x}>{x}</option>)}</select></label>
   <label>Preferred way of working<select value={filters.workMode} onChange={e=>change('workMode',e.target.value as InsightFilters['workMode'])}><option value="all">All preferences</option><option value="remote">Remote</option><option value="hybrid">Hybrid</option><option value="onsite">On-site</option></select></label>
   <label>Demo intake period<select value={filters.range} onChange={e=>change('range',e.target.value as InsightFilters['range'])}><option value="all">All four sample weeks</option><option value="last2">Last two sample weeks</option><option value="latest">Latest sample week</option></select></label>
  </div></section>
  <section className="insights-metrics" aria-label="Recruiter dashboard key figures">
   <article className="insight-stat"><div className="insight-stat-icon teal"><Users size={20}/></div><small>People in view</small><strong>{total}</strong><span>of {candidates.length} fictional profiles</span></article>
   <article className="insight-stat"><div className="insight-stat-icon amber"><Compass size={20}/></div><small>Worth another look</small><strong>{data.alternative.length}</strong><span>Best-supported role differs</span></article>
   <article className="insight-stat"><div className="insight-stat-icon blue"><CheckCircle2 size={20}/></div><small>Supported job skills</small><strong>{data.backed}</strong><span>of {data.requirementsChecked} checked requirements</span></article>
   <article className="insight-stat"><div className="insight-stat-icon purple"><BarChart3 size={20}/></div><small>Average evidence coverage</small><strong>{data.coverage}%</strong><span>Across {data.roleComparisons} role comparisons</span></article>
  </section>
  <section className="insights-chart-grid">
   <article className="white-panel insight-panel"><div className="insight-panel-head"><div><span className="small-eyebrow">FICTIONAL INTAKE TIMELINE</span><h2>When people joined the sample pool</h2></div><Activity size={19}/></div><p className="insight-subtitle">Four sample intake weeks. Change the filters to explore different groups.</p>
    <div className="insight-linechart"><svg viewBox="0 0 460 188" role="img" aria-label={`Sample intakes by week: ${data.intakes.map(w=>`${w.label}, ${w.count}`).join('; ')}`}><g stroke="#e4ece8" strokeWidth="1">{[47,101,155].map(y=><line key={y} x1="32" x2="435" y1={y} y2={y}/>)}</g><polygon points={`38,155 ${trendPoints} 401,155`} fill="#dcefe8" opacity=".75"/><polyline points={trendPoints} fill="none" stroke="#137b6c" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>{data.intakes.map((w,i)=>{const x=38+i*121,y=155-(w.count/high)*108;return <g key={w.label}><circle cx={x} cy={y} r="7" fill="#fff" stroke="#137b6c" strokeWidth="3"><title>{w.label}: {w.count} fictional candidates</title></circle><text x={x} y="181" textAnchor="middle" fill="#648079" fontSize="12">{w.label}</text><text x={x} y={Math.max(15,y-14)} textAnchor="middle" fill="#185f54" fontSize="13" fontWeight="700">{w.count}</text></g>})}</svg></div>
    <div className="insight-mini-note">Intake dates are fictional · Not actual hiring trends</div>
   </article>
   <article className="white-panel insight-panel"><div className="insight-panel-head"><div><span className="small-eyebrow">APPLICATIONS</span><h2>Where people first applied</h2></div><BriefcaseBusiness size={19}/></div><p className="insight-subtitle">One fictional initial application per person, grouped by role.</p>
    <div className="insight-donut-wrap"><div className="insight-donut" role="img" aria-label={data.jobCounts.map(r=>`${r.title}: ${r.count}`).join(', ')} style={{background:donut}}><div><strong>{total}</strong><small>people</small></div></div><div className="insight-legend">{data.jobCounts.map((r,i)=><div key={r.id}><span className="insight-legend-dot" style={{background:palette[i]}}/><div><strong>{r.title}</strong><small>{r.count} people · {total?Math.round(r.count/total*100):0}%</small></div></div>)}</div></div>
   </article>
   <article className="white-panel insight-panel"><div className="insight-panel-head"><div><span className="small-eyebrow">EVIDENCE COMPARISON</span><h2>How much information was supplied?</h2></div><CheckCircle2 size={19}/></div><p className="insight-subtitle">Role comparisons grouped by how much supporting information they contain.</p>
     <div className="insight-bars">{data.tierCounts.map((r,i)=><div className="insight-bar-group" key={r.tier}><div><strong>{r.tier==='strong'?'More evidence':r.tier==='partial'?'Some evidence':'Still to check'}</strong><span>{r.count} comparisons</span></div><div className="insight-bar-rail"><span style={{width:`${clamp(r.count/Math.max(1,data.roleComparisons)*100)}%`,background:palette[i]}} title={`${r.count} of ${data.roleComparisons} role comparisons`} /></div></div>)}</div><div className="insight-mini-note">Evidence coverage is not a measure of someone's ability.</div>
   </article>
   <article className="white-panel insight-panel"><div className="insight-panel-head"><div><span className="small-eyebrow">OTHER OPEN JOBS</span><h2>Where new possibilities appear</h2></div><Compass size={19}/></div><p className="insight-subtitle">Candidates whose strongest supported role differs from their initial application.</p>
     <div className="insight-bars">{data.jobCounts.map((r,i)=><div className="insight-bar-group" key={r.id}><div><strong>{r.title}</strong><span>{r.alternatives} possibilities</span></div><div className="insight-bar-rail"><span style={{width:`${clamp(r.alternatives/Math.max(1,data.alternative.length)*100)}%`,background:palette[i]}} title={`${r.alternatives} people for ${r.title}`} /></div></div>)}</div><Link className="insight-panel-link" href="/demo/discover">Explore overlooked candidates <ArrowRight size={15}/></Link>
   </article>
  </section>
  <section className="insights-bottom-grid">
   <article className="white-panel insight-panel"><div className="insight-panel-head"><div><span className="small-eyebrow">RECENT SAMPLE ACTIVITY</span><h2>People added to this example</h2></div><Users size={19}/></div>{data.recent.length?<div className="insights-feed">{data.recent.map(({person,date,role})=><Link key={person.id} href={`/demo/candidates/${person.id}`} className="insight-feed-row"><span className="profile-circle">{person.id.slice(-2)}</span><div><strong>{person.alias}</strong><small>{role.title} · {person.location}</small></div><time>{date.slice(5)}</time><ArrowUpRight size={16}/></Link>)}</div>:<div className="insight-empty"><h3>No examples match.</h3><p>Try another location or reset filters to see the whole candidate pool.</p><button className="button button-secondary" type="button" onClick={reset}>Show all candidates</button></div>}<div className="insight-mini-note">All dates are fictional. Review decisions saved in this browser: {reviewed}.</div></article>
   <article className="white-panel insight-panel insight-spotlight"><div className="insight-panel-head"><div><span className="small-eyebrow">LIVE COMPARISON</span><h2>One person, more than one possibility</h2></div><Compass size={19}/></div><label className="insight-select-label">Choose a candidate<select value={active?.id||''} disabled={!active} onChange={e=>setSpotlight(e.target.value)}>{data.people.length?data.people.map(c=><option key={c.id} value={c.id}>{c.alias}</option>):<option value="">No candidates in view</option>}</select></label>{active&&candidateRanks?<><p className="insight-subtitle">{active.alias} applied for <strong>{roles.find(r=>r.id===active.appliedRoleId)?.title}</strong>. Compare that role with the strongest match based on supplied examples.</p><div className="insight-spotlight-bars">{[candidateRanks.applied,candidateRanks.best].map((match,i)=><div key={i} className="insight-spotlight-role"><div><span>{i===0?'Originally applied for':'Most supporting information'}</span><strong>{roles.find(r=>r.id===match.roleId)?.title}</strong></div><div className="insight-spotlight-progress"><span style={{width:`${clamp(match.coverage*100)}%`,background:i===0?'#90aba6':'#137b6c'}}/></div><small>{Math.round(match.coverage*100)}% requirement evidence coverage</small></div>)}</div><Link className="button button-jade" href={`/demo/matches?candidate=${active.id}&role=${candidateRanks.best.roleId}`}>See the reasons <ArrowRight size={16}/></Link></>:<div className="insight-empty">Reset your filters to compare a candidate.</div>}</article>
  </section>
  <p className="page-footnote">Recruiter view · Eight fictional profiles · Three fictional open jobs. Insights use the existing matching engine. Supplied project excerpts have not been independently verified. The platform does not make hiring decisions.</p>
 </main>;
}

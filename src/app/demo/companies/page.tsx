'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {Building2,BriefcaseBusiness,ChartColumnIncreasing,Search,ArrowLeft,ArrowRight} from 'lucide-react';
import {useCompanyNetwork} from '@/lib/use-company-network';
import {companyDirectory,allNetworkJobs,connectedCompanyIds,partnerStatus} from '@/lib/company-network';
import './companies.css';
const PAGE_SIZE=12;
export default function CompaniesDirectory(){
 const {state}=useCompanyNetwork();
 const [query,setQuery]=useState(''),[sector,setSector]=useState('All industries'),[sort,setSort]=useState('open-desc');
 const [mode,setMode]=useState('All arrangements'),[connection,setConnection]=useState('All companies');
 const [chartMode,setChartMode]=useState<'industry'|'workmode'>('industry'),[page,setPage]=useState(1);
 const companies=useMemo(()=>companyDirectory(state),[state]);
 const jobs=useMemo(()=>allNetworkJobs(state),[state]);
 const connected=useMemo(()=>new Set(connectedCompanyIds(state,state.activeCompanyId)),[state]);
 const byCompany=useMemo(()=>{const result=new Map<string,typeof jobs>();for(const job of jobs){const group=result.get(job.companyId)||[];group.push(job);result.set(job.companyId,group)}return result},[jobs]);
 const sectors=useMemo(()=>[...new Set(companies.map(c=>c.sector))].sort(),[companies]);
 const rows=useMemo(()=>companies.map(c=>({...c,jobs:(byCompany.get(c.id)||[]).filter(j=>mode==='All arrangements'||j.mode===mode)}))
  .filter(c=>(sector==='All industries'||c.sector===sector)
    &&(connection==='All companies'||(connection==='Connected partners'?connected.has(c.id):!connected.has(c.id)))
    &&(mode==='All arrangements'||c.jobs.length>0)
    &&`${c.name} ${c.sector} ${c.location} ${c.jobs.map(j=>j.title).join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()))
  .sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='name-desc'?b.name.localeCompare(a.name):sort==='sector'?a.sector.localeCompare(b.sector)||a.name.localeCompare(b.name):sort==='location'?a.location.localeCompare(b.location):sort==='open-asc'?a.jobs.length-b.jobs.length:b.jobs.length-a.jobs.length),
 [companies,byCompany,sector,connection,connected,mode,query,sort]);
 const maxPages=Math.max(1,Math.ceil(rows.length/PAGE_SIZE));
 const visible=rows.slice((Math.min(page,maxPages)-1)*PAGE_SIZE,Math.min(page,maxPages)*PAGE_SIZE);
 const countGroups=useMemo(()=>{
  if(chartMode==='industry'){
   const companySectors=new Map(companies.map(c=>[c.id,c.sector]));
   const counts=new Map<string,number>();
   for(const j of jobs){const s=companySectors.get(j.companyId);if(s)counts.set(s,(counts.get(s)||0)+1)}
   return [...counts.entries()].map(([label,count])=>({label,count})).sort((a,b)=>b.count-a.count).slice(0,9);
  }
  const counts=new Map<string,number>();for(const j of jobs)counts.set(j.mode,(counts.get(j.mode)||0)+1);
  return ['Remote','Hybrid','On-site'].map(label=>({label,count:counts.get(label)||0}));
 },[chartMode,jobs,companies]);
 const max=Math.max(1,...countGroups.map(x=>x.count));
 function updateFilter(fn:()=>void){fn();setPage(1)}
 return <main className="workspace-page pm-companies"><header className="pm-head"><div><span className="small-eyebrow">HR · EMPLOYER NETWORK</span><h1>Registered Companies & Open Positions</h1><p>Explore fictional registered employers, discover vacancies across industries, and initiate consent-based referrals to partner companies.</p></div><Building2 size={34}/></header>
 <div className="pm-metrics"><div className="pm-metric"><strong>{companies.length}</strong><small>Companies in demo directory</small></div><div className="pm-metric"><strong>{jobs.length}</strong><small>Sample positions listed</small></div><div className="pm-metric"><strong>{sectors.length}</strong><small>Industries represented</small></div><div className="pm-metric"><strong>{connected.size}</strong><small>Connected partner companies</small></div></div>
 <section className="pm-card pm-stack" style={{marginTop:20}}><div className="pm-company-chart-head"><div><h2><ChartColumnIncreasing size={20} style={{display:'inline'}}/> Explore vacancies</h2><p className="pm-note">Compare openings by industry or work arrangement. Data comes from the local demonstration catalog.</p></div><label className="pm-field">Chart category<select value={chartMode} onChange={e=>setChartMode(e.target.value as 'industry'|'workmode')}><option value="industry">Vacancies by industry</option><option value="workmode">Vacancies by work arrangement</option></select></label></div><div className="pm-company-chart" role="group" aria-label="Vacancy distribution bar chart">{countGroups.map(x=><div className="pm-company-chart-row" key={x.label}><span title={x.label}>{x.label}</span><div className="pm-progress"><span style={{width:`${x.count/max*100}%`}}/></div><strong>{x.count}</strong></div>)}</div><p className="pm-note">These are fictional sample listings, not live or independently verified vacancies.</p></section>
 <section className="pm-card pm-stack" style={{marginTop:20}}><div className="pm-company-filters"><label className="pm-field"><Search size={15}/> Search companies or vacancies<input value={query} onChange={e=>updateFilter(()=>setQuery(e.target.value))} placeholder="e.g. Scriptwriter or Kuala Lumpur"/></label><label className="pm-field">Industry<select value={sector} onChange={e=>updateFilter(()=>setSector(e.target.value))}><option>All industries</option>{sectors.map(s=><option key={s}>{s}</option>)}</select></label><label className="pm-field">Sort companies<select value={sort} onChange={e=>updateFilter(()=>setSort(e.target.value))}><option value="open-desc">Most open positions</option><option value="open-asc">Fewest open positions</option><option value="name">Company A–Z</option><option value="name-desc">Company Z–A</option><option value="sector">Industry A–Z</option><option value="location">Location A–Z</option></select></label><label className="pm-field">Work arrangement<select value={mode} onChange={e=>updateFilter(()=>setMode(e.target.value))}><option>All arrangements</option><option>Remote</option><option>Hybrid</option><option>On-site</option></select></label><label className="pm-field">Partner status<select value={connection} onChange={e=>updateFilter(()=>setConnection(e.target.value))}><option>All companies</option><option>Connected partners</option><option>Not yet connected</option></select></label></div>
 <div className="pm-company-results-heading"><p className="pm-note">Showing {visible.length?Math.min((page-1)*PAGE_SIZE+1,rows.length):0}–{Math.min(page*PAGE_SIZE,rows.length)} of {rows.length} companies</p><span className="pm-tag">Page {Math.min(page,maxPages)} of {maxPages}</span></div>
 <div className="pm-company-cards">{visible.map(c=><article className="pm-company-card" key={c.id}><div className="pm-company-card-head"><span className="pm-company-avatar" style={{background:c.color}}>{c.initials}</span><div><h3>{c.name}</h3><small>{c.sector} · {c.location}</small></div><span className="pm-tag">{c.jobs.length} openings</span></div><p className="pm-note">{c.tagline}</p><p className="pm-note">Partner status: {c.id===state.activeCompanyId?'Your company':partnerStatus(state,state.activeCompanyId,c.id)}</p><div className="pm-company-joblist">{c.jobs.length?c.jobs.map(j=><div className="pm-row" key={j.id}><span><strong>{j.title}</strong><small>{j.level} · {j.mode} · {j.salary}</small></span><Link href={`/demo/candidate-compare?job=${encodeURIComponent(j.id)}`}>Compare <BriefcaseBusiness size={14} style={{display:'inline'}}/></Link></div>):<p className="pm-note">No positions listed under these filters.</p>}</div>{c.id!==state.activeCompanyId&&<Link className="pm-button secondary" href={`/demo/partners?company=${encodeURIComponent(c.id)}`}>Refer a candidate <ArrowRight size={16}/></Link>}</article>)}</div>
 {!rows.length&&<div className="pm-empty">No companies match your search and filters. Try another industry, location or work arrangement.</div>}
 {maxPages>1&&<nav className="pm-company-pagination" aria-label="Company directory pages"><button className="pm-button secondary" type="button" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}><ArrowLeft size={16}/> Previous</button><span>Page {page} / {maxPages}</span><button className="pm-button secondary" type="button" disabled={page>=maxPages} onClick={()=>setPage(p=>Math.min(maxPages,p+1))}>Next <ArrowRight size={16}/></button></nav>}
 </section></main>;
}

'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ClipboardCheck} from 'lucide-react';
import {readFocusedReviews,writeFocusedReview,type FocusedReview} from '@/lib/focused-reviews';
import {TALENT_CANDIDATES} from '@/lib/talent-ecosystem';
import {OPPORTUNITIES} from '@/lib/career-catalog';
export default function Reviews(){
 const [items,setItems]=useState<FocusedReview[]>([]);
 useEffect(()=>{const refresh=()=>setItems(readFocusedReviews());refresh();window.addEventListener('proofmatch-focused-review-updated',refresh);return()=>window.removeEventListener('proofmatch-focused-review-updated',refresh)},[]);
 function update(item:FocusedReview,status:FocusedReview['status']){writeFocusedReview({...item,status,date:new Date().toISOString().slice(0,10)})}
 return <main className="workspace-page pm-reviews-page"><header className="pm-head"><div><span className="small-eyebrow">HR · RECRUITMENT PIPELINE</span><h1>My Review List</h1><p>Track shortlisted candidates, interviews and decisions in one place.</p></div><span className="pm-tag"><ClipboardCheck size={15}/> {items.length||5} records</span></header><section className="pm-card pm-stack"><div className="pm-metrics"><div className="pm-metric"><strong>{items.filter(x=>x.status==='Shortlisted').length}</strong><small>Shortlisted</small></div><div className="pm-metric"><strong>{items.filter(x=>x.status==='Interview invited').length}</strong><small>Interview invited</small></div><div className="pm-metric"><strong>{items.filter(x=>x.status==='Under review').length}</strong><small>Under review</small></div></div>{items.map(item=>{const candidate=TALENT_CANDIDATES.find(c=>c.id===item.candidateId);const job=OPPORTUNITIES.find(j=>j.id===item.jobId)||OPPORTUNITIES.find(j=>j.id===candidate?.appliedJobId);return <article key={`${item.candidateId}:${item.jobId}`} className="pm-row" style={{alignItems:'flex-start',flexWrap:'wrap'}}><div style={{flex:'1 1 230px'}}><strong>{candidate?.name||'Candidate'}</strong><small>{job?.title||candidate?.title} · {item.date}</small><p className="pm-note">{item.note}</p><Link href={`/demo/candidate-compare?candidate=${item.candidateId}`} className="pm-highlight">View comparison</Link></div><div className="pm-stack"><label className="pm-field">Review status<select value={item.status} onChange={e=>update(item,e.target.value as FocusedReview['status'])}>{(['Shortlisted','Interview invited','Under review','Declined'] as const).map(s=><option key={s}>{s}</option>)}</select></label></div></article>})}</section></main>;
}

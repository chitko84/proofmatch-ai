'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, BarChart3, BriefcaseBusiness, ChevronRight, Compass, FileQuestion, FileSearch, GitCompareArrows, HeartHandshake, LayoutGrid, Menu, MessageCircle, Route, ScanSearch, ClipboardCheck, FlaskConical, ShieldCheck, Sparkles, UsersRound, QrCode, MessagesSquare, PlayCircle, X, TrendingUp, CalendarClock } from 'lucide-react';
import { Brand } from './brand';

const sections = [
  {title:'WORKSPACE', items:[{href:'/demo/guide',label:'Start demo walkthrough',icon:PlayCircle},{href:'/demo',label:'Overview',icon:LayoutGrid},{href:'/demo/insights',label:'Talent insights',icon:TrendingUp},{href:'/demo/candidates',label:'Candidates',icon:UsersRound},{href:'/demo/analyze',label:'Check a new CV',icon:FileSearch},{href:'/demo/roles',label:'Job roles',icon:BriefcaseBusiness},{href:'/demo/matches',label:'Compare job matches',icon:GitCompareArrows}]},
  {title:'DISCOVER', items:[{href:'/demo/discover',label:'Blindspot Rescue',icon:Compass},{href:'/demo/criteria',label:'See what changes',icon:BarChart3},{href:'/demo/expectations',label:'What works for both sides',icon:HeartHandshake},{href:'/demo/reviews',label:'My review list',icon:ShieldCheck},{href:'/demo/candidate-reply',label:'Add or correct details',icon:MessageCircle},{href:'/demo/fairshot',label:'Show what you can do',icon:ClipboardCheck}]},
  {title:'CONNECT WITH PEOPLE',items:[{href:'/demo/connect',label:'Invite to another job',icon:QrCode},{href:'/demo/meetings',label:'Schedule a LiveRoom',icon:CalendarClock},{href:'/demo/interview',label:'Prepare interview questions',icon:MessagesSquare}]},
  {title:'EXPLORE MORE', items:[{href:'/demo/mira',label:'Ask Mira',icon:Sparkles},{href:'/demo/futurepath',label:'FuturePath AI',icon:Route},{href:'/demo/proof-over-polish',label:'Proof Over Polish',icon:FlaskConical},{href:'/demo/about-data',label:'About this demo',icon:FileQuestion}]},
];

export function WorkspaceShell({children}: {children: React.ReactNode}) {
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  return <div className="workspace-shell">
    <aside className={`workspace-sidebar ${open?'sidebar-visible':''}`}>
      <div className="sidebar-top"><Brand/><button className="sidebar-close" onClick={()=>setOpen(false)} aria-label="Close menu"><X size={21}/></button></div>
      <div className="sidebar-demo-label"><span className="online-dot"/> SAMPLE WORKSPACE <span>2026</span></div>
      <nav className="workspace-nav" aria-label="Recruiter workspace">
        {sections.map(s=><div className="nav-section" key={s.title}><div className="nav-section-label">{s.title}</div>{s.items.map(item=>{const Icon=item.icon; const selected=pathname===item.href || (item.href==='/demo/candidates'&&pathname.startsWith('/demo/candidates/')) || (item.href==='/demo/roles'&&pathname.startsWith('/demo/roles/'));return <Link onClick={()=>setOpen(false)} href={item.href} key={item.href} className={`workspace-nav-link ${selected?'selected':''}`}><Icon size={18} strokeWidth={1.9}/><span>{item.label}</span>{item.href==='/demo/discover'&&<span className="nav-highlight">★</span>}</Link>})}</div>)}
      </nav>
      <div className="sidebar-foot"><div className="sidebar-support"><ShieldCheck size={19}/><div><strong>People decide. AI assists.</strong><span>No automatic hiring or rejection.</span></div></div><Link href="/" className="back-website"><ArrowLeft size={16}/> Back to website</Link></div>
    </aside>
    {open&&<button className="sidebar-overlay" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <div className="workspace-main"><header className="workspace-topbar"><button className="workspace-hamburger" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={23}/></button><span className="workspace-breadcrumb">Your workspace <ChevronRight size={14}/> <strong>{sections.flatMap(s=>s.items).find(i=>i.href===pathname)?.label||'Candidate details'}</strong></span><span className="workspace-status"><span className="online-dot"/> Fictional demo data</span></header><div className="workspace-content">{children}</div></div>
  </div>;
}

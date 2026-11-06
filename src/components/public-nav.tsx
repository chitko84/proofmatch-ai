'use client';
import { ArrowUpRight, Menu, X, UserRound, BriefcaseBusiness } from 'lucide-react';
import { useState } from 'react';
import { Brand } from './brand';
import Link from 'next/link';
import {LanguageSwitcher} from './language-provider';
export function PublicNav() {
  const [open,setOpen] = useState(false);
  return <header className="public-header">
    <div className="public-nav content-width">
      <Brand />
      <nav className={`public-links ${open?'public-links-open':''}`} aria-label="Main navigation">
        <a href="/#features" onClick={()=>setOpen(false)}>Features</a>
        <a href="/#how-it-works" onClick={()=>setOpen(false)}>How it works</a>
        <a href="/#about" onClick={()=>setOpen(false)}>About</a><Link href="/demo" className="mobile-workspace-nav-link" onClick={()=>setOpen(false)}>Open workspace</Link><Link href="/demo/opportunities" onClick={()=>setOpen(false)}>Find jobs</Link><Link href="/demo/comics" onClick={()=>setOpen(false)}>Comic Books</Link>
      </nav>
      <div className="public-role-links" aria-label="Workspace views">
        <Link href="/demo/candidate" className="public-role-link"><UserRound size={16}/><span>Candidate View</span></Link>
        <Link href="/demo" className="public-role-link"><BriefcaseBusiness size={16}/><span>HR View</span></Link>
      </div>
      <LanguageSwitcher compact/><Link href="/demo" className="button button-jade nav-demo">Open workspace <ArrowUpRight size={17}/></Link>
      <button type="button" className="mobile-menu" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'}>{open?<X size={24}/>:<Menu size={24}/>}</button>
    </div>
  </header>;
}

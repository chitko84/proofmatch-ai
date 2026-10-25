'use client';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Brand } from './brand';
import Link from 'next/link';
export function PublicNav() {
  const [open,setOpen] = useState(false);
  return <header className="public-header">
    <div className="public-nav content-width">
      <Brand />
      <nav className={`public-links ${open?'public-links-open':''}`} aria-label="Main navigation">
        <a href="/#features" onClick={()=>setOpen(false)}>Features</a>
        <a href="/#how-it-works" onClick={()=>setOpen(false)}>How it works</a>
        <a href="/#about" onClick={()=>setOpen(false)}>About</a><Link href="/demo/insights" onClick={()=>setOpen(false)}>Talent insights</Link>
      </nav>
      <Link href="/demo" className="button button-jade nav-demo">Try the demo <ArrowUpRight size={17}/></Link>
      <button type="button" className="mobile-menu" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'}>{open?<X size={24}/>:<Menu size={24}/>}</button>
    </div>
  </header>;
}

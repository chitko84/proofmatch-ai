'use client';

import type { ReactNode, MouseEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, X } from 'lucide-react';

/** A user-triggered, skippable cinematic transition. Never traps visitors on entry. */
export function DoorPortalLink({ children, className = '' }: { children: ReactNode; className?: string }) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const running = useRef(false);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function enter(event: MouseEvent<HTMLAnchorElement>) {
    // Respect modified clicks, browser context menus, keyboard links and reduced motion.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (running.current) return;
    running.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      router.push('/demo');
      return;
    }
    setOpening(true);
    timer.current = setTimeout(() => router.push('/demo'), 1060);
  }
  function skip() {
    if (timer.current) clearTimeout(timer.current);
    router.push('/demo');
  }

  return <>
    <Link href="/demo" className={className} onClick={enter}>{children}</Link>
    {opening && <div className="opportunity-portal" role="status" aria-label="Opening the ProofMatch recruiter workspace">
      <div className="opportunity-portal-left"><div className="door-detail"><span>THE POSSIBILITIES</span><i/></div></div>
      <div className="opportunity-portal-right"><div className="door-detail"><span>BEYOND A CV</span><i/></div></div>
      <div className="opportunity-portal-center" aria-hidden="true">
        <span className="portal-spark">✦</span>
        <strong>Open the door to overlooked talent.</strong>
        <ArrowRight size={24}/>
      </div>
      <button type="button" className="portal-skip" onClick={skip} aria-label="Skip entrance animation"><X size={15}/> Skip intro</button>
    </div>}
  </>;
}

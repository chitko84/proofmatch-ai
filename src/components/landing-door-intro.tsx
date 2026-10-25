'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, RotateCcw, ScanSearch, X } from 'lucide-react';

/**
 * Landing-page-first cinematic opening, separate from the demo navigation.
 * The landing page is already rendered behind the doors. We never rely on
 * loading assets or a remote video to let the visitor through.
 */
export function LandingDoorIntro() {
  const [playing, setPlaying] = useState(true);
  const [opening, setOpening] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [sequence, setSequence] = useState(0);
  const pendingTimers = useRef<number[]>([]);
  const skipButton = useRef<HTMLButtonElement>(null);

  const stopTimers = useCallback(() => {
    pendingTimers.current.forEach(window.clearTimeout);
    pendingTimers.current = [];
  }, []);

  const dismiss = useCallback(() => {
    stopTimers();
    setPlaying(false);
    setOpening(false);
    setHasPlayed(true);
  }, [stopTimers]);

  useEffect(() => {
    if (!playing) return;

    // People who request reduced motion should reach the content immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dismiss();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    skipButton.current?.focus({ preventScroll: true });
    pendingTimers.current = [
      window.setTimeout(() => setOpening(true), 820),
      window.setTimeout(() => dismiss(), 2700),
    ];
    return () => {
      stopTimers();
      document.body.style.overflow = previousOverflow;
    };
  }, [playing, sequence, dismiss, stopTimers]);

  function replay() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setOpening(false);
    setPlaying(true);
    setSequence(s => s + 1);
  }

  return <>
    {playing && <div
      className={`landing-door-intro${opening ? ' is-opening' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to ProofMatch AI"
      onKeyDown={event => {
        if (event.key === 'Escape') dismiss();
        // Keep keyboard focus on the visible skip action while the doors play.
        if (event.key === 'Tab') { event.preventDefault(); skipButton.current?.focus(); }
      }}
    >
      <div className="landing-door-light" aria-hidden="true" />
      <div className="landing-door-left" aria-hidden="true">
        <div className="landing-door-engraving"><span>THE RIGHT SKILLS</span></div>
        <span className="landing-door-handle" />
      </div>
      <div className="landing-door-right" aria-hidden="true">
        <div className="landing-door-engraving"><span>THE RIGHT OPPORTUNITY</span></div>
        <span className="landing-door-handle" />
      </div>
      <div className="landing-door-message">
        <div className="landing-door-logo"><ScanSearch size={24} strokeWidth={2.2} /> <span>proofmatch<b>.ai</b></span></div>
        <div className="landing-door-divider" />
        <p className="landing-door-kicker">A NEW WAY TO DISCOVER POTENTIAL</p>
        <h2>Every talent deserves<br/><em>an open door.</em></h2>
        <p className="landing-door-subtitle">See the skills. Discover the possibilities.</p>
        <div className="landing-door-glyph" aria-hidden="true"><ArrowUpRight size={19}/></div>
      </div>
      <button ref={skipButton} className="landing-door-skip" onClick={dismiss} type="button"><X size={15}/> Skip intro</button>
      <span className="landing-door-bottom" aria-hidden="true">PROOFMATCH AI <span>✦</span> THE FUTURE ISN'T A KEYWORD</span>
    </div>}
    {hasPlayed && !playing && <button type="button" className="landing-door-replay" onClick={replay} title="Watch the opening animation again">
      <RotateCcw size={15} /> Replay entrance
    </button>}
  </>;
}

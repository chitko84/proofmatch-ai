'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';

/** Graceful client error boundary. Never displays secrets or raw exception details. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="release-state-page" role="alert">
    <section className="release-state-card">
      <span className="release-state-icon"><AlertCircle size={32}/></span>
      <p className="small-eyebrow">SOMETHING NEEDS ANOTHER TRY</p>
      <h1>We couldn't open that view.</h1>
      <p>Your workspace is still available. Try again, or return to the recruiter workspace.</p>
      <div className="release-state-actions">
        <button type="button" onClick={reset} className="button button-jade"><RotateCcw size={17}/> Try again</button>
        <Link href="/demo" className="button button-secondary"><ArrowLeft size={17}/> Recruiter workspace</Link>
      </div>
    </section>
  </main>;
}

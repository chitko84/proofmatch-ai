import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return <main className="release-state-page">
    <section className="release-state-card">
      <span className="release-state-icon"><Compass size={32}/></span>
      <p className="small-eyebrow">PAGE NOT FOUND</p>
      <h1>That path isn't in the demo.</h1>
      <p>Explore the real recruiter workflow, with fictional candidate data and transparent evidence.</p>
      <div className="release-state-actions">
        <Link href="/demo" className="button button-jade">Open ProofMatch</Link>
        <Link href="/" className="button button-secondary"><ArrowLeft size={17}/> Website</Link>
      </div>
    </section>
  </main>;
}

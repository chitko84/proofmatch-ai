import Link from 'next/link';
import { ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { candidates,roles } from '@/lib/data';
import { rankRoles } from '@/lib/engine';
import { LiveDiscovery } from '@/components/live-discovery';
import { RescueReveal } from '@/components/rescue-reveal';
import { ProofWatch } from '@/components/proofwatch';
const discovered=candidates.map(c=>({candidate:c,top:rankRoles(c,roles)[0]})).filter(x=>x.top.alternativeToApplied);
export default function Discover(){return <div className="workspace-page">
  <div className="page-title-row"><div><span className="small-eyebrow">BLINDSPOT RESCUE · NEW INTERACTIVE EXPERIENCE</span><h1>Someone worth another look.</h1><p>Find people whose experience could suit another open job.</p></div><span className="data-count"><Sparkles size={17}/>{discovered.length} fictional alternatives</span></div>
  <section className="discovery-hero"><div><span className="mini-eyebrow">THERE'S MORE TO A PERSON THAN ONE JOB TITLE</span><h2>Find the possibility hiding in plain sight.</h2><p>Choose a candidate, reveal an alternative role and see the information behind the suggestion. Never assume a suggested role is a hiring decision.</p></div><div className="discovery-hero-art"><span className="art-people">01</span><Compass size={32}/><span className="art-role-name">Another role</span></div></section>
  <ProofWatch compact/>
  <LiveDiscovery/>
  <RescueReveal/>
  <div className="rescue-next"><div><span className="section-eyebrow">ONE MORE QUESTION</span><h2>What if a skill wasn't on the CV?</h2><p>Our FairShot demo can invite a short, job-related example when important evidence is missing.</p></div><Link href="/demo/fairshot" className="button button-jade">Try a work example <ArrowUpRight size={17}/></Link></div>
  <p className="page-footnote">Fictional profiles and a transparent rule-based match engine. Live Gemini extracts quotes from supplied text only. The experience does not establish qualifications, authorship or future job performance.</p>
</div>}

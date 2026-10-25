import Link from 'next/link';
import { ArrowRight, ArrowUpRight, CalendarClock, Check, Compass, Eye, FileSearch, MoveUpRight, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { PublicNav } from '@/components/public-nav';
import { Brand } from '@/components/brand';
import { LandingDoorIntro } from '@/components/landing-door-intro';
import { TalentOrbit } from '@/components/talent-orbit';


const photos = [
  {key:'team', url:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=82', label:'People collaborating around a laptop'},
  {key:'student',url:'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=700&q=82',label:'Students collaborating on a project'},
  {key:'workspace',url:'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=82',label:'Bright and welcoming workspace'},
  {key:'meeting',url:'https://images.unsplash.com/photo-1552664730-d307ca884978?w=650&q=82',label:'Team sharing ideas in a meeting'},
];

export default function Landing() {
  return <div className="landing">
    <LandingDoorIntro/>
    <PublicNav/>
    <main>
      <section className="landing-hero content-width">
        <div className="hero-copy">
          <div className="eyebrow-pill"><span className="eyebrow-spark"/> A better way to find the right fit</div>
          <h1>Great talent<br/>deserves to <span>be seen.</span></h1>
          <p>Someone can apply for one job while their projects point to another open position. ProofMatch helps recruiters find that opportunity, check the evidence, and ask what works for both sides.</p>
          <div className="hero-cta-row">
            <Link href="/demo/guide" className="button button-jade button-large">Start the live demo <ArrowUpRight size={20}/></Link>
            <a href="#how-it-works" className="button button-soft button-large">See how it works</a>
          </div>
          <Link href="/demo/meetings" className="subtle-link" style={{marginTop:20,display:"inline-flex"}}><CalendarClock size={16}/> Try the candidate meeting experience <ArrowRight size={15}/></Link>
          <div className="hero-hint"><span className="hero-hint-dots"><i/><i/><i/></span>Interactive sample · No account needed · Fictional candidates</div>
        </div>
        <TalentOrbit/>
      </section>

      <section className="feature-gallery-section content-width" id="features">
        <div className="section-intro"><div><div className="section-eyebrow">A DIFFERENT WAY TO MATCH</div><h2>More people. More possibilities.</h2></div><a className="text-link" href="#how-it-works">See how it works <ArrowRight size={18}/></a></div>
        <div className="feature-gallery">
          <Link href="/demo/discover" className="feature-gallery-card"><div className="feature-art feature-art-discover"><span className="feature-art-orbit"/><span className="art-avatar art-avatar-one">01</span><span className="art-avatar art-avatar-two">02</span><span className="art-job">QA Automation <span>↗</span></span></div><h3>Find someone overlooked</h3><p>Great skills can fit more than one job.</p><span>Blindspot Rescue <ArrowUpRight size={14}/></span></Link>
          <Link href="/demo/matches" className="feature-gallery-card"><div className="feature-art feature-art-evidence"><div className="art-document"><span className="doc-line lg"/><span className="doc-line med"/><span className="doc-highlight">Built automated Python tests</span><span className="doc-line short"/></div><span className="evidence-proof"><Check size={16}/> Source found</span></div><h3>See why a role fits</h3><p>Real reasons, right next to the result.</p><span>Evidence Ledger <ArrowUpRight size={14}/></span></Link>
          <Link href="/demo/futurepath" className="feature-gallery-card"><div className="feature-art feature-art-future"><span className="future-node first">Now</span><span className="future-join"/><span className="future-node next">Next step</span><span className="future-join"/><span className="future-node later">What’s next</span></div><h3>See where you could grow</h3><p>Explore possible paths, not promises.</p><span>FuturePath AI <ArrowUpRight size={14}/></span></Link>
        </div>
      </section>

      <section className="story-section content-width" id="how-it-works">
        <div className="story-art story-art-first"><div className="story-soft-blob"/><div className="story-screen"><div className="mock-window-top"><span/><span/><span/></div><div className="mock-window-content"><small>CANDIDATE 01</small><strong>A better match might be here.</strong><div className="mock-pill">Applied: Frontend Developer</div><div className="mock-arrow">↓</div><div className="mock-pill mock-pill-highlight"><Sparkles size={15}/> Explore: QA Automation</div></div></div><div className="art-side-pill"><Compass size={17}/> Another opportunity</div></div>
        <div className="story-copy"><span className="section-eyebrow">01 / DISCOVER</span><h2>Look beyond the job title.</h2><p>Someone might apply for one job, but their projects show strengths that suit another. We help you spot that possibility.</p><Link href="/demo/discover" className="button button-jade">See Blindspot Rescue <ArrowUpRight size={17}/></Link></div>
      </section>

      <section className="story-section story-reverse content-width">
        <div className="story-copy"><span className="section-eyebrow">02 / UNDERSTAND</span><h2>Every suggestion has a reason.</h2><p>Not just a mystery number. Open the original example, see what we found, and know what still needs checking.</p><Link href="/demo/matches" className="button button-jade">See the evidence <ArrowUpRight size={17}/></Link></div>
        <div className="story-art story-art-second"><div className="story-source-card"><div className="source-top"><FileSearch size={21}/><span>Why this role?</span><span className="source-dot"/></div><div className="source-item"><span><Check size={15}/></span><div><b>Automated testing</b><small>From supplied project notes</small></div></div><div className="source-quote">“Built a pytest regression suite for account workflows.”</div><div className="source-item source-item-unknown"><span>?</span><div><b>API testing</b><small>Not confirmed yet</small></div></div></div><div className="source-overlay"><Eye size={16}/> See the source</div></div>
      </section>

      <section className="story-section fairshot-landing-story content-width"><div className="fairshot-landing-art" aria-hidden="true"><span className="fairshot-landing-tag">AN OPPORTUNITY TO SHOW MORE</span><div className="fairshot-landing-paper"><small>WORK SAMPLE · QA AUTOMATION</small><strong>An API creates duplicate orders.</strong><span>What would you test first?</span><i>Candidate can add a practical example →</i></div><div className="fairshot-landing-badge"><ShieldCheck size={19}/> Human review, not an AI grade</div></div><div className="story-copy"><span className="section-eyebrow">03 / A FAIR SHOT</span><h2>A missing keyword shouldn't close the door.</h2><p>Invite a short work example when a CV doesn't contain enough information. Treat the answer as new, unverified evidence—not an automatic pass or rejection.</p><Link href="/demo/fairshot" className="button button-jade">Explore FairShot <ArrowUpRight size={17}/></Link></div></section>

      <section className="steps-section" id="about"><div className="content-width"><div className="section-eyebrow center">MADE TO BE SIMPLE</div><h2>Three easy steps. Better conversations.</h2><div className="steps-grid"><div className="step-card"><span className="step-number">01</span><div className="step-icon"><Search size={26}/></div><h3>Choose your people</h3><p>Start with a small pool of sample candidates and job roles.</p></div><div className="step-card"><span className="step-number">02</span><div className="step-icon"><Sparkles size={26}/></div><h3>Explore the matches</h3><p>See which roles have supporting information worth reviewing.</p></div><div className="step-card"><span className="step-number">03</span><div className="step-icon"><ShieldCheck size={26}/></div><h3>Review and decide</h3><p>Check what is known, ask questions, and make your own decision.</p></div></div><p className="responsible-note"><ShieldCheck size={17}/> The demo uses fictional candidate information. ProofMatch does not make hiring decisions.</p></div></section>

      <section className="landing-bottom-cta"><div className="cta-mosaic" aria-hidden="true">{[...photos,...photos].map((p,i)=><div key={i} style={{backgroundImage:`url('${p.url}')`}}/>)}</div><div className="cta-shade"/><div className="cta-content content-width"><span className="cta-kicker">READY TO EXPLORE?</span><h2>Give great talent<br/>a closer look.</h2><p>Find overlooked matches. See the reasons. Keep the final decision yours.</p><Link href="/demo/guide" className="button button-jade button-large">Explore the guided demo <MoveUpRight size={19}/></Link></div></section>
    </main>
    <footer className="public-footer"><div className="content-width public-footer-inner"><div><Brand inverse/><p>Better matching starts with a closer look.</p></div><div className="footer-links"><a href="/#features">Features</a><a href="/#how-it-works">How it works</a><Link href="/demo/about-data">About demo data</Link></div><small>© 2026 ProofMatch AI · AIFM Challenge 02</small></div></footer>
  </div>;
}

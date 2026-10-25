'use client';
import Link from 'next/link';
import {useState} from 'react';
import {ArrowUpRight, CheckCircle2, Compass, Fingerprint, MousePointer2, Sparkles} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {assessMatch} from '@/lib/engine';

/** A self-contained 3D-style interactive illustration; no external models or images. */
export function TalentOrbit(){
 const [selected,setSelected]=useState('qa');
 const [tilt,setTilt]=useState({x:0,y:0});
 const person=candidates[0];
 const role=roles.find(r=>r.id===selected)!;
 const report=assessMatch(person,role);
 const supported=report.assessments.filter(a=>a.support==='artifact');
 const preferred=supported[0]?.evidence?.excerpt || 'Choose another role to explore the supplied project examples.';
 return <section className="talent-visual" aria-label="Interactive example of matching Candidate 01 to three open jobs">
   <div className="talent-visual-top"><span><span className="talent-live-dot"/> INTERACTIVE TALENT EXPLORER</span><span>FICTIONAL DEMO · C01</span></div>
   <div className="talent-scene" onMouseMove={e=>{const rect=e.currentTarget.getBoundingClientRect();setTilt({x:((e.clientX-rect.left)/rect.width-.5)*8,y:((e.clientY-rect.top)/rect.height-.5)*-7})}} onMouseLeave={()=>setTilt({x:0,y:0})}>
    <div className="talent-3d" style={{transform:`rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`}} aria-hidden="true">
      <span className="talent-ring talent-ring-a"/><span className="talent-ring talent-ring-b"/><span className="talent-ring talent-ring-c"/>
      <span className="talent-spark talent-spark-one">✦</span><span className="talent-spark talent-spark-two">✧</span>
      <div className="talent-glass-card"><div className="talent-avatar"><Fingerprint size={38}/></div><span>CANDIDATE 01</span><strong>More than one possibility.</strong><small>Applied for Frontend Developer</small><i>PROJECT EVIDENCE</i></div>
      <div className="talent-3d-badge"><Sparkles size={15}/> Explore another open role</div>
    </div>
   </div>
   <div className="talent-explore-controls" aria-label="Choose a job role to compare">
    {roles.map(r=><button key={r.id} type="button" onClick={()=>setSelected(r.id)} className={`talent-role-choice ${selected===r.id?'active':''}`} aria-pressed={selected===r.id}><span>{r.title}</span><small>{Math.round(assessMatch(person,r).coverage*100)}% evidence coverage</small></button>)}
   </div>
   <div className="talent-evidence-panel" aria-live="polite"><div><span className="talent-panel-label"><CheckCircle2 size={14}/> WHAT WE FOUND · {role.title}</span><p>{supported.length?`“${preferred}”`:'No project excerpt supporting this role yet. The recruiter can ask for more details.'}</p><small>{supported.length} of {role.requirements.length} job requirements have supplied project examples. Not independently verified.</small></div><Link href={`/demo/matches?candidate=C01&role=${role.id}`} aria-label={`Review Candidate 01 for ${role.title}`}><ArrowUpRight size={21}/></Link></div>
   <div className="talent-visual-foot"><span><MousePointer2 size={14}/> Choose a role above</span><Link href="/demo/discover">Try Blindspot Rescue <Compass size={14}/></Link></div>
 </section>
}

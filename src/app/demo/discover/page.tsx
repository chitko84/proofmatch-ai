'use client';
import {useDeferredValue,useMemo,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowRight,ArrowUpRight,ChevronLeft,ChevronRight,Compass,MapPin,Search,SlidersHorizontal,Sparkles,UsersRound} from 'lucide-react';
import {TALENT_CANDIDATES,assessTalentForJob,type TalentCandidate} from '@/lib/talent-ecosystem';
import {CAREER_SECTORS,OPPORTUNITIES,type Opportunity} from '@/lib/career-catalog';
import {ProofWatch} from '@/components/proofwatch';
import './rescue-polish.css';

const PAGE_SIZE=12;
const jobsById=new Map(OPPORTUNITIES.map(job=>[job.id,job]));
const jobsByTitle=new Map<string,Opportunity>();
for(const job of OPPORTUNITIES)if(!jobsByTitle.has(job.title))jobsByTitle.set(job.title,job);
const searchIndex=TALENT_CANDIDATES.map(candidate=>[candidate.name,candidate.title,candidate.sector,candidate.location,...candidate.skills].join(' ').toLocaleLowerCase());
function candidateInsight(person:TalentCandidate){
 const applied=jobsById.get(person.appliedJobId);
 // Prefer a different role whose evidence coverage is stronger than the original application.
 // This is O(1) per candidate and doesn't rank all 800 vacancies during typing.
 const alternate=jobsByTitle.get(person.title);
 const initial=applied?assessTalentForJob(person,applied):null;
 const alternative=alternate?assessTalentForJob(person,alternate):null;
 const isBetter=!!(alternate&&alternative&&initial&&alternate.title!==applied?.title&&alternative.score>initial.score);
 return {applied,alternative:isBetter?alternate:null,score:isBetter?alternative?.score:initial?.score||0};
}
export default function CandidateDirectory(){
 const router=useRouter();
 const [query,setQuery]=useState('');
 const [sector,setSector]=useState('All industries');
 const [page,setPage]=useState(0);
 const deferredQuery=useDeferredValue(query.trim().toLocaleLowerCase());
 const filtered=useMemo(()=>TALENT_CANDIDATES.filter((candidate,index)=>(sector==='All industries'||candidate.sector===sector)&&searchIndex[index].includes(deferredQuery)),[deferredQuery,sector]);
 const pageCount=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));
 const currentPage=Math.min(page,pageCount-1);
 const visible=useMemo(()=>filtered.slice(currentPage*PAGE_SIZE,(currentPage+1)*PAGE_SIZE),[filtered,currentPage]);
 const insights=useMemo(()=>visible.map(person=>({person,...candidateInsight(person)})),[visible]);
 function showSector(value:string){setSector(value);setPage(0)}
 function quickSearch(value:string){setQuery(value);setSector('All industries');setPage(0)}
 return <main className="workspace-page pm-rescue-page">
  <div className="page-title-row"><div><span className="small-eyebrow">BLINDSPOT RESCUE · CANDIDATE DIRECTORY</span><h1>Someone worth <span>another look.</span></h1><p>Explore people across industries. Select any candidate to compare the job they applied for with other suitable opportunities.</p></div><span className="data-count"><UsersRound size={17}/>{filtered.length.toLocaleString()} candidates</span></div>
  <section className="discovery-hero"><div><span className="mini-eyebrow">THERE'S MORE TO A PERSON THAN ONE JOB TITLE</span><h2>Find the possibility hiding in plain sight.</h2><p>Discover transferable skills, compare roles, and make evidence-based recruitment decisions.</p><Link href="/demo/studio" className="button button-white">Upload another CV <ArrowRight size={17}/></Link></div><div className="discovery-hero-art"><span className="art-people">01</span><Compass size={32}/><span className="art-role-name">A better fit</span></div></section>
  <ProofWatch compact mode="directory"/>
  <section className="pm-directory-panel" aria-label="Candidate directory"><div className="pm-directory-head"><div><span className="small-eyebrow">BROWSE CANDIDATES</span><h2>Explore the talent pool</h2><p>Search by name, skill, profession or location. Select a profile to see its detailed job comparison.</p></div><span className="pm-directory-count"><UsersRound size={17}/> {filtered.length.toLocaleString()} profiles</span></div>
   <div className="pm-directory-filters"><label><span><Search size={15}/> Search candidates</span><input type="search" value={query} onChange={event=>{setQuery(event.target.value);setPage(0)}} placeholder="Search names, skills or professions"/></label><label><span><SlidersHorizontal size={15}/> Industry</span><select value={sector} onChange={event=>showSector(event.target.value)}><option>All industries</option>{CAREER_SECTORS.map(name=><option key={name}>{name}</option>)}</select></label></div>
   <div className="pm-directory-chips"><button type="button" onClick={()=>quickSearch('')}>All candidates</button><button type="button" onClick={()=>quickSearch('Business Analyst')}>Business analysts</button><button type="button" onClick={()=>quickSearch('Film Director')}>Film directors</button><button type="button" onClick={()=>quickSearch('Scriptwriter')}>Scriptwriters</button></div>
   <div className="pm-directory-grid">{insights.map(({person,applied,alternative,score},index)=><Link href={`/demo/candidate-compare?candidate=${person.id}`} prefetch={index<2} onPointerEnter={()=>router.prefetch(`/demo/candidate-compare?candidate=${person.id}`)} onFocus={()=>router.prefetch(`/demo/candidate-compare?candidate=${person.id}`)} className="pm-directory-person" key={person.id}><div className="pm-person-top"><span className={`pm-person-avatar tone-${index%5}`} aria-hidden="true">{person.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><span className="pm-person-sector">{person.sector}</span><ArrowUpRight size={18}/></div><h3>{person.name}</h3><p className="pm-person-role">{person.title}</p><span className="pm-person-location"><MapPin size={13}/>{person.location} · {person.experienceYears} years experience</span><div className="pm-person-divider"/><div className="pm-person-roles"><span>Applied for</span><strong>{applied?.title||'Open position'}</strong>{alternative&&<><span>Alternative worth reviewing</span><strong className="pm-person-alt">{alternative.title}</strong><div className="pm-person-score"><span style={{width:`${score}%`}}/></div><small>{score}% role evidence coverage</small></>}</div><div className="pm-person-skills">{person.skills.slice(0,3).map(skill=><span key={skill}>{skill}</span>)}</div><span className="pm-person-cta">Compare job matches <ArrowRight size={16}/></span></Link>)}</div>
   {!insights.length&&<div className="pm-empty">No candidates match your search. Try another profession or industry.</div>}
   <div className="pm-directory-pagination"><span>Showing {filtered.length?currentPage*PAGE_SIZE+1:0}–{Math.min((currentPage+1)*PAGE_SIZE,filtered.length)} of {filtered.length.toLocaleString()}</span><div><button type="button" disabled={currentPage===0} onClick={()=>setPage(value=>Math.max(0,value-1))}><ChevronLeft size={16}/> Previous</button><span>Page {currentPage+1} / {pageCount}</span><button type="button" disabled={currentPage>=pageCount-1} onClick={()=>setPage(value=>Math.min(pageCount-1,value+1))}>Next <ChevronRight size={16}/></button></div></div>
  </section>
 </main>;
}

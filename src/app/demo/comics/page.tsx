'use client';
import {useEffect,useState} from 'react';
import {BookOpen,ExternalLink,Languages,ArrowRight,BookMarked,Clock3,LoaderCircle,CheckCircle2} from 'lucide-react';

const books=[
 {id:1,title:'The Match',subtitle:'Look beyond the job title'},
 {id:2,title:'The Next Step',subtitle:'Discover a new direction'},
 {id:3,title:'New Horizons',subtitle:'Explore possibilities'},
 {id:4,title:'Beyond the CV',subtitle:'Every skill has a story'},
 {id:5,title:'The Interview',subtitle:'Find your confidence'},
 {id:6,title:'Future Ready',subtitle:'Build what comes next'}
];
const editions=[
 {name:'English',url:'https://heyzine.com/flip-book/825f855bdd.html'},
 {name:'Bahasa Melayu',url:'https://heyzine.com/flip-book/37c9eaee51.html'},
 {name:'Mandarin',url:'https://heyzine.com/flip-book/ab5b7f1476.html'},
 {name:'Tamil',url:'https://heyzine.com/flip-book/dec1dffbef.html'},
 {name:'Burmese (Myanmar)',url:'https://heyzine.com/flip-book/76a7eefcea.html'}
];

export default function ComicBooks(){
 const [selected,setSelected]=useState(0);
 const [reader,setReader]=useState(false);
 const [loaded,setLoaded]=useState(false);
 const edition=editions[selected];
 // The six book covers are lightweight local SVGs. Only connect to Heyzine
 // when this page is opened; load the heavy third-party reader on demand.
 useEffect(()=>{
  if(document.querySelector('link[data-pm-comic-preconnect]'))return;
  const link=document.createElement('link');link.rel='preconnect';link.href='https://heyzine.com';link.crossOrigin='anonymous';link.dataset.pmComicPreconnect='true';document.head.appendChild(link);
 },[]);
 function readBook(){setLoaded(false);setReader(true);requestAnimationFrame(()=>document.getElementById('book-reader')?.scrollIntoView({behavior:'auto',block:'start'}))}
 function chooseLanguage(value:number){setSelected(value);setLoaded(false)}
 return <main className="workspace-page pm-comics-page">
  <header className="pm-head pm-comics-hero"><div><span className="small-eyebrow">CAREER EXPERIENCES · ILLUSTRATED STORIES</span><h1>Stories that open doors.</h1><p>Explore the ProofMatch AI comic collection. Read Book 1 in the language that feels like home.</p><div className="pm-comics-hero-meta"><span><BookOpen size={15}/> 6 illustrated books</span><span><Languages size={15}/> 5 reading languages</span></div></div><BookMarked size={36}/></header>
  <div className="pm-section-intro"><div><span className="small-eyebrow">THE COLLECTION</span><h2>Choose your next story</h2><p>Start with The Match. More adventures are on their way.</p></div><span className="pm-collection-count">01 available / 06 total</span></div>
  <section className="pm-covers" aria-label="Comic book collection">{books.map(book=><article className={`pm-cover ${book.id===1?'pm-cover-featured':'pm-cover-soon'}`} key={book.id}>
   <div className="pm-cover-image"><img src={`/comics/book-${book.id}.svg`} width="600" height="800" loading={book.id===1?'eager':'lazy'} decoding="async" alt={`Book ${book.id}: ${book.title} illustrated cover`}/>{book.id===1?<span className="pm-cover-ribbon"><CheckCircle2 size={13}/> Available now</span>:<span className="pm-cover-ribbon soon"><Clock3 size={13}/> Coming Soon</span>}</div>
   <div className="pm-cover-body"><span className="pm-cover-index">BOOK {String(book.id).padStart(2,'0')}</span><h3>{book.title}</h3><p>{book.subtitle}</p>{book.id===1?<button className="pm-button" type="button" onClick={readBook}><BookOpen size={16}/> Read Book 1 <ArrowRight size={15}/></button>:<span className="pm-cover-upcoming">Coming Soon · New story on the way</span>}</div>
  </article>)}</section>
  <section className="pm-reader-section" id="book-reader" aria-label="Book 1 reader">
   <div className="pm-reader-top"><div><span className="small-eyebrow">BOOK 01 · AVAILABLE NOW</span><h2>Read The Match</h2><p>Five languages. One story about discovering the right opportunity.</p></div><Languages size={28}/></div>
   <div className="pm-reader-controls"><label className="pm-field">Choose your language<select value={selected} onChange={e=>chooseLanguage(Number(e.target.value))}>{editions.map((e,i)=><option key={e.name} value={i}>{e.name}</option>)}</select></label><div className="pm-button-row"><button className="pm-button" type="button" onClick={readBook}><BookOpen size={17}/> {reader?'Reload':'Read'} in {edition.name}</button><a className="pm-button secondary" href={edition.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={16}/> Open full-screen</a></div></div>
   {reader?<div className="pm-reader-frame">{!loaded&&<div className="pm-reader-loading" role="status"><LoaderCircle className="pm-loading-icon" size={28}/><strong>Opening your book…</strong><span>The illustrated pages are loading from Heyzine.</span><a href={edition.url} target="_blank" rel="noopener noreferrer">Open directly if this takes too long <ExternalLink size={14}/></a></div>}<iframe key={edition.url} title={`ProofMatch AI Book 1 in ${edition.name}`} className={`pm-reader ${loaded?'is-loaded':''}`} src={edition.url} allowFullScreen loading="eager" referrerPolicy="strict-origin-when-cross-origin" onLoad={()=>setLoaded(true)}/></div>:<div className="pm-reader-ready"><BookOpen size={38}/><h3>Ready when you are.</h3><p>Select a language and click Read to open the flipbook here. The reader stays unloaded until you choose to open it.</p><button className="pm-button" type="button" onClick={readBook}>Start reading <ArrowRight size={17}/></button></div>}
   <p className="pm-note">The full-screen link opens the book directly on Heyzine. Embedded loading speed also depends on Heyzine and your connection.</p>
  </section>
 </main>;
}

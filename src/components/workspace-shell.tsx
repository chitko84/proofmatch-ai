'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {Gamepad2,ArrowLeft,BarChart3,BriefcaseBusiness,ChevronRight,Compass,FileQuestion,FileSearch,GitCompareArrows,HeartHandshake,LayoutGrid,Menu,MessageCircle,Route,ClipboardCheck,BookOpenText,Newspaper,FileHeart,FlaskConical,ShieldCheck,Sparkles,UsersRound,QrCode,MessagesSquare,PlayCircle,X,TrendingUp,CalendarClock,Headphones,Trophy,GraduationCap,Building2,MessageSquareText,Rss,ChartNoAxesCombined,UserRound,FilePenLine,BookOpenCheck} from 'lucide-react';
import {Brand} from './brand';
import {LanguageSwitcher} from './language-provider';

type View='candidate'|'hr';
const VIEW_KEY='proofmatch-workspace-view-v1';
// Only the most useful actions appear in each role's primary navigation.
// Less frequent tools stay available behind an explicit, collapsed "More tools" drawer.
const candidateSections=[
 {title:'MY CAREER',items:[
  {href:'/demo/candidate',label:'My Dashboard',icon:LayoutGrid},
  {href:'/demo/opportunities',label:'Find Jobs',icon:Compass},
  {href:'/demo/my-resume',label:'My Resume & Matches',icon:FileSearch},
  {href:'/demo/expectations',label:'What Works for Both Sides',icon:HeartHandshake},
  {href:'/demo/applications',label:'My Applications',icon:ClipboardCheck},
  {href:'/demo/my-referrals',label:'My Referrals',icon:HeartHandshake},
  {href:'/demo/meetings',label:'Meetings & Invitations',icon:CalendarClock}
 ]},
 {title:'CAREER EXPERIENCES',items:[
  {href:'/demo/career/accelerator',label:'Career Accelerator',icon:Trophy},
  {href:'/demo/career/interview',label:'AI Mock Interview',icon:Headphones},
  {href:'/demo/career/company',label:'Inside the Company 3D',icon:Building2},
  {href:'/demo/comics',label:'Comic Books',icon:BookOpenText}
 ]}
];
const candidateExtras=[
 {href:'/demo/job-hunt',label:'Job Hunt Copilot',icon:Compass},
 {href:'/demo/resume-clinic',label:'Resume Clinic',icon:FileHeart},
 {href:'/demo/resume-tailor',label:'Resume Tailor',icon:FilePenLine},
 {href:'/demo/cover-letter',label:'Cover Letter Generator',icon:BookOpenCheck},
 {href:'/demo/news',label:'Career News',icon:Newspaper},
 {href:'/demo/network/articles',label:'Career Stories',icon:BookOpenText},
 {href:'/demo/network/community',label:'ShareSpace',icon:Rss},
 {href:'/demo/network/messages',label:'Messages',icon:MessageSquareText},
 {href:'/demo/mira',label:'Ask Mira',icon:Sparkles}
];
const hrSections=[
 {title:'HIRING WORKSPACE',items:[
  {href:'/demo',label:'Overview',icon:LayoutGrid},
  {href:'/demo/studio',label:'Resume Insights',icon:FileSearch},
  {href:'/demo/discover',label:'Candidate Directory',icon:UsersRound},
  {href:'/demo/futurepath',label:'Future Path AI',icon:Route},
  {href:'/demo/interview',label:'Interview Questions',icon:MessagesSquare},
  {href:'/demo/partners',label:'Company Referrals',icon:HeartHandshake},
  {href:'/demo/companies',label:'Registered Companies & Jobs',icon:BarChart3},
  {href:'/demo/criteria',label:'See What Changes',icon:BarChart3},
  {href:'/demo/reviews',label:'My Review List',icon:ClipboardCheck}
 ]}
];
const hrExtras=[
 {href:'/demo/matches',label:'Job Comparison',icon:GitCompareArrows},
 {href:'/demo/candidate-compare',label:'Cross-industry Job Comparison',icon:GitCompareArrows},
 {href:'/demo/telegram',label:'Telegram & Invitations',icon:QrCode},
 {href:'/demo/network/messages',label:'Messages',icon:MessageSquareText}
];
const allItems=[...candidateSections,...hrSections].flatMap(section=>section.items).concat(candidateExtras,hrExtras);
const candidateOnly=['/demo/expectations','/demo/candidate','/demo/my-resume','/demo/applications','/demo/my-referrals','/demo/meetings','/demo/comics','/demo/career/company','/demo/career/accelerator','/demo/career/interview','/demo/job-hunt','/demo/resume-clinic','/demo/resume-tailor','/demo/cover-letter','/demo/opportunities'];
const recruiterOnly=['/demo/studio','/demo/discover','/demo/futurepath','/demo/interview','/demo/partners','/demo/companies','/demo/criteria','/demo/reviews','/demo/matches','/demo/candidate-compare','/demo/telegram'];
export function WorkspaceShell({children}:{children:React.ReactNode}){
  const pathname=usePathname();
  const router=useRouter();
  const [open,setOpen]=useState(false);
  const [navPending,setNavPending]=useState(false);
  const navDelay=useRef<number|undefined>(undefined);
  const warmedRoutes=useRef(new Map<string,number>());
  const warmGate=useRef(0);
  const navigationInFlight=useRef(false);
  // Deduplicate warmups so passing over a long sidebar does not flood Next.js
  // with redundant RSC requests and compete with an actual navigation click.
  function warmRoute(href:string,urgent=false){
    if(typeof document==='undefined'||document.hidden||!href.startsWith('/demo'))return;
    const connection=(navigator as Navigator&{connection?:{saveData?:boolean;effectiveType?:string}}).connection;
    if(connection?.saveData||connection?.effectiveType==='2g'||connection?.effectiveType==='slow-2g')return;
    const now=performance.now();
    // Hovering across the whole sidebar must not launch dozens of competing requests.
    if(!urgent&&(navigationInFlight.current||now-warmGate.current<180))return;
    warmGate.current=now;
    if(now-(warmedRoutes.current.get(href)??-100000)<45000)return;
    warmedRoutes.current.set(href,now);
    // Bound the dedup registry over hours-long demonstrations.
    if(warmedRoutes.current.size>65)warmedRoutes.current.clear();
    router.prefetch(href);
  }
  const [view,setView]=useState<View>(()=>candidateOnly.some(route=>pathname===route||pathname.startsWith(route+'/'))?'candidate':'hr');
  const [showMore,setShowMore]=useState(false);
  useEffect(()=>{
    try{
      const stored=localStorage.getItem(VIEW_KEY);
      if(stored==='candidate'||stored==='hr')setView(stored);
      else if(candidateOnly.some(route=>pathname===route||pathname.startsWith(route+'/')))setView('candidate');
    }catch{if(candidateOnly.some(route=>pathname===route||pathname.startsWith(route+'/')))setView('candidate')}
  },[]);
  useEffect(()=>{
    function onViewChange(){try{const saved=localStorage.getItem(VIEW_KEY);if(saved==='candidate'||saved==='hr')setView(saved)}catch{}}
    window.addEventListener('proofmatch-view-change',onViewChange);
    return()=>window.removeEventListener('proofmatch-view-change',onViewChange);
  },[]);
  // Opening a role's landing page explicitly updates the active perspective.
  useEffect(()=>{
    if(pathname==='/demo/candidate'){
      setView('candidate');try{localStorage.setItem(VIEW_KEY,'candidate')}catch{}
    }else if(pathname==='/demo'||recruiterOnly.some(route=>pathname===route||pathname.startsWith(route+'/'))){
      setView('hr');try{localStorage.setItem(VIEW_KEY,'hr')}catch{}
    }else if(candidateOnly.some(route=>pathname===route||pathname.startsWith(route+'/'))){
      setView('candidate');try{localStorage.setItem(VIEW_KEY,'candidate')}catch{}
    }
  },[pathname]);
  // Warm the judge's two most likely next pages shortly after first paint, in a bounded queue.
  // Hover/focus is urgent and bypasses the background throttle. Avoid prefetching
  // every link simultaneously: that would compete with the page being opened.
  useEffect(()=>{
    const likely=view==='candidate'
      ? ['/demo/candidate','/demo/opportunities','/demo/my-resume','/demo/comics','/demo/career/accelerator']
      : ['/demo','/demo/studio','/demo/discover','/demo/candidate-compare','/demo/reviews','/demo/interview'];
    const timers:number[]=[];
    likely.filter(target=>target!==pathname).slice(0,2).forEach((target,index)=>{
      timers.push(window.setTimeout(()=>{
        if(!document.hidden&&!navigationInFlight.current&&document.visibilityState==='visible')warmRoute(target);
      },240+index*650));
    });
    return()=>timers.forEach(timer=>window.clearTimeout(timer));
  },[view,pathname,router]);
  // Show instant but non-blocking route feedback only when a click takes perceptibly long.
  useEffect(()=>{navigationInFlight.current=false;setNavPending(false);if(navDelay.current!==undefined)window.clearTimeout(navDelay.current)},[pathname]);
  useEffect(()=>()=>{if(navDelay.current!==undefined)window.clearTimeout(navDelay.current)},[]);
  function indicateNavigation(href:string){
    if(href===pathname)return;
    navigationInFlight.current=true;
    if(navDelay.current!==undefined)window.clearTimeout(navDelay.current);
    navDelay.current=window.setTimeout(()=>setNavPending(true),90);
  }
  const sections=view==='candidate'?candidateSections:hrSections;
  const extras=view==='candidate'?candidateExtras:hrExtras;
  // Reveal an advanced destination when it is opened directly (bookmark or deep link).
  useEffect(()=>{if(extras.some(item=>item.href===pathname))setShowMore(true)},[pathname,view]);
  function switchView(next:View){
    setView(next);setOpen(false);setShowMore(false);
    try{localStorage.setItem(VIEW_KEY,next)}catch{}
    indicateNavigation(next==='candidate'?'/demo/candidate':'/demo');
    router.push(next==='candidate'?'/demo/candidate':'/demo');
  }
  const current=sections.flatMap(section=>section.items).find(item=>item.href===pathname)?.label || extras.find(item=>item.href===pathname)?.label || allItems.find(item=>item.href===pathname)?.label ||'Workspace';
  return <div className="workspace-shell">
    <aside className={`workspace-sidebar ${open?'sidebar-visible':''}`}>
      <div className="sidebar-top"><Brand/><button type="button" className="sidebar-close" onClick={()=>setOpen(false)} aria-label="Close menu"><X size={21}/></button></div>
      <div className="sidebar-demo-label"><span className="online-dot"/>{view==='candidate'?'CANDIDATE WORKSPACE':'HIRING WORKSPACE'}</div>
      <nav className="workspace-nav" aria-label={view==='candidate'?'Candidate navigation':'Recruiter navigation'}>
        {sections.map(section=><div className="nav-section" key={section.title}>
          <div className="nav-section-label">{section.title}</div>
          {section.items.map(item=>{
            const Icon=item.icon;
            const selected=pathname===item.href||(item.href==='/demo/roles'&&pathname.startsWith('/demo/roles/'));
            return <Link prefetch={item.href==='/demo/comics'} onMouseEnter={()=>warmRoute(item.href)} onPointerEnter={()=>warmRoute(item.href,true)} onPointerDown={()=>warmRoute(item.href,true)} onFocus={()=>warmRoute(item.href,true)} onTouchStart={()=>warmRoute(item.href,true)} onClick={()=>{indicateNavigation(item.href);setOpen(false)}} href={item.href} key={`${section.title}:${item.href}`} className={`workspace-nav-link ${selected?'selected':''}`} aria-current={selected?'page':undefined}>
              <Icon size={18} strokeWidth={1.9}/><span>{item.label}</span>
              
            </Link>;
          })}
        </div>)}
        <div className="nav-section nav-more-section">
          <button type="button" className="nav-more-toggle" aria-expanded={showMore} aria-controls="workspace-extra-tools" onClick={()=>setShowMore(value=>!value)}>
            <LayoutGrid size={17}/><span>More tools</span><ChevronRight size={16} className={showMore?'nav-more-chevron expanded':'nav-more-chevron'}/>
          </button>
          {showMore&&<div id="workspace-extra-tools" className="nav-extra-items">{extras.map(item=>{
            const Icon=item.icon;const selected=pathname===item.href;
            return <Link prefetch={false} key={`more:${item.href}`} href={item.href} className={`workspace-nav-link ${selected?'selected':''}`} aria-current={selected?'page':undefined} onMouseEnter={()=>warmRoute(item.href)} onPointerEnter={()=>warmRoute(item.href,true)} onPointerDown={()=>warmRoute(item.href,true)} onFocus={()=>warmRoute(item.href,true)} onTouchStart={()=>warmRoute(item.href,true)} onClick={()=>{indicateNavigation(item.href);setOpen(false)}}><Icon size={18} strokeWidth={1.9}/><span>{item.label}</span></Link>
          })}</div>}
        </div>
      </nav>
      <div className="sidebar-foot"><div className="sidebar-support"><ShieldCheck size={19}/><div><strong>People decide. AI assists.</strong><span>No automatic hiring or rejection.</span></div></div><Link href="/" className="back-website"><ArrowLeft size={16}/> Back to website</Link></div>
    </aside>
    {open&&<button type="button" className="sidebar-overlay" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <div className="workspace-main" onClickCapture={event=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const target=event.target;
      const anchor=target instanceof Element?target.closest('a[href^="/demo"]'):null;
      if(anchor){const href=anchor.getAttribute('href');if(href)indicateNavigation(href.split('?')[0].split('#')[0]);}
    }}>
      {navPending&&<div className="workspace-route-progress" role="status" aria-label="Opening page"><span/></div>}
      <header className="workspace-topbar">
        <button type="button" className="workspace-hamburger" onClick={()=>setOpen(true)} aria-label="Open menu"><Menu size={23}/></button>
        <span className="workspace-breadcrumb">Your workspace <ChevronRight size={14}/> <strong>{current}</strong></span>
        <div className="workspace-role-switch" role="group" aria-label="Choose workspace view">
          <button type="button" onClick={()=>switchView('candidate')} aria-pressed={view==='candidate'} className={view==='candidate'?'active':''}><UserRound size={17}/><span>Candidate View</span></button>
          <button type="button" onClick={()=>switchView('hr')} aria-pressed={view==='hr'} className={view==='hr'?'active':''}><BriefcaseBusiness size={17}/><span>HR View</span></button>
        </div>
        <LanguageSwitcher compact/>
        <span className="workspace-status"><span className="online-dot"/>{pathname.startsWith('/demo/career')?'Practice studio':'Workspace ready'}</span>
      </header>
      <div className="workspace-content">{children}</div>
    </div>
  </div>;
}

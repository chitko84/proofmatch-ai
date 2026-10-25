'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,AudioLines,Bot,CheckCircle2,Headphones,Mic,MicOff,MessageCircle,ScanSearch,Send,ShieldCheck,Sparkles,Volume2,VolumeX,WandSparkles} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {assessMatch,rankRoles} from '@/lib/engine';
import {MIRA_QUESTIONS,demoMiraAnswer} from '@/lib/mira';
import {MiraAvatar} from '@/components/mira-avatar';

type ChatEntry={by:'user'|'mira';text:string;mode?:string};
type SpeechEvent={results:ArrayLike<ArrayLike<{transcript:string}>>};
type BrowserRecognizer={lang:string;interimResults:boolean;onresult:((event:SpeechEvent)=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void};
type SpeechWindow=Window&{SpeechRecognition?:new()=>BrowserRecognizer;webkitSpeechRecognition?:new()=>BrowserRecognizer};
const greeting='Hi, I’m Mira. Choose a fictional candidate and ask me what their supplied evidence says about a role.';

export default function MiraPage(){
 const [voiceFeedback,setVoiceFeedback]=useState('');
 const [candidateId,setCandidateId]=useState(candidates[0].id);
 const [roleId,setRoleId]=useState(rankRoles(candidates[0],roles)[0].roleId);
 const [draft,setDraft]=useState('');
 const [entries,setEntries]=useState<ChatEntry[]>([{by:'mira',text:greeting}]);
 const [busy,setBusy]=useState(false),[sound,setSound]=useState(true),[useLiveAI,setUseLiveAI]=useState(false),[speaking,setSpeaking]=useState(false),[listening,setListening]=useState(false),[mode,setMode]=useState('Sample guide'),[accessCode,setAccessCode]=useState('');
 const recorded=useRef<HTMLAudioElement|null>(null),recognizer=useRef<BrowserRecognizer|null>(null),endRef=useRef<HTMLDivElement>(null),active=useRef(true),request=useRef<AbortController|null>(null);
 const candidate=candidates.find(c=>c.id===candidateId)||candidates[0];
 const role=roles.find(r=>r.id===roleId)||roles[0];
 const report=useMemo(()=>assessMatch(candidate,role),[candidate,role]);
 const proof=report.assessments.filter(a=>a.support==='artifact'&&a.evidence?.excerpt).slice(0,3);
 const pending=report.assessments.filter(a=>a.support!=='artifact').slice(0,2);
 const best=rankRoles(candidate,roles)[0];

 useEffect(()=>{
  // A watch alert opens Mira on the exact candidate + alternative role; no new login or persistence required.
  const params=new URLSearchParams(window.location.search);
  const suppliedCandidate=params.get('candidate');const suppliedRole=params.get('role');
  if(suppliedCandidate&&candidates.some(c=>c.id===suppliedCandidate)){
    setCandidateId(suppliedCandidate);
    const c=candidates.find(c=>c.id===suppliedCandidate)!;
    setRoleId(suppliedRole&&roles.some(r=>r.id===suppliedRole)?suppliedRole:rankRoles(c,roles)[0].roleId);
  }
 },[]);
 useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'});},[entries]);
 useEffect(()=>()=>{active.current=false;request.current?.abort();recognizer.current?.stop();recorded.current?.pause();window.speechSynthesis?.cancel()},[]);
 function stopVoice(){recognizer.current?.stop();recorded.current?.pause();window.speechSynthesis?.cancel();setListening(false);setSpeaking(false)}
 function selectCandidate(id:string){stopVoice();request.current?.abort();setBusy(false);setCandidateId(id);setRoleId(rankRoles(candidates.find(c=>c.id===id)||candidates[0],roles)[0].roleId);setEntries([{by:'mira',text:greeting}]);setDraft('');setMode('Sample guide')}
 function selectRole(id:string){stopVoice();request.current?.abort();setBusy(false);setRoleId(id);setEntries([{by:'mira',text:`Let's look at ${roles.find(r=>r.id===id)?.title||'this role'} for ${candidate.alias}. What would you like to know?`}]);setDraft('');setMode('Sample guide')}
 function playRecordedVoice(intro=false){
  if(typeof window==='undefined')return;
  recorded.current?.pause();const file=intro?'/audio/mira-welcome-demo.mp3':candidateId==='C01'&&roleId==='qa'?'/audio/mira-sample-demo.mp3':'/audio/mira-welcome-demo.mp3';
  const audio=new Audio(file);recorded.current=audio;audio.onplay=()=>{setSpeaking(true);setVoiceFeedback('Using a prerecorded example voice. Mira’s text answer is specific to the selected candidate.')};
  audio.onended=()=>setSpeaking(false);audio.onerror=()=>{setSpeaking(false);setVoiceFeedback('Audio playback is unavailable. Mira’s written answers still work.')};
  void audio.play().catch(()=>{setSpeaking(false);setVoiceFeedback('Sound was blocked by the browser. Press Hear Mira speak to try again.')});
 }
 function speak(answer:string,force=false){
  if((!sound&&!force)||typeof window==='undefined')return;
  if(!window.speechSynthesis){playRecordedVoice(force);return}recorded.current?.pause();setVoiceFeedback('');
  window.speechSynthesis.cancel();const voice=new SpeechSynthesisUtterance(answer);voice.rate=.94;voice.pitch=1.05;voice.lang='en-US';
  const voices=window.speechSynthesis.getVoices();voice.voice=voices.find(v=>v.lang.toLowerCase().startsWith('en')&&/natural|google|microsoft/i.test(v.name))||voices.find(v=>v.lang.toLowerCase().startsWith('en'))||null;
  voice.onstart=()=>{if(active.current)setSpeaking(true)};voice.onend=()=>{if(active.current)setSpeaking(false)};voice.onerror=()=>{if(active.current){setSpeaking(false);playRecordedVoice(force)}};
  window.speechSynthesis.speak(voice);
 }
 async function ask(question:string){
  const q=question.trim();if(q.length<3||busy)return;
  setDraft('');setEntries(old=>[...old,{by:'user',text:q}]);
  if(!useLiveAI){const reply=demoMiraAnswer(candidateId,q,roleId);setMode('Sample guide');setEntries(old=>[...old,{by:'mira',text:reply,mode:'sample'}]);speak(reply);return}
  const controller=new AbortController();request.current?.abort();request.current=controller;setBusy(true);
  try{
   const res=await fetch('/api/mira',{method:'POST',headers:{'Content-Type':'application/json',...(accessCode?{'x-demo-access-code':accessCode}:{})},body:JSON.stringify({candidateId,roleId,question:q}),signal:controller.signal});
   const data:{answer?:string;error?:string;mode?:string;notice?:string}=await res.json();if(!res.ok)throw new Error(data.error||'Live service is unavailable.');
   if(controller.signal.aborted||!active.current)return;const reply=data.answer||demoMiraAnswer(candidateId,q,roleId);
   setMode(data.mode==='gemini'?'Gemini AI':'Sample guide');setEntries(old=>[...old,{by:'mira',text:reply,mode:data.mode}]);speak(reply);
  }catch{if(controller.signal.aborted||!active.current)return;
   const reply=demoMiraAnswer(candidateId,q,roleId);setMode('Sample guide');setEntries(old=>[...old,{by:'mira',text:reply,mode:'sample'}]);speak(reply);
  }finally{if(request.current===controller&&active.current){setBusy(false);request.current=null}}
 }
 function toggleMic(){if(listening){recognizer.current?.stop();setListening(false);return;}const speechWindow=window as SpeechWindow;const C=speechWindow.SpeechRecognition||speechWindow.webkitSpeechRecognition;if(!C){setEntries(old=>[...old,{by:'mira',text:'Voice input isn’t available in this browser. You can type your question instead.'}]);return;}const r=new C();r.lang='en-US';r.interimResults=false;r.onresult=(e:SpeechEvent)=>{const text=e.results[0]?.[0]?.transcript||'';setDraft(text);if(text.trim())void ask(text)};r.onerror=()=>{setListening(false);setEntries(old=>[...old,{by:'mira',text:"I couldn’t hear that clearly. You can try the microphone again or type your question."}])};r.onend=()=>setListening(false);recognizer.current=r;try{r.start();setListening(true)}catch{setListening(false)}}
 return <main className="workspace-page mira-studio-page">
  <div className="page-title-row"><div><span className="small-eyebrow">MIRA · YOUR HOLOGRAPHIC MATCH GUIDE</span><h1>Meet the person behind the answers.</h1><p>Ask Mira to explain sample matches, inspect supporting project examples and find a thoughtful next step.</p></div><div className="mira-studio-badge"><Sparkles size={16}/> Interactive AI studio</div></div>
  <div className="p3-mira-layout mira-studio-layout">
   <section className="white-panel mira-scene-panel mira-hologram-panel" aria-label="Mira holographic visual studio">
     <div className="mira-studio-top"><span><WandSparkles size={15}/> MIRA STUDIO</span><span className="mira-studio-live"><span className="online-dot"/> {listening?'Listening':speaking?'Speaking':busy?'Thinking':'Ready'}</span></div>
     <div className="mira-hologram-world"><div className="mira-holo-grid" aria-hidden="true"/><div className="mira-holo-orbit orbit-a" aria-hidden="true"/><div className="mira-holo-orbit orbit-b" aria-hidden="true"/><div className="mira-holo-stars" aria-hidden="true"/><MiraAvatar speaking={speaking} listening={listening}/><div className="mira-holo-platform" aria-hidden="true"/></div>
     <div className="mira-studio-welcome"><span className="mira-studio-identity"><AudioLines size={16}/> {listening?'I’m listening…':speaking?'Speaking to you…':busy?'Checking the sample evidence…':'Hi, I’m Mira.'}</span><h2>Let’s see the full picture.</h2><p>Ask a question, explore an evidence excerpt or choose a different role. The decision always stays with you.</p></div>
     <div className="mira-studio-actions"><button type="button" onClick={()=>{setSound(!sound);if(sound){window.speechSynthesis?.cancel();recorded.current?.pause();setSpeaking(false)}}} className="mira-studio-voice-btn" aria-pressed={sound}>{sound?<Volume2 size={18}/>:<VolumeX size={18}/>} {sound?'Voice replies on':'Enable voice replies'}</button><button type="button" className="mira-studio-voice-btn" onClick={()=>speak('Hello! I am Mira. Ask me which open job fits the candidate evidence, what information is missing, or what the recruiter could ask next.',true)}><Volume2 size={18}/> Hear Mira speak</button><span><Headphones size={15}/> Browser voice</span></div>{voiceFeedback&&<p className="mira-voice-notice" role="status">{voiceFeedback}</p>}
   </section>
   <section className="white-panel mira-chat-panel mira-studio-chat"><div className="panel-heading"><div><span className="small-eyebrow">CONVERSATION STUDIO</span><h2>Ask about a real example.</h2></div><MessageCircle size={21}/></div>
    <div className="mira-controls"><label>Fictional candidate<select value={candidateId} onChange={e=>selectCandidate(e.target.value)}>{candidates.map(c=><option key={c.id} value={c.id}>{c.alias}</option>)}</select></label><label>Role to discuss<select value={role.id} onChange={e=>selectRole(e.target.value)}>{roles.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></label></div>
    <div className="mira-role-summary"><span><CheckCircle2 size={16}/> You’re exploring {candidate.alias}</span><strong>{role.title}</strong><small>{role.id===best.roleId?'Strongest supported role in the current sample comparison':'A role selected for review; not necessarily the strongest match'}</small></div>
    <div className="mira-evidence-strip"><div className="mira-evidence-title"><ScanSearch size={16}/><strong>From the supplied evidence</strong><small>Not independently verified</small></div>
      {proof.length?proof.map(item=><div className="mira-evidence-chip" key={item.requirement.skillId}><span>{item.requirement.label}</span><p>“{item.evidence!.excerpt}”</p><small>{item.evidence!.sourceLabel}</small></div>):<p className="mira-no-evidence">No supplied project examples for these requirements yet. A recruiter can ask for more information.</p>}
      {!!pending.length&&<p className="mira-still-check">Still to clarify: {pending.map(x=>x.requirement.label).join(', ')}</p>}
    </div>
    <div className="mira-demo-mode" role="group" aria-label="Mira response mode"><span><ShieldCheck size={15}/> Choose how Mira answers:</span><button type="button" aria-pressed={!useLiveAI} className={!useLiveAI?'active':''} onClick={()=>setUseLiveAI(false)}>Instant guided answers</button><button type="button" aria-pressed={useLiveAI} className={useLiveAI?'active':''} onClick={()=>setUseLiveAI(true)}>Try live Gemini AI</button><small>Instant answers use supplied fictional evidence and work without an API key. Live AI requires a configured connection.</small></div><div className="mira-prompts"><button type="button" disabled={busy} onClick={()=>void ask("Why could this person suit another open job?")}>Show a sample Mira reply (no internet)</button>{MIRA_QUESTIONS.map(q=><button type="button" disabled={busy} key={q} onClick={()=>void ask(q)}>{q}</button>)}</div>
    <div className="mira-messages" aria-live="polite" aria-label="Conversation with Mira">{entries.map((e,i)=><div key={i} className={`mira-message ${e.by}`}><span>{e.by==='mira'?'Mira':'You'}</span><p>{e.text}</p>{e.by==='mira'&&e.mode&&<small>{e.mode==='gemini'?'Gemini AI response':'Fictional sample guidance'}</small>}</div>)}{busy&&<div className="mira-message mira"><span>Mira</span><p>Checking the sample evidence…</p></div>}<div ref={endRef}/></div>
    <form className="mira-input-row" onSubmit={e=>{e.preventDefault();void ask(draft)}}><button type="button" className={listening?'mic-active':'mic-button'} onClick={toggleMic} aria-label={listening?'Stop listening':'Speak a question'} aria-pressed={listening}>{listening?<MicOff size={18}/>:<Mic size={18}/>}</button><input aria-label="Your question to Mira" value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Ask Mira about this candidate…" maxLength={350}/><button aria-label="Send message" disabled={busy||draft.trim().length<3} type="submit"><Send size={19}/></button></form>
    <div className="mira-studio-footer"><div className="mira-footer"><ShieldCheck size={16}/> {mode==='Gemini AI'?'Gemini AI active':'Fictional sample guidance · works offline'} · No automated hiring or predictions</div><Link href={`/demo/matches?candidate=${encodeURIComponent(candidateId)}&role=${encodeURIComponent(role.id)}`}>Open full evidence <ArrowRight size={15}/></Link></div>
    <details className="mira-studio-access"><summary>Demo access settings</summary><label>Demo code (only if required)<input type="password" autoComplete="off" placeholder="Optional demo access code" value={accessCode} onChange={e=>setAccessCode(e.target.value)}/></label></details>
   </section>
  </div>
 </main>;
}

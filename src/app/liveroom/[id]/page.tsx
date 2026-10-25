'use client';
import {useParams} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,CheckCircle2,Camera,CameraOff,Download,Headphones,MessageCircle,Mic,MicOff,Play,Send,ShieldCheck,Square,UsersRound,Volume2,VolumeX} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {addRoomMessage,humanMeetingTime,newMeetingId,saveMeeting,type DemoMeeting,type MeetingSpeaker} from '@/lib/liveroom';
import {useMeetingsSync} from '@/lib/liveroom-client';
import {meetingPracticeReply,PRACTICE_TOPICS,practiceSummary} from '@/lib/meeting-simulation';

type SpeechEvent={results:ArrayLike<ArrayLike<{transcript:string}>>};
type Recognition={lang:string;interimResults:boolean;onresult:((e:SpeechEvent)=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void};
type VoiceBrowser=Window & {SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};
type MeetingPhase='lobby'|'live'|'ended';

export default function LiveRoom(){
 const {id}=useParams<{id:string}>();const [side,setSide]=useState<MeetingSpeaker>('recruiter');
 const [candidateTicket,setCandidateTicket]=useState(''),[liveShared,setLiveShared]=useState(false);
 const {meetings}=useMeetingsSync();const record=meetings.find(x=>x.id===id);
 const [draft,setDraft]=useState(''),[alert,setAlert]=useState(''),[copied,setCopied]=useState('');
 const [phase,setPhase]=useState<MeetingPhase>('lobby'),[autoReply,setAutoReply]=useState(true),[spoken,setSpoken]=useState(true);
 const [cameraOn,setCameraOn]=useState(false),[listening,setListening]=useState(false),[elapsed,setElapsed]=useState(0);
 const [cameraStatus,setCameraStatus]=useState('Camera preview is off.');const [speaking,setSpeaking]=useState(false);
 const video=useRef<HTMLVideoElement>(null),stream=useRef<MediaStream|null>(null),recognizer=useRef<Recognition|null>(null);
 const tail=useRef<HTMLDivElement|null>(null);const started=useRef(0);
 const candidate=candidates.find(x=>x.id===record?.candidateId),role=roles.find(x=>x.id===record?.roleId);
 const otherSide:MeetingSpeaker=side==='recruiter'?'candidate':'recruiter';

 useEffect(()=>{const params=new URLSearchParams(window.location.search);setCandidateTicket(params.get('ticket')||'');setSide(params.get('as')==='candidate'?'candidate':'recruiter')},[]);
 useEffect(()=>{if(!id)return;let active=true;
  const poll=async()=>{const code=window.sessionStorage.getItem('pm-demo-admin-code')||'';const ticket=new URLSearchParams(window.location.search).get('ticket')||'';
   if(!ticket&&!code)return;
   try{const resp=await fetch(`/api/liveroom/shared/${encodeURIComponent(id)}${ticket?`?ticket=${encodeURIComponent(ticket)}`:''}`,{headers:ticket?{}:{'x-proofmatch-demo-code':code},cache:'no-store'});
    if(resp.ok){const data=await resp.json();if(active&&data.meeting){saveMeeting(data.meeting);setLiveShared(true)}}
   }catch{/* local practice remains available */}};
  void poll();const timer=window.setInterval(()=>void poll(),3500);return()=>{active=false;clearInterval(timer)};
 },[id]);
 useEffect(()=>{tail.current?.scrollIntoView({block:'nearest',behavior:'smooth'})},[record?.messages.length]);
 useEffect(()=>{if(phase!=='live')return;const tick=window.setInterval(()=>setElapsed(Math.floor((Date.now()-started.current)/1000)),1000);return()=>window.clearInterval(tick)},[phase]);
 useEffect(()=>()=>{stream.current?.getTracks().forEach(t=>t.stop());recognizer.current?.stop();window.speechSynthesis?.cancel()},[]);
 useEffect(()=>{if(cameraOn&&video.current&&stream.current)video.current.srcObject=stream.current},[cameraOn]);
 function speak(text:string){if(!spoken||typeof window==='undefined'||!window.speechSynthesis)return;
  window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.rate=.96;utterance.pitch=1.03;utterance.lang='en-US';
  const voices=window.speechSynthesis.getVoices();utterance.voice=voices.find(v=>v.lang.toLowerCase().startsWith('en')&&/natural|google|microsoft/i.test(v.name))||voices.find(v=>v.lang.toLowerCase().startsWith('en'))||null;
  utterance.onstart=()=>setSpeaking(true);utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>setSpeaking(false);window.speechSynthesis.speak(utterance);
 }
 function begin(){setPhase('live');started.current=Date.now();setElapsed(0);setAlert('');
  speak(side==='recruiter'?`Welcome to the ProofMatch practice meeting. Let's discuss the ${role?.title||'open job'} opportunity.`:'Welcome. This is a sample meeting about an alternative job opportunity.');
 }
 function end(){setPhase('ended');stopMicrophone();stopCamera();window.speechSynthesis?.cancel();setSpeaking(false);setAlert('The meeting practice is finished. Review or download the discussion notes below.')}
 function stopMicrophone(){recognizer.current?.stop();setListening(false)}
 function stopCamera(){stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;if(video.current)video.current.srcObject=null;setCameraOn(false);setCameraStatus('Camera preview is off.')}
 async function toggleCamera(){if(cameraOn){stopCamera();return;}if(!navigator.mediaDevices?.getUserMedia){setCameraStatus('This browser does not support a camera preview. The animated participant remains visible.');return}
  try{const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});stream.current=media;setCameraOn(true);setCameraStatus('Local camera preview is on. Video is NOT transmitted to anyone.');}
  catch{setCameraStatus('Camera permission was not granted. The sample meeting still works with animated participants.')}}
 function toggleMic(){if(listening){stopMicrophone();return;}const w=window as VoiceBrowser;const C=w.SpeechRecognition||w.webkitSpeechRecognition;
  if(!C){setAlert('Speech recognition is not available in this browser. Type a message or use the ready-made questions.');return}
  try{const r=new C();r.lang='en-US';r.interimResults=false;r.onresult=(e)=>{const transcript=e.results[0]?.[0]?.transcript||'';if(transcript.trim())setDraft(transcript)};
   r.onerror=()=>{setListening(false);setAlert('The browser could not hear you. You can still type your message.');};r.onend=()=>setListening(false);recognizer.current=r;r.start();setListening(true);setAlert('Speak now. Your words will appear in the message box for you to review.');}
  catch{setListening(false);setAlert('Microphone input is unavailable. Try the suggested questions instead.')}}
 async function sendMessage(content=draft){if(!record||phase!=='live')return;const cleaned=content.trim();if(!cleaned)return;
  try{if(liveShared){const code=window.sessionStorage.getItem('pm-demo-admin-code')||'';
    const resp=await fetch(`/api/liveroom/shared/${encodeURIComponent(id)}${candidateTicket?`?ticket=${encodeURIComponent(candidateTicket)}`:''}`,{method:'POST',headers:{'Content-Type':'application/json',...(candidateTicket?{}:{'x-proofmatch-demo-code':code})},body:JSON.stringify({action:'message',message:cleaned})});
    const data=await resp.json();if(!resp.ok)throw Error(data.error||'Could not deliver your message.');if(!saveMeeting(data.meeting))throw Error('The online reply was saved but this tab could not refresh.');
   }else{let next=addRoomMessage(record,side,cleaned,newMeetingId());
    if(autoReply){const answer=meetingPracticeReply(cleaned,side,record);next=addRoomMessage(next,otherSide,answer,newMeetingId());speak(answer)}
    if(!saveMeeting(next))throw Error('Browser storage is unavailable. Use a normal browser window.');
   }setDraft('');setAlert('');
  }catch(e){setAlert(e instanceof Error?e.message:'The message could not be saved.')}}
 function playSampleConversation(){
  if(!record||phase!=='live'||liveShared)return;
  try{let updated=record;
   for(const prompt of PRACTICE_TOPICS.slice(0,3)){
    updated=addRoomMessage(updated,'recruiter',prompt.question,newMeetingId());
    updated=addRoomMessage(updated,'candidate',meetingPracticeReply(prompt.question,'recruiter',updated),newMeetingId());
   }
   if(!saveMeeting(updated))throw Error('Browser storage is blocked.');
   setAlert('Three fictional conversation examples were added. You can continue with your own questions or finish and download the notes.');
   speak('Thanks for taking the time to discuss this opportunity. Could you tell me what happens next?');
  }catch(e){setAlert(e instanceof Error?e.message:'Could not prepare the sample conversation.')}
 }
 async function copyOther(){const other=otherSide;const url=`${window.location.origin}/liveroom/${id}?as=${other}${candidateTicket&&other==='candidate'?`&ticket=${encodeURIComponent(candidateTicket)}`:''}`;
  try{await navigator.clipboard.writeText(url);setCopied('The other participant’s view was copied. Open it in another tab.')}catch{setCopied(`Copy this link manually: ${url}`)}}
 function downloadNotes(){if(!record)return;const summary=practiceSummary(record);
  const content=[`ProofMatch | Fictional meeting practice`,summary.heading,`Scheduled: ${humanMeetingTime(record.scheduledLocal)} (MYT)`,'','Topics:',...summary.topics.map(x=>`- ${x}`),'',summary.action,'','Practice dialogue:',...record.messages.map(m=>`${m.speaker==='candidate'?'Candidate':'HR'}: ${m.text}`),'','Fictional demonstration only; no actual interview or decision.'].join('\n');
  const blob=new Blob([content],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`ProofMatch-practice-${record.id}.txt`;link.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 const summary=record?practiceSummary(record):null;
 const minutes=String(Math.floor(elapsed/60)).padStart(2,'0'),seconds=String(elapsed%60).padStart(2,'0');
 return <main className="live-public live-room-screen"><header className="live-public-header"><Link href="/"><strong>ProofMatch <span>AI</span></strong></Link><span>LiveRoom · Guided meeting practice with fictional participants</span></header><div className="live-room-shell">
 {!record?<section className="white-panel live-card"><h1>We couldn't open this meeting.</h1><p>Prepare a meeting from the recruiter page first.</p><Link className="button button-jade" href="/demo/meetings">Open meetings</Link></section>:record.status!=='accepted'?<section className="white-panel live-card"><h1>Waiting for the candidate's decision.</h1><p>This practice room becomes available after the candidate accepts. Current response: {record.status.replaceAll('_',' ')}.</p><Link className="button button-jade" href={`/invite/${record.id}`}>Open candidate invitation <ArrowRight size={15}/></Link></section>:<>
  <div className="live-room-top"><div><span className="small-eyebrow">LIVEROOM PRACTICE · FICTIONAL PARTICIPANTS · {side==='candidate'?'CANDIDATE VIEW':'HR VIEW'}</span><h1>{role?.title} · Let's talk</h1><p>{humanMeetingTime(record.scheduledLocal)} MYT · {record.durationMinutes}-minute discussion · <strong>Demo scenario</strong></p></div><div className="live-room-actions"><button type="button" className="button button-secondary" onClick={copyOther}>Copy other person's view</button><Link className="button button-secondary" href={side==='recruiter'?'/demo/meetings':`/invite/${record.id}`}>Leave room</Link></div></div>
  <div className="practice-topline"><span className={`practice-state ${phase==='live'?'active':''}`}><span className="practice-pulse"/>{phase==='lobby'?'Ready to begin':phase==='live'?`Meeting in progress · ${minutes}:${seconds}`:'Practice completed'}</span><span>Practice participants and replies are fictional. Local camera previews and browser voices are optional.</span></div>
  <div className="live-room-body"><section className="live-stage"><div className="live-stage-note"><ShieldCheck size={16}/>{liveShared?'Actual text messages can sync with a connected invited participant. Practice controls do not create a real video call.':'Practice chat and guided replies run in this browser. No external meeting service is required.'}</div>
   <div className="live-people"><div className={`live-person-panel live-person-primary ${speaking&&side==='candidate'?'practice-talking':''}`}>{side==='recruiter'&&cameraOn?<video ref={video} playsInline autoPlay muted className="practice-video" aria-label="Your local camera preview"/>:<div className="live-person-avatar">HR</div>}<strong>Recruiter</strong><small>{side==='recruiter'?'You · practice host':'Fictional recruiter'}</small><span>{phase==='live'?<><span className="online-dot"/> In the meeting</>:<>Waiting for meeting</>}</span></div><div className={`live-person-panel live-person-candidate ${speaking&&side==='recruiter'?'practice-talking':''}`}>
    {side==='candidate'&&cameraOn?<video ref={video} playsInline autoPlay muted className="practice-video" aria-label="Your local camera preview"/>:<div className="live-person-avatar">{candidate?.id.slice(-2)||'01'}</div>}
    <strong>{candidate?.alias||'Candidate'}</strong><small>{side==='candidate'?'You · candidate view':'Fictional practice participant'}</small><span>{cameraOn?'Your local preview · not shared':phase==='live'?'Practice participant ready':'Waiting for meeting'}</span></div></div>
   <div className="practice-call-controls" aria-label="Practice meeting controls">
    {phase==='lobby'?<button className="button button-jade" type="button" onClick={begin}><Play size={17}/> Join practice meeting</button>:phase==='ended'?<button className="button button-jade" type="button" onClick={begin}><Play size={16}/> Practice again</button>:<button className="practice-end-btn" type="button" onClick={end}><Square size={15}/> Finish meeting</button>}
    <button type="button" className="practice-icon-control" disabled={phase!=='live'} onClick={toggleMic} aria-pressed={listening}>{listening?<Mic size={17}/>:<MicOff size={17}/>} {listening?'Listening…':'Speak to type'}</button>
    <button type="button" className="practice-icon-control" onClick={()=>void toggleCamera()} aria-pressed={cameraOn}>{cameraOn?<Camera size={17}/>:<CameraOff size={17}/>} {cameraOn?'Turn preview off':'Camera preview'}</button>
    <button type="button" className="practice-icon-control" onClick={()=>{setSpoken(!spoken);if(spoken){window.speechSynthesis?.cancel();setSpeaking(false)}}} aria-pressed={spoken}>{spoken?<Volume2 size={17}/>:<VolumeX size={17}/>} {spoken?'Spoken replies on':'Spoken replies off'}</button>
   </div><div className="practice-camera-hint" role="status">{cameraStatus}</div>
   <div className="live-stage-bottom"><div><UsersRound size={18}/> A discussion that considers both sides' expectations.</div><span>GUIDED DEMONSTRATION</span></div>
  </section>
  <section className="live-chat"><div className="live-chat-header"><MessageCircle size={18}/><div><strong>Meeting conversation</strong><small>{liveShared?'Cross-device text chat available':'Browser practice · fictional replies can be switched off'}</small></div></div>
   {phase==='lobby'&&<div className="practice-message"><Headphones size={17}/> Press <strong>Join practice meeting</strong> to begin. You can speak a question, type one, or select a conversation starter.</div>}
   {phase==='ended'&&summary&&<div className="practice-summary" role="status"><strong><CheckCircle2 size={17}/> Meeting practice complete</strong><p>{summary.action}</p>{summary.topics.map(t=><span key={t}>{t}</span>)}<button type="button" className="button button-secondary" onClick={downloadNotes}><Download size={15}/> Download discussion notes</button></div>}
   <div className="live-chat-list" aria-live="polite">{record.messages.length===0?<div className="live-chat-empty">Start the conversation below, or select a ready-made question.</div>:record.messages.map(message=><div className={`live-chat-bubble ${message.speaker===side?'mine':'theirs'}`} key={message.id}><small>{message.speaker==='recruiter'?'Recruiter':'Candidate'}{!liveShared&&message.speaker!==side?' · example response':''}</small><p>{message.text}</p></div>)}<div ref={tail}/></div>
   <div className="practice-script"><div className="practice-story-row"><div><strong>Need a quick live-demo example?</strong><small>Add three realistic, fictional question-and-answer exchanges instantly.</small></div><button type="button" className="button button-jade" disabled={phase!=='live'||liveShared} onClick={playSampleConversation}>Play sample conversation <Play size={15}/></button></div><div className="practice-script-heading"><strong>Try a question</strong><label><input type="checkbox" checked={autoReply} disabled={liveShared} onChange={e=>setAutoReply(e.target.checked)}/> Sample participant replies {liveShared?'(off in connected chat)':''}</label></div><div className="practice-topic-buttons">{PRACTICE_TOPICS.map(t=><button type="button" disabled={phase!=='live'} key={t.label} onClick={()=>void sendMessage(side==='recruiter'?t.question:({ 'Why this role?':'Why did you consider me for another role?','Work preferences':'Can we discuss the working arrangements?','Project experience':'Will I be able to share my past projects?','Next steps':'What happens next after our conversation?' }[t.label]||t.question))}>{t.label}</button>)}</div></div>
   <form className="live-chat-form" onSubmit={e=>{e.preventDefault();void sendMessage()}}><label className="live-chat-input">Your message<textarea aria-label="Write a message" maxLength={600} rows={2} value={draft} disabled={phase!=='live'} onChange={e=>setDraft(e.target.value)} placeholder={side==='candidate'?'Ask the recruiter a question…':'Ask the candidate a question…'}/></label><button type="submit" className="button button-jade" disabled={phase!=='live'||!draft.trim()}><Send size={16}/> Send</button></form>
   {alert&&<p className="live-notice" role="status">{alert}</p>}
  </section></div>
  <div className="live-room-footer"><span><CheckCircle2 size={16}/> Accepted invitation · Human-led review · Fictional participant information</span>{!liveShared&&<button type="button" className="practice-switch" onClick={()=>{stopMicrophone();setSide(otherSide);setDraft('');setAlert('You are now viewing the other participant’s side of this fictional meeting.')}}>Switch to {otherSide==='candidate'?'candidate':'recruiter'} view <ArrowRight size={15}/></button>}</div>{copied&&<p className="live-notice" role="status">{copied}</p>}
 </>}
 </div></main>;
}

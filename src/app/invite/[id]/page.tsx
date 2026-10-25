'use client';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {ArrowRight,CalendarClock,CheckCircle2,Clock3,MessageCircle,ShieldCheck,Video} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {answerMeeting,buildMeeting,defaultMeetingTime,humanMeetingTime,readMeeting,saveMeeting,type DemoMeeting} from '@/lib/liveroom';
import {downloadCalendar,useMeetingsSync} from '@/lib/liveroom-client';
export default function CandidateInvitation(){
 const {id}=useParams<{id:string}>();
 const {meetings}=useMeetingsSync();const record=meetings.find(m=>m.id===id);
 const [ticket,setTicket]=useState('');const [loadingShared,setLoadingShared]=useState(false);
 useEffect(()=>{const p=new URLSearchParams(window.location.search);const key=p.get('ticket')||'';setTicket(key);if(!key||!id)return;
   let active=true;setLoadingShared(true);
   const load=async()=>{try{const resp=await fetch(`/api/liveroom/shared/${encodeURIComponent(id)}?ticket=${encodeURIComponent(key)}`,{cache:'no-store'});
      const data=await resp.json();if(resp.ok&&active&&data.meeting)saveMeeting(data.meeting);
      else if(active&&!resp.ok)setError(data.error||'This invitation could not be opened.');
   }catch{if(active)setError('Could not load this invitation. Try again.')}
   finally{if(active)setLoadingShared(false)}};
   void load();const timer=setInterval(()=>{void load()},5000);
   return()=>{active=false;clearInterval(timer)};
 },[id]);
 async function sharedAction(payload:Record<string,unknown>){
   const resp=await fetch(`/api/liveroom/shared/${encodeURIComponent(id)}?ticket=${encodeURIComponent(ticket)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
   const json=await resp.json();if(!resp.ok)throw Error(json.error||'Could not deliver your answer.');
   if(!saveMeeting(json.meeting))throw Error('Your answer was saved online but this browser could not refresh.');
 }
 const [note,setNote]=useState(''),[newTime,setNewTime]=useState(''),[info,setInfo]=useState(''),[error,setError]=useState(''),[question,setQuestion]=useState('');
 useEffect(()=>{
   if(record || !id || readMeeting(id))return;
   const p=new URLSearchParams(window.location.search);
   if(p.get('demo')!=='1')return;
   const candidateId=p.get('candidate')||'',roleId=p.get('role')||'',scheduledLocal=p.get('at')||'',durationMinutes=Number(p.get('mins'));
   if(!candidates.some(c=>c.id===candidateId)||!roles.some(r=>r.id===roleId))return;
   try{saveMeeting(buildMeeting({candidateId,roleId,scheduledLocal,durationMinutes},id))}catch{/* Unrecognized QR values show a safe error instead. */}
 },[id,record]);
 const person=candidates.find(c=>c.id===record?.candidateId),role=roles.find(r=>r.id===record?.roleId);
 async function respond(status:'accepted'|'declined'|'reschedule_requested'){
  if(!record)return;try{setError('');setInfo('');
   if(ticket)await sharedAction({action:'rsvp',status,note,requestedLocal:status==='reschedule_requested'?newTime:null});
   else{const next=answerMeeting(record,status,note,status==='reschedule_requested'?newTime:null);if(!saveMeeting(next))throw Error('Could not save your reply. Try another browser window.');}
   setInfo(status==='accepted'?'Thanks! You have accepted this meeting invitation.':status==='declined'?'Your reply has been saved.':'Your proposed time has been sent to the recruiter.');
  }catch(e){setError(e instanceof Error?e.message:'Please try again.')}
 }
 async function askQuestion(){if(!record)return;const text=question.trim();if(!text){setError('Write your question first.');return}
   try{if(ticket)await sharedAction({action:'question',note:text});else{const next:DemoMeeting={...record,candidateNote:text.slice(0,500),updatedAt:new Date().toISOString()};if(!saveMeeting(next))throw Error('Unable to save your question.');}setInfo('Your question is available for the recruiter to review.');setQuestion('');setError('')}catch(e){setError(e instanceof Error?e.message:'Unable to send your question.')}
 }
 return <main className="live-public"><header className="live-public-header"><Link href="/"><strong>ProofMatch <span>AI</span></strong></Link><span>ProofMatch meeting invitation · Demo candidate</span></header>
  <div className="live-public-width"><div className="live-public-heading"><span className="small-eyebrow">PROOFMATCH LIVEROOM</span><h1>A new opportunity. Your decision.</h1><p>You are invited to hear about another open role. Look at the details and choose what works for you.</p></div>
  {!record?<section className="white-panel live-card"><h2>{loadingShared?'Opening your invitation…':'This invitation is not available yet.'}</h2><p>{error||'For a browser-only example, open the recruiter page to prepare the invitation. For a Telegram invitation, follow the private link sent by the bot.'}</p><Link className="button button-jade" href="/demo/meetings">Prepare demo invitation <ArrowRight size={16}/></Link></section>:<div className="live-candidate-grid"><section className="white-panel live-card"><div className="live-telegram"><div className="live-telegram-head"><span className="live-telegram-symbol"><MessageCircle size={21}/></span><div><strong>ProofMatch Invitations</strong><small>MEETING INVITATION DETAILS</small></div></div><div className="live-message-bubble"><p>Hello {person?.alias}!</p><p>A recruiter spotted a possible match for another open position. They would like to invite you to a short discussion.</p><h3>{role?.title}</h3><p><CalendarClock size={15}/> {humanMeetingTime(record.scheduledLocal)} MYT</p><p><Clock3 size={15}/> {record.durationMinutes} minutes</p><p>This is an invitation to talk, not a job offer.</p></div></div><div className="live-info-strip"><ShieldCheck size={19}/> You choose whether to reply. Invitations sent using Telegram share replies with the recruiter; browser-only examples stay on your device.</div>{record.status==='accepted'&&<div className="live-candidate-actions"><p className="live-confirmed"><CheckCircle2 size={19}/> You have accepted this invitation.</p><button type="button" className="button button-secondary" onClick={()=>downloadCalendar(record,role?.title||'Job')}>Add to calendar</button><Link className="button button-jade" href={`/liveroom/${record.id}?as=candidate${ticket?`&ticket=${encodeURIComponent(ticket)}`:''}`} >Join the demo LiveRoom <Video size={17}/></Link></div>}{record.status==='reschedule_requested'&&<p className="live-confirmed">You requested {record.requestedLocal?humanMeetingTime(record.requestedLocal):'a new time'}. HR can confirm it in the recruiter view.</p>}{record.status==='declined'&&<p className="live-confirmed">You've declined this invitation. You can change your answer below.</p>}</section>
  <section className="white-panel live-card"><span className="small-eyebrow">YOUR REPLY</span><h2>Would you like to join?</h2><p>Choose your answer. Connected invitations also update the recruiter on another device.</p><label>Your message to the recruiter (optional)<textarea rows={3} maxLength={500} placeholder="For example, I'd like to ask about hybrid working or the team…" value={note} onChange={e=>setNote(e.target.value)}/></label><div className="live-rsvp-buttons"><button className="button button-jade" onClick={()=>respond('accepted')}><CheckCircle2 size={17}/> Yes, I'll join</button><button className="button button-secondary" onClick={()=>respond('declined')}>Not right now</button></div><div className="live-reschedule"><h3>Would another time be better?</h3><label>Suggest a date and time (MYT)<input type="datetime-local" value={newTime} onChange={e=>setNewTime(e.target.value)} placeholder={defaultMeetingTime()}/></label><button className="button button-secondary" onClick={()=>respond('reschedule_requested')}>Request another time <ArrowRight size={16}/></button></div><div className="live-reschedule"><h3>Have a question first?</h3><label>Ask the recruiter<textarea rows={2} maxLength={500} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="For example: Is hybrid work possible?"/></label><button type="button" className="button button-secondary" onClick={askQuestion}>Send my question</button></div>{error&&<p className="connect-error" role="alert">{error}</p>}{info&&<p className="live-notice" role="status"><CheckCircle2 size={16}/>{info}</p>}</section></div>}
  <p className="live-footnote">This invitation uses fictional candidate and job details. Telegram delivery is real when the recruiter sends it using the connected bot. This is not a confirmed job interview.</p></div></main>;
}

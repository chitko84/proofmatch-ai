'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,CalendarClock,CheckCircle2,Clock3,Copy,ExternalLink,MessageCircle,RefreshCw,Send,ShieldCheck,Smartphone,Video} from 'lucide-react';
import {candidates,roles} from '@/lib/data';
import {buildMeeting,confirmSuggestedTime,createReadyDemoMeeting,defaultMeetingTime,humanMeetingTime,newMeetingId,portableDemoInvitation,saveMeeting,type DemoMeeting} from '@/lib/liveroom';
import {downloadCalendar,useMeetingsSync} from '@/lib/liveroom-client';
import {demoTelegramPairingUrl} from '@/lib/live-telegram';
const statuses:Record<DemoMeeting['status'],string>={awaiting:'Waiting for their answer',accepted:'Accepted · ready to discuss',reschedule_requested:'Another time requested',declined:'Declined'};
export default function MeetingsPage(){
 const {meetings,refresh}=useMeetingsSync();
 const [candidateId,setCandidateId]=useState('C01'),[roleId,setRoleId]=useState('qa');
 const [time,setTime]=useState(''),[duration,setDuration]=useState(20),[selectedId,setSelectedId]=useState('');
 const [notice,setNotice]=useState(''),[error,setError]=useState(''),[copyFallback,setCopyFallback]=useState(''),[qr,setQr]=useState('');
 const [origin,setOrigin]=useState('');
 const [adminCode,setAdminCode]=useState(''),[pairingCode,setPairingCode]=useState('');
 const [botName,setBotName]=useState(''),[linked,setLinked]=useState(false),[telegramBusy,setTelegramBusy]=useState(false);
 const [sharedLinks,setSharedLinks]=useState<Record<string,string>>({});
 const [tgStatus,setTgStatus]=useState('Add your private demo access code, then check your Telegram connection.');
 function currentAdminCode(){return adminCode.trim()|| (typeof window!=='undefined'?window.sessionStorage.getItem('pm-demo-admin-code')||'':'')}
 async function checkTelegram(){
   const code=currentAdminCode();
   if(!code){setTgStatus('Enter your private demo access code first.');return}
   try{const response=await fetch('/api/liveroom/telegram',{headers:{'x-proofmatch-demo-code':code},cache:'no-store'});
     const result=await response.json();
     if(!response.ok)throw Error(result.error||'Could not check the connection.');
     setBotName(result.botName||'');setLinked(Boolean(result.linked));
     window.sessionStorage.setItem('pm-demo-admin-code',code);
     setTgStatus(result.linked?'Your Telegram account is linked. You can send a real test or meeting invitation.':'Not linked yet. Use the private pairing link below and press Start in Telegram.');
   }catch(e){setTgStatus(e instanceof Error?e.message:'Could not check Telegram.')}}
 async function sendRealTest(){const code=currentAdminCode();setTelegramBusy(true);try{
   const resp=await fetch('/api/liveroom/telegram',{method:'POST',headers:{'Content-Type':'application/json','x-proofmatch-demo-code':code},body:JSON.stringify({action:'test'})});
   const data=await resp.json();if(!resp.ok||!data.sent)throw Error(data.error||'Telegram did not confirm delivery.');
   setTgStatus('Telegram confirmed it sent the test message. Check your phone.');
 }catch(e){setTgStatus(e instanceof Error?e.message:'Could not send the test.')}finally{setTelegramBusy(false)}}
 async function scheduleAndSend(){setTelegramBusy(true);setError('');try{
   const code=currentAdminCode();if(!code)throw Error('Enter your private demo access code first.');
   const scheduled=new Date(`${time}:00+08:00`);if(Number.isNaN(scheduled.getTime())||scheduled.getTime()<Date.now()+60_000)throw Error('Choose a future Malaysia-time meeting.');
   const meeting=buildMeeting({candidateId,roleId,scheduledLocal:time,durationMinutes:duration},newMeetingId());
   const resp=await fetch('/api/liveroom/telegram',{method:'POST',headers:{'Content-Type':'application/json','x-proofmatch-demo-code':code},body:JSON.stringify({action:'schedule',meeting})});
   const data=await resp.json();if(!resp.ok||!data.sent)throw Error(data.error||'Telegram did not confirm delivery.');
   window.sessionStorage.setItem('pm-demo-admin-code',code);
   saveMeeting(meeting);setSelectedId(meeting.id);setSharedLinks(prev=>{const next={...prev,[meeting.id]:data.invitationUrl};window.sessionStorage.setItem('pm-meeting-links',JSON.stringify(next));return next});
   setNotice('Telegram confirmed the invitation was sent! Open Telegram on your phone to see the real message and RSVP link.');setTgStatus('Meeting delivered through the real Telegram Bot API.');
 }catch(e){setError(e instanceof Error?e.message:'Unable to send the message.')}finally{setTelegramBusy(false)}}
 useEffect(()=>{if(!selectedId)return;let active=true;
   const sync=async()=>{const code=window.sessionStorage.getItem('pm-demo-admin-code');if(!code)return;
     try{const res=await fetch(`/api/liveroom/shared/${encodeURIComponent(selectedId)}`,{headers:{'x-proofmatch-demo-code':code},cache:'no-store'});
       if(!res.ok)return;const data=await res.json();if(active&&data.meeting)saveMeeting(data.meeting);
     }catch{/* Browser-only invitations remain usable when no shared storage is configured. */}};
   void sync();const timer=setInterval(()=>{void sync()},3500);
   return()=>{active=false;clearInterval(timer)};
 },[selectedId]);

 useEffect(()=>{setTime(defaultMeetingTime());setOrigin(window.location.origin);try{setSharedLinks(JSON.parse(window.sessionStorage.getItem('pm-meeting-links')||'{}'))}catch{};const p=new URLSearchParams(window.location.search);const c=p.get('candidate');const r=p.get('role');if(c&&candidates.some(x=>x.id===c))setCandidateId(c);if(r&&roles.some(x=>x.id===r))setRoleId(r)},[]);
 const selected=meetings.find(m=>m.id===selectedId)||null;
 const meetingUrl=selected&&origin?(sharedLinks[selected.id]||portableDemoInvitation(origin,selected)) : '';
 useEffect(()=>{let live=true;setQr('');if(!meetingUrl)return;import('qrcode').then(module=>{const qrTool=('default' in module?module.default:module) as typeof import('qrcode');return qrTool.toDataURL(meetingUrl,{width:280,margin:2,color:{dark:'#102C38',light:'#FFFFFF'}})}).then(image=>{if(live)setQr(image)}).catch(()=>{if(live)setQr('')});return()=>{live=false}},[meetingUrl]);
 function create(){try{setError('');const current=new Date(time);if(Number.isNaN(current.getTime())||current.getTime()<Date.now()-60000)throw Error('Please choose a future date and time.');const meeting=buildMeeting({candidateId,roleId,scheduledLocal:time,durationMinutes:duration},newMeetingId());if(!saveMeeting(meeting))throw Error('This browser could not save the meeting. Allow site storage and try again.');setSelectedId(meeting.id);setNotice('Sample invitation prepared in this browser. To receive a real Telegram message, use Send to Telegram below.')}catch(e){setError(e instanceof Error?e.message:'Please try again.')}}
 function loadReady(){const m=createReadyDemoMeeting();if(saveMeeting(m)){setSelectedId(m.id);setCandidateId(m.candidateId);setRoleId(m.roleId);setNotice('Ready-made fictional example loaded. The candidate has accepted and a sample chat is available.');setError('')}else setError('Could not save sample data in this browser.')}
 async function confirm(m:DemoMeeting){try{
   if(sharedLinks[m.id]){const code=currentAdminCode();const resp=await fetch(`/api/liveroom/shared/${encodeURIComponent(m.id)}`,{method:'POST',headers:{'Content-Type':'application/json','x-proofmatch-demo-code':code},body:JSON.stringify({action:'confirm_time'})});const data=await resp.json();if(!resp.ok)throw Error(data.error||'Could not update the shared invitation.');saveMeeting(data.meeting);}
   else if(!saveMeeting(confirmSuggestedTime(m)))throw Error('Browser storage unavailable.');
   setNotice('New meeting time confirmed.');
 }catch(e){setError(e instanceof Error?e.message:'Could not update meeting.')}}
 async function copy(){if(!meetingUrl)return;try{await navigator.clipboard.writeText(meetingUrl);setCopyFallback('');setNotice('Candidate invitation link copied.')}catch{setCopyFallback(meetingUrl);setNotice('Copy permission unavailable. Select the link shown below to copy it.')}}
 const chosenCandidate=selected?candidates.find(c=>c.id===selected.candidateId):null,chosenRole=selected?roles.find(r=>r.id===selected.roleId):null;
 return <main className="workspace-page live-workspace">
  <div className="page-title-row"><div><span className="small-eyebrow">PROOFMATCH LIVEROOM · DEMO CANDIDATES</span><h1>From a better match to a real conversation.</h1><p>Choose a candidate, schedule a discussion, and let them decide before you meet.</p></div><CalendarClock size={32}/></div>
  <div className="gentle-note prominent-note"><ShieldCheck size={19}/><span><strong>Try it two ways:</strong> Use a browser-only example or connect your own Telegram account to receive a real invitation on your phone. People and job opportunities in this showcase are fictional; a real hiring process is not taking place.</span></div>
  <div className="live-meet-grid">
   <section className="white-panel live-card"><span className="small-eyebrow">01 · SET UP A DISCUSSION</span><h2>Invite someone to talk</h2><p>Use the example choices to show a complete journey in seconds.</p>
    <label>Who is the invitation for?<select value={candidateId} onChange={e=>setCandidateId(e.target.value)}>{candidates.map(c=><option value={c.id} key={c.id}>{c.alias}</option>)}</select></label>
    <label>Which open job?<select value={roleId} onChange={e=>setRoleId(e.target.value)}>{roles.map(r=><option value={r.id} key={r.id}>{r.title}</option>)}</select></label>
    <div className="live-two"><label>Meeting date and time (Malaysia)<input type="datetime-local" value={time} onChange={e=>setTime(e.target.value)}/></label><label>Duration<select value={duration} onChange={e=>setDuration(Number(e.target.value))}>{[15,20,30,45,60].map(x=><option key={x} value={x}>{x} minutes</option>)}</select></label></div>
    <div className="live-row-actions"><button className="button button-jade" type="button" onClick={create}><Send size={17}/> Schedule invitation</button><button className="button button-secondary" type="button" onClick={loadReady}>Load ready-to-show example</button></div>
    {error&&<p role="alert" className="connect-error">{error}</p>}
    <p className="page-footnote">The first button prepares a browser-only example. To deliver an actual phone notification, use the Telegram panel below.</p>
   </section>
   <section className="white-panel live-card"><span className="small-eyebrow">02 · PREVIEW THE INVITATION</span><h2>{selected?'Invitation prepared':'Your invitation preview'}</h2>
    {!selected?<div className="live-empty"><Smartphone size={42}/><p>Schedule an invitation on the left to see the message your candidate would receive.</p></div>:<>
     <div className="live-telegram"><div className="live-telegram-head"><span className="live-telegram-symbol"><Send size={19}/></span><div><strong>ProofMatch Invitations</strong><small>TELEGRAM INVITATION PREVIEW</small></div></div><div className="live-message-bubble"><p>Hi {chosenCandidate?.alias}! The recruitment team would like to discuss another open role with you.</p><strong>{chosenRole?.title}</strong><span><CalendarClock size={14}/> {humanMeetingTime(selected.scheduledLocal)} · MYT</span><span><Clock3 size={14}/> {selected.durationMinutes} minutes</span><p>You can accept, ask for another time, or decline. It's your choice.</p><span className="live-telegram-cta">View meeting invitation →</span></div></div>
     <div className="live-links"><Link className="button button-jade" href={meetingUrl||`/invite/${selected.id}`} target="_blank" rel="noopener noreferrer">Open candidate message <ExternalLink size={15}/></Link><button type="button" className="button button-secondary" onClick={copy}><Copy size={15}/> Copy link</button></div>
     {qr&&<div className="live-qr"><img alt="QR code for the sample candidate invitation" src={qr} width={142} height={142}/><p>Scan this code to open the invitation. Phone replies update the recruiter view when it was delivered using the connected Telegram flow.</p></div>}
     {copyFallback&&<input aria-label="Copy invitation URL" readOnly onFocus={e=>e.target.select()} value={copyFallback}/>}
    </>}
   </section>
  </div>
  <section className="white-panel live-card" aria-label="Send real Telegram invitations">
    <span className="small-eyebrow">REAL PHONE DELIVERY · YOUR PRIVATE TELEGRAM ACCOUNT</span>
    <h2>Send this invitation to Telegram</h2>
    <p>Connect your Telegram account once, then send an actual message to your phone. No phone number is needed and no fictional person is contacted.</p>
    <div className="live-two"><label>Private demo access code <input type="password" autoComplete="off" value={adminCode} onChange={e=>setAdminCode(e.target.value)} placeholder="From your Vercel environment"/></label><label>Private Telegram pairing code <input type="password" autoComplete="off" value={pairingCode} onChange={e=>setPairingCode(e.target.value)} placeholder="From your Vercel environment"/></label></div>
    <div className="live-row-actions"><button type="button" className="button button-secondary" onClick={checkTelegram}><RefreshCw size={16}/> Check Telegram</button>
    {botName&&pairingCode&&<a className="button button-secondary" href={(()=>{try{return demoTelegramPairingUrl(botName,pairingCode)}catch{return '#'}})()} target="_blank" rel="noopener noreferrer">Pair my Telegram account <ExternalLink size={15}/></a>}
    <button type="button" className="button button-secondary" disabled={telegramBusy||!linked} onClick={sendRealTest}>Send test to my phone</button>
    <button type="button" className="button button-jade" disabled={telegramBusy||!linked||!time} onClick={scheduleAndSend}><Send size={16}/> {telegramBusy?'Contacting Telegram…':'Schedule & send to Telegram'}</button></div>
    <p role="status" className="page-footnote">{tgStatus}</p>
    <p className="page-footnote">The delivery button only reports success after Telegram confirms a real message. The meeting itself uses a fictional candidate record. Keep both private codes out of screenshots.</p>
  </section>
  <section className="white-panel live-card live-meeting-list"><div className="live-flex-heading"><div><span className="small-eyebrow">03 · SEE WHAT THE CANDIDATE DECIDES</span><h2>Invitations and responses</h2></div><button className="button button-secondary" onClick={()=>{refresh();setNotice('Checked this browser for the latest candidate replies.')}}><RefreshCw size={15}/> Refresh</button></div>
    {meetings.length===0?<div className="live-empty"><MessageCircle size={28}/><p>No discussions scheduled yet. Create one above or load the sample conversation.</p></div>:<div className="live-meeting-cards">{[...meetings].reverse().map(m=>{const c=candidates.find(x=>x.id===m.candidateId),r=roles.find(x=>x.id===m.roleId);return <article className={`live-meeting-item ${selectedId===m.id?'live-active':''}`} key={m.id}><div><strong>{c?.alias||m.candidateId} · {r?.title||m.roleId}</strong><p>{humanMeetingTime(m.scheduledLocal)} MYT · {m.durationMinutes} min</p><span className={`live-status live-status-${m.status}`}>{statuses[m.status]}</span>{m.candidateNote&&<p className="live-italic">“{m.candidateNote}”</p>}{m.requestedLocal&&<p><strong>Suggested time:</strong> {humanMeetingTime(m.requestedLocal)} MYT</p>}</div><div className="live-item-actions"><button type="button" className="button button-secondary" onClick={()=>{setSelectedId(m.id);setError('');setNotice('Invitation selected. You can preview it above.')}}>View invitation</button><Link href={sharedLinks[m.id]||`/invite/${m.id}`} target="_blank" className="button button-secondary">Candidate view</Link>{m.status==='reschedule_requested'&&<button className="button button-jade" onClick={()=>confirm(m)}>Confirm new time</button>}{m.status==='accepted'&&<Link className="button button-jade" href={`/liveroom/${m.id}?as=recruiter`}>Enter LiveRoom <ArrowRight size={15}/></Link>}{m.status==='accepted'&&<button type="button" className="button button-secondary" onClick={()=>downloadCalendar(m,r?.title||'Job')}>Add to calendar</button>}</div></article>})}</div>}
  </section>
  {notice&&<p role="status" className="live-notice"><CheckCircle2 size={16}/>{notice}</p>}
  <section className="live-bottom-cta"><div><span className="small-eyebrow">YOUR COMPLETE DEMO JOURNEY</span><h2>Find a match → schedule → respond → discuss.</h2><p>For a browser-only rehearsal, open the candidate view in another tab. With Telegram connected, open the real phone invitation and watch the recruiter status update here.</p></div><Link href="/demo/discover" className="button button-secondary">Back to Blindspot Rescue <ArrowRight size={16}/></Link></section>
 </main>;
}

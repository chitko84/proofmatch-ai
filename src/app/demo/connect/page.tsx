'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardCheck, Copy, ExternalLink, MessageCircle, QrCode, RefreshCw, ScanLine, ShieldCheck, CalendarClock } from 'lucide-react';
import { candidates, roles } from '@/lib/data';
import { browserPassportUrl, readLocalInvitations, saveLocalInvitation } from '@/lib/connect-client';
import type { Invitation } from '@/lib/connect';

type InviteResponse = { invitation: Invitation; mode: 'shared'|'browser-demo'; url: string; telegramUrl: string|null };
type ConnectionDiagnostics = {ready:boolean;sharedStorage:boolean;botVerified:boolean;webhookVerified:boolean;webhookMatches:boolean;botName:string;storageMessage:string;telegramMessage:string};
export default function ConnectPage() {
 const [candidateId,setCandidateId]=useState('C01'),[roleId,setRoleId]=useState('qa');
 const [accessCode,setAccessCode]=useState('');
 const [invite,setInvite]=useState<InviteResponse|null>(null);
 const [qr,setQr]=useState(''),[botQr,setBotQr]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const [diagnostics,setDiagnostics]=useState<ConnectionDiagnostics|null>(null),[checking,setChecking]=useState(false);
 const [records,setRecords]=useState<Invitation[]>([]),[notice,setNotice]=useState(''),[samplePreview,setSamplePreview]=useState(false);
 useEffect(()=>{const update=()=>{
   const saved=readLocalInvitations();setRecords(saved);
   // Passport replies saved in another tab of this browser should appear immediately in the recruiter view.
   // Never replace a real shared response with local fictional data.
   setInvite(previous=>{
     if(!previous||previous.mode!=='browser-demo')return previous;
     const latest=saved.find(r=>r.token===previous.invitation.token);
     return latest&&JSON.stringify(latest.reply)!==JSON.stringify(previous.invitation.reply)?{...previous,invitation:latest}:previous;
   });
  };update();window.addEventListener("storage",update);window.addEventListener("proofmatch-connect-update",update);return()=>{window.removeEventListener("storage",update);window.removeEventListener("proofmatch-connect-update",update)}},[]);
 useEffect(()=>{const search=new URLSearchParams(window.location.search);const c=search.get('candidate'),r=search.get('role');if(c&&candidates.some(p=>p.id===c))setCandidateId(c);if(r&&roles.some(p=>p.id===r))setRoleId(r)},[]);
 async function checkConnections(){
   setChecking(true);
   try{const res=await fetch('/api/connect/diagnostics',{cache:'no-store'});if(!res.ok)throw Error('Status check unavailable.');setDiagnostics(await res.json() as ConnectionDiagnostics)}
   catch{setNotice('Could not check the live connections. Demo features still work in the browser.')}
   finally{setChecking(false)}
 }
 useEffect(()=>{void checkConnections()},[]);
 useEffect(()=>{
   if(!invite||invite.mode!=='shared')return;
   let stopped=false;
   const token=invite.invitation.token;
   const interval=window.setInterval(async()=>{
      try{const res=await fetch(`/api/connect/status?token=${encodeURIComponent(token)}`,{cache:'no-store'});if(!res.ok||stopped)return;
        const data=await res.json() as {invitation?:Invitation};if(!data.invitation||stopped)return;
        setInvite(old=>old&&old.invitation.token===token&&JSON.stringify(old.invitation.reply)!==JSON.stringify(data.invitation!.reply)?{...old,invitation:data.invitation!}:old);
        if(data.invitation.reply){saveLocalInvitation(data.invitation);setRecords(readLocalInvitations())}
      }catch{/* visible Check response button remains available */}
   },6000);
   return()=>{stopped=true;window.clearInterval(interval)};
 },[invite?.invitation.token,invite?.mode]);
 async function updateQrCodes(url:string,telegramUrl:string|null){
  try{const QRModule=await import('qrcode');const QR=('default' in QRModule?QRModule.default:QRModule) as typeof import('qrcode');setQr(await QR.toDataURL(url,{width:260,margin:2,color:{dark:'#102C38',light:'#FFFFFF'}}));
   if(telegramUrl)setBotQr(await QR.toDataURL(telegramUrl,{width:260,margin:2,color:{dark:'#102C38',light:'#FFFFFF'}}));else setBotQr('');
  }catch{setNotice('The link is ready but the QR preview is unavailable. Try Copy link.');setBotQr('')}
 }
 async function showInvite(record:Invitation){
   setError('');setNotice('');setQr('');setBotQr('');setSamplePreview(false);setCandidateId(record.candidateId);setRoleId(record.roleId);
   let mode:InviteResponse['mode']='browser-demo';let fresh=record;let telegramUrl:string|null=null;
   try{const res=await fetch(`/api/connect/status?token=${encodeURIComponent(record.token)}`,{cache:'no-store'});if(res.ok){const data=await res.json() as {invitation?:Invitation;telegramUrl?:string|null};if(data.invitation){fresh=data.invitation;telegramUrl=data.telegramUrl||null;mode='shared';saveLocalInvitation(fresh);setRecords(readLocalInvitations());}}}catch{/* keep local preview */}
   const origin=window.location.origin;const url=mode==='shared'?`${origin}/passport?token=${record.token}`:browserPassportUrl(origin,record);
   setInvite({invitation:fresh,mode,url,telegramUrl});
   await updateQrCodes(url,telegramUrl);
 }
 async function create() {
   setBusy(true);setError('');setQr('');setBotQr('');setInvite(null);setNotice('');setSamplePreview(false);
   try {
    const response=await fetch('/api/connect/invite',{method:'POST',headers:{'Content-Type':'application/json',...(accessCode?{'x-demo-access-code':accessCode}:{})},body:JSON.stringify({candidateId,roleId})});
    const data=(await response.json()) as InviteResponse & {error?:string};
    if(!response.ok||!data.invitation)throw new Error(data.error||'Could not prepare your invitation.');
    setInvite(data);saveLocalInvitation(data.invitation);setRecords(readLocalInvitations());
    await updateQrCodes(data.url,data.telegramUrl);
   }catch(e){setError(e instanceof Error?e.message:'Please try again.')}finally{setBusy(false)}
 }
 async function createBrowserExample(){
   setBusy(true);setError('');setNotice('');setSamplePreview(false);
   try{
     const token=typeof crypto.randomUUID==='function'?crypto.randomUUID().replaceAll('-',''):`local-demo-${Date.now()}-${Math.random().toString(36).slice(2,12)}`;
     const invitation:Invitation={token,candidateId,roleId,createdAt:new Date().toISOString(),reply:null};
     const url=browserPassportUrl(window.location.origin,invitation);
     setInvite({invitation,mode:'browser-demo',url,telegramUrl:null});
     saveLocalInvitation(invitation);setRecords(readLocalInvitations());
     await updateQrCodes(url,null);
     setNotice('Browser-only invitation ready. The QR opens fictional data on your phone, but replies from another device will not appear here. No Telegram message was sent.');
   }catch{setError('Could not prepare a local example. Use the sample Passport link above.');}
   finally{setBusy(false)}
 }
 async function refresh(){
   if(!invite)return;setError("");
   if(invite.mode==='browser-demo'){
      const latest=readLocalInvitations().find(r=>r.token===invite.invitation.token);if(latest)setInvite({...invite,invitation:latest});setRecords(readLocalInvitations());setNotice('Updated from this browser. Try the passport link in this same browser.');return;
   }
   try{const res=await fetch(`/api/connect/status?token=${encodeURIComponent(invite.invitation.token)}`,{cache:'no-store'});
     const data=await res.json() as {invitation?:Invitation;error?:string};if(!res.ok||!data.invitation)throw new Error(data.error||'Could not refresh.');
     setInvite({...invite,invitation:data.invitation});saveLocalInvitation(data.invitation);setRecords(readLocalInvitations());setNotice('Response checked.');
   }catch(e){setError(e instanceof Error?e.message:'Could not check the response.')}
 }
 const selected=candidates.find(c=>c.id===candidateId)!;
 const role=roles.find(r=>r.id===roleId)!;
 return <main className="workspace-page">
  <div className="page-title-row"><div><span className="small-eyebrow">PROOFMATCH CONNECT</span><h1>Invite someone to explore another job.</h1><p>Share an opportunity, ask if it interests them, and listen to what matters to them.</p></div><QrCode size={31}/></div>
  <div className="gentle-note prominent-note"><ShieldCheck size={19}/><span><strong>Safe demo:</strong> Everyone here is fictional. HR approves the invitation first, and a candidate must choose to respond. No one is automatically hired or rejected.</span></div>
  <section className="white-panel connect-panel" style={{margin:'15px 0'}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',alignItems:'center'}}>
      <div><span className="small-eyebrow">REAL TELEGRAM + PHONE SCANNING</span><h2>Is everything connected?</h2></div>
      <button type="button" className="button button-secondary" disabled={checking} onClick={()=>void checkConnections()}><RefreshCw size={16}/> {checking?'Checking…':'Check live connections'}</button>
    </div>
    {diagnostics?<div className="connect-context"><strong>{diagnostics.ready?'Telegram services are connected — test a real reply':'Presentation demo is ready; live Telegram needs setup or attention'}</strong>
      <p>Shared phone replies: {diagnostics.sharedStorage?'Connected':'Not connected'} · Telegram bot: {diagnostics.botVerified?`Verified @${diagnostics.botName}`:'Not verified'} · Webhook: {diagnostics.webhookVerified?'Registered':'Not verified'}{diagnostics.webhookVerified&&!diagnostics.webhookMatches?' (different website address)':''}</p>
      <p>{diagnostics.ready?'Use your phone to open Telegram and respond. The recruiter view will check for replies automatically.':`${diagnostics.storageMessage} ${diagnostics.telegramMessage}`}</p>
    </div>:<p className="page-footnote">Checking real services… Your sample features work without them.</p>}
    <div className="demo-form-actions"><Link className="button button-secondary" href="/demo/scan"><ScanLine size={16}/> Open QR scanner</Link><Link className="button button-secondary" href="/passport?candidate=C01&role=qa"><QrCode size={16}/> Open sample passport</Link></div>
   </section>
  <div className="connect-grid">
   <section className="white-panel connect-panel"><span className="small-eyebrow">STEP 1 · PICK AN OPPORTUNITY</span><h2>Who would you like to invite?</h2>
    <label>Person<select value={candidateId} onChange={e=>{setCandidateId(e.target.value);setInvite(null);setQr("")}}>{candidates.map(c=><option value={c.id} key={c.id}>{c.alias}</option>)}</select></label>
    <label>Open job<select value={roleId} onChange={e=>{setRoleId(e.target.value);setInvite(null);setQr("")}}>{roles.map(r=><option value={r.id} key={r.id}>{r.title}</option>)}</select></label>
    <div className="connect-context"><strong>{selected.alias} · {role.title}</strong><p>We recommend reviewing the supporting evidence before inviting anyone.</p><Link href={`/demo/matches?candidate=${candidateId}&role=${roleId}`}>See the evidence <ArrowRight size={14}/></Link></div>
    <label>Demo access code <small>(only if set on your server)</small><input type="password" value={accessCode} onChange={e=>setAccessCode(e.target.value)} placeholder="Leave blank for local use" autoComplete="off"/></label>
    <div className="demo-form-actions"><button type="button" className="button button-secondary" onClick={()=>{setCandidateId("C01");setRoleId("qa");setInvite(null);setQr("");setError("");setNotice("Sample opportunity selected. Click Prepare invitation next.")}}>Use sample opportunity</button><button type="button" disabled={busy} onClick={create} className="button button-jade">{busy?'Preparing…':'Prepare invitation'} <ArrowRight size={16}/></button><button type="button" disabled={busy} onClick={()=>void createBrowserExample()} className="button button-secondary">Use browser-only demo</button></div>
    {error&&<p role="alert" className="connect-error">{error}</p>}
   </section>
   <section className="white-panel connect-panel"><span className="small-eyebrow">STEP 2 · SHARE AND LISTEN</span><h2>{invite?'Your invitation is ready':'Your shareable invitation'}</h2>
    {!invite?<div className="connect-placeholder"><QrCode size={55}/><p>Choose someone on the left, then prepare an invitation.</p></div>:<>
      <div className="connect-qr">{qr?<img src={qr} alt="QR code linking to the fictional candidate invitation" width={226} height={226}/>:<QrCode size={65}/>}<small>Scan using your phone's camera, or <Link href="/demo/scan">open our QR scanner</Link>. A phone needs the website deployed at a public HTTPS address; localhost only works on this computer.</small></div>
      {botQr&&invite.telegramUrl&&<div className="connect-qr"><img src={botQr} alt="Scannable code that opens the real Telegram opt-in bot" width={160} height={160}/><small>Or scan this code to open your real Telegram bot and choose to start the conversation. Sample candidate, real Telegram messages.</small></div>}
      <div className="connect-link"><code>{invite.url}</code><button onClick={async()=>{try{await navigator.clipboard.writeText(invite.url);setNotice('Link copied.')}catch{setNotice('Copy is unavailable here. Select the link and copy it manually.')}}}><Copy size={16}/> Copy link</button></div>
      <div className="connect-actions"><a className="button button-secondary" href={invite.url} target="_blank" rel="noopener noreferrer">Open passport <ExternalLink size={16}/></a>{invite.telegramUrl?<a className="button button-secondary" href={invite.telegramUrl} target="_blank" rel="noopener noreferrer">Open Telegram <MessageCircle size={16}/></a>:<span className="connect-mode-note">Live Telegram is not connected yet. Set up BotFather, shared storage and the webhook; no message has been sent.</span>}</div>
      <div className="connect-context"><strong>{invite.mode==='shared'?'Shared responses enabled · live refresh every 6 seconds':'Browser-only preview'}</strong><p>{invite.mode==='shared'?'Replies can appear on another device. The candidate still has to open the link and choose to respond.':'Replies are saved only in this browser. A phone or another browser will not sync until shared storage is connected.'}</p></div>
      <div className="demo-form-actions"><button type="button" className="button button-secondary" onClick={refresh}><RefreshCw size={15}/> Check response</button>{<button type="button" className="button button-jade" onClick={()=>{if(invite.mode==='shared'){setSamplePreview(true);setNotice('Showing a fictional preview on this screen only. Shared storage was not changed, and no Telegram message was sent.');return;}const updated:Invitation={...invite.invitation,reply:{interest:'interested',workMode:'hybrid',note:'Fictional demo: I would like to learn more about this open role and the team.',source:'passport',repliedAt:new Date().toISOString()}};saveLocalInvitation(updated);setInvite({...invite,invitation:updated});setRecords(readLocalInvitations());setNotice('Sample candidate response saved in this browser. This is not a real Telegram message.')}}>Show sample candidate reply</button>}</div>
      {(invite.invitation.reply||samplePreview)?<div className="connect-response"><CheckCircle2 size={18}/><div><strong>{!invite.invitation.reply&&samplePreview?'Fictional preview — not sent':invite.invitation.token.startsWith('demo-presentation-')?'Prepared fictional response':'Candidate replied'}</strong><p>Interest: {(invite.invitation.reply?.interest||'interested').replaceAll('_',' ')} · Work style: {(invite.invitation.reply?.workMode||'hybrid').replaceAll('_',' ')}</p>{(invite.invitation.reply?.note||(!invite.invitation.reply&&samplePreview?'Fictional example: I would like to learn more about this job and hybrid working.':''))&&<p>Note: {invite.invitation.reply?.note||'Fictional example: I would like to learn more about this job and hybrid working.'}</p>}<small>{!invite.invitation.reply&&samplePreview?'Screen-only example. Not from Telegram or another device.':invite.invitation.reply?.source==='telegram'?'From Telegram · Candidate statement, not independently verified':'From passport · Candidate statement, not independently verified'}</small></div></div>:<p className="page-footnote">No response yet. The person can decide whether to reply.</p>}
    </>}
    {notice&&<p className="p3-feedback" role="status">{notice}</p>}
   </section>
  </div>
  {records.length>0&&<section className="white-panel connect-panel connect-history"><span className="small-eyebrow">YOUR RECENT INVITATIONS</span><h2>Pick up where you left off.</h2><div className="connect-history-items">{[...records].reverse().slice(0,6).map(r=><button type="button" onClick={()=>void showInvite(r)} key={r.token}><span><strong>{candidates.find(c=>c.id===r.candidateId)?.alias} · {roles.find(t=>t.id===r.roleId)?.title}</strong><small>{r.reply?(r.token.startsWith('demo-presentation-')?'Fictional example reply':'Response saved'):'Waiting for a response'} · Open invitation</small></span><ArrowRight size={16}/></button>)}</div></section>}
  <section className="live-connect-banner"><div><span className="small-eyebrow">NEW · PROOFMATCH LIVEROOM</span><h2>Want to schedule a real conversation?</h2><p>Pick a date and time, show the Telegram-style invitation, let your candidate respond, then demonstrate the two-person chat—all in demo mode.</p></div><Link className="button button-jade" href={`/demo/meetings?candidate=${candidateId}&role=${roleId}`}><CalendarClock size={17}/> Schedule a LiveRoom</Link></section>
  <section className="white-panel connect-panel connect-next"><ClipboardCheck size={30}/><div><h2>Ready for the next conversation?</h2><p>Prepare a few fair, job-related interview questions based on what we've found—and what we haven't.</p></div><Link href={`/demo/interview?candidate=${candidateId}&role=${roleId}`} className="button button-jade">Prepare questions <ArrowRight size={16}/></Link></section>
  <p className="page-footnote">This competition demo uses fictional candidates. QR codes contain working fictional job links. Real Telegram messaging and cross-device replies require your own Telegram bot, shared storage, deployment, and webhook; see CONNECT_SETUP.md. The connection check above reports what is actually ready.</p>
 </main>;
}

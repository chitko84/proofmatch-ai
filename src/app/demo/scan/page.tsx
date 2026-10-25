'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,Camera,CheckCircle2,ImageUp,Link2,ScanLine,ShieldCheck,Square} from 'lucide-react';
import {demoInvitationUrl,parseInvitationQr,type ParsedInvitationLink} from '@/lib/qr-scan';

type NativeQRDetector = { detect: (source: HTMLVideoElement|ImageBitmap)=>Promise<Array<{rawValue:string}>> };
type NativeDetectorConstructor = new (options:{formats:string[]})=>NativeQRDetector;
function barcodeDetector():NativeDetectorConstructor|undefined {
 return (globalThis as unknown as {BarcodeDetector?:NativeDetectorConstructor}).BarcodeDetector;
}
export default function ScanPage(){
 const [telegramBotName,setTelegramBotName]=useState('');
 const video=useRef<HTMLVideoElement>(null),stream=useRef<MediaStream|null>(null),raf=useRef<number|null>(null),active=useRef(false),busyFrame=useRef(false);
 const [cameraOn,setCameraOn]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[typed,setTyped]=useState(''),[result,setResult]=useState<ParsedInvitationLink|null>(null),[hasDetector,setHasDetector]=useState<boolean|null>(null);
 const stopCamera=useCallback(()=>{active.current=false;if(raf.current!==null){cancelAnimationFrame(raf.current);raf.current=null}stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;if(video.current){video.current.pause();video.current.srcObject=null}setCameraOn(false)},[]);
 useEffect(()=>{setHasDetector(Boolean(barcodeDetector()));
  void fetch('/api/connect/diagnostics',{cache:'no-store'}).then(r=>r.json()).then((d:{botName?:string;botVerified?:boolean})=>{if(d.botVerified&&d.botName)setTelegramBotName(d.botName)}).catch(()=>{});
  return()=>stopCamera()},[stopCamera]);
 const read=useCallback((value:string)=>{try{const invitation=parseInvitationQr(value,window.location.origin,telegramBotName);setResult(invitation);setError('');setNotice('Invitation found! Review the details below before opening it.');stopCamera()}catch(e){setResult(null);setError(e instanceof Error?e.message:'We could not read that code.')}},[stopCamera,telegramBotName]);
 const startCamera=async()=>{
   setError('');setNotice('');setResult(null);
   const Detector=barcodeDetector();
   if(!Detector){setError('This browser does not support camera QR scanning here. Use your phone camera, upload a QR image, or try a sample code instead.');return}
   if(!navigator.mediaDevices?.getUserMedia){setError('Camera access needs HTTPS or localhost. You can still upload a QR picture.');return}
   try{
    const feed=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}}});
    stream.current=feed;active.current=true;setCameraOn(true);
    if(!video.current){stopCamera();return}
    video.current.srcObject=feed;await video.current.play();
    const detector=new Detector({formats:['qr_code']});
    const tick=async()=>{
      if(!active.current)return;
      if(video.current && video.current.readyState>=2 && !busyFrame.current){
        busyFrame.current=true;
        try{const codes=await detector.detect(video.current);if(codes[0]?.rawValue){read(codes[0].rawValue);return}}
        catch{setError('The camera could not read this frame. Try a brighter area or upload a QR image.');stopCamera();return}
        finally{busyFrame.current=false}
      }
      if(active.current)raf.current=requestAnimationFrame(()=>void tick());
    };raf.current=requestAnimationFrame(()=>void tick());
   }catch{setError('Camera access was not allowed or is unavailable. Try uploading a screenshot or using your phone camera.');stopCamera()}
 };
 async function readImage(file?:File){
   if(!file)return;setError('');setNotice('');setResult(null);
   const Detector=barcodeDetector();
   if(!Detector){setError('This browser cannot read QR images inside the app. Open the image using your phone camera or use the sample code below.');return}
   try{const bitmap=await createImageBitmap(file);try{const codes=await new Detector({formats:['qr_code']}).detect(bitmap);if(!codes[0]?.rawValue)throw Error('No QR code was found in that picture.');read(codes[0].rawValue)}finally{bitmap.close()}}
   catch(e){setError(e instanceof Error?e.message:'Could not scan the image. Try a clearer photo.');}
 }
 return <main className="workspace-page">
   <div className="page-title-row"><div><span className="small-eyebrow">PROOFMATCH CONNECT · QR SCANNER</span><h1>Scan an opportunity.</h1><p>Use your camera, upload a QR picture, or try a sample. You can open ProofMatch invitations here, including scheduled LiveRoom invitations and your verified Telegram bot link.</p></div><ScanLine size={33}/></div>
   <div className="gentle-note prominent-note"><ShieldCheck size={18}/><span><strong>Safe by design:</strong> This scanner opens ProofMatch invitation pages and your verified Telegram bot only. Candidate names and job details in this demo are fictional.</span></div>
   <section className="white-panel connect-panel" style={{maxWidth:760,marginTop:20}}>
    <span className="small-eyebrow">STEP 1 · CHOOSE HOW TO SCAN</span>
    <div className="demo-form-actions">
     <button type="button" className="button button-jade" onClick={()=>void startCamera()} disabled={cameraOn}><Camera size={17}/> {cameraOn?'Camera is scanning…':'Scan with camera'}</button>
     <label className="button button-secondary" style={{cursor:'pointer',display:'inline-flex',gap:8,alignItems:'center'}}><ImageUp size={17}/> Upload QR picture<input aria-label="Upload QR picture" type="file" accept="image/*" style={{display:'none'}} onChange={e=>{void readImage(e.target.files?.[0]);e.currentTarget.value=''}}/></label>
     {cameraOn&&<button type="button" className="button button-secondary" onClick={stopCamera}><Square size={15}/> Stop camera</button>}
    </div>
    <video ref={video} playsInline muted aria-label="Live camera QR preview" style={{display:cameraOn?'block':'none',width:'100%',maxWidth:480,aspectRatio:'4 / 3',objectFit:'cover',borderRadius:16,margin:'16px auto'}} />
    {hasDetector===false&&<p className="page-footnote">Your browser may not support in-app QR detection. Your phone's normal camera can still scan the generated QR codes. Alternatively, try the sample below.</p>}
    <div style={{borderTop:'1px solid #e4ece8',paddingTop:18,marginTop:16}}>
     <span className="small-eyebrow">PRESENTATION SHORTCUT</span>
     <h2 style={{margin:'8px 0'}}>Try a working sample.</h2>
     <p className="page-footnote">This fills a fictional QR invitation. It does not pretend that a camera detected a code.</p>
     <button type="button" className="button button-secondary" onClick={()=>read(demoInvitationUrl(window.location.origin))}><CheckCircle2 size={16}/> Use sample QR invitation</button>
    </div>
    <div style={{borderTop:'1px solid #e4ece8',paddingTop:18,marginTop:16}}>
     <label htmlFor="scan-url">Already have an invitation link?</label>
     <input id="scan-url" value={typed} onChange={e=>setTyped(e.target.value)} placeholder="Paste your ProofMatch invitation link" style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #d8e5df',margin:'8px 0'}} />
     <button type="button" className="button button-secondary" onClick={()=>read(typed)} disabled={!typed.trim()}><Link2 size={16}/> Check link</button>
    </div>
    {error&&<p role="alert" className="connect-error">{error}</p>}
    {notice&&<p role="status" className="p3-feedback">{notice}</p>}
    {result&&<div className="connect-response" style={{marginTop:18}}><CheckCircle2 size={21}/><div><strong>{result.label}</strong><p>{result.mode==='shared'?'Private invitation: the candidate can reply from a different device when shared storage is connected.':result.mode==='telegram'?'This opens your verified Telegram bot; press Start to opt in.':'Fictional demo: the sample job and person will appear automatically.'}</p>{result.mode==='telegram'?<a href={result.url} target="_blank" rel="noopener noreferrer" className="button button-jade">Open Telegram <ArrowRight size={16}/></a>:<Link href={result.url} className="button button-jade">Open invitation <ArrowRight size={16}/></Link>}</div></div>}
   </section>
   <p className="page-footnote"><Link href="/demo/connect"><ArrowLeft size={14} style={{display:'inline'}}/> Back to opportunities</Link> · Use HTTPS for camera permission outside localhost.</p>
 </main>
}

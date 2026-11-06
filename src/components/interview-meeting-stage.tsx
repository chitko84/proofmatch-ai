'use client';
import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {ArrowLeft,ArrowRight,Check,ChevronDown,FileImage,FileText,MonitorUp,Presentation,ScreenShareOff,UploadCloud,Video,Volume2,Wifi,X} from 'lucide-react';
import {MAX_DECK_SIZE,MAX_SLIDES,pdfPageCount,sampleInterviewDeck,sanitizedDeck,type SavedDeck,type PresentationSlide} from '@/lib/interview-presentation';

type StageMode='interview'|'deck'|'screen';
type MeetingStageProps={deck:SavedDeck|null;onDeckChange:(deck:SavedDeck)=>void;onAskSlide:()=>void;accessCode:string;paused:boolean;interviewer:ReactNode};
const slideId=(n:number)=>`slide-${n+1}`;
const safeName=(name:string)=>name.replace(/[<>]/g,'').slice(0,180);

/** Real local device screen capture and browser slide preview. Nothing is streamed to a remote person or to the AI model. */
export default function InterviewMeetingStage({deck,onDeckChange,onAskSlide,accessCode,paused,interviewer}:MeetingStageProps){
 const [mode,setMode]=useState<StageMode>('interview');
 const [uploading,setUploading]=useState(false);
 const [notice,setNotice]=useState('');
 const [pdfURL,setPdfURL]=useState('');
 const [images,setImages]=useState<string[]>([]);
 const [screenActive,setScreenActive]=useState(false);
 const screenRef=useRef<HTMLVideoElement|null>(null);
 const streamRef=useRef<MediaStream|null>(null);
 const inputRef=useRef<HTMLInputElement|null>(null);
 const imageURLs=useRef<string[]>([]);
 const documentURL=useRef('');
 const selected=deck?.slides[deck.activeIndex];
 const shareEnd=useCallback(()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null;if(screenRef.current)screenRef.current.srcObject=null;setScreenActive(false);setMode(current=>current==='screen'?'interview':current)},[]);
 useEffect(()=>{if(paused&&streamRef.current)shareEnd()},[paused,shareEnd]);
 useEffect(()=>()=>{shareEnd();imageURLs.current.forEach(u=>URL.revokeObjectURL(u));if(documentURL.current)URL.revokeObjectURL(documentURL.current)},[shareEnd]);
 useEffect(()=>{if(screenActive&&screenRef.current&&streamRef.current){screenRef.current.srcObject=streamRef.current;screenRef.current.play().catch(()=>{})}},[screenActive,mode]);
 function releasePreview(){imageURLs.current.forEach(u=>URL.revokeObjectURL(u));imageURLs.current=[];if(documentURL.current)URL.revokeObjectURL(documentURL.current);documentURL.current='';setImages([]);setPdfURL('')}
 async function toggleScreen(){if(screenActive){shareEnd();return}if(paused){setNotice('Resume the interview before sharing a screen.');return}if(!navigator.mediaDevices?.getDisplayMedia){setNotice('Screen sharing needs HTTPS or localhost and a browser that supports screen capture.');return}
  try{const stream=await navigator.mediaDevices.getDisplayMedia({video:{frameRate:15},audio:false});streamRef.current=stream;stream.getVideoTracks()[0]?.addEventListener('ended',shareEnd,{once:true});setScreenActive(true);setMode('screen');setNotice('Your selected screen is visible in this practice room. No remote attendee receives the video. The AI cannot see screen pixels.')}catch(e){if((e as Error)?.name!=='NotAllowedError')setNotice('Unable to start screen capture. Check browser permissions.');else setNotice('Screen sharing was cancelled. You can continue your interview.')}}
 async function upload(files:FileList|null){if(!files?.length)return;const chosen=Array.from(files);setNotice('');setUploading(true);
  try{
   const picture=chosen.every(f=>/^image\/(png|jpeg|webp)$/i.test(f.type));
   if(chosen.length>1&&!picture)throw new Error('Choose one PDF or PowerPoint file, or several image slides.');
   if(chosen.length>MAX_SLIDES)throw new Error('Limit your presentation to 60 slides.');
   if(chosen.some(f=>f.size>MAX_DECK_SIZE||f.size===0))throw new Error('Each file must be under 10 MB.');
   let next:SavedDeck;
   if(picture){const newURLs=chosen.map(f=>URL.createObjectURL(f));releasePreview();imageURLs.current=newURLs;setImages(newURLs);const slides:PresentationSlide[]=chosen.map((f,i)=>({id:slideId(i),title:`Slide ${i+1}`,body:'',notes:''}));next={name:chosen.length===1?safeName(chosen[0].name):'My presentation',kind:'images',slides,activeIndex:0,visited:[0]};}
   else if(chosen[0].name.toLowerCase().endsWith('.pdf')){const file=chosen[0],bytes=new Uint8Array(await file.arrayBuffer());if(new TextDecoder('latin1').decode(bytes.subarray(0,5))!=='%PDF-')throw new Error('Select a valid PDF document.');const count=pdfPageCount(bytes);releasePreview();const url=URL.createObjectURL(file);documentURL.current=url;setPdfURL(url);const slides:PresentationSlide[]=Array.from({length:count},(_,i)=>({id:slideId(i),title:`Slide ${i+1}`,body:'',notes:''}));next={name:safeName(file.name),kind:'pdf',slides,activeIndex:0,visited:[0]};}
   else if(chosen[0].name.toLowerCase().endsWith('.pptx')){const form=new FormData();form.append('file',chosen[0]);const response=await fetch('/api/career/interview/presentation',{method:'POST',headers:accessCode?{'x-demo-access-code':accessCode}:{},body:form});const payload=await response.json() as {error?:string;slides?:PresentationSlide[]};if(!response.ok||!payload.slides?.length)throw new Error(payload.error||'PowerPoint could not be opened.');releasePreview();next=sanitizedDeck({name:safeName(chosen[0].name),kind:'pptx',slides:payload.slides,activeIndex:0,visited:[0]});setNotice('PowerPoint slide text is available for coaching. For original PowerPoint design and animations, open your file and use Share screen.');}
   else throw new Error('Upload PDF, PowerPoint (.pptx) or PNG/JPG/WEBP images.');
   onDeckChange(next);setMode('deck');
  }catch(e){setNotice(e instanceof Error?e.message:'Could not open presentation.');}finally{setUploading(false);if(inputRef.current)inputRef.current.value=''}
 }
 function loadSampleSlides(){if(deck&&!window.confirm('Replace the current presentation with the sample slides?'))return;releasePreview();onDeckChange(sampleInterviewDeck());setMode('deck');setNotice('Presentation loaded. Edit the speaker notes, change slides, and ask Mira about any slide.')}
 function goto(index:number){if(!deck)return;const bounded=Math.max(0,Math.min(deck.slides.length-1,index));onDeckChange({...deck,activeIndex:bounded,visited:Array.from(new Set([...deck.visited,bounded]))})}
 function changeNotes(value:string){if(!deck)return;onDeckChange({...deck,slides:deck.slides.map((s,i)=>i===deck.activeIndex?{...s,notes:value.slice(0,1200)}:s)})}
 return <div className="ci-meet-wrap">
  <div className="ci-meet-toolbar" role="toolbar" aria-label="Meeting presentation controls">
   <button type="button" aria-pressed={mode==='interview'} onClick={()=>setMode('interview')}><Video size={15}/> Interviewer</button>
   <button type="button" aria-pressed={mode==='deck'} onClick={()=>{if(deck)setMode('deck');else inputRef.current?.click()}}><Presentation size={15}/> Slides {deck?<span className="ci-deck-count">{deck.slides.length}</span>:null}</button>
   <button type="button" className={screenActive?'is-live':''} aria-pressed={screenActive} onClick={toggleScreen} disabled={paused}>{screenActive?<><ScreenShareOff size={15}/> Stop share</>:<><MonitorUp size={15}/> Share screen</>}</button>
   <button type="button" className="ci-sample-slides" disabled={uploading} onClick={loadSampleSlides}><Presentation size={15}/> Fill with sample data</button>
   <button className="ci-meet-upload" type="button" title="Add a presentation" aria-label="Upload presentation" disabled={uploading} onClick={()=>inputRef.current?.click()}><UploadCloud size={16}/></button>
   <input ref={inputRef} className="ci-file-hidden" type="file" aria-label="Presentation files" accept=".pptx,.pdf,image/png,image/jpeg,image/webp" multiple onChange={e=>upload(e.target.files)}/>
  </div>
  {notice&&<div role="status" className="ci-meet-notice"><span>{notice}</span><button type="button" aria-label="Dismiss presentation notice" onClick={()=>setNotice('')}><X size={13}/></button></div>}
  {uploading&&<div className="ci-meet-loading" role="status"><span className="ci-spinner"/> Opening presentation…</div>}
  {mode==='interview'&&<div className="ci-meeting-avatar">{interviewer}</div>}
  {mode==='screen'&&<div className="ci-share-surface">
    <div className="ci-share-eyebrow"><span className="ci-live-dot"/> LOCAL SCREEN PREVIEW</div>
    <video ref={screenRef} className="ci-shared-video" autoPlay muted playsInline aria-label="Preview of the screen you selected"/>
    <div className="ci-share-caption"><MonitorUp size={15}/> Sharing your screen in the practice room <span>Not sent to Mira</span></div>
   </div>}
  {mode==='deck'&&deck&&selected&&<div className="ci-presenter">
   <div className="ci-presenter-heading"><span><Presentation size={15}/> PRESENTATION</span><strong title={deck.name}>{deck.name}</strong></div>
   <div className="ci-slide-canvas" aria-label={`Slide ${deck.activeIndex+1}: ${selected.title}`}>
    {deck.kind==='pdf'?(pdfURL?<iframe key={deck.activeIndex} title={`PDF slide ${deck.activeIndex+1}`} src={`${pdfURL}#page=${deck.activeIndex+1}&toolbar=0&navpanes=0&view=FitH`}/>:<div className="ci-slide-placeholder"><FileText size={36}/><strong>Presentation preview not restored</strong><p>Choose the PDF again to see its pages. Your saved notes are still here.</p><button type="button" onClick={()=>inputRef.current?.click()}>Reopen PDF</button></div>):
    deck.kind==='images'?(images[deck.activeIndex]?<img src={images[deck.activeIndex]} alt={`Uploaded slide ${deck.activeIndex+1}`} className="ci-uploaded-slide"/>:<div className="ci-slide-placeholder"><FileImage size={36}/><strong>Reopen your image slides</strong><p>Your speaker notes and slide navigation are saved.</p><button type="button" onClick={()=>inputRef.current?.click()}>Choose images</button></div>):
    <div className="ci-pptx-preview"><span>SLIDE {String(deck.activeIndex+1).padStart(2,'0')}</span><h3>{selected.title}</h3><p>{selected.body||'This slide has no extractable text. Share the PowerPoint window for its full visual layout.'}</p><small>PowerPoint content preview · Visual formatting may differ</small></div>}
   </div>
   <div className="ci-slide-nav"><button type="button" onClick={()=>goto(deck.activeIndex-1)} disabled={deck.activeIndex===0} aria-label="Previous slide"><ArrowLeft size={18}/></button><label>Slide <select aria-label="Go to slide" value={deck.activeIndex} onChange={e=>goto(Number(e.target.value))}>{deck.slides.map((s,i)=><option key={s.id} value={i}>{i+1}. {s.title.slice(0,26)}</option>)}</select> / {deck.slides.length}</label><button type="button" onClick={()=>goto(deck.activeIndex+1)} disabled={deck.activeIndex===deck.slides.length-1} aria-label="Next slide"><ArrowRight size={18}/></button></div>
   <div className="ci-speaker-notes"><label htmlFor="ci-slide-notes">Speaker notes <small>Help Mira ask relevant questions</small></label><textarea id="ci-slide-notes" value={selected.notes} onChange={e=>changeNotes(e.target.value)} maxLength={1200} rows={3} placeholder="Describe what this slide shows, your reasoning, results, or key message…"/><div><small>{selected.notes.length}/1200 · Saved with your interview</small><button type="button" onClick={onAskSlide} disabled={paused}><Volume2 size={14}/> Ask about this slide</button></div></div>
   <div className="ci-deck-thumbs" aria-label="Slide progress">{deck.slides.map((s,i)=><button type="button" key={s.id} aria-label={`Go to slide ${i+1}`} aria-current={i===deck.activeIndex?'step':undefined} title={s.title} onClick={()=>goto(i)} className={i===deck.activeIndex?'selected':deck.visited.includes(i)?'visited':''}>{deck.visited.includes(i)?<Check size={10}/>:i+1}</button>)}</div>
   </div>}
  {mode==='deck'&&!deck&&<div className="ci-no-deck"><Presentation size={42}/><h2>Present your work</h2><p>Upload PDF, PowerPoint or image slides, or share a window directly.</p><div className="ci-empty-slide-actions"><button type="button" onClick={()=>inputRef.current?.click()}>Choose slides</button><button type="button" onClick={loadSampleSlides}>Fill with sample data</button></div></div>}
  {(mode==='deck'||mode==='screen')&&<div className="ci-meeting-mini"><span className="ci-mini-pulse"><Wifi size={17}/></span><div><strong>Mira</strong><small>AI interview coach · listening to your answers</small></div></div>}
  <p className="ci-stage-privacy">{mode==='screen'?'Screen video stays on this device. The AI cannot inspect the display.':mode==='deck'?'Slide text and speaker notes may be used for coaching when you submit an answer.':'A meeting-style practice with an AI interviewer, not a call with a human recruiter.'}</p>
 </div>;
}

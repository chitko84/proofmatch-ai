'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,ChevronRight,Compass,Expand,Focus,Gamepad2,Headphones,Keyboard,MapPin,Maximize2,MousePointer2,Gauge,RotateCcw,Sparkles,Volume2,VolumeX,X} from 'lucide-react';
import {careerWorlds,scoreWorld,worldById,worldPositionBlocked,isCompanyElevator,type WorldKind,type WorldMission,type WorldPoint} from '@/lib/career-worlds';
import {buildCareerWorldGeometry,makePersonGeometry,type Vertex3,type WorldFace,type WorldCamera} from '@/lib/career-world-geometry';
import {companyEmployeeFor,employeeResponse,type EmployeeTopic} from '@/lib/company-people';
import {HrManagerDialogue} from './hr-manager-dialogue';
import {HR_STORY_STORAGE_KEY,getHrStory,safeHrResults,type HrStoryResult} from '@/lib/hr-manager-story';
import {PremiumWorldRenderer} from './premium-world-webgl';
import './interactive-career-world.css';

type Camera=WorldCamera;
type Vertex=Vertex3;
type Quad=WorldFace;
type Projected={x:number;y:number;z:number};
type PointHit={id:string;x:number;y:number;distance:number};
const clamp=(v:number,min:number,max:number)=>Math.min(max,Math.max(min,v));
const startCam=():Camera=>({x:0,z:6.9,yaw:Math.PI,pitch:-.045});
function rgba(color:string,alpha:number){if(!/^#[0-9a-f]{6}$/i.test(color))return color;return `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${alpha})`}
function shade(color:string,multiplier:number){if(!/^#[0-9a-f]{6}$/i.test(color))return color;const nums=[1,3,5].map(i=>clamp(Math.round(parseInt(color.slice(i,i+2),16)*multiplier),0,255));return `rgb(${nums.join(',')})`}
function projection([x,y,z]:Vertex,camera:Camera,w:number,h:number):Projected|null{
 const dx=x-camera.x,dz=z-camera.z,forward=dx*Math.sin(camera.yaw)+dz*Math.cos(camera.yaw),side=dx*Math.cos(camera.yaw)-dz*Math.sin(camera.yaw);
 if(forward<.13)return null;
 const focal=h*.675,sy=(y-1.66)*Math.cos(camera.pitch)-forward*Math.sin(camera.pitch);
 const depth=(y-1.66)*Math.sin(camera.pitch)+forward*Math.cos(camera.pitch);
 if(depth<.13)return null;
 return {x:w/2+(side/depth)*focal,y:h*.5-(sy/depth)*focal,z:depth};
}
function drawWorld(ctx:CanvasRenderingContext2D,w:number,h:number,camera:Camera,geometry:Quad[],points:WorldPoint[],time:number,accent:string):PointHit[]{
 const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#09182c');bg.addColorStop(.55,'#132f42');bg.addColorStop(1,'#0c2031');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 const sorted:{p:Projected[];color:string;depth:number;glow?:boolean}[]=[];
 for(const face of geometry){const p=face.vertices.map(v=>projection(v,camera,w,h));if(p.some(v=>v===null))continue;const vertices=p as Projected[];const depth=vertices.reduce((s,v)=>s+v.z,0)/vertices.length;if(depth>35)continue;sorted.push({p:vertices,color:shade(face.color,face.light??1),depth,glow:face.glow})}
 sorted.sort((a,b)=>b.depth-a.depth);
 for(const item of sorted){const v=item.p;ctx.beginPath();ctx.moveTo(v[0].x,v[0].y);for(let i=1;i<v.length;i++)ctx.lineTo(v[i].x,v[i].y);ctx.closePath();ctx.fillStyle=item.color;ctx.fill();ctx.strokeStyle=item.glow?rgba(accent,.52):'rgba(126,195,197,.075)';ctx.lineWidth=item.glow?1.25:.55;ctx.stroke()}
 // Scene atmosphere, reticle and distant volumetric lighting.
 const fog=ctx.createRadialGradient(w/2,h*.38,20,w/2,h*.5,w*.78);fog.addColorStop(0,'rgba(51,131,159,0)');fog.addColorStop(1,'rgba(2,12,25,.35)');ctx.fillStyle=fog;ctx.fillRect(0,0,w,h);
 const hits:PointHit[]=[];
 for(const p of points){const screen=projection([p.x,2.5,p.z],camera,w,h);if(!screen||screen.z>22)continue;const dist=Math.hypot(p.x-camera.x,p.z-camera.z);if(screen.x<-130||screen.x>w+130||screen.y<-100||screen.y>h+100)continue;hits.push({id:p.id,x:screen.x,y:screen.y,distance:dist});const near=dist<3.3;const radius=clamp(24/screen.z,3,17);ctx.strokeStyle=rgba(p.accent,near ? .95 : .45);ctx.lineWidth=near?2.5:1.5;ctx.beginPath();ctx.arc(screen.x,screen.y,radius+7+Math.sin(time/400)*1.5,0,Math.PI*2);ctx.stroke();ctx.fillStyle=rgba(p.accent,near ? .83 : .5);ctx.beginPath();ctx.arc(screen.x,screen.y,radius,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font=`${near?'bold ':''}${clamp(17/screen.z+9,9,14)}px system-ui`;ctx.shadowColor='#001925';ctx.shadowBlur=5;ctx.fillText(p.name,screen.x,screen.y-radius-15);ctx.shadowBlur=0}
 const cx=w/2,cy=h/2;ctx.strokeStyle='rgba(209,255,247,.63)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(cx-13,cy);ctx.lineTo(cx-5,cy);ctx.moveTo(cx+5,cy);ctx.lineTo(cx+13,cy);ctx.moveTo(cx,cy-13);ctx.lineTo(cx,cy-5);ctx.moveTo(cx,cy+5);ctx.lineTo(cx,cy+13);ctx.stroke();return hits;
}
function drawWorldMarkers(ctx:CanvasRenderingContext2D,w:number,h:number,camera:Camera,points:WorldPoint[],time:number):PointHit[]{
 ctx.clearRect(0,0,w,h);
 const hits:PointHit[]=[];
 for(const p of points){
  const screen=projection([p.x,2.55,p.z],camera,w,h);
  if(!screen||screen.z>23||screen.x<-170||screen.x>w+170||screen.y<-110||screen.y>h+110)continue;
  const dist=Math.hypot(p.x-camera.x,p.z-camera.z);
  const near=dist<3.35,rad=near?17:13;
  hits.push({id:p.id,x:screen.x,y:screen.y,distance:dist});
  ctx.save();ctx.translate(screen.x,screen.y);
  const pulse=Math.sin(time*.003+p.x);
  ctx.shadowBlur=near?22:12;ctx.shadowColor=p.accent;
  ctx.strokeStyle=p.accent;ctx.lineWidth=near?2.8:1.6;
  ctx.beginPath();ctx.arc(0,0,rad+4+pulse*1.6,0,Math.PI*2);ctx.stroke();
  ctx.shadowBlur=0;ctx.fillStyle='rgba(7,22,35,.83)';ctx.beginPath();ctx.arc(0,0,rad,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=p.accent;ctx.beginPath();ctx.arc(0,0,4.2,0,Math.PI*2);ctx.fill();
  const name=p.name.length>27?p.name.slice(0,26)+'…':p.name;
  const size=near?12:11;ctx.font=`700 ${size}px system-ui, sans-serif`;
  const labelW=Math.min(225,ctx.measureText(name).width+25);
  ctx.fillStyle=near?'rgba(10,39,53,.96)':'rgba(10,29,43,.83)';
  ctx.strokeStyle=near?p.accent:'rgba(158,221,224,.4)';ctx.lineWidth=1;
  ctx.beginPath();ctx.roundRect(-labelW/2,-rad-35,labelW,26,7);ctx.fill();ctx.stroke();
  ctx.fillStyle='#edfffc';ctx.textAlign='center';ctx.fillText(name,0,-rad-18);
  if(near){ctx.fillStyle=p.accent;ctx.font='700 9px system-ui';ctx.fillText('E  ·  EXPLORE',0,rad+19);}
  ctx.restore();
 }
 // Minimal central interaction reticle.
 const cx=w/2,cy=h/2;ctx.save();ctx.strokeStyle='rgba(210,255,250,.8)';ctx.lineWidth=1.5;
 ctx.beginPath();ctx.moveTo(cx-16,cy);ctx.lineTo(cx-7,cy);ctx.moveTo(cx+7,cy);ctx.lineTo(cx+16,cy);
 ctx.moveTo(cx,cy-16);ctx.lineTo(cx,cy-7);ctx.moveTo(cx,cy+7);ctx.lineTo(cx,cy+16);ctx.stroke();
 ctx.fillStyle='rgba(213,255,246,.95)';ctx.beginPath();ctx.arc(cx,cy,1.7,0,Math.PI*2);ctx.fill();ctx.restore();
 return hits;
}
// Geometry is cached by mission. Moving between Company X floors should not rebuild thousands
// of faces every time a judge clicks the elevator or building directory.
const worldGeometryCache=new Map<string,Quad[]>();
function getWorldGeometry(mission:WorldMission,kind:WorldKind):Quad[]{
 const key=`${kind}:${mission.id}`;
 let mesh=worldGeometryCache.get(key);
 if(!mesh){mesh=buildCareerWorldGeometry(mission,kind);worldGeometryCache.set(key,mesh);}
 return mesh;
}
const titles:Record<WorldKind,string>={company:'Company X · Open-World Office',simulator:'HR Manager Simulator · Open Office',crisis:'HR Manager Simulator'};
const subtitles:Record<WorldKind,string>={company:'Walk your own character through four floors. Meet employees and discover how they work.',simulator:'Explore a bigger HR office world with interview rooms, a reception zone, learning spaces and employee conversations.',crisis:'Step into an HR manager’s workday.'};
export function InteractiveCareerWorld({kind}:{kind:WorldKind}){
 const missions=careerWorlds[kind];const [missionId,setMissionId]=useState(missions[0].id);const mission=worldById(kind,missionId);const [active,setActive]=useState<WorldPoint|null>(null);const [response,setResponse]=useState<{id:string;message:string;correct:boolean}|null>(null);const [answers,setAnswers]=useState<Record<string,boolean>>({});const [visited,setVisited]=useState<string[]>([]);const [sound,setSound]=useState(false);const [conversationTopic,setConversationTopic]=useState<EmployeeTopic|null>(null);const [conversationFollowUp,setConversationFollowUp]=useState(false);const [thirdPerson,setThirdPerson]=useState(kind==='company'||kind==='simulator');const [tip,setTip]=useState('WASD to move · Drag to look · E to interact');const [focus,setFocus]=useState<WorldPoint|null>(null);const [fullscreen,setFullscreen]=useState(false);const [travelingFloor,setTravelingFloor]=useState<string|null>(null);const travelTimers=useRef<number[]>([]);const [allVisited,setAllVisited]=useState(0);const [pointerLocked,setPointerLocked]=useState(false);const [player,setPlayer]=useState({x:0,z:6.9,yaw:Math.PI});const lastHud=useRef(0),nearbyStationId=useRef(''),overlayOpen=useRef(false);
 const sharedRenderer=useRef<PremiumWorldRenderer|null>(null);
 const [graphicsMode,setGraphicsMode]=useState<'auto'|'quality'|'performance'>('auto');
 const [hrResults,setHrResults]=useState<Record<string,HrStoryResult>>({});
 useEffect(()=>{if(kind!=='simulator')return;try{setHrResults(safeHrResults(JSON.parse(localStorage.getItem(HR_STORY_STORAGE_KEY)||'{}')))}catch{setHrResults({})}},[kind]);
 const avatarMemo=useRef<{x:number;z:number;yaw:number;phase:number;faces:Quad[]}|null>(null);
 const canvas=useRef<HTMLCanvasElement>(null),gpuCanvas=useRef<HTMLCanvasElement>(null),shell=useRef<HTMLDivElement>(null),cam=useRef<Camera>(startCam()),keyboard=useRef(new Set<string>()),touch=useRef(new Set<string>()),hits=useRef<PointHit[]>([]),geom=useRef<Quad[]>([]),drag=useRef<{x:number;y:number;active:boolean}>({x:0,y:0,active:false}),current=useRef(mission);
 current.current=mission;overlayOpen.current=Boolean(active)||travelingFloor!==null;
 useEffect(()=>{geom.current=getWorldGeometry(mission,kind);cam.current=startCam();nearbyStationId.current='';setPlayer({x:0,z:6.9,yaw:Math.PI});setActive(null);setConversationTopic(null);setConversationFollowUp(false);setResponse(null);setFocus(null);try{const saved=JSON.parse(localStorage.getItem(`proofmatch-world-${mission.id}`)||'{}') as {answers?:Record<string,boolean>;visited?:string[]};setAnswers(saved.answers&&typeof saved.answers==='object'?saved.answers:{});setVisited(Array.isArray(saved.visited)?saved.visited.filter(x=>mission.points.some(p=>p.id===x)):[])}catch{setAnswers({});setVisited([])}},[missionId,kind]);
 useEffect(()=>{if(kind!=='company')return;let total=0;for(const floor of missions){try{const saved=JSON.parse(localStorage.getItem(`proofmatch-world-${floor.id}`)||'{}') as {visited?:unknown};if(Array.isArray(saved.visited))total+=new Set(saved.visited.filter(v=>floor.points.some(p=>p.id===v&&!isCompanyElevator(p)))).size}catch{}}setAllVisited(total)},[kind,missions,missionId,visited]);
 useEffect(()=>()=>{travelTimers.current.forEach(window.clearTimeout)},[]);
 // Pre-warm the remaining floor meshes on idle slices. The current floor is always ready first.
 useEffect(()=>{
  if(kind!=='company')return;
  let cancelled=false;
  const remaining=missions.filter(m=>!worldGeometryCache.has(`${kind}:${m.id}`));
  let handle:number|undefined;
  const warm=()=>{if(cancelled)return;const next=remaining.shift();if(next)getWorldGeometry(next,kind);if(remaining.length)handle=window.setTimeout(warm,110);};
  handle=window.setTimeout(warm,550);
  return()=>{cancelled=true;if(handle!==undefined)window.clearTimeout(handle)};
 },[kind,missions]);

 const save=useCallback((a:Record<string,boolean>,v:string[])=>{try{localStorage.setItem(`proofmatch-world-${missionId}`,JSON.stringify({answers:a,visited:v,updatedAt:new Date().toISOString()}))}catch{}},[missionId]);
 const visit=useCallback((p:WorldPoint)=>{if(document.pointerLockElement)document.exitPointerLock();setActive(p);setConversationTopic(null);setConversationFollowUp(false);setResponse(null);if(isCompanyElevator(p))return;setVisited(old=>{if(old.includes(p.id))return old;const next=[...old,p.id];try{const state=JSON.parse(localStorage.getItem(`proofmatch-world-${missionId}`)||'{}');localStorage.setItem(`proofmatch-world-${missionId}`,JSON.stringify({...state,visited:next}))}catch{}return next})},[missionId]);
 useEffect(()=>{
  const changed=()=>setPointerLocked(document.pointerLockElement===canvas.current);
  const move=(e:MouseEvent)=>{if(document.pointerLockElement!==canvas.current||overlayOpen.current)return;
   cam.current.yaw+=e.movementX*.0023;cam.current.pitch=clamp(cam.current.pitch+e.movementY*.0017,-.37,.37);
  };
  document.addEventListener('pointerlockchange',changed);document.addEventListener('mousemove',move);
  return()=>{document.removeEventListener('pointerlockchange',changed);document.removeEventListener('mousemove',move);if(document.pointerLockElement===canvas.current)document.exitPointerLock();};
 },[]);
 const toggleMouseLook=()=>{const el=canvas.current;if(!el)return;if(document.pointerLockElement===el){document.exitPointerLock();return;}
  try{void el.requestPointerLock()}catch{setTip('Mouse capture is unavailable. Drag to look around instead.')} };
 const closest=useCallback(()=>{const camera=cam.current;let nearest:{p:WorldPoint;d:number}|undefined;for(const p of current.current.points){const d=Math.hypot(p.x-camera.x,p.z-camera.z);if(!nearest||d<nearest.d)nearest={p,d};}return nearest},[]);
 const interact=useCallback(()=>{const near=closest();if(near&&near.d<=3.35){visit(near.p)}else setTip('Move nearer to a glowing workstation, then press E.')},[closest,visit]);
 useEffect(()=>{const onDown=(e:KeyboardEvent)=>{if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes((e.target as HTMLElement)?.tagName||''))return;const k=e.key.toLowerCase();if('wasdqe'.includes(k)||k.startsWith('arrow')){keyboard.current.add(k);if(k==='e')interact();if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault()}if(k==='escape')setActive(null)};const onUp=(e:KeyboardEvent)=>keyboard.current.delete(e.key.toLowerCase());const onBlur=()=>keyboard.current.clear();window.addEventListener('keydown',onDown);window.addEventListener('keyup',onUp);window.addEventListener('blur',onBlur);return()=>{window.removeEventListener('keydown',onDown);window.removeEventListener('keyup',onUp);window.removeEventListener('blur',onBlur)}},[interact]);
 useEffect(()=>{
  const el=canvas.current,gpuEl=gpuCanvas.current;
  if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;
  // Retain the compiled GPU program between floor changes. Creating a new WebGL
  // context on each elevator ride used to create a noticeable click-to-scene delay.
  let renderer:PremiumWorldRenderer|null=sharedRenderer.current;
  const setupGPU=()=>{if(!gpuEl)return;try{
    if(sharedRenderer.current){sharedRenderer.current.setScene(kind,mission.accent,geom.current,mission.points);}
    else sharedRenderer.current=new PremiumWorldRenderer(gpuEl,kind,mission.accent,geom.current,mission.points);
    renderer=sharedRenderer.current;gpuEl.style.display='block';
   }catch(error){renderer=null;sharedRenderer.current=null;gpuEl.style.display='none';console.warn('Using compatibility career-world renderer',error)}
  };
  setupGPU();
  const onContextLost=(event:Event)=>{event.preventDefault();renderer=null;sharedRenderer.current=null;if(gpuEl)gpuEl.style.display='none';};
  const onContextRestored=()=>setupGPU();
  gpuEl?.addEventListener('webglcontextlost',onContextLost);
  gpuEl?.addEventListener('webglcontextrestored',onContextRestored);
  let raf=0,last=0,lastDraw=0;
  // Adaptive resolution adjusts only after sustained rendering pressure; quick interactions
  // stay at desktop frame rates while weaker GPUs avoid expensive oversized canvases.
  let quality=1,frameCost=0,frameIntervals=0,frameSamples=0,lastQualityUpdate=0;
  const resize=()=>{const rect=el.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,1.35);
   el.width=Math.max(1,Math.round(rect.width*dpr));el.height=Math.max(1,Math.round(rect.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  const observer=new ResizeObserver(resize);observer.observe(el);resize();
  const tick=(now:number)=>{
   if(document.hidden){last=now;raf=requestAnimationFrame(tick);return;}
   const input=keyboard.current,touchInput=touch.current;
   const isMoving=['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].some(key=>input.has(key)||touchInput.has(key));
   const isLooking=drag.current.active||document.pointerLockElement===el;
   const fastMode=graphicsMode==='performance';
   const frameBudget=1000/(renderer?(overlayOpen.current?10:isMoving||isLooking?(fastMode?45:60):(fastMode?18:24)):(overlayOpen.current?9:isMoving||isLooking?34:15));
   if(now-lastDraw<frameBudget){raf=requestAnimationFrame(tick);return;}
   const actualFrameInterval=lastDraw?now-lastDraw:frameBudget;
   lastDraw=now;
   const delta=Math.min((now-last)/1000||.016,.05);last=now;
   const c=cam.current,k=keyboard.current,t=touch.current;const has=(s:string)=>k.has(s)||t.has(s);
   const move=(overlayOpen.current?0:(has('w')||has('arrowup')?1:0)-(has('s')||has('arrowdown')?1:0)),strafe=(overlayOpen.current?0:(has('d')?1:0)-(has('a')?1:0)),turn=(has('arrowright')?1:0)-(has('arrowleft')?1:0);
   c.yaw+=turn*delta*1.7;const speed=3.25*delta;
   const norm=Math.max(1,Math.hypot(move,strafe));
   const dx=(Math.sin(c.yaw)*move+Math.cos(c.yaw)*strafe)*speed/norm,dz=(Math.cos(c.yaw)*move-Math.sin(c.yaw)*strafe)*speed/norm;
   const nx=clamp(c.x+dx,-7.1,7.1),nz=clamp(c.z+dz,-9.1,9.1);
   if(!worldPositionBlocked(nx,c.z,current.current))c.x=nx;
   if(!worldPositionBlocked(c.x,nz,current.current))c.z=nz;
   // An idle HUD must not trigger React renders four times per second.
   if((isMoving||isLooking||turn!==0)&&now-lastHud.current>120){lastHud.current=now;setPlayer(old=>Math.abs(old.x-c.x)+Math.abs(old.z-c.z)+Math.abs(old.yaw-c.yaw)<.008?old:{x:c.x,z:c.z,yaw:c.yaw})}
   const w=el.clientWidth,h=el.clientHeight;
   if(w&&h){
    const overShoulder=(kind==='company'||kind==='simulator')&&thirdPerson;
    const followCamera=overShoulder?{...c,x:clamp(c.x-Math.sin(c.yaw)*2.80,-7.70,7.70),z:clamp(c.z-Math.cos(c.yaw)*2.80,-9.70,9.70),pitch:clamp(c.pitch-.08,-.38,.30)}:c;
    const walking=Math.abs(move)+Math.abs(strafe)>.01;
    const phase=walking?Math.floor(now/80):0;
    const cached=avatarMemo.current;
    const avatar=overShoulder?(cached&&cached.x===c.x&&cached.z===c.z&&cached.yaw===c.yaw&&cached.phase===phase
     ?cached.faces:(()=>{const faces=makePersonGeometry(c.x,c.z,c.yaw,{shirt:kind==='simulator'?'#526a80':'#46c6a1',skin:'#b98362',trousers:'#1e344d',hair:'#1d2834'},walking?phase*.96:0);avatarMemo.current={x:c.x,z:c.z,yaw:c.yaw,phase,faces};return faces;})()):undefined;
    if(renderer){
     const renderStart=performance.now();
     const maxDpr=Math.min(window.devicePixelRatio||1,graphicsMode==='quality'?2:graphicsMode==='performance'?1:1.65);
     renderer.render(followCamera,now,w,h,Math.max(.75,maxDpr*quality),avatar,graphicsMode);
     const elapsed=performance.now()-renderStart;
     if(isMoving||isLooking){
      frameCost+=elapsed;frameIntervals+=actualFrameInterval;frameSamples++;
     }
     if(frameSamples>=24&&now-lastQualityUpdate>1100){
      const averageCost=frameCost/frameSamples;
      const averageInterval=frameIntervals/frameSamples;
      // GPU stalls may not appear as JavaScript render time. Use actual frame
      // cadence as well, and apply hysteresis before changing resolution.
      if(averageCost>15||averageInterval>29)quality=Math.max(.67,quality-.12);
      else if(averageCost<7&&averageInterval<20)quality=Math.min(1,quality+.055);
      lastQualityUpdate=now;frameCost=0;frameIntervals=0;frameSamples=0;
     }
     hits.current=drawWorldMarkers(ctx,w,h,followCamera,current.current.points,now);
    }
    else hits.current=drawWorld(ctx,w,h,followCamera,avatar?[...geom.current,...avatar]:geom.current,current.current.points,now,current.current.accent);
   }
   const target=closest();const stationId=target&&target.d<3.35?target.p.id:'';if(nearbyStationId.current!==stationId){nearbyStationId.current=stationId;setFocus(stationId?target!.p:null);}
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();gpuEl?.removeEventListener('webglcontextlost',onContextLost);gpuEl?.removeEventListener('webglcontextrestored',onContextRestored);};
 },[missionId,kind,closest,thirdPerson,graphicsMode]);
 // Dispose retained GPU buffers only when leaving the career game entirely.
 useEffect(()=>()=>{sharedRenderer.current?.dispose();sharedRenderer.current=null},[]);
 useEffect(()=>{if(!sound||!active||typeof window==='undefined'||!window.speechSynthesis)return;window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(kind==='simulator'?(getHrStory(active.id)?.opening??active.details):active.details);utter.lang='en-US';utter.rate=.94;utter.volume=.8;window.speechSynthesis.speak(utter);return()=>window.speechSynthesis.cancel()},[active,sound]);
 const choose=(index:number)=>{if(!active?.task)return;const opt=active.task.choices[index];if(!opt)return;const next={...answers,[active.id]:opt.correct};setAnswers(next);save(next,visited);setResponse({id:active.id,message:opt.effect,correct:opt.correct})};
 const resolveHrStory=useCallback((id:string,result:HrStoryResult)=>{setHrResults(old=>{const next={...old,[id]:result};try{localStorage.setItem(HR_STORY_STORAGE_KEY,JSON.stringify(next))}catch{}return next});if(mission.points.some(p=>p.id===id&&p.task)){const next={...answers,[id]:result.good};setAnswers(next);save(next,visited)}},[answers,mission,save,visited]);
 const score=scoreWorld(answers,mission);const companyStations=mission.points.filter(p=>!isCompanyElevator(p));const companyVisited=visited.filter(id=>companyStations.some(p=>p.id===id)).length;const progress=kind==='company'?`${companyVisited} / ${companyStations.length} locations`: `${Object.keys(hrResults).length} / ${mission.points.length} conversations`;
 const totalCompanyFloors=kind==='company'?missions.length:0;
 const totalCompanyStations=kind==='company'?missions.reduce((sum,m)=>sum+m.points.filter(p=>!isCompanyElevator(p)).length,0):0;
 const buildingName=kind==='company'?'Company X Tower':'';
 const reset=()=>{if(kind==='simulator'){setHrResults({});try{localStorage.removeItem(HR_STORY_STORAGE_KEY)}catch{}}setAnswers({});setVisited([]);setActive(null);setConversationTopic(null);setConversationFollowUp(false);setResponse(null);save({},[]);cam.current=startCam();setTip('Experience restarted. Explore the highlighted workstations.')};
 const switchMission=(id:string)=>{if(!missions.some(m=>m.id===id)||id===missionId||travelingFloor)return;if(kind!=='company'){setMissionId(id);setTip('New mission loaded. Move using WASD or the on-screen controls.');return;}
  if(document.pointerLockElement)document.exitPointerLock();keyboard.current.clear();touch.current.clear();setActive(null);setResponse(null);
  const destination=missions.find(m=>m.id===id)!;setTravelingFloor(destination.title);
  // Floor scene changes immediately; transition is cosmetic and never gates clicks.
  setMissionId(id);setTip(`Arrived at ${destination.field}. Explore this floor, or take the elevator to another level.`);
  const endTimer=window.setTimeout(()=>setTravelingFloor(null),105);travelTimers.current.push(endTimer);
 };
 const pointerDown=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(document.pointerLockElement===canvas.current)return;drag.current={x:e.clientX,y:e.clientY,active:true};e.currentTarget.setPointerCapture(e.pointerId)};
 const pointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{if(document.pointerLockElement===canvas.current||!drag.current.active)return;const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;cam.current.yaw+=dx*.0039;cam.current.pitch=clamp(cam.current.pitch+dy*.002,-.33,.33);drag.current.x=e.clientX;drag.current.y=e.clientY};
 const pointerUp=(e:React.PointerEvent<HTMLCanvasElement>)=>{drag.current.active=false;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)};
 const canvasClick=(e:React.MouseEvent<HTMLCanvasElement>)=>{const r=e.currentTarget.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const nearest=[...hits.current].filter(p=>Math.hypot(p.x-x,p.y-y)<42).sort((a,b)=>a.distance-b.distance)[0];if(nearest){if(nearest.distance<3.5){const pt=mission.points.find(p=>p.id===nearest.id);if(pt)visit(pt)}else setTip('Approach that station using WASD, then press E to interact.')}};
 const tapMove=(key:string)=>{const c=cam.current,speed=.5,m=key==='w'?1:key==='s'?-1:0,r=key==='d'?1:key==='a'?-1:0;const nx=clamp(c.x+(Math.sin(c.yaw)*m+Math.cos(c.yaw)*r)*speed,-7.1,7.1),nz=clamp(c.z+(Math.cos(c.yaw)*m-Math.sin(c.yaw)*r)*speed,-9.1,9.1);if(!worldPositionBlocked(nx,nz,mission)){c.x=nx;c.z=nz}};
 const openHrStation=(p:WorldPoint)=>{
  // Fast travel is optional; users can still roam using third-person movement and E.
  const c=cam.current;
  const candidates=[[p.x,p.z+1.65],[p.x+1.7,p.z],[p.x-1.7,p.z],[p.x,p.z-1.7]];
  const spot=candidates.find(([x,z])=>Math.abs(x)<7.1&&Math.abs(z)<9.1&&!worldPositionBlocked(x,z,mission));
  if(spot){c.x=spot[0];c.z=spot[1];c.yaw=Math.atan2(p.x-c.x,p.z-c.z);setPlayer({x:c.x,z:c.z,yaw:c.yaw});}
  visit(p);
 };
 const pad=(key:string,label:string)=> <button type="button" aria-label={label} onClick={()=>tapMove(key)} onPointerDown={e=>{e.preventDefault();touch.current.add(key);e.currentTarget.setPointerCapture(e.pointerId)}} onPointerUp={()=>touch.current.delete(key)} onPointerCancel={()=>touch.current.delete(key)} onLostPointerCapture={()=>touch.current.delete(key)}>{label}</button>;
 const toggleFull=async()=>{if(!shell.current)return;if(document.fullscreenElement){await document.exitFullscreen();setFullscreen(false)}else{try{await shell.current.requestFullscreen();setFullscreen(true)}catch{setTip('Fullscreen is not available in this browser.')}}};
 return <main className="workspace-page cw-page"><div className="cw-top"><Link href="/demo/career" className="cw-back"><ArrowLeft size={16}/> Career Experience</Link><span><Sparkles size={15}/> PROOFMATCH AI · IMMERSIVE EXPERIENCE</span></div><div className="cw-heading"><div><h1>{titles[kind]}</h1><p>{subtitles[kind]}</p></div></div>
 <div className="cw-mission-select"><div><span className="cw-eyebrow">YOUR ENVIRONMENT</span><h2>{mission.title}</h2><p>{mission.description}</p></div>{missions.length>1&&<label>{kind==='company'?'Choose floor':'Choose a mission'}<select value={missionId} onChange={e=>switchMission(e.target.value)}>{missions.map(m=><option key={m.id} value={m.id}>{m.title}</option>)}</select></label>}</div>
 {kind==='company'&&<section className="cw-building-grid" aria-label="Company building directory"><div className="cw-building-summary"><span className="cw-eyebrow">BUILDING OVERVIEW</span><h3>{buildingName}</h3><p>Explore the full office building floor by floor. Walk through four office floors, meet colleagues, ask about their jobs, and learn how the teams work together.</p><div className="cw-building-stats"><div><strong>{totalCompanyFloors}</strong><span>Floors</span></div><div><strong>{totalCompanyStations}</strong><span>Interactive spaces</span></div><div><strong>{allVisited}</strong><span>Places discovered</span></div></div>
 <div className="cw-tower-visual" aria-label="Interactive exterior of Company X Tower"><div className="cw-tower-caption">SELECT A FLOOR IN THE TOWER</div><div className="cw-tower-model"><div className="cw-tower-roof"><span>COMPANY X</span></div>{[...missions].reverse().map((m,reverseIndex)=>{const floor=missions.length-reverseIndex;return <button key={m.id} type="button" className={`cw-tower-floor ${missionId===m.id?'is-active':''}`} title={`Visit floor ${floor}: ${m.field}`} aria-label={`Visit floor ${floor}: ${m.field}`} aria-current={missionId===m.id?'location':undefined} onClick={()=>switchMission(m.id)}><span className="cw-tower-floor-id">{String(floor).padStart(2,'0')}</span><span className="cw-tower-windows" aria-hidden="true"><i/><i/><i/><i/><i/></span><span className="cw-tower-floor-name">{m.field.split('·').slice(1).join('·').trim()}</span></button>})}<div className="cw-tower-entrance" aria-hidden="true"><span/><span/></div></div><div className="cw-tower-plinth">LOBBY · FOUR LEVELS · MEET THE PEOPLE</div></div>
 </div><div className="cw-floor-directory"><span className="cw-eyebrow">FLOOR DIRECTORY</span><div className="cw-floor-list">{missions.map((m,index)=><button type="button" key={m.id} className={m.id===missionId?'is-active':undefined} onClick={()=>switchMission(m.id)}><span className="cw-floor-no">{index+1}</span><span className="cw-floor-copy"><strong>{m.field}</strong><small>{m.title.replace(/^Company X Tower —\s*/,'')}</small></span><ChevronRight size={16}/></button>)}</div></div></section>}
 {kind==='simulator'&&<div className="cw-hr-progress"><div><strong>HR LIFE · YOUR WORKDAY STORY</strong><small>Explore the office, talk with colleagues, and change each encounter through your decisions.</small></div><span>{Object.keys(hrResults).length} / {mission.points.length} stories complete</span></div>}
 <div className={`cw-stage cw-stage-${kind}`} ref={shell} style={{'--cw-accent':mission.accent} as React.CSSProperties}>
 <div className="cw-canvas-wrap"><canvas ref={gpuCanvas} className="cw-gpu-layer" aria-hidden="true"/><canvas className="cw-input-layer" ref={canvas} tabIndex={0} aria-label="Interactive 3D office. Move your character with WASD or touch controls, drag to turn, and press E to speak with nearby employees." onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onClick={canvasClick} onDoubleClick={toggleMouseLook}/><div className="cw-scanline" aria-hidden="true"/><div className="cw-cinematic-vignette" aria-hidden="true"/></div>
 <div className="cw-hud-top"><span className="cw-hud-brand"><i/> IMMERSIVE WORLD <small>{kind==='company'?`FLOOR ${missions.findIndex(m=>m.id===missionId)+1} / ${missions.length}`:mission.field.toUpperCase()}</small></span><div><span className="cw-hud-pill"><MapPin size={13}/> {progress}</span>{(kind==='company'||kind==='simulator')&&<button type="button" className="cw-perspective-toggle" aria-label={thirdPerson?'Switch to first-person camera':'Switch to third-person character camera'} title={thirdPerson?'First-person camera':'Third-person camera'} onClick={()=>setThirdPerson(v=>!v)}>{thirdPerson?'3RD PERSON':'1ST PERSON'}</button>}<button type="button" title={pointerLocked?"Release mouse cursor (Esc)":"Immersive mouse look"} aria-label={pointerLocked?"Release mouse cursor":"Capture mouse to look around"} onClick={toggleMouseLook}><MousePointer2 size={17}/></button><button type="button" className="cw-graphics-toggle" title={`Graphics: ${graphicsMode}. Click to switch between Auto, High and Performance.`} aria-label={`Graphics setting ${graphicsMode}`} onClick={()=>setGraphicsMode(mode=>mode==='auto'?'quality':mode==='quality'?'performance':'auto')}><Gauge size={15}/>{graphicsMode==='auto'?'AUTO':graphicsMode==='quality'?'HIGH':'FAST'}</button><button type="button" title="Reset camera" aria-label="Reset camera" onClick={()=>{cam.current=startCam()}}><Focus size={17}/></button><button type="button" aria-label={sound?'Mute narrator':'Enable narrator'} title="Narrator" onClick={()=>setSound(s=>!s)}>{sound?<Volume2 size={17}/>:<VolumeX size={17}/>}</button><button type="button" title="Fullscreen" aria-label="Toggle fullscreen" onClick={toggleFull}><Maximize2 size={17}/></button></div></div>
 <div className="cw-hud-bottom"><div><span className="cw-location">{mission.title}</span><span className="cw-status">{focus?`Near ${focus.name} · press E to interact`:tip}</span></div><div className="cw-minimap" aria-label="Relative position minimap"><span className="cw-map-person" style={{left:`${(player.x+8)/16*100}%`,top:`${(player.z+10)/20*100}%`,transform:`translate(-50%,-50%) rotate(${player.yaw-Math.PI}rad)`}}/>{mission.points.map(p=><i key={p.id} title={p.name} style={{left:`${(p.x+8)/16*100}%`,top:`${(p.z+10)/20*100}%`,background:p.accent}}/>)}</div></div>
 <div className="cw-touch-pad" aria-label="On-screen movement controls"><div>{pad('w','↑')}</div><div>{pad('a','←')}{pad('s','↓')}{pad('d','→')}<button type="button" className="cw-action" onClick={interact}>E · Interact</button></div></div>
 {travelingFloor&&<div className="cw-elevator-transition" role="status" aria-live="polite"><div className="cw-travel-symbol"><span/><span/><span/></div><span className="cw-eyebrow">ELEVATOR IN MOTION</span><strong>{travelingFloor}</strong><p>Moving through Company X Tower</p><div className="cw-travel-progress"><span/></div></div>}
 {focus&&!active&&!travelingFloor&&<button className="cw-interact" type="button" onClick={interact}><MousePointer2 size={17}/> {kind==='company'&&!isCompanyElevator(focus)?'Talk to':'Explore'} {focus.name} <ChevronRight size={17}/></button>}
 {active&&<div className="cw-overlay"><section className="cw-dialog" aria-label={active.name}><div className="cw-dialog-top"><div><span className="cw-eyebrow">{kind==='company'?'MEET THE TEAM':kind==='simulator'?'HR LIFE · STORY CONVERSATION':'YOUR ASSIGNMENT'}</span><h2>{active.name}</h2><small>{active.subtitle}</small></div><button type="button" aria-label="Close panel" onClick={()=>{setActive(null);setResponse(null)}}><X size={20}/></button></div><p className="cw-dialog-info">{active.details}</p>{kind==='company'&&isCompanyElevator(active)?<div className="cw-lift-destinations"><span className="cw-eyebrow">ELEVATOR · SELECT DESTINATION</span><div className="cw-lift-floor-grid">{missions.map((m,index)=><button type="button" key={m.id} className={m.id===missionId?'is-current':undefined} disabled={m.id===missionId||travelingFloor!==null} onClick={()=>switchMission(m.id)}><strong>{String(index+1).padStart(2,'0')}</strong><span>{m.field.split('·').slice(1).join('·').trim()}</span>{m.id===missionId?<small>Current floor</small>:<ChevronRight size={15}/>}</button>)}</div></div>:kind==='simulator'&&getHrStory(active.id)?<HrManagerDialogue key={active.id} stationId={active.id} result={hrResults[active.id]} completedCount={Object.keys(hrResults).length} previousResults={hrResults} onResolve={resolveHrStory} sound={sound} onNext={()=>{const next=mission.points.find(p=>p.id!==active.id&&!(p.id in hrResults))??mission.points[(mission.points.findIndex(p=>p.id===active.id)+1)%mission.points.length];openHrStation(next)}}/>:active.task?<div className="cw-task"><h3>{active.task.title}</h3><p>{active.task.brief}</p>{!response||response.id!==active.id?<div className="cw-choices">{active.task.choices.map((c,i)=><button key={c.label} type="button" onClick={()=>choose(i)}><span>{String.fromCharCode(65+i)}</span>{c.label}<ArrowRight size={16}/></button>)}</div>:<div className={`cw-feedback ${response.correct?'good':'learn'}`}><strong>{response.correct?'Well reasoned':'Opportunity to improve'}</strong><p>{response.message}</p><button type="button" onClick={()=>setResponse(null)}>Try another response</button></div>}</div>:kind==='company'&&companyEmployeeFor(active,mission)?<div className="cw-conversation"><div className="cw-employee-intro"><span className="cw-employee-avatar">{companyEmployeeFor(active,mission)!.name.charAt(0)}</span><div><strong>{companyEmployeeFor(active,mission)!.name}</strong><small>{companyEmployeeFor(active,mission)!.role}</small></div><span className="cw-employee-online">Available to talk</span></div><div className="cw-dialogue-bubble">{companyEmployeeFor(active,mission)!.greeting}</div>{conversationTopic&&<div className="cw-dialogue-answer" role="status">{employeeResponse(companyEmployeeFor(active,mission)!,conversationTopic)}{conversationFollowUp&&<p style={{marginTop:12}}>{conversationTopic==='work'?`A typical first project here involves working with another department. New teammates can ask for guidance and gradually take ownership.`:conversationTopic==='skills'?`If you're interested in this department, start with one small portfolio project and explain what you contributed, what was difficult, and what you learned.`:`We value respectful feedback, shared learning and honest conversations about expectations. You're welcome to ask more before applying.`}</p>}</div>}{conversationTopic&&!conversationFollowUp&&<button className="cw-conversation-followup" type="button" onClick={()=>setConversationFollowUp(true)}>Can you tell me more? <ChevronRight size={15}/></button>}<div className="cw-dialogue-actions"><button type="button" onClick={()=>{setConversationFollowUp(false);setConversationTopic('work')}}>What are you working on?</button><button type="button" onClick={()=>{setConversationFollowUp(false);setConversationTopic('skills')}}>What skills matter here?</button><button type="button" onClick={()=>{setConversationFollowUp(false);setConversationTopic('culture')}}>What's the team culture like?</button></div><div className="cw-department-links"><Link href={active.jobSearch?`/demo/opportunities?search=${encodeURIComponent(active.jobSearch)}`:'/demo/opportunities'}>Explore related jobs <ArrowRight size={17}/></Link><Link href="/demo/opportunities">Find a job <ArrowRight size={17}/></Link></div></div>:<div className="cw-department-links"><Link href={active.jobSearch?`/demo/opportunities?search=${encodeURIComponent(active.jobSearch)}`:'/demo/opportunities'}>Explore relevant jobs <ArrowRight size={17}/></Link><Link href="/demo/opportunities">Find a job <ArrowRight size={17}/></Link></div>}</section></div>}
 </div>
 <div className="cw-under"><div className="cw-progress"><div><span className="cw-eyebrow">YOUR PROGRESS</span><h3>{kind==='company'?'Departments discovered':'Workday stories'}</h3><p>{progress}{kind!=='company'?` · ${score.correct} evidence-based choices`:''}</p></div><div className="cw-progress-bar"><span style={{width:`${(kind==='company'?companyVisited/Math.max(companyStations.length,1):Object.keys(hrResults).length/Math.max(mission.points.length,1))*100}%`}}/></div><button type="button" onClick={reset}><RotateCcw size={15}/> Restart experience</button></div><div className="cw-objectives"><span className="cw-eyebrow">INTERACTIVE STATIONS</span>{mission.points.map(p=><button type="button" key={p.id} onClick={()=>{if(kind==='company'){visit(p);return;}if(kind==='simulator'){openHrStation(p);return;}cam.current.x=clamp(p.x,-7.1,7.1);cam.current.z=clamp(p.z+2,-9.1,9.1);cam.current.yaw=Math.PI;setTip(`Approach ${p.name} and press E to interact.`)}}><i style={{background:p.accent}}/ ><span><strong>{p.name}</strong><small>{p.subtitle}</small></span>{((kind==='simulator'?p.id in hrResults:visited.includes(p.id))||p.id in answers)&&<CheckCircle2 size={17} color="#139b7b"/>}<ChevronRight size={16}/></button>)}</div></div>
 <div className="cw-links"><Link href="/demo/opportunities">Find Jobs <ArrowRight size={16}/></Link><Link href="/demo/career/accelerator">Career Accelerator <ArrowRight size={16}/></Link><Link href="/demo/comics">Comic Books <ArrowRight size={16}/></Link></div><p className="cw-note">Career experiences are interactive learning environments. Results describe decisions made in these scenarios; they are not verified credentials or employment assessments.</p></main>
}

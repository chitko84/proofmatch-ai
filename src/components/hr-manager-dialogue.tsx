'use client';
import {useEffect,useState} from 'react';
import {ArrowRight,CheckCircle2,MessageCircleMore,RotateCcw,Sparkles,UserRound} from 'lucide-react';
import {getHrStory,hrStoryContext,type HrStoryResult} from '@/lib/hr-manager-story';

/** Two-stage branching dialogue in the walkable HR office. No network, synthetic AI or delayed animation. */
export function HrManagerDialogue({stationId,result,completedCount,previousResults,onResolve,onNext,sound=false}:{stationId:string;result?:HrStoryResult;completedCount:number;previousResults:Record<string,HrStoryResult>;onResolve:(id:string,result:HrStoryResult)=>void;onNext?:()=>void;sound?:boolean}){
 const scene=getHrStory(stationId);
 const [primary,setPrimary]=useState<number|null>(null);
 const [replay,setReplay]=useState(false);
 useEffect(()=>{setPrimary(null);setReplay(false)},[stationId]);
 useEffect(()=>{if(!sound||primary===null||!scene||typeof window==='undefined'||!window.speechSynthesis)return;const branch=scene.routes[primary];const utter=new SpeechSynthesisUtterance(`${branch.reply} ${branch.prompt}`);utter.lang='en-US';utter.rate=.97;window.speechSynthesis.cancel();window.speechSynthesis.speak(utter);return()=>window.speechSynthesis.cancel()},[primary,sound,scene]);
 if(!scene)return null;
 const completed=result&&!replay;
 const route=primary===null?null:scene.routes[primary];
 const context=hrStoryContext(stationId,previousResults);
 const finish=(followup:number)=>{
  if(primary===null)return;
  const selected=scene.routes[primary].followups[followup];
  if(!selected)return;
  onResolve(stationId,{primary,followup,outcome:selected.outcome,reply:selected.reply,good:selected.good,at:new Date().toISOString()});
  setReplay(false);
 };
 return <section className="hr-story" aria-label={`${scene.person} conversation`}>
  <div className="hr-story-chapter"><span><Sparkles size={13}/> HR LIFE · STORY ENCOUNTER</span><span>{scene.time} · {completedCount} stories completed</span></div>
  <div className="hr-story-person"><div className="hr-story-portrait" aria-hidden="true"><UserRound size={46}/><span>{scene.person.split(' ').map(x=>x[0]).join('')}</span></div><div><span className="hr-story-kicker">MEET YOUR COLLEAGUE</span><strong>{scene.person}</strong><small>{scene.role}</small><small>{scene.setting}</small></div></div>
  {context&&<div className="hr-story-continuity"><span className="hr-story-kicker">EARLIER IN YOUR SHIFT</span><p>{context}</p></div>}
  {completed? <div className="hr-story-resolution" role="status"><span className="hr-story-kicker">STORY COMPLETE · YOUR DECISION</span><h3>{result.outcome}</h3><p>{result.reply}</p><div className="hr-story-result"><CheckCircle2 size={17}/>{result.good?'Evidence-led outcome':'A learning moment — try another approach if you wish'}</div><div className="hr-story-complete-actions"><button type="button" onClick={()=>{setPrimary(null);setReplay(true)}}><RotateCcw size={15}/> Replay conversation</button>{onNext&&<button type="button" className="hr-story-next" onClick={onNext}>Next HR encounter <ArrowRight size={15}/></button>}</div></div>
  : <>
    <div className="hr-story-dialogue"><span className="hr-story-kicker"><MessageCircleMore size={14}/> {scene.person} SAYS</span><p>{route?route.reply:scene.opening}</p></div>
    {route && <div className="hr-story-followup"><span className="hr-story-kicker">THE SITUATION CHANGES</span><p>{route.prompt}</p></div>}
    <div className="hr-story-choices"><span className="hr-story-kicker">{route?'YOUR NEXT RESPONSE':'YOU ARE THE HR MANAGER · CHOOSE YOUR RESPONSE'}</span>
      {(route?route.followups:scene.routes).map((option,i)=><button type="button" key={`${stationId}-${primary??'intro'}-${i}`} onClick={()=>route?finish(i):setPrimary(i)}><span className="hr-story-choice-number">{String.fromCharCode(65+i)}</span><span>{option.label}</span><ArrowRight size={16}/></button>)}
    </div>
    {route&&<button type="button" className="hr-story-back" onClick={()=>setPrimary(null)}>← Choose a different first response</button>}
  </>}
  <p className="hr-story-disclaimer">Fictional workplace conversation. Choices change this storyline; they do not assess your real-world ability or make hiring decisions.</p>
 </section>;
}

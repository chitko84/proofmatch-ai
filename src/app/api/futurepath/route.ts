import { NextResponse } from 'next/server';
import {candidates} from '@/lib/data';
import {CAREER_TRACKS,evaluateCareerMilestone} from '@/lib/phase3';
import {answerWithGemini,GeminiUnavailable} from '@/lib/gemini';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=30;
export async function POST(request:Request){
 const code=process.env.DEMO_ACCESS_CODE;
 if(code&&request.headers.get('x-demo-access-code')!==code)return NextResponse.json({error:'Enter the correct demo access code.'},{status:401});
 if(Number(request.headers.get('content-length')||0)>1000)return NextResponse.json({error:'Please use the sample career options.'},{status:413});
 try{
  const raw=await request.json();
  if(!raw||typeof raw.candidateId!=='string'||typeof raw.trackId!=='string'||!Number.isInteger(raw.step))return NextResponse.json({error:'Select a person and a career step.'},{status:400});
  const candidate=candidates.find(c=>c.id===raw.candidateId),track=CAREER_TRACKS.find(t=>t.id===raw.trackId);
  if(!candidate||!track||raw.step<0||raw.step>=track.roles.length)return NextResponse.json({error:'Please select a valid demo option.'},{status:400});
  const milestone=track.roles[raw.step];const checks=evaluateCareerMilestone(candidate,milestone);
  const supported=checks.skills.filter(x=>x.evidence==='project example').map(x=>x.skillId.replaceAll('_',' '));
  const unknown=checks.skills.filter(x=>x.evidence==='not documented').map(x=>x.skillId.replaceAll('_',' '));
  const plain=`${candidate.alias} can explore ${milestone.title} as a possible option in this fictional company. Their sample project examples mention ${supported.join(', ')||'some related work'}. ${unknown.length?`There is no example yet for ${unknown.join(', ')}.`:'The listed sample requirements have supplied project examples.'} They should check the real role requirements and opportunities with the employer. This is not a prediction or promotion promise.`;
  if(!process.env.GEMINI_API_KEY)return NextResponse.json({answer:plain,mode:'sample-guide'},{headers:{'Cache-Control':'no-store'}});
  try{
   const context=JSON.stringify({fictionalCandidate:candidate.alias,careerTrack:track.name,role:milestone.title,roleDescription:milestone.description,skills:checks.skills,disclaimer:'Possible company pathway; no prediction of personal performance or promotions.'});
   const result=await answerWithGemini(context,'In plain friendly English, explain this possible career step and what supplied evidence or missing information to review. Do not predict hiring, promotion, behavior, or future success.');
   return NextResponse.json({answer:result,mode:'gemini'},{headers:{'Cache-Control':'no-store'}});
  }catch(e){return NextResponse.json({answer:plain,mode:'sample-guide',notice:e instanceof GeminiUnavailable?e.message:'Gemini unavailable'},{headers:{'Cache-Control':'no-store'}})}
 }catch{return NextResponse.json({error:'Could not load this career example.'},{status:400});}
}

import { NextResponse } from 'next/server';
import { miraContext,demoMiraAnswer } from '@/lib/mira';
import {roles} from '@/lib/data';
import { answerWithGemini, GeminiUnavailable } from '@/lib/gemini';
export const runtime='nodejs';export const dynamic='force-dynamic';export const maxDuration=30;
export async function POST(request:Request){
 const code=process.env.DEMO_ACCESS_CODE;
 if(code&&request.headers.get('x-demo-access-code')!==code)return NextResponse.json({error:'Enter the correct demo access code.'},{status:401});
 if(Number(request.headers.get('content-length')||0)>2500)return NextResponse.json({error:'Please ask a shorter question.'},{status:413});
 try{
  const raw=await request.json();
  if(!raw||typeof raw.candidateId!=='string'||typeof raw.question!=='string'||raw.question.trim().length<3||raw.question.length>350)return NextResponse.json({error:'Choose a person and enter a short question.'},{status:400});
  const focusRoleId=typeof raw.roleId==='string'&&roles.some(r=>r.id===raw.roleId)?raw.roleId:undefined;
  const context=miraContext(raw.candidateId,focusRoleId);
  if(!context)return NextResponse.json({error:'Please choose a fictional candidate.'},{status:400});
  // Works with limited demo data even when no Gemini key/quota is available.
  if(!process.env.GEMINI_API_KEY)return NextResponse.json({answer:demoMiraAnswer(raw.candidateId,raw.question,focusRoleId),mode:'sample-guide'},{headers:{'Cache-Control':'no-store'}});
  try{
   const answer=await answerWithGemini(context,raw.question);
   return NextResponse.json({answer,mode:'gemini'},{headers:{'Cache-Control':'no-store'}});
  }catch(err){
   if(err instanceof GeminiUnavailable) return NextResponse.json({answer:demoMiraAnswer(raw.candidateId,raw.question,focusRoleId),mode:'sample-guide',notice:err.message},{headers:{'Cache-Control':'no-store'}});
   throw err;
  }
 }catch{return NextResponse.json({error:'Sorry, that question could not be processed.'},{status:400});}
}

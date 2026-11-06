import {isPresentationContext} from '@/lib/interview-presentation';
import {isLocale} from '@/lib/i18n';
import {NextResponse} from 'next/server';
import {advanceInterview} from '@/lib/interview-ai';
import {createQuestion,isValidConfig,safeTurn,type PracticeTurn} from '@/lib/interview-engine';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=25;
export async function POST(request:Request){
 const code=process.env.DEMO_ACCESS_CODE;
 if(code&&request.headers.get('x-demo-access-code')!==code)return NextResponse.json({error:'The access code is required for AI features.'},{status:401});
 if(Number(request.headers.get('content-length')||0)>48000)return NextResponse.json({error:'This interview request is too long.'},{status:413});
 let body:unknown;
 try{body=await request.json()}catch{return NextResponse.json({error:'Invalid request body.'},{status:400})}
 if(!body||typeof body!=='object')return NextResponse.json({error:'Invalid interview request.'},{status:400});
 const data=body as Record<string,unknown>;
 if(!isValidConfig(data.config))return NextResponse.json({error:'Choose valid interview preferences.'},{status:400});
 if(data.action==='start')return NextResponse.json({question:createQuestion(data.config,0),mode:'structured'},{headers:{'Cache-Control':'no-store'}});
 if(data.action!=='advance'||!Array.isArray(data.turns)||data.turns.length<1||data.turns.length>data.config.count||!data.turns.every(safeTurn))return NextResponse.json({error:'Invalid answers or interview sequence.'},{status:400});
 const turns=data.turns as PracticeTurn[];
 for(let i=0;i<turns.length;i++){
  if(!turns[i].question.id.endsWith(`-${i+1}`)||turns[i].question.id!==`${data.config.role}-${data.config.focus}-${i+1}`)return NextResponse.json({error:'Invalid question sequence.'},{status:400});
 }
 if(data.presentationContext!==undefined&&!isPresentationContext(data.presentationContext))return NextResponse.json({error:'Invalid slide context.'},{status:400});
 const locale=isLocale(data.locale)?data.locale:'en';
 const result=await advanceInterview(data.config,turns,data.presentationContext as Parameters<typeof advanceInterview>[2],locale);
 return NextResponse.json(result,{headers:{'Cache-Control':'no-store'}});
}

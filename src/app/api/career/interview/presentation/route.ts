import {NextResponse} from 'next/server';
import {parsePowerPoint} from '@/lib/pptx-slide-parser';
import {MAX_DECK_SIZE} from '@/lib/interview-presentation';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=20;
export async function POST(request:Request){
 const required=process.env.DEMO_ACCESS_CODE;
 if(required&&request.headers.get('x-demo-access-code')!==required)return NextResponse.json({error:'An access code is required.'},{status:401});
 if(Number(request.headers.get('content-length')||0)>MAX_DECK_SIZE+100000)return NextResponse.json({error:'Files must be smaller than 10 MB.'},{status:413});
 try{
  const data=await request.formData();const file=data.get('file');
  if(!(file instanceof File)||!file.name.toLowerCase().endsWith('.pptx')||file.size>MAX_DECK_SIZE||file.size===0)return NextResponse.json({error:'Choose a PowerPoint .pptx file under 10 MB.'},{status:400});
  const bytes=Buffer.from(await file.arrayBuffer());if(bytes.subarray(0,2).toString()!=='PK')return NextResponse.json({error:'This does not appear to be a valid PowerPoint file.'},{status:400});
  const slides=parsePowerPoint(bytes);
  return NextResponse.json({name:file.name,kind:'pptx',slides},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Could not read presentation.'},{status:400});}
}

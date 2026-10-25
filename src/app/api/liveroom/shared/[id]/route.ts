import {NextResponse} from 'next/server';
import {getSharedMeeting,saveSharedMeeting} from '@/lib/live-telegram-store';
import {verifyAdminCode,verifyCandidateTicket} from '@/lib/live-telegram-server';
import {answerMeeting,confirmSuggestedTime,addRoomMessage} from '@/lib/liveroom';
export const runtime='nodejs';export const dynamic='force-dynamic';
const cache={'Cache-Control':'no-store'};
const err=(msg:string,status:number)=>NextResponse.json({error:msg},{status,headers:cache});
async function load(request:Request,ctx:{params:Promise<{id:string}>}){
 const {id}=await ctx.params;
 const shared=await getSharedMeeting(id);
 if(!shared)return {shared:null,role:null} as const;
 const url=new URL(request.url);
 const ticket=url.searchParams.get('ticket')||request.headers.get('x-proofmatch-candidate-ticket');
 const isCandidate=verifyCandidateTicket(ticket,shared.ticket);
 const isAdmin=verifyAdminCode(request.headers.get('x-proofmatch-demo-code'));
 return {shared,role:isAdmin?'recruiter':isCandidate?'candidate':null} as const;
}
export async function GET(request:Request,ctx:{params:Promise<{id:string}>}){
 try{const {shared,role}=await load(request,ctx);
  if(!shared)return err('This invitation is not available.',404);
  if(!role)return err('Use the private invitation link or recruiter access code.',403);
  return NextResponse.json({meeting:shared.meeting,role},{headers:cache});
 }catch{return err('Could not load the meeting.',503)}
}
export async function POST(request:Request,ctx:{params:Promise<{id:string}>}){
 try{
  const {shared,role}=await load(request,ctx);
  if(!shared)return err('This invitation is not available.',404);
  if(!role)return err('You do not have permission to change this invitation.',403);
  const body=await request.json() as {action?:string;status?:string;note?:string;requestedLocal?:string;message?:string};
  let next=shared.meeting;
  if(body.action==='rsvp'&&role==='candidate'&&['accepted','declined','reschedule_requested'].includes(body.status||'')){
   next=answerMeeting(next,body.status as 'accepted'|'declined'|'reschedule_requested',String(body.note||'').slice(0,500),body.status==='reschedule_requested'?String(body.requestedLocal||''):null);
  }else if(body.action==='confirm_time'&&role==='recruiter')next=confirmSuggestedTime(next);
  else if(body.action==='question'&&role==='candidate'){
   const note=String(body.note||'').trim().slice(0,500);
   if(!note)return err('Write your question first.',400);
   next={...next,candidateNote:note,updatedAt:new Date().toISOString()};
  }else if(body.action==='message'&&typeof body.message==='string'){
   next=addRoomMessage(next,role,body.message,`msg-${crypto.randomUUID().replaceAll('-','')}`);
  }else return err('This action is not available.',400);
  await saveSharedMeeting({meeting:next,ticket:shared.ticket});
  return NextResponse.json({meeting:next,ok:true},{headers:cache});
 }catch(e){return err(e instanceof Error?e.message:'Could not save your reply.',400)}
}

import {randomBytes} from 'node:crypto';
import {NextResponse} from 'next/server';
import {isMeetingShape,portableDemoInvitation} from '@/lib/liveroom';
import {sharedConnectReady} from '@/lib/connect-store';
import {getDemoRecipient,saveSharedMeeting} from '@/lib/live-telegram-store';
import {publicSiteOrigin,sendTelegram,verifyAdminCode} from '@/lib/live-telegram-server';
import {telegramMeetingText,validSendMeeting} from '@/lib/live-telegram';
export const runtime='nodejs';export const dynamic='force-dynamic';
const cache={'Cache-Control':'no-store'};
export async function GET(request:Request){
 if(!verifyAdminCode(request.headers.get('x-proofmatch-demo-code')))return NextResponse.json({error:'Enter your private demo access code.'},{status:401,headers:cache});
 if(!sharedConnectReady())return NextResponse.json({ready:false,linked:false,error:'Connect shared storage (Upstash Redis) first.'},{headers:cache});
 try{
  const id=await getDemoRecipient();
  return NextResponse.json({ready:Boolean(id&&process.env.TELEGRAM_BOT_TOKEN&&process.env.PROOFMATCH_PUBLIC_URL),linked:Boolean(id),botName:process.env.TELEGRAM_BOT_USERNAME||null},{headers:cache});
 }catch{return NextResponse.json({ready:false,linked:false,error:'Shared storage is unavailable.'},{headers:cache})}
}
export async function POST(request:Request){
 if(!verifyAdminCode(request.headers.get('x-proofmatch-demo-code')))return NextResponse.json({error:'Incorrect private demo access code.'},{status:401,headers:cache});
 if(!sharedConnectReady())return NextResponse.json({error:'Connect Upstash Redis before sending real Telegram invitations.'},{status:503,headers:cache});
 try{
  const body=await request.json() as {action?:string;meeting?:unknown};
  const chatId=await getDemoRecipient();
  if(!chatId)return NextResponse.json({error:'Open the pairing link in Telegram and tap Start to connect your account.'},{status:409,headers:cache});
  if(body.action==='test'){
   const messageId=await sendTelegram(chatId,'✅ ProofMatch AI is connected! This is a real Telegram delivery test for the fictional recruitment demonstration.');
   return NextResponse.json({sent:true,messageId},{headers:cache});
  }
  if(body.action!=='schedule'||!isMeetingShape(body.meeting)||!validSendMeeting(body.meeting))return NextResponse.json({error:'Choose a valid future meeting with a fictional candidate and open job.'},{status:400,headers:cache});
  const ticket=randomBytes(24).toString('base64url');
  const site=publicSiteOrigin();
  const invite=new URL(portableDemoInvitation(site,body.meeting));
  invite.searchParams.set('ticket',ticket);
  const link=invite.toString();
  const text=telegramMeetingText(body.meeting,link);
  // Store invitation before delivery, so phone RSVP works as soon as Telegram arrives.
  await saveSharedMeeting({meeting:body.meeting,ticket});
  const messageId=await sendTelegram(chatId,text,link);
  return NextResponse.json({sent:true,messageId,invitationUrl:link,meeting:body.meeting},{headers:cache});
 }catch(e){return NextResponse.json({sent:false,error:e instanceof Error?e.message:'Could not deliver the invitation.'},{status:502,headers:cache})}
}

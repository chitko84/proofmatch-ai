import { NextResponse } from 'next/server';
import { getInvitation, saveInvitation, sharedConnectReady } from '@/lib/connect-store';
import type { CandidateInterest, InvitationReply } from '@/lib/connect';
import { roles } from '@/lib/data';
import {saveDemoRecipient} from '@/lib/live-telegram-store';
import {timingSafeEqual} from 'node:crypto';
export const runtime='nodejs';export const dynamic='force-dynamic';
type TelegramUpdate = {
  message?: {text?:string; chat?:{id?:number};from?:{is_bot?:boolean}};
  callback_query?: {id?:string;data?:string;message?:{chat?:{id?:number}}};
};
async function telegram(method:string,data:Record<string,unknown>) {
  const token=process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Telegram is not connected.');
  const res=await fetch(`https://api.telegram.org/bot${token}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(7000),cache:'no-store'});
  if (!res.ok) throw new Error('Telegram could not send a response.');
}
async function notify(chatId:number,text:string,reply_markup?:Record<string,unknown>) {
  await telegram('sendMessage',{chat_id:chatId,text,...(reply_markup?{reply_markup}:{})});
}
const interestText:Record<CandidateInterest,string>={interested:'I am interested',learn_more:'Tell me more',not_now:'Not right now'};
const roleFor=(id:string)=>{const job=roles.find(r=>r.id===id);return job?`This open role is ${job.title} in ${job.location} (${job.acceptedModes.join(' or ')}).`:'';};
export async function POST(request:Request) {
  const secret=process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || !sharedConnectReady() || !process.env.TELEGRAM_BOT_TOKEN)
    return NextResponse.json({ error: 'Telegram is not set up.' },{status:503});
  if (request.headers.get('x-telegram-bot-api-secret-token')!==secret)
    return NextResponse.json({ error: 'Not allowed.' },{status:401});
  try {
    const update=await request.json() as TelegramUpdate;
    if (update.message?.text?.startsWith('/start link_')) {
      const id=update.message.chat?.id;
      const provided=update.message.text.slice('/start link_'.length).trim();
      const actual=process.env.TELEGRAM_DEMO_PAIRING_CODE||'';
      const x=Buffer.from(provided),y=Buffer.from(actual);
      if(typeof id==='number' && update.message.chat && id>0 && actual.length>=8 && x.length===y.length && timingSafeEqual(x,y)) {
        await saveDemoRecipient(id);
        await notify(id,'✅ Your Telegram account is now connected to ProofMatch AI. When the recruiter schedules a demo meeting and presses Send to Telegram, the real invitation will arrive here. Candidate and job details are fictional.');
      } else if(typeof id==='number') await notify(id,'This pairing link is not valid. Please open the private link provided in your ProofMatch setup.');
    } else if (update.message?.text === '/start' || update.message?.text === '/help') {
      const chatId=update.message.chat?.id;
      if(typeof chatId==='number')await notify(chatId,'Hello! This is ProofMatch Connect. To respond to an opportunity, open the private Telegram invitation link shared by the recruiter and tap Start. All candidates and jobs in this presentation are fictional.');
    } else if (update.message?.text?.startsWith('/start ')) {
      const chatId=update.message.chat?.id;
      if (typeof chatId!=='number')return NextResponse.json({ok:true});
      const token=update.message.text.slice(7).trim();
      const invite=await getInvitation(token);
      if(!invite){await notify(chatId,'This sample invitation is no longer available. Please ask the recruiter for a new link.');return NextResponse.json({ok:true});}
      const role=roles.find(r=>r.id===invite.roleId);
      await notify(chatId,`Hello! A recruiter would like to know if you'd consider another open job: ${role?.title||'this position'}.\nLocation: ${role?.location||'Discuss with recruiter'}.\nWork options: ${role?.acceptedModes.join(' or ')||'To be discussed'}.\n\nThis is a fictional ProofMatch demo, not a job offer. Would you like to learn more?`,{
        inline_keyboard:[[
          {text:'I am interested',callback_data:`pm:${token}:interested`},
          {text:'Tell me more',callback_data:`pm:${token}:learn_more`},
        ],[{text:'Not right now',callback_data:`pm:${token}:not_now`}]],
      });
    } else if (update.callback_query?.data?.startsWith('pm:')) {
      const callback=update.callback_query;
      if(callback.id)try{await telegram('answerCallbackQuery',{callback_query_id:callback.id})}catch{/* A Telegram button acknowledgement failure must not discard the person's reply. */}
      const parts=callback.data?.split(':')||[];
      const token=parts[1],choice=parts[2];
      const invite=await getInvitation(token||'');
      const chatId=callback.message?.chat?.id;
      if(!invite || typeof chatId!=='number')return NextResponse.json({ok:true});
      if(choice==='interested'||choice==='learn_more'||choice==='not_now'){
        const reply:InvitationReply={interest:choice,workMode:'not_sure',note:'',repliedAt:new Date().toISOString(),source:'telegram'};
        await saveInvitation({...invite,reply});
        if(choice==='not_now')await notify(chatId,'Thanks for letting us know. We have saved your preference for the recruiter to review. You will not be automatically rejected or contacted about this sample opportunity.');
        else await notify(chatId,`Thank you! ${interestText[choice]}. ${roleFor(invite.roleId)} Which working arrangement would you prefer?`,{
          inline_keyboard:[[
            {text:'Remote',callback_data:`pm:${token}:remote`},
            {text:'Hybrid',callback_data:`pm:${token}:hybrid`},
            {text:'On-site',callback_data:`pm:${token}:onsite`},
          ],[{text:'Not sure yet',callback_data:`pm:${token}:not_sure`}]],
        });
      } else if(['remote','hybrid','onsite','not_sure'].includes(choice||'') && invite.reply){
        await saveInvitation({...invite,reply:{...invite.reply,workMode:choice as InvitationReply['workMode'],repliedAt:new Date().toISOString()}});
        await notify(chatId,'Thanks! Your preference is saved for the recruiter to review. No hiring decision has been made. You can update your choice by opening the original invitation link again.');
      }
    }
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({ error:'Please try again.' },{status:500}); }
}

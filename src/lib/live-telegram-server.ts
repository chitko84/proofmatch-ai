import {timingSafeEqual} from 'node:crypto';
export function verifyAdminCode(given:string|null):boolean {
 const actual=process.env.DEMO_ACCESS_CODE;
 if(!actual||actual.length<8||!given)return false;
 const a=Buffer.from(actual),b=Buffer.from(given);
 return a.length===b.length&&timingSafeEqual(a,b);
}
export function verifyCandidateTicket(given:string|null,expected:string):boolean {
 if(!given)return false;
 const a=Buffer.from(given),b=Buffer.from(expected);
 return a.length===b.length&&timingSafeEqual(a,b);
}
export function publicSiteOrigin():string {
 const candidate=process.env.PROOFMATCH_PUBLIC_URL?.trim();
 if(!candidate)throw Error('Add PROOFMATCH_PUBLIC_URL with your deployed HTTPS site address.');
 const url=new URL(candidate);
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('Use a public HTTPS site URL without a path.');
 return url.origin;
}
export async function sendTelegram(chatId:number,text:string,meetingUrl?:string):Promise<number> {
 const token=process.env.TELEGRAM_BOT_TOKEN;
 if(!token)throw Error('The Telegram bot token has not been configured.');
 const payload:Record<string,unknown>={chat_id:chatId,text,disable_web_page_preview:true};
 if(meetingUrl)payload.reply_markup={inline_keyboard:[[{text:'View invitation and RSVP',url:meetingUrl}]]};
 const result=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
  method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',
  body:JSON.stringify(payload),signal:AbortSignal.timeout(10000),
 });
 const json=await result.json().catch(()=>null) as {ok?:boolean;result?:{message_id?:number};description?:string}|null;
 if(!result.ok||!json?.ok||typeof json.result?.message_id!=='number')throw Error(json?.description||'Telegram did not confirm delivery.');
 return json.result.message_id;
}

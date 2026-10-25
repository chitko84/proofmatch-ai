import {NextResponse} from 'next/server';
import {sharedConnectReady, testSharedConnect} from '@/lib/connect-store';
export const runtime='nodejs';export const dynamic='force-dynamic';
type TgResult<T> = {ok:boolean;result?:T;description?:string};
async function botQuery<T>(method:string): Promise<T> {
 const token=process.env.TELEGRAM_BOT_TOKEN;
 if(!token)throw Error('Bot token not set.');
 const r=await fetch(`https://api.telegram.org/bot${token}/${method}`,{cache:'no-store',signal:AbortSignal.timeout(4500)});
 const body=await r.json() as TgResult<T>;
 if(!r.ok||!body.ok||!body.result)throw Error('Telegram did not confirm the connection.');
 return body.result;
}
export async function GET(request:Request){
 const storageConfigured=sharedConnectReady();
 let sharedStorage=false,storageMessage='Connect Upstash Redis to receive replies across devices.';
 if(storageConfigured){try{await testSharedConnect();sharedStorage=true;storageMessage='Shared storage is responding.';}catch{storageMessage='Shared storage settings were found, but the connection failed.'}}
 const tokenConfigured=Boolean(process.env.TELEGRAM_BOT_TOKEN),secretConfigured=Boolean(process.env.TELEGRAM_WEBHOOK_SECRET),usernameConfigured=Boolean(process.env.TELEGRAM_BOT_USERNAME);
 let botVerified=false,webhookVerified=false,webhookMatches=false,botName='',telegramMessage='Create a Telegram bot and configure its token, username, and webhook secret.';
 if(tokenConfigured){
  try{
   const info=await botQuery<{username?:string;is_bot?:boolean}>('getMe');
   botVerified=Boolean(info.is_bot&&info.username);botName=info.username||'';
   const hook=await botQuery<{url?:string;last_error_message?:string;pending_update_count?:number}>('getWebhookInfo');
   const configuredUrl=hook.url||'';
   webhookVerified=Boolean(configuredUrl&&new URL(configuredUrl).protocol==='https:'&&new URL(configuredUrl).pathname==='/api/connect/telegram'&&!hook.last_error_message);
   const requestOrigin=new URL(request.url).origin;
   webhookMatches=webhookVerified&&new URL(configuredUrl).origin===requestOrigin;
   telegramMessage=webhookVerified?'Telegram confirmed the bot and webhook.':'The bot exists but its webhook needs setup or has reported an error.';
   if(usernameConfigured&&info.username?.toLowerCase()!==process.env.TELEGRAM_BOT_USERNAME?.replace(/^@/,'').toLowerCase()){
    telegramMessage='Bot username does not match TELEGRAM_BOT_USERNAME.';botVerified=false;
   }
  }catch{telegramMessage='Could not verify the Telegram bot. Check its token, internet access, and webhook.'}
 }
 const ready=sharedStorage&&botVerified&&webhookVerified&&secretConfigured&&usernameConfigured&&webhookMatches;
 return NextResponse.json({ready,sharedStorage,storageMessage,botVerified,webhookVerified,webhookMatches,botName,telegramMessage,
   qrScanning:'Camera QR scanning is supported when your browser provides BarcodeDetector and camera permission; phone camera scanning works with a public HTTPS invitation link.'
 },{headers:{'Cache-Control':'no-store'}});
}

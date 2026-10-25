/** Set and verify the real Telegram webhook. Run only after deploying the project to public HTTPS.
 * Usage: node scripts/setup-telegram.mjs https://your-project.vercel.app
 * Loads .env.local without logging any tokens, and accepts ordinary environment variables.
 */
import {readFileSync,existsSync} from 'node:fs';
const filename='.env.local';
if(existsSync(filename))for(const line of readFileSync(filename,'utf8').split(/\r?\n/)){
 const match=line.match(/^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);if(match&&!process.env[match[1]]){
  const value=match[2].replace(/^(['"])(.*)\1$/,'$2');process.env[match[1]]=value;
 }
}
const token=process.env.TELEGRAM_BOT_TOKEN,secret=process.env.TELEGRAM_WEBHOOK_SECRET,username=process.env.TELEGRAM_BOT_USERNAME;
const required=['TELEGRAM_BOT_TOKEN','TELEGRAM_WEBHOOK_SECRET','TELEGRAM_BOT_USERNAME','UPSTASH_REDIS_REST_URL','UPSTASH_REDIS_REST_TOKEN','DEMO_ACCESS_CODE','TELEGRAM_DEMO_PAIRING_CODE','PROOFMATCH_PUBLIC_URL'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length){console.error('Setup is incomplete. Missing:',missing.join(', '));process.exit(1)}
if(!/^[A-Za-z0-9_-]{1,256}$/.test(secret)){console.error('TELEGRAM_WEBHOOK_SECRET must contain only letters, numbers, underscores, or hyphens.');process.exit(1)}
let origin;try{origin=new URL(process.argv[2]);if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw Error('URL invalid.');}catch{console.error('Pass your real HTTPS site URL, for example: node scripts/setup-telegram.mjs https://my-site.vercel.app');process.exit(1)}
const api=async(method,data)=>{
 const response=await fetch(`https://api.telegram.org/bot${token}/${method}`,{
  ...(data?{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}:{}),signal:AbortSignal.timeout(10000)});
 const json=await response.json();if(!response.ok||!json.ok)throw Error(`Telegram ${method} failed: ${json.description||response.status}`);return json.result;
};
try{
 const bot=await api('getMe');if(!bot.is_bot||!bot.username)throw Error('The token did not identify a bot.');
 if(bot.username.toLowerCase()!==username.replace(/^@/,'').toLowerCase())throw Error('TELEGRAM_BOT_USERNAME does not match the actual bot username.');
 const target=`${origin.origin}/api/connect/telegram`;
 await api('setWebhook',{url:target,secret_token:secret,allowed_updates:['message','callback_query']});
 const webhook=await api('getWebhookInfo');
 if(webhook.url!==target)throw Error('Telegram did not register the expected webhook URL.');
 console.log(`SUCCESS: @${bot.username} is registered with Telegram.`);
 console.log(`Webhook URL: ${target}`);
 console.log('Next: open /demo/meetings, enter your private codes, Check Telegram, open your pairing link, and tap Start.');
 console.log('Then Check Telegram again, send a test to your phone, and use Schedule & send to Telegram.');
 console.log('Return to the recruiter page. The response should appear automatically after a few seconds.');
 console.log('Use a consenting test Telegram account and fictional candidate details only.');
}catch(e){console.error('SETUP FAILED:',e instanceof Error?e.message:'Unknown error');process.exitCode=1}

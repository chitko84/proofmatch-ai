/** Offline test of schedule -> Telegram send acknowledgement -> phone RSVP -> cross-device chat.
 * Fakes Telegram and Redis; never contacts the actual service.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {buildMeeting,defaultMeetingTime,isMeetingShape,portableDemoInvitation,answerMeeting,confirmSuggestedTime,addRoomMessage} from '../src/lib/liveroom.ts';
import {telegramMeetingText,validSendMeeting} from '../src/lib/live-telegram.ts';
const require=createRequire(import.meta.url);
const ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
const root=path.resolve(import.meta.dirname,'..');
const shared=new Map();let telegramMessages=[];let connected=true;
const mockNext={NextResponse:{json:(data,opts={})=>Response.json(data,{status:opts.status||200,headers:opts.headers||{}})}};
const store={getDemoRecipient:async()=>connected?123456:null,saveSharedMeeting:async obj=>shared.set(obj.meeting.id,obj),getSharedMeeting:async id=>shared.get(id)||null};
const app={...store};
const routes={
 'next/server':mockNext,
 'node:crypto':require('node:crypto'),
 '@/lib/liveroom':{isMeetingShape,portableDemoInvitation,answerMeeting,confirmSuggestedTime,addRoomMessage},
 '@/lib/connect-store':{sharedConnectReady:()=>true},
 '@/lib/live-telegram-store':app,
 '@/lib/live-telegram-server':{
  publicSiteOrigin:()=> 'https://proofmatch.example',
  sendTelegram:async(id,text,link)=>{telegramMessages.push({id,text,link});return 83838},
  verifyAdminCode:s=>s==='private-access-code',
  verifyCandidateTicket:(s,e)=>s===e,
 },
 '@/lib/live-telegram':{telegramMeetingText,validSendMeeting},
};
function route(file){const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const module={exports:{}};
 const context={module,exports:module.exports,require:id=>{if(Object.hasOwn(routes,id))return routes[id];throw Error('unexpected import '+id)},Response,Request,URL,console,Date,crypto:require('node:crypto').webcrypto,process:{env:{TELEGRAM_BOT_TOKEN:'test',PROOFMATCH_PUBLIC_URL:'https://proofmatch.example',TELEGRAM_BOT_USERNAME:'testproofmatchbot'}}};
 vm.runInNewContext(code,context,{timeout:3000,filename:file});return module.exports;
}
const sending=route('src/app/api/liveroom/telegram/route.ts');
const sharedRoutes=route('src/app/api/liveroom/shared/[id]/route.ts');
const h={'Content-Type':'application/json','x-proofmatch-demo-code':'private-access-code'};
const meeting=buildMeeting({candidateId:'C01',roleId:'qa',scheduledLocal:defaultMeetingTime(),durationMinutes:20},'meet-real-telegram-example-123456');
const bad=await sending.POST(new Request('https://proofmatch.example/api/liveroom/telegram',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'schedule',meeting})}));
assert.equal(bad.status,401);console.log('PASS 1: No invitation without recruiter authorization');
connected=false;
const unpaired=await sending.POST(new Request('https://proofmatch.example/api/liveroom/telegram',{method:'POST',headers:h,body:JSON.stringify({action:'schedule',meeting})}));
assert.equal(unpaired.status,409);console.log('PASS 2: Unpaired account cannot receive an invitation');
connected=true;
const sent=await sending.POST(new Request('https://proofmatch.example/api/liveroom/telegram',{method:'POST',headers:h,body:JSON.stringify({action:'schedule',meeting})}));
assert.equal(sent.status,200);const payload=await sent.json();assert.equal(payload.sent,true);assert.equal(payload.messageId,83838);
assert.equal(telegramMessages.length,1);assert.match(telegramMessages[0].text,/QA Automation Engineer/);
assert.match(payload.invitationUrl,/ticket=/);console.log('PASS 3: Telegram send is acknowledged and RSVP link contains private token');
const ticket=new URL(payload.invitationUrl).searchParams.get('ticket');
const ctx={params:Promise.resolve({id:meeting.id})};
const phoneUrl=`https://proofmatch.example/api/liveroom/shared/${meeting.id}?ticket=${ticket}`;
const getPhone=await sharedRoutes.GET(new Request(phoneUrl),ctx);assert.equal(getPhone.status,200);
assert.equal((await getPhone.json()).role,'candidate');console.log('PASS 4: Phone opens its matching private invitation');
const phoneReply=await sharedRoutes.POST(new Request(phoneUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'rsvp',status:'accepted',note:'Hybrid works for me'})}),ctx);
assert.equal(phoneReply.status,200);assert.equal((await phoneReply.json()).meeting.status,'accepted');console.log('PASS 5: Phone accepts and writes to shared record');
const getHR=await sharedRoutes.GET(new Request(`https://proofmatch.example/api/liveroom/shared/${meeting.id}`,{headers:h}),ctx);
assert.equal((await getHR.json()).meeting.status,'accepted');console.log('PASS 6: Recruiter sees phone RSVP');
const phoneMsg=await sharedRoutes.POST(new Request(phoneUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'message',message:'Could you explain the hybrid schedule?'})}),ctx);
assert.equal(phoneMsg.status,200);
const hrMsg=await sharedRoutes.POST(new Request(`https://proofmatch.example/api/liveroom/shared/${meeting.id}`,{method:'POST',headers:h,body:JSON.stringify({action:'message',message:'Of course, we can discuss that.'})}),ctx);
assert.equal(hrMsg.status,200);assert.equal((await hrMsg.json()).meeting.messages.length,2);console.log('PASS 7: Candidate and HR chat both persist in shared meeting');
const stranger=await sharedRoutes.GET(new Request(`https://proofmatch.example/api/liveroom/shared/${meeting.id}?ticket=wrong`),ctx);
assert.equal(stranger.status,403);console.log('PASS 8: Wrong RSVP token cannot view the meeting');
console.log('All 8/8 real-delivery path simulations passed. NO actual Telegram message was sent by this test.');

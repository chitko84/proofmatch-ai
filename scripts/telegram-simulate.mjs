/** Dependency-free simulation of the REAL webhook route with fake Telegram and storage.
 * Exercises opt-in and candidate replies, but DOES NOT send a real Telegram message.
 * This supplements (not replaces) deployed bot, Redis and phone testing.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
let ts;try{ts=require('typescript')}catch{ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript')}
const root=path.resolve(import.meta.dirname,'..');
const file=path.join(root,'src/app/api/connect/telegram/route.ts');
const source=fs.readFileSync(file,'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const saved=new Map();
let linkedDemoChat=0;
const messages=[];
const qa={id:'qa',title:'QA Automation Engineer',location:'Kuala Lumpur',acceptedModes:['hybrid','onsite']};
const helpers={
 getInvitation:async token=>saved.get(token)||null,
 saveInvitation:async record=>{saved.set(record.token,record)},
 sharedConnectReady:()=>true,
};
const fakeFetch=async(url,opts)=>{
 if(!String(url).startsWith('https://api.telegram.org/'))throw Error('Unexpected network call');
 const method=String(url).split('/').pop();
 const payload=JSON.parse(opts.body);
 messages.push({method,payload});
 return new Response(JSON.stringify({ok:true,result:true}),{status:200,headers:{'content-type':'application/json'}});
};
const fakeNext={NextResponse:{json:(data,opts={})=>Response.json(data,{status:opts.status||200})}};
const imports={
 'next/server':fakeNext,
 '@/lib/connect-store':helpers,
 '@/lib/data':{roles:[qa]},
 '@/lib/live-telegram-store':{saveDemoRecipient:async id=>{linkedDemoChat=id}},
 'node:crypto':require('node:crypto'),
};
const module={exports:{}};
const context={module,exports:module.exports,require:id=>{
 if(Object.hasOwn(imports,id))return imports[id];
 throw Error('Unexpected dependency: '+id);
},process:{env:{TELEGRAM_WEBHOOK_SECRET:'test-telegram-secret',TELEGRAM_BOT_TOKEN:'local-test-token',TELEGRAM_DEMO_PAIRING_CODE:'local_pair_code_12345'}},fetch:fakeFetch,Response,Request,AbortSignal,Date,console,Buffer};
vm.runInNewContext(js,context,{filename:file,timeout:3000});
const post=module.exports.POST;
// Prepare a real invitation via the actual Next.js invitation API handler (with fake storage).
const inviteSource=fs.readFileSync(path.join(root,'src/app/api/connect/invite/route.ts'),'utf8');
const inviteJs=ts.transpileModule(inviteSource,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
const inviteModule={exports:{}};
const inviteImports={
 'next/server':fakeNext,
 'node:crypto':require('node:crypto'),
 '@/lib/connect':{checkCandidateRole:(candidateId,roleId)=>{
   if(candidateId!=='C01'||roleId!=='qa')throw Error('Invalid sample job or person');
   return {candidate:{id:'C01'},role:qa};
 }},
 '@/lib/connect-store':helpers,
};
const inviteContext={module:inviteModule,exports:inviteModule.exports,require:id=>{
 if(Object.hasOwn(inviteImports,id))return inviteImports[id];
 throw Error('Unexpected invitation dependency: '+id);
},process:{env:{DEMO_ACCESS_CODE:'test-demo-access-code',TELEGRAM_BOT_USERNAME:'ProofMatchTestBot',TELEGRAM_BOT_TOKEN:'local-test-token',TELEGRAM_WEBHOOK_SECRET:'test-telegram-secret'}},fetch:fakeFetch,Response,Request,AbortSignal,Date,console,URL};
vm.runInNewContext(inviteJs,inviteContext,{timeout:3000});
const createInvite=async(code)=>inviteModule.exports.POST(new Request('https://demo.example/api/connect/invite',{method:'POST',headers:{'content-type':'application/json',...(code?{'x-demo-access-code':code}:{})},body:JSON.stringify({candidateId:'C01',roleId:'qa'})}));
assert.equal((await createInvite()).status,401,'Access code is required to create a real invitation');
const inviteResponse=await createInvite('test-demo-access-code');
assert.equal(inviteResponse.status,200);
const inviteJson=await inviteResponse.json();
const invitation=inviteJson.invitation;
assert.equal(inviteJson.mode,'shared');
assert.equal(inviteJson.url,`https://demo.example/passport?token=${invitation.token}`);
assert.equal(inviteJson.telegramUrl,`https://t.me/ProofMatchTestBot?start=${invitation.token}`);
assert.equal(saved.get(invitation.token).reply,null);
console.log('PASS Authenticated invitation route produces the matching private passport and Telegram links');

let passed=1;
const run=async(name,update,expectedStatus=200,secret='test-telegram-secret')=>{
 const req=new Request('https://test.example/api/connect/telegram',{method:'POST',headers:{'Content-Type':'application/json','x-telegram-bot-api-secret-token':secret},body:JSON.stringify(update)});
 const res=await post(req);
 assert.equal(res.status,expectedStatus,`${name}: wrong response code`);
 console.log(`PASS ${name}`);passed++;
};
await run('Reject webhook requests without the correct secret',{message:{text:'/start',chat:{id:123}}},401,'bad-secret');
assert.equal(messages.length,0);
await run('Link a consenting Telegram demo account',{message:{text:'/start link_local_pair_code_12345',chat:{id:456}}});
assert.equal(linkedDemoChat,456,'Private pairing links must record the chat ID');
await run('Start bot with sample invitation',{message:{text:'/start '+invitation.token,chat:{id:123}}});
assert.equal(messages.at(-1).method,'sendMessage');
assert.equal(messages.at(-1).payload.reply_markup.inline_keyboard[0][0].callback_data,`pm:${invitation.token}:interested`);
await run('Choose interested in an actual Telegram callback',{callback_query:{id:'interest-1',data:`pm:${invitation.token}:interested`,message:{chat:{id:123}}}});
assert.equal(saved.get(invitation.token).reply.interest,'interested');
assert.equal(saved.get(invitation.token).reply.source,'telegram');
assert.ok(messages.some(m=>m.payload.reply_markup?.inline_keyboard?.[0]?.[1]?.text==='Hybrid'));
await run('Choose hybrid work preference in Telegram',{callback_query:{id:'mode-1',data:`pm:${invitation.token}:hybrid`,message:{chat:{id:123}}}});
assert.equal(saved.get(invitation.token).reply.workMode,'hybrid');
await run('Telegram opt-out records not interested',{callback_query:{id:'optout-1',data:`pm:${invitation.token}:not_now`,message:{chat:{id:123}}}});
assert.equal(saved.get(invitation.token).reply.interest,'not_now');
await run('Expired invitation does not create a reply',{message:{text:'/start expired-demo-token-001',chat:{id:123}}});
assert.equal(saved.size,1);
console.log(`\nInvitation + Telegram simulation passed: ${passed}/${passed}. No real Telegram account contacted.`);

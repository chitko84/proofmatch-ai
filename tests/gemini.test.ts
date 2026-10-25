import test from 'node:test';
import assert from 'node:assert/strict';
import { extractWithGemini, GeminiUnavailable } from '../src/lib/gemini.ts';
import { validateLiveInput } from '../src/lib/live-analysis.ts';

const input=validateLiveInput({label:'Demo',appliedRoleId:'frontend',location:'Penang',preferredModes:['hybrid'],cvText:'I made a sample React website with reusable sections and responsive layouts.',projectText:''});
test('model disabled without API key, never returns fabricated AI output', async()=>{
  const old=process.env.GEMINI_API_KEY;delete process.env.GEMINI_API_KEY;
  try {await assert.rejects(extractWithGemini(input),error=>error instanceof GeminiUnavailable && error.status===503);}
  finally {if(old)process.env.GEMINI_API_KEY=old;}
});
test('server Gemini call uses structured schema and key only in header',async()=>{
  const previous=process.env.GEMINI_API_KEY;const oldFetch=globalThis.fetch;
  process.env.GEMINI_API_KEY='TEST_DO_NOT_USE';
  let capturedUrl='';let capturedHeaders:Record<string,string>={};let capturedBody='';
  globalThis.fetch=async (req,init)=>{
    capturedUrl=String(req);
    capturedHeaders=init?.headers as Record<string,string>;
    capturedBody=String(init?.body);
    return new Response(JSON.stringify({candidates:[{content:{parts:[{text:JSON.stringify({evidence:[]})}]}}]}),{status:200});
  };
  try{
    const got=await extractWithGemini(input);
    assert.deepEqual(got.raw,{evidence:[]});
    assert.match(capturedUrl,/gemini-3\.8-flash:generateContent/);
    assert.equal(capturedHeaders['x-goog-api-key'],'TEST_DO_NOT_USE');
    assert.doesNotMatch(capturedBody,/TEST_DO_NOT_USE/);
    const data=JSON.parse(capturedBody);
    assert.equal(data.generationConfig.responseMimeType,'application/json');
    assert.equal(data.generationConfig.responseSchema.type,'OBJECT');
  }finally{globalThis.fetch=oldFetch;if(previous)process.env.GEMINI_API_KEY=previous;else delete process.env.GEMINI_API_KEY;}
});
test('Gemini quota errors are clear and do not silently switch to fake responses',async()=>{
  const prev=process.env.GEMINI_API_KEY;const oldFetch=globalThis.fetch;
  process.env.GEMINI_API_KEY='TEST_DO_NOT_USE';
  globalThis.fetch=async()=>new Response('Quota', {status:429});
  try{await assert.rejects(extractWithGemini(input),error=>error instanceof GeminiUnavailable && error.status===429);}
  finally{globalThis.fetch=oldFetch;if(prev)process.env.GEMINI_API_KEY=prev;else delete process.env.GEMINI_API_KEY;}
});

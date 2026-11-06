import test from 'node:test';
import assert from 'node:assert/strict';
import {deflateRawSync} from 'node:zlib';
import {parsePowerPoint} from '../src/lib/pptx-slide-parser.ts';
import {contextFromDeck,isPresentationContext,pdfPageCount,sampleInterviewDeck,sanitizedDeck,slideQuestion,type SavedDeck} from '../src/lib/interview-presentation.ts';
import {DEFAULT_INTERVIEW_CONFIG,createQuestion,structuredFeedback,type PracticeTurn} from '../src/lib/interview-engine.ts';
import {advanceInterview} from '../src/lib/interview-ai.ts';

function tinyZip(slides:string[]):Buffer{
 const local:Buffer[]=[],central:Buffer[]=[];let offset=0;
 slides.forEach((xml,i)=>{
  const name=Buffer.from(`ppt/slides/slide${i+1}.xml`),contents=Buffer.from(xml),blob=deflateRawSync(contents);
  const l=Buffer.alloc(30);l.writeUInt32LE(0x04034b50,0);l.writeUInt16LE(8,8);l.writeUInt32LE(blob.length,18);l.writeUInt32LE(contents.length,22);l.writeUInt16LE(name.length,26);
  local.push(l,name,blob);
  const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50,0);c.writeUInt16LE(8,10);c.writeUInt32LE(blob.length,20);c.writeUInt32LE(contents.length,24);c.writeUInt16LE(name.length,28);c.writeUInt32LE(offset,42);
  central.push(c,name);offset+=l.length+name.length+blob.length;
 });
 const cSize=central.reduce((n,p)=>n+p.length,0),end=Buffer.alloc(22);
 end.writeUInt32LE(0x06054b50,0);end.writeUInt16LE(slides.length,8);end.writeUInt16LE(slides.length,10);end.writeUInt32LE(cSize,12);end.writeUInt32LE(offset,16);
 return Buffer.concat([...local,...central,end]);
}

test('PowerPoint ZIP importer extracts ordered slide text without executing HTML',()=>{
 const ppt=tinyZip(['<p:sld><a:p><a:r><a:t>Project &amp; Impact</a:t></a:r></a:p><a:p><a:r><a:t>We saved 20%.</a:t></a:r></a:p></p:sld>','<p:sld><a:p><a:r><a:t>Technical decisions</a:t></a:r></a:p></p:sld>']);
 const slides=parsePowerPoint(ppt);
 assert.equal(slides.length,2);assert.equal(slides[0].title,'Project & Impact');assert.match(slides[0].body,/20%/);assert.equal(slides[1].title,'Technical decisions');
});
test('PowerPoint ZIP importer rejects invalid and oversized archives',()=>{
 assert.throws(()=>parsePowerPoint(Buffer.from('not a zip')));
 assert.throws(()=>parsePowerPoint(Buffer.alloc(10*1024*1024+1)));
});
test('Slide context, validation and copy-ready questions use only supplied text',()=>{
 const deck:SavedDeck={name:'My Portfolio.pptx',kind:'pptx',activeIndex:0,visited:[0],slides:[{id:'slide-1',title:'Case study',body:'I tested accessibility and speed.',notes:'Explain the benchmark results.'}]};
 const saved=sanitizedDeck(deck),ctx=contextFromDeck(saved);
 assert.ok(ctx);assert.ok(isPresentationContext(ctx));assert.equal(ctx.slideCount,1);
 assert.match(slideQuestion(ctx),/Case study/);
 assert.ok(!isPresentationContext({...ctx,slideNumber:10}));
 assert.ok(!isPresentationContext({...ctx,presenterNotes:'x'.repeat(1300)}));
});
test('PDF navigation counts typical Page markers and limits to 60',()=>{
 assert.equal(pdfPageCount(new TextEncoder().encode('%PDF-1.7 /Type /Pages /Count 2 /Type /Page /Type /Page')),2);
 assert.equal(pdfPageCount(new TextEncoder().encode('%PDF-1.4 /Count 12')),12);
});
test('presentation-aware fallback produces a question about the current slide',async()=>{
 const context={deckTitle:'Final Presentation',slideNumber:2,slideCount:4,slideTitle:'Results',slideText:'We tested 12 users',presenterNotes:'Explain pilot metrics'};
 const question=createQuestion(DEFAULT_INTERVIEW_CONFIG,0);
 const answer='First I built the interface, then I tested it with multiple people and improved it.';
 const turn:PracticeTurn={question,answer,skipped:false,answeredAt:new Date().toISOString(),feedback:structuredFeedback(question,answer)};
 const prior=process.env.GEMINI_API_KEY;delete process.env.GEMINI_API_KEY;
 try{const result=await advanceInterview(DEFAULT_INTERVIEW_CONFIG,[turn],context);assert.equal(result.mode,'structured');assert.match(result.nextQuestion?.question||'',/Results/);}finally{if(prior)process.env.GEMINI_API_KEY=prior;}
});

test('built-in five-slide presentation is navigable, safe to persist, and creates slide-specific questions',()=>{
 const deck=sampleInterviewDeck();assert.equal(deck.kind,'native');assert.equal(deck.slides.length,5);assert.equal(deck.activeIndex,0);
 const edited={...deck,activeIndex:3,visited:[0,1,2,3],slides:deck.slides.map((slide,i)=>i===3?{...slide,notes:'I will explain what changed.'}:slide)};
 const persisted=sanitizedDeck(edited);const restored=JSON.parse(JSON.stringify(persisted)) as SavedDeck;
 const ctx=contextFromDeck(restored);assert.ok(ctx);assert.equal(ctx.slideNumber,4);assert.match(ctx.presenterNotes,/what changed/);assert.match(slideQuestion(ctx),/Results and lessons learned/);
});

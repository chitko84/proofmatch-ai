/** Read visible slide text from PPTX without external dependencies.
 * This is a content preview, not a pixel-accurate PowerPoint renderer. */
import {inflateRawSync} from 'node:zlib';
import {MAX_DECK_SIZE,MAX_SLIDES,safeLabel,type PresentationSlide} from './interview-presentation.ts';
const read16=(b:Buffer,o:number)=>b.readUInt16LE(o);
const read32=(b:Buffer,o:number)=>b.readUInt32LE(o);
const MAX_INFLATED_ENTRY=2*1024*1024;
const decodeXml=(s:string)=>s.replace(/&#x([\da-f]+);/gi,(_,x)=>String.fromCodePoint(Math.min(0x10ffff,parseInt(x,16)))).replace(/&#(\d+);/g,(_,x)=>String.fromCodePoint(Math.min(0x10ffff,parseInt(x,10)))).replace(/&(?:amp|lt|gt|quot|apos);/g,m=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'"})[m]||m);
function entries(bytes:Buffer):Map<string,string>{
 if(bytes.length>MAX_DECK_SIZE)throw new Error('Presentation is too large (maximum 10 MB).');
 const last=Math.max(0,bytes.length-65557);let end=-1;
 for(let i=bytes.length-22;i>=last;i--){if(bytes.readUInt32LE(i)===0x06054b50){end=i;break;}}
 if(end<0)throw new Error('Invalid PowerPoint file.');
 const count=read16(bytes,end+10);const centralOffset=read32(bytes,end+16);
 if(count>600||centralOffset>=bytes.length)throw new Error('The presentation contains too many files.');
 const data=new Map<string,string>();let pos=centralOffset;
 for(let i=0;i<count;i++){
  if(pos+46>bytes.length||read32(bytes,pos)!==0x02014b50)throw new Error('Invalid PowerPoint archive.');
  const flag=read16(bytes,pos+8),method=read16(bytes,pos+10),compressed=read32(bytes,pos+20),uncompressed=read32(bytes,pos+24);
  const nameSize=read16(bytes,pos+28),extra=read16(bytes,pos+30),comment=read16(bytes,pos+32),localOffset=read32(bytes,pos+42);
  if(pos+46+nameSize+extra+comment>bytes.length)throw new Error('Malformed PowerPoint archive.');
  const name=bytes.toString('utf8',pos+46,pos+46+nameSize);
  pos+=46+nameSize+extra+comment;
  if(!/^ppt\/slides\/slide\d+\.xml$/.test(name))continue;
  if(flag&1||![0,8].includes(method)||uncompressed>MAX_INFLATED_ENTRY||compressed>MAX_DECK_SIZE||localOffset+30>bytes.length||read32(bytes,localOffset)!==0x04034b50)throw new Error('Unsupported or unsafe slide content.');
  const localNameSize=read16(bytes,localOffset+26),localExtra=read16(bytes,localOffset+28),start=localOffset+30+localNameSize+localExtra;
  if(start+compressed>bytes.length)throw new Error('Malformed slide content.');
  const blob=bytes.subarray(start,start+compressed);
  const xml=method===0?blob:inflateRawSync(blob,{maxOutputLength:MAX_INFLATED_ENTRY});
  if(xml.length>MAX_INFLATED_ENTRY||xml.length!==uncompressed)throw new Error('Invalid PowerPoint compression.');
  data.set(name,xml.toString('utf8'));
  if(data.size>MAX_SLIDES)throw new Error('Presentation exceeds the 60-slide limit.');
 }
 return data;
}
export function parsePowerPoint(buffer:Buffer):PresentationSlide[]{
 const content=entries(buffer);
 const slides=[...content.entries()].map(([name,xml])=>{
  const number=Number(name.match(/slide(\d+)\.xml$/)?.[1]||0);
  const blocks=[...xml.matchAll(/<a:p\b[^>]*>([\s\S]*?)<\/a:p>/g)].map(m=>[...m[1].matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)].map(t=>decodeXml(t[1])).join('').trim()).filter(Boolean);
  // Some slide generators omit normal paragraphs: read text runs directly.
  if(!blocks.length)blocks.push(...[...xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)].map(m=>decodeXml(m[1]).trim()).filter(Boolean));
  return {number,id:`slide-${number}`,title:safeLabel(blocks[0]||`Slide ${number}`),body:blocks.join('\n').slice(0,1800),notes:''};
 }).sort((a,b)=>a.number-b.number).map(({number,...slide})=>slide);
 if(!slides.length)throw new Error('No readable PowerPoint slides were found.');
 return slides;
}

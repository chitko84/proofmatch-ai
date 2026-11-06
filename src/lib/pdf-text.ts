import {inflateSync} from 'node:zlib';
/** Best-effort server-side embedded-text extraction with no third-party runtime dependencies.
 * Compressed simple text PDFs are supported. Nonstandard fonts, scanned PDFs, and encrypted
 * files require the configured Gemini PDF service or manual paste. */
function decodePdfString(input:string){return input.replace(/\\([nrtbf()\\]|\r\n|\r|\n|[0-7]{1,3})/g,(_,escape:string)=>{
 if(/^[0-7]/.test(escape))return String.fromCharCode(parseInt(escape,8));
 return ({n:'\n',r:'\r',t:'\t',b:'',f:'','(':'(',')':')','\\':'\\'} as Record<string,string>)[escape]??'';
})}
function getStrings(content:string):string[]{
 const parts:string[]=[];
 // Only parse text-showing operators inside BT/ET blocks, never metadata or PDF instructions.
 for(const section of content.matchAll(/\bBT\b([\s\S]*?)\bET\b/g)){
  const body=section[1];const tokens=body.matchAll(/(\((?:\\.|[^\\)])*\)|<([\da-fA-F]{4,})>)\s*Tj\b|\[((?:[^\]]|\][^\s])*?)\]\s*TJ\b/g);
  for(const token of tokens){
   const chunk=token[3]||token[1];const nested=chunk.matchAll(/\((?:\\.|[^\\)])*\)|<[\da-fA-F]{4,}>/g);
   for(const inner of nested){const s=inner[0];let value='';
    if(s.startsWith('('))value=decodePdfString(s.slice(1,-1));
    else {const bytes=Buffer.from(s.slice(1,-1),'hex');value=bytes.length>1&&bytes[0]===0&&bytes.every((b,i)=>i%2===0?b===0:true)?Array.from({length:bytes.length/2},(_,i)=>String.fromCharCode(bytes[i*2+1])).join(''):bytes.toString('latin1')}
    if(value.trim())parts.push(value);
   }
  }
 }
 return parts;
}
function decodeAscii85(encoded:Buffer):Buffer{
 const out:number[]=[];let group:number[]=[];
 for(const ch of encoded.toString('latin1')){
  if(ch==='~')break;
  if(/\s/.test(ch))continue;
  if(ch==='z'&&group.length===0){out.push(0,0,0,0);continue}
  const value=ch.charCodeAt(0)-33;if(value<0||value>84)continue;
  group.push(value);
  if(group.length===5){let n=0;for(const digit of group)n=n*85+digit;
   out.push((n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255);group=[]}
 }
 if(group.length>1){const len=group.length;while(group.length<5)group.push(84);
  let n=0;for(const digit of group)n=n*85+digit;
  out.push(...[(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255].slice(0,len-1));
 }
 return Buffer.from(out);
}
export function extractEmbeddedPdfText(pdf:Buffer):string{
 if(!pdf.subarray(0,8).toString('latin1').includes('%PDF-'))throw new Error('The uploaded file is not a valid PDF.');
 const file=pdf.toString('latin1');const collected:string[]=[];
 // Limit decompression to file-sized streams and bound output to protect memory.
 for(const m of file.matchAll(/\bstream\r?\n/g)){
  const pos=m.index+m[0].length,end=file.indexOf('endstream',pos);if(end<0||end-pos>3_000_000)continue;
  const dict=file.slice(Math.max(0,m.index-500),m.index);let raw=pdf.subarray(pos,end);while(raw.length&&[10,13].includes(raw[raw.length-1]))raw=raw.subarray(0,-1);
  if(/\/ASCII85Decode/.test(dict))try{raw=decodeAscii85(raw)}catch{continue}
  if(/\/FlateDecode/.test(dict))try{raw=inflateSync(raw,{maxOutputLength:2_000_000})}catch{continue}
  const block=raw.toString('latin1');
  collected.push(...getStrings(block));if(collected.join('').length>30000)break;
 }
 const text=collected.join(' ').replace(/[\x00-\x08\x0e-\x1f]/g,' ').replace(/\s{2,}/g,' ').trim();
 return text.slice(0,25000);
}

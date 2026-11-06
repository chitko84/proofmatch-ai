/** Browser-only export functions. DOCX is an actual OOXML package; PDF uses the browser print-to-PDF workflow. */
const encoder=new TextEncoder();
function xmlEscape(value:string){return value.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
function htmlEscape(value:string){return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let i=0;i<8;i++)c=c&1?0xedb88320^(c>>>1):c>>>1;return c>>>0});
function crc32(bytes:Uint8Array){let c=0xffffffff;for(const n of bytes)c=crcTable[(c^n)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function u16(value:number){return [value&255,(value>>>8)&255]}
function u32(value:number){return [value&255,(value>>>8)&255,(value>>>16)&255,(value>>>24)&255]}
function packZip(entries:{name:string;content:string}[]):Uint8Array{
 const local:number[]=[],central:number[]=[];let offset=0;
 for(const entry of entries){const filename=encoder.encode(entry.name),body=encoder.encode(entry.content),crc=crc32(body);
  const head=[...u32(0x04034b50),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(body.length),...u32(body.length),...u16(filename.length),...u16(0)];
  local.push(...head,...filename,...body);
  central.push(...u32(0x02014b50),...u16(20),...u16(20),...u16(0x0800),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(body.length),...u32(body.length),...u16(filename.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...filename);
  offset+=head.length+filename.length+body.length;
 }
 const end=[...u32(0x06054b50),...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(central.length),...u32(local.length),...u16(0)];
 return Uint8Array.from([...local,...central,...end]);
}
function isHeading(line:string){return line.trim().length>0&&line.trim().length<45&&(/^[A-Z][A-Z\s&/]+$/.test(line.trim())||/^(Dear |Sincerely,)/i.test(line))}
export function createDocx(text:string,title='ProofMatch AI — Application Document'):Uint8Array{
 if(!text.trim())throw new Error('There is no document content to export.');
 const paragraphs=text.replace(/\r\n?/g,'\n').split('\n').map(line=>{
  const titleLine=isHeading(line);const size=titleLine?'26':'22';
  const properties=titleLine?`<w:pPr><w:spacing w:before="175" w:after="110"/><w:keepNext/></w:pPr>`:`<w:pPr><w:spacing w:after="75"/></w:pPr>`;
  return `<w:p>${properties}<w:r><w:rPr><w:rFonts w:ascii="Aptos" w:hAnsi="Aptos" w:eastAsia="DengXian"/><w:sz w:val="${size}"/>${titleLine?'<w:b/><w:color w:val="086A60"/>':''}</w:rPr><w:t xml:space="preserve">${xmlEscape(line||' ')}</w:t></w:r></w:p>`;
 }).join('');
 const document=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1000" w:right="1050" w:bottom="1000" w:left="1050"/></w:sectPr></w:body></w:document>`;
 const contentTypes=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/></Types>`;
 const rels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/></Relationships>`;
 const core=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>${xmlEscape(title)}</dc:title><dc:creator>ProofMatch AI</dc:creator></cp:coreProperties>`;
 return packZip([{name:'[Content_Types].xml',content:contentTypes},{name:'_rels/.rels',content:rels},{name:'word/document.xml',content:document},{name:'docProps/core.xml',content:core}]);
}
function saveBlob(blob:Blob,filename:string){const uri=URL.createObjectURL(blob);const a=document.createElement('a');a.href=uri;a.download=filename;a.click();window.setTimeout(()=>URL.revokeObjectURL(uri),1500)}
export function downloadDocx(text:string,name:string){const bytes=createDocx(text,name);saveBlob(new Blob([bytes.buffer as ArrayBuffer],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}),name+'.docx')}
export function downloadPlainText(text:string,name:string){saveBlob(new Blob([text],{type:'text/plain;charset=utf-8'}),name+'.txt')}
export function printToPdf(text:string,title:string){
 if(!text.trim())throw new Error('There is no document content to print.');
 const frame=document.createElement('iframe');frame.setAttribute('aria-hidden','true');frame.style.position='fixed';frame.style.height='0';frame.style.width='0';frame.style.border='0';document.body.appendChild(frame);
 const doc=frame.contentDocument;if(!doc){frame.remove();throw new Error('This browser does not support document printing.')}
 const body=text.replace(/\r\n?/g,'\n').split('\n').map(line=>`<p class="${isHeading(line)?'heading':'line'}">${htmlEscape(line)||'&nbsp;'}</p>`).join('');
 doc.open();doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${htmlEscape(title)}</title><style>@page{size:A4;margin:21mm}body{font-family:Arial,'Noto Sans',sans-serif;font-size:11pt;color:#183a47;line-height:1.5}p{margin:0 0 5pt;white-space:pre-wrap;overflow-wrap:break-word}.heading{color:#117b6a;font-weight:700;margin:16pt 0 7pt}h1{font-size:18pt}</style></head><body>${body}</body></html>`);doc.close();
 window.setTimeout(()=>{try{frame.contentWindow?.focus();frame.contentWindow?.print()}finally{window.setTimeout(()=>frame.remove(),6000)}},250);
}

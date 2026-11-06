/** Local, dependency-free CSV analytics. Uploaded data stays on the user's device. */
export type CsvDataset={headers:string[];rows:string[][];filename:string};
export type ChartType='bar'|'horizontal'|'line'|'area'|'pie'|'donut'|'scatter';
export type Aggregate='sum'|'average'|'count'|'min'|'max';
export type ChartPoint={label:string;value:number;count:number;secondary?:number};
export const MAX_CSV_BYTES=2_000_000;
export const MAX_CSV_ROWS=5000;
export const CHART_TYPES:ChartType[]=['bar','horizontal','line','area','pie','donut','scatter'];
export const SAMPLE_CSV=`Department,Month,Applications,Interviews,Offers\nTechnology,January,128,44,12\nHealthcare,January,87,34,9\nEducation,January,75,31,11\nFinance,January,92,39,10\nMarketing,January,64,23,6\nTechnology,February,155,52,18\nHealthcare,February,96,38,12\nEducation,February,82,34,13\nFinance,February,103,42,14\nMarketing,February,72,28,8\nTechnology,March,173,63,22\nHealthcare,March,110,45,15\nEducation,March,92,38,14\nFinance,March,112,48,17\nMarketing,March,85,34,11`;
export function parseCsv(csv:string,filename='Untitled.csv'):CsvDataset{
 if(!csv.trim())throw new Error('This CSV file is empty.');
 if(new TextEncoder().encode(csv).byteLength>MAX_CSV_BYTES)throw new Error('CSV exceeds the 2 MB upload limit.');
 const rows:string[][]=[];let row:string[]=[],field='',quoted=false,atStart=true;
 const value=csv.replace(/^\uFEFF/,'');
 for(let i=0;i<value.length;i++){
  const c=value[i];
  if(quoted){if(c==='"'&&value[i+1]==='"'){field+='"';i++}else if(c==='"'){quoted=false}else field+=c;continue}
  if(c==='"'&&atStart){quoted=true;atStart=false;continue}
  if(c===','){row.push(field.trim());field='';atStart=true;continue}
  if(c==='\r'||c==='\n'){
   row.push(field.trim());field='';atStart=true;
   if(row.some(s=>s!=='')){rows.push(row);if(rows.length>MAX_CSV_ROWS+1)throw new Error('CSV exceeds the 5,000-row limit.')}row=[];
   if(c==='\r'&&value[i+1]==='\n')i++;
   continue;
  }
  field+=c;atStart=false;
 }
 if(quoted)throw new Error('The CSV contains an unclosed quoted field.');
 row.push(field.trim());if(row.some(s=>s!==''))rows.push(row);
 if(rows.length<2)throw new Error('Add a header row and at least one data row.');
 if(rows.length>MAX_CSV_ROWS+1)throw new Error('CSV exceeds the 5,000-row limit.');
 const rawHeaders=rows.shift()!;
 if(rawHeaders.length>60)throw new Error('CSV has too many columns (maximum 60).');
 if(rawHeaders.some(s=>!s))throw new Error('All CSV columns need a name.');
 const dedup=new Map<string,number>();
 const headers=rawHeaders.map(h=>{const count=(dedup.get(h)||0)+1;dedup.set(h,count);return count>1?`${h} (${count})`:h});
 const data=rows.map((r,i)=>{if(r.length>headers.length)throw new Error(`Row ${i+2} has more values than the header.`);return headers.map((_,k)=>r[k]||'')});
 return {filename:filename.slice(0,180),headers,rows:data};
}
export function asNumber(text:string):number|null{
 const s=text.trim().replace(/^(RM|USD|MYR|\$|£|€)\s*/i,'').replace(/,/g,'').replace(/%$/,'');
 if(!s||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?$/i.test(s))return null;
 const n=Number(s);return Number.isFinite(n)?n:null;
}
export function numericColumns(dataset:CsvDataset):string[]{return dataset.headers.filter((_,i)=>{
 const filled=dataset.rows.map(row=>row[i]).filter(Boolean);
 return filled.length>0&&filled.filter(v=>asNumber(v)!==null).length/filled.length>=.75;
})}
export function buildChartData(dataset:CsvDataset,x:string,y:string,aggregation:Aggregate,search='',limit=16,order:'value'|'original'='value'):ChartPoint[]{
 const xi=dataset.headers.indexOf(x),yi=dataset.headers.indexOf(y);
 if(xi<0)throw new Error('Choose a valid category column.');
 if(aggregation!=='count'&&yi<0)throw new Error('Choose a valid numerical column.');
 const filtered=dataset.rows.filter(row=>!search||row.some(v=>v.toLowerCase().includes(search.toLowerCase().trim())));
 const grouped=new Map<string,number[]>();
 for(const row of filtered){const label=row[xi]||'(Blank)';
  const n=aggregation==='count'?1:asNumber(row[yi]||'');if(n===null)continue;
  if(!grouped.has(label))grouped.set(label,[]);grouped.get(label)!.push(n);
 }
 const points=Array.from(grouped,([label,values])=>({label,count:values.length,value:aggregation==='count'?values.length:aggregation==='sum'?values.reduce((a,b)=>a+b,0):aggregation==='average'?values.reduce((a,b)=>a+b,0)/values.length:aggregation==='min'?Math.min(...values):Math.max(...values)}));
 return (order==='original'?points:points.sort((a,b)=>b.value-a.value)).slice(0,Math.max(1,Math.min(limit,60)));
}
export function scatterData(dataset:CsvDataset,x:string,y:string,search='',max=160):ChartPoint[]{
 const xi=dataset.headers.indexOf(x),yi=dataset.headers.indexOf(y);if(xi<0||yi<0)throw new Error('Select two numeric columns.');
 return dataset.rows.filter(row=>!search||row.some(v=>v.toLowerCase().includes(search.toLowerCase().trim()))).flatMap((row,index)=>{
  const xv=asNumber(row[xi]||''),yv=asNumber(row[yi]||'');return xv===null||yv===null?[]:[{label:`Row ${index+2}`,value:yv,count:1,secondary:xv}];
 }).slice(0,max);
}
export function csvEscape(s:string):string{const safe=/^[=+@\-\t\r]/.test(s)?`'${s}`:s;return /[",\r\n]/.test(safe)?`"${safe.replace(/"/g,'""')}"`:safe}
export function chartDataCsv(data:ChartPoint[]):string{
 const scatter=data.some(p=>p.secondary!==undefined);return [scatter?'Row,X,Y':'Category,Value,Records',...data.map(p=>(scatter?[p.label,p.secondary??0,p.value]:[p.label,p.value,p.count]).map(s=>csvEscape(String(s))).join(','))].join('\r\n')
}

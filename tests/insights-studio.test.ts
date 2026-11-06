import assert from 'node:assert/strict';
import test from 'node:test';
import {parseCsv,buildChartData,numericColumns,scatterData,asNumber,chartDataCsv,SAMPLE_CSV} from '../src/lib/insights-studio.ts';
import {analyzeResume,findSkillMention} from '../src/lib/resume-insights.ts';
import {extractEmbeddedPdfText} from '../src/lib/pdf-text.ts';
import {deflateSync} from 'node:zlib';
test('CSV handles quoted commas, embedded newlines, escaped quotes, BOM and CRLF',()=>{
 const data=parseCsv('\uFEFFName,Value,Note\r\n"Jane, Doe",25,"line one\nline two"\r\n"Jo""e",30,ok\r\n');
 assert.equal(data.rows.length,2);assert.equal(data.rows[0][0],'Jane, Doe');assert.equal(data.rows[0][2],'line one\nline two');assert.equal(data.rows[1][0],'Jo"e');
});
test('CSV rejects malformed or oversized datasets',()=>{
 assert.throws(()=>parseCsv('A,B\n"unclosed,3'),/unclosed/);
 assert.throws(()=>parseCsv('A,B\n1,2,3'),/more values/);
 assert.throws(()=>parseCsv('A,B'),/data row/);
});
test('CSV computes aggregations, numeric fields and row filters',()=>{
 const dataset=parseCsv(SAMPLE_CSV);
 assert.ok(numericColumns(dataset).includes('Applications'));
 const point=buildChartData(dataset,'Department','Applications','sum').find(p=>p.label==='Technology');
 assert.equal(point?.value,456);assert.equal(point?.count,3);
 assert.equal(buildChartData(dataset,'Department','Applications','count','March').length,5);
 assert.equal(scatterData(dataset,'Applications','Offers').length,15);
 assert.equal(asNumber('RM 1,200.50'),1200.5);
 assert.match(chartDataCsv([{label:'Finance, Banking',value:10,count:2}]),/"Finance, Banking"/);
});
test('resume matches role skills from cited document excerpts, not arbitrary inferred ability',()=>{
 const document='I used SQL, Excel and Power BI for a reporting dashboard. My project involved data cleaning and stakeholder communication for a student research project.';
 const result=analyzeResume(document);
 assert.equal(result.length>=80,true);
 const dataRole=result.find(r=>r.id==='analyst');assert.ok(dataRole&&dataRole.covered>=2);
 assert.ok(dataRole!.matches.every(m=>m.excerpt.length>0));
 assert.equal(findSkillMention('I worked on JavaScript apps','Java'),null);
 assert.ok(analyzeResume(document,'Technology').every(r=>r.sector==='Technology'));
});
test('embedded PDF text extraction supports compressed PDF content streams',()=>{
 const text='BT /F1 12 Tf (Python projects and SQL analysis, reports and testing.) Tj ET';
 const compressed=deflateSync(Buffer.from(text));
 const bytes=Buffer.concat([Buffer.from('%PDF-1.4\n1 0 obj <</Length 100 /Filter /FlateDecode>>\nstream\n'),compressed,Buffer.from('\nendstream\nendobj\n%%EOF')]);
 assert.match(extractEmbeddedPdfText(bytes),/Python projects and SQL analysis/);
});
test('time series preserves original category order rather than sorting by volume',()=>{
 const data=parseCsv('Month,Value\nJanuary,40\nFebruary,90\nMarch,12');
 assert.deepEqual(buildChartData(data,'Month','Value','sum','',10,'original').map(p=>p.label),['January','February','March']);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {cleanNewsDescription,decodeXmlText,newsPhotoFor,parseCareerNewsRss} from '../src/lib/career-news.ts';

test('Google News RSS encoded anchor previews never display HTML, tracking URLs or publisher font tags',()=>{
 const description='&lt;a href="https://news.google.com/rss/articles/CBMabc" target="_blank"&gt;Jobs in Malaysia&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;The Daily Star&lt;/font&gt;';
 assert.equal(cleanNewsDescription(description),'');
 assert.equal(cleanNewsDescription(description.replaceAll('&lt;','&amp;lt;').replaceAll('&gt;','&amp;gt;')),'');
 const xml=`<rss><channel><item><title>Jobs in Malaysia - The Daily Star</title><link>https://news.google.com/rss/articles/abc</link><pubDate>Fri, 06 Nov 2026 05:00:00 GMT</pubDate><source url="https://example.com">The Daily Star</source><description>${description.replaceAll('&','&amp;')}</description></item></channel></rss>`;
 const news=parseCareerNewsRss(xml);
 assert.equal(news.length,1);
 assert.equal(news[0].title,'Jobs in Malaysia');
 assert.equal(news[0].description,'');
});
test('Editorial descriptions retain actual prose but remove HTML and visible links',()=>{
 assert.equal(decodeXmlText('&lt;b&gt;Hiring&lt;/b&gt; &amp;amp; opportunities'), 'Hiring & opportunities');
 assert.equal(cleanNewsDescription('New employees are being hired across five locations.'),'New employees are being hired across five locations.');
 assert.doesNotMatch(cleanNewsDescription('Read more https://news.google.com/rss/articles/abc'), /https?:|<a/);
});
test('All career news cards have curated non-HTML, real-photo thumbnails',()=>{
 const newsPage=readFileSync(new URL('../src/app/demo/news/page.tsx',import.meta.url),'utf8');
 assert.match(newsPage,/newsPhotoFor\(feature\)/);
 assert.match(newsPage,/newsPhotoFor\(n\)/);
 assert.match(newsPage,/loading="lazy"/);
 for(const term of ['Malaysia job hiring','University skills training','Healthcare vacancies','Finance economic report']){
  const url=newsPhotoFor({title:term,publisher:'News Desk',category:'All'});
  assert.match(url,/^https:\/\/images\.unsplash\.com\/photo-/);
 }
});
test('Navigation has route warmup and translation avoids English whole-body observation',()=>{
 const shell=readFileSync(new URL('../src/components/workspace-shell.tsx',import.meta.url),'utf8');
 const language=readFileSync(new URL('../src/components/language-provider.tsx',import.meta.url),'utf8');
 assert.match(shell,/warmRoute\(target\)/);
 assert.match(shell,/onMouseEnter=\{\(\)=>warmRoute\(item\.href\)\}/);
 assert.match(language,/if\(locale==='en'&&priorLocale==='en'\)return/);
 assert.match(language,/if\(locale==='en'\)return/);
});

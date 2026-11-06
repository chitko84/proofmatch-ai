import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCareerNewsRss,NEWS_CATEGORIES,newsRssUrl} from '../src/lib/career-news.ts';
import {CLINIC_SAMPLES,evaluateResume} from '../src/lib/resume-clinic.ts';
import {SEEDED_ARTICLES,articleGuide} from '../src/lib/career-articles.ts';
import {lookupTranslation,curatedPhraseCount} from '../src/lib/i18n.ts';
test('RSS news parser retains source and date and rejects insecure URLs',()=>{
 const xml=`<rss><channel><item><title>Malaysia &amp; jobs update</title><link>https://news.google.com/rss/articles/abc</link><pubDate>Tue, 03 Nov 2026 08:00:00 GMT</pubDate><source url="https://example.org">Career Journal</source><description><![CDATA[Fresh hiring and careers.]]></description></item><item><title>Unsafe link</title><link>javascript:alert(1)</link><pubDate>Tue, 03 Nov 2026 08:00:00 GMT</pubDate></item></channel></rss>`;
 const result=parseCareerNewsRss(xml);assert.equal(result.length,1);assert.equal(result[0].publisher,'Career Journal');assert.match(result[0].title,/Malaysia & jobs update/);assert.ok(result[0].publishedAt.startsWith('2026-11-03'));assert.equal(result[0].description,'Fresh hiring and careers.');
});
test('news source query is server controlled and supports each section',()=>{for(const category of NEWS_CATEGORIES){assert.match(newsRssUrl(category),/^https:\/\/news\.google\.com\/rss\/search\?/);assert.ok(newsRssUrl(category).includes('ceid=MY:en'));}});
test('resume clinic returns actionable checks and role alignments for business and healthcare',()=>{
 for(const [sector,text] of Object.entries(CLINIC_SAMPLES)){const review=evaluateResume(text,sector);assert.ok(review.wordCount>40);assert.ok(review.score>=0&&review.score<=100);assert.ok(review.checks.length>=8);assert.ok(review.roles.some(r=>r.sector===sector));assert.ok(review.checks.some(c=>c.id==='experience'&&c.status==='good'));}
});
test('resume clinic rejects empty input and does not hallucinate matching qualifications',()=>{
 assert.throws(()=>evaluateResume('a few words'),/at least 75/);const review=evaluateResume('Personal details of an applicant. '.repeat(8));assert.ok(review.roles.every(r=>r.matches.every(m=>m.excerpt.length>0)));assert.equal(review.checks.find(c=>c.id==='education')?.status,'improve');
});
test('career article library and editorial career guides have unique stable pages',()=>{assert.ok(SEEDED_ARTICLES.length>=15);assert.equal(new Set(SEEDED_ARTICLES.map(a=>a.id)).size,SEEDED_ARTICLES.length);assert.ok(SEEDED_ARTICLES.every(a=>a.body.length>200&&a.cover.startsWith('/network/covers/')));assert.equal(articleGuide('guide-evidence-first-cv')?.category,'Career Skills');});
test('offline new candidate navigation works in all four languages',()=>{for(const locale of ['ms','ta','zh'] as const){for(const phrase of ['Career News','Résumé Clinic','Career Stories','Write an article','Analyze résumé']){assert.notEqual(lookupTranslation(phrase,locale),null)}}assert.ok(curatedPhraseCount()>900)});

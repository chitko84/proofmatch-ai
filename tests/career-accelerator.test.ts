import test from 'node:test';
import assert from 'node:assert/strict';
import {CAREER_QUESTIONS,CAREER_QUIZ_CATEGORIES,buildQuizRound,pointsForAnswer,careerQuizTier,QUIZ_MODES} from '../src/lib/accelerator-quiz.ts';
import {PANEL_EPISODES,PANEL_SPEAKERS} from '../src/lib/accelerator-podcast.ts';
import {WORKSHOP_STEPS,WORKSHOP_ARTICLE_ID} from '../src/lib/accelerator-workshop.ts';
import {SEEDED_ARTICLES} from '../src/lib/career-articles.ts';
import {readFileSync} from 'node:fs';

test('career quiz contains at least 120 distinct cross-industry questions',()=>{
 assert.equal(CAREER_QUESTIONS.length,120);
 assert.equal(new Set(CAREER_QUESTIONS.map(q=>q.id)).size,120);
 assert.equal(new Set(CAREER_QUESTIONS.map(q=>q.prompt)).size,120);
 assert.equal(CAREER_QUIZ_CATEGORIES.length,12);
 for(const category of CAREER_QUIZ_CATEGORIES)assert.equal(CAREER_QUESTIONS.filter(q=>q.category===category).length,10);
});
test('every quiz question has four distinct options, exactly one valid answer, clear explanation',()=>{
 for(const q of CAREER_QUESTIONS){assert.equal(q.options.length,4,q.id);assert.equal(new Set(q.options).size,4,q.id);assert.ok(q.correctIndex>=0&&q.correctIndex<=3,q.id);assert.ok(q.prompt.length>=25,q.id);assert.ok(q.explanation.length>=22,q.id);assert.ok(q.options.every(a=>a.trim().length>=3),q.id)}
});
test('quiz selection covers quick, challenge, marathon and complete modes deterministically',()=>{
 for(const m of QUIZ_MODES){const q=buildQuizRound({category:'All industries',mode:m.id,seed:44});assert.equal(q.length,m.count);assert.deepEqual(q.map(x=>x.id),buildQuizRound({category:'All industries',mode:m.id,seed:44}).map(x=>x.id));assert.equal(new Set(q.map(x=>x.id)).size,m.count)}
 assert.equal(buildQuizRound({category:'Finance & Business',mode:'complete',seed:44}).length,10);
 const retry=buildQuizRound({category:'All industries',mode:'complete',seed:1,retryIds:['career-01-01','career-02-02']});assert.equal(retry.length,2);
});
test('scoring and result tiers reflect actual performance',()=>{
 assert.equal(pointsForAnswer(false,8,30),0);
 assert.ok(pointsForAnswer(true,5,30)>pointsForAnswer(true,0,30));
 assert.equal(careerQuizTier(9,10),'Career Visionary');assert.equal(careerQuizTier(8,10),'Future Pathfinder');assert.equal(careerQuizTier(5,10),'Rising Explorer');assert.equal(careerQuizTier(0,10),'Curious Starter');
});
test('panel scripts contain real speaker-specific exchanges',()=>{
 assert.equal(PANEL_EPISODES.length,3);const known=new Set(PANEL_SPEAKERS.map(s=>s.id));
 for(const ep of PANEL_EPISODES){assert.ok(ep.lines.length>=12);assert.ok(ep.lines.every(l=>known.has(l.speaker)&&l.text.length>=35));assert.ok(new Set(ep.lines.map(l=>l.speaker)).size>=3)}
});
test('CV workshop and editorial article share one stable route',()=>{
 assert.equal(new Set(WORKSHOP_STEPS.map(x=>x.id)).size,WORKSHOP_STEPS.length);
 assert.ok(WORKSHOP_STEPS.length>=8);
 const article=SEEDED_ARTICLES.find(a=>a.id===WORKSHOP_ARTICLE_ID);assert.ok(article);assert.ok(article.body.length>2500);assert.match(article.body,/Interview don.t/i);
});
test.skip('accelerator is wired to sidebar, candidate space, career hub and article reader',()=>{
 const shell=readFileSync('src/components/workspace-shell.tsx','utf8');const candidate=readFileSync('src/app/demo/candidate/page.tsx','utf8');const career=readFileSync('src/app/demo/career/page.tsx','utf8');const reader=readFileSync('src/app/demo/network/articles/[id]/page.tsx','utf8');
 for(const text of [shell,candidate,career])assert.match(text,/\/demo\/career\/accelerator/);
 assert.match(reader,/p\.startsWith\('## '\)/);
});
test('CV workshop is featured in Career Ledger and translated navigation is available in four languages',async()=>{
 const news=readFileSync('src/app/demo/news/page.tsx','utf8');assert.match(news,/cn-accelerator-feature/);
 const {lookupTranslation,curatedPhraseCount}=await import('../src/lib/i18n.ts');
 for(const lang of ['ms','ta','zh'] as const){assert.ok(lookupTranslation('Career Accelerator',lang));assert.notEqual(lookupTranslation('Career Accelerator',lang),'Career Accelerator');assert.ok(lookupTranslation('Enter the arena',lang));}
 assert.ok(curatedPhraseCount()>900);
});

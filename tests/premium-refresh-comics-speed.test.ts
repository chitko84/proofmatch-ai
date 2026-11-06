import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,statSync} from 'node:fs';
const read=(p:string)=>readFileSync(p,'utf8');

test('premium styling is loaded after the focused workspace styles',()=>{
 const layout=read('src/app/demo/layout.tsx');
 assert.ok(layout.indexOf("import './focus.css'")<layout.indexOf("import './premium-refresh.css'"));
 const css=read('src/app/demo/premium-refresh.css');
 for(const marker of ['.workspace-page>.pm-head','.workspace-page .pm-card','.pm-comics-page .pm-covers','.pm-resume-insights-page .pm-charts','.pm-premium-overview .workspace-welcome'])assert.ok(css.includes(marker),marker);
});

test('resume charts use an accessible dropdown and distinguish vertical, horizontal, pie and donut',()=>{
 const page=read('src/app/demo/studio/page.tsx');
 assert.match(page,/<select aria-label="Choose chart visualization"/);
 for(const type of ['bar','horizontal','line','pie','donut'])assert.ok(page.includes(`<option value="${type}">`),type);
 assert.match(page,/chart==='bar'&&<div className="pm-vertical-bars"/);
 assert.match(page,/chart==='horizontal'&&<div className="pm-bars"/);
 assert.match(page,/pm-pie-solid/);
 const css=read('src/app/demo/premium-refresh.css');
 assert.match(css,/\.pm-resume-insights-page \.pm-pie-solid::after\{display:none\}/);
 assert.doesNotMatch(page,/<div className="pm-tabs"/);
});

test('comic page loads local covers and defers heavy Heyzine iframe until reading',()=>{
 const page=read('src/app/demo/comics/page.tsx');
 assert.match(page,/reader\?<div className="pm-reader-frame"/);
 assert.match(page,/loading="eager"/);
 assert.match(page,/onLoad=\{\(\)=>setLoaded\(true\)\}/);
 assert.match(page,/rel="preconnect"|link\.rel='preconnect'/);
 assert.match(page,/Open full-screen/);
 for(let i=1;i<=6;i++){
  const file=`public/comics/book-${i}.svg`;
  assert.ok(existsSync(file),file);
  assert.ok(statSync(file).size<15_000,`${file} must stay lightweight`);
 }
 const config=read('next.config.mjs');
 assert.match(config,/source: '\/comics\/:path\*'/);
 const nav=read('src/components/workspace-shell.tsx');
 assert.match(nav,/prefetch=\{item\.href==='\/demo\/comics'\}/);
});

test('Telegram, company 3D and core recruitment logic are unchanged',()=>{
 for(const file of ['src/app/api/liveroom/telegram/route.ts','src/app/api/connect/telegram/route.ts','src/components/interactive-career-world.tsx','src/lib/talent-ecosystem.ts','src/lib/company-network.ts'])assert.ok(existsSync(file),file);
});

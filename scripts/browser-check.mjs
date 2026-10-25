/** Real-browser judge rehearsal. Run after `npm run dev` in another terminal.
 * Optional: npm install --no-save playwright && npx playwright install chromium
 */
const base=(process.env.BASE_URL||'http://localhost:3000').replace(/\/$/,'');
let chromium;
try{({chromium}=await import('playwright'))}catch{console.error('Playwright is not installed. Run `npm install --no-save playwright` and `npx playwright install chromium` first.');process.exit(2)}
let browser;let successes=0,failures=[];
try{
 browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1280,height:800},acceptDownloads:true});page.setDefaultTimeout(12000);const uncaught=[];page.on('pageerror',e=>uncaught.push(e.message));
 async function check(name,fn){try{await fn();successes++;console.log(`PASS ${name}`)}catch(e){failures.push(name+': '+(e instanceof Error?e.message:String(e)));console.error('FAIL '+name+': '+(e instanceof Error?e.message:String(e)).slice(0,250))}}
 async function visit(route){await page.goto(base+route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(250)}
 await check('Guided demo page and all nine step links',async()=>{await visit('/demo/guide');await page.getByText('You\'re ready to show how it works.').waitFor();if(await page.locator('.demo-guide-step a').count()!==9)throw Error('Expected nine demo links')});
 await check('Interactive homepage switches between role-specific evidence',async()=>{await visit('/');await page.getByRole('button',{name:/Skip intro/i}).click().catch(()=>{});const choices=page.locator('.talent-role-choice');if(await choices.count()!==3)throw Error('3D explorer must show all three roles');await choices.nth(0).click();const first=await page.locator('.talent-evidence-panel').innerText();await choices.nth(1).click();const second=await page.locator('.talent-evidence-panel').innerText();if(first===second)throw Error('Changing jobs did not change the evidence shown');await page.getByRole('link',{name:/Review Candidate 01 for QA/i}).waitFor()});
 await check('Insights dashboard has data-derived KPIs and all four filters',async()=>{await visit('/demo/insights');await page.getByText('Your talent, at a glance.').waitFor();if(await page.locator('.insight-stat').count()!==4)throw Error('Missing KPI cards');if(await page.locator('.insights-filter-grid select').count()!==4)throw Error('Missing filters');if(await page.locator('.insights-chart-grid .insight-panel').count()!==4)throw Error('Missing charts')});
 await check('Insight filters update actual counts and empty filters provide a reset',async()=>{await visit('/demo/insights');const selects=page.locator('.insights-filter-grid select');await selects.nth(0).selectOption('analyst');await selects.nth(1).selectOption('Kedah');await selects.nth(2).selectOption('onsite');await page.getByText('No examples match.').waitFor();await page.getByRole('button',{name:/Reset filters/i}).click();const count=await page.locator('.insight-stat').first().locator('strong').innerText();if(count!=='8')throw Error('Reset did not restore the eight fictional candidates')});
 await check('One click prepares all fictional presentation records',async()=>{await visit('/demo/guide');await page.getByRole('button',{name:/prepare all demo examples/i}).click();await page.getByText(/Ready!.*HR review/i).waitFor();const saved=await page.evaluate(()=>({reviews:JSON.parse(localStorage.getItem('proofmatch-phase1-reviews')||'{}'),replies:JSON.parse(localStorage.getItem('proofmatch-phase3-replies-v1')||'[]'),invites:JSON.parse(localStorage.getItem('proofmatch-connect-demo-v1')||'[]')}));if(Object.keys(saved.reviews).length<2||saved.replies.length<1||saved.invites.length<2)throw Error('Presentation examples were not saved')});
 await check('Salary and location examples have real text',async()=>{await visit('/demo/expectations?candidate=C08&role=qa');await page.getByRole('button',{name:/show sample salary mismatch/i}).click();await page.getByText(/Salary needs discussion/i).waitFor();await page.getByText(/Candidate's location/i).waitFor()});
 await check('Dashboard ProofWatch evidence link',async()=>{await visit('/demo');await page.getByText('ProofWatch',{exact:false}).first().waitFor();await page.getByRole('link',{name:/start guided demo/i}).first().waitFor()});
 await check('Sample CV autofill and offline match route',async()=>{await visit('/demo/analyze');await page.getByRole('button',{name:/fill sample CV/i}).click();const v=await page.locator('textarea').first().inputValue();if(v.length<40)throw Error('Sample CV not inserted');await page.getByRole('link',{name:/show sample matches/i}).click();await page.getByText('Which role has more supporting evidence?').waitFor()});
 await check('Evidence comparison selectors',async()=>{await visit('/demo/matches?candidate=C01&role=qa');await page.getByText('Why QA Automation Engineer?').waitFor();await page.getByRole('button',{name:/Ask for more details/i}).click();await page.getByText('Saved to').waitFor()});
 await check('Candidate clarification autofill and save',async()=>{await visit('/demo/candidate-reply');await page.getByRole('button',{name:/fill sample explanation/i}).click();if((await page.locator('textarea').first().inputValue()).length<15)throw Error('Empty sample clarification');await page.getByRole('button',{name:/add clarification/i}).click();await page.getByText(/Clarification saved in this browser/i).waitFor()});
 await check('FairShot autofill and save',async()=>{await visit('/demo/fairshot?candidate=C01&role=qa');await page.getByRole('button',{name:/fill sample answer/i}).click();const text=await page.locator('textarea').first().inputValue();if(text.length<35)throw Error('Work example not filled');await page.getByRole('button',{name:/save response for HR review/i}).click();await page.getByText(/Fictional work-sample response saved/i).waitFor()});
 await check('Preferences example',async()=>{await visit('/demo/expectations');await page.getByRole('button',{name:/show sample work-preference mismatch/i}).click();const value=await page.locator('select').first().inputValue();if(value!=='C05')throw Error('Example candidate was not selected')});
 await check('Criteria preview and reset',async()=>{await visit('/demo/criteria');await page.getByRole('button',{name:/try a sample change/i}).click();await page.getByRole('button',{name:/reset preview/i}).click()});
 await check('HR review sample and clear',async()=>{await visit('/demo/reviews');await page.getByRole('button',{name:/load sample HR decisions/i}).click();await page.getByText('Candidate 01').first().waitFor();await page.getByRole('button',{name:/clear my demo decisions/i}).click()});
 await check('Interview picks sample questions',async()=>{await visit('/demo/interview');await page.getByRole('button',{name:/pick two sample questions/i}).click();await page.getByRole('button',{name:/copy 2 chosen questions/i}).waitFor()});
 await check('Candidate Passport fills and saves locally',async()=>{await visit('/passport?candidate=C01&role=qa');await page.getByRole('button',{name:/fill demo reply/i}).click();await page.getByRole('button',{name:/send my response/i}).click();await page.getByText('Thanks for sharing!').waitFor()});
 await check('Browser-only backup invitation works without external services',async()=>{await visit('/demo/connect');await page.getByRole('button',{name:/use browser-only demo/i}).click();await page.getByRole('button',{name:/show sample candidate reply/i}).waitFor();await page.getByRole('button',{name:/show sample candidate reply/i}).click();await page.getByText('Candidate replied').waitFor()});
 await check('Two-tab browser-only invitation saves a reply to its exact demo record',async()=>{
   await visit('/demo/connect');
   await page.getByRole('button',{name:/use browser-only demo/i}).click();
   const link=page.getByRole('link',{name:/open passport/i});
   await link.waitFor();
   const href=await link.getAttribute('href');
   if(!href || !href.includes('&demo='))throw Error('Invitation is missing its exact local record code');
   const second=await page.context().newPage();
   try{
     await second.goto(href,{waitUntil:'domcontentloaded'});
     await second.getByRole('button',{name:/fill demo reply/i}).click();
     await second.getByRole('button',{name:/send my response/i}).click();
     await second.getByText('Thanks for sharing!').waitFor();
     await page.getByText('Candidate replied',{exact:false}).first().waitFor({timeout:6000});
   }finally{await second.close()}
 });
 await check('Recruiter invitation and simulated local reply',async()=>{await visit('/demo/connect');await page.getByRole('button',{name:/use sample opportunity/i}).click();await page.getByRole('button',{name:/prepare invitation/i}).click();await page.getByRole('button',{name:/show sample candidate reply/i}).waitFor();await page.getByRole('button',{name:/show sample candidate reply/i}).click();await page.getByText('Candidate replied').waitFor()});
 await check('LiveRoom: schedule an invitation, accept in candidate tab and exchange messages',async()=>{
   await visit('/demo/meetings');
   await page.getByRole('button',{name:/Schedule invitation/i}).click();
   await page.getByText(/Invitation scheduled!/i).waitFor();
   const candidateLink=page.getByRole('link',{name:/Open candidate message/i});
   const href=await candidateLink.getAttribute('href');if(!href?.startsWith('/invite/meet-'))throw Error('Candidate invitation URL missing');
   const candidateTab=await page.context().newPage();
   try{
    await candidateTab.goto(base+href,{waitUntil:'domcontentloaded'});
    await candidateTab.getByRole('button',{name:/Yes, I'll join/i}).click();
    await candidateTab.getByText(/Your attendance is confirmed/i).waitFor();
    await page.getByText('Accepted · ready to discuss').first().waitFor({timeout:9000});
    await page.getByRole('link',{name:/Enter LiveRoom/i}).first().click();
    await page.getByText(/Let's talk/i).first().waitFor();
    await page.getByRole('button',{name:/Join practice meeting/i}).click();
    await page.getByRole('textbox',{name:/Write a message/i}).fill('Hello from HR');
    await page.getByRole('button',{name:/Send$/i}).click();
    const other=await page.context().newPage();
    try{await other.goto(base+href.replace('/invite/','/liveroom/')+'?as=candidate',{waitUntil:'domcontentloaded'});
     await other.getByText('Hello from HR').waitFor();
     await other.getByRole('button',{name:/Join practice meeting/i}).click();
     await other.getByRole('textbox',{name:/Write a message/i}).fill('Hello from the candidate');
     await other.getByRole('button',{name:/Send$/i}).click();
     await page.getByText('Hello from the candidate').waitFor({timeout:9000});
    }finally{await other.close()}
   }finally{await candidateTab.close()}
 });
 await check('Candidate can request another time and recruiter can confirm',async()=>{
   await visit('/demo/meetings');await page.getByRole('button',{name:/Schedule invitation/i}).click();
   const href=await page.getByRole('link',{name:/Open candidate message/i}).getAttribute('href');if(!href)throw Error('No invitation');
   const second=await page.context().newPage();try{await second.goto(base+href);await second.locator('input[type=datetime-local]').fill('2026-12-05T11:30');await second.getByRole('button',{name:/Request another time/i}).click();await second.getByText(/suggested time is now visible/i).waitFor();
    await page.getByRole('button',{name:/Confirm new time/i}).first().waitFor({timeout:9000});await page.getByRole('button',{name:/Confirm new time/i}).first().click();
    await page.getByText('New meeting time confirmed',{exact:false}).waitFor();
   }finally{await second.close()}
 });
 await check('Practice meeting can complete a full scripted conversation and download notes',async()=>{
   await visit('/demo/meetings');await page.getByRole('button',{name:/Load ready-to-show example/i}).click();
   await page.getByRole('link',{name:/Enter LiveRoom/i}).first().click();
   await page.getByRole('button',{name:/Join practice meeting/i}).click();
   await page.getByRole('button',{name:/Play sample conversation/i}).click();
   await page.getByText(/three fictional conversation examples were added/i).waitFor();
   await page.getByRole('button',{name:/Finish meeting/i}).click();
   await page.getByText(/Meeting practice complete/i).waitFor();
   await page.getByRole('button',{name:/Download discussion notes/i}).waitFor();
 });
 await check('Mira sample answer needs no API key',async()=>{await visit('/demo/mira?candidate=C01&role=qa');await page.getByRole('button',{name:/hear Mira speak/i}).waitFor();await page.getByRole('button',{name:/Instant guided answers/i}).click();await page.getByRole('button',{name:/show a sample Mira reply/i}).click();await page.getByText('Fictional sample guidance').first().waitFor()});
 await check('FuturePath sample explanation needs no API key',async()=>{await visit('/demo/futurepath');await page.getByRole('button',{name:/show sample explanation/i}).click();await page.getByText('Instant fictional demo').waitFor()});
 await check('QR scanner camera policy permits this website',async()=>{const response=await page.request.get(base+'/demo/scan');if(!response.ok())throw Error('Scanner page not available');const policy=response.headers()['permissions-policy']||'';if(!/(?:^|,)\s*camera=\(self\)/.test(policy))throw Error('Website blocks its own camera access: '+policy)});
 await check('QR scanner demo invitation',async()=>{await visit('/demo/scan');await page.getByRole('button',{name:/use sample QR invitation/i}).click();await page.getByText(/Invitation found!/i).waitFor();await page.getByRole('link',{name:/open invitation/i}).click();await page.getByText('Another opportunity might suit you.').waitFor()});
 await check('QR scanner rejects unsafe external link',async()=>{await visit('/demo/scan');await page.getByLabel('Already have an invitation link?').fill('https://another-example.com/passport?candidate=C01&role=qa');await page.getByRole('button',{name:/check link/i}).click();await page.getByText(/For your safety, scan a ProofMatch invitation/i).waitFor()});
 await check('Live-connection check is visible',async()=>{await visit('/demo/connect');await page.getByRole('button',{name:/check live connections/i}).waitFor();await page.getByRole('link',{name:/open QR scanner/i}).waitFor()});
 await check('All published demo screens render without a 404',async()=>{const pages=['/demo','/demo/guide','/demo/insights','/demo/candidates','/demo/candidates/C01','/demo/roles','/demo/roles/qa','/demo/analyze','/demo/matches','/demo/discover','/demo/criteria','/demo/expectations','/demo/reviews','/demo/candidate-reply','/demo/fairshot','/demo/connect','/demo/interview','/demo/meetings','/demo/scan','/demo/mira','/demo/futurepath','/demo/proof-over-polish','/demo/about-data','/passport?candidate=C01&role=qa'];for(const route of pages){const resp=await page.goto(base+route,{waitUntil:'domcontentloaded'});if(!resp?.ok())throw Error(`${route} returned HTTP ${resp?.status()}`);if(await page.locator('main').count()===0)throw Error(`Missing main landmark at ${route}`)}});
 await check('Homepage and analytics do not overflow on a phone',async()=>{await page.setViewportSize({width:390,height:844});for(const route of ['/', '/demo/insights']){await visit(route);const widths=await page.evaluate(()=>({page:document.documentElement.scrollWidth,screen:innerWidth}));if(widths.page>widths.screen+3)throw Error(`${route} has ${widths.page-widths.screen}px horizontal overflow`)}await page.setViewportSize({width:1280,height:800})});
 await check('No uncaught page JavaScript errors',async()=>{if(uncaught.length)throw Error(uncaught.slice(0,3).join(' | '))});
 await check('Mobile dashboard navigation',async()=>{await page.setViewportSize({width:390,height:844});await visit('/demo');await page.getByRole('button',{name:'Open menu'}).click();await page.getByRole('link',{name:/Start demo walkthrough/i}).click();await page.getByText('You\'re ready to show how it works.').waitFor()});
 console.log(`\nBrowser checks passed: ${successes}/${successes+failures.length}.`);
}finally{await browser?.close()}
if(failures.length){console.error('Unverified/failed browser actions:\n'+failures.map(s=>' - '+s).join('\n'));process.exitCode=1}

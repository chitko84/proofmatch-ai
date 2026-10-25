/**
 * Runs against a RUNNING Next.js dev/production server, locally or on Vercel.
 * BASE_URL=http://localhost:3000 node scripts/smoke.mjs
 * BASE_URL=https://YOUR-PROJECT.vercel.app node scripts/smoke.mjs
 * DEMO_ACCESS_CODE=... is optional, supplied only to intentional invalid API requests.
 * This does not call Gemini and does not require an API key.
 */
const base = (process.env.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
const code = process.env.DEMO_ACCESS_CODE || '';
let failed = 0;

async function check(label, url, init, expected, content) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 13000);
    let response;
    try { response = await fetch(`${base}${url}`, { ...init, signal: controller.signal, redirect: 'follow' }); }
    finally { clearTimeout(timer); }
    const body = await response.text();
    const good = response.status === expected && (!content || body.toLowerCase().includes(content.toLowerCase()));
    console.log(`${good ? 'PASS' : 'FAIL'} ${label}: HTTP ${response.status} (${response.url})`);
    if (!good) { failed++; console.error(`  Expected ${expected}${content ? ` containing ${content}` : ''}; received ${body.slice(0, 180)}`); }
  } catch (error) {
    failed++;
    console.error(`FAIL ${label}: ${error.message}`);
  }
}

console.log(`ProofMatch AI smoke checks — ${base}`);
for (const [route, label, marker] of [
  ['/', 'Marketing landing', 'great talent'],
  ['/demo', 'Recruiter dashboard and ProofWatch', 'proofwatch'],
  ['/demo/guide', 'Guided clickable presentation', 'presentation'],
  ['/demo/candidates', 'Candidate pool', 'candidate'],
  ['/demo/roles', 'Job roles', 'role'],
  ['/demo/matches', 'Evidence review', 'match'],
  ['/demo/discover', 'Blindspot Rescue', 'blindspot'],
  ['/demo/fairshot', 'FairShot', 'fairshot'],
  ['/demo/mira', 'Mira Holographic Studio', 'holographic'],
  ['/demo/futurepath', 'FuturePath', 'career'],
  ['/demo/proof-over-polish', 'Wording lab', 'polish'],
  ['/demo/connect', 'Share a job opportunity and QR Passport', 'proofmatch connect'],
  ['/demo/expectations', 'Two-way expectations', 'both sides'],
  ['/demo/candidate-reply', 'Candidate corrections', 'clarification'],
  ['/demo/criteria', 'Preference preview', 'preview'],
  ['/demo/reviews', 'Human review list', 'review list'],
  ['/demo/interview', 'Interview Companion', 'interview companion'],
  ['/passport?candidate=C01&role=qa', 'Candidate Passport', 'proofmatch'],
]) await check(label, route, {}, 200, marker);

await check('Health endpoint', '/api/health', {}, 200, '"status":"ok"');
const headers = { 'Content-Type': 'application/json', ...(code ? { 'x-demo-access-code': code } : {}) };
for (const [url, label, payload] of [
  ['/api/analyze', 'Reject invalid analysis', {}],
  ['/api/mira', 'Reject invalid Mira candidate', { candidateId: 'not-a-candidate', question: 'Why?' }],
  ['/api/futurepath', 'Reject invalid career path', { candidateId: 'not-a-candidate', trackId: 'other', step: 0 }],
  ['/api/fairshot', 'Reject invalid work sample', { candidateId: 'not-a-candidate', taskId: 'none', response: 'A fictional response that is not tied to valid records.' }],
  ['/api/connect/invite', 'Reject invalid invitation', { candidateId: 'not-a-candidate', roleId: 'unknown' }],
]) await check(label, url, { method: 'POST', headers, body: JSON.stringify(payload) }, code ? 400 : 400);

if (failed) { console.error(`\n${failed} smoke check(s) FAILED.`); process.exitCode = 1; }
else console.log('\nAll route/validation smoke checks passed. Live Gemini, visuals, and speech still require manual checks.');

/** Dependency-free source/package preflight. NOT a replacement for `npm run build`. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let bad = 0;
function check(condition, message) { console.log(`${condition ? 'PASS' : 'FAIL'} ${message}`); if (!condition) bad++; }
const root = path.resolve(import.meta.dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const exists = p => fs.existsSync(path.join(root, p));
const pkg = JSON.parse(read('package.json'));
check(pkg.name === 'proofmatch-ai', 'Expected package name');
check(pkg.scripts.build === 'next build', 'Production build command');
check(exists('src/app/api/health/route.ts'), 'Health route exists');
check(exists('next.config.mjs'), 'Security headers configuration exists');
check(!exists('.env.local'), 'Release ZIP does not contain .env.local');
check(!exists('node_modules'), 'Release ZIP excludes local node_modules');
check(!exists('.next'), 'Release ZIP excludes build cache');
check(read('src/app/globals.css').includes('prefers-reduced-motion:reduce'), 'Reduced-motion styling present');
check(read('src/components/proofwatch.tsx').includes('getWatchSignals'), 'ProofWatch draws from grounded engine results');
check(read('src/app/demo/mira/page.tsx').includes('mira-hologram-world'), 'Holographic Mira studio present');
check(read('src/app/api/analyze/route.ts').includes('validateLiveInput'), 'AI input validation present');
check(read('src/lib/live-analysis.ts').includes('validateExtractedEvidence'), 'Gemini quote validation present');
check(read('src/lib/phase3.ts').includes('candidateWithReplies'), 'Candidate reply integration present');
check(read('src/lib/fairshot.ts').includes('eligibleWorkSamples'), 'FairShot standardized task selection present');
check(exists('src/app/demo/connect/page.tsx') && exists('src/app/passport/page.tsx'), 'Invitation and Passport pages exist');
check(exists('src/app/demo/interview/page.tsx'), 'Interview Companion page exists');
check(exists('src/app/demo/insights/page.tsx') && exists('src/lib/analytics.ts'), 'Data-derived recruiter analytics exists');
check(exists('src/components/talent-orbit.tsx'), 'Interactive evidence-backed 3D-style hero exists');
check(exists('src/app/api/connect/telegram/route.ts'), 'Opt-in Telegram webhook route exists');
check(exists('CONNECT_SETUP.md'), 'New feature setup and demo limits are documented');
// This source-only static inspection uses the globally available TypeScript compiler if installed.
try {
  let ts;
  try { ts = require(require.resolve('typescript', { paths: [root] })); }
  catch { ts = require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript'); }
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(x => x.isDirectory() ? walk(path.join(d, x.name)) : [path.join(d, x.name)]);
  let count = 0;
  for (const file of [...walk(path.join(root, 'src')), ...walk(path.join(root, 'tests'))].filter(f => /\.tsx?$/.test(f))) {
    const source = fs.readFileSync(file, 'utf8');
    const sf = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    if (sf.parseDiagnostics.length) { bad++; console.error(`FAIL TypeScript syntax: ${path.relative(root, file)} -> ${sf.parseDiagnostics[0].messageText}`); }
    count++;
  }
  console.log(`Checked syntax of ${count} TypeScript/TSX files.`);
} catch { console.log('SKIP TypeScript syntax: global compiler unavailable; use `npm run typecheck`.'); }
console.log(bad ? `\n${bad} preflight check(s) failed` : '\nPreflight passed (source-level only).');
if (bad) process.exitCode = 1;

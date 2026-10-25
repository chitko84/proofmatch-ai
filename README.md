> **New:** Real Telegram delivery of fictional LiveRoom meeting invitations, opt-in account pairing, phone RSVP, and cross-device text chat. See [REAL_TELEGRAM_PHONE_DELIVERY.md](REAL_TELEGRAM_PHONE_DELIVERY.md) for the required Vercel and bot setup. Telegram delivery has not been verified with a live account in this package.

# ProofMatch AI — Final Showcase Edition (24 October 2026)

**Start here for judging:** Visit `/demo/guide`, click **Prepare all demo examples**, then follow the shortcuts. The homepage now has a self-contained, keyboard-friendly 3D-style talent explorer that lets judges compare the actual sample evidence for Candidate 01 across three open jobs. The recruiter workspace now includes `/demo/insights`, a responsive analytics dashboard calculated from the original 8 fictional candidates × 3 roles; 4 filters update KPI cards, line/donut/bar charts and candidate comparisons. We added **no new runtime dependencies** for these upgrades.

**Run the release checks:** `npm install`, `npm run showcase:check`, `npm run typecheck`, `npm run build`, `npm run dev`. Optional browser testing: `npm install --no-save playwright`, `npx playwright install chromium`, then `npm run browsercheck` with the site running. See `FINAL_SHOWCASE_GUIDE.md` for complete judge flow, test limitations and live-service setup.

**Trust rules:** All candidate details, dates, invitations, salaries and interview examples are fictional. Calculated percentages mean weighted **coverage of supplied evidence**, not hiring suitability or success odds. The rules do not make final hiring decisions. Gemini calls, real Telegram delivery, cross-device replies and phone camera scanning still require separate live verification and configuration. If you do not configure them, one-click browser-based samples are labeled clearly.

---

> **New: Real Telegram and QR scan support**. Start with [`START_HERE_REAL_TELEGRAM_AND_QR.md`](START_HERE_REAL_TELEGRAM_AND_QR.md), then [`CONNECT_SETUP.md`](CONNECT_SETUP.md) for live bot, shared replies, and phone scanning. No Telegram token, database or hosting is bundled.

**Presentation safety update:** Start at `/demo/guide` and click **Prepare all demo examples** for ready-to-show fictional reviews, candidate replies, and invitations. See [`PRESENTATION_DEMO_READINESS.md`](PRESENTATION_DEMO_READINESS.md) for a complete checklist, salary/work-mode examples, and offline fallbacks.

> **Presentation-ready navigation:** Open `/demo/guide` for a clickable judge walkthrough and one-click fictional-data examples. Before presenting, run `npm test`, `npm run interactions`, `npm run typecheck`, and `npm run build`. For actual browser interactions, see `JUDGE_CLICK_TEST_GUIDE.md` and `npm run browsercheck`. Live Telegram and Gemini require separate configuration.

# ProofMatch AI — Phase 4 Release Candidate

## Phase 4A — ProofWatch & Mira Holographic Studio (2026-10-20)

This is the **complete project** including earlier phases. The two selected enhancements are now coded:

- **ProofWatch** appears on `/demo` and `/demo/discover`: a wearable-style interactive UI with an actual local-time watch face, swipe-free next/previous sample-signal controls, and **Review evidence** / **Ask Mira** links. Every sample signal is computed by `getWatchSignals()` from fictional candidate-role comparisons. It triggers only when an alternative role has *strictly higher* documented coverage than the applied role. No fabricated new real-time events are shown.
- **Mira's Holographic Studio** lives at `/demo/mira`: the existing procedural WebGL character in a premium holographic room, selected candidate and role controls, actual source-excerpt context cards, Gemini-powered server chat or labeled sample fallback, browser mic and optional speech playback. ProofWatch links open the exact candidate/role in Mira. Selecting a different context clears the old conversation to prevent mixing evidence.
- **Opportunity Portal is inactive** for public demo entry (direct navigation to `/demo`), matching the latest creative-scope decision. Earlier components may remain in the source archive as unused code; no new portal, constellation, or X-Ray magnifier was added.

Testing: `npm test` (35/35 offline checks), `npm run preflight`. **Still required:** local `npm install`, `npm run typecheck`, `npm run build`, manual desktop/mobile review, 3D WebGL/voice feature testing, live Gemini with a legitimate key, and Vercel deploy. The existing source-based check cannot replace these tests.


**AI Future Makers 2026 — Challenge 02: Better Talent Matching**  
**Release:** 0.5.0-phase4-rc1 · **Status:** source/tests checked; browser/build/deployment validation pending.

ProofMatch is a premium fictional recruitment demo with **10 feature areas**: multi-role matching, Blindspot Rescue, Evidence Ledger, mutual expectations, AI clarifications and human review, criteria preview, candidate right of reply, Mira 3D assistant, FuturePath career simulator and FairShot standardized evidence opportunities. The Proof Over Polish lab is a controlled demonstration, not proof of general fairness.

The experience includes a Pinterest-inspired landing page, Ocean Pearl dashboard, cinematic skippable door transition, Evidence X-Ray, and source-linked role comparisons. Gemini API integration is **optional**: extraction is available with a valid private key; seeded matching and labeled fallback guides work without one.

## Start locally

Use Node.js **22+** and internet access to install npm packages. From the extracted **`proofmatch-ai`** folder:

```powershell
npm install
npm run preflight
npm test
npm run typecheck
npm run build
npm run dev
```

Open http://localhost:3000. Then in another terminal:

```powershell
$env:BASE_URL='http://localhost:3000'
npm run smoke
```

The health endpoint is `/api/health` (no secrets). See `.env.example` for the server-only Gemini variables. Do not commit `.env.local` or use `NEXT_PUBLIC_GEMINI_API_KEY`.

## What to read next

- **`PHASE_4_RELEASE_REPORT.md`** — exactly what was checked and what still must be verified.
- **`VERCEL_DEPLOYMENT.md`** — PowerShell, GitHub, Vercel environment settings and deployment smoke test.
- **`QA_CHECKLIST.md`** — real-browser/mobile/AI/manual release gate.
- **`JUDGE_DEMO_RUNBOOK.md`** — recommended ~2-minute demo with recovery paths.
- **`PITCH_SCRIPT.md`** — 5-minute, six-slide speaking outline and evidence-aware Q&A.
- **`docs/ProofMatch_AI_Full_ASCII_Wireframes.md`** — original planned layouts; creativity upgrades are newer.

## Important limits

This is **not** a secure production applicant-tracking system. Candidate records are fictional, responses are browser-local, and demo answers are not independently verified skills. Evidence coverage is not success probability. Candidate corrections do not turn into verified proof. FuturePath does not predict promotions. Proof Over Polish tests deterministic rewording stability **after extraction**, not general AI fairness. All hiring decisions remain human.

Do not deploy real applicant information or distribute the Gemini key. On a publicly reachable demo, configure `DEMO_ACCESS_CODE` for quota protection; it is a lightweight shared-code gate, **not** an authentication or rate-limiting system. Remote Unsplash photographs require a live browser check.

**Phase 4 is a release candidate until a production build, browser QA, live AI test and Vercel smoke test all pass.**

## ProofMatch Connect (new)

Three new demonstration experiences: **Share an opportunity + QR Passport** (`/demo/connect` and `/passport`), **Interview Companion** (`/demo/interview`), and **optional opt-in Telegram bot**. All candidate examples are fictional and all replies are treated as candidate statements for human review.

For a same-browser demo, no external accounts are required; install dependencies and run the app. **Cross-device updates and Telegram are not live until you configure shared storage and the Telegram bot.** See **[CONNECT_SETUP.md](CONNECT_SETUP.md)** for instructions and limitations. QR codes are generated locally using the `qrcode` package—no external QR image service receives invitation tokens.


### QR camera security header (22 October 2026)
The scanner uses a first-party browser camera. `Permissions-Policy` must allow `camera=(self)` (not `camera=()`). Camera QR decoding still requires browser `BarcodeDetector` support, permission, and HTTPS or localhost. The sample QR invitation button works without a camera.

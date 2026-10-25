# ProofMatch AI — Final Showcase Edition

**Created 24 October 2026 · AI Future Makers, Challenge 02 — Better Talent Matching**

## Start here

The project remains a **Next.js 15 / React 19 / TypeScript / Tailwind CSS** application. All existing routes, data, matching logic, Gemini extraction, Mira, ProofWatch, FairShot, right-of-reply, FuturePath, Connect, Telegram webhook, QR generator and scanner are retained. No new runtime packages are required by the final-showcase upgrades.

## What's newly implemented

| Screen or experience | Implemented improvement | Source |
| --- | --- | --- |
| Homepage `/` | Replaces the remote-image-dependent hero collage with an interactive, keyboard-accessible **3D-style Talent Explorer**: tilt on pointer movement, animated spatial rings, three clickable roles, and matching excerpts computed live from Candidate 01's fictional source material. Obeys reduced-motion preference. Existing cinematic opening remains skippable. | `src/components/talent-orbit.tsx`, `src/app/page.tsx`, `src/app/globals.css` |
| Recruiter Insights `/demo/insights` | New integrated analytics dashboard. Four live filters (applied role, location, work preference, fictional intake date), four KPI cards, intake line chart, role-distribution donut and legend, evidence category bars, alternative-role bars, activity feed, and side-by-side evidence-coverage comparison. No invented growth or ROI statistics. | `src/lib/analytics.ts`, `src/app/demo/insights/page.tsx` |
| Overview `/demo` | Adds a prominent shortcut that explains and opens the insights dashboard. Existing 8 candidate / 3 role summary and ProofWatch preserved. | `src/app/demo/page.tsx` |
| Navigation and landing | Recruiter sidebar and public navigation link to insights. Main homepage CTA leads to a prepared guided demo. | `src/components/workspace-shell.tsx`, `src/components/public-nav.tsx`, `src/app/page.tsx` |
| Judge walkthrough `/demo/guide` | Adds an insights demonstration stop; one-click sample review decisions, candidate corrections and invitation history remain. | `src/app/demo/guide/page.tsx`, `src/lib/demo-preset.ts` |
| Browser verification | Extends existing click-through tests for three homepage role selections, actual filtered KPIs, empty/reset behavior, responsive layout and all published demo routes. | `scripts/browser-check.mjs` |

**Existing candidate experience:** `/passport` includes fictional opportunities, interest choices, work preferences, consent, one-click demo response and success feedback. Only configured server-side shared storage synchronizes *between different devices*. A browser-only invitation can work without Telegram but cannot transfer browser storage across a phone and a laptop.

**Existing HR workflow:** `/demo/discover` → `/demo/matches?candidate=C01&role=qa` → `/demo/expectations?candidate=C05&role=qa` → `/demo/fairshot?candidate=C01&role=qa` → `/demo/connect?candidate=C01&role=qa` → `/demo/interview?candidate=C01&role=qa`.

## Explain the new analytics honestly

- Eight fictional candidate profiles and three fictional currently-open jobs are the **single source of truth**. Matching continues to use the existing deterministic TypeScript rule engine.
- Intake dates are **made-up demonstration attributes**, stored in `DEMO_INTAKE` and consistently used across trend and activity views. No historical actual company hiring activity exists.
- **People in view:** count after filters.
- **Worth another look:** number of people whose *highest evidence-covered* role is not the one they initially applied for. This is not an automatic interview recommendation.
- **Supported job skills:** count of role-requirement comparisons with candidate-provided project examples; the same excerpt may support different job-role comparisons.
- **Average evidence coverage:** arithmetic mean of weighted project/claim evidence coverage across matching comparisons in the filtered view. **Not a hiring probability or verified skill score.**
- Line-chart weekly totals, donut application totals, bars, KPI values and recent candidate activity are recomputed from **the same filtered candidate list**. Zero results render a safe empty state and a working reset button.

## 5-minute live judging flow

1. **0:00–0:35 — Homepage:** Let the automatic entrance finish or skip it. Point to the interactive Talent Explorer. Click **Frontend Developer**, then **QA Automation Engineer**, and show how the quotation and requirement-coverage indicators change. Say: "Someone may apply for one role but have stronger evidence for another open job."
2. **0:35–1:00 — Recruiter insights:** Open `/demo/insights`. Quickly change **Applied job** or **Location**, show the chart/KPIs reacting; then click **Reset filters**. Say: "These are honest calculations from eight fictional people—not claimed real-world business results."
3. **1:00–2:00 — Blindspot Rescue:** Use `/demo/discover` and reveal Candidate 01's alternative QA position.
4. **2:00–2:45 — Evidence:** Use `/demo/matches?candidate=C01&role=qa` to open actual supplied excerpts and what is missing. Say: "AI suggestions need evidence and HR confirmation."
5. **2:45–3:25 — Two-way preferences:** `/demo/expectations?candidate=C05&role=qa`, then the one-click work-mode mismatch. Explain that both employee and employer preferences matter.
6. **3:25–4:20 — Connect or FairShot:** Use `/demo/connect?candidate=C01&role=qa`, press **Use browser-only demo**, show a generated QR code and **Show sample candidate reply**; or show the FairShot one-click example. Show real Telegram only **if personally verified on a deployed HTTPS site**.
7. **4:20–5:00 — Close:** Explain Gemini extraction (if configured), transparent rule-based role comparison, and human review. Mention Mira's 3D studio as optional if time remains.

Before the demonstration, visit `/demo/guide` and click **Prepare all demo examples**. Then open the most important demo URLs in separate tabs. Keep a known-good browser-only fallback; do not attempt unverified live services under time pressure.

## Local setup / checks

Node.js **22+** is recommended. From `proofmatch-ai/`:

```powershell
npm install
npm run showcase:check
npm run typecheck
npm run build
npm run dev
```

Open `http://localhost:3000` then `http://localhost:3000/demo/guide`.

To verify actual clicks and page navigation in Chromium, in a second terminal while the server is running:

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

To run the Telegram **mock** (does not send real messages): `npm run telegram:simulate` (included in `showcase:check`). The optional `npm run smoke` checks local API health.

For real Telegram and cross-device replies, follow `START_HERE_REAL_TELEGRAM_AND_QR.md` and `CONNECT_SETUP.md` to configure the BotFather token, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, `DEMO_ACCESS_CODE`, Upstash Redis REST credentials, a public HTTPS Vercel deployment and the webhook. Confirm the connection indicator, send a Telegram message using your phone, choose a preference and watch the shared reply appear in the recruiter dashboard. Never embed secrets in the ZIP or expose real candidate data during the competition.

## Verification and current limitations

**Passed in the packaging environment:** preflight TypeScript/TSX syntax audit; link/button/form-handler inspection; original regression tests plus new analytics consistency tests; simulated Telegram invitation→opt-in→work-mode flow. The full ZIP archive and its entries are verified during packaging.

**Not verified here:** `npm install`, Next.js typecheck, `next build` or real browser/mobile clicks because npm registry DNS/network access is unavailable. Runtime JS exceptions, responsive layouts and animations must be checked in the locally deployed application. Gemini responses, microphone/voice, actual Telegram outbound messages, real Redis synchronization and phone-camera QR decoding also require a configured site and suitable hardware/browser. Scanner camera decoding uses the native `BarcodeDetector` API where available; other browsers can use their ordinary phone camera or a labeled example.

**Not a production hiring system:** No production-grade candidate identity verification, recruiter authentication/permissions, audit storage, organizational access policy, calibrated model validation, secure application submission, privacy compliance or real candidate consent management. The existing client-side demo storage is not a secure backend. No real hiring/financial-impact metrics or verified candidates are bundled.

Avoid adding production applicant details or using this prototype to automatically hire/reject anyone.

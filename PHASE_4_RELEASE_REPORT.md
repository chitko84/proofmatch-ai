# ProofMatch AI — Phase 4 Release Candidate & QA Report

**Release:** 0.5.0-phase4-rc1  
**Project:** AI Future Makers 2026, Challenge 02: Better Talent Matching  
**Scope:** Phases 1 + 2 + 3 + 3A + 3B + Phase 4 release preparation

## What Phase 4 actually changed

- Added `/api/health`: public read-only deployment health check showing fictional dataset counts and whether the Gemini key is configured (but never its value). `configured-not-live-verified` deliberately is **not** a claim the API works.
- Added `next.config.mjs` baseline security headers: nosniff, no framing, referrer policy, microphone permission policy, and no-store API responses.
- Added friendly `error.tsx`, `not-found.tsx` and `loading.tsx` views, with reduced-motion-friendly styling.
- Added `scripts/preflight.mjs` for source/package preflight and `scripts/smoke.mjs` for real running-site smoke checks.
- Added Windows deployment, visual QA and judge demo instructions.
- Kept all prior application features and demo data intact.

## Verification performed in the preparation environment

| Check | Result | Interpretation |
|---|---|---|
| Existing unit tests | **PASS: 30/30** | Deterministic matching, evidence validation, FairShot, candidate replies, career path and controlled wording examples behave as unit-tested. |
| Source/package preflight | **PASS** | Required files, key safety conventions and route wiring found. |
| TS/TSX syntax parser | **PASS: 55 files** | Source parses; this is **not** complete type checking or compilation. |
| npm registry access | **BLOCKED: EAI_AGAIN** | Container cannot download Next/React dependencies. |
| `npm run typecheck` | **NOT VERIFIED** | React/Next type packages unavailable; compiler reports missing-module errors. |
| `npm run build` | **NOT VERIFIED** | Dependencies unavailable. |
| Running local/remote browser | **NOT VERIFIED** | Application cannot start without dependencies. |
| Screenshots and responsive visual comparison | **NOT VERIFIED** | Do not claim design has been visually signed off. |
| Live Gemini response | **NOT VERIFIED** | No usable key or API connection supplied. |
| Live voice and 3D rendering | **NOT VERIFIED** | Requires browser/device inspection. |
| Vercel deployment | **NOT PERFORMED** | Requires access to the user's GitHub/Vercel project. |

## Release status

**RELEASE CANDIDATE — not yet production-sign-off.**

Do not say the app is fully tested, already deployed, has independently verified hiring effects, or has a live AI demo until the corresponding checks have actually passed.

## Must-pass release gate — on Windows

In PowerShell, inside extracted `proofmatch-ai`:

```powershell
node --version
npm install
npm run preflight
npm test
npm run typecheck
npm run build
npm run dev
```

In a **second** terminal while `npm run dev` is running:

```powershell
$env:BASE_URL='http://localhost:3000'
npm run smoke
```

Then follow `QA_CHECKLIST.md`, especially mobile, source-highlight selection, candidate corrections, voice fallback, and Gemini key protection. Run `npm run smoke` again with `BASE_URL` pointing to the deployed Vercel site.

## Known risks and safeguards

1. **Gemini quota:** Free-tier availability depends on enabled model, project and quota. Set the server-only key; test one fictional CV in advance. The deterministic sample workflow does not require the key.
2. **Public API abuse:** Before public deployment, set `DEMO_ACCESS_CODE` to a nontrivial secret and provide it only during a live demo if you want live AI calls. This is a lightweight demo guard **not a rate limiter or authentication system**. For wider access, use an API gateway / hosting-side abuse controls.
3. **Remote photography:** Landing page and dashboard use external Unsplash image URLs. Actual loading was not verified here; capture real screenshots on the deployed domain. Background colors provide graceful placeholders but not equivalent photography.
4. **Voice:** Browser speech recognition depends on browser/permission support; text chat must be the backup. Demo voice is not voice cloning.
5. **3D:** Mira is a custom procedural WebGL character (not a Spline asset). Actual appearance and rendering performance must be checked in Chromium/mobile.
6. **Local records:** Candidate replies/review decisions are browser-local or tab-local demo state; no persistent multi-user secure database, authenticated candidate account, or real ATS integration.
7. **Fairness evidence:** Proof Over Polish only demonstrates deterministic matching stability after structured extraction; it does not measure extraction model bias or prove fairness.
8. **Interpretation:** Evidence coverage scores are not probabilities of success. FairShot answers are self-reported and do not constitute verified ability. FuturePath is not a performance/promotion predictor.
9. **User data:** Use fictional inputs only unless you have obtained appropriate permission and handled Gemini's data terms. Do not expose an API key through `NEXT_PUBLIC_` variables or committed `.env.local`.

## Release owner handoff

- **Code:** full `proofmatch-ai/` directory from the Phase 4 ZIP.
- **Deploy:** `VERCEL_DEPLOYMENT.md`.
- **Manual check:** `QA_CHECKLIST.md`.
- **Demo:** `JUDGE_DEMO_RUNBOOK.md`.
- **Pitch:** `PITCH_SCRIPT.md`.

Final release approval requires green build, smoke checks, browser QA and a successful Vercel smoke check. Do not defer those checks until competition day.

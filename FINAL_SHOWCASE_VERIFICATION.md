# Final Showcase — Verification Record (24 October 2026)

## Code and data checks completed here

| Check | Result | Method |
|---|---|---|
| Existing matching / data / QR / FairShot / Gemini extraction offline tests + new analytics consistency tests | **71/71 passed** | `npm test` using Node 22 built-in TS stripping |
| Authenticated Connect invitation + Telegram opt-in callback simulation | **7/7 passed** | `npm run telegram:simulate` against transpiled Next.js route with fake Telegram and storage; no messages sent |
| All `.ts`/`.tsx` files parse, no syntax errors | **88 files checked** | TypeScript parser via `npm run preflight` |
| Missing JSX button `onClick`, uncontrolled input, static links pointing to missing local routes | **None found** | Static AST audit: **60 buttons, 98 links, 51 form controls; 24 page routes** (`npm run interactions`) |
| Analytics calculations reconcile across filters, categories, intake weeks, bars, application donut and candidate count | **Passed** | New `tests/showcase-insights.test.ts` |
| Source ZIP extracts and each archived entry checksums correctly | **Passed** | Python `zipfile.testzip()` during packaging |

**Not verified in this environment:** `npm install`, TypeScript semantic `npm run typecheck`, Next.js production `npm run build`, actual running browser clicks, Chrome screenshot/visual QA, mobile responsiveness, real Telegram messages, live Redis, real Gemini calls, microphone/voice, or a physical-camera QR scan. A Chromium screenshot attempt stalled; no claims of visual/browser verification are made. npm registry DNS access is unavailable and `npm install --offline` correctly reports ENOTCACHED, so dependencies cannot be installed here.

## Reproducible commands on a networked local machine

From the extracted `proofmatch-ai` folder:

```powershell
npm install
npm run showcase:check
npm run typecheck
npm run build
npm run dev
```

Then in a separate terminal:

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

The browser checker now covers the interactive landing explorer, filtered recruiter analytics, all demo page HTTP responses, one-click demo data, evidence review, work preferences, FairShot, candidate corrections, HR reviews, Connect local fallback, exact invitation links, candidate Passport, Mira, FuturePath, sample QR scan, safe URL rejection, mobile nav, responsive horizontal overflow, and uncaught page errors.

Use `FINAL_SHOWCASE_GUIDE.md` for the five-minute demo runbook, Telegram/QR setup and scope restrictions.

## Presentation fallback behavior

- The homepage Talent Explorer and insights work against preloaded local fictitious data; no AI token or database required.
- `/demo/guide` prepares reusable fictional examples without sending messages.
- `/demo/connect` can generate a browser-only invitation, scannable QR and clearly labeled simulated reply without configuring Telegram. A different device can open a publicly hosted page but **cannot send browser-only replies back to the recruiter's separate browser**.
- Real Telegram is available only after bot, webhook, public URL and shared storage are connected and tested. The UI exposes connection status.
- Gemini, microphone, camera-decoded scanning and third-party messaging depend on account, device, browser, credentials and network conditions; a visible demo fallback exists for key presentation flows.

This is a hackathon prototype with fictional profiles, not a validated or production-secure hiring system. Every percentage refers to a modeled evidence-coverage property, **not** a person’s probability of being hired or successful.

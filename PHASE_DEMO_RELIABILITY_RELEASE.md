# ProofMatch AI — Judge-Safe Demo Reliability Update

**This is the complete project, based on ProofMatch_AI_Full_Updated_Connect_Friendly_UI.zip.** It retains the landing entrance, core matching, evidence views, candidate expectations, ProofWatch, Mira, FairShot, FuturePath and the Connect pages.

## Improvements made

- Added `/demo/guide`, a clickable presentation guide with seven preselected sample flows, plus dashboard and sidebar shortcuts.
- Added honest, fast fictional-data autofill buttons to the CV, FairShot, candidate-correction, and candidate passport screens.
- Added an offline sample-result link on the CV analysis page, so the judge demo does not depend on a Gemini API key or network.
- Added one-click work-preference mismatch, criteria preview change/reset, saved HR reviews/clear, and interview questions selection.
- Added a one-click fictional candidate response to the invitation page, carefully distinguished from a real Telegram message. Browser-only replies are visible in the recruiter workflow, with manually refreshable status.
- Added immediate, labeled sample explanations for Mira and FuturePath if external AI is unavailable.
- Preserved a LIVE CV candidate's HR review entry within the current browser tab instead of silently hiding it from the review list.
- Connected the evidence review to the corresponding preloaded candidate's expectations comparison; prevents passing off Candidate 01 as a LIVE candidate.
- Improved defensive validation for saved review data.
- Added `npm run interactions` to audit JSX buttons, internal static links and controlled form inputs, and expanded route smoke coverage.
- Added optional `npm run browsercheck` powered by Playwright for the running website, including a mobile navigation check.

## Validation performed here

- `npm test`: **47/47 passed**.
- `npm run preflight`: passed. Parses **74 TS/TSX source+test files** and checks the release source structure.
- `npm run interactions`: passed. Checked **49 button elements**, **84 link elements**, **44 text/form controls**, and **22 page routes**. All buttons have handlers or submission semantics and static internal links correspond to page routes.
- The full production Next.js build, full browser click-through, live Gemini API, microphone/WebGL performance, and Telegram delivery **could not be executed or certified in this offline environment**; npm registry was inaccessible. Do not claim these have passed.

## What to do on Windows before judging

Run the following commands inside the unzipped `proofmatch-ai` directory:

```powershell
npm install
npm test
npm run interactions
npm run typecheck
npm run build
npm run dev
```

Open the presentation shortcuts at **http://localhost:3000/demo/guide**.

For automated browser checks in another PowerShell window, with the dev server running:

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

If any `typecheck`, `build` or `browsercheck` check fails, send the complete error log before using the project during judging. Inspect it on a phone-sized viewport and use a real browser for voice and WebGL. Do not automatically run `npm audit fix --force` just to clear audit warnings; check the advisories and compatible dependency versions.

See `JUDGE_CLICK_TEST_GUIDE.md` for the one-click workflow checklist and offline limitations.

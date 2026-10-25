# ProofMatch AI — Independent recheck (22 October 2026)

## Findings and fixes

1. **Repeated browser-only invitations:** previously a Passport link identified only a fictional candidate and role, so multiple invitations for the same pair could attach a response to the wrong local record. Every new browser-only link now includes an individual `demo` identifier. Scanner validation preserves that identifier, and the Passport uses it to save to the correct invitation.
2. **Recruiter reply display:** changes made in a second tab of the same browser now update the currently open local invitation automatically through browser-storage events. This is **not** cross-device sync and is labeled as such.
3. **QR-image generation compatibility:** the importer accepts either the named or the default module export. This guards against common-module interop differences.
4. Added regression tests for local Passport link identity and QR scanning, and added an **optional** two-tab real-browser interaction test to `scripts/browser-check.mjs`.

## Checks executed successfully

- `npm test`: **63/63 offline tests passed**.
- `npm run preflight`: **passed**; 84 TypeScript/TSX files parsed and package/source checks passed.
- `npm run interactions`: **passed source-level audit** of 57 buttons, 90 links, 46 form controls and 23 page routes (193 UI elements total).
- `npm run telegram:simulate`: **7/7 simulated webhook and invitation checks passed**. This uses stubbed Telegram and shared storage, **not live traffic**.
- `node --check scripts/browser-check.mjs`: passed JavaScript parsing.
- ZIP archive: integrity checked after packaging; no `.env.local`, `.next`, or `node_modules` included.

## Not verified here

- `npm install` did **not complete**: the npm registry was unreachable from this environment within the installation timeout. Therefore **`npm run typecheck` and `npm run build` have not been verified**.
- The Next.js application did **not** run in an actual browser here. A static handler/route audit does not prove every control works visually or functionally.
- A real Telegram bot, deployed webhook, Upstash Redis, and cross-device replies are **not verified** without live credentials and public HTTPS deployment.
- Camera scanning/QR image upload depend on supported browser QR detection, camera permissions and HTTPS; these remain untested on a physical phone. On unsupported browsers, use the phone's native camera or the explicitly labeled sample QR action.
- Gemini and microphone operation also need live service/browser tests.

## How to complete the live release gate on Windows

From inside the extracted `proofmatch-ai` folder:

```powershell
npm install
npm test
npm run preflight
npm run interactions
npm run typecheck
npm run build
npm run telegram:simulate
npm run dev
```

In a second PowerShell window (while the site is running):

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

Then visit `http://localhost:3000/demo/guide`, click **Prepare all demo examples**, and run through every main screen. On a public Vercel HTTPS URL, confirm a real phone scans a Passport QR. To confirm real Telegram delivery, generate a live invitation, press Start on your bot with a test account, reply through Telegram, and confirm the exact choice appears in ProofMatch's recruiter view. In `demo/connect`, **Check live connections** should indicate shared storage, verified bot and registered webhook.

**Release assessment:** Improvements verified with offline tests. **Not yet certified for a live judge demonstration** without successful build, browser and physical-device checks.

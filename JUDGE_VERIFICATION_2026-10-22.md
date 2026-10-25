# ProofMatch AI — Recheck on 22 October 2026

## Issue fixed

**The QR camera button was blocked by our own security header.** `next.config.mjs` previously sent `Permissions-Policy: camera=()`, which denies camera permission to every page regardless of user consent. Changed the policy to `camera=(self), geolocation=(), microphone=(self)`. This permits the site's own QR-scanning feature to request camera permission while continuing to block access for other origins. Added two regression tests and an HTTP-header assertion in the Playwright browser-check script.

## Checks actually run in the preparation environment

- `npm test`: **61/61 passed** (including the two new camera regression tests).
- `npm run interactions`: examined **57 buttons, 90 links, 46 form controls, 23 pages**; no unhandled controls or missing static internal routes detected.
- `npm run preflight`: passed source/package integrity rules and parsed **84 TypeScript/TSX files**.
- `npm run telegram:simulate`: **7/7 passed** (mock bot; no external Telegram traffic).
- `node --check scripts/browser-check.mjs`: passed.
- ZIP verification: passed.

## NOT verified — must not claim full live readiness

1. `npm run typecheck` and `npm run build` could **not** be executed; npm dependency installation timed out and no Next.js/React dependencies were cached.
2. Browser click-through and real responsive rendering were **not** executed, because Next.js could not be installed here.
3. Camera QR scanning and QR-image decoding depend on browser `BarcodeDetector` support, permissions and HTTPS or localhost. If unsupported, users can open the generated QR with their phone camera, paste the invitation link, or run the clearly labeled in-app sample QR action.
4. Actual live Telegram messages, Vercel webhook, and shared Upstash Redis synchronization require configured secrets and a real device test. No real Telegram account was contacted in tests.
5. Real Gemini responses and voice recognition require their API/browser support to be checked separately.
6. QR links with localhost addresses do not work on another device. Deploy to public HTTPS first for phone scans. Browser-only demo replies are not cross-device synced.

## On your Windows PC — complete the missing release gate

From the extracted `proofmatch-ai` directory, with a reliable internet connection:

```powershell
npm install
npm test
npm run interactions
npm run preflight
npm run typecheck
npm run build
npm run telegram:simulate
npm run dev
```

When the dev server is running, open another terminal in that folder:

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

Then open `/demo/guide`, click **Prepare all demo examples**, follow all seven steps, and scan a **public HTTPS** Passport QR with an actual phone. In `/demo/connect`, click **Check live connections**. To certify Telegram, send an actual bot reply and see that exact reply arrive on the recruiter screen. Use the labeled browser-only fallback if unavailable; do not claim Telegram delivered a real response unless it did.

### Decision
**Offline regression checks passed; live browser + Telegram release gate remains open.** This release fixes a confirmed QR camera blocker, but it is not a 100%-verified live application.

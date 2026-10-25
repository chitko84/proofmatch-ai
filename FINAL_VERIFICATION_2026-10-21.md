# ProofMatch AI — Final source + demo-flow verification (21 October 2026)

## What was actually tested

- `npm test`: **59/59 passed**. Covers deterministic matching, QR link safety, demo records, sample data and fallback checks.
- `npm run interactions`: **193 visible controls and links inspected** (57 buttons, 90 links, 46 form controls) across 40 TSX files and 23 page routes. No missing click handlers or invalid static internal links detected.
- `npm run preflight`: source/package checks passed; 83 TypeScript/TSX files had syntax checked. This does **not** replace `npm run typecheck` or `npm run build`.
- `npm run telegram:simulate`: **7/7 simulated steps passed**, exercising the actual invitation and Telegram webhook handlers with fake credentials, fake storage and fake Telegram replies: access-code protection; shared invitation creation and correct links; webhook secret rejection; bot /start; interest selection; work preference; opt-out; expired invitation.
- ZIP file was rebuilt from the complete project and checked for corruption.

## Fixes made after the previous ZIP

1. **Use browser-only demo:** The recruiter can create a locally stored fictional invitation even when the real invitation API, Telegram or shared storage is unavailable. A scannable QR is generated when the QR library has been installed.
2. **Show sample candidate reply in shared mode:** A fictional example can be shown without modifying a real invitation, sending Telegram messages, or claiming an external candidate replied. The screen explicitly states this.
3. **Extra regression tests:** Added fallback tests and the Telegram invitation/webhook simulation (`npm run telegram:simulate`).
4. **Browser regression script expanded:** Verifies the browser-only backup invitation and fictional candidate response in addition to the previous click-through checks.

## Important checks that remain unverified

**This release is not certified as having every button tested in a real browser.** The current review environment cannot install project dependencies (npm installation timed out, with no local cache). Therefore these checks could not be executed here:

- `npm run typecheck` and `npm run build` with locally installed Next.js/React packages.
- Next.js real-browser click-through and responsive testing.
- Camera permission and decoding an actual QR on the user's phone.
- Live Telegram message delivery, webhook authentication on Vercel, and Upstash Redis synchronization.
- Actual Gemini model/API key responses.

The source audit cannot detect all runtime/rendering problems. A successful local build and real browser rehearsal are mandatory before claiming the whole system is ready for judging.

## Run the missing checks on Windows

Extract the ZIP, then in a terminal inside the `proofmatch-ai` folder:

```powershell
npm install
npm test
npm run interactions
npm run typecheck
npm run build
npm run telegram:simulate
npm run dev
```

Open a separate PowerShell terminal in the same folder, while `npm run dev` is still running:

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

**Note:** Running `npm install --no-save playwright` may modify the local dependency folder; do it after the production build or use a separate working copy. If the browser runner reports a failure, please share the full log so it can be fixed.

## Real-phone demo checklist

1. Deploy to a **public HTTPS Vercel URL**; do not scan `localhost:3000` from a phone.
2. Configure `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, and `DEMO_ACCESS_CODE` using the setup guide. Keep all secrets private.
3. Run `npm run telegram:setup -- https://YOUR-SITE.vercel.app`, then open `/demo/connect`, click **Check live connections**, and confirm that all required services are connected.
4. Prepare a shared invitation, scan its Passport QR on a phone, then scan the Telegram QR or tap the bot link. Start the bot, choose **I'm interested** and **Hybrid**.
5. Verify the *real* Telegram answer appears on the recruiter dashboard. Otherwise, select **Use browser-only demo** / **Show sample candidate reply** and clearly state that you are showing fictional sample data.
6. Walk through `/demo/guide` and try the entire pitch sequence at least twice on the actual presentation laptop.

**Never claim Telegram works live until step 5 has succeeded.**

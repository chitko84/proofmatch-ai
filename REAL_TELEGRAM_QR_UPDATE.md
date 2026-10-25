# ProofMatch AI — Real Telegram & QR update

This ZIP is based on the full **Presentation-Ready Demo Data Update**, preserving the dashboard, ProofWatch, Blindspot Rescue, Evidence Ledger, Mutual Expectations, FairShot, human reviews, Mira, FuturePath, candidate corrections, CV demo analysis, Connect, and Interview Companion.

## Added or strengthened

- **Real Telegram webhook integration** with BotFather opt-in, interest choices, work preference selection and server-side Upstash synchronization. No bot token included; external setup is required.
- **Secure, repeatable setup command**: `npm run telegram:setup -- https://YOUR_SITE.vercel.app` registers and confirms the Telegram webhook using `.env.local` secrets.
- **Live connection diagnostic** on `/demo/connect`, checking actual Upstash PING, Telegram bot identity, and registered webhook. It cannot guarantee delivery until a test user sends a real response.
- **Recruiter automatic polling** in shared mode every 6 seconds, plus existing manual Check response.
- **Two QR codes** when live Telegram is configured: a candidate passport invitation and a Telegram deep link for the opt-in bot. Both have actual URLs.
- **New `/demo/scan` page**: camera scan (when BarcodeDetector and camera permission are available), QR picture upload where supported, paste link, and honest one-click sample. Rejects QR links to unknown sites and recognizes the verified Telegram bot QR.
- **Clear demo data**: scanning a Passport QR displays actual fictional candidate and job information. Remote phone-to-recruiter response sync needs Upstash as described.
- **Quick guide** `START_HERE_REAL_TELEGRAM_AND_QR.md` and expanded `CONNECT_SETUP.md` with exact activation, phone, Telegram and failure-mode tests.
- **Unit tests and browser test script extended** for scanner flows, with security tests for QR link validation.

## Check results on generated source

`npm test`: 57/57 passed.
`npm run interactions`: 56 buttons, 90 links, 46 controls, 23 app routes; no missing click handlers or broken static routes identified.
`npm run preflight`: source parse/security presence checks passed (82 source files).

This machine does not have the project's npm dependencies installed and the npm registry was unavailable. A complete `npm run typecheck`, `npm run build`, real hosted browser click-through, Telegram delivery and phone-camera scan **are not verified yet**. Run the included checks on the actual deployment; do not mistake these source checks for a certified production release.

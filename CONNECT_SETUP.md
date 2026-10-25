# ProofMatch Connect — Setup & Honest Demo Limits

This project includes **three connected experiences**:

1. **Share a job opportunity:** `/demo/connect` creates a sample candidate link and scannable QR code.
2. **Candidate Passport:** `/passport?...` lets a fictional candidate choose interest, work arrangement, and add a note with consent.
3. **Interview Companion:** `/demo/interview` suggests consistent job-relevant questions from the actual sample job requirements and evidence. HR selects and copies the questions. **This page uses clear, prewritten logic, not live AI grading.**

A fourth optional integration adds **Telegram opt-in replies**. It requires setup; code alone does not create or register a Telegram bot.

## Fastest reliable local demo (no extra accounts)

```powershell
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Open `http://localhost:3000/demo/connect`.

- Select `Candidate 01` and `QA Automation Engineer`.
- Click **Prepare invitation**.
- Scan the QR code *only if the printed URL is reachable on that device*. `localhost` on a phone refers to the phone, not your computer. For a phone demonstration, deploy to Vercel first.
- For offline testing, click **Open passport** using the same browser; choose preferences and submit.
- Return to the recruiter screen and click **Check response**. The reply displays as **candidate statement — not independently verified**.
- Refresh the recruiter page and use **Your recent invitations** to reopen the saved invitation.
- Go to `/demo/interview` to select/copy recommended questions.

**Critical limitation:** Without optional Upstash credentials, the candidate's reply is stored in the recruiter's browser only. A different browser/device cannot synchronize responses. QR codes are still scannable links to the candidate experience, but cross-device responses require shared storage. Do **not** claim that Telegram was notified or that cross-device data synced unless you've actually configured and tested both.

## Optional real cross-device sync (requires Upstash Redis)

Set these in `.env.local` locally and in Vercel → Project → Settings → Environment Variables:

```
UPSTASH_REDIS_REST_URL=https://your-instance.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_secret_upstash_rest_token
DEMO_ACCESS_CODE=use_a_private_unpredictable_demo_code
```

Never use `NEXT_PUBLIC_` for these secrets. Create a new Redis database on Upstash. The demo stores only fictional invitation metadata and voluntary responses with a seven-day time-to-live. In shared mode, QR passports work across devices; HR uses **Check response** to refresh. Links contain unguessable invitation tokens; treat the link as private and don't publish it. A real production system would additionally need authenticated recruiter accounts, candidate verification, revocation, retention controls, audit history, abuse protection and privacy compliance.

**Production safety:** When shared storage is enabled, `DEMO_ACCESS_CODE` must also be set. Do not expose an unprotected public invitation-creation endpoint.

## Optional real Telegram bot (requires both shared storage and opt-in)

1. In Telegram, open **@BotFather**, use `/newbot` and create a bot.
2. Set these extra environment variables:

```
TELEGRAM_BOT_TOKEN=your_secret_bot_token
TELEGRAM_BOT_USERNAME=your_actual_bot_username
TELEGRAM_WEBHOOK_SECRET=a_random_webhook_secret
```

3. Deploy to Vercel and set a webhook to your **real** deployment address. In PowerShell, run (replace variables; do not post tokens to chat):

```powershell
$bot = 'YOUR_BOT_TOKEN'
$webhookSecret = 'YOUR_WEBHOOK_SECRET'
$domain = 'https://YOUR_PROJECT.vercel.app'
$payload = @{ url = "$domain/api/connect/telegram"; secret_token = $webhookSecret; allowed_updates = @('message','callback_query') } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot$bot/setWebhook" -ContentType 'application/json' -Body $payload
```

4. In your recruiter demo, use **Prepare invitation**, then click **Open Telegram**. The candidate/test user chooses to start the bot voluntarily. Telegram bots cannot start a private conversation with people who have never contacted the bot.
5. Choose an interest option, and optionally work mode, in Telegram. Return to `/demo/connect` and click **Check response**. If the webhook and shared storage are correctly configured, the answer appears in the dashboard.

**What it does not do:** No mass messaging, no unsolicited contact, no automatic applicant rejection, and no scoring of Telegram responses. A `not now` reply records that preference instead of penalizing the applicant. Test with fictional data and a consenting test account only.

## Security and troubleshooting

- Keep secrets server-side. Never add `.env.local` to the ZIP or GitHub.
- If the invitation says *browser-only*, connect Upstash before claiming cross-device sync.
- If Telegram doesn't appear, verify Upstash is connected and `TELEGRAM_BOT_USERNAME` is set.
- If the bot says the invitation expired, create a new link; records expire in 7 days.
- If the QR code doesn't render, copy the link (check that `qrcode` was installed using `npm install`).
- If `npm run build` fails, share the terminal error; don't use a deploy build that failed.
- Browser speech and WebGL are separate existing features and require Chrome/Edge and appropriate permissions.

## Real Telegram + real QR scan — October 21 demo update

**What is implemented in source:** An actual Telegram Bot API webhook (`/api/connect/telegram`) receives opt-in `/start` and button replies, stores them in Upstash Redis, and shows them in ProofMatch Connect. The app checks for new replies every 6 seconds. The `/demo/connect` screen contains **Check live connections**, an invitation QR, and, once set up, a **second scannable QR to the real Telegram bot**. The new `/demo/scan` page scans using supported browser cameras, uploaded QR pictures, pasted links, or the explicitly labeled fictional sample.

**What is NOT provisioned by the source ZIP:** Your Telegram bot, private token, Redis account, webhook registration or Vercel deployment. The app cannot deliver real Telegram messages or synchronize phone replies until you configure those external resources. Do not claim those services are live based solely on the tests.

### Configure for a real presentation

1. Deploy this ZIP's `proofmatch-ai` project to a public HTTPS Vercel URL. Confirm `npm run build` succeeds first. The public URL is essential: your phone **cannot** open a QR pointing at your PC's `localhost`.
2. Create a free or suitable Upstash Redis database. Add its REST URL and REST token in Vercel Environment Variables: `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`. Use sample data only. Add `DEMO_ACCESS_CODE` with a strong private code and use that code in the recruiter's invitation form. Redeploy after setting env vars.
3. In Telegram, visit **@BotFather** and run `/newbot`. Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` (no `@`), `TELEGRAM_WEBHOOK_SECRET` (random letters/numbers/underscores/hyphens) in Vercel and local `.env.local`. Never expose them in screenshots or publish them in GitHub.
4. After deployment, register the webhook **once** using local PowerShell in the extracted project folder. Keep the secrets in `.env.local` locally:

   ```powershell
   npm run telegram:setup -- https://YOUR_ACTUAL_PROJECT.vercel.app
   ```

   This script verifies the bot name with Telegram, registers the webhook at `https://YOUR_ACTUAL_PROJECT.vercel.app/api/connect/telegram`, and checks that Telegram accepted the configuration. It does **not** reveal your token.
5. In the deployed app, open `/demo/connect`, press **Check live connections**. The label should show *Telegram services are connected — test a real reply*. If not, check the status message and env vars. Only the registered public URL is confirmed.
6. Select sample candidate C01 and QA Automation Engineer, fill your private demo access code, click **Prepare invitation**. Your real Telegram deep link and its **QR code** should appear. Scan on your phone with its normal camera, open Telegram, tap Start, and choose **I am interested → Hybrid**. Return to the recruiter dashboard. The reply should appear automatically within about 6 seconds, or press **Check response**. Source shows **From Telegram**.
7. Also scan the **candidate passport QR** with your phone camera. It should open the fictional candidate invitation at `/passport?token=...`. Tap **Fill demo reply** (or choose your own options) and **Send my response**; view the reply back in HR dashboard. This is a **real phone-to-web app request** using fictional information, and requires working shared storage.
8. For camera scanning **inside** ProofMatch, open `/demo/scan` on a device with native `BarcodeDetector` support, grant permission over HTTPS, and scan another ProofMatch invitation QR. Unsupported browsers can still use the phone's standard camera or **Use sample QR invitation**. A screenshot/photo upload can be decoded when the browser supports this detector. This limitation is explained in the UI.

### Test before judging

- Make a real Telegram round-trip using your personal consenting test account; take a screenshot of the Telegram reply and the candidate response appearing in `/demo/connect`.
- Make a real QR phone scan of the public deployed Passport and send the fictional demo reply.
- Verify the bot link and QR are absent/clearly not connected when setup is missing.
- Run `npm test`, `npm run interactions`, `npm run typecheck`, `npm run build`, and the optional Playwright `npm run browsercheck`.
- If Telegram or mobile internet fails during judging, use **Show sample candidate reply** and **Use sample QR invitation**, clearly labeled as fictional browser demonstrations. Never say the bot delivered a real message unless you saw it arrive.

**Privacy:** This is intentionally a hackathon demo, not production recruiting software. Only fictional names, data and test accounts should be used. Invitations are tokenized and expire after seven days; there is no complete recruiter authentication, candidate identity verification, consent management, or enterprise-grade audit service.

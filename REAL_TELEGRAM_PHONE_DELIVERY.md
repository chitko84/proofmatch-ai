# ProofMatch AI — Receive Real Telegram Meeting Invitations on Your Phone

This release **sends actual Telegram messages**, not a screenshot of Telegram. The candidate, job and recruitment situation remain **fictional sample data**. Do not present the fictional vacancy as an actual job offer.

## What you will demonstrate

1. As the recruiter, open `/demo/meetings` and choose **Candidate 01 → QA Automation Engineer**.
2. Pick a date/time in Malaysia, and click **Schedule & send to Telegram**.
3. Your linked Telegram account receives an **actual** message from your own bot with the job, date, time, and **View invitation and RSVP** button.
4. Open it on your phone, press **Yes, I'll join**, **Not right now**, or **Request another time**.
5. On the laptop, the recruiter meeting list updates from the same server-side record (allow ~3–5 seconds).
6. If accepted, open the LiveRoom on both devices and exchange real text messages through shared storage. Camera/audio calling panels are visual only; **this is a text chat**, not a video meeting.

## Important: a phone number is not enough

Telegram doesn't allow bots to start private conversations with someone by their phone number. The owner of the phone must voluntarily open the bot and press **Start** once. This app pairs that Telegram chat with your private demonstration through a one-time opt-in link. You do **not** need to enter or store a phone number.

## 1. Create or reuse your own Telegram bot

- On Telegram, open the official **@BotFather**, send `/newbot`, follow the prompts, and save the resulting bot token in your password manager. If you already have a bot, reuse its token and username.
- Keep the bot token secret. **Do not send it in ChatGPT or place it in GitHub.** If a token is leaked, regenerate it through BotFather.
- Install/open Telegram on the phone that should receive the invitations.

## 2. Create shared storage

Create an Upstash Redis database and get the **REST URL** and **REST token**. This is needed for both the private Telegram pairing and for the candidate's RSVP to appear on a separate laptop.

## 3. Add environment variables to Vercel

Configure all variables below in your ProofMatch Vercel project under **Settings → Environment Variables** (Production), and redeploy. Keep the same values in a local `.env.local` file when running the webhook-setup command.

```env
GEMINI_API_KEY=
DEMO_ACCESS_CODE=YOUR_PRIVATE_LONG_ACCESS_CODE
UPSTASH_REDIS_REST_URL=YOUR_UPSTASH_REST_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_UPSTASH_REST_TOKEN
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_BOT_USERNAME=YOUR_BOT_USERNAME_WITHOUT_AT
TELEGRAM_WEBHOOK_SECRET=YOUR_LONG_RANDOM_WEBHOOK_SECRET
TELEGRAM_DEMO_PAIRING_CODE=YOUR_PRIVATE_PAIRING_CODE
PROOFMATCH_PUBLIC_URL=https://YOUR-PROOFMATCH-SITE.vercel.app
```

For codes, choose **different random strings** for access, pairing and webhook. The webhook secret must contain only A-Z, a-z, 0-9, underscore or hyphen. The pairing code must be **8–40** characters of the same types (no spaces). The demo access code must have **at least 8** characters. Do not copy the `YOUR_...` examples literally. A random string can be generated in PowerShell with a secure generator or using Node:

```powershell
node -e "console.log(require('crypto').randomBytes(18).toString('hex'))"
```

IMPORTANT: Set `PROOFMATCH_PUBLIC_URL` to the **actual public HTTPS deployment URL**. `localhost:3000` links will not open your laptop's server from your phone.

## 4. Register Telegram's webhook

Install the project on your PC, open the `proofmatch-ai` folder, make sure `.env.local` has the values above, and run:

```powershell
npm install
npm run typecheck
npm run build
npm run telegram:setup -- https://YOUR-PROOFMATCH-SITE.vercel.app
```

The CLI verifies that the token belongs to your bot and registers the webhook at `/api/connect/telegram`. A different bot service must not be consuming the same bot updates at the same time.

## 5. Pair your personal Telegram account

1. Open your deployed `https://YOUR-PROOFMATCH-SITE.vercel.app/demo/meetings`.
2. Under **Send this invitation to Telegram**, enter `DEMO_ACCESS_CODE` in the private demo access field and click **Check Telegram**.
3. Enter the private `TELEGRAM_DEMO_PAIRING_CODE` in the pairing field; click **Pair my Telegram account**.
4. Open Telegram **on your phone** and press **Start**. The bot replies that your account has been connected.
5. Return to the recruiter page and click **Check Telegram** again. It should now say your account is linked.
6. Click **Send test to my phone**. Check that Telegram actually delivers the test message.

**If you cannot find the pairing button:** verify that `TELEGRAM_BOT_USERNAME` is correctly set on Vercel, and click **Check Telegram** first. Do not share the pairing link or code; the most recently paired chat becomes the demonstration recipient.

## 6. Send the actual sample meeting invitation

1. Select the sample candidate/role, future Malaysia date/time and duration.
2. Click **Schedule & send to Telegram** — **not** the browser-only **Schedule invitation** button.
3. The screen only reports a successful send after the Telegram API accepts the message and returns a message ID.
4. Tap the new Telegram message on your phone, and open the RSVP link.
5. Accept or suggest another time. Back on the laptop, the selected meeting refreshes automatically; after acceptance, use **Enter LiveRoom**.
6. On the phone's accepted invitation, use **Join the demo LiveRoom**. Type messages on both devices; the shared server record synchronizes every few seconds.

## Troubleshooting

- **No message:** the bot must be started by your phone account and paired successfully. Check whether you muted or blocked it. Check `TELEGRAM_BOT_TOKEN`, webhook status and Upstash configuration.
- **Webhook not working:** run `npm run telegram:setup` again after deployment, verify `TELEGRAM_WEBHOOK_SECRET`, and check `/api/connect/diagnostics`.
- **Send button disabled:** check your connection first. Real send only becomes enabled after linked recipient status is confirmed.
- **Cannot open link on phone:** check your public HTTPS `PROOFMATCH_PUBLIC_URL`; do not use localhost.
- **Phone reply not appearing:** verify Upstash and that the phone used the unique link from the delivered message, not a browser-only QR. Refresh the recruiter meeting page or select that invitation.
- **No video call:** expected. LiveRoom text chat works with shared storage. Video/audio calling was **not** implemented.
- **No separate device or internet:** choose **Schedule invitation** and **Load ready-to-show example** to use the existing browser-only fictional workflow. These do **not** send Telegram messages.

## Security / presentation ethics

Only pair an account you control, use fictional candidate profiles, keep all secrets out of screenshots and source control, and explain to the judges that the **delivery channel and cross-device exchange are real but the hiring scenario is fictional**. This demonstrates genuine functionality without implying that real employers have used the prototype.

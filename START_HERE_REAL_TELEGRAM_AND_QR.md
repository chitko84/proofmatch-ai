# Make Telegram and QR scanning work for real — Quick Start

ProofMatch Connect now contains **actual Telegram message handling** and **real QR codes** with fictional job data. But these are not automatically live on a new computer: you must connect YOUR services first.

## A. Your phone can scan the QR — 3 steps

1. Deploy the ProofMatch website to Vercel so it has a public HTTPS link, for example `https://your-project.vercel.app`. (The QR must NOT point at `localhost`.)
2. Open `https://your-project.vercel.app/demo/connect`. Choose Candidate 01 and QA Automation Engineer. Click **Prepare invitation**. Scan the code from your phone's ordinary camera.
3. Your phone should open the **Candidate Passport** with Candidate 01 and the fictional QA role already filled. Click **Fill demo reply** then **Send my response**. To show the response on the recruiter's laptop, complete the shared-storage steps below. Without shared storage, the phone can open the link and show demo data, but its reply cannot synchronize with the laptop.

For an **in-app scanner**, open `/demo/scan`. You can scan a QR using the camera *when the browser supports it*, upload a QR screenshot, or click **Use sample QR invitation**. If the camera detector is unsupported, use the phone's regular camera to scan the same QR instead.

## B. Make the Telegram bot send REAL messages — 6 steps

1. In Telegram, search for **@BotFather** (official Telegram service). Send `/newbot`, follow the prompts, and keep your new **bot token private**.
2. Create an Upstash Redis database. Copy the REST URL and REST TOKEN into Vercel's project environment variables named `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`. This is what sends responses between the phone and your recruiter dashboard.
3. Also add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` (without @), `TELEGRAM_WEBHOOK_SECRET` (a long random alphanumeric/underscore/hyphen string), and `DEMO_ACCESS_CODE` (a different private access code). Put these values in your own local `.env.local` too. **Never paste tokens or secret keys into chat, screenshots, or a GitHub repo.**
4. Redeploy the Vercel project. On your own computer, inside the `proofmatch-ai` directory, run:

   ```powershell
   npm install
   npm run telegram:setup -- https://YOUR_ACTUAL_PROJECT.vercel.app
   ```

5. Open the deployed site at `/demo/connect`. Press **Check live connections**. It will verify the bot, webhook, and shared store. You should see that the services are connected. Then use Candidate 01 + QA, enter the demo access code, and click **Prepare invitation**.
6. Open **Telegram** from the button or scan its **second QR** with your phone. Press Start and choose **I'm interested → Hybrid**. Wait about 6 seconds: the response appears in the recruiter dashboard marked **From Telegram**. If not, click **Check response** and see the status instructions.

The bot cannot send you a private message until **you have started a chat with it**—this is a Telegram platform rule. The working flow is invitation deep-link → user taps Start → bot responds → user taps option → recruiter sees actual response.

## C. One-minute judging rehearsal

- Open `/demo/connect` and check the live-connection result.
- Generate the two QR codes: **Passport** and **Telegram**.
- Use your phone camera to scan Passport, then scan Telegram.
- Respond to the Telegram buttons; watch the response appear in the laptop dashboard.
- If the internet or bot has a problem, choose **Show sample candidate reply** in browser-demo mode. Explain that this is a fictional fallback, not a delivered Telegram message.

## What we have actually verified in the generated source

The QR link parser, safe URL checks and existing matching functions have automated offline tests. Real Telegram delivery, phone camera behavior, Redis synchronization, and the production build still require YOUR deployment and a real manual test; they cannot be certified without the external accounts and browser environment.

Full detailed guide: `CONNECT_SETUP.md`.

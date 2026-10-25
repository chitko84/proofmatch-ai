# ProofMatch AI — Windows + GitHub + Vercel Deployment

## A. Local build gate (do this before GitHub)

1. Extract the Phase 4 ZIP to a new folder, not over an open Phase 3 folder.
2. Open **the inner `proofmatch-ai` folder** in VS Code.
3. Open PowerShell. Run:

```powershell
node -v
npm install
npm run preflight
npm test
npm run typecheck
npm run build
npm run dev
```

4. Open `http://localhost:3000`. Use **Try Demo**. `http://localhost:3000/api/health` should return `"status":"ok"`.
5. In another PowerShell terminal in the same folder:

```powershell
$env:BASE_URL='http://localhost:3000'
npm run smoke
```

If the build or smoke test fails, **do not publish yet**. Capture the exact terminal error.

## B. Optional real Gemini functionality

Obtain a **Gemini Developer API key** from https://aistudio.google.com/apikey. Copy `.env.example` to `.env.local` and fill the variables:

```dotenv
GEMINI_API_KEY=your_actual_private_key
GEMINI_MODEL=gemini-3.8-flash
DEMO_ACCESS_CODE=your-private-demo-code
```

Model names and free quotas can change. Choose a model actually listed for your key and test it locally. Never share, screenshot or commit `.env.local`. The sample match engine works without any Gemini key.

`DEMO_ACCESS_CODE` protects all four live API endpoints; enter the code when using **Analyze**, **Mira**, **FuturePath**, or **FairShot follow-up**. This is not user authentication or a general rate limiter.

If testing without a key, leave the example value blank and rely on the honestly labeled sample flows.

## C. Create/push a GitHub repository

From the `proofmatch-ai` directory:

```powershell
git init
git add .
git status
git commit -m "ProofMatch AI Phase 4 release candidate"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPO.git
git push -u origin main
```

Create the empty repository on GitHub first; if `origin` already exists use `git remote set-url origin ...` instead. Inspect `git status` before committing to confirm `.env.local` is excluded. Make the repo public only if you choose; **never** commit an API key.

## D. Vercel project settings

1. In https://vercel.com/new choose **Import Git Repository** and select this repo.
2. Framework: **Next.js** (autodetected).
3. Root directory: repository root `.` (the folder containing `package.json`). If your Git repo wraps the project in an outer folder, point Root Directory to `proofmatch-ai` instead.
4. Build command: `npm run build` (default Next.js build is also acceptable).
5. Install command: `npm install`.
6. Add **Environment Variables** in the Vercel project: `GEMINI_API_KEY`, `GEMINI_MODEL`, and recommended `DEMO_ACCESS_CODE` to the **Production** environment. Do not add them under `NEXT_PUBLIC_`.
7. Deploy and wait for status **Ready**. Any build failure must be fixed first.
8. Open the website, then `/api/health` and verify it returns `status: ok`. This does not confirm Gemini is reachable.
9. Run the smoke script from your local project:

```powershell
$env:BASE_URL='https://YOUR-SITE.vercel.app'
$env:DEMO_ACCESS_CODE='your-private-demo-code'
npm run smoke
```

10. Test one fictional live Gemini CV. Test the door animation, Mira text, the 3D scene, and FairShot. **Capture screenshots at mobile and desktop widths.**

## E. If there's a problem

- `npm install` fails: check internet / proxy and Node 22+.
- TypeScript fails: fix indicated file and line; don't ignore it.
- Next build fails: capture full build log, including first error.
- Gemini 401/403: review server-side key and permissions; do not expose the key.
- Gemini 404/400: check that the configured model is enabled for that account.
- Gemini 429: quota reached; fall back to the clearly labeled fictional demonstration.
- API 401: enter the configured `DEMO_ACCESS_CODE` on the current AI page.
- 3D/voice issues: use typed Mira chat, keep the main evidence matching demo.
- Wrong images: external photo CDN may be blocked; replace with legally licensed locally saved WebP images before final sign-off.

## F. Freeze and present

Once stable, record the deployed URL, commit hash and screenshots in `QA_CHECKLIST.md`. Do not edit the demo on presentation day unless fixing a blocking bug. Keep a browser tab and backup recording ready.

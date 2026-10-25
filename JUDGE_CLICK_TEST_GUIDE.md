# ProofMatch AI — No-Dead-Buttons Judge Rehearsal

## Start here

1. Run `npm install` in the `proofmatch-ai` folder.
2. Run `npm test`, `npm run interactions`, `npm run typecheck`, and `npm run build`. Resolve all reported issues before pitching.
3. Run `npm run dev` and open `http://localhost:3000/demo/guide`.
4. Use the guided demo cards. Each card is an actual link to a working screen with fictional candidates and roles already chosen.
5. Optionally run the full-browser check (see below) to exercise the primary journey automatically.

## One-click sample actions (no typing required)

| Page | Exact action to click | Expected result |
| --- | --- | --- |
| `/demo` | **Start guided demo** | Opens the judge walkthrough |
| `/demo/analyze` | **Fill sample CV** | Populates the form with fictional CV/project text |
| `/demo/analyze` | **Show sample matches (no AI needed)** | Opens the QA evidence comparison immediately, without Gemini |
| `/demo/expectations` | **Show sample work-preference mismatch** | Selects a remote-preferring candidate and an on-site/hybrid job |
| `/demo/criteria` | **Try a sample change**, **Reset preview** | Updates then restores the comparison |
| `/demo/fairshot` | **Fill sample answer** → **Save response for HR review** | Creates an unverified fictional statement; match review can include it |
| `/demo/candidate-reply` | **Fill sample explanation** → **Add clarification** | Saves an unverified clarification and updates the comparison |
| `/demo/reviews` | **Load sample HR decisions** | Creates fictional HR review choices; **Clear my demo decisions** reverses it |
| `/demo/interview` | **Pick two sample questions** | Enables copy of two prewritten role-specific questions |
| `/demo/connect` | **Use sample opportunity** → **Prepare invitation** | Generates same-browser candidate passport link/QR |
| `/demo/connect` | **Show sample candidate reply** | Saves and displays a clearly labeled fictional response in this browser |
| `/passport?candidate=C01&role=qa` | **Fill demo reply** → **Send my response** | Stores a sample candidate response with explicit consent and confirmation |
| `/demo/mira` | **Show a sample Mira reply (no internet)** | Displays a source-grounded, labeled sample response immediately |
| `/demo/futurepath` | **Show sample explanation** | Displays a clearly labeled fictional career-path explanation immediately |
| `/demo/guide` | Any demo-step link | Opens the appropriate actual page |

## Browser-based click check

While the Next.js site is running, open another PowerShell window:

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

The check clicks forms and buttons using Chromium and reports failures. It **cannot be certified until run against a real server**, and browser differences (microphone permissions, speech synthesis, external Telegram, live Gemini) still require individual checks. If the automation reports an issue, send the terminal output or screenshot so it can be fixed before judging.

## Important boundaries

- **Live Gemini analysis** needs `GEMINI_API_KEY`, quota, and a working network. It must not silently pretend a sample response came from Gemini. Use **Show sample matches** as the reliable offline path.
- **Real Telegram messages** need bot setup and shared storage. The in-browser sample reply explicitly does not send Telegram messages. A QR opened on a different device will not sync without shared storage.
- **Browser voice** depends on the user's device and browser permissions. Mira always supports typing and an instant, visibly labeled sample answer.
- **No button or link should imply a real hire, job offer, applicant verification, or guaranteed career promotion.**
- All stored fictional review actions stay on this browser unless explicitly connected to a real shared backend.

## Presentation-day fallback

Open `/demo/guide` before joining your session, keep another tab ready at `/demo/matches?candidate=C01&role=qa`, and have a PDF/video backup. When presenting, click the **sample** actions (not live network-dependent ones) unless Gemini and Telegram have been individually verified.

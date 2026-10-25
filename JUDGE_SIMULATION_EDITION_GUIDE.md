# ProofMatch AI — End-to-End Presentation Simulation Edition

This release extends the **existing Next.js project**. All original matching features, data, pages, and real Telegram integration code remain present. The new meeting and voice features are designed as a convincing but accurately labeled **fictional demonstration**.

## Start the full application

1. Unzip the complete source archive and open the inner `proofmatch-ai/` folder.
2. Install dependencies: `npm install`.
3. Run `npm test`, `npm run interactions`, `npm run typecheck`, `npm run build`.
4. Launch `npm run dev` and open `http://localhost:3000/demo/guide`.
5. Click **Prepare all demo examples**. This fills demo HR reviews, candidate replies, sample invitations, and an accepted LiveRoom meeting.

If a build or test fails, **do not use that deployment for judging until the failure is resolved**.

## Full demo: one candidate, two sides

| Page | Action | What the judges see |
|---|---|---|
| `/demo/discover` | Open Candidate 01 | Evidence suggests another **open** job, QA Automation Engineer |
| `/demo/matches?candidate=C01&role=qa` | Open the supporting evidence | Python fixtures, pytest suite, GitHub Actions; no verified API-testing example |
| `/demo/expectations` | Explore both sides | Candidate work preferences versus job arrangements; human discussion needed |
| `/demo/meetings` | **Load ready-to-show example** | An accepted example meeting appears immediately |
| `/demo/meetings` | **Enter LiveRoom** | Opens a fictional recruiter/candidate meeting scene |
| LiveRoom | **Join practice meeting** | Timer, two participant avatars, voice and message controls activate |
| LiveRoom | **Play sample conversation** | Three question-and-answer exchanges appear, based on Candidate 01's actual demo profile |
| LiveRoom | Ask a custom question | An example candidate replies about job interest, projects, salary discussion or hybrid work |
| LiveRoom | **Speak to type** | If the browser supports speech recognition, your words appear in the chat input; otherwise type or choose a suggested prompt |
| LiveRoom | **Camera preview** | With permission, shows your own camera **locally**; no video is sent to another person |
| LiveRoom | **Finish meeting** | A meeting recap and **Download discussion notes** action appear |
| `/demo/mira?candidate=C01&role=qa` | **Hear Mira speak** | Mira introduces herself using browser speech or a bundled audio fallback |
| Mira | **Instant guided answers** + ask a question | Immediate candidate-specific explanation, **without Gemini or an API key** |
| Mira | Click microphone | Speech recognition in supported browsers, with a visible typing fallback |

## Example things to ask Mira

- "Why might Candidate 01 suit another open position?"
- "What evidence is missing for QA?"
- "Do their work preferences match?"
- "How would I schedule a meeting?"
- "How does ProofMatch work?"
- "Can HR discuss salary?"
- "Who makes the final hiring decision?"

Mira's **Instant guided answers** mode is deterministic, based on the existing fictional candidate/job dataset. If **Try live Gemini AI** is selected and Gemini is inaccessible, the conversation falls back to a clearly labeled sample response. Voice synthesis uses the browser's available English voice; two included MP3 samples provide a limited voice fallback where speech synthesis fails. Speech recognition depends on browser support and microphone permissions.

## Emergency independent backup

`PRESENTATION_OFFLINE_BACKUP.html` is an **independent single-file HTML practice walkthrough**. Double-click it in a browser. It requires **no Next.js server, no internet, no API token**, and includes embedded voice audio.

It covers six key stops: recruiter overview → Blindspot Rescue → Evidence Ledger → invitation and RSVP → meeting practice → Mira. It does **not** contain all pages or replace the full project. The backup's Telegram message is a **preview, not an actual Telegram send**.

For a quick local syntax/interaction check of the backup in a functioning desktop Chromium browser, open `PRESENTATION_OFFLINE_BACKUP.html?selftest=1`; its four self-tests print PASS/FAIL results at the bottom of the page. We have checked JavaScript syntax but were unable to complete a visual Chromium run in this environment.

## Real Telegram vs staged meeting

- The **existing real Telegram code** is still in the source. An actual message requires a consenting Telegram account to start the bot, a valid bot token, configured shared storage, a public HTTPS deployment and correct webhook setup. No phone message was sent or verified in this work session.
- In the **browser-only meeting**, automatic example replies are fictional. The site does not secretly send messages to real candidates.
- With a configured shared meeting, human participants can exchange **text**, and the automatic practice actor is disabled in shared mode. **Audio/video communication is not a real network call.** Camera access is only a local preview; spoken sample replies come from the browser or audio files.
- A QR scanned on another phone can open fictional invitation details; **cross-device syncing requires the configured shared backend**.
- Every claim about candidates is fictional candidate-supplied evidence, not independently verified. No actual hiring decision, verified performance uplift, validated business savings, or real job offer is shown.

## Before the live presentation

Use **Chrome or Edge on Windows**, confirm your computer speakers are not muted, and make sure the computer has allowed audio output. Open Mira and click **Hear Mira speak**, then visit LiveRoom to run its join → question → reply → finish sequence. Verify `npm run build` and `npm run browsercheck` locally. If there is no internet, use the sample answers and the offline backup.

### Required release checks

```powershell
npm install
npm test
npm run interactions
npm run preflight
npm run telegram:simulate
npm run typecheck
npm run build
npm run dev
```

In another terminal, after optional Playwright setup (`npm install --no-save playwright` and `npx playwright install chromium`):

```powershell
npm run browsercheck
```

Do not treat passing offline tests as proof of a successful build, live Telegram delivery, successful speech permissions, or actual cross-device video.

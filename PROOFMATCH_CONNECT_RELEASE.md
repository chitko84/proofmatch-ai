# ProofMatch AI — Full Project Update: Connect + Friendly Language

**Source base:** Phase 4A complete project with automatic landing-page doors, no Next.js badge, ProofWatch and Mira’s Holographic Studio.

## Features added

| Page | Address | What it does in simple English |
|---|---|---|
| Invite someone | `/demo/connect` | HR selects a fictional candidate and another open job, then prepares a QR-linked invitation. |
| Candidate Passport | `/passport?candidate=C01&role=qa` | The candidate can say if they are interested, choose a working arrangement, and add an optional note. |
| Interview Companion | `/demo/interview` | Suggests useful job-related questions from existing sample role requirements and evidence; HR chooses which questions to keep. |
| Telegram bot (opt-in) | `/api/connect/telegram` | **Optional and not active by default.** With a real Telegram bot, webhook and Upstash storage, a person can voluntarily start the bot, respond and share work-mode preferences. |

## Language improvements

- Navigation and buttons use common words such as **Compare job matches**, **Add or correct details**, **What works for both sides**, **Invite to another job**, **Prepare interview questions** and **Where we found this**.
- Candidate-facing pages ask short, understandable questions.
- All responses remain candidate statements, not verified proof of ability.
- Human review is never replaced with automatic hiring or rejection.
- Brand names (Blindspot Rescue, FairShot, ProofWatch, Mira and FuturePath) are retained when useful, with plain-English descriptions nearby.

## Exactly what is live and what isn't

- **Ready as code:** Candidate invitations, QR generation, local-browser candidate reply, simple interview question builder, and optional server-based Redis + Telegram integration routes.
- **Works without new external credentials:** Local-browser invitation flow and interview preparation. With this setup, use the same browser for candidate reply and HR review.
- **Requires external configuration for a live demonstration:** Upstash Redis REST for sharing candidate replies across devices, and BotFather/Telegram Bot API webhook for real Telegram conversations. These are **not connected by the ZIP**.
- **Not confirmed in this sandbox:** An npm dependency installation, the complete production build, the running website screenshots or real Telegram delivery, because the npm registry is unavailable. Execute local test commands below.

## Verification

Run in PowerShell from the extracted project directory:

```powershell
npm install
npm test
npm run preflight
npm run typecheck
npm run build
npm run dev
```

In another terminal:

```powershell
npm run smoke
```

Before competing: inspect mobile layouts, all QR and candidate response buttons, and Telegram connection if configured. Do not claim a cross-device workflow is working without an actual phone/browser test.

## Optional setup

See `CONNECT_SETUP.md` for explicit environment variable names and webhook steps. Do **not** send or publish your Gemini/Upstash/Telegram secrets.

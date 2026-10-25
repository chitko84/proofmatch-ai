<div align="center">

# ProofMatch AI

### Great talent deserves to be seen.

**Evidence-first talent matching that looks beyond CV keywords.**

Built for **AI Future Makers 2026 · Challenge 02 — MATCH: Better Talent Matching**

[Explore the Demo](#experience-the-demo) · [How It Works](#how-proofmatch-works) · [Features](#product-experiences) · [Run Locally](#run-locally) · [Deployment](#deployment-and-live-integrations)

</div>

---

## The problem

Traditional recruitment workflows can miss capable people when their CV title or keywords do not closely resemble a job description. A candidate may apply for one position while their strongest documented experience points toward another. Recruiters also need to understand **why** a match appears, not just receive a score.

**ProofMatch AI** is an interactive recruitment prototype that makes supplied evidence easier to inspect, identifies potential cross-role opportunities, and lets candidates clarify missing information. It is designed to support—not replace—human hiring decisions.

## The idea in one example

A fictional candidate, **Candidate C01**, applies for a Frontend Developer position. Their submitted materials also contain evidence of **Python, pytest, and GitHub Actions**. ProofMatch compares that evidence across three open roles and can surface a stronger documented fit for **QA Automation Engineer**.

Instead of silently filtering the applicant out, the recruiter can:

1. Discover the alternative opportunity through **Blindspot Rescue**.
2. Inspect the underlying candidate-supplied excerpts in the **Evidence Ledger**.
3. Compare practical expectations such as salary, location, and work arrangement.
4. Request missing information through **FairShot** and retain control of the decision.
5. Demonstrate an interview invitation and follow-up through **LiveRoom**.

**Important:** C01 and all other candidate profiles, job details, salaries, meetings, and interview examples in this repository are fictional. Evidence excerpts are candidate-supplied examples, not independently verified credentials.

## What makes ProofMatch different

| Conventional keyword-first screening | ProofMatch AI approach |
| --- | --- |
| Focuses heavily on titles and keywords | Compares supplied evidence against specific role requirements |
| Evaluates an applicant primarily for the selected role | Checks for stronger documented alignment with other open roles |
| May expose a score without a clear explanation | Links coverage findings to inspectable evidence excerpts |
| Treats missing information as a dead end | Gives candidates a structured opportunity to clarify through FairShot |
| Separates job fit from practical preferences | Includes mutual expectations alongside evidence coverage |
| Can obscure the basis of screening | Keeps the recruiter in control with transparent, reviewable outputs |

ProofMatch's percentages represent **weighted coverage of supplied evidence**, not the probability of job success, an assessment of a person's worth, or an automated hiring recommendation.

## Product experiences

### Discover and evaluate

- **Multi-role Matching** — compare fictional candidate evidence against three open positions: Frontend Developer, QA Automation Engineer, and Data Analyst.
- **Blindspot Rescue** — highlight an alternative role only when its documented evidence coverage is strictly higher than the candidate's applied role.
- **Evidence Ledger / Evidence X-Ray** — trace matching conclusions to candidate-supplied excerpts and distinguish demonstrated, partial, and missing evidence.
- **Mutual Expectation Matching** — compare candidate and employer preferences, including compensation, location, and work mode.
- **FairShot** — invite standardized clarification or additional evidence instead of equating missing documentation with missing ability.
- **Criteria Preview and Human Review** — expose matching criteria and preserve the recruiter's final judgment.

### Explore and explain

- **Mira Holographic Studio** — a 3D-style assistant experience with selected candidate/role context, server-side Gemini integration when configured, and clearly labeled guided fallback responses.
- **ProofWatch** — a wearable-inspired signal panel with local time, navigable sample alerts, and direct links to evidence review or Mira.
- **FuturePath** — explore illustrative skill-development pathways; it does not predict promotions or future career outcomes.
- **Proof Over Polish** — a controlled demonstration of deterministic rewording stability after extraction, not a general fairness certification.
- **Recruiter Insights** — interactive dashboard calculated from **8 fictional candidates × 3 roles**, including filter-responsive KPIs, charts, and comparisons.
- **3D-style Talent Explorer** — compare the sample evidence for Candidate C01 across roles directly from the landing experience.

### Connect and collaborate

- **ProofMatch Connect** — share fictional opportunities and candidate passports with QR-based flows.
- **QR Passport** — generate QR codes locally; supported browsers may scan them using the camera over HTTPS or localhost.
- **Interview Companion** — guided interview-related demonstration experience.
- **LiveRoom** — schedule sample meetings, explore invitation and RSVP workflows, and rehearse a labeled simulated interview conversation.
- **Telegram Integration** — optional real bot notifications, opt-in account pairing, phone RSVP, and cross-device text updates after the required services are configured and verified.

> **Simulation boundary:** The guided interview dialogue and meeting experience are demonstration features, not a production video-conferencing service. Local camera preview or browser speech features depend on device/browser permissions. Real Telegram messages and cross-device synchronization require external configuration.

## Experience the demo

**Recommended entry point:** `/demo/guide`

1. Open the application and navigate to **`/demo/guide`**.
2. Select **Prepare all demo examples** to initialize the fictional showcase flow.
3. Open **Blindspot Rescue** at `/demo/discover` and inspect Candidate C01's alternative role.
4. Review source-linked coverage at `/demo/matches?candidate=C01&role=qa`.
5. Compare preferences at `/demo/expectations`.
6. Explore meeting scheduling at `/demo/meetings` and the sample LiveRoom experience.
7. Ask **Mira** about C01's QA evidence at `/demo/mira?candidate=C01&role=qa`.
8. Visit `/demo/insights` to see the fictional-data analytics dashboard.

The guide includes shortcuts and prepared sample states for a presentation-friendly walkthrough. Some experiences may use clearly labeled browser-local simulations when live services are not configured.

## Technology

| Layer | Technology / approach |
| --- | --- |
| Application | Next.js App Router, React, TypeScript |
| Styling | Tailwind CSS, responsive interface |
| Backend endpoints | Next.js server route handlers under `src/app/api/` |
| AI assistance | Optional server-side Gemini API; labeled fallback when unavailable |
| QR generation | `qrcode` package, generated locally |
| Telegram notifications | Optional Telegram Bot API and webhook |
| Shared state | Optional Upstash Redis REST for cross-device pairing, invitations, and replies |
| Deployment | Vercel |
| Validation | TypeScript, automated tests, preflight checks, interaction audit, build, optional browser checks |

The standard application and its API routes are deployed together; a separate Python or PHP backend is **not** required.

## Run locally

**Requirements:** Node.js **22+**, npm, and internet access for installing dependencies.

```powershell
git clone https://github.com/chitko84/proofmatch-ai.git
cd proofmatch-ai
npm install
npm run preflight
npm test
npm run typecheck
npm run build
npm run dev
```

Open **http://localhost:3000** and start at **http://localhost:3000/demo/guide**.

For an optional local API smoke test, keep the development server running and execute in another PowerShell window:

```powershell
$env:BASE_URL='http://localhost:3000'
npm run smoke
```

Check `/api/health` for a basic server health response. A successful health response alone does **not** prove that Gemini, Telegram, or Redis is functioning.

### Available checks

```powershell
npm run showcase:check
npm run typecheck
npm run build
npm run interactions
```

Optional browser automation (requires a running site):

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

Browser support, permissions, WebGL, voice behavior, and external integrations should also be tested manually on the devices used for the presentation.

## Deployment and live integrations

### Deploy to Vercel

Connect the repository **[chitko84/proofmatch-ai](https://github.com/chitko84/proofmatch-ai)** to a Vercel project. The application uses Next.js and includes its server API routes. Configure any required secrets in **Vercel → Project Settings → Environment Variables**, then redeploy.

For detailed instructions, see [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md).

### Optional environment configuration

Use `.env.example` as the reference for supported variables. Create `.env.local` for local secrets; **never commit it**.

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Optional server-side Gemini integration |
| `GEMINI_MODEL` | Gemini model selected for the deployment |
| `DEMO_ACCESS_CODE` | Lightweight access gate for selected demo API operations |
| `TELEGRAM_BOT_TOKEN` | Telegram bot API token from BotFather |
| `TELEGRAM_BOT_USERNAME` | Bot username, without `@` |
| `TELEGRAM_WEBHOOK_SECRET` | Secret used to validate Telegram webhook requests |
| `TELEGRAM_DEMO_PAIRING_CODE` | Private code for the opt-in demo pairing flow |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST authentication token |
| `PROOFMATCH_PUBLIC_URL` | Public HTTPS URL of the deployed app |

Only configure the variables needed for the services you intend to demonstrate. **Do not expose server secrets through `NEXT_PUBLIC_` variables.** The demo access code is not production-grade authentication or rate limiting.

### Telegram phone notifications

The code includes a path for **real** Telegram delivery, but a live bot and phone pairing must be set up separately:

1. Create a bot with **@BotFather** and obtain its token and username.
2. Configure the bot credentials and webhook secret in Vercel.
3. Create an Upstash Redis database and configure its REST credentials for shared state.
4. Set the deployed HTTPS URL and redeploy the application.
5. Follow the setup scripts and webhook instructions in the repository documentation.
6. Start the bot from the receiving Telegram account, complete opt-in pairing, and send a test notification.
7. Verify that a phone RSVP appears on the recruiter side before demonstrating it as a live feature.

Telegram bots cannot initiate a private chat with an account that has not started or otherwise authorized the bot. A phone number by itself is not sufficient.

Read [`START_HERE_REAL_TELEGRAM_AND_QR.md`](START_HERE_REAL_TELEGRAM_AND_QR.md), [`REAL_TELEGRAM_PHONE_DELIVERY.md`](REAL_TELEGRAM_PHONE_DELIVERY.md), and [`CONNECT_SETUP.md`](CONNECT_SETUP.md) before enabling this flow.

## Privacy, fairness, and responsible use

ProofMatch is an **educational, hackathon-stage prototype**, not a production applicant-tracking system or a validated employment assessment tool.

- **Fictional data:** All included candidate profiles, employers, compensation, invitations, and interview scenarios are demonstration examples.
- **Evidence is not verification:** An excerpt may support an interpretation of submitted material, but does not independently establish that a skill or credential is authentic.
- **Coverage is not suitability:** Matching percentages reflect weighted coverage of provided evidence; they are not hiring probabilities, candidate rankings of human value, or guarantees of performance.
- **Human oversight:** The recruiter reviews evidence and makes all consequential hiring decisions.
- **Fairness claims are limited:** Controlled rewording checks do not establish absence of bias or legal compliance.
- **Candidate voice:** Clarification and right-of-reply features help prevent incomplete information from being treated as conclusive.
- **Secrets stay private:** Keep API keys, bot tokens, access codes, and Redis credentials out of source control.
- **No real applicant records:** Do not enter or publish personal recruitment data without appropriate security, privacy safeguards, and authorization.

## Project documentation

| Document | Use it for |
| --- | --- |
| [`FINAL_SHOWCASE_GUIDE.md`](FINAL_SHOWCASE_GUIDE.md) | Showcase flow and feature readiness |
| [`PRESENTATION_DEMO_READINESS.md`](PRESENTATION_DEMO_READINESS.md) | Pre-presentation checks and fallbacks |
| [`JUDGE_CLICK_TEST_GUIDE.md`](JUDGE_CLICK_TEST_GUIDE.md) | Manual interaction testing |
| [`JUDGE_DEMO_RUNBOOK.md`](JUDGE_DEMO_RUNBOOK.md) | Short judge walkthrough and recovery paths |
| [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md) | Production deployment |
| [`START_HERE_REAL_TELEGRAM_AND_QR.md`](START_HERE_REAL_TELEGRAM_AND_QR.md) | Live Telegram and QR setup overview |
| [`REAL_TELEGRAM_PHONE_DELIVERY.md`](REAL_TELEGRAM_PHONE_DELIVERY.md) | Bot delivery, pairing, and RSVP setup |
| [`CONNECT_SETUP.md`](CONNECT_SETUP.md) | Shared data and Connect integration |
| [`QA_CHECKLIST.md`](QA_CHECKLIST.md) | Release verification |
| [`PHASE_4_RELEASE_REPORT.md`](PHASE_4_RELEASE_REPORT.md) | Earlier implementation and validation record |

## Project status

**Showcase-ready codebase, with live-service verification still required.** The repository includes fictional demo flows, source-linked matching explanations, responsive recruiter experiences, and optional integration code. Successful local typechecking and production builds are necessary release checks; they do not replace deployed-browser QA, real Gemini API verification, or end-to-end Telegram phone testing.

---

<div align="center">

### ProofMatch AI

**See the evidence. Discover the potential. Keep people in control.**

*AI Future Makers 2026 · Challenge 02 — Better Talent Matching*

</div>

# ProofMatch AI — Presentation Demo Readiness

**Important:** This project is an honest *fictional candidate* demonstration. No preloaded data represents real recruitment, employers, applicants or Telegram messages. We do not claim to have verified candidate skills or demonstrated real-world hiring improvements.

## 1 — Prepare everything in one click

1. Open the project in VS Code and run `npm install`, `npm run typecheck`, `npm run build`, then `npm run dev`.
2. Open **http://localhost:3000/demo/guide**.
3. Click **Prepare all demo examples**. A success message confirms saved sample HR reviews, candidate explanations and candidate invitation history.
4. Keep using the **seven on-page links**, which carry the relevant candidate and job in the URL when needed. The setup can be repeated without duplicating records and does not overwrite decisions you already made.

### Example data made available

| Where | Fictional data shown |
| --- | --- |
| Dashboard / ProofWatch | Eight sample candidates, three open roles, evidence-grounded alternative-role signal |
| Blindspot Rescue | Candidate 01 applied to Frontend but has better documented evidence for QA Automation |
| Evidence Ledger | Exact supplied text excerpts and missing evidence, not AI-certified qualifications |
| Mutual Expectations | Candidate 05 prefers remote, QA role offers on-site/hybrid; Candidate 08 has example salary expectations above the QA example budget |
| Human Review | Prepared review entries for Candidate 01 QA and Candidate 02 Frontend |
| Candidate Right of Reply | A preloaded, explicitly fictional work-sample clarification for Candidate 01 |
| FairShot | Example QA API testing task plus one-click candidate answer and saved fictional response |
| ProofMatch Connect | An example invitation with a fictional reply and another awaiting a reply; browser storage only unless server services configured |
| Candidate Passport | One-click fictional reply, consent and saved confirmation |
| Interview Companion | Job- and candidate-specific questions, with one-click selection and copy/manual-copy fallback |
| Mira | Fictional evidence cards plus **Show a sample Mira reply** without API credentials |
| FuturePath | Three fictional company paths plus **Show sample explanation** without API credentials |
| CV analysis | **Fill sample CV** and **Show sample matches** without a Gemini key |
| Criteria | **Try a sample change** then reset |
| Proof Over Polish | Controlled rewriting comparison, clearly *not* an AI fairness audit |

## 2 — Expectations demo (mentor-recommended)

- Go to `/demo/expectations`.
- Click **Show sample work-preference mismatch** to show Candidate 05 and the QA role. Discuss why remote-only vs hybrid/on-site is a *conversation*, not rejection.
- Click **Show sample salary mismatch** to show Candidate 08's fictional expected salary above the QA role's fictional budget. Discuss compensation **without automatically excluding the candidate**.
- Location is also shown as a discussion topic, not a predictive hiring criterion.
- The salary numbers are **invented illustrations**, not market salary statistics or actual offers.

## 3 — No-key and no-connection plan

- **Gemini unavailable:** use the preloaded match comparison and labeled Mira sample reply; avoid presenting it as live AI.
- **Telegram / shared storage unavailable:** demonstrate the **browser-only** invitation and passport with the same browser. A QR opened on a phone may show the fictional role, but its reply **will not sync** across devices until the shared storage configuration is completed.
- **Microphone unavailable:** type a question or click Mira's sample reply. Browsers have different speech support.
- **Clipboard blocked:** Interview Companion displays a manual copy area; Connect displays the invitation link as text.
- **Animations reduced or skipped:** the landing page remains accessible and the demo can start at `/demo/guide`.

## 4 — Exact local verification commands

```powershell
npm install
npm test
npm run interactions
npm run typecheck
npm run build
npm run dev
```

In a second PowerShell window, with the site running:

```powershell
npm install --no-save playwright
npx playwright install chromium
npm run browsercheck
```

The offline audit checks JSX wiring and route references. **It cannot prove every click works visually or end-to-end.** The browser test is designed to exercise main judge-critical workflows; manually rehearse the entire 5-minute pitch on the same laptop and browser.

## 5 — Recommended judge sequence

1. Enter via the landing page; go to `/demo/guide` and prepare data before the call.
2. Show dashboard + ProofWatch.
3. Show Candidate 01 → QA alternative on Blindspot Rescue.
4. Open direct source evidence and explain what still needs confirmation.
5. Show expectations, especially one salary/work-mode discussion.
6. Save/inspect a FairShot example and HR review, if time permits.
7. Show Mira's labeled sample answer if time permits.

**Don't introduce new services or untested dependencies during the final judging rehearsal.**

# ProofMatch AI — Final Judge Demonstration Runbook

**Recommended 2-minute live product story:** One overlooked candidate → alternative match → exact evidence → fair chance to add missing information → human review. Everything runs on **fictional demo data**.

## Pre-demo setup (2 minutes before presenting)

- Open the **deployed, smoke-tested** Vercel homepage in Chrome at 100% zoom. Keep `/demo/discover?candidate=C01` and `/demo/matches?candidate=C01&role=qa` in background tabs.
- Use 1440×900 (or 1366×768) with browser bookmarks hidden. Keep notifications off.
- Ensure demo profiles are reset if your prior local candidate corrections could alter coverage in the story (incognito/private browser is easiest).
- If Gemini live mode will be demonstrated, enter the demo access code **privately**. Do not expose the Gemini API key or actual candidate records.
- Have a screen recording of a known-working end-to-end flow ready as backup (record only **after** browser QA passes).

## 0:00–0:12 — First impression

**Screen:** `/` → **Explore ProofMatch** → skippable cinematic entrance.

> "Great talent deserves to be seen. Today, hiring filters can miss people who have the right evidence but applied under the wrong job title. ProofMatch helps recruiters give those people another look."

## 0:12–0:40 — The flagship innovation

**Screen:** `/demo/discover` → Candidate 01 → open the QA alternative.

> "This fictional candidate applied for Frontend. But her supplied project notes describe automated tests and delivery workflows. Our system doesn't decide who to hire; it surfaces a better-supported QA role for the recruiter to explore."

Do not claim all candidates are rescued or that this is the first such feature globally.

## 0:40–1:05 — Explainable evidence

**Screen:** `/demo/matches?candidate=C01&role=qa` → Evidence X-Ray.

> "Here is the exact example supporting this requirement. Here is information we still couldn't confirm. Unlike a mysterious fit score, the recruiter can inspect the supplied source and ask a useful follow-up."

Say **source-linked** rather than independently **verified**. If percentages appear, call them **documented evidence coverage**, not hiring probability.

## 1:05–1:40 — FairShot

**Screen:** `/demo/fairshot?candidate=C01&role=qa&skill=api_testing`.

> "When a relevant skill isn't documented, we can offer the candidate a short standardized work example. We don't automatically grade it or reject the person. It becomes additional unverified information for HR to assess."

Use this fictional answer (approx. 185 characters):

> "I would reproduce the request twice with the same idempotency key, compare response codes and stored order IDs, and log whether retries create duplicates. I would also test a timeout and failed request."

Save it, then return to the QA match to show the additional **candidate statement**.

## 1:40–2:00 — Finish with human control

**Screen:** `/demo/reviews` or QA match review actions.

> "The final step belongs to the recruiter: review the evidence, ask for clarification, and decide whether to invite the person to interview. ProofMatch makes the evidence easier to explore without automating the hiring decision."

## Optional wow features (show only if time remains)

- **Mira:** `/demo/mira`, choose Candidate 01 and ask "Why should HR explore QA for this person?" Use typed chat if microphone or WebGL is unreliable.
- **FuturePath:** `/demo/futurepath`, show a possible career branch; explicitly **not** a future prediction.
- **Proof Over Polish:** `/demo/proof-over-polish`, show deterministic structured-evidence stability, **not a full fairness evaluation**.
- **Live Gemini:** `/demo/analyze`, paste a fictional CV and project excerpt; invoke only if a real API call was successfully tested recently. No time to troubleshoot quota on stage.

## If anything goes wrong

| Failure | Recovery |
|---|---|
| Door animation glitches | Open the prepared `/demo/discover` tab immediately. |
| Internet or Gemini API fails | Use deterministic seeded matches; explicitly describe them as sample data with a rules engine. |
| Mira microphone is unsupported | Type the exact question. |
| 3D canvas is slow | Skip Mira. Flagship evidence feature matters more. |
| Saved FairShot response not visible | Use a preloaded candidate, show the question and explain the planned review flow without fabricating a saved result. |
| Entire deployment fails | Play a previously **genuine** screen recording, disclose it's recorded, and offer screenshots/code/tests. |

## One-sentence value proposition

> "ProofMatch rescues overlooked candidates by matching the evidence they supply to multiple jobs, and gives recruiters a transparent, human-controlled way to check and clarify what the résumé couldn't show."

## Optional Phase 4A creative preview (20–30 seconds)

1. Open `/demo`. Scroll to **ProofWatch**. It shows two sample alternative-role signals, computed from the existing fictional matching engine. Select *Review the evidence* for Candidate 01.
2. Return to ProofWatch or use *Ask Mira*. The chat opens `/demo/mira?candidate=C01&role=qa`.
3. Show the holographic WebGL character, candidate/role context, and actual project excerpt cards. Click the question about the role. Text replies work with sample fallback, while Gemini requires a configured API key. Use the mic/speaker only after testing the browser permissions.
4. Explain: “The watch is a UI for findings, not a physical device or a live hiring alert. Mira can explain candidate-supplied evidence; HR still decides.”

Do not spend the entire pitch on the watch or avatar; return to Blindspot Rescue, Evidence Ledger and FairShot.

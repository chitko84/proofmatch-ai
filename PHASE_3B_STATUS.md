# ProofMatch AI — Phase 3B: FairShot & Hiring Innovation

**Cumulative release**: contains all of Phases 1, 2, 3, and 3A.

## Implemented

1. **FairShot**: `/demo/fairshot` has a fixed 12-exercise work-sample bank, four role-relevant skills per role across the three fictional jobs. The recruiter selects a fictional person, role, and gap. The same question is presented to any comparable candidate missing evidence for that skill. Answers (35–800 characters) are saved **only locally** and displayed as **unverified self-report** on the Evidence Ledger and Right of Reply pages. Neither the question nor answer is automatically graded.
2. **Optional Gemini follow-up**: `/api/fairshot` sends one fictional answer to Gemini with a tightly scoped request for **one neutral job-related follow-up question**. It provides transparently labeled prewritten guidance when no key or when Gemini is unavailable. It obeys `DEMO_ACCESS_CODE` if configured. It never automatically accepts or rejects a candidate.
3. **Proof Over Polish lab**: `/demo/proof-over-polish` shows what happens if source prose is embellished *after* extraction, while structured skills and evidence kinds are held fixed. This deliberately exercises the deterministic matching rule only, **not** Gemini extraction accuracy, real-world bias, or hiring fairness.
4. **Integration**: FairShot added to the public landing page, recruiter sidebar, overview quick actions, Blindspot Rescue, match-review page and existing candidate reply history. Mira's voice ring and FuturePath's active-path motion received small visual enhancements.

## Verification and known limits

- Offline test suite passes for the existing matching, Gemini prompts and source controls, candidate replies, work sample rules, wording check, and evidence spotlight.
- TypeScript/TSX syntax parsing passes. A full Next.js typecheck/build and end-to-end testing require `npm install` in an environment with npm registry access.
- All candidates are fictional. localStorage is not an authenticated candidate portal; anyone with access to the same browser can modify or delete the sample answers.
- A submitted work sample or CV excerpt is not independent proof of identity, contribution, authorship or competence.
- No new Gemini integration for work sample **scoring** was added. Gemini suggests follow-up questions only.
- No evidence-backed estimate of reduced bias, faster hiring, improved retention, or selection accuracy is claimed.

## Phase 4 gates

Run `npm install`, `npm test`, `npm run typecheck`, `npm run build`, `npm run dev`; verify all links, reveal effects, reduced motion, smaller viewports, Gemini authorization and quota fallback, local reply persistence and Vercel deployment. Use a screen recording backup and avoid real applicant data.

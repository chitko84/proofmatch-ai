# ProofMatch AI — Manual Final QA Checklist

**Do not mark a box complete until you personally observe it working.**

## Build and deployment

- [ ] `npm install` succeeds from a clean extracted project.
- [ ] `npm run preflight` passes.
- [ ] `npm test` reports 30/30 passing (or a larger passing suite after changes).
- [ ] `npm run typecheck` exits successfully.
- [ ] `npm run build` exits successfully.
- [ ] `npm run dev` starts and `/api/health` reports `status: ok`.
- [ ] `npm run smoke` passes against localhost.
- [ ] Vercel deployment is **Ready** and its smoke run passes.

## Real browser visual QA (take screenshots)

Check each at **1440x900 desktop**, **768x1024 tablet** and **390x844 mobile**:

- [ ] Landing hero has readable typography and photo collage; no broken images.
- [ ] Main navigation and all feature links open real pages.
- [ ] Door transition opens, Skip intro works, browser Back works.
- [ ] No text overlaps, horizontal scrollbars, clipped buttons or hidden form controls.
- [ ] Dashboard sidebar works, including mobile hamburger and close overlay.
- [ ] Colors, fonts and photo layout have adequate contrast and comfortable spacing.
- [ ] Keyboard: tab reaches every CTA, enter/space activate appropriate controls; focus is visible.
- [ ] Reduced Motion preference: door transition skipped and unnecessary animation disabled.
- [ ] 404 page works on unknown URL; loading and friendly error fallbacks appear as applicable.

## Essential hiring demonstration

- [ ] Dashboard reports fictional candidates and three roles correctly.
- [ ] Select C01 and compare Frontend and QA. QA alternative is presented only when source support exists.
- [ ] Evidence X-Ray highlights **source-linked text**, without inventing phrases.
- [ ] Negative/unknown requirements are explicitly marked unknown.
- [ ] Clarification and HR review save and reload locally.
- [ ] Criteria Impact Preview does not silently mutate original candidate or essential role requirements.
- [ ] Candidate Right of Reply updates assessment and preserves it as **self-reported**, not verified.
- [ ] FairShot shows fixed, job-relevant task and stores a fictional response locally.
- [ ] Returning to matches shows the FairShot response as unverified candidate-provided information.
- [ ] Proof Over Polish correctly explains limited controlled conditions, not a proof of general fairness.

## AI and wow features

- [ ] With `GEMINI_API_KEY`, submit fictional CV and check real JSON extraction result on `/demo/analyze`.
- [ ] Test a deliberately unsupported skill phrase; it must not appear as grounded evidence.
- [ ] Without Gemini key, **sample** workflows still work and are transparently labeled.
- [ ] Mira WebGL character renders in your browser; fallback text interface remains usable.
- [ ] Mira responds by typed message. Microphone requests permission only when clicked.
- [ ] With speaker enabled, sound works or a visible/text fallback remains.
- [ ] FuturePath changes pathways and never claims guaranteed promotions.
- [ ] FairShot follow-up remains a neutral question, not a pass/fail grade.

## Privacy/security/reliability

- [ ] `.env.local` is NOT committed to GitHub.
- [ ] Browser DevTools does not show `GEMINI_API_KEY` in HTML, JS bundles or frontend environment.
- [ ] Public AI endpoint without required demo code returns 401 (only if code configured).
- [ ] Invalid API JSON/IDs return clear 400 without a server crash.
- [ ] Mobile network 3G/slow mode does not leave an endless blocking spinner.
- [ ] API 429 and errors show honest messaging and do not disguise sample guidance as live Gemini.
- [ ] No production candidate personally identifiable information appears in the fictional demo.

## Competition readiness

- [ ] Deployed URL: ___________________________
- [ ] Git commit: _____________________________
- [ ] Gemini live test date/time: _____________
- [ ] Desktop screenshot taken: _______________
- [ ] Mobile screenshot taken: ________________
- [ ] 2-minute demo rehearsal completed twice without errors.
- [ ] 5-minute pitch rehearsed twice, with backup recording available.
- [ ] Any failed checklist item documented or scoped out of the live demonstration.

## Phase 4A interactive visual QA (must be checked in a browser)

- [ ] Dashboard `/demo`: ProofWatch renders its case, strap, time and two fictional sample signals; both arrow controls cycle correctly.
- [ ] ProofWatch *Review the evidence* navigates to the selected candidate and role in `/demo/matches`.
- [ ] ProofWatch *Ask Mira* navigates to the same candidate and role in `/demo/mira`.
- [ ] `/demo/discover`: compact ProofWatch card remains readable.
- [ ] Mira: changing candidate or role refreshes source excerpts and clears stale chat messages.
- [ ] Mira: quick prompt, typed prompt, and source link work with no Gemini key (labeled sample fallback).
- [ ] Mira: live Gemini response mode works with a configured server-side key (verify key stays off the client).
- [ ] Mira: mic and text-to-speech work only where supported; gracefully handle browser permission denial.
- [ ] Mira: WebGL scene renders without browser console errors and is legible in mobile 375px and 390px viewports.
- [ ] Reduced-motion preferences remove unnecessary animations.
- [ ] Public *Try demo* buttons now navigate directly without the disabled door portal.

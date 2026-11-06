# ProofMatch AI — Full-Project Quality Update (7 November 2026)

This is a complete source project, built on the previously supplied premium-design release. It retains the comic reader, recruitment workspace, career experiences, Telegram demonstration, and existing site assets and features.

## Improvements

- **CV → Job Comparison.** HR's `Check CV & compare jobs` now sets the current résumé text and optional original posting, then navigates to the same comparison page. Both buttons on Resume Insights use the same validated PDF/text workflow. An absent session résumé yields an empty-state notice rather than showing an unrelated demo candidate.
- **Evidence consistency.** The uploaded CV is scored using the same literal/synonym-based keyword matcher throughout. The requirement badges, numerator/denominator, rankings and supporting excerpts agree. A mention is *not* a verified skill and a missing term does *not* mean inability.
- **Cross-industry alternatives.** 800 fictional postings across 200 fictional employers are evaluated. Alternative titles are diversified and the originally applied title is excluded when recommending a different role (e.g. Film Director → Scriptwriter). Zero-mention jobs are not recommended as plausible matches.
- **Job comparison visualizations.** A searchable industry filter and horizontal/vertical match bars live on the comparison page. The selected posting's details are visible beside the chart.
- **Employer referrals.** The company selector is populated from the full company directory and includes local records; available positions follow the selected company. The candidate selector supports search without rendering 1,200 options simultaneously. Partner connections are explicit, candidate consent is required, and sending occurs in a simulated company inbox. Recruiters can switch between demo employers to show both sides of the process. No actual external messaging occurs.
- **Candidate consent.** `My Referrals` supports searchable demo identities and a direct candidate link. Consent must be explicitly approved or declined; sample data does not automatically approve it.
- **Candidate expectations wizard.** Five-step workflow retains manual forms and `Fill with sample data`; the result remains hidden until analysis. The resulting apply/clarify/explore guidance is computed from salary, work mode, geography and documented skills; it will not recommend applying merely because non-skill preferences match. It includes evidence, reasons and HR questions.
- **Cover letter quality.** Extended, role-specific, editable draft (roughly 300 words in the formal tone) with documented, verbatim résumé examples and separate motivation, evidence, contribution, and closing paragraphs. No CV facts are invented.
- **Registered companies.** Improved charts by industry and work mode, search, arrangement/connection filters, sorting, and pagination (12 companies per view). Vacancy grouping and chart calculations avoid repeated full-catalog scans.
- **Performance.** Cached regex patterns for repetitive CV scanning; reduced enormous select lists; fewer company cards per render; existing Next.js prefetch controls retained. Use production mode for judging.

## What is a demonstration, not a live service?

The 200 employers, 800 vacancies, 1,200 candidate profiles and employer switching are fictional/local demo records. CV analysis, expectations guidance and letter drafting use traceable rules and document mentions. This update **does not** implement real employer authentication, cross-account persistence, external referral delivery, live vacancies, or new cloud AI inference. Existing optional AI-related project features are retained without modification.

## Windows quick start

1. Extract the ZIP and enter the `proofmatch-ai-main` directory.
2. Double-click `START_PROOFMATCH_WINDOWS.bat` (requires Node.js and npm; first run requires internet to download packages).
3. Open `http://localhost:3000`. The launcher builds the production app on its first run. To rebuild after editing source, delete `.next` or run `npm run build` again.

Manual: `npm ci`, `npm run build`, `npm run start`. Use `npm run dev` only for development.

## Suggested click-through demo

1. HR Workspace → Resume Insights → **Try example** → select applied position → **Check CV & compare jobs**.
2. On Job Comparison, compare the original vacancy and alternative jobs, switching industry and chart mode. For a film example, paste `Film director with scriptwriting, storytelling, production planning, editing, and character development` and select a Film Director opening.
3. HR Workspace → Registered Companies & Open Positions → search/filter/sort and inspect vacancies.
4. HR Workspace → Company Referrals → choose a profile, connected receiving company and position → **Fill with sample recommendation** → **Request candidate consent**.
5. Candidate Workspace → My Referrals → select the same candidate (or follow the direct link) → **Approve sharing**.
6. HR Workspace → Company Referrals → **Send approved referral** → switch to receiving employer using the simulated employer account dropdown → **Mark reviewed**.
7. Candidate Workspace → What Works for Both Sides → **Fill with sample data** → complete all stages → explicitly approve the comparison → **Analyze expectations** → read the application guidance.
8. Candidate Workspace → Cover Letter Generator → select a role, supply CV content, generate, edit and export.

## Validation performed in the authoring environment

- The automated test suite passed: 239 passed, 14 skipped, 0 failed (253 tests).
- 172 TypeScript/TSX source files parsed without syntax errors.
- Static interaction audit passed (the existing project-wide audit script).
- Full `next build`, `tsc --noEmit`, and browser click-through were **not** run successfully: the environment could not connect to the npm registry, so dependencies could not be installed. Run `npm ci && npm run build` on your development machine before presenting.

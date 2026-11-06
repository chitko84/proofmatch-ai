# ProofMatch AI — Talent Intelligence & Trusted Employer Network

Release date: 4 November 2026

## What changed

This release upgrades the existing ProofMatch AI ZIP **without removing** the original evidence-based matching, Blindspot Rescue, Mutual Expectation Matching, 3D-style Talent Explorer, Telegram integration, QR workflows, LiveRoom, Gemini-based features, AI Mock Interview, slide/screen sharing, ShareSpace, messaging, Insights Studio, and four-language translation infrastructure.

### Content and coverage
- 1,200 deterministic **fictional** candidate profiles, with stable IDs and coherent role-specific stated skills, experience, locations, evidence excerpts, working preferences and original application references. These are not authentic applicant records.
- 26 industry categories, including professional services, finance, healthcare, education, construction, agriculture, manufacturing, public policy, energy, sports, telecommunications, biotech and others.
- 109 selectable professional roles (85 existing + 24 additional), retaining the original three deep evidence-matching models.
- 200 fictional employer profiles and 800 corresponding, browsable job records. Existing company/job IDs were preserved.
- 500 fictional community/company posts with 200 organization authors; original posts, images, comments and messenger records remain.
- Additional offline translations for sectors, career titles, talent search, comparison, company relationships and referral controls in Bahasa Melayu, Simplified Chinese / Mandarin and Tamil. Dynamic content uses the existing configured translation service where available.

### New / expanded pages
- `/demo/talent` — Talent Directory, natural-language Talent Radar, comparison of up to four candidates, industry analytics, and PDF/CV candidate intake.
- `/demo/partners` — company workspace creation, company switching, publishing local vacancies, mutual company connection requests, internal alternative-role discovery, connected-company job suggestions, permission-request workflow, approved profile forwarding, and receiving-employer review.
- `/demo/opportunities` — now also lists locally created company profiles and vacancies in the same browser workspace.
- `/demo/network/community` — Company updates tab, richer populated stream, company perspective posting, persistent reactions/comments/bookmarks.
- `/demo/candidates` — forwards to unified cross-industry talent directory; older specialized candidate detail URLs remain available.
- `/demo/roles` — preserves deep three-role engine explanations and adds the full sector-based career catalog.
- `/demo/guide` — new workflow shortcuts and existing **Fill this with sample** preparation.

### Candidate intake and evidence
Candidates can be added by a résumé PDF or CV text, with explicit permission confirmation. Existing `/api/resume-extract` handles readable PDFs locally, and can use Gemini if configured for scanned/complex documents. The matching library identifies documented skill *mentions*, which are treated as claims, **not independently verified credentials**. Only limited excerpts and a structured profile are saved to the browser-local talent workspace; it does not store the raw PDF.

### Partner referral authorization flow
1. Recruiter at Company A identifies candidate and an alternative role.
2. For another employer, Company A and Company B must have an accepted relationship; pending invitations cannot refer candidates.
3. Recruiter requests candidate permission. No profile is forwarded at this step.
4. Candidate perspective explicitly approves or declines the referral request.
5. Only with approval can the original recruiter forward the profile into the local workspace of the receiving organization.
6. Receiving recruiter can review and update the referral status.

The flow enforces these conditions in browser state and unit tests. **It is not a deployed, authenticated multi-tenant referral service.** One browser currently switches employer and candidate perspectives to exercise the workflow; this does not establish genuine user identity. Building a real product would require server-side identity, company verification, isolated tenant data, explicit authenticated candidate consent, audit logging and access-control enforcement, data retention policies and reliable delivery services.

### Presentation efficiency
There are functioning **Fill with sample data** / **Fill this with sample** actions for company registration, vacancy creation, talent search, directory filters, CV intake, recruiter notes, referral notes, AI Mock Interview setup, application forms, ShareSpace posts, messenger composer, and the existing Getting Started flows. These populate inputs without claiming to submit an external real application.

### Visual and behavior changes
New pages match the existing brand, responsive layout and navigation. Content is populated, linked consistently, searchable and interactive; no prominent test/developer banners are added. Fictional data and workflow limitations remain described in the dedicated Trust & Transparency page. Do not present sample candidate records, employers, vacancies, community activity or in-browser communications as externally verified real-world data.

## Getting started

```bash
npm ci
npm run typecheck
npm test
npm run preflight
npm run interactions
npm run build
npm run dev
```

Visit `http://localhost:3000/demo`, then open **Talent Intelligence** or **Company Connections & Referrals** from the sidebar. Example presentation walkthrough:

1. Open Talent Intelligence and use **Fill with sample data** under Talent Directory or Talent Radar.
2. Open a business or finance candidate and compare four profiles.
3. Open CV Intake and use **Fill with sample data**, then analyze and add the profile.
4. Select **Company Connections & Referrals**. The initial company has several accepted illustrative partners.
5. Choose a candidate, inspect better internal roles and connected partner opportunities.
6. Use **Fill with sample data** for the introduction, request permission, switch to **Candidate** perspective, approve, switch back, forward and view from the receiving company.
7. Open Company Connections to send a connection invitation. Switch to the receiving company, accept it, then try the referral workflow.
8. Open Manage Vacancies to create a new role and confirm it appears in the job directory.
9. Open ShareSpace → Company updates and interact with the populated posts. Switch messaging identity or use company posting controls where supported.
10. Verify that the AI Mock Interview, screen-sharing and slides, Telegram pages, 3D visualizations and Insights Studio are still present.

## Verification in this environment
- **140/140** automated tests pass, including seven tests added for new catalog consistency, natural-language search, evidence scoring, connection restrictions, consent, custom record integration and multilingual labels.
- Source preflight passes; all 146 checked TS/TSX sources parse.
- Static interaction/navigation audit passes across 35 page routes, 251 buttons, 142 links and 132 form controls.
- A production Next.js build / end-to-end browser test could **not** be verified because npm package installation was unavailable/incomplete in this environment. Run the commands above in your own development environment before deploying or presenting.
- Real cross-account communication is **not** implemented; existing Telegram functionality remains optional and requires legitimate bot and server configuration.
- Static candidate post/profile content is illustrative and rule-based, not generated from actual applicants. Production privacy and security controls remain necessary for real CVs.

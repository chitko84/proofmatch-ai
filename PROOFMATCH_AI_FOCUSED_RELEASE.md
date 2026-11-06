# ProofMatch AI — Focused Recruitment + Comic Library Release

## Scope

Full Next.js 15 / React 19 source release. Retains the existing five-language architecture and the original Telegram API integration. No database added. Candidate/job/company records and most user activity are browser-local.

### HR navigation (8)
Overview; Resume Insights; Candidate Directory; Future Path AI; Interview Questions; Company Referrals; See What Changes; My Review List.

- Resume Insights: PDF/text CV extraction using existing endpoint, 26+ industry sectors, ranked job/role evidence, bar/horizontal/line/pie/donut chart options and export. The example résumé is available immediately.
- Candidate Directory: searchable/paginated pool of 1,200 fictional candidate profiles; cross-industry matching, including Film Director/Scriptwriter and Business Analyst/Software Engineer transitions. Click through to detailed comparison, expectation alignment, shortlist, interview, future path or referral.
- Future Path AI: multi-select candidate list, individual role choice, skill gap and plausible learning milestones. Career paths are illustrative, not guaranteed promotions.
- Interview Questions: select candidate and vacancy, generate ten role-specific interview questions with one click, copy all.
- Company Referrals: automatically ranks connected employers' vacancies, requests candidate permission, then enables HR to send; incoming referrals can be marked reviewed. Original consent gates remain intact.
- See What Changes: choose company, vacancy and skill; change weight and inspect before/after evidence coverage and shortlist count. No invented hiring probability.
- My Review List: five fictional seeded examples plus saved decisions; changes persist locally.

### Candidate navigation (6 + 4)
My Dashboard; Find Jobs; My Resume & Matches; My Applications; My Referrals; Meetings & Invitations. Career Experiences: Career Accelerator; AI Mock Interview; Inside the Company 3D; Comic Books.

- My Referrals shows companies/positions and lets the candidate approve or decline pending consent requests.
- Meetings & Invitations is a simple date/time/status list. Original full Telegram pairing, scheduling and notification UI is preserved under HR > More tools > Telegram & Invitations (`/demo/telegram`). The original Telegram backend and configuration are unchanged.
- Inside the Company: retains all four floors, elevator, 3D walk controls and unique employee conversations at every department; added an extra conversation follow-up. Removed links to the retired HR Manager Simulator.
- Comic Books: six original SVG cover concepts. Book 1 can be opened in English, Bahasa Melayu, Mandarin, Tamil or Burmese via the five user-provided Heyzine URLs; embedded reader with external fallback. Books 2–6 display Coming Soon.
- Homepage: replaces the 3D hero with real workplace photography, adds Comic Books to the story and public navigation.
- The primary navigation no longer lists HR Simulator, 3D Talent Explorer, CSV Visualizer, Recruiter Desk, Proof Over Polish, Getting Started, How Data Works, Talent Insights, Job Roles, or other retired standalone experiences. Legacy routes redirect to relevant working pages to avoid broken bookmarks.

### Launch

```bash
npm ci
npm run typecheck
npm test
npm run preflight
npm run interactions
npm run dev
```

Open http://localhost:3000. HR View starts at `/demo`, Candidate View at `/demo/candidate`.

### Validation and limitations

- 238 tests: 224 passed, 14 skipped because their old feature-specific assertions target deliberately retired routes, no failures. New focused-release tests cover the replacement flows, five comic links, all department conversations, navigation and Telegram preservation.
- Source-level TypeScript/TSX syntax preflight and link/interaction audit passed.
- Telegram local and shared-delivery simulations passed (8/8 each); they did not send real messages.
- Full dependency install, Next.js production build and `tsc --noEmit` could not be completed in this environment because npm packages were unavailable. Run `npm ci && npm run typecheck && npm run build` on a machine with npm access before deployment.
- All candidate/company/job sample records are fictional. CV text analysis matches documented terms, not verified skill proficiency. Referral/meeting records in this self-contained application do not contact fictional employers. Real Telegram sending requires the existing authorized environment configuration.
- The six SVG covers are new cover concepts, not reproductions of Book 1's original Heyzine cover. Replace with licensed original covers if exact visual matching is required.
- Workplace photography uses Unsplash image URLs and requires internet connectivity to load; the core application remains usable without the images.

# ProofMatch AI — Candidate/HR views and localized landing headline

## Updated
- The homepage hero headline, supporting paragraph, CTA labels, and hints have curated, instant English / Bahasa Melayu / Simplified Chinese (Mandarin) / Tamil translations. No API key is needed for this hero.
- Homepage and public header contain separate Candidate View and HR View links.
- Main workspace has a persistent top Candidate View / HR View switcher. Switching navigates to the appropriate dashboard and changes the sidebar to a role-specific set of tools. All existing routes remain accessible by direct links, so the matching engine, Career Experiences, Telegram, News, and analytics are preserved.
- Selected workspace view is stored locally in `proofmatch-workspace-view-v1`; candidate and HR workflows still share the same browser-local data.
- Existing language-switching mechanism translates the new role labels and sidebar headings offline.

## How to test
1. `npm ci` then `npm run typecheck && npm test && npm run build`.
2. Open `/`, select Malay / Tamil / Mandarin; check all three headline lines and the full paragraph change.
3. Open `Candidate View` to see candidate-focused sidebar and dashboard.
4. Switch to `HR View` using the prominent top control. Check recruiter dashboard and HR navigation.
5. Refresh and verify the view persists on shared routes; check that switching modes doesn't reset local applications, messages, or referrals.
6. Check both top controls and menus on mobile widths.

No database or new online account system was introduced. Existing seeded employers and candidates remain illustrative.

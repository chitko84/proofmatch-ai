# ProofMatch AI — Candidate Experience & Talent Explorer release

## Scope and retained core

This release builds on the **full Talent & Company Network** archive. It does **not** remove Blindspot Rescue, Evidence X-Ray, FairShot, Mutual Expectation Matching, Internal Opportunity Rescue, candidate-approved Partner Referrals, company connections, AI Mock Interview/slide sharing, Telegram, QR Connect, LiveRoom, Insights Studio, ShareSpace, or the four-language switcher.

**MATCH remains the purpose.** The candidate-oriented routes help applicants obtain better job information, improve documented evidence, and discover compatible alternative roles. They are not a replacement for the core matching engine or recruiter review.

## New routes

| Route | Feature | What works |
|---|---|---|
| `/demo/candidate` | Candidate Space | Career hub with navigation to news, résumé checking, jobs, two-sided matching, articles, messaging and mock interviews. |
| `/demo/news` | The Career Ledger | Newspaper-inspired headlines fetched from Google News RSS, topic/category selector, search, linked publisher attribution, dated official reports, saved reading list, original career guides and job workspace updates. |
| `/api/career-news?category=...` | Live headlines feed | Server-controlled URL, category whitelist, news-item parsing, dates, origin links, cache and graceful unavailability; no fabricated latest headlines. |
| `/demo/resume-clinic` | Résumé Clinic | Text-based PDF upload via existing extraction endpoint or pasted text, 4 profession-specific sample resumes, 9 explainable content/format checks, actionable feedback, evidence-vs-gap career alignment over existing role catalog, report download and privacy-conscious saved review summaries. |
| `/demo/network/articles` | Career Stories | Cross-industry article library, original seeded stories, search/category filters, local writing editor with selectable visual covers and Fill with sample data, saved articles and user-owned articles. |
| `/demo/network/articles/[id]` | Read an article | Long-form reading, author details, appreciation, saved items, local comments, social sharing, related stories, and an article route for original career guides. |

The public homepage's Talent Orbit has been replaced with a more sophisticated procedural spatial visualization: perspective-projected multi-axis 3D orbit guides, luminous depth-sorted role nodes and connection paths, drag/touch rotation, keyboard control, zoom, reset, reduced-motion support, and direct evidence inspection links. **It is an interactive 3D-style graph, not a first-person 3D job simulator**. The Career Simulator, 3D Company Explorer and Crisis Arena remain separate, future modules.

## Editorial integrity and data handling

- The News view displays fetched, date-stamped items linked to their original sources. If live RSS is unavailable, it reports the error; it does not invent fresh headlines.
- An always-visible official-report section links to DOSM and BERNAMA reports with their **actual** publication dates. These reports should not be treated as updated automatically.
- The Career Guides are original evergreen educational content, kept separate from recent news.
- Jobs, employer/company posts and professional community profiles in this workspace are **illustrative records**, not verified live vacancies or real-world activity.
- The Résumé Clinic quality indicator is a checklist of observable document signals. Role alignments reflect **documented skill mentions**, not verified professional competence, AI hiring decisions or probability of employment.
- The résumé text is retained only in current page state after extraction; saved reviews contain a summary without the CV body. PDFs may be forwarded to configured Gemini extraction when embedded text is insufficient; configure appropriate consent and data policy before handling real applications.
- Articles written by the user, comments, bookmarks and saved results persist locally in the browser. Other people on other devices do not actually receive these articles without a connected shared backend. Do not claim cross-user publication or actual notifications.
- Automatic UI localization is wired into the new routes. Key actions/navigation have curated English, Malay, Mandarin Chinese and Tamil labels; longer dynamic/editorial text requires configured Gemini. User-uploaded CVs, user-written comments and original article bodies are excluded from automatic cloud translation.

## Sample-population shortcuts

- Résumé Clinic: select a profession and click `Fill with sample data`.
- Career Stories: click `Fill with sample data` to prefill an editable article; click `Publish article` to publish it in the local workspace.
- The existing job applications, interview setup, company/referral forms and post composer retain their existing sample-fill actions.

## Files

- New: `src/lib/career-news.ts`, `src/lib/career-guides.ts`, `src/lib/resume-clinic.ts`, `src/lib/career-articles.ts`, `src/lib/i18n-candidate-pages.ts`.
- New: candidate/news/résumé/articles UI routes, corresponding styles, `/api/career-news`, and `tests/candidate-experience.test.ts`.
- Updated: `src/components/talent-orbit.tsx`, `src/components/talent-orbit-premium.css`, workspace navigation, homepage links, ShareSpace entry point, language provider/dictionary, and job-directory deep-link handling.

## Local verification

```bash
npm ci
npm run typecheck
npm test
npm run preflight
npm run interactions
npm run build
npm run dev
```

Check the following browser journeys:

1. Open Candidate Space, visit News, change a category and open a source in a new tab. Disconnect the network and confirm that the page offers original guides and official-report links without pretending fresh headlines were loaded.
2. Save a news item, change section and return to Reading list.
3. Upload a text-based CV PDF in Résumé Clinic, choose an industry, run analysis, expand advice, and export the report. Repeat with a scanned PDF and confirm a helpful error or configured OCR fallback.
4. Insert a sample business CV and ensure the alternative-role graph is based on actual text mentions, not a fixed role score.
5. Browse an article, open the editor, fill with sample data, publish, read, comment, bookmark, reload and check persistence. Repeat after clearing local storage.
6. Change language to Malay, Mandarin and Tamil and inspect navigation, common controls and error states. Ensure the original user CV text is unaffected.
7. Rotate, zoom, reset and select roles in Talent Observatory with mouse, touch and keyboard. Inspect the evidence link; test reduced motion.
8. Check that Blindspot Rescue, two-sided matching, company connections, candidate-approved referrals, AI Mock Interview/screen share, Telegram and the pre-existing insights routes remain accessible.

## Verification limitations

Automated Node tests and source-level navigation/syntax audits can be run without dependencies. A full Next.js build, actual browser rendering, deployed live RSS access, Gemini API availability, real microphone/screen sharing and Telegram delivery require installation/configuration and browser validation. **Do not treat source-level checks as production certification.**

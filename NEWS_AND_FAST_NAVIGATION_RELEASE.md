# ProofMatch AI — Career News & Faster Navigation Update

## What was fixed

- Fixed Google News RSS descriptions containing encoded `<a href=...>` HTML. RSS entities are decoded before markup removal; link-only descriptions are discarded instead of showing raw URLs or HTML.
- Removed publisher suffixes duplicated in many Google News headlines.
- Added curated Unsplash workplace photographs to featured headlines and news cards, with lazy image loading and graceful fallback if an image is unavailable. These are **illustrative workplace photographs**, not photos from the original news story.
- Preserved publisher attribution, publication date, original source links, reading list, job updates, and Career Ledger sections.
- Added 15-minute session news caching to avoid reloading the same feed every time users switch tabs and revisit Career News. Manual refresh bypasses server-side cache and preserves existing stories if the refresh fails.

## Navigation responsiveness

- The language system now avoids a full DOM translation observer while the site is in English. When returning from another language, it performs one restoration pass.
- Translation mutations are coalesced by animation frame to reduce repeated scanning and avoid dropping updates.
- The candidate and HR sidebar prefetch nearby routes on hover/focus, and warms the most common routes after the current page is ready.
- Added a workspace loading screen so first-time route transitions show prompt visual feedback.

## Fastest hackathon pitching mode (Windows PowerShell)

On your presentation computer, **build once before your pitch**, then run the compiled Next.js server. The development server (`npm run dev`) compiles routes as you click them, which can introduce noticeable delays.

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

Then open `http://localhost:3000/demo` in your browser and visit the core pages before your presentation to warm image and browser caches. Keep the server running during the pitch.

## Important notes

- No database or external applicant account system has been added. Candidate, recruiter and employer workflows remain local to this self-contained showcase.
- The matching engine, 3D Company X Tower, HR Manager Simulator, 120-question quiz, Telegram integration, four languages, AI Mock Interview, résumé tools and cross-company referral workflows are retained.
- The five Unsplash photographs load from the public internet. If the presentation network blocks images, cards retain their gradient background without a broken-image icon.
- Production build and live-browser GPU testing must be run on your Windows computer; only source-level audits and the automated test suite were available in this environment.

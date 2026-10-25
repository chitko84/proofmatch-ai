# Phase 4A+ — Landing Entrance & Branding Update

Requested changes:
- Removed the Next.js development indicator (`devIndicators: false` in `next.config.mjs`). This is the bottom-corner **N** badge displayed during `npm run dev`.
- Added a custom ProofMatch favicon (`src/app/icon.svg`), replacing default Next.js browser-tab imagery.
- Added a new **automatic** cinematic two-door intro on the **public landing page (`/`)**, not on `Try Demo` clicks.
- The opening begins after approximately 0.8 seconds, and the overlay fully dismisses after approximately 2.7 seconds. The actual landing page is revealed behind the opening doors.
- A visible **Skip intro** button (also Escape), and a non-intrusive **Replay entrance** button after completion.
- Respects `prefers-reduced-motion`; skips the entrance when reduced motion is requested.
- Existing recruiter features, ProofWatch, Mira, matching logic, and demo navigation are preserved.

## Update existing local project quickly

Replace/add only:
- `src/components/landing-door-intro.tsx` (new)
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/icon.svg` (new)
- `next.config.mjs`

Or extract the full replacement ZIP. Keep your `.env.local` private and copy it into the new extracted project if you are switching folders. Do not upload your API key.

## Verify

```powershell
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Navigate to `http://localhost:3000/` (the landing page, **not** `/demo`). The doors should appear immediately, open automatically, then reveal the actual landing page. Try the Replay entrance control. Confirm the bottom-corner Next.js development badge is absent. If the old version appears, stop the dev server, delete `.next`, and restart it.

This code was packaged with offline test and source checks; production compilation and real-browser visual review must be performed on a machine with the npm dependencies installed.

# ProofMatch AI — Premium 3D + Site-wide Speed Pass

This release continues from `ProofMatch_AI_Full_Project_Immersive_3D_Final_Polish_Fast.zip`. It preserves the MATCH core, Candidate/HR workspaces, company referrals, mock interviews, podcast, Career News, 2D quiz, Telegram integration code, multilingual support, and every existing project file.

## What's new in the 3D experience

- Added further venue-specific architecture, ceiling baffles, glass partitions, guided floor accents, illuminated furnishing details, and professional lobby and HR-office decoration.
- Made staff models distance-appropriate and lightweight while keeping the player avatar fully detailed. Background employees retain smooth-shaded heads and readable silhouettes.
- Kept Company X Tower and HR Manager Simulator visually distinct. All four company floors, their employee dialogues, the elevator, and the HR tasks are retained.
- Reduced mobile blur/scanline work; refined control and dialogue feedback durations to approximately 100 ms or less.
- No remote 3D assets or new dependencies introduced. Geometry is deterministic and cached across floor visits.

### Static GPU mesh sizes (scene geometry, excluding dynamic avatar)

| Scene | Prior bytes | Current bytes |
| --- | ---: | ---: |
| Company X lobby | 1,494,504 | 1,412,664 |
| Company X floor 2 | 1,390,752 | 1,346,664 |
| Company X floor 3 | 1,378,080 | 1,333,992 |
| Company X floor 4 | 1,382,832 | 1,338,744 |
| HR workday | 821,040 | 926,640 |

The HR set uses additional furnishings while remaining under the existing 1.5 MB mesh-budget test. These measurements come from serialized vertex-buffer sizes, not on-device FPS measurements.

## Site-wide navigation improvements

- Stopped Next.js from automatically prefetching **every** sidebar route. Pages are now prefetched when a user hovers/focuses a link, while a short list of likely next pages is warmed in the background with staggered timers.
- Added an unobtrusive navigation progress indicator, shown only when a route takes longer than 120 ms; it never delays the actual navigation.
- Reduced the optional website entrance from 2.7 seconds to under 1 second, and remember that it has played in the browser tab. Repeat visits enter immediately; Replay entrance is still available.
- Removed the roughly 1.06-second blocking delay after clicking the door-portal entry link. Routing begins immediately and any visual transition runs without delaying it.
- Used React deferred search filtering for large candidate and job directories, keeping typed search input responsive while results update.
- Enabled browser content-visibility for long card lists to avoid unnecessary offscreen layout work, without changing their records or filtering behavior.
- No backend or database was added.

## Verification performed

- `npm test`: 211 / 211 passing.
- `node scripts/preflight.mjs`: passed.
- `node scripts/audit-interactions.mjs`: passed.
- Modified files syntax checked with TypeScript transpilation.
- ZIP file integrity checked, with a complete-project file comparison.

## Verification still required on your laptop

Dependency installation was not possible here: the offline npm cache lacks `yargs-parser-18.1.3`, so `npm run typecheck`, `npm run build`, and real WebGL frame-rate testing are **not claimed as passed**. Once extracted, run:

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

For the final presentation, use the production server (`npm run start`) and open `http://localhost:3000/demo`. Inspect `/demo/career/company` and `/demo/career/simulator` with graphics acceleration enabled. For image-heavy pages, a reliable connection is still useful because workplace/news photos are external resources.

## Scope

Existing feature logic was not rewritten. Changed source areas: the 3D geometry and stylesheet, global workspace navigation and its two short entry animations, and filtering in the two large directories. Updated/added regression tests and this document are the only other changes.

# ProofMatch AI — 3D Studio + Site-wide Instant Demo Upgrade

## Scope

The 3D Company X Tower and HR Manager Simulator visuals and control speed were updated, together with site-wide workspace navigation and the two large data directories. Every unrelated feature and existing route is retained. There is no new runtime dependency, external asset request, or database.

## Visual enhancements

- Four company levels now have additional, **different authored 3D focal installations**: reception desk and sculptural panels; product-monitor wall; finance/operations dashboard; learning-gallery/community display.
- The HR Manager workspace has its own warm interview-office signature, task planning wall, acoustic detailing and ceiling lights; not simply a recolored Company X floor.
- Existing smooth characters, workstation interaction markers, first-/third-person switching, employee conversations and fast elevator remain available.
- In the 3D HUD, choose **AUTO / HIGH / FAST** graphics. AUTO retains adaptive resolution, HIGH raises the DPR cap to 2 (subject to hardware), FAST caps resolution at 1 and reduces background frame budget. Each mode remains adaptive and controls do not reload pages.

## Responsiveness and performance

- A **persistent WebGL renderer** now survives floor changes; shaders/programs are not recompiled every time the elevator is used.
- **Per-floor GPU buffer caching** holds previously visited geometry; revisits reuse uploaded meshes. Buffers are released when the world component unmounts.
- The elevator scene switches immediately; a 105 ms cosmetic overlay no longer blocks floor navigation.
- Static minimap updates no longer trigger React state updates repeatedly while standing idle.
- Site-wide navigation uses **deduplicated route warmups** and respects Save Data / slow connections; pointer hover, keyboard focus and touch initiate route warmup without flooding all routes.
- Candidate search and job/company filtering now use stable memoized **search indexes**, not recomputed strings for every card on every keystroke. Company vacancy counts are calculated once per catalog change instead of inside each card.
- Workspace buttons and links use shorter interaction transitions; offscreen layout optimizations and deferred search remain.

## Integrity and verification

- All previous project files were retained. Only 3D, navigation, directory-search, relevant CSS and regression tests were modified; a new regression test and this release note were added.
- `npm test`: **215 / 215 passing**.
- `npm run preflight`: **passing (source-level)**.
- `npm run interactions`: **passing**.
- Full Next.js compilation, TypeScript dependency-aware checking, WebGL GPU output and measured FPS/navigation timings remain **unverified in this environment** because package installation did not complete. Do not interpret test success as a production-build guarantee.

## Windows demonstration setup

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

Use the optimized production server (`npm run start`), not the dev server. From the workspace, open `/demo/career/company` and `/demo/career/simulator`. In the game HUD, use **AUTO** on most laptops, **HIGH** on a strong GPU, or **FAST** if your demo machine struggles. Confirm mouse, keyboard, touch and browser performance on the exact demo computer in advance.

# ProofMatch AI — Premium 3D & full-system instant-flow update (6 November 2026)

This release is based directly on the previous complete `3D_Studio_Sitewide_Instant_Demo` project. It retains all pre-existing project files, features, data, and routes; only five implementation files were modified.

## Rendering improvements

- `HIGH` now activates a richer WebGL shading path, with workstation screen bounce light, soft depth vignette, and coated/glass edge highlights.
- `AUTO` maintains the balanced original rendering path and adaptive resolution.
- `FAST` skips all costly material-specific shader calculations before executing the desktop lighting probes and reflections. This shader path is a functional performance preset, not only a lower resolution setting.
- Graphics presets are explicitly passed from the 3D UI to the GPU shader on every render; no external assets, texture requests, or new packages are required.
- Nearby workstation focus state updates only when the focused station changes, avoiding repeated React state scheduling while the player moves through the room.

## Full-site speed improvements

- Throttled sidebar hover prefetch requests so rapid pointer movement cannot warm many routes concurrently. The actual navigation request is prioritized and idle warmups pause while a route is loading.
- Removed unnecessary prefetch when changing Candidate/HR view; the selected route is navigated immediately.
- Job directory company lookups use a memoized Map instead of repeated linear scans for each job, with the existing company data left unchanged.
- Site-wide scrolling now responds immediately rather than forcing smooth scrolling. Workspace navigation transitions are shortened; reduced-motion accessibility preferences remain respected.

## Tests and verification

- `npm test`: 219 of 219 tests passed, including 4 new focused performance/graphics tests.
- `npm run preflight`: passed (source-level checks, 201 TypeScript/TSX files).
- `npm run interactions`: passed (75 TSX files, 363 buttons, 251 links, 167 form controls, 48 page routes).
- ZIP integrity and source-file equality with the base project were checked.

**Not verified here:** production Next.js build, live FPS, and GPU/WebGL visual quality on your presentation machine. These require `npm ci`, `npm run typecheck`, `npm run build`, and laptop browser testing. Do not claim measured frame-rate improvements based on source tests alone.

## Fastest presentation setup

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

Launch `/demo/career/company`, choose `AUTO` or `HIGH` for visuals, switch to `FAST` if the judge's laptop struggles. Route navigation throughout the platform is optimized separately from the 3D game.

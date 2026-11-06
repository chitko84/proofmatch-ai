# ProofMatch AI — 3D Visual & Performance Refinement

This focused release upgrades the real-time 3D rendering of **Company X Tower** and the **HR Manager Simulator**. All other product source files from the previous ZIP are preserved byte-for-byte.

## Graphics improvements

- Added a second broad directional/fill-light contribution, giving curved character faces, furniture, glass and walls more natural depth while remaining shader-only.
- Added restrained procedural material variation to avoid uniform plastic-looking surfaces.
- Improved subtle contact shading around architectural edges and microtexture on floor materials.
- Added view-dependent glass reflection highlights for more believable office glazing.
- Increased the possible rendering resolution on capable screens (up to 1.65 device-pixel ratio), with automatic adjustment on slower hardware.

## Responsiveness improvements

- GPU mesh packing is now cached for authored static floors so revisiting an office level skips repeat CPU-side triangle packing.
- The dynamic player character retains the previous geometry and GPU buffer on frames when position, heading and animation pose have not changed.
- Active navigation targets up to 60 frames per second when the device supports it. Idle views render more conservatively.
- Automatic rendering-quality adjustment considers JavaScript render cost AND real frame intervals, with hysteresis to avoid flicker or thrashing.
- Existing rapid elevator navigation, direct interaction shortcuts, local progress saving, and Canvas2D fallback are preserved.

## Where to test

- `/demo/career/company` — explore four levels, rotate the camera, interact with people, take the lift, and re-enter levels to verify warm-cache behavior.
- `/demo/career/simulator` — inspect the HR workday interiors and try a complete task.

## Verification

- 204 automated tests pass, including three added rendering-performance regression checks.
- Source preflight passed for 198 TypeScript / TSX files.
- Navigation and interaction audit passed.
- Both changed source files were independently syntax-transpiled with TypeScript.
- Full Next.js build and GPU browser rendering could not be certified in this environment: npm dependencies were not available locally, and headless Chromium failed to initialize its GPU backend.

### Recommended presentation commands

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

Inspect the 3D on your actual presentation laptop, including low-power and normal modes. Use a Chromium-based browser with hardware acceleration enabled. The scenes are original procedural stylized 3D; they do not use photorealistic commercial game assets.

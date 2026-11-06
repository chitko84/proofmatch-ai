# ProofMatch AI — Immersive 3D Lighting and Responsiveness Pass

This is a **focused 3D-only update** to the complete ProofMatch AI finalist prototype.

## Visual enhancements

- Rounded character surfaces (heads, hands, shoes, shoulders, hair, and tapered clothing) now carry smooth per-vertex normals instead of inheriting hard face normals from every triangulated polygon. Lighting stays smooth when the character turns.
- Skin, tailored fabric and leather receive distinct procedural surface finishes in the existing WebGL shader. These materials do not require external textures, remote asset downloads, or a new 3D engine.
- Company X Tower and the HR Manager Simulator now include lightweight floor contact shading around their interactive stations, reducing the appearance of floating furniture.
- Glass, timber, metal, UI displays and environment palettes retain their previous refinements.

## Live-demo performance

- **Auto quality** remains the default, adapting rendering resolution to frame pressure.
- Walking and mouse-look retain the 60 FPS *target* supported by the existing renderer. Actual FPS varies with hardware.
- While an interaction or elevator overlay is open, render cadence drops to 12 FPS for WebGL / 9 FPS for fallback, reducing wasted GPU/CPU work while keeping clicks immediate.
- Idle render cadence is reduced slightly (24 FPS WebGL / 15 FPS compatibility renderer) without changing active movement responsiveness.
- Workstation proximity lookup avoids allocating and sorting an array every frame.
- Previously cached scene geometry, fast floor travel, third-person movement, employee conversations, and local saved state are preserved.

## Unchanged

No other product features were intentionally changed: candidate/HR navigation, the MATCH engine, two-sided matching, company referrals, Telegram, career news, interview, quiz, applications, multilingual interface, and other pages remain from the previous full-project ZIP.

## Tests

- `npm test` — 207 of 207 passed at packaging.
- `npm run preflight` — passed.
- `npm run interactions` — passed.
- A complete Next.js production build **has not been verified** here: the offline npm cache is missing `yargs-parser@18.1.3`.
- GPU shader compilation / frame rate **has not been verified in a real browser** here: headless Chromium could not initialize its graphics backend.

## Windows verification before presentation

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

Open `http://localhost:3000/demo/career/company` and `http://localhost:3000/demo/career/simulator` in the same browser you will use during the presentation. Test WASD movement, mouse-look, employee conversations, elevator, modal controls, and consistent frame rates. For the fastest pitch navigation, use the production server after successful build rather than `npm run dev`.

The 3D scenes are **stylized procedural environments**, not photorealistic commercial-game environments. No production-reliability claim is made without browser and hardware tests.

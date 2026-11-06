# ProofMatch AI — Immersive 3D Quality & Performance Update

## Scope

This is a focused improvement to existing 3D components. The core MATCH engine, candidate/HR navigation, applications, referrals, multilingual features, Career News, Job Hunt Copilot, podcasts, and 2D Upstart quiz are unchanged.

## Company X Tower

- Four existing explorable floors, elevators, third-person character and employee conversations are preserved.
- New original **rounded, articulated procedural character models** replace some of the prior box-heavy geometry. Models have shaped jackets, tapered trousers, hair, faces, hands, shoes, ID badges and contact-shadow geometry. They use no external downloads.
- Richer architectural props: pendant lighting, room dividers, lounge furniture and department-specific wall details.
- Updated WebGL material shading with warm and cool interior bounce light, brushed-metal highlights, wood grain, polished flooring, glass fresnel detail and gentle tonemapping.
- Every floor keeps its distinct color palette and company-department identity.

## HR Manager Simulator

- Its visual identity is deliberately separate from the Company X tour: warm office palette, interview seating, event and planning displays, filing equipment and a more executive-workday atmosphere.
- The existing six HR tasks, answers, and progress remain unchanged.

## Presentation responsiveness

- Elevator transition shortened from approximately **880 ms to 170 ms**, with the destination switching after approximately **55 ms**.
- Static scene geometry is cached across floor visits and the remaining floors are pre-warmed after initial load.
- Render loop reduces GPU and CPU work while the player is idle. Interactive movement targets a higher frame cadence; Canvas2D fallback receives a lower budget to keep lower-end hardware responsive.
- 3D overlay rendering resolution is bounded on high-DPI screens.
- A click on an interactive Company X station card opens the conversation or elevator panel immediately as a live-demo shortcut, while in-world free walking and `E` interaction still work.
- Shortened UI transitions, reduced-motion preference respected, and lighter mobile visual effects.

## Verification and limitations

Run from `proofmatch-ai-main`:

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

Then visit `/demo/career/company` and `/demo/career/simulator`. On the presentation computer, validate WebGL rendering, floor switching, character movement, dialogue, HR tasks, and console output. The project remains a **local browser experience**, not a database-backed product. The 3D artwork is premium stylized procedural geometry, not photorealistic licensed game assets.

### Performance guidelines

Use `npm run start` after a successful build, not the development server, for the live presentation. Use the built-in camera mode toggle and fullscreen to focus the visuals; keep browser zoom at 100%. Lower the browser/device rendering scale if graphics are slow. No new third-party runtime dependencies are required for this update.

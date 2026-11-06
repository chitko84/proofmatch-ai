# ProofMatch AI — Company X Free-Roam Tour, HR Manager and Website Quiz

## What changed

### Company X Tower — Free-roaming 3D workplace
- Reworked the original six-floor tower into a focused **four-floor company**.
- Added a player-controlled **third-person character rendered in the WebGL scene**; switch between third- and first-person cameras.
- Move using WASD/arrow keys or on-screen directional controls, look around using drag or mouse capture, and interact with **E**.
- Walk between departments, approach stylized employee characters and choose conversations about their actual daily work, skills and company culture.
- Meet **20 named employees**, with 3 authored conversation topics each.
- Explore the atrium, engineering and product, business and finance, and people and culture floors.
- Use the in-world lift or the interactive building model/directory to choose floors. Browser-local discovery progress is retained.
- Original WebGL and Canvas2D fallback remain. Models are intentionally stylized, procedural low-poly meshes, not imported commercial game art.

### HR Manager Simulator
- Replaced the previous unrelated multi-profession Career Simulator and Crisis Arena with **HR Manager — A Day at Company X**.
- The HR workday contains six interactive task stations: daily priorities, interviewing, candidate redirection, workplace issues, events and HR reporting.
- Players select answers, inspect explanations and complete a locally saved workday score.
- The former Crisis Arena URL redirects to the HR Manager game so old bookmarks do not break.

### Upstart Quiz Edition
- The existing **120-question** game is now a polished **flat website quiz**, not a 3D arena.
- Existing game lengths, timer, score, feedback, sound, keyboard support and saved history are retained.

## Navigation
- Company X: `/demo/career/company`
- HR Manager: `/demo/career/simulator`
- Upstart Quiz: `/demo/career/accelerator` → Quiz section

## Verification
- `npm test`: **193/193 passing**
- `npm run preflight`: passed (source-level syntax checks)
- `npm run interactions`: passed (static routes and controls)
- Isolated TypeScript check of 3D geometry, employee dialogue, world data and WebGL renderer: passed
- Full Next.js production build and actual GPU/browser tests: **not run**; dependencies were not available in this environment.

## Scope and limitations
This remains a database-free, interactive, browser-local showcase. Character conversations are scripted with multiple choices; they are not live AI NPCs. The office floors use distinct interconnected scenes via elevator transitions rather than one continuous physics map. The implementation is an original workplace game; it does not reproduce the commercial HR Manager game's assets.

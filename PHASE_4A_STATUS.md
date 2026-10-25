# Phase 4A — ProofWatch + Mira’s Holographic Studio

**Status: Source code completed / browser deployment not yet verified.**

## Implemented
- `src/lib/proofwatch.ts`: derive signals only for candidate-role results with strictly greater sample evidence coverage than their applied role. Uses a candidate-supplied excerpt to explain every alert.
- `src/components/proofwatch.tsx`: premium watch with browser local time, signal navigation, evidence preview, direct match and Mira links, accessible controls and motion reduction.
- `/demo`, `/demo/discover`: integrated watch (full and compact).
- `/demo/mira`: redesigned with a hologram room around the original procedural WebGL avatar, role/candidate selector, supplied evidence cards, Gemini/sample modes, microphone, text-to-speech, and context-specific quick links.
- `/api/mira`: optional role context. The model sees all three roles and the current focus, and human decisions remain mandatory.
- Public demo entry goes directly to `/demo`; previously authored door component is unused.

## Verification performed
- `npm test`: **35/35 passed** including five new tests.
- `npm run preflight`: source checks and parsing passed on all TypeScript/TSX files.
- JSON/project structure and ZIP file integrity checked.

## Not verified here
- `npm run typecheck` and `npm run build` require npm dependencies not available in this environment.
- WebGL rendering, browser voice controls, Gemini live responses and mobile/desktop visual QA need a real browser.
- GitHub push and Vercel deployment need access to the user's accounts.

## Quick run (Windows PowerShell)
```
npm install
npm test
npm run preflight
npm run typecheck
npm run build
npm run dev
```

Open `/demo` for ProofWatch and `/demo/mira` for the Holographic Studio. Once running, use `npm run smoke` in a second terminal. No external 3D library is required.

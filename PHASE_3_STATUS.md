# ProofMatch AI — Phase 3 implementation status

## Features integrated into the Phase 2 Next.js project

1. **Mutual Expectation Matching** (`/demo/expectations`): work-arrangement comparison, candidate interests/optional stated career goal, practical follow-up suggestions. Rules are deterministic; goals are NOT personality or performance predictions.
2. **Criteria Impact Preview** (`/demo/criteria`): role and skill selection, illustrative preference-weight slider, original versus hypothetical evidence coverage for eight fictional candidates. Actual role rules never change; legal, licensing, safety and genuinely mandatory requirements cannot be waived here.
3. **Candidate Right of Reply** (`/demo/candidate-reply`): edit-free original evidence, local browser-only candidate clarifications, validation and revision history. Clarifications are always **self-reported**, not automatically transformed into artifact-supported evidence. `/demo/matches` includes saved fictional clarifications as self-reports.
4. **Mira — 3D Match Assistant** (`/demo/mira`): original procedural **WebGL 3D** character (without any external 3D platform), responsive chat and quick questions, optional microphone input where browser supports SpeechRecognition, optional speechSynthesis voice, read-only Gemini server route backed by vetted fictional matching context. If no API key/quota, UI clearly labels the deterministic **Sample guide**; it is not secretly presented as a live Gemini response.
5. **FuturePath AI** (`/demo/futurepath`): a responsive, interactive fictional company career roadmap with software, quality and analytics tracks, inspection of available versus missing evidence. Optional Gemini explanation through `/api/futurepath` with labeled sample-guide fallback. No individual promotion, retention or job-performance prediction.

## Data and security limits

- Same eight **fictional** candidates and three roles as Phase 1/2; new screens explicitly label their outputs as sample or hypothetical.
- New replies are held in the current browser's localStorage (unshared). They are NOT authentic candidate identity, authenticated correction portals or independent validation of skill.
- Mira only discusses existing fictional sample profiles (not arbitrary personal profiles). The matching engine does not use Gemini to hire, reject or infer protected traits.
- Gemini API key stays server-side and is used by `/api/analyze`, `/api/mira` and `/api/futurepath` if configured.
- Optional `DEMO_ACCESS_CODE` is accepted in the Analyze, Mira and FuturePath forms. It is a shared demo limiter, not a robust replacement for authentication and rate limits.
- Browser speech input depends on microphone permissions and browser support; fallback: type questions. Speech output depends on browser speech synthesis.
- 3D WebGL depends on browser GPU/WebGL support; the assistant remains usable as a text chat if canvas rendering is not supported.
- No durable server-side database, no protected applicant files, no real CVs by default, no production hiring suitability.

## Verification performed

- `npm test` passes **22 offline tests** (14 inherited Phase 1/2 + 8 new Phase 3 domain/assistant tests).
- All TypeScript and TSX source files passed TypeScript syntax transpilation (module parser).
- A full `npm install` could not complete: npm registry DNS access failed (`EAI_AGAIN`). Consequently `npm run typecheck`, `npm run build`, interactive WebGL browser rendering and live Gemini API calls are **NOT verified** here. They must be tested on a networked machine before submission.

## Local setup and Vercel

1. Extract the ZIP. Run `npm install`, then `npm run dev` from `proofmatch-ai`.
2. Test `/demo/criteria`, `/demo/expectations`, `/demo/candidate-reply`, `/demo/mira`, `/demo/futurepath`, then `/demo/matches` to verify saved candidate replies are shown.
3. Set server-side `GEMINI_API_KEY` and a model actually available to your key (`GEMINI_MODEL`). Optionally set `DEMO_ACCESS_CODE` on Vercel and use it in the relevant forms.
4. Run `npm test && npm run typecheck && npm run build`. Test on a phone/desktop. Then deploy to Vercel and verify all routes from the deployed URL.
5. Test with no Gemini key or unavailable quota: sample matches, Mira's labeled sample guide and FuturePath's labeled fictional guidance must still work.
6. Do not enter real applicants' personal CV data; Phase 3 is for fictional and consented demonstrations only.

## Phase 4 remains

Real-browser regression, production build, accessibility/voice/WebGL checks, live Gemini verification, Vercel deployment, representative recruiter feedback, pitch screenshots, recorded backup and evaluation against labeled candidate-role cases.

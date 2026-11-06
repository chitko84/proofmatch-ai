# ProofMatch AI — Burmese Homepage Polish + HR Life Branching Story Edition

This release is based on the full **Role-Specific Navigation / Burmese TypeScript Fixed** project. All existing role-separated navigation, five-language support, matching workflows, 3D Company X Tower, news, résumé tools, interviews, Telegram, and quiz features are preserved.

## 1. Burmese homepage

- Simplified the authored Burmese hero headline without changing its essential meaning.
- Applied locale-specific Myanmar font stacks, font sizing, line heights and spacing.
- Balanced the hero columns and responsive buttons so long Myanmar text has room.
- At tighter desktop widths, long translated header links move into the existing accessible navigation menu rather than wrapping over each other.
- Kept other languages' heading typography intact.

## 2. HR Manager Simulator — a playable workday

Route: `/demo/career/simulator`

- 11 scripted encounters with named colleagues: reception, morning briefing, interview, alternative-role talent review, employee concern, event planning, onboarding, staff awards, wellbeing, analytics report and director's office.
- **Branching stories:** the first of three dialogue choices changes the next response and follow-up question; the second choice changes the ending.
- Outcomes persist in browser-local storage; reopen or replay any completed encounter.
- Earlier decisions can influence dialogue in later encounters (especially reporting and the director handover).
- Quick-access station menu and Next HR encounter button for fast judge demonstrations, alongside free-roaming third-person movement and first-person option.
- Colleagues appear as lightweight 3D characters near their stations without exceeding the existing 1.5 MB GPU scene mesh budget.
- Existing six educational HR workday tasks remain in the mission data. Nothing creates real offers, verified employment outcomes or cross-account actions.
- No database, new package dependencies or API calls required for the stories.

### Suggested short live-demo flow
1. Start HR Manager Simulator; use WASD or station shortcuts.
2. Interview Suite A: ask about documented work, then record evidence without invented achievements.
3. Talent Review Desk: propose the stronger QA role and request candidate consent.
4. People Analytics Console: point out that earlier choices influence the story context.
5. HR Manager Office: show the end-of-day handover and replay a different choice.

## Verification
- `npm test`: 228/228 passed.
- `npm run preflight`: passed (source-level checks).
- `npm run interactions`: passed.
- HR scene `packWorldFaces`: below the prior 1.5 MB test budget.
- Full Next.js typecheck, production build, GPU browser visual validation **not completed** here; `npm ci` could not fetch the needed dependencies in this runtime.

On the Windows presentation laptop:
```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```
Use `npm run start` after a successful production build and keep the terminal open during your demonstration.

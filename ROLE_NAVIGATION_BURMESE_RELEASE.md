# ProofMatch AI — Role Navigation & Burmese Release

## What changed

This release refines navigation while preserving all existing routes and workspaces.

**Candidate sidebar** — My Career (candidate dashboard, jobs, job-hunt copilot, résumé tools); Applications & Messages (candidate referrals, invitations, messages); Learn & Explore (Career Experience, news, ShareSpace, Mira). Other candidate career activities remain in a collapsed **More tools** section or the Career Experience hub.

**HR sidebar** — Hiring Workspace (talent intelligence, analysis, matches, roles, reviews); Match & Referrals (Blindspot Rescue, employer connections, invitations, LiveRoom); Team & Performance (insights, messages, HR Manager Simulator). Other recruiter tools remain in **More tools**.

There are approximately **13 primary links per workspace**. Switching role changes the visible navigation immediately, and navigating to a role-exclusive URL selects that workspace. Shared pages keep the user's selected role. All pre-existing URLs remain functional.

**Burmese (မြန်မာ)** — Fifth language `my` / `my-MM` / HTML `lang="my"` available in the existing language selector. Includes a built-in, offline Burmese dictionary for primary navigation, common actions, résumé/job vocabulary, interview terms, core 3D controls and a fully localized landing hero. Stored language preferences continue to work. Text typed by users and private messages are not automatically translated or sent to the translation service.

**Translation coverage:** The Burmese dictionary covers hundreds of primary UI phrases. Longer authored public/help content can be translated using the existing `/api/translate` endpoint when `GEMINI_API_KEY` is configured. Without a configured translation service, unsupported copy remains in the original language rather than being falsely presented as translated. Please review long-form Burmese machine translations before public deployment.

## Compatibility fixes

- Fixed an inherited TypeScript null-safety error in the 3D nearest-station check.
- Fixed an inherited duplicate closing bracket in the HR-world data.
- Updated legacy tests to allow the expanded HR simulation's additional exploration-only points while preserving **six original HR decision tasks**.

## Test and demo commands

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run start
```

Production browser / GPU testing and a full Next.js build must be run on a computer with the project npm dependencies installed. The packaged source was checked using the existing Node test suite and static preflight / interaction audits.

## Scope

The matching engine, application and referral state, six HR decisions, Company X 3D office, 2D quiz, Telegram, Career News, and other existing feature behavior were not changed.

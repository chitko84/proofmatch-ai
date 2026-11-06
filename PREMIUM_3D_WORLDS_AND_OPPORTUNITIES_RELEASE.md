# ProofMatch AI — Immersive Career Worlds & Opportunities Update

## Core product scope

This release extends the existing self-contained **AIFM Challenge 02 — MATCH** prototype. The established CV analysis, evidence-based matching, candidate and recruiter views, two-sided preferences, internal alternative-role recommendations, connected-company referral and candidate-consent workflows, 3D Quiz, Telegram code, Mock Interview, Résumé Clinic, News, ShareSpace and Insights Studio remain included. The prototype still does **not** require any database.

## New 3D worlds

All worlds are original, interactive, stylized **browser-native perspective-3D canvas scenes**. They are not static pictures or imported photorealistic game assets. Movement works with WASD, drag to look, E for nearby interaction, on-screen touch controls, and a minimap. There are glowing workstations, room lighting, walls, collision checks, a focus indicator, a fullscreen action, optional browser speech narration and localStorage progress. Task choices change scores and reveal specific explanations.

- **Inside the Company** — `/demo/career/company`: two office floors (Level 1 and Level 2). Explore reception, engineering, HR, finance, marketing, analytics, learning, research, customer success and leadership areas. Interactive workstations provide career context and role links.
- **Career Simulator** — `/demo/career/simulator`: three complete mission paths: software engineer (defect investigation, safe fix, release); finance analyst (budget variance, reconciliation, briefing); marketing strategist (research, channel choice, campaign evaluation).
- **Career Crisis Arena** — `/demo/career/crisis`: three professional scenarios: cybersecurity access incident, logistics delivery disruption, and hospital operations capacity challenge. Each has three decision checkpoints with option-specific outcomes.
- **3D Talent Explorer** — `/demo/career/talent-explorer`: retains the original three-role evidence orbit and adds a multi-industry 3D opportunity constellation that uses actual seeded candidate/job evidence-scoring functions from the existing system. Select candidates or industries, rotate and zoom, click job nodes, inspect evidence coverage and preference notes, then open the matching opportunity.

This is **learning gameplay**. Completing a mission does not automatically create independently verified hiring evidence. Human evaluation is always required.

## Jobs and Companies improvements

`/demo/opportunities` now provides clear **Candidate view** and **HR / hiring view** controls, persisted locally:

- Candidate view: job search, company profiles, saved jobs, applications, and direct links to **Résumé Clinic** (upload/check CV) and Career Space.
- HR view: recruiter application review, search, Talent Radar, company registration and connected-employer referrals, and recruiter CV analysis.
- Different industry-oriented, real-life workplace **Unsplash photography** is used in opportunity cards and company covers. Photos are selected from neutral workplace imagery rather than representing the actual premises of fictional companies. When external images are blocked or offline, existing local abstract cover art remains as a fallback.
- **Images may require an internet connection**, and photographs are not bundled in this ZIP. The license permits use for standard projects: https://unsplash.com/license . Recognizable people or trademarks are subject to their own rights; these images are contextual visual illustrations, not endorsements.

## Existing functionality retained

Do not rename ProofMatch AI. We retain the core MATCH logic, no database requirement, seeded cross-industry candidates and companies, localStorage changes, Telegram integration code, AI Mock Interview/slide sharing, Career Accelerator 120-question quiz, articles, News, Résumé Clinic, ShareSpace, Insights Studio, and English/Malay/Mandarin/Tamil language switching. The new 3D pages have added offline translated UI terms; full translation of longer novel text still requires the configured translation service.

## How to run

```powershell
npm ci
npm run typecheck
npm test
npm run preflight
npm run interactions
npm run build
npm run dev
```

Open `http://localhost:3000/demo/career`, then choose one of the 3D modules. Open `/demo/opportunities` to change candidate/HR view.

## Final verification status

- Unit/regression tests: run with Node 22, in this environment.
- Source preflight and static navigation/interaction audit: run in this environment.
- TypeScript/TSX syntax transpilation: run in this environment.
- **Full Next.js build and live browser/device testing: not completed here.** npm dependency installation failed in this container; validate on the actual presentation laptop before the finals.
- **Simulation scope:** Employer records and practice transactions are fictional and persist within the same browser; independent real users and outside employers do not automatically synchronize.

## Suggested 3-minute pitch sequence

1. Candidate view: Upload a CV through Résumé Clinic, then explore opportunities.
2. HR view: Open Talent Intelligence and demonstrate evidence-based alternative-role recommendations and candidate consent for referrals.
3. 3D Talent Explorer: Show a candidate and alternative roles, then open the relevant job evidence.
4. Inside the Company: Walk to HR or finance and enter an interactive career information station.
5. Career Simulator / Crisis Arena: Complete one decision to show a meaningful recorded outcome and saved progress.

The MATCH workflow should remain central; the new 3D experiences are supporting career-discovery experiences.

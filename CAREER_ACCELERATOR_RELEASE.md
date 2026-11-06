# ProofMatch AI — Career Accelerator Release

## Overview

This release adds a single **Career Accelerator** experience with three independently usable activities, while preserving the entire original MATCH, candidate, recruiter, company-network, referral, Telegram, multilingual, and Mock Interview codebase.

**Open:** `/demo/career/accelerator`

### 1. Industry Podcast / Panel Discussion

- Three original, multi-speaker career panel scripts: *The Future of Careers*, *Beyond the CV: Smarter Hiring*, and *Your First Job, Your First Impression*.
- 37 authored conversational exchanges across four fictional panelists.
- Browser speech synthesis reads the panel dialogue aloud, with voice pitch changes per speaker and available English voice selection. Voice quality and availability depend on the browser/OS.
- Playback, pause/resume, previous/next exchange, restart, speed selection, interactive transcript and current-speaker highlight.
- No external service, audio network request or database required.
- The panelists and dialogue are scripted content, not recordings of real people or a live broadcast.

### 2. Career Accelerator Workshop — Writing a Good CV and Interview Do's & Don'ts

- Full-length original editorial article published in Career Stories and featured in The Career Ledger news page.
- Route: `/demo/network/articles/career-accelerator-cv-interview`.
- CV guidance across business, tech, healthcare, marketing and early-career experience; examples of evidence-based bullet points; actionable interview do's and don'ts.
- Article reader now supports clear section headings and formatted lists while keeping author comments/bookmarks and the previous reader behavior.
- Interactive eight-step personal preparation checklist, locally persisted between visits.
- Links to existing Résumé Clinic and AI Mock Interview.

### 3. Upstart Challenge — Quiz Edition

- **120 original questions**, distributed evenly across **12 categories**: Career Discovery, CV & Evidence, Interview Skills, Workplace Communication, Future of Work, Responsible AI, Digital Skills, Entrepreneurship, Sustainability & Green Jobs, Finance & Business, Healthcare & Service, Hiring & Fairness.
- Four game modes: Quick Play (10), Career Challenge (20), Knowledge Marathon (40), Ultimate 120 (120). A specific industry category has 10 questions.
- Perspective 3D/CSS spatial arena: parallax camera tilt on mouse, depth/extruded answer platforms, animated world grid, orbital elements, luminous stages, interactive answer selection, reduced-motion support.
- Answer correctness calculated from a static validated question bank, not fictional AI scoring. Explanation after each response.
- 35–45-second countdown, pause/resume, keyboard choices 1–4, Enter for next, optional sounds, immersive fullscreen mode where supported.
- Scoring, combo streaks, achievement tier, retry missed, downloadable plain-text results, saved rounds, best score and completed-round history in localStorage.
- Game sessions resume in paused mode after reload.
- Mouse, keyboard and touch-friendly responsive layouts. No database or game engine dependency.

## Integration

- Sidebar: Career Experience → Career Accelerator.
- Candidate dashboard: links to Career Accelerator.
- Career Experience hub: new fully linked module card.
- Overview page: links to panel, workshop and quiz.
- Career Ledger page: featured CV/interview editorial.
- Existing translations retained; new curated common controls for English, Bahasa Melayu, Tamil and Simplified Chinese. Full translation of the 120 question prompts and long dialogue requires the optional existing dynamic translation service. Without it, long-form content stays in English.

## Verification commands

```bash
npm ci
npm test
npm run preflight
npm run interactions
npm run typecheck
npm run build
npm run dev
```

After running, exercise these paths on both desktop and mobile:

1. Visit `/demo/career/accelerator` and play/pause/restart an episode; switch episodes and click a transcript line. Allow audio output in the browser.
2. Check all eight workshop items, refresh, verify persistence, and open the article from Career News.
3. Select Quick Play, choose answers via pointer and keyboard, wait for a countdown, pause, finish, download the score and check local history after refresh.
4. Try a category-limited round, retry missed questions, and test fullscreen and reduced motion.
5. Browse existing candidate, recruiter, company, MATCH, AI Mock Interview, Messenger, ShareSpace, and Telegram routes for regression testing.

## Limitations

- This remains a database-free, single-browser interactive project by design. Quiz results and checklists are browser-local.
- Podcast voices use Web Speech API and require a suitable browser/device voice. The transcript is always available.
- The 3D quiz uses browser-native CSS 3D transforms and depth effects rather than a heavyweight WebGL engine. It is an interactive 3D-style arena, not a first-person roaming 3D world.
- Podcast panelists and populated company/candidate records are illustrative. Do not represent them as real interviews or verified employer activity.
- Source and automated tests do not replace actual Next.js production build and browser QA.

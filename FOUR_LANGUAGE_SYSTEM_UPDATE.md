# ProofMatch AI — Four-language System Update

## Languages and writing conventions
- English (`en`, speech `en-US`)
- Bahasa Melayu, Malaysia (`ms`, speech `ms-MY`)
- Tamil (`ta`, speech `ta-IN` where available in browser)
- Mandarin Chinese with Simplified Chinese script (`zh-Hans`, speech `zh-CN`)

The language switcher is available on the public website, recruiter/candidate workspace and standalone pages. The choice is saved across routes and browser reloads. Mandarin Chinese is an explicit option in the picker.

## Implementation
- Expanded curated **offline** phrase glossary: 600+ UI/career terms per target language, including all 85 selectable interview careers and all 14 industries.
- Localized action labels, tabs, navigation, prompts, accessible labels, form placeholders, selection options and dynamic numeric counts. Select **values**, route identifiers, internal IDs, user input and business logic remain unchanged.
- The same translation layer scans dynamically rendered UI after navigation and component updates. Translation is no longer restricted to five routes.
- Optional Gemini translation handles app-owned copy not present in the offline glossary, including public opportunity and community content. Successful translations are cached across page changes and visits.
- Interview-generated questions and coaching feedback can use the chosen language, with translated on-screen content and speech synthesis where supported by the browser. AI interview feedback requests explicitly specify the chosen language; English structured fallback still works offline.
- Tamil and Simplified Chinese typography have enhanced font fallbacks and wrapping behavior for mobile layouts.
- Sample public community posts and initial comments are eligible for translation when configured; user-authored posts/comments and personal messages are not auto-sent to AI translation.

## Setup
From the project root:

```sh
npm ci
npm test
npm run preflight
npm run interactions
npm run typecheck
npm run build
npm run dev
```

Offline UI phrases need no API key. For translation of arbitrary new copy, put your server-side Gemini key in `.env.local` or your hosting environment:

```sh
GEMINI_API_KEY=your_server_side_key
GEMINI_TRANSLATION_MODEL=gemini-2.5-flash
```

Do not put secrets in `NEXT_PUBLIC_` variables. The translation endpoint has bounded requests, rate limiting, caching, and model-output validation. A configured online service, network access, and model quota are needed for texts outside the reviewed offline dictionary. Without a working service, unsupported text stays in its original language, rather than displaying a fabricated translation.

## Privacy and accuracy
- Candidate-written interview answers, submitted applications, private chat, uploaded CV evidence, and other user-authored content are preserved in their original language. Non-public content is **not** automatically submitted to translation merely by switching the website language.
- The AI interview only translates application-generated questions and feedback for a user choosing that language. Candidate-written answers remain untouched.
- Translation improves comprehension but does not verify candidates, job listings, or professional qualifications. For consequential recruitment communications, human review of translated statements is recommended.

## Suggested browser verification
1. Switch to **简体中文 · 普通话** on the landing page. Navigate through Overview, Jobs & Companies, ShareSpace, Messages and the AI Mock Interview room. Verify Simplified Chinese labels, menus, forms, and headings.
2. Repeat with Bahasa Melayu and Tamil. Check multi-line navigation, buttons, dialog layouts, and mobile widths (375px and 768px).
3. Switch a Jobs & Companies industry selector to a translated option. Results should still filter correctly because underlying values remain in English.
4. Type an application name, message, post/comment, and interview answer. Switch language; the typed text must not change.
5. Complete an interview with AI configured and verify generated follow-up questions and feedback are in the selected language. Without Gemini, structured English practice remains available.
6. Switch back to English, navigate again, reload, and verify labels return to English.
7. Check voice: English (`en-US`), Malay (`ms-MY`), Mandarin (`zh-CN`) and Tamil (`ta-IN`) depend on browser-installed TTS voices and speech recognition support.

## Verification status
Automated unit tests and source-level preflight/interaction audits were executed during packaging. A full production build and interactive browser suite require installing npm dependencies in the deployment environment. Live Gemini translation and speech synthesis require configured API/browser services and were not externally verified during packaging.

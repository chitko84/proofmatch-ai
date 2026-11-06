# ProofMatch AI — Multilingual Website Translation

## Included

- English, Bahasa Melayu, Tamil (தமிழ்) and Simplified Chinese (简体中文).
- Compact, keyboard-accessible language picker in the public navigation and workspace top bar.
- Language stored in the browser and shared across route changes. English is always recoverable.
- 200+ professionally curated UI strings per language, covering navigation, interviews, jobs/companies, applications, messaging, community and core controls, without API keys.
- Automatic translation of newly rendered website text, UI headings and select options while retaining the original form values.
- Optional Gemini-backed translation of non-sensitive public content and job catalog descriptions, where an API key is configured.
- Browser interview voice playback uses translated audio when translation is available and a suitable browser speech voice is installed. Speech recognition follows the chosen locale where supported by the browser.

## Configuration

Use the same server-side GEMINI_API_KEY already used for AI interview follow-ups. Optional override:

    GEMINI_TRANSLATION_MODEL=gemini-2.5-flash

Never put API keys in `NEXT_PUBLIC_` variables. Translation requests are bounded, validated, rate-limited, and cached in memory. A missing key does NOT disable the language picker or curated translations; untranslated page text stays in English instead of showing fictitious results.

## Privacy and accuracy

- Text entered in input fields, textareas, or chat bubbles is never rewritten by the page translation layer.
- Cloud translation is limited to the landing page, Getting Started, Career Experience landing, the jobs catalog and the community page. Candidate evidence pages and private messaging/interview screens use curated UI translations only.
- Interview questions can be translated on explicit voice playback when the user has selected another language.
- Brand names, URLs and user-authored content are not automatically translated.
- Translation is for comprehension and interface convenience, not guaranteed professional/legal accuracy. Human review is recommended for consequential translations.

## Verification

    npm ci
    npm run typecheck
    npm run build
    npm test
    npm run preflight
    npm run interactions

Browser smoke checks:
1. From the landing page, choose Bahasa Melayu. Headings and public navigation should update.
2. Open Workspace -> Jobs & Companies. Search and filter while Malay is selected. The underlying filter values must remain stable.
3. Switch to Tamil, open AI Mock Interview. Setup controls should update; check that microphone language follows the selection when browser speech recognition is supported.
4. In the interview room, play a question; with Gemini configured, translated question audio should be requested. If unavailable, the English original is played.
5. Visit ShareSpace; post a comment and verify it is saved unchanged in its original language.
6. Return to English, reload the page and verify the English text reappears.
7. Test the picker on a narrow viewport and navigate using keyboard/tab/Escape.

This release does not claim that all user-generated content or arbitrary AI-generated text is translated offline. Full dynamic translation requires a configured translation service.

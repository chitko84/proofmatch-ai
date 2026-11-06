# ProofMatch AI — Whole-Platform Language Update

## Supported languages

- English (`en`)
- Bahasa Melayu (`ms-MY`, website locale `ms`)
- Simplified Chinese, Mandarin (`zh-Hans`, speech setting `zh-CN`)
- Tamil (`ta`, speech setting `ta-IN` where the browser supports it)

## What changed in this release

1. **Site-wide translation**: the language provider handles the public site, recruiter workspace, matching and evidence pages, jobs and companies, applications, messaging, ShareSpace, meeting pages and AI Mock Interview. It no longer restricts automatic translation to five selected pages.
2. **UI controls**: navigation, buttons, links, input labels, placeholders, tooltips, accessibility labels, confirmation dialogs, options, progress labels and changing page content can be localized. Input values and IDs are preserved.
3. **Expanded offline terms**: a curated library of more than 850 professional UI phrases, including newly translated application, interview, messaging, job search and review actions. All 85 career names and 14 sectors have offline translations.
4. **Authored content eligibility**: `scripts/build-i18n-phrases.mjs` extracts 1,700+ authored UI/content phrases and approved seeded professional text into `src/lib/i18n-ui-phrases.ts`. These are authorized for the configured translation API across *all* routes. Regenerate after authoring new pages with `npm run i18n:phrases`.
5. **Runtime translation**: an optional server-side Gemini translation service translates other eligible UI and public content on demand, batches requests, and caches translated results in the browser. The API key stays server-side.
6. **Native dialogs**: the interview, messaging and community confirmation prompts use offline localized strings instead of untranslated browser dialogs.
7. **Dynamic labels and dates**: slide navigation, candidate message placeholders, follow-action labels, browser tab title, and interview history dates are localized while preserving personal names, slide titles and underlying values.
8. **Privacy**: candidate-written answers, applicant details, uploaded evidence, and personally written messages are not silently transmitted to Gemini when changing the interface language. Proper names, company names and technical identifiers should remain unchanged. If your product needs opt-in translation of user-authored sensitive content, implement an explicit consent flow before enabling it.

## Configuration

The offline glossary works immediately. To enable automatic translation of *every additional eligible authored text* (long paragraphs, varied headlines, dynamic notices and seeded content), configure a server-side key:

```dotenv
GEMINI_API_KEY=your_server_side_key
GEMINI_TRANSLATION_MODEL=gemini-2.5-flash
```

Restart or redeploy after setting these environment variables. **Never** place the key in `NEXT_PUBLIC_` variables.

When Gemini is absent, rate-limited, or temporarily unavailable, *untranslated phrases fall back to their source language*. The product does not fabricate translations. Native-speaker proofreading is recommended before claiming publication-grade Tamil, Malay or Mandarin localization.

## Quality-assurance checklist

Test each language on the homepage, all workspace navigation, CV analysis, candidate profiles, role matches, comparison settings, job listings, company directory, application modal, recruiter review desk, messages, ShareSpace, AI Mock Interview, PDF/PowerPoint presentation controls, public invite and candidate Passport screens.

For every route, check headings, descriptions, buttons, select options, filters, placeholders, alerts, tooltips, progress indicators, empty states, mobile breakpoints and screen-reader labels. Test switching among languages and back to English with form fields filled; confirm filters and job selections do not change and authored messages are not overwritten. On mobile, pay special attention to long Malay strings, Tamil fonts, and CJK line breaking.

## Commands

```bash
npm ci
npm run i18n:phrases
npm test
npm run preflight
npm run interactions
npm run typecheck
npm run build
npm run dev
```

### Verification boundaries

Source-level tests, the interaction audit and source preflight were run in this workspace. The full Next.js production build and real-browser multilingual QA could **not** be completed here because npm dependency installation was not available/reliable. Those remain mandatory before deploying to an audience. As with any dynamic machine translation system, **100% accurate translation of all future text cannot be guaranteed** without real translation service availability and human review.

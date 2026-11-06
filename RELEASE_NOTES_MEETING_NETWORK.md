# ProofMatch AI — Career Experience, Jobs & Professional Network

## What's included

This archive is the complete ProofMatch AI Next.js project, preserving the original matching, recruiter, Mira, FairShot, invitation, meeting and dashboard workflows while extending Career Experience and adding a professional networking workspace.

### AI Mock Interview — meeting edition

Route: `/demo/career/interview`

- Live, animated AI interviewer with browser speech synthesis and microphone transcription, plus text input.
- Browser camera preview, mic and voice toggles, pause/resume, timers and structured response feedback.
- Integrated meeting stage with **Share screen** using the browser screen-capture permission API (HTTPS/localhost required). This is a local preview. Screen pixels are not streamed to Gemini or another participant.
- **Slides**: upload a PDF, images or PowerPoint `.pptx`. PDF/image previews are local browser previews; `.pptx` extracts text through the server-side parser for text-based review. PowerPoint animations/design are not reproduced; use screen sharing to show the original presentation.
- Presenter navigation, per-slide speaker notes, and “Ask about this slide” interview questions. Uploaded slide text and notes can inform AI feedback; the AI does not visually inspect the shared screen.
- 85 curated careers across 14 sectors, plus **Another profession** with a user-entered title and skills. Roles cover technology, education, healthcare, hospitality, business, finance, engineering, creative work, public service and more.
- Private, locally saved interview history, resume-in-progress sessions, downloadable transcript and per-answer coaching.
- Gemini integration is optional and needs your API configuration. Without Gemini, structured practice remains available.

### Jobs & Companies

Route: `/demo/opportunities`

- 38 illustrative employer profiles and 170 illustrative role listings across 14 industries.
- Search, industry filters, work-style filters, company view, job detail, bookmarking, application form, review and withdraw actions.
- Recruiter desk to review locally saved applications, change stage and add notes; candidate application list reflects those updates.
- Link from each listed job to the interview module with the appropriate career preselected.
- **Important:** Company and vacancy records are invented for the product experience. They are not verified live opportunities. Applications and attached résumé *names* are saved locally, not submitted to employers. Do not present these as actual vacancies or claim delivery.

### Messages

Route: `/demo/network/messages`

- 40 illustrative contact profiles; 22 populated discussion threads.
- Search chats and contacts, create conversations, send messages, attach small images/PDF/text, emoji, pin and delete threads.
- Candidate/recruiter perspective switch allows both sides of an exchange to be explored in one browser.
- Conversations are saved in local browser storage and are **not delivered to real external people**. No fake read-receipt promises or external send claims should be introduced.

### ShareSpace

Route: `/demo/network/community`

- 64 initial illustrative posts, original bundled image artwork, authored avatars and comments.
- Create posts, add image attachments, like, comment, follow/unfollow, bookmark, filter by industry, search, paginate and share/copy.
- Saved state persists in local browser storage. No messages or posts are published to an external community.

### UI polish

- New sidebar sections for Opportunities and Network.
- Workspace overview now links to the job directory, messaging and ShareSpace.
- Getting Started replaces judge-oriented presentation-language onboarding. The explicit **Fill this with sample** button remains available.
- Contextual, unobtrusive data disclosures distinguish illustrative people/opportunities from actual employer relationships or submissions.
- Original features are preserved and remain accessible.

## Development

```bash
npm ci
npm run typecheck
npm test
npm run preflight
npm run interactions
npm run build
npm run dev
```

Open `http://localhost:3000/demo` and use the sidebar. Production Gemini and optional Telegram integrations require environment keys according to `.env.example`. Browser microphone/camera/screen sharing require browser permissions and usually HTTPS or localhost.

## Verification status for this archive

- `npm test`: 114/114 tests passing.
- `npm run preflight`: passed source-level audit (122 TS/TSX files syntax-checked).
- `npm run interactions`: passed source-level audit (no missing handlers or static links identified).
- A Next.js production build and real-browser testing **were not completed** in the packaging environment because dependency installation could not reach npm successfully. Run `npm ci`, typecheck, build and browser testing on your computer before deployment.
- External Gemini responses, browser speech recognition, camera/screen capture, PDF rendering, PPTX extraction and Telegram have not been verified against a live deployed environment in this build.

## Operational guidance

This is a functional interactive practice workspace with local persisted state, not yet a production multi-user recruitment network. A production release needs authentication, consent/privacy controls, database-backed identity and access control, moderation/reporting for posts and messages, actual employer verification, verified live vacancy feeds, file storage, notifications and real delivery integrations.

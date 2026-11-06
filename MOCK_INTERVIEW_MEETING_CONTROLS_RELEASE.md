# ProofMatch AI — Interview Meeting Controls Update

This release extends the existing Career Experience → AI Mock Interview. All pre-existing matching, candidate, company, network, translation and Telegram source modules remain included. No database was added.

## Interview room

- **Camera on/off** — The meeting dock and upper meeting toolbar control a real, locally previewed camera (`getUserMedia`). A visible participant tile displays camera-off state. The stream is stopped when the candidate turns it off, pauses, finishes, or leaves the room. Pending permission requests are invalidated if the candidate exits the room.
- **Microphone on/off** — Requests the real microphone stream (`getUserMedia`). In compatible browsers, speech recognition appends the candidate's transcribed answer to the draft box. When live transcription is unavailable, the input remains usable for typed responses and a notice explains the limitation. The microphone is not recorded or sent to another attendee.
- **Hear Mira / sample interviewer voice** — A voice-preview button is available before the interview and inside the meeting. A browser-native speech-synthesis introduction is provided in English, Malay, Simplified Chinese (Mandarin), and Tamil. Play, stop, question playback, and voice-speed controls remain available. Availability and pronunciation depend on installed browser voices; no AI API or audio hosting is required for the sample voice.
- **Presentations** — Upload a PDF, PowerPoint `.pptx`, or PNG/JPG/WebP slides. Navigate slides and add speaker notes. PowerPoint preview shows extracted text; use screen sharing to display the original slide layout or animations.
- **Fill with sample data** — Instantly adds an editable 5-slide professional portfolio presentation with notes. Slides, active page, visited pages and notes are persisted with the browser-local interview session. The built-in deck has no external file dependency and survives a refresh.
- **Share screen** — Uses the browser's native window/tab/screen capture permission (`getDisplayMedia`) for a local meeting preview. The display is not transmitted to a remote recruiter or analyzed visually by Mira. Only submitted slide text and speaker notes may inform question generation.

## Test the experience

1. Run `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run dev` on your development machine.
2. Visit `/demo/career/interview` on **localhost or HTTPS**.
3. Click **Hear sample voice** before starting. Check English, Bahasa Melayu, Mandarin Chinese and Tamil settings.
4. Choose a profession and click **Enter interview room**.
5. Toggle **Camera off/on** and **Mic off/on** in the meeting dock. Grant device permissions when prompted. Confirm that turning off the device turns off its indicator and stops the media track.
6. Click **Slides → Fill with sample data**, move between slides, edit speaker notes, and click **Ask about this slide**.
7. Test **Upload presentation** with a text-based `.pptx`, normal `.pdf`, or image slides. PPTX extraction requires the included API route.
8. Click **Share screen**, select a window, inspect its preview, and click **Stop share**. Confirm browser-screen-sharing permission is visible.
9. Answer questions, end the session, and inspect the report. Reopen the session to confirm slide metadata and notes persist.
10. Verify the existing candidate/recruiter matching and company referral flows have not changed.

## Validation performed in this environment

- `npm test`: **147/147 passed**, including the built-in presentation session-persistence regression test.
- `npm run preflight`: passed (source syntax across 158 TS/TSX files).
- `npm run interactions`: passed (static route/control audit).
- `npm ci`/full Next.js production build: **not verified** because registry dependency installation was unavailable here; test in a fully connected development environment.
- Hardware browser permissions and localized system voices must be verified on the target presentation laptop.

The interview meeting is a self-contained practice experience, **not actual two-way Zoom streaming**. It does not require a database and makes no claim that a human interviewer is receiving video or slides.

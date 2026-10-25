# ProofMatch AI — LiveRoom Judge Demo

## What was implemented

ProofMatch LiveRoom is a **working simulated meeting workflow using fictional candidates**. It extends the existing ProofMatch project; no previous feature was removed.

- **Recruiter Meetings** — `/demo/meetings`: select a fictional candidate and open job; choose a future meeting date, time and duration; generate an invitation; display a Telegram-style message and a real, scannable QR; see candidate responses and meeting history; confirm requested new times; export `.ics` calendar invitations; and enter an accepted meeting.
- **Candidate Invitation** — `/invite/[id]`: a Telegram-style message with the chosen job and schedule. Candidate may **accept, decline, request another time or ask a question**. Accepted invitations allow calendar export and room entry.
- **LiveRoom** — `/liveroom/[id]?as=recruiter` or `?as=candidate`: two-person visual room with **functioning, persistent text chat** and sample conversation suggestions. Chat updates across tabs using browser storage events; presenter can switch between recruiter and candidate roles. Video/microphone panels are explicitly **simulated visuals**, not a live video call.
- **One-click setup** — `/demo/guide` now includes LiveRoom and sets up an accepted sample meeting, while `/demo/meetings` has a **Load ready-to-show example** button.
- **Existing links** — Connect, guided demo, workspace sidebar and homepage now link to LiveRoom. Existing Telegram opt-in and other features remain intact.
- **QR scanner** — accepts same-origin `/invite/meet-*` links as well as existing Passport invitations. The QR contains fictional meeting details so that a separate phone can display the invitation without server-side records.

## Actual recommended demonstration (about 60–90 seconds)

1. Open `http://localhost:3000/demo/meetings` from the app sidebar **Schedule a LiveRoom**. Candidate 01 and QA Automation Engineer are preselected. The meeting time defaults to approximately two days from now at 3:00 PM.
2. Click **Schedule invitation**. The Telegram-style mock message, QR and invitation link appear. Point out the job title, date, time and duration.
3. Click **Open candidate message** to open the invitation in a second tab of the **same browser**. Click **Yes, I'll join**. You can also demonstrate **Request another time** or **Not right now**.
4. Return to recruiter tab. The status changes to **Accepted · ready to discuss** without manual refresh. Click **Enter LiveRoom**.
5. Open the candidate room in another tab (`/liveroom/[id]?as=candidate`) by using **Copy other person's view** or **Switch to candidate view**.
6. Send a sample question as HR, then respond as the candidate. The two tab messages genuinely synchronize and persist after refreshing.
7. For a faster alternative, click **Load ready-to-show example**, then **Enter LiveRoom**. This creates a fictional accepted invitation with a sample recruiter message.

## How the Telegram and QR experience works

**Telegram is SIMULATED in this new LiveRoom demo.** A generated message preview represents the Telegram invitation HR would send. Scheduling does **not** contact Telegram; no external account, secret token or internet API is required. The older opt-in Telegram bot workflow remains available under ProofMatch Connect but is independent of LiveRoom meetings.

The QR itself is a real, scannable code. A different phone can open the fictional meeting details and choose an RSVP **locally on that phone**. However, **a separate phone and laptop will NOT synchronize responses** unless shared backend storage is added. For a judge presentation that demonstrates immediate recruiter updates, open both views in tabs in the **same browser profile**. A private/incognito profile also will not share storage.

A genuine cross-device production experience needs authenticated participants, shared database/storage, a sending mechanism compliant with Telegram opt-in rules, secure expiring meeting URLs, and a real video service if video is required. Those features are **not implemented in this LiveRoom demo**.

## Run and verify

```bash
npm install
npm test
npm run interactions
npm run typecheck
npm run build
npm run dev
```

Open `/demo/meetings`, follow the steps above, and test a second browser tab. If you have Playwright installed, run `npm run browsercheck`; its script includes the new invitation RSVP, two-way chat and reschedule flows.

This package's offline tests cover meeting creation, RSVP decisions, rescheduling, real in-browser chat state changes, calendar data and QR parsing. **The full Next.js build and graphical browser click-through could not be completed in the artifact environment because the npm registry was unreachable**. Those remain essential local checks before judging.

## Presentation language

> "After ProofMatch discovers an alternative open position, HR can schedule a conversation. The candidate sees the details, chooses whether to join, and can suggest another time. Both sides then meet in ProofMatch LiveRoom. Today we're showing the entire workflow using fictional data, so no real candidate is contacted."

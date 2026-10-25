# ProofMatch AI — Updated Workflow and Screens

**Update:** Added **ProofMatch Connect** (Telegram opt-in, Match Passport QR, Interview Companion) to the established ProofMatch AI project. Every page should use short, welcoming, everyday language. Fictional sample data only.

## 1. Complete connected experience

```text
┌────────────────────────────────────────────────────────────┐
│                      PROOFMATCH AI                         │
└────────────────────────────────────────────────────────────┘
                            │
             ┌──────────────┴──────────────┐
             ▼                             ▼
     PREMIUM PUBLIC PAGE             RECRUITER WORKSPACE
     Photos + Door Opening                  │
     [ Try Demo ]                   Dashboard + ProofWatch
                                           │
                                  Compare Candidate / 3 Jobs
                                           │
                                      Blindspot Rescue
                                           │
                                       See the Evidence
                                           │
                                 What Works for Both Sides?
                                           │
                                      HR reviews first
                                           │
                                           ▼
                          ┌────────────────────────────────┐
                          │       PROOFMATCH CONNECT       │
                          │   Invite to another open job   │
                          └────────────────────────────────┘
                                           │
                                 ┌─────────┴────────┐
                                 ▼                  ▼
                           QR / WEB LINK       TELEGRAM BOT
                          Candidate Passport   (opt-in only;
                                 │              setup required)
                                 │                  │
                                 └──────────┬───────┘
                                            ▼
                                  Candidate chooses:
                                  Interested / Tell me more /
                                  Not right now
                                            │
                                            ▼
                                   Work preferences
                                            │
                                            ▼
                                     Human HR review
                                            │
                                            ▼
                                   Interview Companion
                                            │
                                            ▼
                                  HR chooses next step
```

## 2. Recruiter invitation page — `/demo/connect`

```text
┌────────────────────────────────────────────────────────────────────┐
│ Invite someone to explore another job                              │
├──────────────────────────────┬─────────────────────────────────────┤
│ WHO WOULD YOU LIKE TO INVITE?│ YOUR SHAREABLE INVITATION           │
│ Person [ Candidate 01     ▼ ]│                                     │
│ Open job [ QA Engineer    ▼ ]│           ┌─────────────┐            │
│                              │           │  QR CODE    │            │
│ [ See the evidence → ]       │           └─────────────┘            │
│ [ Prepare invitation → ]     │  [ Copy link ] [ Open passport ]     │
│                              │  [ Open Telegram — if connected ]    │
│                              │  [ Check response ]                  │
├──────────────────────────────┴─────────────────────────────────────┤
│ YOUR RECENT INVITATIONS                                            │
│ Candidate 01 · QA Engineer         [ Open invitation → ]           │
├────────────────────────────────────────────────────────────────────┤
│ Ready for the next conversation?       [ Prepare questions → ]      │
└────────────────────────────────────────────────────────────────────┘
```

## 3. Candidate Passport — `/passport`

```text
┌────────────────────────────────────────────────────────────┐
│ PROOFMATCH AI                                              │
│                                                            │
│ Another opportunity might suit you.                        │
│                                                            │
│ Open job: QA Automation Engineer                            │
│ Where: Penang                                               │
│ Work style: Hybrid or on-site                               │
│                                                            │
│ Would you like to explore this job?                         │
│ ( ) Yes, I'm interested                                     │
│ ( ) Tell me more first                                      │
│ ( ) Not right now                                           │
│                                                            │
│ What working style would suit you? [ Choose ▼ ]           │
│                                                            │
│ Anything else you'd like us to know?                      │
│ [ _______________________________________________ ]       │
│                                                            │
│ [ ] I choose to share this reply for HR to review          │
│                                                            │
│ [ Send my response → ]                                      │
│                                                            │
│ No automatic hiring decisions.                             │
└────────────────────────────────────────────────────────────┘
```

## 4. Interview Companion — `/demo/interview`

```text
┌───────────────────────────────────────────────────────────────────┐
│ Make every conversation count.                                   │
├────────────────────────────┬──────────────────────────────────────┤
│ WHO ARE YOU MEETING?       │ YOUR INTERVIEW STARTER PACK          │
│ Person [ Candidate 01  ▼ ]│ [ ] Ask about a missing job skill     │
│ Job [ QA Engineer       ▼ ]│ [ ] Explore the candidate's project   │
│                            │ [ ] Ask what they want from the job  │
│ [ See why they match → ]   │                                      │
│                            │ [ Copy chosen questions ]            │
└────────────────────────────┴──────────────────────────────────────┘
```

## 5. Important demo limitations

- Browser-only demo is fully separate from a live Telegram integration. It doesn't secretly send messages.
- A recruiter can reopen an invitation after refresh, and local candidate replies are stored **in that same browser**.
- For a real phone reply to show on the recruiter's computer, configure shared storage. Telegram additionally requires a real bot and verified webhook.
- The questions are prewritten from existing fictional role requirements. They are HR suggestions, not automated candidate grading.
- Never infer skill, identity, talent, or employee performance from an answer alone.

## 6. UI writing rule

**Speak like a helpful person, not a machine.** Prefer:

- “See why they match” over “Evidence provenance review”
- “What we couldn't confirm” over “Skill gap classification”
- “What works for both sides” over “Mutual expectation matching analysis”
- “Show what you can do” over “Technical assessment engine”
- “Prepare interview questions” over “AI interview question generation”
- “Send my response” over “Submit candidate engagement payload”
- “Someone worth another look” over “Anomalous cross-role detection”

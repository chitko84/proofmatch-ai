# ProofMatch AI
## Updated Full Prototype File — Finalized Creative Scope

**Competition:** AI Future Makers 2026 — Challenge 02: MATCH  
**Project:** ProofMatch AI  
**Tagline:** *Find the talent your filters might overlook.*  
**Hosting:** Vercel  
**App stack:** Next.js + React + TypeScript + Tailwind CSS + Gemini API  
**Theme:** Ocean Pearl  
**Landing style:** Pinterest-inspired, premium, image-rich, mobile-friendly  

> **This is the updated final blueprint/spec file.** It reflects the latest decision: keep the core product and only add **two premium creative upgrades** for now — **ProofWatch** and **Mira’s Holographic Studio**. We are **not adding** Opportunity Portal or additional creative upgrades at this stage.

---

# 1. FINAL FEATURE SET

## Core product features
1. **AI Multi-Role Matching**  
   Compare each candidate across 3 job roles.
2. **Blindspot Rescue**  
   Find a better-fit or overlooked role for a candidate.
3. **Evidence Ledger**  
   Show where the system found supporting evidence.
4. **Mutual Expectation Matching**  
   Compare candidate preferences with company/job conditions.
5. **AI Clarification & Human Review**  
   Suggest what HR should ask next and keep decision-making human.
6. **Criteria Impact Preview**  
   Show how changing non-essential role preferences affects results.
7. **Candidate Right of Reply**  
   Let a candidate add clarification or more evidence.
8. **Mira — 3D AI Match Assistant**  
   Dedicated assistant page with voice/text help.
9. **FuturePath AI**  
   Show possible career directions inside the company.
10. **FairShot**  
   Give candidates a short role-relevant chance to provide missing evidence.

## Final selected creative upgrades
11. **ProofWatch**  
   A premium recruiter alert watch that highlights important candidate findings.
12. **Mira’s Holographic Studio**  
   A more premium visual environment for Mira’s assistant page.

## Not included right now
- Opportunity Portal
- Extra cinematic landing transitions
- Additional heavy 3D scenes
- Extra constellation / network visualization

---

# 2. UPDATED COMPLETE SYSTEM MAP

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                  PROOFMATCH AI                                          │
│                         Find the talent your filters might overlook                      │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                 ┌────────────────────────────┼────────────────────────────┐
                 │                            │                            │
                 ▼                            ▼                            ▼
        PUBLIC LANDING SITE           RECRUITER WORKSPACE          CANDIDATE DEMO VIEW
                 │                            │                            │
        Home / Hero + photos           Overview / Dashboard         My report / reply
        How It Works                  Candidates                  Add / correct evidence
        Feature showcase              Job Roles                   Submit clarification
        Product story                 All Matches                 FairShot response
        Try Demo                      Blindspot Rescue
                                      Evidence Ledger
                                      Expectations
                                      Criteria Preview
                                      Human Review
                                      Reviews
                                      ProofWatch
                                      Mira Holographic Studio
                                      FuturePath AI
                                              │
                                              ▼
                                   SINGLE MATCHING DATA ENGINE
                                              │
                                ┌─────────────┴─────────────┐
                                │                           │
                                ▼                           ▼
                          Gemini extraction         TypeScript logic
                          + quote checking          + role comparisons
                                │                           │
                                └─────────────┬─────────────┘
                                              ▼
                                   Explainable match reports
                                              │
                                              ▼
                                      HR REVIEWS & DECIDES
```

---

# 3. UPDATED NAVIGATION TREE

```text
PROOFMATCH AI
│
├── PUBLIC WEBSITE
│   ├── Home                      /                     [P0]
│   ├── How It Works              /#how-it-works        [P0]
│   ├── Features                  /#features            [P0]
│   ├── About / Trust             /#about               [P1]
│   └── Try Demo                  /demo                 [P0]
│
├── RECRUITER DEMO WORKSPACE
│   ├── Overview                  /demo                 [P0]
│   ├── Candidates                /demo/candidates      [P0]
│   ├── Job Roles                 /demo/roles           [P0]
│   ├── All Matches               /demo/matches         [P0]
│   ├── Blindspot Rescue          /demo/discover        [P0]
│   ├── Criteria Impact           /demo/criteria        [P1]
│   ├── Human Review              /demo/reviews         [P0]
│   ├── FairShot                  /demo/fairshot        [P1]
│   ├── FuturePath AI             /demo/futurepath      [P2]
│   ├── Mira Holographic Studio   /demo/mira            [P2]
│   └── Demo Info / Evaluation    /demo/about-data      [P1]
│
└── CANDIDATE DEMO VIEW
    ├── Right of Reply            /demo/candidate-reply [P1]
    └── FairShot Reply            /demo/fairshot-reply  [P1]
```

---

# 4. WHERE THE TWO NEW CREATIVE UPGRADES BELONG

## 4.1 ProofWatch

### Purpose
A premium alert device for recruiters. It should not be a random decoration.

### Best location
- **Dashboard overview**
- **Blindspot Rescue page**
- optional small floating widget inside recruiter workspace

### What it does
- shows recruiter-friendly alerts
- highlights important discoveries
- opens the exact related candidate/review page

### Good alert examples
- “Alternative role found”
- “New evidence added”
- “Worth another look”
- “FairShot reply ready”

### What it should NOT do
- it should not replace navigation
- it should not become a full smartwatch app
- it should not be placed on every screen in a distracting way

### ASCII wireframe
```text
┌────────────────────────────────────────────────────────────────────┐
│ RECRUITER DASHBOARD                                               │
│                                                                    │
│  Candidates: 12   Roles: 3   Reviews: 4                           │
│                                                                    │
│  ┌─────────────────────────┐       ┌────────────────────────────┐  │
│  │ Main dashboard cards    │       │        PROOFWATCH         │  │
│  │                         │       │        10:24 AM           │  │
│  │ - Talent pool           │       │ ------------------------- │  │
│  │ - Matches               │       │ Alternative role found    │  │
│  │ - Reviews               │       │ Candidate A               │  │
│  │ - FairShot requests     │       │ QA may fit better         │  │
│  │                         │       │ [ Review now ]            │  │
│  └─────────────────────────┘       └────────────────────────────┘  │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Interaction flow
```text
Dashboard loads
    ↓
ProofWatch gently glows
    ↓
User clicks “Review now”
    ↓
Opens Blindspot Rescue for that candidate
```

---

## 4.2 Mira’s Holographic Studio

### Purpose
A premium assistant experience where users can ask Mira for help.

### Best location
- dedicated page: **/demo/mira**
- optional “Ask Mira” shortcut button from candidate review pages

### What it does
- explain why a candidate matches a role
- summarize a candidate in plain English
- suggest next HR question
- explain missing evidence
- suggest what role looks strongest

### Visual direction
- soft futuristic studio
- 3D Mira in center/left
- glass or pearl panel UI
- glowing ring or light base
- simple quick actions
- text + voice input

### ASCII wireframe
```text
┌────────────────────────────────────────────────────────────────────────────┐
│ MIRA'S HOLOGRAPHIC STUDIO                                                 │
│                                                                            │
│  ┌──────────────────────────────┐   ┌───────────────────────────────────┐  │
│  │                              │   │ Hi, I'm Mira.                    │  │
│  │      [ 3D MIRA CHARACTER ]   │   │ Ask me about this candidate.     │  │
│  │                              │   │                                   │  │
│  │   soft glowing base/ring     │   │ [ mic ] [ type your question... ]│  │
│  │                              │   │                                   │  │
│  └──────────────────────────────┘   │ Quick asks:                       │  │
│                                     │ [ Best role ] [ Missing skills ]  │  │
│  Candidate context panel            │ [ Why this role? ] [ Next step ]  │  │
│  - Candidate A                      │                                   │  │
│  - Applied role                     │ Mira says:                        │  │
│  - Suggested role                   │ “Based on the sample data, this   │  │
│  - Main evidence                    │ candidate looks stronger for QA…” │  │
│                                     └───────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Interaction flow
```text
User opens Mira page
    ↓
Selects candidate or arrives from candidate page
    ↓
Asks: “Why is this candidate better for QA?”
    ↓
Mira answers in simple English
    ↓
Related evidence / next step shown beside answer
```

### What it should NOT do
- not become a generic chatbot page disconnected from ProofMatch
- not try to answer outside the current demo data context
- not dominate the whole prototype

---

# 5. UPDATED MAIN DEMO FLOW

```text
LANDING PAGE
    ↓
Try Demo
    ↓
RECRUITER DASHBOARD
    ↓
ProofWatch glows with alert
    ↓
Open Blindspot Rescue
    ↓
Inspect candidate evidence / result
    ↓
Optional: request FairShot or review reply
    ↓
Open Mira's Holographic Studio
    ↓
Ask Mira to explain the result
    ↓
HR records the next decision
```

---

# 6. UPDATED PAGE-BY-PAGE PRIORITY

## Must keep polished
- Landing page
- Dashboard
- Blindspot Rescue
- Candidate review + Evidence Ledger
- ProofWatch
- Mira’s Holographic Studio

## Important but secondary
- FairShot
- FuturePath AI
- Criteria Impact
- Candidate Right of Reply

## Lower priority visual extras
- extra heavy motion
- additional 3D scenes
- extra decorative animations

---

# 7. SIMPLE HUMAN-FRIENDLY UI WORDING

## ProofWatch wording
Use:
- “Worth another look”
- “Alternative role found”
- “New evidence added”
- “Review now”

Avoid:
- “algorithmic alert”
- “semantic anomaly”
- “candidate-role discrepancy event”

## Mira wording
Use:
- “Here’s what I found.”
- “This role looks stronger because…”
- “I could not confirm this yet.”
- “You may want to ask…”
- “Based on the demo data…”

Avoid:
- “predictive confidence score”
- “latent role suitability index”
- “candidate deficiency”

---

# 8. FINAL RECOMMENDATION

## Keep and implement now
- **ProofWatch**
- **Mira’s Holographic Studio**

## Hold for later
- Opportunity Portal
- Additional cinematic landing transitions
- More experimental visual systems

## Why this is the best balance
These two upgrades are enough to make ProofMatch feel more premium and memorable **without overloading the prototype** right before final testing and deployment.

- **ProofWatch** gives the recruiter workspace a signature visual object with a real function.
- **Mira’s Holographic Studio** gives the prototype a premium AI-assistant experience that judges will remember.

Together, they strengthen creativity while still supporting the actual hiring problem.

---

# 9. FINAL SHORT VERSION

```text
Only add:
1. ProofWatch
2. Mira’s Holographic Studio

Do not add now:
- Opportunity Portal
- extra cinematic upgrades
- more creative effects

Main story:
Dashboard → ProofWatch alert → Blindspot Rescue → Ask Mira → Better HR decision
```


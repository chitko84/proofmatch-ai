# ProofMatch AI
## Complete ASCII System Flow and Frontend Wireframes

**Competition:** AI Future Makers 2026 — Challenge 02: MATCH  
**Project:** ProofMatch AI  
**Tagline:** *Find the talent your filters might overlook.*  
**Hosting:** Vercel | **Frontend/backend:** Next.js + React + TypeScript  
**Theme:** Ocean Pearl (pearl-white backgrounds, deep-ocean typography, jade-teal accents, restrained warm-gold highlights)  
**Landing inspiration:** Pinterest-style spacious typography, editorial rounded image collage and image-led cards. No Pinterest branding copied.

> **Specification, not implementation evidence.** These diagrams describe the intended prototype, including optional demo experiences. All candidates, role comparisons, career pathways, results and quantitative values are illustrative until actually computed and tested. Human reviewers decide next steps; there is no automatic hire/reject action.

**Legend:** `[P0]` core mandatory; `[P1]` supporting; `[P2]` wow/optional; `(DEMO)` fictional demo content. `-->` navigation/action. All interface labels should be simple and friendly, even when technical names appear in this blueprint.

---

# PART A — COMPLETE SYSTEM MAP AND USER JOURNEYS

## 1. Complete system map

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                          PROOFMATCH AI — COMPLETE PROTOTYPE                              │
│                         Find the talent your filters might overlook                     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                              │
                 ┌────────────────────────────┼────────────────────────────┐
                 │                            │                            │
                 ▼                            ▼                            ▼
        PUBLIC LANDING SITE           RECRUITER WORKSPACE          CANDIDATE DEMO VIEW
                 │                            │                            │
        Home / Hero + photos           Overview / Dashboard         My matching report
        How It Works                  Candidate Pool               See supporting evidence
        Feature Showcase              Candidate Detail             Add / correct information
        Product Story                 Job Roles                    Preview changed findings
        About / Privacy               AI Multi-Role Matching       Send for HR review
        [Try Live Demo]               Blindspot Rescue
                                       Evidence Ledger
                                       Mutual Expectations
                                       Criteria Impact Preview
                                       AI Clarification / HR Review
                                       ├─ Mira 3D Assistant [P2]
                                       └─ FuturePath AI [P2]
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

## 2. Complete navigation tree

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
│   │   ├── Add Candidate         /demo/candidates/new  [P0]
│   │   └── Candidate Details     /demo/candidates/:id  [P0]
│   │       ├── Match Overview
│   │       ├── Evidence Ledger
│   │       ├── Expectations
│   │       ├── Ask / Review
│   │       └── Candidate Reply (demo)
│   ├── Job Roles                 /demo/roles           [P0]
│   │   └── Role Details          /demo/roles/:id       [P0]
│   ├── All Matches               /demo/matches         [P0]
│   ├── Blindspot Rescue          /demo/discover        [P0]
│   ├── Criteria Impact           /demo/criteria        [P1]
│   ├── Human Review              /demo/reviews         [P0]
│   ├── Mira 3D Assistant         /demo/mira            [P2]
│   ├── FuturePath AI             /demo/futurepath      [P2]
│   └── Evaluation / Demo Info    /demo/about-data      [P1]
│
└── CANDIDATE DEMO VIEW
    └── Right of Reply            /demo/candidate-reply [P1]
        └── Correct / Add Evidence

Note: No production authentication or real employer account system is required
for the competition demo. Candidate reply is a simulated, clearly labeled flow.
```

## 3. Main recruiter journey

```text
    VISITOR
       │
       ▼
┌──────────────────────────┐
│ PINTEREST-INSPIRED HOME  │
│ [Explore] [Try Demo]     │
└──────────────────────────┘
       │ Try Demo
       ▼
┌──────────────────────────┐
│ RECRUITER OVERVIEW       │
│ 12 sample candidates     │
│ 3 example job roles      │
│ [Start Matching]         │
└──────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ INPUT / SELECT DATA      │
│ Candidates + Role needs  │
└──────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ GEMINI EVIDENCE EXTRACTION│
│ + SOURCE VALIDATION      │
└──────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ MATCH EVERY CANDIDATE    │
│ AGAINST ALL THREE ROLES  │
└──────────────────────────┘
       │
       ▼
┌──────────────────────────┐
│ BLINDSPOT RESCUE         │
│ Found another role worth │
│ looking at?              │
└──────────────────────────┘
       │
       ├───────────────┬────────────────────┐
       ▼               ▼                    ▼
 Evidence Ledger  Check Expectations   Criteria Preview
       │               │                    │
       └───────────────┴────────────────────┘
                       │
                       ▼
                ┌─────────────────────┐
                │ HUMAN REVIEW        │
                │ Ask / Save / Review │
                └─────────────────────┘
                       │
                ┌──────┴────────┐
                ▼               ▼
           Mira Explains   FuturePath Explores
              [P2]             [P2]
```

---

# PART B — PUBLIC WEBSITE (PINTEREST-INSPIRED)

## 4. Public header / navbar

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [Logo] ProofMatch AI     Features    How it works    About          [ Try the Demo → ]     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

- White/light header; deep-ocean text; jade primary CTA.
- Header remains readable as the page scrolls.
- Do not show nonfunctional Sign In / Sign Up buttons.

## 5. Public home — editorial hero with photo collage

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ProofMatch AI              Features     How it works     About        [ Try the Demo → ]  │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   GREAT TALENT                          ┌───────────────┐                                 │
│   DESERVES TO                           │ PHOTO: OFFICE │   ┌────────────────────────┐  │
│   BE SEEN.                              │ (rounded)     │   │ PHOTO: TEAM AT WORK    │  │
│                                         └───────────────┘   │ (rounded, taller)       │  │
│   Find overlooked candidates,               ┌───────────────┤                        │  │
│   discover better job matches,              │ PHOTO:        └────────────────────────┘  │
│   and see the reasons behind                │ STUDENT +     ┌────────────────┐           │
│   every suggestion.                         │ LAPTOP        │ PHOTO: PROJECT │           │
│                                             └───────────────┤ (rounded)      │           │
│   [ Explore Matches → ]  [ How it works ]                    └────────────────┘           │
│                                                                                          │
│   Sample data. Real matching process.                                                    │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                   DISCOVER WHAT PROOFMATCH CAN DO                                        │
│                                                                                          │
│  ┌──────────────────────────┐  ┌──────────────────────────┐  ┌───────────────────────┐  │
│  │ [PHOTO / PROJECT IMAGE]  │  │ [PHOTO / MATCH PREVIEW]  │  │ [IMAGE / TIMELINE]    │  │
│  │                          │  │                          │  │                       │  │
│  │ Find someone overlooked  │  │ See why a role fits      │  │ Explore what's next   │  │
│  │ [ See feature → ]        │  │ [ See feature → ]        │  │ [ See feature → ]     │  │
│  └──────────────────────────┘  └──────────────────────────┘  └───────────────────────┘  │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│   [ LARGE PRODUCT SCREENSHOT / MINI-DEMO ]     FIND THE MATCH YOU MAY HAVE MISSED.        │
│                                                One candidate can fit more than one role.  │
│                                                [ See Blindspot Rescue → ]                │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│   EVERY SUGGESTION HAS A REASON.             [ EVIDENCE LEDGER PREVIEW IMAGE ]            │
│   See the CV or project detail behind                                                  │
│   the suggestion. [ See how → ]                                                          │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│   HOW IT WORKS                                                                           │
│     01 Add candidates    →    02 Explore matches    →    03 Review the reasons           │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│   READY TO GIVE TALENT A CLOSER LOOK?                                                     │
│                      [ Try ProofMatch AI → ]                                              │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│   ProofMatch AI              About     Privacy     Demo Data    GitHub (if available)     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### Visual direction
- Airy pearl-white page, large editorial title, asymmetrical rounded workplace/photo collage.
- Main CTAs in jade teal; warm-gold accent only for subtle discovery moments.
- Feature image cards use **relevant** workplace, portfolio, project or UI images—not unrelated fashion imagery.
- Image overlays never interfere with text. Photos are optimized locally as WebP.

## 6. Feature showcase section (horizontal image cards)

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ SEE WHAT PROOFMATCH CAN DO                                        [ View all features → ]│
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│ ┌────────────────────────────┐ ┌────────────────────────────┐ ┌─────────────────────────┐│
│ │ [IMAGE: ROLE DISCOVERY]    │ │ [IMAGE: EVIDENCE PREVIEW]  │ │ [IMAGE: GROWTH PATH]    ││
│ │                            │ │                            │ │                         ││
│ │ A better role may be       │ │ Don't just trust a score   │ │ See where a career     ││
│ │ hiding in plain sight      │ │ See what backs it up       │ │ could grow              ││
│ │ [ See how → ]              │ │ [ See how → ]              │ │ [ See how → ]          ││
│ └────────────────────────────┘ └────────────────────────────┘ └─────────────────────────┘│
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

## 7. How It Works / About and Trust sections

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ HOW IT WORKS                                                                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│ [ 1 ] ADD CANDIDATES           [ 2 ] CHECK ALL ROLES           [ 3 ] REVIEW & DECIDE     │
│ Upload or paste CV text       AI organizes supplied          See alternatives and         │
│ or explore example people.   evidence; compares 3 roles.    their supporting details.     │
│                                                                                          │
│                                [ Try a sample → ]                                        │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ WHY WE BUILT THIS                                                                        │
│ No CV tells the whole story. ProofMatch helps HR spot people who might fit another job.   │
│ It never automatically hires or rejects a person.                                        │
│                                                                                          │
│ WHAT YOU SHOULD KNOW                                                                     │
│ Sample profiles are fictional. 'Not found' does not mean 'doesn't know the skill.'         │
│ Career journeys are possible examples, not predictions.                                  │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

## 8. Enter Demo / sample data selection

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Home                    WELCOME TO PROOFMATCH                                  │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│   Explore the demo                                                                      │
│   Choose how you want to start.                                                         │
│                                                                                          │
│  ┌────────────────────────────────┐   ┌────────────────────────────────┐               │
│  │ EXPLORE SAMPLE CANDIDATES      │   │ ADD YOUR OWN EXAMPLE            │               │
│  │                                │   │                                │               │
│  │ 12 fictional people            │   │ Paste a fictional CV and see   │               │
│  │ 3 example positions            │   │ how the system reads it.       │               │
│  │ Best for guided demo           │   │                                │               │
│  │ [ Open sample workspace → ]    │   │ [ Add a candidate → ]          │               │
│  └────────────────────────────────┘   └────────────────────────────────┘               │
│                                                                                          │
│ Note: Demo only. Don't enter real personal information.                                 │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART C — RECRUITER WORKSPACE

## 9. Shared desktop workspace shell

```text
┌─────────────────────────┬────────────────────────────────────────────────────────────────┐
│ PROOFMATCH AI           │  Search candidates / roles...       Sample workspace   [ ? ] │
│                         ├────────────────────────────────────────────────────────────────┤
│ OVERVIEW                │                                                                │
│  Home                   │                                                                │
│                         │                                                                │
│ MATCHING                │                      MAIN PAGE CONTENT                         │
│  Candidates             │                                                                │
│  Job Roles              │                                                                │
│  All Matches            │                                                                │
│  Blindspot Rescue       │                                                                │
│                         │                                                                │
│ TAKE ACTION             │                                                                │
│  Human Review           │                                                                │
│  Criteria Preview       │                                                                │
│                         │                                                                │
│ EXPLORE                 │                                                                │
│  Mira AI Assistant      │                                                                │
│  FuturePath AI          │                                                                │
│                         │                                                                │
│ INFO                    │                                                                │
│  About Demo Data        │                                                                │
│  Back to Website        │                                                                │
└─────────────────────────┴────────────────────────────────────────────────────────────────┘
```

- Tablet: collapsible drawer. Mobile: top navigation plus a small bottom nav for Home / People / Discover / More.
- The sidebar contains pages, not fake features or redundant navigation.

## 10. Recruiter dashboard / overview

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ ProofMatch           │ OVERVIEW                                      [ Add Candidate ] │
├──────────────────────┼───────────────────────────────────────────────────────────────────┤
│ Home                 │ Welcome! Let's find the right fit.                               │
│ Candidates           │                                                                   │
│ Job Roles            │ ┌────────────────┐ ┌────────────────┐ ┌───────────────────────┐ │
│ All Matches          │ │ Candidates     │ │ Open jobs      │ │ Matches to explore    │ │
│ Blindspot Rescue     │ │       12       │ │        3       │ │     from sample data  │ │
│ Human Review         │ └────────────────┘ └────────────────┘ └───────────────────────┘ │
│ Criteria Preview     │                                                                   │
│ Mira                 │ ┌───────────────────────────────────────────────────────────────┐ │
│ FuturePath           │ │ DISCOVER A POSSIBLE MATCH                                  │ │
│                      │ │ Candidate A applied for Frontend Developer.                  │ │
│                      │ │ Their testing projects also point toward QA Automation.      │ │
│                      │ │ [ See why → ]                                               │ │
│                      │ └───────────────────────────────────────────────────────────────┘ │
│                      │                                                                   │
│                      │ YOUR THREE JOB ROLES                                              │
│                      │ [ Frontend Developer ] [ QA Automation ] [ Data Analyst ]        │
│                      │                                                                   │
│                      │ [ Explore All Matches ]        [ Try Blindspot Rescue ]           │
│                      │                                                                   │
│                      │ QUICK START: 1. Candidates → 2. Compare → 3. Review              │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 11. Candidate pool / search / filters

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Candidates           │ CANDIDATES                                 [ + Add Candidate ]  │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Search [ Name, skill, project ______________________ ] [ Search ]│
│                      │ Original role [All v]  Review status [All v]   [ Clear ]         │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Candidate     Applied role         Evidence         Action         │
│                      │ ---------------------------------------------------------------- │
│                      │ Candidate A   Frontend Developer  Some details     [ Open → ]     │
│                      │ Candidate B   Data Analyst        Good coverage    [ Open → ]     │
│                      │ Candidate C   QA Automation       Needs review     [ Open → ]     │
│                      │ Candidate D   Frontend Developer  Not yet checked  [ Open → ]     │
│                      │                                                                   │
│                      │ [ Previous ]  Page 1 / 2  [ Next ]                               │
│                      │                                                                   │
│                      │ All example profiles are fictional.                              │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 12. Add / paste candidate information

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Candidates           │ ← Candidates        ADD A CANDIDATE                              │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Candidate label [___________________________________________]    │
│                      │ Applied role     [ Frontend Developer                         v]│
│                      │                                                                   │
│                      │ CV / Experience (paste fictional content below)                   │
│                      │ ┌───────────────────────────────────────────────────────────────┐ │
│                      │ │                                                               │ │
│                      │ │ Paste CV or project description...                            │ │
│                      │ │                                                               │ │
│                      │ └───────────────────────────────────────────────────────────────┘ │
│                      │                                                                   │
│                      │ Optional project evidence                                        │
│                      │ Project title    [___________________________________________]    │
│                      │ Project excerpt  [___________________________________________]    │
│                      │ Source URL       [___________________________________________]    │
│                      │ (A link is not treated as proof of personal contribution.)        │
│                      │                                                                   │
│                      │ Candidate preferences                                            │
│                      │ Work style [ Remote / Hybrid / Onsite / No preference ]           │
│                      │ Career interests [__________________________________________]    │
│                      │                                                                   │
│                      │ [ Cancel ]                           [ Check Candidate → ]       │
│                      └───────────────────────────────────────────────────────────────────┘
```

Input rules: do not transmit real personal data in the public demo; limit content size; display validation errors; don't claim external URLs were fetched unless they really were.

## 13. Job roles listing

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Job Roles            │ OPEN JOB ROLES                                                   │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ ┌──────────────────────┐ ┌──────────────────────┐ ┌─────────────┐ │
│                      │ │ FRONTEND DEVELOPER   │ │ QA AUTOMATION        │ │ DATA ANALYST│ │
│                      │ │ React, JavaScript... │ │ Python, testing...   │ │ SQL, data...│ │
│                      │ │ Hybrid               │ │ Onsite               │ │ Hybrid      │ │
│                      │ │ [ View role → ]      │ │ [ View role → ]      │ │ [ View → ]  │ │
│                      │ └──────────────────────┘ └──────────────────────┘ └─────────────┘ │
│                      │                                                                   │
│                      │ [ Compare Candidates Across All Roles → ]                        │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 14. Job role details / criteria

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Job Roles            │ ← All Roles         QA AUTOMATION ENGINEER                      │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Role summary: Build and maintain automated software tests.      │
│                      │ Work style: Onsite     Career path: QA Engineer → QA Lead        │
│                      │                                                                   │
│                      │ WHAT THIS ROLE NEEDS                                              │
│                      │ Requirement            Type              Why it matters           │
│                      │ Python basics         Essential          Automated test scripts   │
│                      │ Testing knowledge     Essential          Test design              │
│                      │ CI experience         Preferred          Routine checks           │
│                      │ API testing           Preferred          Service testing          │
│                      │                                                                   │
│                      │ Preferences are not the same as essential requirements.          │
│                      │                                                                   │
│                      │ [ See Matches For This Role → ]                                  │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 15. AI processing states

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                  CHECKING CANDIDATES                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│     [✓] Reading the supplied information                                                 │
│     [✓] Finding job-related skills and project details                                   │
│     [~] Checking the supporting text                                                     │
│     [ ] Comparing three open roles                                                       │
│     [ ] Preparing explanations                                                           │
│                                                                                          │
│         [ Cancel ]                                                                       │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ ERROR STATE: 'We couldn't finish checking this candidate. Try again.'                   │
│                 [ Retry ] [ Return to Candidates ]                                      │
│                                                                                          │
│ NEVER: 'Verified their talent' or 'Guaranteed best employee'.                             │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

## 16. All Matches — candidate × role matrix

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ All Matches          │ EXPLORE MATCHES                           [ Check Again ]        │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Search [____________________________________________]            │
│                      │ Show [ All / Worth another look / Needs more info ]               │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Candidate       Frontend          QA              Data           │
│                      │ ---------------------------------------------------------------- │
│                      │ Candidate A     Some evidence    Strong evidence   Some evidence  │
│                      │ Candidate B     Needs review     Some evidence     Strong evidence│
│                      │ Candidate C     Some evidence    Strong evidence   Needs review   │
│                      │                                                                   │
│                      │ * Evidence coverage is not a future-performance score.            │
│                      │                                                                   │
│                      │ SELECTED: CANDIDATE A                                            │
│                      │ Applied: Frontend Developer                                      │
│                      │ Possible alternative: QA Automation                              │
│                      │ [ See Why → ] [ Compare Roles → ] [ Add to Review → ]             │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 17. Blindspot Rescue — flagship discovery page

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Blindspot Rescue     │ PEOPLE WORTH ANOTHER LOOK                        [ How it works ?]│
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Some people may be a better match for a different role.           │
│                      │                                                                   │
│                      │ ┌───────────────────────────────────────────────────────────────┐ │
│                      │ │ [DISCOVERY ILLUSTRATION / SOFT JADE ANIMATION]                  │ │
│                      │ │                                                               │ │
│                      │ │ WE FOUND ANOTHER ROLE WORTH EXPLORING                         │ │
│                      │ │ Candidate A     Applied: Frontend Developer                  │ │
│                      │ │                 Possible alternative: QA Automation           │ │
│                      │ │                                                               │ │
│                      │ │ [ Reveal the reasons → ]                                     │ │
│                      │ └───────────────────────────────────────────────────────────────┘ │
│                      │                                                                   │
│                      │ BEFORE: ORIGINAL REVIEW           AFTER: CHECKING ALL ROLES      │
│                      │ ┌─────────────────────────────┐  ┌────────────────────────────┐ │
│                      │ │ Frontend Developer          │  │ QA Automation Engineer     │ │
│                      │ │ Not enough React evidence   │  │ Python testing evidence    │ │
│                      │ │ Might not be reviewed here  │  │ CI test workflow evidence  │ │
│                      │ └─────────────────────────────┘  └────────────────────────────┘ │
│                      │                                                                   │
│                      │ Why this role? [ View Evidence → ]                               │
│                      │ Still to check: API testing                                      │
│                      │ [ Compare Roles ] [ Ask a Question ] [ Save for HR Review ]     │
│                      │                                                                   │
│                      │ More possible alternatives [ Candidate C → ] [ Candidate F → ]    │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

**Reveal animation:** load real computed alternative first; animate only the transition to its explanation. Do not create an invented match for visual effect. If no alternatives are found, show "No additional role suggestions from the current information".

## 18. Detailed candidate profile — shared tabs

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Candidates           │ ← Candidate Pool          CANDIDATE A           [ Save to Review ]│
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ [Initials]  Applied for: Frontend Developer                      │
│                      │ Interests: Software quality / testing (candidate-provided)       │
│                      │                                                                   │
│                      │ [ Overview ] [ Evidence ] [ Expectations ] [ Ask & Review ]      │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ ROLE COMPARISON                                                   │
│                      │                                                                   │
│                      │ Frontend Developer    | Some supporting information               │
│                      │ QA Automation        | Stronger supporting information          │
│                      │ Data Analyst         | More information needed                  │
│                      │                                                                   │
│                      │ This is not a prediction of job performance.                      │
│                      │                                                                   │
│                      │ [ Why QA? ]  [ What should we check? ]  [ Ask Mira ]              │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 19. Evidence Ledger — click to see the supporting text

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Evidence Ledger      │ ← Candidate A        WHY THIS ROLE MAY FIT                     │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Selected role: [ QA Automation Engineer                   v ]   │
│                      │                                                                   │
│                      │ WHAT THE JOB NEEDS          WHAT WE FOUND                        │
│                      │ ---------------------------------------------------------------- │
│                      │ Python                      [ Supported by supplied project ]     │
│                      │ Automated testing           [ Supported by supplied project ]     │
│                      │ CI workflow                 [ Mentioned in project description ]  │
│                      │ API testing                 [ Couldn't confirm yet ]              │
│                      │                                                                   │
│                      │ [ Select: Automated testing ]                                   │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ EVIDENCE VIEWER                                                   │
│                      │ ┌───────────────────────────────────────────────────────────────┐ │
│                      │ │ Source: Example Project Description (fictional)              │ │
│                      │ │                                                               │ │
│                      │ │ 'I built [AUTOMATED PYTHON TEST SCRIPTS] for the login flow.'  │ │
│                      │ │           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^                     │ │
│                      │ │                  HIGHLIGHTED SOURCE WORDS                     │ │
│                      │ │                                                               │ │
│                      │ │ [ Show full text ] [ View linked artifact if accessible ]     │ │
│                      │ └───────────────────────────────────────────────────────────────┘ │
│                      │ This confirms a statement appears in supplied material.           │
│                      │ It does not independently verify the candidate's competence.      │
│                      │                                                                   │
│                      │ [ Ask About Missing Evidence → ]                                 │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

If the exact excerpt is not found in the source, the system must not show it as a verified quote. Display an uncertainty or extraction error instead.

## 20. Mutual Expectation Matching

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Expectations         │ ← Candidate A          DO EXPECTATIONS MATCH?                    │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │                                                                   │
│                      │ TOPIC              CANDIDATE WANTS      COMPANY OFFERS           │
│                      │ ---------------------------------------------------------------- │
│                      │ Work location      Remote preferred    Onsite most days          │
│                      │ Hours              Standard daytime   Standard daytime          │
│                      │ Career interests   Automation work    QA automation role        │
│                      │ Salary             Not provided       Range not provided        │
│                      │                                                                   │
│                      │ WHAT LOOKS ALIGNED                                                │
│                      │ [✓] Interest in test automation is relevant to this role.         │
│                      │                                                                   │
│                      │ WORTH DISCUSSING                                                  │
│                      │ [?] Candidate prefers remote work; this role is mostly onsite.     │
│                      │                                                                   │
│                      │ [ Suggest a Question → ] [ Back to Match → ]                     │
│                      │                                                                   │
│                      │ Only explicit preferences are used; no age or personality guess.  │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 21. AI Clarification and HR Review

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Human Review         │ ASK THE RIGHT QUESTION                                           │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Candidate A                 Role: QA Automation                  │
│                      │                                                                   │
│                      │ WE COULDN'T CONFIRM                                               │
│                      │ - API testing experience                                        │
│                      │                                                                   │
│                      │ SUGGESTED QUESTION                                                │
│                      │ ┌───────────────────────────────────────────────────────────────┐ │
│                      │ │ 'Can you describe a project where you tested an API and tell  │ │
│                      │ │  us what you personally worked on?'                          │ │
│                      │ └───────────────────────────────────────────────────────────────┘ │
│                      │ [ Copy Question ]                                                │
│                      │                                                                   │
│                      │ HR ACTION                                                         │
│                      │ ( ) Save for further review                                      │
│                      │ ( ) Request more information                                     │
│                      │ ( ) Consider for interview                                       │
│                      │                                                                   │
│                      │ Notes [______________________________________________________]   │
│                      │                                                                   │
│                      │ [ Save Review Decision ]                                         │
│                      │                                                                   │
│                      │ HR decides; these are review states, never automated hiring.       │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 22. Saved reviews / action queue

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Human Review         │ YOUR REVIEW LIST                                                 │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Search [________________________]  Status [All v]                │
│                      │                                                                   │
│                      │ Candidate A  QA Automation   Request more information [ Open ]   │
│                      │ Candidate B  Data Analyst    Save for further review [ Open ]    │
│                      │ Candidate C  QA Automation   Consider interview       [ Open ]    │
│                      │                                                                   │
│                      │ [ Show explanation ] [ Edit note ] [ Remove from list ]         │
│                      │                                                                   │
│                      │ Demo: review actions may be stored in this browser only.          │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 23. Criteria Impact Preview — hypothetical only

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Criteria Preview     │ SEE WHAT CHANGES                                                │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Role: [ Frontend Developer                                  v ] │
│                      │                                                                   │
│                      │ Current requirement               Type                            │
│                      │ React experience                  [ Preferred v ]                 │
│                      │ JavaScript fundamentals           [ Essential / locked ]          │
│                      │                                                                   │
│                      │ WHAT IF...                                                        │
│                      │ [ Lower the emphasis on React experience                v ]       │
│                      │                                         [ Preview Changes ]       │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ BEFORE                              AFTER (SIMULATION ONLY)      │
│                      │ ┌─────────────────────────────┐   ┌─────────────────────────────┐│
│                      │ │ Original review order       │   │ Alternative review order    ││
│                      │ │ Candidate A: lower coverage │   │ Candidate A: closer review ││
│                      │ └─────────────────────────────┘   └─────────────────────────────┘│
│                      │                                                                   │
│                      │ WHAT CHANGED                                                     │
│                      │ React preference has less influence; essential needs are intact. │
│                      │                                                                   │
│                      │ [ Reset ] [ See Candidate Evidence ]                             │
│                      │                                                                   │
│                      │ This preview never silently edits a real job requirement.        │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

## 24. Candidate Right of Reply — simulated candidate page

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [ProofMatch AI]         CANDIDATE VIEW (DEMO)                     [ Back to HR View ]      │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│                        HELP US UNDERSTAND YOUR EXPERIENCE                                │
│                                                                                          │
│  Candidate A                                                                             │
│  Role being reviewed: QA Automation Engineer                                             │
│                                                                                          │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ WE COULDN'T CONFIRM: API TESTING                                                  │  │
│  │ We didn't find enough information in the material provided.                       │  │
│  │ This doesn't mean you don't know the skill.                                        │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
│  Want to add or correct something?                                                       │
│  [ Provide more details about a project ____________________________________________ ]   │
│  [_______________________________________________________________________________]     │
│  [ Optional supporting link _________________________________________________ ]         │
│                                                                                          │
│                            [ Preview Updated Report ]                                   │
│                                                                                          │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ ORIGINAL REVIEW                   UPDATED REVIEW                                         │
│ 'Not confirmed'                   'New self-reported details; HR review needed'           │
│ [ Original statement preserved ] [ New information shown separately ]                  │
│                                                                                          │
│                      [ Send Update for HR Review ]                                       │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

**State:** `draft -> candidate adds information -> evidence rechecked -> revised record -> HR sees both versions`. A new statement is not automatically considered proof of skill. For Round 1 this entire experience uses fictional data and the same browser; no remote candidate account is implied.

## 25. Correction history in HR view

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ CANDIDATE A — NEW INFORMATION RECEIVED (DEMO)                                            │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Requirement: API testing                                                                 │
│                                                                                          │
│ ORIGINAL: 'Not established from supplied evidence'                                      │
│                                                                                          │
│ CANDIDATE ADDED:                                                                         │
│ 'I used Postman to test an example API in my final-year project.'                        │
│                                                                                          │
│ CURRENT: 'Candidate reports experience; independent confirmation pending'                │
│                                                                                          │
│ [ View Original ] [ View Added Text ] [ Ask Follow-Up ] [ Save for Review ]            │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART D — WOW EXPERIENCE PAGES

## 26. Mira — dedicated 3D AI assistant page

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ Mira AI Assistant    │ MEET MIRA — YOUR MATCH GUIDE                                    │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Ask about a candidate, explore another role or get ideas.        │
│                      │                                                                   │
│                      │ ┌──────────────────────┐ ┌──────────────────────────────────────┐│
│                      │ │                      │ │ CHAT WITH MIRA                       ││
│                      │ │    [ 3D CHARACTER ]  │ │                                      ││
│                      │ │                      │ │ Mira: Hi! What would you like to      ││
│                      │ │     [ IDLE / TALK ]  │ │       know about a job match?        ││
│                      │ │                      │ │                                      ││
│                      │ │       (MIRA)         │ │ You: Why does Candidate A fit QA?    ││
│                      │ │                      │ │                                      ││
│                      │ │ [ Mute ] [ Replay ]  │ │ Mira: Their project describes ...    ││
│                      │ └──────────────────────┘ │       API testing still needs        ││
│                      │                          │       checking.                      ││
│                      │                          │                                      ││
│                      │                          │ [ Type a question...            ]  ││
│                      │                          │ [ Speak ] [ Send ] [ Read Aloud ]   ││
│                      │                          └──────────────────────────────────────┘│
│                      │                                                                   │
│                      │ TRY ASKING                                                        │
│                      │ [ Why this role? ] [ What's missing? ] [ What should HR ask? ]    │
│                      │ [ Explain in simple words ] [ Show Candidate A's future paths ]   │
│                      │                                                                   │
│                      │ Selected context [ Candidate A v ] [ QA Automation v ]           │
│                      │ Answers use supplied demo information, not guesses about people.  │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

**Interaction flow:** select candidate/role -> tap mic OR type -> browser speech recognition if supported -> AI endpoint receives only selected demo context -> answer constrained to known match data -> text appears -> optional browser TTS/demo voice -> avatar switches idle/talking animation. If mic unavailable, type works. If the 3D scene is unavailable, display static avatar art with a working chat. No promised lip-sync accuracy, emotion detection or prediction.

## 27. Mira voice and safety flow

```text
                         USER ASKS MIRA
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
         [ TYPE MESSAGE ]           [ TAP MICROPHONE ]
                 │                         │
                 │                  Browser supports
                 │                  speech recognition?
                 │                  ┌──────┴──────────┐
                 │                  │ YES             │ NO
                 │                  ▼                 ▼
                 │              Transcript       Type instead
                 │                  │                 │
                 └──────────────────┴─────────────────┘
                                    │
                                    ▼
                      SELECTED MATCH DATA + QUESTION
                                    │
                                    ▼
                     SERVER AI RESPONSE (GROUNDED)
                                    │
                          ┌─────────┴──────────┐
                          ▼                    ▼
                    ANSWER IN TEXT         OPTIONAL AUDIO
                          │                    │
                          ▼                    ▼
                    CHAT HISTORY         MIRA TALK ANIMATION

      ERROR/FALLBACK: show friendly error; display available evidence;
                      don't invent applicant facts.
```

## 28. FuturePath AI — possible career journey simulator

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ FuturePath AI        │ EXPLORE WHERE THIS ROLE COULD LEAD                              │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ Candidate: [ Candidate A   v ]    Start role [ QA Automation  v ]│
│                      │                                                                   │
│                      │ What interests you most?                                         │
│                      │ (●) Become a testing specialist                                 │
│                      │ ( ) Move into software development                              │
│                      │ ( ) Explore team leadership                                     │
│                      │                                                                   │
│                      │ POSSIBLE EXAMPLE PATH                                             │
│                      │                                                                   │
│                      │   ┌────────────────┐                                             │
│                      │   │ JUNIOR QA      │                                             │
│                      │   │ Starting role  │                                             │
│                      │   └────────┬───────┘                                             │
│                      │            ▼                                                     │
│                      │   ┌───────────────────┐                                          │
│                      │   │ QA AUTOMATION     │                                          │
│                      │   │ More test skills  │                                          │
│                      │   └────────┬──────────┘                                          │
│                      │            ▼                                                     │
│                      │   ┌───────────────────┐                                          │
│                      │   │ SENIOR QA         │                                          │
│                      │   │ Project ownership │                                          │
│                      │   └────────┬──────────┘                                          │
│                      │            ▼                                                     │
│                      │   ┌───────────────────┐                                          │
│                      │   │ QA LEAD           │                                          │
│                      │   │ If role available │                                          │
│                      │   └───────────────────┘                                          │
│                      │                                                                   │
│                      │ To explore the next step: [ Testing ] [ CI ] [ Leadership ]       │
│                      │ [ Ask Mira About This Path ] [ Try Another Direction ]          │
│                      │                                                                   │
│                      │ These are example possibilities, NOT predicted promotions.       │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

**Data:** predefined company/role path graph; prerequisite skills and user-selected goals. AI may explain steps from that graph, but must not invent vacancies, salaries, promotion dates or likely employee performance. FuturePath remains optional for the main competition loop.

## 29. Evaluation / demo transparency page

```text
┌──────────────────────┬───────────────────────────────────────────────────────────────────┐
│ About Demo Data      │ HOW WE TEST PROOFMATCH                                          │
│                      ├───────────────────────────────────────────────────────────────────┤
│                      │ SAMPLE DATA                                                      │
│                      │ [ 12 fictional profiles ] [ 3 roles ] [ Source examples ]        │
│                      │                                                                   │
│                      │ TESTS                                                           │
│                      │ - Did we find known alternative-role examples?                   │
│                      │ - Can we trace every displayed quote?                            │
│                      │ - Does harmless CV rewording change the result?                  │
│                      │ - Do unsupported claims improve the match unfairly?              │
│                      │                                                                   │
│                      │ [ Run Available Tests ]                                           │
│                      │ Actual results: [ Show only completed measurements ]             │
│                      │                                                                   │
│                      │ AI helps to organize information, not predict future success.      │
└──────────────────────┴───────────────────────────────────────────────────────────────────┘
```

---

# PART E — MOBILE / TABLET WIREFRAMES

## 30. Mobile landing page (375–390px target)

```text
┌───────────────────────────────────┐
│ ProofMatch AI             [ ☰ ] │
├───────────────────────────────────┤
│                                   │
│ GREAT TALENT                      │
│ DESERVES TO                       │
│ BE SEEN.                          │
│                                   │
│ Find overlooked people and see   │
│ why they might fit another role. │
│                                   │
│ [ Try the Demo →                ] │
│ [ How it works                  ] │
│                                   │
│ ┌────────────┐ ┌───────────────┐ │
│ │ WORKPLACE  │ │ TEAM PHOTO    │ │
│ │ PHOTO      │ │               │ │
│ └────────────┘ │               │ │
│ ┌────────────┐ └───────────────┘ │
│ │ PROJECT    │                   │
│ │ PHOTO      │                   │
│ └────────────┘                   │
├───────────────────────────────────┤
│ WHAT YOU CAN DO                   │
│ ┌───────────────────────────────┐ │
│ │ [image]                       │ │
│ │ Find overlooked matches      │ │
│ │ [ Explore → ]                 │ │
│ └───────────────────────────────┘ │
│ ┌───────────────────────────────┐ │
│ │ [image]                       │ │
│ │ See the reasons              │ │
│ │ [ Explore → ]                 │ │
│ └───────────────────────────────┘ │
└───────────────────────────────────┘
```

## 31. Mobile recruiter home

```text
┌───────────────────────────────────┐
│ ProofMatch AI            [ ? ]   │
├───────────────────────────────────┤
│ Welcome back                      │
│                                   │
│ ┌─────────────┐ ┌───────────────┐│
│ │ Candidates  │ │ Open roles    ││
│ │     12      │ │      3        ││
│ └─────────────┘ └───────────────┘│
│                                   │
│ WORTH ANOTHER LOOK                │
│ ┌───────────────────────────────┐ │
│ │ Candidate A                   │ │
│ │ Applied: Frontend Developer   │ │
│ │ May also fit QA Automation    │ │
│ │ [ See why →                 ] │ │
│ └───────────────────────────────┘ │
│                                   │
│ [ Explore All Matches          ] │
├───────────────────────────────────┤
│ Home    People    Discover   More │
└───────────────────────────────────┘
```

## 32. Mobile candidate/evidence details

```text
┌───────────────────────────────────┐
│ ← Candidates      Candidate A     │
├───────────────────────────────────┤
│ Applied for Frontend Developer    │
│                                   │
│ [ Match ] [ Evidence ] [ Review ] │
│                                   │
│ ANOTHER ROLE WORTH EXPLORING      │
│ QA Automation                     │
│                                   │
│ What supports this?               │
│ [ Python test scripts           ] │
│ [ CI testing workflow           ] │
│                                   │
│ What needs checking?              │
│ [ API testing                   ] │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ TAP TO VIEW ORIGINAL TEXT     │ │
│ │ 'I built automated tests...' │ │
│ └───────────────────────────────┘ │
│                                   │
│ [ Save for HR Review           ] │
└───────────────────────────────────┘
```

## 33. Mobile Mira assistant

```text
┌───────────────────────────────────┐
│ ← Back               Mira AI      │
├───────────────────────────────────┤
│                                   │
│     ┌───────────────────────┐     │
│     │    [ 3D MIRA ]        │     │
│     │    Idle / Talking     │     │
│     └───────────────────────┘     │
│                                   │
│ Mira: How can I help?             │
│                                   │
│ [ Why this role? ]                │
│ [ What is missing? ]              │
│                                   │
│ ┌───────────────────────────────┐ │
│ │ Message...                    │ │
│ └───────────────────────────────┘ │
│ [ Speak ] [ Send ] [ Read Aloud ] │
└───────────────────────────────────┘
```

Responsive rules: stacked cards, no horizontal page overflow, 44px-ish touch targets where possible, no critical data shown only on hover, full-screen bottom sheets for evidence, accessible contrast, keyboard navigation and reduced-motion support.

---

# PART F — CORE TECHNICAL / DATA FLOW

## 34. Full system data pipeline

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                    INPUT: CANDIDATE + JOB REQUIREMENTS                                  │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ Candidate CV text   Project descriptions   Stated goals/preferences   Three job roles     │
└──────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────┐
                          │ SERVER-SIDE AI EXTRACTION       │
                          │ Gemini Flash / structured JSON  │
                          │ Exact excerpts + skill labels  │
                          └─────────────────────────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────┐
                          │ VALIDATE OUTPUT                 │
                          │ - Zod schema                    │
                          │ - quote exists in source        │
                          │ - flag unsupported information  │
                          │ - never trust document commands │
                          └─────────────────────────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────┐
                          │ NORMALIZE / MAP SKILLS          │
                          │ Small controlled vocabulary     │
                          │ Explicit evidence status       │
                          └─────────────────────────────────┘
                                            │
                                            ▼
                          ┌─────────────────────────────────┐
                          │ TYPESCRIPT MATCHING ENGINE      │
                          │ Each candidate x all 3 roles   │
                          │ Essential vs preferred         │
                          │ Evidence coverage and gaps     │
                          └─────────────────────────────────┘
                                            │
                         ┌──────────────────┼────────────────────┐
                         │                  │                    │
                         ▼                  ▼                    ▼
                ┌────────────────┐ ┌────────────────┐ ┌──────────────────────┐
                │ BLINDSPOT      │ │ EVIDENCE       │ │ EXPECTATIONS /        │
                │ RESCUE         │ │ LEDGER         │ │ CRITERIA PREVIEW     │
                └────────────────┘ └────────────────┘ └──────────────────────┘
                         │                  │                    │
                         └──────────────────┼────────────────────┘
                                            ▼
                                  ┌────────────────────┐
                                  │ HR REVIEW / REPLY  │
                                  │ ORIGINAL + REVISED │
                                  │ RECORDS            │
                                  └────────────────────┘
                                            │
                         ┌──────────────────┴────────────────────┐
                         ▼                                       ▼
                  MIRA (EXPLAINS)                         FUTUREPATH (EXPLORES)
                  Context restricted                       Company-defined graph
                  to known demo data                       Not a prediction
```

## 35. Architecture — one Vercel deployment

```text
                              BROWSER
                                │
          ┌─────────────────────┴─────────────────────────┐
          │                                               │
          ▼                                               ▼
 PUBLIC LANDING / DEMO                           REACT UI COMPONENTS
 photos + feature cards                      dashboard, candidates, matching,
                                            evidence, Mira, FuturePath
          │                                               │
          └─────────────────────┬─────────────────────────┘
                                ▼
               ┌──────────────────────────────────┐
               │ NEXT.JS APPLICATION ON VERCEL    │
               │ -------------------------------- │
               │ App Router + Server functions    │
               │ /api/extract                     │
               │ /api/clarify                     │
               │ /api/mira                        │
               │ Matching + evidence helpers      │
               └─────────────────┬────────────────┘
                                 │
                   ┌─────────────┴──────────────┐
                   ▼                            ▼
         GEMINI API (SECRET KEY)         LOCAL DEMO DATA
         structured extraction          fictional JSON fixtures
         context-grounded chat          browser state for reviews
                   │                            │
                   └─────────────┬──────────────┘
                                 ▼
                       EXPLAINABLE RESULTS

  NOTE: Vercel ephemeral filesystem != persistent data storage.
  No shared cross-device candidate reply without database/auth/storage.
  Later production: Supabase PostgreSQL + auth + private artifact storage.
```

## 36. Reusable UI component inventory

```text
SHARED COMPONENTS (ONE SOURCE OF TRUTH)
│
├── WEBSITE
│   ├── PublicHeader
│   ├── HeroPhotoCollage
│   ├── FeatureImageCard
│   ├── HowItWorksSteps
│   └── PublicFooter
│
├── WORKSPACE
│   ├── WorkspaceShell / Sidebar / MobileNav
│   ├── CandidateCard / CandidateTable
│   ├── JobRoleCard / RequirementList
│   ├── MatchMatrix / MatchExplanation
│   ├── BlindspotReveal / RoleComparison
│   ├── EvidenceRow / SourceExcerptViewer
│   ├── ExpectationComparison
│   ├── CriteriaScenarioPanel
│   ├── ClarificationQuestion / ReviewAction
│   ├── CandidateReplyForm / ChangeHistory
│   ├── MiraAvatar / ChatPanel / VoiceControls
│   ├── CareerPathTimeline / GoalSelector
│   └── DemoDataDisclosure
│
└── CROSS-CUTTING
    ├── Button / Dialog / Badge / Tabs
    ├── EmptyState / ErrorState / LoadingState
    ├── SearchField / Select / FormField
    └── ResponsiveImage / AccessibleTooltip
```

## 37. Feature-to-page mapping (all nine features)

```text
FEATURE                                     ENTRY PAGE               SUPPORTING PAGES
------------------------------------------------------------------------------------------------
1  AI Multi-Role Matching                    /demo/matches            /demo/roles, /candidates
2  Blindspot Rescue                          /demo/discover           /demo/matches, details
3  Evidence Ledger                           candidate > Evidence     Blindspot, Review, Reply
4  Mutual Expectation Matching               candidate > Expectations /demo/futurepath
5  AI Clarification + Human Review           /demo/reviews            candidate > Ask & Review
6  Criteria Impact Preview                   /demo/criteria           Blindspot Rescue
7  Candidate Right of Reply                  /demo/candidate-reply    Evidence, Review History
8  Mira 3D AI Assistant                      /demo/mira               Candidate, FuturePath
9  FuturePath AI                             /demo/futurepath         Goals, Mira
```

## 38. Critical error, empty and limitation states

```text
IF NO CANDIDATES        -> 'Add a candidate or try the example profiles.'
IF NO MATCH FOUND       -> 'No other role suggestions from the information we have.'
IF EVIDENCE UNKNOWN     -> 'We couldn't confirm this from the supplied information.'
IF SOURCE QUOTE INVALID -> Don't display the quote as supporting evidence.
IF AI CALL FAILS        -> Retry or open clearly labeled previously generated demo result.
IF MICROPHONE FAILS     -> Show typing option. Never pretend speech was understood.
IF AVATAR FAILS         -> Show static Mira graphic + working text interaction.
IF NO CAREER PATH DATA  -> 'We don't have an example path for this role yet.'
IF CANDIDATE CORRECTS   -> Preserve original; show the new text and review status.
IF PREFERENCE CONFLICT  -> Show as question, not automatic rejection.
IF ESSENTIAL GAP        -> Keep requirement visible; don't silently remove eligibility rule.
IF SMALL SCREEN         -> Stack content; accessible tabs/sheets, no cramped data grid.
```

## 39. Recommended implementation sequence

```text
                        FOUNDATION
                            │
                            ▼
              [P0] UI shell + demo data
                            │
                            ▼
              [P0] 3 roles + candidates
                            │
                            ▼
              [P0] AI extraction + validation
                            │
                            ▼
              [P0] multi-role matching
                            │
                            ▼
              [P0] Evidence Ledger
                            │
                            ▼
              [P0] Blindspot Rescue
                            │
                            ▼
              [P0] HR Review + core tests
                            │
              ┌─────────────┴────────────────────────────┐
              ▼                                          ▼
        [P1] Expectations /                     [P1] Criteria Impact /
             Candidate Reply                         Clarification polish
              │                                          │
              └─────────────────────┬────────────────────┘
                                    ▼
                        [P2] Mira / FuturePath
                                    │
                                    ▼
                        Test mobile / Vercel /
                        demo / screenshots /
                             feature freeze
```

## 40. Exact judges' demo flow (90–120 seconds)

```text
LANDING HERO
    │ [Try Demo]
    ▼
DASHBOARD
    │ 'We have 3 jobs and several fictional applicants.'
    ▼
ALL MATCHES
    │ Pick Candidate A, originally applied for Frontend.
    ▼
BLINDSPOT RESCUE
    │ Reveal QA Automation as an evidence-supported alternative.
    ▼
EVIDENCE LEDGER
    │ Click Python testing; inspect original supplied excerpt.
    ▼
MISSING INFORMATION
    │ API testing unknown; generate one useful question.
    ▼
HUMAN REVIEW
    │ Save 'Request more information'.
    ▼
OPTIONAL 10-SECOND WOW MOMENT
    ├── Mira explains this result in voice / text
    └── FuturePath shows a possible QA career direction

No fabricated metrics, fake live extraction, or autonomous hiring claims.
```

## 41. Scope and safety boundaries

- The recruiter workspace is the **main** product. Landing photography and avatar interactions support, but never replace, functioning multi-role matching.
- `Blindspot Rescue` is the standout innovation; `Evidence Ledger` is its auditable technical foundation.
- **Candidate Right of Reply** is a simulated page using demo state unless real authentication and persistence are added.
- **Mira** uses demo context and voice capability when supported; it does not assess personality or emotional state.
- **FuturePath** explores company-defined example career steps; it does not predict promotions, productivity, loyalty or personal futures.
- Evidence states describe **information supplied**, not proven personal ability.
- Avoid real personal applicant records in the public competition demo.
- Do not show fake results as measured AI output.
- Every core action must have a visible response and an error/empty state.

---

# FINAL PROTOTYPE SUMMARY

```text
PUBLIC HOME (PINTEREST-INSPIRED, PHOTO-RICH)
           │
           ▼
     [ TRY DEMO ]
           │
           ▼
RECRUITER WORKSPACE (OCEAN PEARL)
           │
           ▼
CANDIDATES + 3 ROLES
           │
           ▼
AI EXTRACTION + REAL SOURCE CHECKS
           │
           ▼
MULTI-ROLE MATCHING
           │
           ▼
BLINDSPOT RESCUE  <--- SIGNATURE FEATURE
           │
           ├──── EVIDENCE LEDGER
           ├──── MUTUAL EXPECTATIONS
           ├──── CRITERIA IMPACT
           ├──── CLARIFICATION / HR REVIEW
           ├──── CANDIDATE RIGHT OF REPLY (DEMO)
           │
           ├──── MIRA 3D MATCH ASSISTANT (OPTIONAL WOW)
           └──── FUTUREPATH AI (OPTIONAL WOW)
           │
           ▼
HUMAN REVIEWS & DECIDES
```

**Document purpose:** Full proposed frontend/navigation/system-flow blueprint for implementation and pitch preparation. Built in the same page-by-page ASCII wireframe style as the supplied SCI Activity & 3ZERO reference, adapted to ProofMatch AI and its nine features.

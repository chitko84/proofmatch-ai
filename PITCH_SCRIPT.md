# ProofMatch AI — Five-Minute Competition Pitch

**AIFM Challenge 02 — Better Talent Matching**  
**Presenter:** Solo participant  
**Important:** This is a suggested script. Do not claim metrics, paid customers or completed interviews unless you have genuine records.

## Slide 1 — 0:00–0:35: The human problem

"Imagine you apply for a frontend role, but your strongest project experience is actually in QA automation. Traditional workflows often filter by the title you applied for, the language in your CV, or a narrow keyword checklist. The recruiter might never realize there is a better match elsewhere in the company. For applicants, that is a missed opportunity. For companies, it is wasted talent."

**Show:** Single fictional candidate card pointing to a different role. Use real public research citations on the actual slide if you include statistics; never invent a percentage.

## Slide 2 — 0:35–1:05: The solution

"ProofMatch AI looks at a talent pool across three job roles instead of one vacancy at a time. It connects job requirements to source-linked project and CV evidence, highlights a potentially overlooked alternative role, and distinguishes documented, self-reported and unknown information. A recruiter still decides the next step."

**Show:** Candidate → three roles → overlooked-match discovery → human review.

## Slide 3 — 1:05–2:55: The live demonstration

Follow `JUDGE_DEMO_RUNBOOK.md` shortened to roughly 110 seconds: opening → Blindspot Rescue → Evidence X-Ray → FairShot → HR review.

"Notice that ProofMatch doesn't claim this applicant is guaranteed to succeed. It shows exactly what supports a role, what is unknown, and how the person can add a job-relevant example."

**Show:** The actual working deployed site; avoid switching between many unrelated pages.

## Slide 4 — 2:55–3:35: The technology and what makes it different

"Gemini can extract structured skill mentions from candidate-supplied text. We validate each quoted excerpt against its source, then use a transparent deterministic engine to compare roles. AI helps read unstructured material and explain possible matches, while source validation and human review reduce unsupported claims. Our proposed differentiation is the combined flow: overlooked-role discovery, inspectable evidence and a structured opportunity to clarify missing information."

**Important nuance:** Existing HR technology already offers explainable matching and skills assessments; this combination and product workflow are our proposed integration, not a claim that each component is globally new.

## Slide 5 — 3:35–4:15: Business value and responsible AI

"The intended customer is a university career office, SME hiring team, or recruiting organization that receives applicants for several related roles. A pilot could begin with a limited talent pool and recruiter review. We would evaluate retrieval of relevant alternative-role candidates, factual accuracy of evidence links, reviewer time and recruiter trust. We have not yet demonstrated commercial impact in a real hiring organization."

"Our guardrails matter: fictional competition data, no automatic rejection, no fabricated verification, a right of reply, consistent standardized work-sample questions, and no predictions of employee performance."

**Show:** Simple business workflow / evaluation plan, not imaginary revenue charts.

## Slide 6 — 4:15–4:55: Why this matters and invitation

"The future of recruitment should look beyond polished CVs and job-title labels. ProofMatch helps recruiters see what people have actually described doing, discover roles they may have missed, and give candidates a structured chance to add evidence. Great talent deserves to be seen—and a hiring decision deserves to be understood."

**Last 5 seconds:** Point to a stable QR code/deployed link after the site has been deployed and tested. Do not invent a URL now.

## Q&A preparation

| Judge question | Grounded answer |
|---|---|
| Why Gemini? | Fast structured extraction of unstructured text; it is not used as a final hiring judge. |
| What is unique? | End-to-end emphasis on overlooked alternative role + source-linked explanations + FairShot opportunity + human review. Components have analogues in existing systems. |
| Can this be biased? | Yes. Extraction, assessments and recruiter choices can all reflect bias. We avoid protected-attribute ranking and propose testing on representative, consensually provided data. Controlled Proof Over Polish is not a fairness proof. |
| How do you know the skill is genuine? | We don't from a CV alone. We label evidence as supplied, self-reported or unknown, show literal excerpts and keep verification with HR. |
| Can the AI hallucinate? | Yes. Verbatim quote validation rejects unsupported output, but accurate quotes still don't prove the claim itself. |
| Are you predicting promotions? | No. FuturePath shows an illustrative company-defined route with requirements and missing evidence, not individual promotion forecasts. |
| Who pays? | Intended buyers: university career centers, SMEs and recruiting teams. Monetization remains a hypothesis until customer discovery and a pilot. |
| Can it scale? | Data/storage/auth are demo-only. A production pilot would require secure storage, permissions, ATS integrations, evaluation and compliance work. |
| Why FairShot? | Some capable candidates have gaps in documentation. It offers a consistent job-relevant opportunity to add evidence without automatic AI grading. |
| Any measurable results? | Cite only verified experiment outputs such as the actual unit test results. Do not present fictional scenario coverage as real business impact. |

## Two claims to avoid

- Do **not** say "we reduced hiring bias by X%" without a rigorously documented evaluation.
- Do **not** say "Gemini verifies skill" or "predicts employee success." It extracts candidate-supplied statements; human review remains needed.

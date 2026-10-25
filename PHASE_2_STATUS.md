# ProofMatch AI — Phase 2 status

## Scope delivered (source code)
- `/demo/analyze` collects candidate CV text plus optional separate project/portfolio text, role, location and work mode. Includes fictional example input.
- `/api/analyze` sends the text to the Gemini Developer API from a server route; API key never enters client bundle. Default model `gemini-3.8-flash`, configurable with `GEMINI_MODEL`.
- Gemini output is constrained to JSON with only the skill identifiers used by the three sample roles.
- All returned quotes are verified as exact substrings of the named source; unknown skills, mismatched sources, repeated entries and unsupported quotes are discarded. A project excerpt is never described as independently verified competence or contribution.
- The existing deterministic matching engine evaluates Gemini-extracted evidence for all three roles.
- `/demo/matches` supports the latest live candidate (browser session), showing source excerpts, missing information, work-mode alignment and human review actions.
- `/demo/discover` also shows a source-backed live alternative match **only if** there is a supported coverage gap and at least two project-source examples. It does not force a discovery.
- Sample fictional candidates and rule-based matching remain fully available without Gemini API access. No fake live AI output is substituted.
- Added request limits, validation, optional `DEMO_ACCESS_CODE`, timeout and friendly quota/error handling.

## Limits and honest disclosures
- Gemini was not called using a real API key here. A live external request **must be tested** by the user after adding their own key. We can verify the API contract with an injected fake network response only.
- This is pasted text, NOT PDF upload or verified GitHub integration. A project section is candidate-supplied evidence, not authenticated authorship.
- Browser session storage is for demo data, not production-ready private personal data. Do not paste real CVs without explicit consent and appropriate privacy safeguards.
- No durable shared candidate database or account login; those are not Phase 2.
- Criteria Impact, full candidate corrections, Mira and FuturePath are Phase 3.
- Built without added packages: native `fetch` calls Gemini's REST endpoint; no @google/genai or Zod dependency. Validation is explicitly implemented in TypeScript.

## Verification
- `npm test` runs offline with Node v22; existing six matching tests plus new extraction and request-contract tests.
- `npm run typecheck` and `npm run build` should be run after `npm install` locally. Package installation was not available in this environment.

## Vercel
- Set environment variable `GEMINI_API_KEY` in Vercel for all relevant environments; optionally `GEMINI_MODEL=gemini-3.8-flash`.
- Recommended for public demo: `DEMO_ACCESS_CODE=<unguessable code>`; enter same code in the Analyze form. It reduces casual quota abuse, but is not a replacement for real auth and per-user limits.
- On Vercel, open `/demo/analyze`, load fictional example, analyze, inspect the generated `/demo/matches?candidate=LIVE` and `/demo/discover` pages.

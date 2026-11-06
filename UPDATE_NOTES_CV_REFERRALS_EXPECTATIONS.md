# ProofMatch AI — CV, referrals and expectations update

- HR Resume Insights > Check CV & compare jobs routes to `/demo/candidate-compare?source=cv` and stores extracted CV text in sessionStorage. This was already present and has been preserved.
- Company Referrals dropdowns now list other demo companies and their open jobs even when no partner connections have been established. Requesting a referral establishes a browser-local demo partner connection when needed, then starts the candidate-consent workflow. This does not send messages to external employers. Production deployments must require independently approved connections.
- Candidate > What Works for Both Sides shows an explicit, evidence-limited application recommendation on the final step, including the reasons and a link to the vacancy.
- Cover-letter generation now produces longer, editable drafts with additional motivation, evidence context and closing paragraphs. Candidates must verify the text before submitting.
- Run `npm install`, `npm run build`, `npm run start`. Full build verification was not performed in the packaging environment.

# Two-sided matching candidate experience

- Candidate navigation now includes **What Works for Both Sides**.
- `/demo/expectations` is a five-step guided form, not an automatic redirect to the HR job comparison page.
- Stages: career goals and selected open vacancy; salary, location and working conditions; skills and career priorities; review and explicit consent; results.
- **Fill with sample data** is available before the results stage. Results are withheld until the user selects Analyze expectations.
- The comparison is explicitly a transparent local rules-based demo, not a real AI inference or message to a real employer. Salary, location, mode and skill mentions are compared to sample open vacancies.
- Previous HR job comparison, cross-industry recommendations and referrals are retained.
- Fixed a pre-existing unescaped apostrophe in the referrals page that prevented TypeScript parsing.

## Verification limitation
TypeScript checking cannot complete in this archive environment because the existing `node_modules` directory lacks React/Node/qrcode type packages. Run `npm ci && npm run typecheck && npm run build` in a network-enabled development environment.

# ProofMatch AI — React key warning fix

## Change
- Fixed the Getting Started page (`src/app/demo/guide/page.tsx`) where two distinct cards use `/demo/talent` as their destination. The `steps.map` React key now includes both the destination and the distinct card action (`key={`${item.url}:${item.action}`}`), giving each card stable identity.
- Added `tests/guide-keys.test.ts` to prevent the duplicate-key issue from recurring.
- All other modules and content are unchanged from the previous TypeScript Fixed package.

## Validation
Run `npm run typecheck`, `npm test`, `npm run build`, and `npm run dev` from inside `proofmatch-ai-main` after `npm install`.
Navigate to `/demo/guide` and confirm the browser console no longer reports duplicate `/demo/talent` keys.

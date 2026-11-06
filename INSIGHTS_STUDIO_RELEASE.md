# ProofMatch AI — Insights Studio Release

## Included

The new **Insights Studio** is available from the workspace sidebar and overview at `/demo/studio`.

### CSV Visualizer

- Drag-and-drop or browse local `.csv` files up to **2 MB** and **5,000 data rows** (up to 60 columns).
- Handles UTF-8 BOM, quoted commas, escaped quotation marks, CRLF and quoted line breaks.
- Supports **bar, horizontal bar, line, area, pie, donut, and scatter** visualizations.
- Select grouping and measurement columns, and use count/sum/average/min/max aggregations.
- Filter by text across rows and preview the first 50 filtered records.
- Export chart PNG and aggregated CSV. CSV exports prefix potentially spreadsheet-executable cell values to reduce spreadsheet formula injection.
- Use **Fill this with sample** to populate a full interactive example.
- CSV values are parsed in the local browser; no CSV uploads to the server and no CSV persistence across reloads.

### Résumé Insights

- Upload an authorized **PDF résumé** up to 5 MB, or paste résumé text directly.
- Extract text from supported embedded-text PDFs locally on the Next.js server. An optional configured Gemini service extracts text from PDFs that the basic embedded-text extractor cannot read (including some scanned documents).
- Compare **text mentions** against the current cross-industry role catalog (85+ jobs across 14 industries).
- View a role-by-role proportion of named skills found in the text, expandable supporting excerpts, and areas not mentioned; filter by industry and export a text report.
- All scores represent **document mentions**, not verified competency, qualifications, job readiness, hiring predictions, or performance.
- Uploaded PDFs are processed in memory and not persisted by this route. If Gemini fallback is needed, document bytes are sent to the configured Google Gemini API, subject to its data policies. Obtain applicant consent before uploading documents.
- When extraction cannot read a PDF, the user is prompted to paste text; no invented insights are generated.

## Multilingual support

- English, Bahasa Melayu, Simplified Chinese (Mandarin), Tamil are inherited from the whole-app language provider.
- Common Studio controls have curated offline translations in `src/lib/i18n-insights-studio.ts`.
- Additional authored explanatory copy uses the existing `/api/translate` integration when `GEMINI_API_KEY` is configured. Uploaded CSV values and CV excerpts are excluded from automatic cloud translation.

## Development and verification

```
npm ci
npm run typecheck
npm test
npm run preflight
npm run interactions
npm run build
npm run dev
```

Open `http://localhost:3000/demo/studio`.

The automated source/tests can run offline with a compatible Node runtime, but a full production build and interactive browser testing require installed dependencies. Validate both desktop/mobile responsive charts, PDF uploads, SVG-to-PNG export, translation and cross-browser file handling before launch.

## Important product limitations

- Existing ProofMatch AI features are preserved; this release does not change their architecture or deployment limitations.
- CSV analytics are descriptive and operate on browser-local data.
- The PDF embedded-text parser does not extract every font encoding, protected PDF or scan without a configured document extraction service. Scanned PDFs require Gemini and Internet access.
- Resume matching is explainable keyword/phrase coverage; it is not a professional competency assessment.
- The existing broader site includes prepopulated fictional employers and local-only workflow state; it should not be represented to actual job seekers as connected to verified employers without appropriate backend integration and sourcing.
- A production launch requires authentication, persistent database and appropriate consent, privacy, security, audit and load tests beyond this release.

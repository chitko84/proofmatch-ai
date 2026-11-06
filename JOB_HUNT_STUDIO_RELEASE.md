# ProofMatch AI — Candidate Application Studio

This release adds three integrated tools to the complete ProofMatch AI source project. All existing core MATCH functionality, Candidate / HR View switching, six-floor Company X explorer, other 3D experiences, Telegram integration, career news, network, interview, referrals, and analytics remain in place.

## New pages

- `/demo/job-hunt` — AI Job Hunt Copilot
- `/demo/resume-tailor` — AI Résumé Tailor
- `/demo/cover-letter` — Cover Letter Generator

These tools also appear in **Candidate View**, the candidate dashboard, Jobs & Companies, and Résumé Clinic.

## What users can do

1. Upload a PDF CV (up to 5 MB, text extraction through existing `/api/resume-extract`) or paste text. Optional profession-specific **Fill with sample data** works without external configuration.
2. Explore the existing 800-position catalog plus locally created company vacancies. Rank opportunities by CV evidence, career keywords, industry, work mode and location preferences. The displayed percentage measures the fraction of listed job skills mentioned in the document; it is not hiring probability or verified ability.
3. Choose a job and prepare an ATS-readable version of the CV using only details in the original. The CV can be edited in the side-by-side original/updated view.
4. Generate a cover letter in formal, confident, or concise tone from the role and documented CV content. Each letter is editable.
5. Export both documents as genuine Office Open XML `.docx` or plain text, or use the browser **Print / Save PDF** action. PDF is produced by the browser's built-in print service rather than a PDF server.
6. Save up to eight local document revisions. Saved jobs and locally submitted applications use the original shared workspace state, avoiding duplicate application storage.
7. Transfer CV text from Résumé Clinic into these tools. Use a prepared letter inside the existing Jobs & Companies application form for the selected vacancy.

## What the drafting engine does and does not do

The drafting and matching algorithms are fully functional without a database or AI API subscription. They use deterministic extraction and evidence-grounded templates over the supplied CV. They do not silently fabricate education, employment, project outcomes, or skill evidence, and do not pretend that a local application was submitted to a real company.

The platform still supports optional Gemini services for parts of the existing system. The new document drafting workflow is intentionally usable offline after initial page loading; it does not need remote language-model generation for normal operation.

The candidate controls application submission. CV text and drafts persist in the current browser's localStorage; clearing browser storage removes local drafts. Use only CVs you have permission to process. Changing browser or device does not synchronize data.

## Validation performed in this environment

- Full project Node test suite, including new job-hunt tests.
- TypeScript parsing checks via the TypeScript parser and a targeted typecheck for the pure drafting/export modules.
- Navigation / interaction source audit and full source preflight.
- Generated DOCX archive integrity and XML validity; representative Word document was rendered to verify layout.

**Still to test on the presentation machine:** `npm ci`, `npm run typecheck`, `npm run build`, `npm run dev`, browser PDF upload, DOCX download, Print / Save PDF, and navigation across role switcher, CV Clinic and job applications. The npm offline cache in this environment lacked a dependency, preventing an independent production build here.

## Quick start

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run dev
```

Open `http://localhost:3000/demo/candidate`, choose **AI Job Hunt Copilot**, then use **Fill with sample data** to start a complete candidate journey.

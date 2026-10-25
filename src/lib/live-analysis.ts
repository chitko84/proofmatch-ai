import { roles } from './data.ts';
import { assessMatch, rankRoles } from './engine.ts';
import type { Candidate, Evidence, WorkMode } from './types.ts';

export const LIVE_STORAGE_KEY = 'proofmatch-phase2-latest-analysis';
export const KNOWN_SKILLS = [...new Set(roles.flatMap(role => role.requirements.map(req => req.skillId)))];
export type SourceId = 'cv' | 'project';
export type LiveInput = {
  label: string;
  appliedRoleId: string;
  location: string;
  preferredModes: WorkMode[];
  cvText: string;
  projectText: string;
};
export type LiveResult = {
  candidate: Candidate;
  evidenceAccepted: number;
  evidenceRejected: number;
  warnings: string[];
  model: string;
  analyzedAt: string;
  // Text is kept in browser session storage for an inspectable source view, not on the server.
  sources: { cv: string; project: string };
};

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** Validates client data at the server boundary. No trust in input or generated output. */
export function validateLiveInput(input: unknown): LiveInput {
  if (!isObject(input)) throw new Error('Please enter the candidate details and CV text.');
  const label = typeof input.label === 'string' ? input.label.trim().slice(0, 75) : '';
  const location = typeof input.location === 'string' ? input.location.trim().slice(0, 100) : '';
  const cvText = typeof input.cvText === 'string' ? input.cvText.trim() : '';
  const projectText = typeof input.projectText === 'string' ? input.projectText.trim() : '';
  if (!label) throw new Error('Please give this candidate a name or label.');
  if (!roles.some(role => role.id === input.appliedRoleId)) throw new Error('Please choose an available role.');
  if (cvText.length < 40 || cvText.length > 12000) throw new Error('CV text must be between 40 and 12,000 characters.');
  if (projectText.length > 10000) throw new Error('Project text is limited to 10,000 characters.');
  const modes = Array.isArray(input.preferredModes) ? input.preferredModes : [];
  const preferredModes = modes.filter((m): m is WorkMode => m === 'onsite' || m === 'hybrid' || m === 'remote');
  if (!preferredModes.length) throw new Error('Please choose at least one preferred work arrangement.');
  return { label, location, appliedRoleId: String(input.appliedRoleId), preferredModes: [...new Set(preferredModes)], cvText, projectText };
}

/** The model may *suggest* excerpts, but only verbatim excerpts from an identified source survive. */
export function validateExtractedEvidence(
  output: unknown,
  sources: { cv: string; project: string },
): { evidence: Evidence[]; rejected: number } {
  if (!isObject(output) || !Array.isArray(output.evidence)) throw new Error('Gemini returned an invalid response. Please try again.');
  if (output.evidence.length > 60) throw new Error('Gemini returned too many findings. Please use a shorter source.');
  const result: Evidence[] = [];
  const seen = new Set<string>();
  let rejected = 0;
  for (const finding of output.evidence) {
    if (!isObject(finding) || typeof finding.skillId !== 'string' ||
      !KNOWN_SKILLS.includes(finding.skillId) ||
      (finding.sourceId !== 'cv' && finding.sourceId !== 'project') ||
      typeof finding.quote !== 'string') { rejected++; continue; }
    const quote = finding.quote.trim();
    const sourceId: SourceId = finding.sourceId;
    // Strict verbatim quote check; never convert unsupported LLM output into a grounded finding.
    if (!quote || quote.length < 8 || quote.length > 450 || !sources[sourceId].includes(quote)) {
      rejected++; continue;
    }
    const fingerprint = `${finding.skillId}:${sourceId}:${quote}`;
    if (seen.has(fingerprint)) { rejected++; continue; }
    seen.add(fingerprint);
    result.push({
      skillId: finding.skillId,
      kind: sourceId === 'project' ? 'artifact' : 'self_report',
      sourceLabel: sourceId === 'project' ? 'Candidate-supplied project text' : 'Candidate-supplied CV',
      excerpt: quote,
    });
  }
  return { evidence: result, rejected };
}

export function buildLiveResult(input: LiveInput, modelOutput: unknown, model: string, now = new Date()): LiveResult {
  const sources = { cv: input.cvText, project: input.projectText };
  const { evidence, rejected } = validateExtractedEvidence(modelOutput, sources);
  const candidate: Candidate = {
    id: 'LIVE', alias: input.label, location: input.location || 'Not provided',
    appliedRoleId: input.appliedRoleId, preferredModes: input.preferredModes,
    interests: [], evidence,
  };
  return {
    candidate, evidenceAccepted: evidence.length, evidenceRejected: rejected,
    warnings: [
      ...(rejected ? [`${rejected} AI finding(s) were removed because the source could not be checked.`] : []),
      ...(evidence.length ? [] : ['No usable source quotes were found. Review the CV and try adding specific examples.']),
      ...(input.projectText ? [] : ['Only self-reported CV statements were supplied; no separate project evidence was provided.']),
    ],
    model, analyzedAt: now.toISOString(), sources,
  };
}

/** Only a possible overlooked match, not a statement of suitability or hiring eligibility. */
export function findAlternative(candidate: Candidate) {
  const comparisons = rankRoles(candidate, roles);
  const best = comparisons[0];
  const original = assessMatch(candidate, roles.find(r => r.id === candidate.appliedRoleId)!);
  const artifactCount = best.assessments.filter(a => a.support === 'artifact').length;
  return best.alternativeToApplied && best.coverage >= original.coverage + 0.1 && artifactCount >= 2
    ? { best, original, gap: best.coverage - original.coverage }
    : null;
}

export function parseStoredAnalysis(raw: string | null): LiveResult | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed) || !isObject(parsed.candidate) || !Array.isArray(parsed.candidate.evidence) ||
      parsed.candidate.id !== 'LIVE' || !isObject(parsed.sources) ||
      typeof parsed.sources.cv !== 'string' || typeof parsed.sources.project !== 'string') return null;
    const c = parsed.candidate;
    const safeInput = validateLiveInput({
      label: c.alias, appliedRoleId: c.appliedRoleId, location: c.location,
      preferredModes: c.preferredModes, cvText: parsed.sources.cv, projectText: parsed.sources.project,
    });
    // Persisted session data is untrusted. Narrow the array and each entry before
    // mapping; an annotation on the callback parameter does not validate data.
    const storedEvidence: unknown = c.evidence;
    if (!Array.isArray(storedEvidence)) return null;
    const restoredEvidence = storedEvidence.flatMap((entry: unknown) => {
      if (!isObject(entry) || typeof entry.skillId !== 'string' ||
        typeof entry.excerpt !== 'string' ||
        (entry.kind !== 'artifact' && entry.kind !== 'self_report')) return [];
      return [{
        skillId: entry.skillId,
        sourceId: entry.kind === 'artifact' ? 'project' : 'cv',
        quote: entry.excerpt,
      }];
    });
    const rebuilt = buildLiveResult(safeInput, { evidence: restoredEvidence },
      typeof parsed.model === 'string' ? parsed.model : 'Gemini',
    new Date(typeof parsed.analyzedAt === 'string' && !Number.isNaN(Date.parse(parsed.analyzedAt)) ? parsed.analyzedAt : Date.now()));
    const rejected = typeof parsed.evidenceRejected === 'number' && Number.isSafeInteger(parsed.evidenceRejected) && parsed.evidenceRejected >= 0 && parsed.evidenceRejected < 100 ? parsed.evidenceRejected : 0;
    return { ...rebuilt, evidenceRejected: rejected, warnings: [...(rejected ? [`${rejected} AI finding(s) were removed because the source could not be checked.`] : []), ...rebuilt.warnings] };
  } catch { return null; }
}

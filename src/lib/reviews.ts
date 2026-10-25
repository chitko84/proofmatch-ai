export type ReviewStatus = 'clarification'|'review';
export type ReviewRecords = Record<string,ReviewStatus>;
const KEY='proofmatch-phase1-reviews';
export function readReviews(): ReviewRecords {
  if(typeof window==='undefined') return {};
  try {
    const parsed:unknown = JSON.parse(window.localStorage.getItem(KEY) || '{}');
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([key, value]) =>
      /^(?:C\d{2}|LIVE):(frontend|qa|analyst)$/.test(key) && (value === 'review' || value === 'clarification')));
  } catch { return {}; }
}
export function writeReviews(v:ReviewRecords) {
  if(typeof window==='undefined') return;
  try {window.localStorage.setItem(KEY,JSON.stringify(v));window.dispatchEvent(new Event('proofmatch-reviews-updated'));}catch{/* browser storage unavailable */}
}

/** Find exact words inside a *supplied* excerpt. This does not verify the source or skill. */
export const HIGHLIGHT_TERMS: Record<string, string[]> = {
  react: ['React'], typescript: ['TypeScript', 'typed'], css: ['responsive', 'layouts', 'CSS', 'keyboard'],
  api_integration: ['REST', 'API', 'endpoint'], python: ['Python', 'pandas'],
  test_automation: ['pytest', 'regression', 'automation tests', 'test suite', 'test scripts'],
  api_testing: ['API', 'status codes', 'invalid-request'], cicd: ['GitHub Actions', 'pull request', 'integration'],
  sql: ['SQL', 'window functions', 'views', 'tables'], cleaning: ['cleaning', 'deduplicating', 'removed duplicates', 'Standardized', 'preprocessing'],
  dashboard: ['dashboard', 'visuals', 'measures'],
};

export type HighlightPiece = {text: string; highlighted: boolean};
export function highlightSourceQuote(source: string, skillId: string): HighlightPiece[] {
  if (!source) return [];
  const candidates: Array<[number, number]> = [];
  const lower = source.toLocaleLowerCase('en');
  for (const term of HIGHLIGHT_TERMS[skillId] || []) {
    const target = term.toLocaleLowerCase('en');
    let offset = 0;
    while (offset < source.length) {
      const at = lower.indexOf(target, offset);
      if (at < 0) break;
      candidates.push([at, at + target.length]);
      offset = at + target.length;
    }
  }
  candidates.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const nonOverlapping: Array<[number, number]> = [];
  for (const range of candidates) {
    if (nonOverlapping.length && range[0] < nonOverlapping[nonOverlapping.length - 1][1]) continue;
    nonOverlapping.push(range);
  }
  if (!nonOverlapping.length) return [{text:source, highlighted:false}];
  const result: HighlightPiece[] = [];
  let start = 0;
  for (const [from, to] of nonOverlapping) {
    if (from > start) result.push({text:source.slice(start,from), highlighted:false});
    result.push({text:source.slice(from,to), highlighted:true});
    start = to;
  }
  if (start < source.length) result.push({text:source.slice(start), highlighted:false});
  return result;
}

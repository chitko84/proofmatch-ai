import { rankRoles } from './engine.ts';
import type { Candidate, Role } from './types.ts';

/** This isolates the deterministic matching calculation after evidence extraction.
 *  It CANNOT establish Gemini extraction or real-world fairness. */
export function compareEquivalentEvidence(candidate:Candidate, roles:Role[]){
  const rewritten:Candidate={...candidate, evidence:candidate.evidence.map(e=>({
    ...e,
    excerpt:`Project narrative, expanded for presentation: ${e.excerpt} The applicant describes this as a collaborative experience with documented learning opportunities.`,
  }))};
  const original=rankRoles(candidate,roles);
  const restyled=rankRoles(rewritten,roles);
  return {original,restyled,sameRank:original.every((r,i)=>r.roleId===restyled[i].roleId),
    sameCoverage:original.every((r,i)=>r.roleId===restyled[i].roleId&&r.coverage===restyled[i].coverage),
    rewritten,
  };
}

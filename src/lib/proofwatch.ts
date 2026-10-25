import type {Candidate,Role} from './types.ts';
import {rankRoles} from './engine.ts';

/** Honest fictional demo signals: never imply a live ATS event or an automatic decision. */
export type WatchSignal = {
  candidateId:string;
  candidateName:string;
  appliedRole:string;
  alternativeRole:string;
  alternativeRoleId:string;
  evidenceLine:string;
  evidenceSource:string;
};

export function getWatchSignals(candidates:Candidate[],roles:Role[]):WatchSignal[]{
  return candidates.flatMap(candidate=>{
    const ranking=rankRoles(candidate,roles);
    const best=ranking[0];
    const original=ranking.find(r=>r.roleId===candidate.appliedRoleId);
    const suggested=roles.find(r=>r.id===best?.roleId);
    const applied=roles.find(r=>r.id===candidate.appliedRoleId);
    // Ties are NOT a stronger alternative; avoid overstating the match.
    if(!best||!original||!suggested||!applied||!best.alternativeToApplied||best.coverage<=original.coverage)return [];
    const evidence=best.assessments.find(a=>a.support==='artifact'&&a.evidence?.excerpt)?.evidence;
    if(!evidence)return [];
    return [{
      candidateId:candidate.id,candidateName:candidate.alias,
      appliedRole:applied.title,alternativeRole:suggested.title,alternativeRoleId:best.roleId,
      evidenceLine:evidence.excerpt,evidenceSource:evidence.sourceLabel,
    }];
  });
}

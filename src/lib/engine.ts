import type { Candidate, Evidence, MatchReport, Requirement, Role, SkillAssessment } from "./types.ts";

const supportRank = (kind: Evidence["kind"]): number => kind === "artifact" ? 2 : 1;

/** Deterministic, reviewable RULE-BASED evidence coverage. This is NOT an AI model. */
export function assessMatch(candidate: Candidate, role: Role, hypothetical?: Evidence): MatchReport {
  const allEvidence = hypothetical ? [...candidate.evidence, hypothetical] : candidate.evidence;
  const assessments: SkillAssessment[] = role.requirements.map((requirement: Requirement) => {
    const matches = allEvidence.filter((e) => e.skillId === requirement.skillId);
    const evidence = [...matches].sort((a, b) => supportRank(b.kind) - supportRank(a.kind))[0];
    return { requirement, support: evidence?.kind ?? "missing", evidence };
  });
  const possible = role.requirements.reduce((sum, req) => sum + req.weight * 2, 0);
  const earned = assessments.reduce((sum, a) => sum + a.requirement.weight *
    (a.support === "artifact" ? 2 : a.support === "self_report" ? 1 : 0), 0);
  const coverage = possible === 0 ? 0 : earned / possible;
  const tier = coverage >= 0.75 ? "strong" : coverage >= 0.45 ? "partial" : "limited";
  const gaps = [...assessments]
    .filter((a) => a.support !== "artifact")
    .sort((a, b) => b.requirement.weight - a.requirement.weight);
  const questions = gaps.slice(0, 2).map((a) => a.support === "self_report"
    ? `Can you provide a project example demonstrating ${a.requirement.label}?`
    : `Have you used ${a.requirement.label} in practice? If so, what example can you share?`);
  const compatible = role.acceptedModes.some((m) => candidate.preferredModes.includes(m));
  return {
    candidateId: candidate.id, roleId: role.id, coverage, tier, assessments, questions,
    logistics: compatible ? "compatible" : "review_needed",
    logisticsNote: compatible
      ? "Stated work-mode preferences overlap. Confirm location and availability with the person."
      : "Stated work-mode preferences do not overlap. Clarify before proceeding; do not auto-reject.",
    alternativeToApplied: candidate.appliedRoleId !== role.id,
  };
}

export function rankRoles(candidate: Candidate, roles: Role[]): MatchReport[] {
  return roles.map((r) => assessMatch(candidate, r)).sort((a, b) =>
    b.coverage - a.coverage || a.roleId.localeCompare(b.roleId));
}

export function firstClarification(report: MatchReport): SkillAssessment | undefined {
  return [...report.assessments]
    .filter((a) => a.support !== "artifact")
    .sort((a, b) => b.requirement.weight - a.requirement.weight)[0];
}

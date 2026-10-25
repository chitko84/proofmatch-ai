/** All sample people/roles are fictitious. An artifact is provided evidence, NOT independent skill verification. */
export type WorkMode = "remote" | "hybrid" | "onsite";
export type EvidenceKind = "artifact" | "self_report";

export type Evidence = {
  skillId: string;
  kind: EvidenceKind;
  sourceLabel: string;
  excerpt: string;
};

export type Candidate = {
  id: string;
  alias: string;
  appliedRoleId: string;
  location: string;
  preferredModes: WorkMode[];
  interests: string[];
  evidence: Evidence[];
};

export type Requirement = { skillId: string; label: string; weight: number };

export type Role = {
  id: string;
  title: string;
  location: string;
  acceptedModes: WorkMode[];
  requirements: Requirement[];
};

export type SkillAssessment = {
  requirement: Requirement;
  support: "artifact" | "self_report" | "missing";
  evidence?: Evidence;
};

export type MatchReport = {
  candidateId: string;
  roleId: string;
  // Internal weighted evidence coverage, NOT probability of success or hireability.
  coverage: number;
  tier: "strong" | "partial" | "limited";
  assessments: SkillAssessment[];
  questions: string[];
  logistics: "compatible" | "review_needed";
  logisticsNote: string;
  alternativeToApplied: boolean;
};

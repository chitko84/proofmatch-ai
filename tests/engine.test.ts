import test from "node:test";
import assert from "node:assert/strict";
import { candidates, roles } from "../src/lib/data.ts";
import { assessMatch, firstClarification, rankRoles } from "../src/lib/engine.ts";

const c01 = candidates.find(c => c.id === "C01")!;
const qa = roles.find(r => r.id === "qa")!;

test("alternative QA role is discovered for C01, who applied to Frontend", () => {
  const ranked = rankRoles(c01, roles);
  assert.equal(ranked[0].roleId, "qa");
  assert.equal(ranked[0].alternativeToApplied, true);
});

test("missing skills must never be presented as supported", () => {
  const report = assessMatch(c01, qa);
  const api = report.assessments.find(a => a.requirement.skillId === "api_testing")!;
  assert.equal(api.support, "missing");
  assert.equal(api.evidence, undefined);
  assert.ok(report.questions.some(q => q.includes("API testing")));
});

test("self-reported skill has less weight than an artifact excerpt", () => {
  const frontend = roles.find(r => r.id === "frontend")!;
  const c = assessMatch(c01, frontend);
  assert.equal(c.assessments.find(a => a.requirement.skillId === "react")!.support, "self_report");
  const upgraded = assessMatch(c01, frontend, {
    skillId: "react", kind: "artifact", sourceLabel: "Hypothetical artifact", excerpt: "Hypothetically documented React work."
  });
  assert.ok(upgraded.coverage > c.coverage);
});

test("what-if scenario changes preview only, never base evidence", () => {
  const before = assessMatch(c01, qa);
  const gap = firstClarification(before)!;
  const after = assessMatch(c01, qa, {
    skillId: gap.requirement.skillId, kind: "artifact", sourceLabel: "WHAT-IF (not verified)", excerpt: "Illustrative-only evidence."
  });
  assert.ok(after.coverage > before.coverage);
  assert.equal(assessMatch(c01, qa).coverage, before.coverage);
  assert.equal(c01.evidence.some(e => e.skillId === gap.requirement.skillId), false);
});

test("practical work-mode conflicts require review rather than rejection", () => {
  const remote = candidates.find(c => c.id === "C05")!;
  const report = assessMatch(remote, qa);
  assert.equal(report.logistics, "review_needed");
  assert.ok(report.coverage > 0);
});

test("all roles are compared for every candidate and evidence excerpts are nonblank", () => {
  for (const candidate of candidates) {
    assert.equal(rankRoles(candidate, roles).length, 3);
    for (const evidence of candidate.evidence) {
      assert.ok(evidence.excerpt.trim());
      assert.ok(evidence.sourceLabel.trim());
    }
  }
});

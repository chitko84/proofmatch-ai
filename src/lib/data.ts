import type { Candidate, Evidence, Role } from "./types.ts";

const artifact = (skillId: string, sourceLabel: string, excerpt: string): Evidence => ({
  skillId, kind: "artifact", sourceLabel, excerpt,
});
const claim = (skillId: string, excerpt: string): Evidence => ({
  skillId, kind: "self_report", sourceLabel: "Candidate self-report", excerpt,
});

export const roles: Role[] = [
  { id: "frontend", title: "Frontend Developer", location: "Penang", acceptedModes: ["hybrid", "onsite"], requirements: [
    { skillId: "react", label: "React", weight: 5 },
    { skillId: "typescript", label: "TypeScript", weight: 4 },
    { skillId: "css", label: "CSS & responsive UI", weight: 2 },
    { skillId: "api_integration", label: "API integration", weight: 3 },
  ]},
  { id: "qa", title: "QA Automation Engineer", location: "Penang", acceptedModes: ["hybrid", "onsite"], requirements: [
    { skillId: "python", label: "Python", weight: 4 },
    { skillId: "test_automation", label: "Automated testing", weight: 5 },
    { skillId: "api_testing", label: "API testing", weight: 3 },
    { skillId: "cicd", label: "CI/CD", weight: 3 },
  ]},
  { id: "analyst", title: "Data Analyst", location: "Remote / Malaysia", acceptedModes: ["remote", "hybrid"], requirements: [
    { skillId: "sql", label: "SQL", weight: 5 },
    { skillId: "python", label: "Python", weight: 3 },
    { skillId: "cleaning", label: "Data cleaning", weight: 3 },
    { skillId: "dashboard", label: "Dashboards", weight: 4 },
  ]},
];

export const candidates: Candidate[] = [
  { id: "C01", alias: "Candidate 01", appliedRoleId: "frontend", location: "Penang", preferredModes: ["hybrid"], interests: ["automation", "software quality"], evidence: [
    artifact("python", "Project A: testing README", "Used Python to build test fixtures and data generators."),
    artifact("test_automation", "Project A: test suite excerpt", "Built a pytest regression suite for account workflows."),
    artifact("cicd", "Project A: workflow excerpt", "Configured GitHub Actions to run the test suite on each pull request."),
    claim("react", "Listed React under personal skills; no supporting project excerpt provided."),
  ]},
  { id: "C02", alias: "Candidate 02", appliedRoleId: "qa", location: "Penang", preferredModes: ["onsite", "hybrid"], interests: ["frontend design"], evidence: [
    artifact("react", "Portfolio B: project summary", "Built a reusable React component library."),
    artifact("typescript", "Portfolio B: code excerpt", "Implemented typed React hooks in TypeScript."),
    artifact("css", "Portfolio B: layout excerpt", "Designed mobile-responsive layouts and keyboard states."),
    artifact("api_integration", "Portfolio B: app excerpt", "Integrated a REST endpoint with loading and error states."),
    claim("python", "Reports beginner Python knowledge."),
  ]},
  { id: "C03", alias: "Candidate 03", appliedRoleId: "analyst", location: "Kuala Lumpur", preferredModes: ["remote"], interests: ["analytics"], evidence: [
    artifact("sql", "Case Study C: analysis", "Joined customer and transaction tables using window functions."),
    artifact("python", "Notebook C: preprocessing", "Used Python and pandas to transform raw sales data."),
    artifact("dashboard", "Report C: visuals", "Created a performance dashboard with documented measures."),
    claim("cleaning", "Reports experience deduplicating and cleaning spreadsheet data."),
  ]},
  { id: "C04", alias: "Candidate 04", appliedRoleId: "frontend", location: "Penang", preferredModes: ["hybrid"], interests: ["user experience"], evidence: [
    artifact("react", "Project D: source summary", "Developed React screens for a booking prototype."),
    artifact("css", "Project D: design notes", "Built responsive components for narrow screens."),
    claim("typescript", "Lists TypeScript but shares no example yet."),
  ]},
  { id: "C05", alias: "Candidate 05", appliedRoleId: "qa", location: "Kedah", preferredModes: ["remote"], interests: ["automation"], evidence: [
    artifact("python", "Project E: scripts", "Automated CSV validation checks in Python."),
    claim("test_automation", "Says they have written regression test scripts."),
    artifact("cleaning", "Project E: processing", "Standardized column types and removed duplicates."),
  ]},
  { id: "C06", alias: "Candidate 06", appliedRoleId: "analyst", location: "Penang", preferredModes: ["hybrid"], interests: ["quality assurance"], evidence: [
    artifact("sql", "Case Study F: SQL", "Created SQL views for weekly reports."),
    artifact("dashboard", "Case Study F: report", "Produced an operations dashboard with trend measures."),
    claim("api_testing", "Interested in API testing, but no evidence supplied."),
  ]},
  { id: "C07", alias: "Candidate 07", appliedRoleId: "frontend", location: "Penang", preferredModes: ["onsite"], interests: ["product engineering"], evidence: [
    artifact("react", "Project G: app", "Created React pages with shared state."),
    artifact("typescript", "Project G: types", "Added TypeScript domain types and API response validation."),
    artifact("api_integration", "Project G: network", "Connected to a documented REST API."),
  ]},
  { id: "C08", alias: "Candidate 08", appliedRoleId: "qa", location: "Penang", preferredModes: ["hybrid"], interests: ["automated testing"], evidence: [
    artifact("python", "Project H: scripts", "Created Python test utilities."),
    artifact("test_automation", "Project H: tests", "Implemented browser automation tests."),
    artifact("api_testing", "Project H: requests", "Tested API status codes and invalid-request behavior."),
    claim("cicd", "Mentions continuous integration but shares no example yet."),
  ]},
];

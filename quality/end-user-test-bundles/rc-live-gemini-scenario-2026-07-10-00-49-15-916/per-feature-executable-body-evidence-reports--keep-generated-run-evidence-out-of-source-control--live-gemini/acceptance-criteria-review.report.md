# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--keep-generated-run-evidence-out-of-source-control--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: keep-generated-run-evidence-out-of-source-control

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then generated run evidence should not be staged or committed by default | not testable from assigned surface | The Gherkin states this as an expectation, but the `report.md` content, which would provide evidence of this behavior (e.g., `.gitignore` configuration or source control status output), was not provided. | not observed | MISSING_REPORT_CONTENT | Supply the `report.md` content for review. |
| And source control should keep only contracts, templates, schemas, and tests | not testable from assigned surface | The Gherkin defines this scope for source control, but the `report.md` content, which would confirm this policy (e.g., by listing included/excluded file types or showing source control status), was not provided. | not observed | MISSING_REPORT_CONTENT | Supply the `report.md` content for review. |
| And CI may publish run evidence as build artifacts outside the committed source tree. | not testable from assigned surface | The Gherkin describes the CI's potential role in publishing evidence. However, the `report.md` content, which would detail how this is achieved or confirmed (e.g., CI configuration snippets or build artifact descriptions), was not provided. | not observed | MISSING_REPORT_CONTENT | Supply the `report.md` content for review. |

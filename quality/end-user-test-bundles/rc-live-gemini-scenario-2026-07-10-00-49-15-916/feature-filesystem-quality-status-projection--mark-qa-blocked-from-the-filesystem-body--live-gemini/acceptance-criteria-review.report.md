# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--mark-qa-blocked-from-the-filesystem-body--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: mark-qa-blocked-from-the-filesystem-body

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| And its QA gate decision is `BLOCKED` | not testable from assigned surface | The precondition that the QA gate decision is `BLOCKED` could not be verified from the provided surfaces, as `report.md` or other evidence of the initial state was not available. | not observed | EVIDENCE_MISSING | Provide `report.md` or other evidence confirming the initial state of the QA gate decision. |
| Then the status sentinel should be: | not testable from assigned surface | The existence and path of the status sentinel file `docs/features/_STATUS.qa-blocked.<feature-id>.md` could not be verified as the generated `report.md` or filesystem output was not provided. | not observed | EVIDENCE_MISSING | Provide `report.md` or the content of the generated sentinel file. |
| And the sentinel should include blocker count and blocker codes | not testable from assigned surface | The content of the status sentinel file, specifically the inclusion of blocker count and blocker codes, could not be verified as the file content was not provided. | not observed | EVIDENCE_MISSING | Provide the content of the generated sentinel file. |
| And the sentinel should link to: | not testable from assigned surface | The content of the status sentinel file, specifically the links to `qa-evidence-bundle.report.md`, `blocker-worklist.md`, and `qa-gate-decision.v1.json`, could not be verified as the file content was not provided. | not observed | EVIDENCE_MISSING | Provide the content of the generated sentinel file. |
| And the next recommended action should point to the first blocker route. | not testable from assigned surface | The content of the status sentinel file, specifically that the next recommended action points to the first blocker route, could not be verified as the file content was not provided. | not observed | EVIDENCE_MISSING | Provide the content of the generated sentinel file. |

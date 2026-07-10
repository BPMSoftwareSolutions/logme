# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: validate-report-layout-contract-before-rendering

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the contract should define: | not testable from assigned surface | The report layout contract definition, including the specified fields, is not exposed through the provided end-user surfaces (Gherkin, report.md). There is no direct evidence to confirm these fields are defined within the contract. | not observed | EVIDENCE_MISSING | Expose the report layout contract definition (e.g., via a CLI command, debug log, or a dedicated section in the report itself) to allow verification of its structure. |
| And report.md should be rendered only after layout validation passes. | partially met | The `report.md` file was successfully generated, indicating that rendering occurred after validation passed in this scenario. However, the 'only after' condition, which implies `report.md` should not be rendered if validation fails, cannot be verified with the provided evidence (which only shows a successful validation path). | not observed | NEGATIVE_CASE_MISSING | Provide evidence from a test case where layout validation fails, demonstrating that `report.md` is not rendered in such a scenario. |

# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-invented-fallback-execution-body-tree-for-promotion--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-invented-fallback-execution-body-tree-for-promotion

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| And no product-owned report data contract declares `executionNodes` | not testable from assigned surface | This is a `Given` condition describing an internal system state, not an end-user observable outcome. It cannot be verified from the provided end-user surfaces (Gherkin, missing report.md, missing live-call receipt). | not observed | EVIDENCE_MISSING_OR_INSUFFICIENT | This criterion describes a precondition. If it needs to be tested, it would require access to internal code or system configuration, which is outside the scope of end-user QA surfaces. |
| Then the renderer should not invent fallback body nodes | not testable from assigned surface | This `Then` clause's observable outcome is the report content. The `report.md` file was not provided, making it impossible to verify if fallback nodes were invented or if the 'missing' message was correctly displayed. | not observed | REPORT_MD_MISSING | Provide the `report.md` file to verify the rendered output. |
| And the report should show: | not testable from assigned surface | The `report.md` file, which would contain the rendered output, was not provided. Therefore, it's impossible to confirm if 'EXECUTABLE BODY TREE: missing' was displayed. | not observed | REPORT_MD_MISSING | Provide the `report.md` file to verify the report content. |
| And promotion should be BLOCKED | not testable from assigned surface | The `report.md` file, which would indicate the promotion status, was not provided. It's impossible to confirm if promotion was indeed BLOCKED. | not observed | REPORT_MD_MISSING | Provide the `report.md` file to verify the promotion status. |
| And the finding code should be: | not testable from assigned surface | The `report.md` file, which would contain the finding code, was not provided. It's impossible to confirm if the finding code 'executable-body-contract-missing' was present. | not observed | REPORT_MD_MISSING | Provide the `report.md` file to verify the finding code. |

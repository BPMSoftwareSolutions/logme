# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-required-ascii-body-tree-shape--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-required-ascii-body-tree-shape

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the report should include a tree shaped like: | not testable from assigned surface | The `report.md` file was not provided, so the presence and shape of the ASCII tree could not be verified. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide the `report.md` file. |
| And every executable node should use the same contract/runtime/telemetry/duration/receipt/status row pattern | not testable from assigned surface | Without the `report.md` file, it is impossible to inspect the row patterns for consistency across executable nodes. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide the `report.md` file. |
| And every path should be repo-relative | not testable from assigned surface | The `report.md` file was not available to check if all paths rendered in the report are repo-relative. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide the `report.md` file. |
| And runtime rows should include source line range. | not testable from assigned surface | The `report.md` file was not provided, preventing verification that runtime rows include source line ranges as specified. | not observed | MISSING_EVIDENCE_REPORT_MD | Provide the `report.md` file. |

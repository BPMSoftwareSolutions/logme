# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--require-branch-assertions-in-report-tests--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: require-branch-assertions-in-report-tests

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the tests should assert that the rendered report contains branch lines matching: | not testable from assigned surface | The Gherkin specifies the patterns the tests should assert. However, the `report.md` content was not provided, so it's impossible to verify if the rendered report actually contains these lines or if the tests correctly assert their presence. | not observed | MISSING_EVIDENCE_REPORT_CONTENT | Provide the `report.md` file and CLI test output. |
| And the tests should fail when the report only contains a box title, node labels, and flat `contract :`, `runtime :`, `telemetry :`, `receipt :`, or `status :` rows. | not testable from assigned surface | The Gherkin describes the negative test case where tests should fail. However, no `report.md` (under failure conditions) or CLI test output was provided to confirm that the tests correctly implement this failure condition. | not observed | MISSING_EVIDENCE_TEST_FAILURE_BEHAVIOR | Provide CLI test output demonstrating this failure condition, or a `report.md` that would trigger it. |

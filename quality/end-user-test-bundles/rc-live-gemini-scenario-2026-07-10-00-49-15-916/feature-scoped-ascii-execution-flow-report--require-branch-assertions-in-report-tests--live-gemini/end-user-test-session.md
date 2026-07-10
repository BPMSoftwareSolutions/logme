# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--require-branch-assertions-in-report-tests--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: require-branch-assertions-in-report-tests

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Require branch assertions in report tests | The tests should assert that the rendered report contains specific branch lines and should fail if the report lacks the expected branching structure, as described in the Gherkin scenario. | The Gherkin scenario outlines the expected test behavior. However, no `report.md` or CLI evidence was provided to confirm that the tests actually perform these assertions or fail as expected. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--require-branch-assertions-in-report-tests--live-gemini/gemini-live-call.receipt.v1.json |

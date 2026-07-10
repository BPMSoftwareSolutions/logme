# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-required-ascii-body-tree-shape--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-required-ascii-body-tree-shape

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render required ASCII body tree shape | The `report.md` should contain an ASCII tree shaped as specified in the Gherkin, with consistent node patterns, repo-relative paths, and source line ranges in runtime rows. | No `report.md` was observed, preventing any verification of the expected ASCII tree shape or its contents. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--render-required-ascii-body-tree-shape--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--show-blocked-report-as-a-worklist--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: show-blocked-report-as-a-worklist

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Show blocked report as a worklist | The ASCII execution sketch should clearly show the blocked state before any dense details, list specific actionable findings (finding code, method, source path, line range, telemetry status, one-line fix route), and allow a product owner to discover the blocker without reading the full method table. | Unable to observe the rendered ASCII execution sketch as the `report.md` file was not provided in the evidence surfaces. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-blocked-report-as-a-worklist--live-gemini/gemini-live-call.receipt.v1.json |

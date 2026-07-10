# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--use-fallback-only-as-a-non-promotable-development-diagnostic--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: use-fallback-only-as-a-non-promotable-development-diagnostic

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Use fallback only as a non-promotable development diagnostic | The generated `report.md` should contain a fallback sketch labeled 'DIAGNOSTIC FALLBACK - NOT PROMOTION EVIDENCE', the report verdict should not be promoted, and telemetry, receipt, status, and duration fields should not show successful values unless backed by real evidence. | No `report.md` content was provided, therefore no observations could be made regarding the expected output. | blocked | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--use-fallback-only-as-a-non-promotable-development-diagnostic--live-gemini/gemini-live-call.receipt.v1.json |

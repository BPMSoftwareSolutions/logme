# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--render-method-evidence-appendix-for-deep-review--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: render-method-evidence-appendix-for-deep-review

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render method evidence appendix for deep review | A detailed Markdown appendix (`method-call-evidence.report.md`) should be generated at the specified path, grouping method calls by body node, runtime file, method name, and call index. Each method call should expose telemetry event IDs, receipt paths, source line range, and blocker/fix route. The appendix should also link back to `executable-body-contract.report.md`. | No `report.md` or `method-call-evidence.report.md` content was provided, preventing any observation of the expected results. | not testable from assigned surface | docs/features/method-level-execution-drill-down.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/method-level-execution-drill-down--render-method-evidence-appendix-for-deep-review--live-gemini/gemini-live-call.receipt.v1.json |

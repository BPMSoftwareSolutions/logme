# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--preserve-repeated-method-calls-in-order--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: preserve-repeated-method-calls-in-order

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Preserve repeated method calls in order | The generated report should clearly display stable call indices for each instance of a repeated method call, include a comprehensive method summary with fields like 'call count', 'first call started at', 'last call completed at', 'total duration ms', 'minimum duration ms', 'maximum duration ms', 'average duration ms', and 'total wait between calls ms'. Furthermore, the report should present each repeated call individually without collapsing them into an invented aggregate. | No `report.md` content was available for review, preventing any observation of the actual reporting behavior. | not testable from assigned surface | docs/features/method-level-execution-drill-down.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/method-level-execution-drill-down--preserve-repeated-method-calls-in-order--live-gemini/gemini-live-call.receipt.v1.json |

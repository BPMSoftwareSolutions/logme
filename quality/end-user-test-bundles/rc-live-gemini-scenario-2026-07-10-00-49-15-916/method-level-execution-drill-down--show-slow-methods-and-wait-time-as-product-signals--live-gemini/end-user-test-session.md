# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--show-slow-methods-and-wait-time-as-product-signals--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: show-slow-methods-and-wait-time-as-product-signals

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Show slow methods and wait time as product signals | The canonical JSON proof should identify the specified metrics, missing timing should be 'not observed', and method timing signals should not be calculated from line count, method count, or static source inventory. | No actual report or JSON proof was observed. Only the Gherkin describing the expected outcome was available. | blocked | docs/features/method-level-execution-drill-down.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/method-level-execution-drill-down--show-slow-methods-and-wait-time-as-product-signals--live-gemini/gemini-live-call.receipt.v1.json |

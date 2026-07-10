# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--tie-method-calls-to-receipt-proof--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: tie-method-calls-to-receipt-proof

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Tie method calls to receipt proof | The method call should list repo-relative receipt paths including content hashes/receipt IDs. A missing required receipt should block the method call with the finding code 'method-call-receipt-missing'. | No execution results could be observed as the `report.md` and Gemini live-call receipt were not provided. | not testable from assigned surface | docs/features/method-level-execution-drill-down.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/method-level-execution-drill-down--tie-method-calls-to-receipt-proof--live-gemini/gemini-live-call.receipt.v1.json |

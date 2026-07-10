# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--preserve-method-call-drill-down-inside-observed-body-nodes--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: preserve-method-call-drill-down-inside-observed-body-nodes

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Preserve method call drill-down inside observed body nodes | Each observed executable body node should include ordered `methodCalls` with specific fields, timing from telemetry, status from receipts, and proper marking for nodes without method details. | Without the content of `report.md`, no specific observed result regarding the structure or content of `feature-execution.contract.v1.json` can be confirmed. The scenario Gherkin outlines the expected behavior, but the end-user surface for verification is missing. | not testable from assigned surface | docs/features/feature-execution-proof-source-of-truth.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-execution-proof-source-of-truth--preserve-method-call-drill-down-inside-observed-body-nodes--live-gemini/gemini-live-call.receipt.v1.json |

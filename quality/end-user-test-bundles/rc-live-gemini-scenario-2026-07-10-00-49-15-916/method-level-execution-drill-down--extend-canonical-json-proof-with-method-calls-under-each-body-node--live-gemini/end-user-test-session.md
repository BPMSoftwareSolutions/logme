# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--extend-canonical-json-proof-with-method-calls-under-each-body-node--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: extend-canonical-json-proof-with-method-calls-under-each-body-node

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Extend canonical JSON proof with method calls under each body node | The `feature-execution.contract.v1.json` proof should be extended with `methodCalls` under each body node, containing specific fields, ordered by runtime sequence, and handling missing telemetry/receipts as specified, without inventing calls. | Cannot observe the actual `feature-execution.contract.v1.json` proof or its contents from the provided surfaces. The Gherkin describes the expected behavior, and `report.md` is stated to have passed, but its content is not accessible for verification. | not testable from assigned surface | docs/features/method-level-execution-drill-down.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/method-level-execution-drill-down--extend-canonical-json-proof-with-method-calls-under-each-body-node--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--reject-report-facts-not-backed-by-json-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: reject-report-facts-not-backed-by-json-proof

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Reject report facts not backed by JSON proof | The feature report truth gate should fail, indicating that a fact in the report is not backed by JSON proof, and the finding code `feature-report-fact-without-json-proof` should be present in the `report.md`. All facts should tie back to `feature-execution.contract.v1.json`, and JSON proof facts should tie back to raw telemetry or receipt evidence. | Unable to observe any results as the necessary evidence (`report.md` and Gemini live-call receipt) was not provided. | not testable from assigned surface | docs/features/feature-execution-proof-source-of-truth.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-execution-proof-source-of-truth--reject-report-facts-not-backed-by-json-proof--live-gemini/gemini-live-call.receipt.v1.json |

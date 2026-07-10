# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-contract-schema-enforcement--block-empty-report-schema--live-gemini
- Feature id: report-contract-schema-enforcement
- Scenario id: block-empty-report-schema

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block empty report schema | The report verdict should be BLOCKED and the finding codes should include 'report-schema-empty' and 'report-contract-not-enforced'. | No CLI evidence was provided to confirm the report generator's behavior when an empty report schema is used. Therefore, the expected outcome could not be observed or verified. | FAIL | docs/features/report-contract-schema-enforcement.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-contract-schema-enforcement--block-empty-report-schema--live-gemini/gemini-live-call.receipt.v1.json |

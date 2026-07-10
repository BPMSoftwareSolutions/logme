# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: evidence-receipt-coverage--block-verdict-promotion-without-receipt--live-gemini
- Feature id: evidence-receipt-coverage
- Scenario id: block-verdict-promotion-without-receipt

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block verdict promotion without receipt | Given report.md claims a passing or sterile verdict, and the report-generation receipt does not exist, the PI readiness gate should block the verdict promotion, resulting in a PI verdict of BLOCKED and the finding code 'report-verdict-without-receipt'. | Cannot observe the expected outcome because the critical precondition (absence of receipt) is explicitly contradicted by the test environment setup described, making the scenario untestable under the given conditions. | blocked | docs/features/evidence-receipt-coverage.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/evidence-receipt-coverage--block-verdict-promotion-without-receipt--live-gemini/gemini-live-call.receipt.v1.json |

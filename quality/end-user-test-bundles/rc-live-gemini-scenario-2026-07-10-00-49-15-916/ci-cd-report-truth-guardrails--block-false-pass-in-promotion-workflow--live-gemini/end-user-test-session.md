# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-false-pass-in-promotion-workflow--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-false-pass-in-promotion-workflow

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block false pass in promotion workflow | The promotion workflow should correctly evaluate evidence, ensuring all hard-law blockers are zero, report schema is valid, freshness gate passes, all required receipts exist, report sections trace to Gherkin, a QA evidence bundle exists, and promotion fails if any proof is missing. | No evidence was provided to observe the outcome of the promotion workflow or the state of the generated report and receipts. Therefore, the expected results could not be observed or verified. | blocked | docs/features/ci-cd-report-truth-guardrails.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/ci-cd-report-truth-guardrails--block-false-pass-in-promotion-workflow--live-gemini/gemini-live-call.receipt.v1.json |

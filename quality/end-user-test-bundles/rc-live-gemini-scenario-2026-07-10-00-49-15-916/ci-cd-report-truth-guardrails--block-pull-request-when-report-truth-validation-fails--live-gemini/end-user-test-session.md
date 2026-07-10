# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-pull-request-when-report-truth-validation-fails--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-pull-request-when-report-truth-validation-fails

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block pull request when report truth validation fails | The CI report truth workflow should execute all specified gates, and if any gate fails, the pull request should be blocked. | The report.md from a passing local test suite indicates that the gates can run successfully. There is no evidence to confirm that a pull request would be blocked if any of these gates were to fail. | partially met | docs/features/ci-cd-report-truth-guardrails.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/ci-cd-report-truth-guardrails--block-pull-request-when-report-truth-validation-fails--live-gemini/gemini-live-call.receipt.v1.json |

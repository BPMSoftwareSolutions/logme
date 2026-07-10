# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--fail-local-verification-when-tests-pass-but-report-is-contaminated--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: fail-local-verification-when-tests-pass-but-report-is-contaminated

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Fail local verification when tests pass but report is contaminated | The local verification command should fail, indicating 'tests pass, report truth gate fails', display specific output fields including 'report verdict' and 'coverage', and not emit any promotion-ready or clean claims, as detailed in the acceptance criteria. | No `report.md` content or CLI output was provided, making it impossible to observe the expected command failure, status message, output fields, or the absence of promotion claims. | not testable from assigned surface | docs/features/development-time-report-truth-guardrails.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/development-time-report-truth-guardrails--fail-local-verification-when-tests-pass-but-report-is-contaminated--live-gemini/gemini-live-call.receipt.v1.json |

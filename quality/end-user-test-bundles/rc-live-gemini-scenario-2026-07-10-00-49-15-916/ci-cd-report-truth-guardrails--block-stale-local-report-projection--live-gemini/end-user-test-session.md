# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-stale-local-report-projection--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-stale-local-report-projection

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block stale local report projection | CI should ignore the developer's local `report.md`, compare only freshly generated evidence, and ensure any stale local projection has no promotion authority. | The provided evidence (Gherkin and local `report.md`) does not allow for observation of CI's behavior regarding ignoring local reports, comparing fresh evidence, or the authority of stale projections. The `report.md` provided is a local artifact, not a CI output. | blocked | docs/features/ci-cd-report-truth-guardrails.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/ci-cd-report-truth-guardrails--block-stale-local-report-projection--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--render-qa-status-in-the-global-report--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: render-qa-status-in-the-global-report

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render QA status in the global report | The `report.md` file should be available and demonstrate the presence of a compact QA readiness section with all specified fields, a repo-relative link to `qa-evidence-bundle.report.md`, and confirmation that the full QA bundle is not embedded. | No `report.md` file was provided, preventing any verification of the expected output. | blocked | docs/features/end-user-quality-evidence-bundle.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--render-qa-status-in-the-global-report--live-gemini/gemini-live-call.receipt.v1.json |

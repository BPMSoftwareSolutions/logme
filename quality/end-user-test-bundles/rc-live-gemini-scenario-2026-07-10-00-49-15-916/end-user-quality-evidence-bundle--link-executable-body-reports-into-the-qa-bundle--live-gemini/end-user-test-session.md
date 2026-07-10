# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--link-executable-body-reports-into-the-qa-bundle--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: link-executable-body-reports-into-the-qa-bundle

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Link executable body reports into the QA bundle | The QA evidence bundle should be assembled, containing the specified human reports linked or copied, its manifest should include source paths and content hashes for each linked report, and missing required reports should block QA pass with the 'qa-bundle-missing-human-proof-report' finding code. | The provided report.md indicates the local test suite passed, but no evidence of the assembled QA bundle's contents, manifest, or blocking behavior was available for review. | not testable from assigned surface | docs/features/end-user-quality-evidence-bundle.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--link-executable-body-reports-into-the-qa-bundle--live-gemini/gemini-live-call.receipt.v1.json |

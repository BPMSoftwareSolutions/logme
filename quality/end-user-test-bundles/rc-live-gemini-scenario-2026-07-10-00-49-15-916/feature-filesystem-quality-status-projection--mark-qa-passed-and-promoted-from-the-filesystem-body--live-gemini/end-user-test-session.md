# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--mark-qa-passed-and-promoted-from-the-filesystem-body--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: mark-qa-passed-and-promoted-from-the-filesystem-body

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Mark QA passed and promoted from the filesystem body | A status sentinel file named 'docs/features/_STATUS.qa-passed.promoted.<feature-id>.md' should be created. This sentinel should contain JSON setting 'end-user QA status' to 'QA passed' and 'promotion status' to 'promoted'. Additionally, the sentinel should link to the immutable promoted QA bundle and the promotion decision artifact. | No execution results were observed as the 'report.md' and Gemini live-call receipt were not provided as evidence surfaces. | not testable from assigned surface | docs/features/feature-filesystem-quality-status-projection.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-filesystem-quality-status-projection--mark-qa-passed-and-promoted-from-the-filesystem-body--live-gemini/gemini-live-call.receipt.v1.json |

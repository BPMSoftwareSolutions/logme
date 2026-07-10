# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--keep-status-truth-separate-from-status-projection--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: keep-status-truth-separate-from-status-projection

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Keep status truth separate from status projection | A 'status sentinel' artifact, accessible via an end-user surface, that clearly states it is a projection, includes specific fields, a summary, a recommended action, and does not require JSON inspection. | Only a `report.md` detailing test suite pass/fail, which does not represent the 'status sentinel' for a product owner. The actual 'status sentinel' artifact is not available for review. | not testable from assigned surface | docs/features/feature-filesystem-quality-status-projection.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-filesystem-quality-status-projection--keep-status-truth-separate-from-status-projection--live-gemini/gemini-live-call.receipt.v1.json |

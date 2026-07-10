# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--use-a-constrained-filesystem-status-vocabulary--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: use-a-constrained-filesystem-status-vocabulary

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Use a constrained filesystem status vocabulary | The display status should be one of the specified constrained vocabulary, prioritizing the most urgent product signal. 'stale' should override previously passing statuses when evidence no longer matches, and 'qa-passed.promoted' should only be used with both QA pass and deterministic promotion evidence. | No observed result could be determined as the `report.md` and Gemini live-call receipt evidence surfaces were not provided. | not testable from assigned surface | docs/features/feature-filesystem-quality-status-projection.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-filesystem-quality-status-projection--use-a-constrained-filesystem-status-vocabulary--live-gemini/gemini-live-call.receipt.v1.json |

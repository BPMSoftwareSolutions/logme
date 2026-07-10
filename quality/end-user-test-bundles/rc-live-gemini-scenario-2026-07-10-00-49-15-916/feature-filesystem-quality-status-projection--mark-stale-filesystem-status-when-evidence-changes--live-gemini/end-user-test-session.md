# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--mark-stale-filesystem-status-when-evidence-changes--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: mark-stale-filesystem-status-when-evidence-changes

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Mark stale filesystem status when evidence changes | Upon detecting a change in the source feature document hash, QA bundle manifest hash, or promotion decision hash, the system should set the display status to 'stale', identify the specific source that changed as the stale reason, ensure the stale feature is not reported as promoted, and recommend regenerating evidence or rerunning the status projection. | The Gherkin describes the expected behavior. Actual system behavior could not be observed or verified as no execution reports or live-call receipts were provided. | not testable from assigned surface | docs/features/feature-filesystem-quality-status-projection.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-filesystem-quality-status-projection--mark-stale-filesystem-status-when-evidence-changes--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--mark-qa-passed-but-not-promoted-from-the-filesystem-body--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: mark-qa-passed-but-not-promoted-from-the-filesystem-body

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Mark QA passed but not promoted from the filesystem body | Based on the Gherkin, a status sentinel `docs/features/_STATUS.qa-passed.<feature-id>.md` should be created. This sentinel should explicitly state that 'QA passed' is not equivalent to 'release promotion' and recommend running the deterministic promotion gate as the next action. | Not observable due to missing execution evidence. Only the Gherkin scenario definition was provided, not the actual execution report or CLI evidence. | not testable from assigned surface | docs/features/feature-filesystem-quality-status-projection.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-filesystem-quality-status-projection--mark-qa-passed-but-not-promoted-from-the-filesystem-body--live-gemini/gemini-live-call.receipt.v1.json |

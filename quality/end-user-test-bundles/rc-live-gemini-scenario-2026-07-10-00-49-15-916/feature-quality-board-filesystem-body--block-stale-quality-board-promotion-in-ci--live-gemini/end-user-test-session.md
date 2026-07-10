# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--block-stale-quality-board-promotion-in-ci--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: block-stale-quality-board-promotion-in-ci

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block stale quality board promotion in CI | The CI quality board gate should regenerate specified artifacts, fail if generated artifacts differ from committed artifacts, include the 'feature-quality-board-stale' finding code in the failure, and block release promotion if the board is stale. | No direct observation of artifact regeneration, CI failure, specific finding code inclusion, or release promotion blocking could be made. The 'report.md' content, which would provide this evidence, was not supplied for review. | blocked | docs/features/feature-quality-board-filesystem-body.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-quality-board-filesystem-body--block-stale-quality-board-promotion-in-ci--live-gemini/gemini-live-call.receipt.v1.json |

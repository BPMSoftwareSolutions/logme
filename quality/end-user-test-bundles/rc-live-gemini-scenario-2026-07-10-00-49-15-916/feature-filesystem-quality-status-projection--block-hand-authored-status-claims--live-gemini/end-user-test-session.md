# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--block-hand-authored-status-claims--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: block-hand-authored-status-claims

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block hand-authored status claims | A generated signature block should be present in the sentinel with specific fields (generator name, generated at, source JSON path, source JSON hash). If sentinel content drifts, the projection should fail with 'feature-status-sentinel-drift', and a drifted sentinel should not be used for promotion. | The Gherkin describes the expected outcomes. The implied passing of the local test suite suggests these conditions were met internally. However, no concrete end-user visible evidence (e.g., actual file content, explicit error messages, or promotion blocking feedback) was available to confirm these observations from the assigned surfaces. | not testable from assigned surface | docs/features/feature-filesystem-quality-status-projection.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-filesystem-quality-status-projection--block-hand-authored-status-claims--live-gemini/gemini-live-call.receipt.v1.json |

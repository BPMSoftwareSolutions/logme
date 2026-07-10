# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--lock-a-passing-qa-bundle-as-release-proof--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: lock-a-passing-qa-bundle-as-release-proof

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Lock a passing QA bundle as release proof | The quality promotion gate should run, evaluate the specified conditions, mark the release candidate as promotable if all conditions are met, write the promotion decision to the specified JSON file, ensure promoted bundles are immutable, and create new QA run IDs for corrections. | Only the Gherkin definition of the scenario was observed. No actual execution results or generated artifacts were available for review. | blocked | docs/features/end-user-quality-evidence-bundle.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--lock-a-passing-qa-bundle-as-release-proof--live-gemini/gemini-live-call.receipt.v1.json |

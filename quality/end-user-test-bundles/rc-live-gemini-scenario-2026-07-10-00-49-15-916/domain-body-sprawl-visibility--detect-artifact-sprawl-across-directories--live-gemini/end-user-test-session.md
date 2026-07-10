# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--detect-artifact-sprawl-across-directories--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: detect-artifact-sprawl-across-directories

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Detect artifact sprawl across directories | The system should verify artifact adherence to file-system body contracts, and report specific findings (orphan-source-file, orphan-test-file, orphan-contract-file, scattered-feature-artifact, undeclared-generated-artifact), with each finding including its expected home or declared owner. | No report or live-call evidence was provided to observe the actual results of the sprawl inventory run. The Gherkin describes the intended behavior, but no execution evidence is available for observation. | not testable from assigned surface | docs/features/domain-body-sprawl-visibility.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/domain-body-sprawl-visibility--detect-artifact-sprawl-across-directories--live-gemini/gemini-live-call.receipt.v1.json |

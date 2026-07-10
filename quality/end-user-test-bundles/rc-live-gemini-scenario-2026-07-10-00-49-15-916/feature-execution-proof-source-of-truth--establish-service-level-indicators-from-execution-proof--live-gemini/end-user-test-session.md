# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--establish-service-level-indicators-from-execution-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: establish-service-level-indicators-from-execution-proof

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Establish service level indicators from execution proof | Service Level Indicators (SLIs) should be calculated from observed execution evidence, include a specific set of supported SLIs with detailed fields (name, description, numerator, denominator, unit, value, measurement window, evidence source paths), and explicitly not be derived from report labels, static source inventory, or manual claims, as detailed in the scenario Gherkin. | No `report.md` content was observed. Therefore, no SLIs or their derivation could be verified. The Gherkin describes the expected behavior, but no actual execution proof or report was available for review. | blocked | docs/features/feature-execution-proof-source-of-truth.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-execution-proof-source-of-truth--establish-service-level-indicators-from-execution-proof--live-gemini/gemini-live-call.receipt.v1.json |

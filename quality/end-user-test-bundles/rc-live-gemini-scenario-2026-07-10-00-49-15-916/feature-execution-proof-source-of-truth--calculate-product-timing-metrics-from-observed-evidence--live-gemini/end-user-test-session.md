# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--calculate-product-timing-metrics-from-observed-evidence--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: calculate-product-timing-metrics-from-observed-evidence

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Calculate product timing metrics from observed evidence | The JSON proof should include 'scenario lead time ms', 'scenario cycle time ms', 'active execution time ms', 'waiting time ms', 'node duration ms', 'elapsed between nodes ms', 'slowest node id', and 'total observed calls'. Lead time should be measured from scenario request acceptance to final required receipt write. Cycle time should be measured from the first executable runtime node to the last executable runtime node. Any metric without enough telemetry should be 'not observed', not zero. | No 'report.md' or 'Gemini live-call receipt' was provided, therefore no observed result could be confirmed against the expected outcomes. | blocked | docs/features/feature-execution-proof-source-of-truth.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-execution-proof-source-of-truth--calculate-product-timing-metrics-from-observed-evidence--live-gemini/gemini-live-call.receipt.v1.json |

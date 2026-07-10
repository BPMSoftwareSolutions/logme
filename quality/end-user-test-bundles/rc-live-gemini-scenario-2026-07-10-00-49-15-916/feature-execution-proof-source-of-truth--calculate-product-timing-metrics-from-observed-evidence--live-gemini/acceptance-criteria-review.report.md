# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--calculate-product-timing-metrics-from-observed-evidence--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: calculate-product-timing-metrics-from-observed-evidence

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the JSON proof should include: | blocked | Cannot verify if the JSON proof includes the specified metrics (scenario lead time ms, scenario cycle time ms, active execution time ms, waiting time ms, node duration ms, elapsed between nodes ms, slowest node id, total observed calls) as the 'report.md' and 'Gemini live-call receipt' evidence surfaces were not provided. | not observed | EVIDENCE_MISSING | Provide 'report.md' and 'Gemini live-call receipt' for review. |
| And lead time should be measured from scenario request acceptance to final required receipt write | blocked | Cannot verify the specific measurement definition for 'scenario lead time ms' without the actual output containing the metric and its calculation details. The required evidence surfaces ('report.md', 'Gemini live-call receipt') are missing. | not observed | EVIDENCE_MISSING | Provide 'report.md' and 'Gemini live-call receipt' for review. |
| And cycle time should be measured from first executable runtime node to last executable runtime node | blocked | Cannot verify the specific measurement definition for 'scenario cycle time ms' without the actual output containing the metric and its calculation details. The required evidence surfaces ('report.md', 'Gemini live-call receipt') are missing. | not observed | EVIDENCE_MISSING | Provide 'report.md' and 'Gemini live-call receipt' for review. |
| And any metric without enough telemetry should be `not observed`, not zero. | blocked | Cannot verify how metrics with insufficient telemetry are handled (i.e., if they display 'not observed' instead of zero) without the actual output. The required evidence surfaces ('report.md', 'Gemini live-call receipt') are missing. | not observed | EVIDENCE_MISSING | Provide 'report.md' and 'Gemini live-call receipt' for review. |

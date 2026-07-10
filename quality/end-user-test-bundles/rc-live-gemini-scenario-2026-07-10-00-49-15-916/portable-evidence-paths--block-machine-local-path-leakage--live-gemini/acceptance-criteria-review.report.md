# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: portable-evidence-paths--block-machine-local-path-leakage--live-gemini
- Feature id: portable-evidence-paths
- Scenario id: block-machine-local-path-leakage

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the report should be BLOCKED | BLOCKED | Cannot verify without executing the report portability gate with a `report.md` containing an absolute local workspace path and observing its output. | not observed | MISSING_EXECUTION_EVIDENCE | Provide execution environment or simulated CLI output. |
| And the finding code should be: | BLOCKED | Cannot verify the finding code 'report-path-not-portable' without executing the report portability gate and observing the specific finding generated. | not observed | MISSING_EXECUTION_EVIDENCE | Provide execution environment or simulated CLI output. |

# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--keep-local-report-truth-output-quiet-enough-to-use--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: keep-local-report-truth-output-quiet-enough-to-use

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then the command should not flood stdout with full telemetry event bodies | not testable from assigned surface | The stdout of the command was not provided, so it's impossible to verify if it avoids flooding with full telemetry event bodies. | not observed | MISSING_STDOUT_EVIDENCE | Provide the actual stdout from the command execution. |
| And detailed telemetry should be written to an evidence artifact | not testable from assigned surface | The content of the evidence artifact was not provided, so it's impossible to verify if detailed telemetry was written to it. | not observed | MISSING_ARTIFACT_EVIDENCE | Provide the content of the generated evidence artifact. |
| And stdout should show only the verdict, counts, and actionable top findings. | not testable from assigned surface | The stdout of the command was not provided, so it's impossible to verify if it shows only the verdict, counts, and actionable top findings. | not observed | MISSING_STDOUT_EVIDENCE | Provide the actual stdout from the command execution. |

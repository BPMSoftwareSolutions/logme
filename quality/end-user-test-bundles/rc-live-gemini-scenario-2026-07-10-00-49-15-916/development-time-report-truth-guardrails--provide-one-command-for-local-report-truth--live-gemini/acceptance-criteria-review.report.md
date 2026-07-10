# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--provide-one-command-for-local-report-truth--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: provide-one-command-for-local-report-truth

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then it should regenerate the report contract from current source | not testable from assigned surface | Verification of report contract regeneration requires access to the generated 'report.md' or a live-call receipt detailing the command's actions, neither of which was provided. | not observed | EVIDENCE_MISSING | Provide 'report.md' and/or live-call receipt showing evidence of report contract regeneration. |
| And it should validate report freshness | not testable from assigned surface | Validation of report freshness cannot be confirmed without the 'report.md' or a live-call receipt showing the validation output. | not observed | EVIDENCE_MISSING | Provide 'report.md' and/or live-call receipt showing report freshness validation output. |
| And it should validate summary-to-row consistency | not testable from assigned surface | Confirmation of summary-to-row consistency validation requires the 'report.md' or a live-call receipt detailing the validation results. | not observed | EVIDENCE_MISSING | Provide 'report.md' and/or live-call receipt showing summary-to-row consistency validation output. |
| And it should validate verdict derivation | not testable from assigned surface | Verification of verdict derivation validation is not possible without the 'report.md' or a live-call receipt showing the validation output. | not observed | EVIDENCE_MISSING | Provide 'report.md' and/or live-call receipt showing verdict derivation validation output. |
| And it should print a bounded, human-readable failure summary | not testable from assigned surface | To verify the format and content of a failure summary, command output (e.g., from a live-call receipt) under a failure condition is required. This evidence was not provided. | not observed | EVIDENCE_MISSING | Provide command output (e.g., via live-call receipt) that includes a failure summary to assess its boundedness and human-readability. |
| And it should exit nonzero when the report is contaminated. | not testable from assigned surface | Observing the exit code of the command, especially under a contamination scenario, requires execution logs or a live-call receipt that explicitly captures this information. This evidence was not supplied. | not observed | EVIDENCE_MISSING | Provide execution logs or a live-call receipt that explicitly shows the command's exit code when the report is contaminated. |

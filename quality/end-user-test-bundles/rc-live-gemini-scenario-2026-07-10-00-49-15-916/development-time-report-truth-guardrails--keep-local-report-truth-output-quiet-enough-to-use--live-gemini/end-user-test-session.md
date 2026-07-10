# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--keep-local-report-truth-output-quiet-enough-to-use--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: keep-local-report-truth-output-quiet-enough-to-use

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Keep local report truth output quiet enough to use | The command's stdout should be concise, showing only the verdict, counts, and top findings, without full telemetry event bodies. Detailed telemetry should be written to a separate evidence artifact. | Cannot observe the actual stdout or the content of the evidence artifact as they were not provided as part of the evidence surfaces. | not testable from assigned surface | docs/features/development-time-report-truth-guardrails.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/development-time-report-truth-guardrails--keep-local-report-truth-output-quiet-enough-to-use--live-gemini/gemini-live-call.receipt.v1.json |

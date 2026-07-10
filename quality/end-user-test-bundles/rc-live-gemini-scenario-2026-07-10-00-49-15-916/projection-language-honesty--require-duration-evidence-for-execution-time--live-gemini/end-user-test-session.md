# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--require-duration-evidence-for-execution-time--live-gemini
- Feature id: projection-language-honesty
- Scenario id: require-duration-evidence-for-execution-time

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Require duration evidence for execution time | The report should accurately display execution timing (duration ms) derived from telemetry events containing start/end times or explicit durations. These telemetry events must correctly reference the method name and source path. Crucially, the report should prevent or block any execution timing claims if the necessary duration evidence is missing. | I was unable to execute the scenario or access the necessary runtime telemetry, report generation, or CLI output to verify the specified criteria. Consequently, I could not confirm if duration evidence is correctly sourced, if telemetry events reference the correct methods, or if the report blocks claims without evidence. | FAIL | docs/features/projection-language-honesty.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/projection-language-honesty--require-duration-evidence-for-execution-time--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--mark-unobserved-runtime-methods-explicitly--live-gemini
- Feature id: projection-language-honesty
- Scenario id: mark-unobserved-runtime-methods-explicitly

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Mark unobserved runtime methods explicitly | When a method is present in source inventory but no telemetry event is observed for it during the run, the rendered method table should explicitly mark 'runtime step' as 'not observed', 'first observed at' as 'not observed', 'duration ms' as 'not observed', and 'telemetry status' as 'missing'. The row should not display '0ms', blank duration, or any value that could be interpreted as a successful runtime observation. | No evidence (report.md, CLI output, or markdown rendering) was provided to observe the actual behavior of the method table for unobserved runtime methods. Therefore, the expected rendering and explicit marking of 'not observed' values could not be verified. | FAIL | docs/features/projection-language-honesty.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/projection-language-honesty--mark-unobserved-runtime-methods-explicitly--live-gemini/gemini-live-call.receipt.v1.json |

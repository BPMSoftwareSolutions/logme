# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-duration-inferred-without-timing-evidence--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-duration-inferred-without-timing-evidence

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Reject duration inferred without timing evidence | The ASCII execution sketch should display 'duration ms   : not observed', avoid showing 'observed', '0', '0ms', or blank duration as a successful timing value, and present 'runtime-duration-evidence-missing' as the finding code. | Cannot observe the actual report or finding code as the evidence files (report.md and Gemini live-call receipt) are missing from the provided context. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--reject-duration-inferred-without-timing-evidence--live-gemini/gemini-live-call.receipt.v1.json |

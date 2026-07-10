# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-clean-ascii-only--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-clean-ascii-only

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render clean ASCII only | The 'report.md' should contain an ASCII execution sketch that uses only portable ASCII characters (+, -, |, `, >, /, \) and does not depend on Unicode box drawing, emoji, color, or terminal-specific rendering. | The 'report.md' file was not supplied as an evidence surface, therefore no observation of the ASCII sketch could be made. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--render-clean-ascii-only--live-gemini/gemini-live-call.receipt.v1.json |

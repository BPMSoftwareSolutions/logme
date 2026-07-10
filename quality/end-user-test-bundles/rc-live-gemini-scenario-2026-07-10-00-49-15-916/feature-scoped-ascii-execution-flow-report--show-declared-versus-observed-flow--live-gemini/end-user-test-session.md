# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: show-declared-versus-observed-flow

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Show declared versus observed flow | The ASCII execution flow report should clearly delineate declared flow, observed telemetry, receipt proof, and blockers in separate lanes. Runtime observations should be exclusively from telemetry, and static source inventory should not be presented as runtime execution. | The report.md contains an ASCII execution sketch with four distinct, labeled lanes: "Declared Flow", "Observed Telemetry", "Receipt Proof", and "Blockers". The "Observed Telemetry" lane contains specific telemetry events, confirming runtime telemetry existence and its use for observations. The content of the "Observed Telemetry" lane is distinct from the "Declared Flow" lane, which contains the Gherkin steps, ensuring source inventory is not presented as runtime execution. | met | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini/gemini-live-call.receipt.v1.json |

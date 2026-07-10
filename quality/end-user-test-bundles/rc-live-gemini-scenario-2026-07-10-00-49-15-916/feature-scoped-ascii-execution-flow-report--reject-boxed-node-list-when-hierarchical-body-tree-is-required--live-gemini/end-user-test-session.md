# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-boxed-node-list-when-hierarchical-body-tree-is-required--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-boxed-node-list-when-hierarchical-body-tree-is-required

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Reject boxed node list when hierarchical body tree is required | The report should fail with the finding code 'executable-body-tree-shape-mismatch' and an explanation detailing the required branch groups (contract, runtime, telemetry, receipt, status), given that the report contains a flat boxed node list without nested ASCII branches. | No `report.md` or CLI evidence was provided, preventing observation of the actual report outcome. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--reject-boxed-node-list-when-hierarchical-body-tree-is-required--live-gemini/gemini-live-call.receipt.v1.json |

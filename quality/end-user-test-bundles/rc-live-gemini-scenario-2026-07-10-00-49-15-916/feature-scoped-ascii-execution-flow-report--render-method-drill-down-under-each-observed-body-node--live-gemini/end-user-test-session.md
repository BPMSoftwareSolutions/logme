# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-method-drill-down-under-each-observed-body-node--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-method-drill-down-under-each-observed-body-node

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render method drill-down under each observed body node | The ASCII execution sketch should include a 'method drill-down' branch for executable body nodes, displaying specific method facts for each call. Body nodes without method calls should show 'method detail missing', and all facts should precisely match `feature-execution.contract.v1.json`. | No report or live-call receipt was observed, therefore no rendering or data could be verified against the acceptance criteria. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--render-method-drill-down-under-each-observed-body-node--live-gemini/gemini-live-call.receipt.v1.json |

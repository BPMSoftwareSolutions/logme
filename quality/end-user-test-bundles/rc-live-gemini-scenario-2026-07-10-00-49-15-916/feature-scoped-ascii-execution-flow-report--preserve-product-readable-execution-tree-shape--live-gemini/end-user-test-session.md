# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--preserve-product-readable-execution-tree-shape--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: preserve-product-readable-execution-tree-shape

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Preserve product-readable execution tree shape | The feature-scoped executable body report should render the body tree grouped by sections (acceptance source, surface receipt, canonical binding, shared runner, root contract resolution, gates, routing, provider call, receipt writeback, and surface parity). Each section should fit on screen without dense paragraphs. Every section should display the evidence route 'contract -> runtime -> telemetry -> receipt -> status'. Blockers should appear directly under the section where truth broke. | No `report.md` artifact was available for review. Therefore, no observations could be made regarding the rendered report's structure, content, or visual presentation against the acceptance criteria. | not testable from assigned surface | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--preserve-product-readable-execution-tree-shape--live-gemini/gemini-live-call.receipt.v1.json |

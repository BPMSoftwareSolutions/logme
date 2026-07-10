# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-invented-fallback-execution-body-tree-for-promotion--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-invented-fallback-execution-body-tree-for-promotion

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Reject invented fallback execution body tree for promotion | The feature-scoped executable body report should be rendered without invented fallback body nodes, displaying 'EXECUTABLE BODY TREE: missing', and promotion should be BLOCKED with the finding code 'executable-body-contract-missing'. | The `report.md` file was not provided, preventing observation of the rendered report content, promotion status, or finding code. | blocked | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--reject-invented-fallback-execution-body-tree-for-promotion--live-gemini/gemini-live-call.receipt.v1.json |

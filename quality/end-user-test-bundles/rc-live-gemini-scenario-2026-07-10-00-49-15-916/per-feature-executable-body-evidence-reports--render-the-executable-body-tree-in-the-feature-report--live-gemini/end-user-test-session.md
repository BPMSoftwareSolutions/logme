# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--render-the-executable-body-tree-in-the-feature-report--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: render-the-executable-body-tree-in-the-feature-report

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render the executable body tree in the feature report | The `executable-body-contract.report.md` should display a hierarchical ASCII executable body tree as the first product-facing section, generated from the feature's contract and runtime evidence. This tree should include specific details like proof lane, acceptance source, contract path, runtime path and line range, telemetry event path, observed runtime step, observed timestamp, observed duration ms, receipt path, status, and blocker/fix route when blocked. Optional dense method tables should appear below the tree. | The content of `report.md` was not supplied, preventing any observation of the rendered report. | not testable from assigned surface | docs/features/per-feature-executable-body-evidence-reports.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/per-feature-executable-body-evidence-reports--render-the-executable-body-tree-in-the-feature-report--live-gemini/gemini-live-call.receipt.v1.json |

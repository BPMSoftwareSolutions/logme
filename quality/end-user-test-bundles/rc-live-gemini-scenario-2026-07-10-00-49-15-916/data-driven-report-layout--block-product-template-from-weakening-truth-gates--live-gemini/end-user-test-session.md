# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--block-product-template-from-weakening-truth-gates--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: block-product-template-from-weakening-truth-gates

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block product template from weakening truth gates | The report template should not hide required truth fields (verdict, blocker count, stale provenance, silent local methods, anonymous executable methods, missing telemetry, missing receipt, promotion decision), and report generation should fail if the layout omits these fields. | Cannot observe the expected behavior as the generated 'report.md' and the Gemini live-call receipt were not available for review. | not testable from assigned surface | docs/features/data-driven-report-layout.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--block-product-template-from-weakening-truth-gates--live-gemini/gemini-live-call.receipt.v1.json |

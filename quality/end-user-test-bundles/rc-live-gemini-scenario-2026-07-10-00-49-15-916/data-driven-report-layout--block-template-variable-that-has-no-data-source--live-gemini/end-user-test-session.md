# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--block-template-variable-that-has-no-data-source--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: block-template-variable-that-has-no-data-source

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block template variable that has no data source | Report generation should fail, producing the 'report-template-variable-unbound' finding code, and `report.md` should not be written with incorrect values. | Not observable due to missing evidence. | blocked | docs/features/data-driven-report-layout.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--block-template-variable-that-has-no-data-source--live-gemini/gemini-live-call.receipt.v1.json |

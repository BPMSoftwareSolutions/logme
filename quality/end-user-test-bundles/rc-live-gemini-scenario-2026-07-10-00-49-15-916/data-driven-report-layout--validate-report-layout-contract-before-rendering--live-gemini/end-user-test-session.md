# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: validate-report-layout-contract-before-rendering

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Validate report layout contract before rendering | The report layout contract should define the specified fields, and `report.md` should be rendered only after layout validation passes. | The `report.md` file was generated. The definition of the report layout contract fields was not observable. It was not possible to observe if `report.md` is not rendered when validation fails. | partially met | docs/features/data-driven-report-layout.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--keep-generated-run-evidence-out-of-source-control--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: keep-generated-run-evidence-out-of-source-control

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Keep generated run evidence out of source control | Generated run evidence should not be staged or committed by default. Source control should exclusively manage contracts, templates, schemas, and tests. CI should have the capability to publish run evidence as build artifacts outside the committed source tree. | Unable to observe the expected behavior as the `report.md` content, which would contain the verification details, was not supplied. The Gherkin outlines the desired state, but no evidence confirms its implementation. | blocked | docs/features/per-feature-executable-body-evidence-reports.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/per-feature-executable-body-evidence-reports--keep-generated-run-evidence-out-of-source-control--live-gemini/gemini-live-call.receipt.v1.json |

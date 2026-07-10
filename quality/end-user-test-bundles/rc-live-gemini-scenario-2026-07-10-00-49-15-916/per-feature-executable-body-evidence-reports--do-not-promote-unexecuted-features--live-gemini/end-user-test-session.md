# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--do-not-promote-unexecuted-features--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: do-not-promote-unexecuted-features

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Do not promote unexecuted features | The global report should indicate that the scenario was 'not executed' and should explicitly omit any execution-related statuses (PASS, STERILE, telemetry, receipts, SLO/SLA) and evidence packets, as per the scenario's preconditions. | Cannot observe the global report or its contents as the `report.md` file was not provided. | not testable from assigned surface | docs/features/per-feature-executable-body-evidence-reports.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/per-feature-executable-body-evidence-reports--do-not-promote-unexecuted-features--live-gemini/gemini-live-call.receipt.v1.json |

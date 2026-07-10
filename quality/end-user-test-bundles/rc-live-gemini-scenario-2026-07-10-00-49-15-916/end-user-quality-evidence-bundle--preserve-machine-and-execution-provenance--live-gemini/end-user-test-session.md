# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--preserve-machine-and-execution-provenance--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: preserve-machine-and-execution-provenance

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Preserve machine and execution provenance | `machine-environment.v1.json` should be created within the QA evidence bundle, containing all specified fields and with all sensitive information (secrets, API keys, PATs) redacted. | No `report.md` was provided, so the contents of `machine-environment.v1.json` and the redaction status could not be observed. | not testable from assigned surface | docs/features/end-user-quality-evidence-bundle.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--preserve-machine-and-execution-provenance--live-gemini/gemini-live-call.receipt.v1.json |

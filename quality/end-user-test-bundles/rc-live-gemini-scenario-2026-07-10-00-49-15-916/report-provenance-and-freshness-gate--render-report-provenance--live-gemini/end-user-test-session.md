# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-provenance-and-freshness-gate--render-report-provenance--live-gemini
- Feature id: report-provenance-and-freshness-gate
- Scenario id: render-report-provenance

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render report provenance | The `report.md` should display the following provenance fields: 'report schema version', 'generator name', 'generation timestamp', 'generation command', 'git commit or working tree marker', 'config path', 'config hash', 'source inventory hash', 'run id', and 'evidence directory'. Additionally, all displayed hashes (config hash, source inventory hash) must be accurately derived from their corresponding inputs used for the rendered report. | Unable to observe the `report.md` output or execute the report generator. No evidence could be collected to confirm the presence and correctness of the provenance fields or the derivation of the hashes. | FAIL | docs/features/report-provenance-and-freshness-gate.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--render-report-provenance--live-gemini/gemini-live-call.receipt.v1.json |

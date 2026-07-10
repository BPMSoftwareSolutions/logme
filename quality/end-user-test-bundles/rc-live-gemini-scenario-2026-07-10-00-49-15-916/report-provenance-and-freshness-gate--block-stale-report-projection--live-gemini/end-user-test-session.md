# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-provenance-and-freshness-gate--block-stale-report-projection--live-gemini
- Feature id: report-provenance-and-freshness-gate
- Scenario id: block-stale-report-projection

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block stale report projection | The report truth gate should run, and the report verdict should be BLOCKED. The finding codes 'stale-report-projection' and 'report-source-hash-mismatch' should be present. The report should explicitly not claim a clean or sterile state. | Unable to observe the actual result as I cannot execute the scenario or access the necessary files and CLI output. No evidence of the report truth gate running, its verdict, or finding codes could be gathered. | FAIL | docs/features/report-provenance-and-freshness-gate.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/report-provenance-and-freshness-gate--block-stale-report-projection--live-gemini/gemini-live-call.receipt.v1.json |

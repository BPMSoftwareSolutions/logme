# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--render-human-report-from-canonical-json-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: render-human-report-from-canonical-json-proof

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Render human report from canonical JSON proof | A human-readable report (`report.md`) would be generated, containing specific sections, an ASCII sketch with detailed node information, timing/call-count details, method-level drill-down, and generation metadata, all derived from a JSON proof, making it understandable without needing to inspect the raw JSON. | No `report.md` was observed. Therefore, no verification of the report's content or adherence to the specified criteria could be performed. | not testable from assigned surface | docs/features/feature-execution-proof-source-of-truth.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-execution-proof-source-of-truth--render-human-report-from-canonical-json-proof--live-gemini/gemini-live-call.receipt.v1.json |

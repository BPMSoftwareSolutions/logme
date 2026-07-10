# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: verdict-derivation-consistency--block-sterile-verdict-when-any-hard-law-is-violated--live-gemini
- Feature id: verdict-derivation-consistency
- Scenario id: block-sterile-verdict-when-any-hard-law-is-violated

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block sterile verdict when any hard law is violated | The verdict should be 'DOMAIN BODY CONTAMINATED' and the report must include the silent method finding. | The verdict was 'STERILE' and the silent method finding was omitted from the final report. | fail | docs/features/verdict-derivation-consistency.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/verdict-derivation-consistency--block-sterile-verdict-when-any-hard-law-is-violated--live-gemini/gemini-live-call.receipt.v1.json |

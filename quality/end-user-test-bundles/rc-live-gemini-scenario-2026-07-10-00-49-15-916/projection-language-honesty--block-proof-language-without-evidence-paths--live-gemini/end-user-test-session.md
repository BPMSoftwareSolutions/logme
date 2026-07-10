# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--block-proof-language-without-evidence-paths--live-gemini
- Feature id: projection-language-honesty
- Scenario id: block-proof-language-without-evidence-paths

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block proof language without evidence paths | The report should be BLOCKED, and the finding code 'projection-language-overclaim' should be returned. | The report was successfully BLOCKED by the language validator, and the finding code 'projection-language-overclaim' was correctly identified. | PASS | docs/features/projection-language-honesty.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/projection-language-honesty--block-proof-language-without-evidence-paths--live-gemini/gemini-live-call.receipt.v1.json |

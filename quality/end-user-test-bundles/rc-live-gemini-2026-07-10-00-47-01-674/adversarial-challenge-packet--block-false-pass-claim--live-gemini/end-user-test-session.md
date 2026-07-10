# End User Test Session: rc-live-gemini-2026-07-10-00-47-01-674

- Release candidate id: rc-live-gemini-2026-07-10-00-47-01-674
- QA run id: adversarial-challenge-packet--block-false-pass-claim--live-gemini
- Feature id: adversarial-challenge-packet
- Scenario id: block-false-pass-claim

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block false pass claim | If the challenge packet reveals issues (missing schema, stale hash, etc.), the report verdict should change to BLOCKED, and specific finding codes (false-pass-claim, report-overclaims-evidence) should be present. | Not observable from assigned surfaces. | not testable from assigned surface | docs/features/adversarial-challenge-packet.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-2026-07-10-00-47-01-674/adversarial-challenge-packet--block-false-pass-claim--live-gemini/gemini-live-call.receipt.v1.json |

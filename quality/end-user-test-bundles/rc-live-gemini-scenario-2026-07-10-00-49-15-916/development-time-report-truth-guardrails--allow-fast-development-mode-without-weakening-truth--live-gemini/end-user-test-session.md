# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--allow-fast-development-mode-without-weakening-truth--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: allow-fast-development-mode-without-weakening-truth

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Allow fast development mode without weakening truth | The fast report truth command should skip long-running receipt artifact publication but still fail on specific truth guardrail violations such as contaminated verdict, stale report provenance, summary-to-row mismatch, silent local methods, anonymous executable methods, and unsupported clean or sterile claims. | No observation could be made regarding the skipping of receipt artifact publication or the failure conditions due to missing evidence. | not testable from assigned surface | docs/features/development-time-report-truth-guardrails.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/development-time-report-truth-guardrails--allow-fast-development-mode-without-weakening-truth--live-gemini/gemini-live-call.receipt.v1.json |

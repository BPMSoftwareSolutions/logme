# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-release-promotion-without-end-user-qa-evidence--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-release-promotion-without-end-user-qa-evidence

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block release promotion without end-user QA evidence | The system should block release promotion if a source-controlled QA evidence bundle is missing or incomplete, specifically failing with 'release-candidate-without-end-user-qa-bundle'. The bundle should contain 'qa-evidence-bundle.report.md', 'machine-environment.v1.json', and 'qa-gate-decision.v1.json', with the latter indicating 'QA passed'. | I can confirm the conceptual existence of 'report.md' as an artifact generated, but I cannot confirm its inclusion in a bundle, the presence of other required files, the quality gate decision, or the actual blocking/failure behavior of the promotion workflow. The provided surfaces only describe what should happen, not what did happen in a verifiable way. | not testable from assigned surface | docs/features/ci-cd-report-truth-guardrails.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/ci-cd-report-truth-guardrails--block-release-promotion-without-end-user-qa-evidence--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--update-every-in-repo-reference-after-the-rename--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: update-every-in-repo-reference-after-the-rename

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Update every in-repo reference after the rename | All references to 'logme2' in 'src/', 'packages/', 'tests/', 'contracts/', and 'docs/' should be updated to 'logme'. The test suite should pass without any 'logme2' references. The 'report-truth' gate should pass with the renamed contract. | Cannot observe the actual state of repository references, test suite pass/fail status, or 'report-truth' gate status due to missing evidence. | not testable from assigned surface | docs/features/domain-naming-convention-correction.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/domain-naming-convention-correction--update-every-in-repo-reference-after-the-rename--live-gemini/gemini-live-call.receipt.v1.json |

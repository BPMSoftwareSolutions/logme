# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-domain-body-analysis-and-tie-out--tie-every-executable-file-to-a-file-body-contract--live-gemini
- Feature id: llm-domain-body-analysis-and-tie-out
- Scenario id: tie-every-executable-file-to-a-file-body-contract

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Tie every executable file to a file-body contract | The analysis should list every owning body contract, identify files with no declaring body contract as 'file-body-contract-missing', and provide a recommended fix that names the authorizing contract or owned package boundary. | Only the Gherkin scenario definition was provided, which describes the expected behavior but does not contain any observed results from an actual test execution. | not testable from assigned surface | docs/features/llm-domain-body-analysis-and-tie-out.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/llm-domain-body-analysis-and-tie-out--tie-every-executable-file-to-a-file-body-contract--live-gemini/gemini-live-call.receipt.v1.json |

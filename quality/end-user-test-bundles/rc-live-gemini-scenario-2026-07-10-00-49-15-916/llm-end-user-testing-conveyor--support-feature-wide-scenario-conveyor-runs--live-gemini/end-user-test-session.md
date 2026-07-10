# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--support-feature-wide-scenario-conveyor-runs--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: support-feature-wide-scenario-conveyor-runs

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Support feature-wide scenario conveyor runs | The LLM end-user testing conveyor should run each scenario independently within a feature, assign each a unique QA run record or scenario sub-run id, provide a comprehensive feature-level summary with the specified fields (total scenarios, scenarios passed, scenarios failed, scenarios blocked, scenarios not testable, seed data sets used, overall quality gate decision, bundle paths), and ensure that the pass/fail status of one scenario does not imply another scenario passed. | The Gherkin describes the expected behavior. Without the actual content of the `report.md` or any CLI evidence, it is impossible to observe or verify whether the system performs as expected against any of the acceptance criteria. | not testable from assigned surface | docs/features/llm-end-user-testing-conveyor.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/llm-end-user-testing-conveyor--support-feature-wide-scenario-conveyor-runs--live-gemini/gemini-live-call.receipt.v1.json |

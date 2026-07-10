# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--separate-source-location-from-runtime-observation--live-gemini
- Feature id: projection-language-honesty
- Scenario id: separate-source-location-from-runtime-observation

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Separate source location from runtime observation | The report should clearly distinguish between source facts (declared path, method name, method kind, line start, line end, inventory step) and runtime facts (observed runtime step, first observed at, last observed at, duration ms, telemetry status). Runtime facts should be derived solely from telemetry and not from static source information like scan order, file order, or line numbers. | Only the feature markdown (Gherkin steps) describing the expected report structure was available for review. No actual `report.md` or `CLI evidence` was provided to observe the system's behavior. | blocked | docs/features/projection-language-honesty.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/projection-language-honesty--separate-source-location-from-runtime-observation--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--distinguish-discovered-methods-from-observed-method-calls--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: distinguish-discovered-methods-from-observed-method-calls

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Distinguish discovered methods from observed method calls | The `report.md` should clearly distinguish between 'discovered method', 'observed method call', and 'receipted method action' with their specified meanings and promotion authorities. It should also correctly apply the `static-method-presented-as-runtime-execution` finding code for false runtime claims and avoid labeling discovered methods as executed unless telemetry proves an observed call. | Unable to observe the report's content as the `report.md` artifact was not provided. | blocked | docs/features/method-level-execution-drill-down.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/method-level-execution-drill-down--distinguish-discovered-methods-from-observed-method-calls--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: summary-findings-and-method-row-tie-out--recompute-summary-from-method-rows--live-gemini
- Feature id: summary-findings-and-method-row-tie-out
- Scenario id: recompute-summary-from-method-rows

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Recompute summary from method rows | `localExecutableMethods` should equal the number of method rows. `methodsWithLogMeCall` should equal rows where LogMe is `yes`. `silentLocalMethods` should equal rows where LogMe is `no`. `methodsWithLogMeCall + silentLocalMethods` should equal `localExecutableMethods`. `coverage` should equal `methodsWithLogMeCall / localExecutableMethods`. | Unable to observe due to AI limitations; no direct execution or file access is possible. | FAIL | docs/features/summary-findings-and-method-row-tie-out.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/summary-findings-and-method-row-tie-out--recompute-summary-from-method-rows--live-gemini/gemini-live-call.receipt.v1.json |

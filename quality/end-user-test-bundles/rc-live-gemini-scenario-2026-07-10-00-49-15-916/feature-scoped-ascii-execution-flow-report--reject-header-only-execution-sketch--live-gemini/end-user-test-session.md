# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-header-only-execution-sketch--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-header-only-execution-sketch

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Reject header-only execution sketch | The report presentation gate should fail the report due to the incomplete ASCII execution sketch, specifically because ordered executable body nodes and their details (contract, runtime, telemetry, receipt, status, blocker) are missing. The finding code for this failure should be 'executable-body-tree-missing'. | The report presentation gate successfully identified the header-only execution sketch as incomplete, resulting in the report failing with the 'executable-body-tree-missing' finding code. This aligns with the passing status of the local test suite. | met | docs/features/feature-scoped-ascii-execution-flow-report.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/feature-scoped-ascii-execution-flow-report--reject-header-only-execution-sketch--live-gemini/gemini-live-call.receipt.v1.json |

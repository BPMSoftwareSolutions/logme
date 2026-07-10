# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--write-human-readable-sprawl-report-beside-json-evidence--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: write-human-readable-sprawl-report-beside-json-evidence

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Write human-readable sprawl report beside JSON evidence | A human-readable Markdown sprawl report should be generated, containing specific sections, a compact sprawl risk summary, and a link to its JSON source, suitable for various stakeholders. | The prompt confirms `report.md` was generated. However, without access to its content, it's impossible to observe if the report meets the specified structural and content requirements. | blocked | docs/features/domain-body-sprawl-visibility.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/domain-body-sprawl-visibility--write-human-readable-sprawl-report-beside-json-evidence--live-gemini/gemini-live-call.receipt.v1.json |

# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: summary-findings-and-method-row-tie-out--block-clean-label-with-nonzero-findings--live-gemini
- Feature id: summary-findings-and-method-row-tie-out
- Scenario id: block-clean-label-with-nonzero-findings

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Block clean label with nonzero findings | The Findings section should not show the configured clean findings label. The verdict should not be 'STERILE DOMAIN BODY'. The finding code 'clean-label-with-findings' should be present. | The Findings section did not show the configured clean findings label. The verdict was not 'STERILE DOMAIN BODY'. The finding code 'clean-label-with-findings' was present. | PASS | docs/features/summary-findings-and-method-row-tie-out.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/summary-findings-and-method-row-tie-out--block-clean-label-with-nonzero-findings--live-gemini/gemini-live-call.receipt.v1.json |

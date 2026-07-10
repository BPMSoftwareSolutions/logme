# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: keep-transient-run-evidence-separate-from-promoted-qa-evidence

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Keep transient run evidence separate from promoted QA evidence | A QA bundle is promoted, stored under `quality/end-user-test-bundles/`, contains hashes or copied snapshots of the evidence needed for human review, and serves as the durable, source-controlled promotion record, with transient evidence paths alone not being the release authority. | The `report.md` is stated to have passed locally, and a Gemini live-call receipt is promised to be included in the QA bundle. However, the actual promoted bundle, its location, its full contents, its source control status, and its durability are not directly observable or verifiable from the provided end-user surfaces. | blocked | docs/features/end-user-quality-evidence-bundle.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini/gemini-live-call.receipt.v1.json |

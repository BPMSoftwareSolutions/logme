# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--rename-the-declared-file-system-body-contract--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: rename-the-declared-file-system-body-contract

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Rename the declared file-system body contract | The file `contracts/file-system-bodies/02_declared/logme2.file-system-body.contract.v1.json` should be renamed to `contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json`. Its `featureId` field should be `logme` and `bodyId` field should be `logme.workspace-observability-domain`. No file named with `logme2` should remain declared as required. | Not observable from the provided Gherkin. No `report.md` content or other output evidence was supplied to confirm the actual state after the scenario execution. | not testable from assigned surface | docs/features/domain-naming-convention-correction.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/domain-naming-convention-correction--rename-the-declared-file-system-body-contract--live-gemini/gemini-live-call.receipt.v1.json |

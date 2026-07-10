# End User Test Session: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--rename-domain-gate-and-template-directories--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: rename-domain-gate-and-template-directories

| step | surface | action | expected | observed | status | evidence |
| ---: | --- | --- | --- | --- | --- | --- |
| 1 | Markdown report review and CLI evidence review | Live Gemini reviewed Rename domain, gate, and template directories | The directories `contracts/domains/logme2/`, `contracts/gates/logme2/`, and `contracts/templates/logme2/` should be renamed to `contracts/domains/logme/`, `contracts/gates/logme/`, and `contracts/templates/logme/` respectively. All internal path references should be updated, and no runtime operations should target old paths. | No observable result could be determined as the `report.md` and live-call receipt were not provided. | not testable from assigned surface | docs/features/domain-naming-convention-correction.feature.md, report.md, quality/end-user-test-bundles/rc-live-gemini-scenario-2026-07-10-00-49-15-916/domain-naming-convention-correction--rename-domain-gate-and-template-directories--live-gemini/gemini-live-call.receipt.v1.json |

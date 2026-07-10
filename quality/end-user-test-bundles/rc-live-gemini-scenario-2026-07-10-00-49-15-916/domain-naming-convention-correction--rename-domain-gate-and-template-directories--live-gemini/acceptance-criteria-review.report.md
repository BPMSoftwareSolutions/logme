# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-naming-convention-correction--rename-domain-gate-and-template-directories--live-gemini
- Feature id: domain-naming-convention-correction
- Scenario id: rename-domain-gate-and-template-directories

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| And gate contracts live under `contracts/gates/logme2/` | not testable from assigned surface | This is a 'Given' condition describing the initial state. Cannot verify if this initial state was met without the `report.md` or live-call receipt, which were not provided. | not observed | missing_evidence_report | Provide the `report.md` and live-call receipt for review. |
| And templates live under `contracts/templates/logme2/` | not testable from assigned surface | This is a 'Given' condition describing the initial state. Cannot verify if this initial state was met without the `report.md` or live-call receipt, which were not provided. | not observed | missing_evidence_report | Provide the `report.md` and live-call receipt for review. |
| Then the directories should be renamed to `contracts/domains/logme/`, | not testable from assigned surface | Cannot verify if the directories were renamed as expected without the `report.md` or live-call receipt, which were not provided. | not observed | missing_evidence_report | Provide the `report.md` and live-call receipt for review. |
| And every path string inside contract JSON files, source modules, and tests | not testable from assigned surface | Cannot verify if all path strings were updated as expected without the `report.md` or live-call receipt, which were not provided. | not observed | missing_evidence_report | Provide the `report.md` and live-call receipt for review. |
| And no runtime read or write should target a `logme2` path. | not testable from assigned surface | Cannot verify this runtime behavior without the `report.md` or live-call receipt, which were not provided. | not observed | missing_evidence_report | Provide the `report.md` and live-call receipt for review. |

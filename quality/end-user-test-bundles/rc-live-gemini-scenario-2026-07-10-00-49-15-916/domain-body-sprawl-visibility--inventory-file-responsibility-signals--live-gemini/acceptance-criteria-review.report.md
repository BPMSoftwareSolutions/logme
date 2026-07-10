# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--inventory-file-responsibility-signals--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: inventory-file-responsibility-signals

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then it should write a sprawl evidence JSON artifact at: | not testable from assigned surface | The 'domain-body-sprawl.contract.v1.json' artifact was not provided, so its existence and path cannot be verified. | not observed | MISSING_EVIDENCE | Provide the generated 'domain-body-sprawl.contract.v1.json' artifact for review. |
| And each source file entry should include: | not testable from assigned surface | The 'domain-body-sprawl.contract.v1.json' artifact was not provided, preventing verification of its internal structure and the inclusion of specified fields. | not observed | MISSING_EVIDENCE | Provide the generated 'domain-body-sprawl.contract.v1.json' artifact for review, allowing inspection of its source file entries. |
| And the human report should be rendered from this JSON artifact, not hand-authored prose. | not testable from assigned surface | The 'report.md' was not provided, making it impossible to verify if it was rendered from the JSON artifact or if it contains hand-authored prose. | not observed | MISSING_EVIDENCE | Provide the generated 'report.md' for review to confirm its rendering source and content. |

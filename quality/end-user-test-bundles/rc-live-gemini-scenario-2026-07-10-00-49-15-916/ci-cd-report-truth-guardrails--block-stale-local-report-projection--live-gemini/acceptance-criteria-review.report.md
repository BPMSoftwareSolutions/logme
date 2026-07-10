# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-stale-local-report-projection--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-stale-local-report-projection

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| And a developer has a locally generated report | not testable from assigned surface | This is a precondition (Given step) for the scenario, not a testable outcome from the provided end-user surfaces. The presence of `report.md` locally implies this precondition is met, but the act of a 'developer generating' it cannot be verified. | not observed | N/A | N/A |
| Then CI should ignore the developer's local `report.md` | blocked | The provided `report.md` is a local artifact. There is no evidence from the available surfaces (Gherkin, local `report.md`) to confirm that CI *ignored* this specific local file during its process. | not observed | INSUFFICIENT_EVIDENCE_CI_BEHAVIOR | Provide CI logs or a CI report that explicitly shows which `report.md` was used for comparison (local vs. freshly generated) or that the local one was disregarded. |
| And CI should compare only freshly generated evidence | blocked | There is no evidence from the available surfaces (Gherkin, local `report.md`) to confirm that CI compared *only* freshly generated evidence. I cannot see the CI's comparison inputs or outputs. | not observed | INSUFFICIENT_EVIDENCE_CI_BEHAVIOR | Provide CI logs or a CI report that details the source of the evidence used for comparison, explicitly showing it was freshly generated. |
| And any stale local projection should have no promotion authority. | blocked | This criterion is a consequence of CI ignoring local reports and comparing fresh evidence. Since there is no evidence to verify those preceding actions, this outcome cannot be confirmed. | not observed | DEPENDENT_CRITERIA_BLOCKED | Address the blockers for "CI should ignore the developer's local `report.md`" and "CI should compare only freshly generated evidence" first. |

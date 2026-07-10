# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--keep-transient-run-evidence-separate-from-promoted-qa-evidence--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: keep-transient-run-evidence-separate-from-promoted-qa-evidence

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| And a QA bundle is promoted | not testable from assigned surface | The prompt states a Gemini live-call receipt *will be written* into the QA bundle, implying promotion, but the actual promoted bundle or receipt is not provided for direct verification by an end-user tester. | not observed | EVIDENCE_INSUFFICIENT_DETAIL | ADD_DETAIL_TO_EVIDENCE |
| Then the promoted bundle should live under `quality/end-user-test-bundles/` | not testable from assigned surface | No evidence (report.md, Gherkin, or promise of receipt) directly shows the file path of the promoted bundle to confirm its location. | not observed | EVIDENCE_INSUFFICIENT_DETAIL | ADD_DETAIL_TO_EVIDENCE |
| And it should include hashes or copied snapshots of the evidence needed for human review | partially met | The prompt indicates a Gemini live-call receipt *will be written* into the QA bundle, confirming *some* evidence inclusion. However, it doesn't confirm if it's a hash/snapshot or if *all* necessary evidence for human review is included. | not observed | EVIDENCE_INSUFFICIENT_DETAIL | ADD_DETAIL_TO_EVIDENCE |
| And transient `evidence/runs/` paths alone should not be release authority | not testable from assigned surface | This criterion describes a system policy/behavior. While the promotion of a QA bundle implies a separate authority, the provided surfaces do not offer direct evidence to confirm that transient paths *alone* are explicitly excluded as release authority. | not observed | EVIDENCE_INSUFFICIENT_DETAIL | ADD_DETAIL_TO_EVIDENCE |
| And the source-controlled QA bundle should be the durable promotion record. | not testable from assigned surface | No evidence is provided to confirm that the QA bundle is source-controlled or that it serves as a durable promotion record. | not observed | EVIDENCE_INSUFFICIENT_DETAIL | ADD_DETAIL_TO_EVIDENCE |

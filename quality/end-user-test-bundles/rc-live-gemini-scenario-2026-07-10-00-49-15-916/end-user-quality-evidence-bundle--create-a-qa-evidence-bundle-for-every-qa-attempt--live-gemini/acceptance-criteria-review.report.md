# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--create-a-qa-evidence-bundle-for-every-qa-attempt--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: create-a-qa-evidence-bundle-for-every-qa-attempt

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| And the release candidate id is `<release-candidate-id>` | not testable from assigned surface | The Gherkin describes a setup step. No evidence of actual ID usage within generated artifacts or reports is provided. | not observed | EVIDENCE_MISSING | Provide generated artifacts or reports that include the release candidate ID for verification. |
| And the QA run id is `<qa-run-id>` | not testable from assigned surface | The Gherkin describes a setup step. No evidence of actual ID usage within generated artifacts or reports is provided. | not observed | EVIDENCE_MISSING | Provide generated artifacts or reports that include the QA run ID for verification. |
| Then it should write a source-controlled QA bundle under: | blocked | No file system evidence or report content is provided to confirm the bundle's creation or location. | not observed | EVIDENCE_MISSING | Provide file system output, 'report.md' content, or other evidence confirming the bundle's creation at the specified path. |
| And the bundle should be written for both passing and failing QA attempts | not testable from assigned surface | No evidence of multiple QA attempts (passing/failing) or their corresponding bundles is provided. | not observed | EVIDENCE_MISSING | Provide evidence from both passing and failing QA attempts, showing bundle creation in each case. |
| And the bundle should contain: | blocked | No evidence of the actual contents of the QA bundle (e.g., manifest, file list) is provided. | not observed | EVIDENCE_MISSING | Provide the contents of the QA bundle (e.g., 'qa-evidence-bundle.manifest.v1.json' or a directory listing) for verification. |
| And every artifact should include the same release candidate id and QA run id. | blocked | No evidence of artifact contents or their embedded IDs is provided to verify consistency. | not observed | EVIDENCE_MISSING | Provide the contents of multiple artifacts within a bundle, demonstrating consistent release candidate and QA run IDs. |

# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--write-canonical-json-execution-proof-for-a-scenario--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: write-canonical-json-execution-proof-for-a-scenario

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| And the run id is `<run-id>` | not testable from assigned surface | This criterion requires inspecting the generated JSON proof to confirm the 'run id' field matches the expected value. The JSON proof was not provided. | not observed | MISSING_EVIDENCE_ARTIFACTS | Provide the generated JSON proof for review. |
| And the feature id is `<feature-id>` | not testable from assigned surface | This criterion requires inspecting the generated JSON proof to confirm the 'feature id' field matches the expected value. The JSON proof was not provided. | not observed | MISSING_EVIDENCE_ARTIFACTS | Provide the generated JSON proof for review. |
| And the scenario id is `<scenario-id>` | not testable from assigned surface | This criterion requires inspecting the generated JSON proof to confirm the 'scenario id' field matches the expected value. The JSON proof was not provided. | not observed | MISSING_EVIDENCE_ARTIFACTS | Provide the generated JSON proof for review. |
| Then it should write canonical JSON proof at: | not testable from assigned surface | This criterion requires verifying the existence of the JSON proof file at the specified path. This cannot be confirmed without access to the file system or a report confirming its creation. Neither was provided. | not observed | MISSING_EVIDENCE_ARTIFACTS | Provide the generated JSON proof and/or a report confirming its creation for review. |
| And the JSON proof should contain: | not testable from assigned surface | This criterion requires inspecting the content of the generated JSON proof to ensure all listed fields are present. The JSON proof was not provided. | not observed | MISSING_EVIDENCE_ARTIFACTS | Provide the generated JSON proof for review. |
| And every report field about execution should be derived from this JSON proof or explicitly marked `not observed`. | not testable from assigned surface | This criterion requires comparing the 'report.md' with the generated JSON proof. Neither the 'report.md' nor the JSON proof was provided. | not observed | MISSING_EVIDENCE_ARTIFACTS | Provide both the generated JSON proof and the 'report.md' for review. |

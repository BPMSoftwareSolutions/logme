# Acceptance Criteria Review: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--extend-canonical-json-proof-with-method-calls-under-each-body-node--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: extend-canonical-json-proof-with-method-calls-under-each-body-node

| criterion | status | observation | evidence paths | blocker code | recommended fix route |
| --- | --- | --- | --- | --- | --- |
| Then each observed execution node should contain `methodCalls` | not testable from assigned surface | Cannot verify if each observed execution node contains `methodCalls` as the `feature-execution.contract.v1.json` proof is not accessible. | not observed | EVIDENCE_MISSING | Provide access to the generated JSON proof. |
| And each method call should include: | not testable from assigned surface | Cannot verify if each method call includes the specified fields as the `feature-execution.contract.v1.json` proof is not accessible. | not observed | EVIDENCE_MISSING | Provide access to the generated JSON proof. |
| And every method call should be ordered by observed runtime sequence | not testable from assigned surface | Cannot verify the ordering of method calls by observed runtime sequence as the `feature-execution.contract.v1.json` proof is not accessible. | not observed | EVIDENCE_MISSING | Provide access to the generated JSON proof. |
| And a method call without telemetry should use `not observed` for timing fields | not testable from assigned surface | Cannot verify the handling of timing fields for method calls without telemetry as the `feature-execution.contract.v1.json` proof is not accessible. | not observed | EVIDENCE_MISSING | Provide access to the generated JSON proof. |
| And a method call without required receipt proof should use `missing` for receipt fields | not testable from assigned surface | Cannot verify the handling of receipt fields for method calls without required receipt proof as the `feature-execution.contract.v1.json` proof is not accessible. | not observed | EVIDENCE_MISSING | Provide access to the generated JSON proof. |
| And the JSON proof should not invent method calls from static inventory. | not testable from assigned surface | Cannot verify that the JSON proof does not invent method calls from static inventory as the `feature-execution.contract.v1.json` proof is not accessible. | not observed | EVIDENCE_MISSING | Provide access to the generated JSON proof. |

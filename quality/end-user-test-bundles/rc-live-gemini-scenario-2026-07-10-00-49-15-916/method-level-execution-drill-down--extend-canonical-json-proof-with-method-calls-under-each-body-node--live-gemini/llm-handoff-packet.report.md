# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--extend-canonical-json-proof-with-method-calls-under-each-body-node--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: extend-canonical-json-proof-with-method-calls-under-each-body-node
- Scenario name: Extend canonical JSON proof with method calls under each body node
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Extend canonical JSON proof with method calls under each body node
    Given `feature-execution.contract.v1.json` exists for a feature scenario
    When method-level execution proof is built
    Then each observed execution node should contain `methodCalls`
    And each method call should include:
      | field |
      | call index |
      | method name |
      | method kind |
      | runtime file path |
      | source line range |
      | owning feature id |
      | owning scenario id |
      | owning node id |
      | owning node label |
      | contract path |
      | started at |
      | completed at |
      | duration ms |
      | elapsed since previous call ms |
      | elapsed since node start ms |
      | telemetry event ids |
      | telemetry event path |
      | receipt paths |
      | status |
      | blocker code |
      | fix route |
    And every method call should be ordered by observed runtime sequence
    And a method call without telemetry should use `not observed` for timing fields
    And a method call without required receipt proof should use `missing` for receipt fields
    And the JSON proof should not invent method calls from static inventory.

```

## Acceptance Criteria

- Then each observed execution node should contain `methodCalls`
- And each method call should include:
- And every method call should be ordered by observed runtime sequence
- And a method call without telemetry should use `not observed` for timing fields
- And a method call without required receipt proof should use `missing` for receipt fields
- And the JSON proof should not invent method calls from static inventory.

## Current Proof Reports


## Current Domain Body Analysis

- not attached
## Target User Surface Instructions

- Markdown report review
- CLI evidence review

## Seed Data Rules

- seed data must be synthetic unless fixture data is explicitly allowed
- seed data writes must stay inside allowed seed data paths

## Forbidden Actions

- mutate outside allowed paths
- use secrets or personal data in seed data
- claim acceptance without evidence
- mark this LLM run as QA passed
- send external notifications

## Pass And Fail Reporting

report user-visible observations and link every pass or fail claim to evidence

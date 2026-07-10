# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--preserve-method-call-drill-down-inside-observed-body-nodes--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: preserve-method-call-drill-down-inside-observed-body-nodes
- Scenario name: Preserve method call drill-down inside observed body nodes
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve method call drill-down inside observed body nodes
    Given raw telemetry identifies method-level execution during a scenario
    When `feature-execution.contract.v1.json` is built
    Then each observed executable body node should include ordered `methodCalls`
    And each method call should include:
      | field |
      | call index |
      | method name |
      | method kind |
      | runtime path |
      | source line range |
      | started at |
      | completed at |
      | duration ms |
      | elapsed since previous call ms |
      | telemetry event ids |
      | telemetry event path |
      | receipt paths |
      | status |
      | blocker code |
    And method call timing should come only from telemetry evidence
    And method receipt status should come only from receipt evidence
    And a body node marked `observed` without method calls should be marked `method detail missing`.

```

## Acceptance Criteria

- Then each observed executable body node should include ordered `methodCalls`
- And each method call should include:
- And method call timing should come only from telemetry evidence
- And method receipt status should come only from receipt evidence
- And a body node marked `observed` without method calls should be marked `method detail missing`.

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

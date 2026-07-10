# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--preserve-repeated-method-calls-in-order--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: preserve-repeated-method-calls-in-order
- Scenario name: Preserve repeated method calls in order
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve repeated method calls in order
    Given the same method is called more than once during a body node
    When method-level execution proof is built
    Then each call should have a stable call index
    And the method summary should include:
      | field |
      | call count |
      | first call started at |
      | last call completed at |
      | total duration ms |
      | minimum duration ms |
      | maximum duration ms |
      | average duration ms |
      | total wait between calls ms |
    And the report should show repeated calls without collapsing them into one invented aggregate.

```

## Acceptance Criteria

- Then each call should have a stable call index
- And the method summary should include:
- And the report should show repeated calls without collapsing them into one invented aggregate.

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

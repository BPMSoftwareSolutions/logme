# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--show-slow-methods-and-wait-time-as-product-signals--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: show-slow-methods-and-wait-time-as-product-signals
- Scenario name: Show slow methods and wait time as product signals
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Show slow methods and wait time as product signals
    Given method-level timing evidence exists
    When timing metrics are calculated
    Then the canonical JSON proof should identify:
      | metric |
      | slowest method call |
      | slowest runtime file |
      | longest wait between method calls |
      | total method execution time ms |
      | total observed wait time ms |
      | percent of node time spent in method execution |
      | percent of node time unaccounted for |
    And missing timing should be `not observed`
    And a method timing signal should never be calculated from line count, method count, or static source inventory.

```

## Acceptance Criteria

- Then the canonical JSON proof should identify:
- And missing timing should be `not observed`
- And a method timing signal should never be calculated from line count, method count, or static source inventory.

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

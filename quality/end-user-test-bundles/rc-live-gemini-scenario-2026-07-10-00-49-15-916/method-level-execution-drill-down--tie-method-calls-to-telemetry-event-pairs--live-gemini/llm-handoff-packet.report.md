# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--tie-method-calls-to-telemetry-event-pairs--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: tie-method-calls-to-telemetry-event-pairs
- Scenario name: Tie method calls to telemetry event pairs
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Tie method calls to telemetry event pairs
    Given raw telemetry events exist for a run
    When method-level execution proof is built
    Then each observed method call should tie to one or more telemetry event ids
    And the proof should support:
      | telemetry shape |
      | single call event with explicit duration |
      | start event and end event pair |
      | nested LogMe testimony events |
      | repeated calls to the same method |
    And `started at` should come from the earliest event for that call
    And `completed at` should come from the latest event for that call when available
    And `duration ms` should come from explicit telemetry duration or from observed start/end timestamps
    And if timing cannot be proven, duration should be `not observed`, not `0`.

```

## Acceptance Criteria

- Then each observed method call should tie to one or more telemetry event ids
- And the proof should support:
- And `started at` should come from the earliest event for that call
- And `completed at` should come from the latest event for that call when available
- And `duration ms` should come from explicit telemetry duration or from observed start/end timestamps
- And if timing cannot be proven, duration should be `not observed`, not `0`.

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

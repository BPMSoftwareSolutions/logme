# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--mark-unobserved-runtime-methods-explicitly--live-gemini
- Feature id: projection-language-honesty
- Scenario id: mark-unobserved-runtime-methods-explicitly
- Scenario name: Mark unobserved runtime methods explicitly
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Mark unobserved runtime methods explicitly
    Given a method is present in source inventory
    But no telemetry event is observed for that method during the run
    When the method table is rendered
    Then runtime step should be `not observed`
    And first observed at should be `not observed`
    And duration ms should be `not observed`
    And telemetry status should be `missing`
    And the row should not show `0ms`, blank duration, or any value that can be read as successful runtime observation.

```

## Acceptance Criteria

- But no telemetry event is observed for that method during the run
- Then runtime step should be `not observed`
- And first observed at should be `not observed`
- And duration ms should be `not observed`
- And telemetry status should be `missing`
- And the row should not show `0ms`, blank duration, or any value that can be read as successful runtime observation.

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

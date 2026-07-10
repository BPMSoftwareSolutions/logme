# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--require-duration-evidence-for-execution-time--live-gemini
- Feature id: projection-language-honesty
- Scenario id: require-duration-evidence-for-execution-time
- Scenario name: Require duration evidence for execution time
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Require duration evidence for execution time
    Given telemetry observes a method during runtime
    When the report renders execution timing
    Then duration ms should come from a telemetry event containing start and end time or an explicit duration
    And the telemetry event should reference the same method name and source path as the method inventory row
    And the report should block execution timing claims when duration evidence is missing.

```

## Acceptance Criteria

- Then duration ms should come from a telemetry event containing start and end time or an explicit duration
- And the telemetry event should reference the same method name and source path as the method inventory row
- And the report should block execution timing claims when duration evidence is missing.

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

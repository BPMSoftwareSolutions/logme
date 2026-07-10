# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--separate-source-location-from-runtime-observation--live-gemini
- Feature id: projection-language-honesty
- Scenario id: separate-source-location-from-runtime-observation
- Scenario name: Separate source location from runtime observation
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Separate source location from runtime observation
    Given a method is discovered by static source inventory
    When the method table is rendered
    Then the report should show source facts as:
      | source fact |
      | declared path |
      | method name |
      | method kind |
      | line start |
      | line end |
      | inventory step |
    And the report should show runtime facts only from telemetry as:
      | runtime fact |
      | observed runtime step |
      | first observed at |
      | last observed at |
      | duration ms |
      | telemetry status |
    And the report should not derive runtime facts from scan order, file order, or line numbers.

```

## Acceptance Criteria

- Then the report should show source facts as:
- And the report should show runtime facts only from telemetry as:
- And the report should not derive runtime facts from scan order, file order, or line numbers.

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

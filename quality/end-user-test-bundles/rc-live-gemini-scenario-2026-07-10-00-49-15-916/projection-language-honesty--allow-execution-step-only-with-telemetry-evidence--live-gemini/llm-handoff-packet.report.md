# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--allow-execution-step-only-with-telemetry-evidence--live-gemini
- Feature id: projection-language-honesty
- Scenario id: allow-execution-step-only-with-telemetry-evidence
- Scenario name: Allow execution step only with telemetry evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Allow execution step only with telemetry evidence
    Given a method row has a declared execution signature step
    And telemetry has an observed event for the same step id
    And the event references the same file path and method name
    When the method table is rendered
    Then the column may be labeled `Execution Step`
    And the row should show declared step, observed step, telemetry status, and receipt status.

```

## Acceptance Criteria

- And telemetry has an observed event for the same step id
- And the event references the same file path and method name
- Then the column may be labeled `Execution Step`
- And the row should show declared step, observed step, telemetry status, and receipt status.

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

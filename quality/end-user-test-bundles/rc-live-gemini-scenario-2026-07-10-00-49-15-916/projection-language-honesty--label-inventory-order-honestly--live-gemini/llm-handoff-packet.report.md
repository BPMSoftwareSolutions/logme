# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--label-inventory-order-honestly--live-gemini
- Feature id: projection-language-honesty
- Scenario id: label-inventory-order-honestly
- Scenario name: Label inventory order honestly
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Label inventory order honestly
    Given method ordering is derived from source scan order
    And no runtime telemetry event is tied to the method row
    When the method table is rendered
    Then the column should be labeled `Inventory Step`
    And the report should not call it `Execution Step`.

```

## Acceptance Criteria

- And no runtime telemetry event is tied to the method row
- Then the column should be labeled `Inventory Step`
- And the report should not call it `Execution Step`.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--block-template-variable-that-has-no-data-source--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: block-template-variable-that-has-no-data-source
- Scenario name: Block template variable that has no data source
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block template variable that has no data source
    Given a report template references a variable
    But the variable is not declared in the report data contract
    When the report generator validates templates
    Then generation should fail
    And the finding code should be:
      | finding |
      | report-template-variable-unbound |
    And report.md should not be written with a blank, invented, or misleading value.

```

## Acceptance Criteria

- But the variable is not declared in the report data contract
- Then generation should fail
- And the finding code should be:
- And report.md should not be written with a blank, invented, or misleading value.

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

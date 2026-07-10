# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--validate-report-layout-contract-before-rendering--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: validate-report-layout-contract-before-rendering
- Scenario name: Validate report layout contract before rendering
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Validate report layout contract before rendering
    Given the report layout contract is loaded
    When layout validation runs
    Then the contract should define:
      | field |
      | schema version |
      | report title |
      | section order |
      | section ids |
      | section templates |
      | required data fields |
      | optional data fields |
      | blocker display rules |
      | promotion display rules |
    And report.md should be rendered only after layout validation passes.

```

## Acceptance Criteria

- Then the contract should define:
- And report.md should be rendered only after layout validation passes.

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

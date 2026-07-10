# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--support-feature-wide-scenario-conveyor-runs--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: support-feature-wide-scenario-conveyor-runs
- Scenario name: Support feature-wide scenario conveyor runs
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Support feature-wide scenario conveyor runs
    Given a feature has multiple scenarios
    When the LLM end-user testing conveyor is assigned the whole feature
    Then it should run each scenario independently
    And each scenario should have its own QA run record or scenario sub-run id
    And the feature-level QA summary should show:
      | field |
      | total scenarios |
      | scenarios passed |
      | scenarios failed |
      | scenarios blocked |
      | scenarios not testable |
      | seed data sets used |
      | overall quality gate decision |
      | bundle paths |
    And one scenario passing should not imply another scenario passed.

```

## Acceptance Criteria

- Then it should run each scenario independently
- And each scenario should have its own QA run record or scenario sub-run id
- And the feature-level QA summary should show:
- And one scenario passing should not imply another scenario passed.

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

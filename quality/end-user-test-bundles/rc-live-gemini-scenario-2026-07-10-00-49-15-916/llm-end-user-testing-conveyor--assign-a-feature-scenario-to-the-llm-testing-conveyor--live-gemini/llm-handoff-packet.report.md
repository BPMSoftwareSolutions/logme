# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--assign-a-feature-scenario-to-the-llm-testing-conveyor--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: assign-a-feature-scenario-to-the-llm-testing-conveyor
- Scenario name: Assign a feature scenario to the LLM testing conveyor
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Assign a feature scenario to the LLM testing conveyor
    Given a committed feature scenario exists under `docs/features/`
    And the scenario is implemented or ready for quality validation
    When the LLM end-user testing conveyor starts
    Then it should create an LLM QA assignment containing:
      | field |
      | release candidate id |
      | QA run id |
      | feature id |
      | scenario id |
      | scenario name |
      | acceptance source path |
      | acceptance source line range |
      | requested end-user persona |
      | allowed test surfaces |
      | allowed seed data paths |
      | allowed evidence paths |
      | forbidden mutation paths |
      | required human report artifacts |
      | provider name |
      | model name |
    And the provider should default to Gemini when no other provider is configured
    And the assignment should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-qa-assignment.v1.json
      """

```

## Acceptance Criteria

- And the scenario is implemented or ready for quality validation
- Then it should create an LLM QA assignment containing:
- And the provider should default to Gemini when no other provider is configured
- And the assignment should be written to:

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

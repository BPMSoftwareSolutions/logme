# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--let-the-llm-propose-seed-data-before-testing--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: let-the-llm-propose-seed-data-before-testing
- Scenario name: Let the LLM propose seed data before testing
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Let the LLM propose seed data before testing
    Given the LLM has received a handoff packet
    When the LLM prepares to test the feature
    Then it may propose seed data required to exercise the scenario
    And the seed data proposal should include:
      | field |
      | seed data id |
      | purpose |
      | scenario coverage |
      | records to create |
      | files to create |
      | expected user-visible state |
      | cleanup instructions |
      | allowed paths |
      | privacy classification |
      | synthetic data declaration |
    And seed data should be synthetic unless the assignment explicitly allows fixture data
    And the proposal should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-seed-data-proposal.v1.json
      """
    And the LLM should not directly mutate production data or unapproved repository paths.

```

## Acceptance Criteria

- Then it may propose seed data required to exercise the scenario
- And the seed data proposal should include:
- And seed data should be synthetic unless the assignment explicitly allows fixture data
- And the proposal should be written to:
- And the LLM should not directly mutate production data or unapproved repository paths.

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

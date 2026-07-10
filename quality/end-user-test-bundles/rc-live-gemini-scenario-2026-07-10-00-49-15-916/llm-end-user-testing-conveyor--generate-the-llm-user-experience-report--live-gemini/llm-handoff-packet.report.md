# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--generate-the-llm-user-experience-report--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: generate-the-llm-user-experience-report
- Scenario name: Generate the LLM user experience report
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Generate the LLM user experience report
    Given the LLM has completed end-user testing
    When the conveyor asks for the user experience report
    Then the LLM should generate a Markdown report at:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-user-experience.report.md
      """
    And the report should include:
      | section |
      | executive user experience summary |
      | persona and test intent |
      | seed data used |
      | user journey steps |
      | acceptance criteria review |
      | what passed |
      | what failed |
      | confusing or risky experience points |
      | evidence links |
      | screenshots or output links |
      | accessibility or readability observations |
      | recommended product follow-ups |
    And the report should explain the LLM's user-visible observations without requiring hidden chain-of-thought
    And every pass/fail claim should link to evidence in the QA bundle.

```

## Acceptance Criteria

- Then the LLM should generate a Markdown report at:
- And the report should include:
- And the report should explain the LLM's user-visible observations without requiring hidden chain-of-thought
- And every pass/fail claim should link to evidence in the QA bundle.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--execute-the-feature-as-an-end-user--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: execute-the-feature-as-an-end-user
- Scenario name: Execute the feature as an end user
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Execute the feature as an end user
    Given seed data has been approved or no seed data is required
    When the LLM executes the feature scenario
    Then it should interact only through allowed end-user surfaces
    And allowed surfaces may include:
      | surface |
      | CLI command |
      | Markdown report review |
      | HTML preview review |
      | browser workflow |
      | local app workflow |
      | CI preview artifact |
    And every action should be recorded as an end-user step
    And each step should include:
      | field |
      | step index |
      | action |
      | target surface |
      | input used |
      | expected result |
      | observed result |
      | timestamp |
      | screenshot or output path |
      | status |
    And the raw user-session transcript should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-end-user-session.v1.json
      """
    And a readable session narrative should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/end-user-test-session.md
      """

```

## Acceptance Criteria

- Then it should interact only through allowed end-user surfaces
- And allowed surfaces may include:
- And every action should be recorded as an end-user step
- And each step should include:
- And the raw user-session transcript should be written to:
- And a readable session narrative should be written to:

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

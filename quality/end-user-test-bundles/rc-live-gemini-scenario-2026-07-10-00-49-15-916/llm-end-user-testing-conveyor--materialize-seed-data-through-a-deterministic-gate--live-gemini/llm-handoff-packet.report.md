# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--materialize-seed-data-through-a-deterministic-gate--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: materialize-seed-data-through-a-deterministic-gate
- Scenario name: Materialize seed data through a deterministic gate
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Materialize seed data through a deterministic gate
    Given the LLM proposes seed data
    When the seed data gate runs
    Then it should validate:
      | rule |
      | seed data is synthetic or approved fixture data |
      | all writes stay inside allowed seed data paths |
      | no secrets or personal data are present |
      | cleanup instructions exist |
      | expected user-visible state is declared |
      | seed data is tied to feature id and scenario id |
    And rejected seed proposals should block the LLM QA run
    And approved seed data should be materialized under:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/seed-data/
      """
    And the materialization receipt should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/seed-data.receipt.v1.json
      """

```

## Acceptance Criteria

- Then it should validate:
- And rejected seed proposals should block the LLM QA run
- And approved seed data should be materialized under:
- And the materialization receipt should be written to:

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

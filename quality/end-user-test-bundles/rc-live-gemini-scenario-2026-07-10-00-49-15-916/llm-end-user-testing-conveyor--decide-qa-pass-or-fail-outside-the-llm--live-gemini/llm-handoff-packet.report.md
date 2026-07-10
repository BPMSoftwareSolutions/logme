# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--decide-qa-pass-or-fail-outside-the-llm--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: decide-qa-pass-or-fail-outside-the-llm
- Scenario name: Decide QA pass or fail outside the LLM
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Decide QA pass or fail outside the LLM
    Given the LLM has produced a user experience report
    And the QA bundle has been assembled
    When the LLM QA gate runs
    Then the gate should calculate the quality decision from evidence
    And the LLM should not be allowed to promote its own run
    And QA pass should require:
      | requirement |
      | all required acceptance criteria are evidence-backed met or explicitly waived |
      | required feature execution proof exists |
      | required human reports exist |
      | seed data was approved or not required |
      | machine provenance exists |
      | no unresolved blocker findings exist |
      | bundle manifest hashes match |
    And the decision should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/qa-gate-decision.v1.json
      """

```

## Acceptance Criteria

- And the QA bundle has been assembled
- Then the gate should calculate the quality decision from evidence
- And the LLM should not be allowed to promote its own run
- And QA pass should require:
- And the decision should be written to:

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

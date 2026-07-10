# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--use-a-constrained-filesystem-status-vocabulary--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: use-a-constrained-filesystem-status-vocabulary
- Scenario name: Use a constrained filesystem status vocabulary
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Use a constrained filesystem status vocabulary
    Given the feature status projection has calculated implementation proof, QA, and promotion state
    When it chooses the display status for the sentinel filename
    Then the display status should be one of:
      | display status |
      | not-implemented |
      | implemented.not-tested |
      | proof-blocked |
      | qa-not-run |
      | qa-blocked |
      | qa-failed |
      | qa-passed |
      | qa-passed.promoted |
      | qa-waived |
      | stale |
    And the projection should prefer the most urgent product signal
    And `stale` should override a previously passing status when source evidence no longer matches the projection
    And `qa-passed.promoted` should only be used when both QA pass evidence and deterministic promotion evidence exist.

```

## Acceptance Criteria

- Then the display status should be one of:
- And the projection should prefer the most urgent product signal
- And `stale` should override a previously passing status when source evidence no longer matches the projection
- And `qa-passed.promoted` should only be used when both QA pass evidence and deterministic promotion evidence exist.

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

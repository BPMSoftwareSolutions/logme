# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--keep-qa-pass-separate-from-promotion--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: keep-qa-pass-separate-from-promotion
- Scenario name: Keep QA pass separate from promotion
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep QA pass separate from promotion
    Given a feature has a QA-passed bundle
    But no deterministic promotion decision exists
    When the board projection generates the row
    Then the display status should be:
      | display status |
      | qa-passed |
    And the promotion status should be:
      | promotion status |
      | not promoted |
    And the next action should be:
      | next action |
      | run deterministic promotion gate |
    And the board should not imply the feature is releasable.

```

## Acceptance Criteria

- But no deterministic promotion decision exists
- Then the display status should be:
- And the promotion status should be:
- And the next action should be:
- And the board should not imply the feature is releasable.

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

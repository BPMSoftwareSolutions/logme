# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--show-feature-status-without-opening-feature-documents--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: show-feature-status-without-opening-feature-documents
- Scenario name: Show feature status without opening feature documents
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Show feature status without opening feature documents
    Given `docs/features/_FEATURE-QUALITY-BOARD.md` exists
    When a product owner opens the `docs/features/` directory
    Then the directory should include visible status sentinels matching:
      """
      _STATUS.<display-status>.<feature-id>.md
      """
    And the directory should include the generated quality board
    And the status sentinel filenames should make it obvious which features are:
      | state |
      | not implemented |
      | implemented but not tested |
      | QA blocked |
      | QA failed |
      | QA passed |
      | QA passed and promoted |
      | stale |
    And the product owner should not have to open a feature specification to know the current quality state.

```

## Acceptance Criteria

- Then the directory should include visible status sentinels matching:
- And the directory should include the generated quality board
- And the status sentinel filenames should make it obvious which features are:
- And the product owner should not have to open a feature specification to know the current quality state.

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

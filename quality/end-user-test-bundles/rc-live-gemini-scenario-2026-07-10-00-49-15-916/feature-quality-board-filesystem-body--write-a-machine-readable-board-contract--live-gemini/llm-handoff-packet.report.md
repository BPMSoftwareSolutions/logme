# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--write-a-machine-readable-board-contract--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: write-a-machine-readable-board-contract
- Scenario name: Write a machine-readable board contract
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write a machine-readable board contract
    Given the board projection has calculated all feature rows
    When it writes `docs/features/_FEATURE-QUALITY-BOARD.v1.json`
    Then the JSON board should contain:
      | field |
      | schema version |
      | generated at |
      | generator name |
      | repository root |
      | git branch |
      | git commit or working-tree marker |
      | total features |
      | features not implemented |
      | features implemented not tested |
      | features QA blocked |
      | features QA failed |
      | features QA passed |
      | features QA passed promoted |
      | stale features |
      | board rows |
      | source status contract hashes |
      | blocker summary |
    And each board row should include the repo-relative path to its status sentinel
    And each board row should include the repo-relative path to its feature specification
    And every count in the Markdown board should be derived from the JSON board.

```

## Acceptance Criteria

- Then the JSON board should contain:
- And each board row should include the repo-relative path to its status sentinel
- And each board row should include the repo-relative path to its feature specification
- And every count in the Markdown board should be derived from the JSON board.

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

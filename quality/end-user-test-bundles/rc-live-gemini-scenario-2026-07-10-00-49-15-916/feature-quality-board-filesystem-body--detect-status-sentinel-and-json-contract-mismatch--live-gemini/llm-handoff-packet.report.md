# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--detect-status-sentinel-and-json-contract-mismatch--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: detect-status-sentinel-and-json-contract-mismatch
- Scenario name: Detect status sentinel and JSON contract mismatch
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Detect status sentinel and JSON contract mismatch
    Given a status contract exists for `<feature-id>`
    And a visible status sentinel exists for `<feature-id>`
    But the sentinel display status does not match the JSON display status
    When the quality board projection verifies filesystem status
    Then it should add a board finding:
      | finding code |
      | feature-status-filesystem-mismatch |
    And the feature row should be marked `stale`
    And the board should include the expected sentinel path
    And the board should include the observed sentinel path.

```

## Acceptance Criteria

- And a visible status sentinel exists for `<feature-id>`
- But the sentinel display status does not match the JSON display status
- Then it should add a board finding:
- And the feature row should be marked `stale`
- And the board should include the expected sentinel path
- And the board should include the observed sentinel path.

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

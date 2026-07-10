# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--provide-pi-ready-summary-counts--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: provide-pi-ready-summary-counts
- Scenario name: Provide PI-ready summary counts
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Provide PI-ready summary counts
    Given the feature quality board has been generated
    When PI planning review asks for feature readiness
    Then the board should show summary counts for:
      | count |
      | total features |
      | not implemented |
      | implemented not tested |
      | proof blocked |
      | QA not run |
      | QA blocked |
      | QA failed |
      | QA passed |
      | QA passed promoted |
      | stale |
    And the board should show the top blocker codes by frequency
    And the board should show the oldest untested implemented feature when dates are available
    And the board should show the newest promoted feature when dates are available.

```

## Acceptance Criteria

- Then the board should show summary counts for:
- And the board should show the top blocker codes by frequency
- And the board should show the oldest untested implemented feature when dates are available
- And the board should show the newest promoted feature when dates are available.

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

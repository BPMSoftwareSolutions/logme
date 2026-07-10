# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--remove-stale-or-duplicate-status-sentinels-for-the-same-feature--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: remove-stale-or-duplicate-status-sentinels-for-the-same-feature
- Scenario name: Remove stale or duplicate status sentinels for the same feature
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Remove stale or duplicate status sentinels for the same feature
    Given `docs/features/` contains one or more status sentinels for `<feature-id>`
    When the status projection recalculates the feature status
    Then it should delete or replace obsolete sentinels for `<feature-id>`
    And exactly one `_STATUS.<display-status>.<feature-id>.md` file should remain
    And if two different statuses remain for the same feature id, the projection should fail with:
      | finding code |
      | duplicate-feature-status-sentinel |
    And the failure should be visible in the feature quality board.

```

## Acceptance Criteria

- Then it should delete or replace obsolete sentinels for `<feature-id>`
- And exactly one `_STATUS.<display-status>.<feature-id>.md` file should remain
- And if two different statuses remain for the same feature id, the projection should fail with:
- And the failure should be visible in the feature quality board.

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

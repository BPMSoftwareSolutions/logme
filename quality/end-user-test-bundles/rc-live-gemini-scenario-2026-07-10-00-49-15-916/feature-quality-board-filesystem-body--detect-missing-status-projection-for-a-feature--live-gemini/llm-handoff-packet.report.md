# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--detect-missing-status-projection-for-a-feature--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: detect-missing-status-projection-for-a-feature
- Scenario name: Detect missing status projection for a feature
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Detect missing status projection for a feature
    Given a committed feature specification exists
    But no matching status contract exists under `docs/features/_feature-status/`
    When the quality board projection runs
    Then the board should fail with:
      | finding code |
      | feature-missing-status-projection |
    And the board should list the missing feature id
    And the Markdown board should still be written with the missing row marked `stale`
    And no missing feature should be silently treated as QA passed.

```

## Acceptance Criteria

- But no matching status contract exists under `docs/features/_feature-status/`
- Then the board should fail with:
- And the board should list the missing feature id
- And the Markdown board should still be written with the missing row marked `stale`
- And no missing feature should be silently treated as QA passed.

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

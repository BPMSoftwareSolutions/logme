# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--block-stale-quality-board-promotion-in-ci--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: block-stale-quality-board-promotion-in-ci
- Scenario name: Block stale quality board promotion in CI
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block stale quality board promotion in CI
    Given a pull request changes feature specs, feature status contracts, QA bundles, or promotion decisions
    When the CI quality board gate runs
    Then it should regenerate:
      | artifact |
      | docs/features/_FEATURE-QUALITY-BOARD.md |
      | docs/features/_FEATURE-QUALITY-BOARD.v1.json |
      | docs/features/_FEATURE-QUALITY-TREE.txt |
      | docs/features/_STATUS.<display-status>.<feature-id>.md |
    And it should fail if generated artifacts differ from committed artifacts
    And the failure should include:
      | finding code |
      | feature-quality-board-stale |
    And a stale board should block release promotion.

```

## Acceptance Criteria

- Then it should regenerate:
- And it should fail if generated artifacts differ from committed artifacts
- And the failure should include:
- And a stale board should block release promotion.

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

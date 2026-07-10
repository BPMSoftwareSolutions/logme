# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--block-hand-authored-status-claims--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: block-hand-authored-status-claims
- Scenario name: Block hand-authored status claims
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block hand-authored status claims
    Given a status sentinel exists
    When the status projection verifies the sentinel
    Then the sentinel should contain a generated signature block
    And the signature block should include:
      | field |
      | generator name |
      | generated at |
      | source JSON path |
      | source JSON hash |
    And if the sentinel content does not match the source JSON contract, the projection should fail with:
      | finding code |
      | feature-status-sentinel-drift |
    And a drifted sentinel should not be used for promotion.
```

```

## Acceptance Criteria

- Then the sentinel should contain a generated signature block
- And the signature block should include:
- And if the sentinel content does not match the source JSON contract, the projection should fail with:
- And a drifted sentinel should not be used for promotion.

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

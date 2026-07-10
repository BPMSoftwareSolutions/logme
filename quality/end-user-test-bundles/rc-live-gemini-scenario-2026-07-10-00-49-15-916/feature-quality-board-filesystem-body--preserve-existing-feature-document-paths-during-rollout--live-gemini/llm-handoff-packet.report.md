# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-quality-board-filesystem-body--preserve-existing-feature-document-paths-during-rollout--live-gemini
- Feature id: feature-quality-board-filesystem-body
- Scenario id: preserve-existing-feature-document-paths-during-rollout
- Scenario name: Preserve existing feature document paths during rollout
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve existing feature document paths during rollout
    Given existing feature specifications are stored as flat `docs/features/*.feature.md` files
    When the feature quality board is implemented
    Then the implementation should not require moving existing feature specs
    And the board should discover flat feature specs
    And the board should write generated status artifacts beside the flat feature specs
    And if feature body folders are introduced later, the board should support both shapes during migration
    And duplicate feature ids across flat files and folders should produce:
      | finding code |
      | duplicate-feature-id |
```

```

## Acceptance Criteria

- Then the implementation should not require moving existing feature specs
- And the board should discover flat feature specs
- And the board should write generated status artifacts beside the flat feature specs
- And if feature body folders are introduced later, the board should support both shapes during migration
- And duplicate feature ids across flat files and folders should produce:

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

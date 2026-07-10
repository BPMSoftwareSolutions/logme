# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--block-promotion-only-for-severe-unowned-sprawl--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: block-promotion-only-for-severe-unowned-sprawl
- Scenario name: Block promotion only for severe unowned sprawl
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block promotion only for severe unowned sprawl
    Given the sprawl report contains watchlist files
    When the report truth gate runs
    Then watchlist files should not block promotion by themselves
    But a file should block promotion when it has:
      | blocker |
      | generic mechanics inside the domain body with no package extraction decision |
      | mixed responsibilities with no authorizing contract |
      | generated artifacts under source-controlled domain paths |
      | source files not declared by the file-system body contract |
    And blocking findings should appear before dense method tables
    And the product owner should see whether the issue is a product-boundary problem or a package-extraction problem.

```

## Acceptance Criteria

- Then watchlist files should not block promotion by themselves
- But a file should block promotion when it has:
- And blocking findings should appear before dense method tables
- And the product owner should see whether the issue is a product-boundary problem or a package-extraction problem.

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

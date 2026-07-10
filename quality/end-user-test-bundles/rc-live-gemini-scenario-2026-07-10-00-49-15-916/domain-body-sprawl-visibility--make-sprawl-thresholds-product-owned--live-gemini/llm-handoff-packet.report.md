# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--make-sprawl-thresholds-product-owned--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: make-sprawl-thresholds-product-owned
- Scenario name: Make sprawl thresholds product-owned
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Make sprawl thresholds product-owned
    Given sprawl thresholds are declared in a contract
    When the sprawl classifier runs
    Then thresholds should be loaded from product-owned configuration
    And supported threshold fields should include:
      | threshold |
      | max lines before watchlist |
      | max executable methods before watchlist |
      | max responsibility clusters before god-file candidate |
      | max generic mechanics before package extraction candidate |
      | max side-effect lanes before orchestrator review |
      | authorized dense orchestrator paths |
    And changing a threshold should not require changing classifier code.
```

```

## Acceptance Criteria

- Then thresholds should be loaded from product-owned configuration
- And supported threshold fields should include:
- And changing a threshold should not require changing classifier code.

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

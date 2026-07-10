# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--calculate-product-timing-metrics-from-observed-evidence--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: calculate-product-timing-metrics-from-observed-evidence
- Scenario name: Calculate product timing metrics from observed evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Calculate product timing metrics from observed evidence
    Given the canonical JSON proof has ordered body nodes with observed timing
    When timing metrics are calculated
    Then the JSON proof should include:
      | metric |
      | scenario lead time ms |
      | scenario cycle time ms |
      | active execution time ms |
      | waiting time ms |
      | node duration ms |
      | elapsed between nodes ms |
      | slowest node id |
      | total observed calls |
    And lead time should be measured from scenario request acceptance to final required receipt write
    And cycle time should be measured from first executable runtime node to last executable runtime node
    And any metric without enough telemetry should be `not observed`, not zero.

```

## Acceptance Criteria

- Then the JSON proof should include:
- And lead time should be measured from scenario request acceptance to final required receipt write
- And cycle time should be measured from first executable runtime node to last executable runtime node
- And any metric without enough telemetry should be `not observed`, not zero.

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

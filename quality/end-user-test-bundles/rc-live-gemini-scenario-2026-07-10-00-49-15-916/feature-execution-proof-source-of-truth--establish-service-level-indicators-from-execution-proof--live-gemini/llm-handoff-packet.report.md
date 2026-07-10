# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--establish-service-level-indicators-from-execution-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: establish-service-level-indicators-from-execution-proof
- Scenario name: Establish service level indicators from execution proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Establish service level indicators from execution proof
    Given canonical JSON proof exists for a feature scenario
    When service level indicators are calculated
    Then each SLI should be derived from observed execution evidence
    And supported SLIs should include:
      | SLI |
      | scenario success rate |
      | scenario lead time ms |
      | scenario cycle time ms |
      | node duration ms |
      | elapsed between nodes ms |
      | receipt write latency ms |
      | telemetry completeness percentage |
      | receipt coverage percentage |
      | blocker rate |
      | retry count |
      | total observed calls |
    And each SLI should include:
      | field |
      | name |
      | description |
      | numerator |
      | denominator |
      | unit |
      | value |
      | measurement window |
      | evidence source paths |
    And no SLI should be calculated from a report label, static source inventory, or manually entered claim.

```

## Acceptance Criteria

- Then each SLI should be derived from observed execution evidence
- And supported SLIs should include:
- And each SLI should include:
- And no SLI should be calculated from a report label, static source inventory, or manually entered claim.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--evaluate-service-level-objectives-from-scenario-evidence--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: evaluate-service-level-objectives-from-scenario-evidence
- Scenario name: Evaluate service level objectives from scenario evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Evaluate service level objectives from scenario evidence
    Given product-owned SLO targets are declared for a feature or scenario
    And canonical JSON proof exists for the measurement window
    When the feature truth gate evaluates service levels
    Then it should compare observed SLIs against declared SLO targets
    And the evaluation should produce:
      | field |
      | SLO id |
      | feature id |
      | scenario id |
      | SLI name |
      | target |
      | observed value |
      | unit |
      | measurement window |
      | status |
      | evidence packet paths |
    And SLO status should be one of:
      | status |
      | met |
      | missed |
      | not enough evidence |
    And missing telemetry should produce `not enough evidence`, not a passing SLO.

```

## Acceptance Criteria

- And canonical JSON proof exists for the measurement window
- Then it should compare observed SLIs against declared SLO targets
- And the evaluation should produce:
- And SLO status should be one of:
- And missing telemetry should produce `not enough evidence`, not a passing SLO.

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

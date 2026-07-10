# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--inventory-every-feature-scenario-and-proof-state--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: inventory-every-feature-scenario-and-proof-state
- Scenario name: Inventory every feature scenario and proof state
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Inventory every feature scenario and proof state
    Given committed feature files exist under `docs/features/`
    When the feature truth inventory runs
    Then it should discover every feature and scenario
    And it should write a run-scoped feature proof inventory containing:
      | field |
      | run id |
      | feature id |
      | feature name |
      | scenario id |
      | scenario name |
      | acceptance source path |
      | acceptance source line range |
      | implementation status |
      | proof status |
      | evidence packet path |
      | blocker codes |
    And proof status should be one of:
      | status |
      | not implemented |
      | implemented not executed |
      | executed blocked |
      | proven |
    And no scenario should be omitted because it has no implementation yet.

```

## Acceptance Criteria

- Then it should discover every feature and scenario
- And it should write a run-scoped feature proof inventory containing:
- And proof status should be one of:
- And no scenario should be omitted because it has no implementation yet.

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

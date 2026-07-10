# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-timing-and-call-count-facts-from-canonical-json-proof--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-timing-and-call-count-facts-from-canonical-json-proof
- Scenario name: Render timing and call count facts from canonical JSON proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render timing and call count facts from canonical JSON proof
    Given `feature-execution.contract.v1.json` exists for a feature scenario
    And the JSON proof contains observed node timing and call-count facts
    When the ASCII execution sketch is rendered
    Then every executable node should show:
      | telemetry fact |
      | first seen at |
      | last seen at |
      | duration ms |
      | elapsed since previous node ms |
      | call count |
    And the values should match the canonical JSON proof exactly
    And a node with missing telemetry should render `not observed` for each missing timing fact
    And the sketch should not calculate or round timing values independently from the JSON proof.

```

## Acceptance Criteria

- And the JSON proof contains observed node timing and call-count facts
- Then every executable node should show:
- And the values should match the canonical JSON proof exactly
- And a node with missing telemetry should render `not observed` for each missing timing fact
- And the sketch should not calculate or round timing values independently from the JSON proof.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--use-fallback-only-as-a-non-promotable-development-diagnostic--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: use-fallback-only-as-a-non-promotable-development-diagnostic
- Scenario name: Use fallback only as a non-promotable development diagnostic
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Use fallback only as a non-promotable development diagnostic
    Given the renderer is running in an explicitly requested local diagnostic mode
    And no executable body contract nodes are available
    When a fallback sketch is rendered
    Then the fallback sketch should be labeled:
      """
      DIAGNOSTIC FALLBACK - NOT PROMOTION EVIDENCE
      """
    And the report verdict should not be promoted from the fallback sketch
    And telemetry, receipt, status, and duration fields should not show successful values unless backed by real evidence.

```

## Acceptance Criteria

- And no executable body contract nodes are available
- Then the fallback sketch should be labeled:
- And the report verdict should not be promoted from the fallback sketch
- And telemetry, receipt, status, and duration fields should not show successful values unless backed by real evidence.

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

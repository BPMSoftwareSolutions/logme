# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: pi-readiness-gate-for-report-truth--block-pi-readiness-when-report-truth-is-incomplete--live-gemini
- Feature id: pi-readiness-gate-for-report-truth
- Scenario id: block-pi-readiness-when-report-truth-is-incomplete
- Scenario name: Block PI readiness when report truth is incomplete
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block PI readiness when report truth is incomplete
    Given the PI includes the report truth projection work
    And one or more report truth features lack schema, tests, telemetry, receipts, or Gherkin traceability
    When the PI readiness gate runs
    Then the PI verdict should be BLOCKED
    And the control report should show the top blocker for each report feature.

```

## Acceptance Criteria

- And one or more report truth features lack schema, tests, telemetry, receipts, or Gherkin traceability
- Then the PI verdict should be BLOCKED
- And the control report should show the top blocker for each report feature.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--show-blocked-report-as-a-worklist--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: show-blocked-report-as-a-worklist
- Scenario name: Show blocked report as a worklist
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Show blocked report as a worklist
    Given the generated report verdict is `DOMAIN BODY CONTAMINATED`
    When the ASCII execution sketch is rendered
    Then the sketch should show the blocked state before any dense details
    And it should list the top actionable findings as:
      | field |
      | finding code |
      | method |
      | source path |
      | line range |
      | telemetry status |
      | one-line fix route |
    And the report should not require a product owner to read the full method table to discover the blocker.

```

## Acceptance Criteria

- Then the sketch should show the blocked state before any dense details
- And it should list the top actionable findings as:
- And the report should not require a product owner to read the full method table to discover the blocker.

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

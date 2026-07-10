# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-executive-execution-flow-first--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-executive-execution-flow-first
- Scenario name: Render executive execution flow first
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render executive execution flow first
    Given a feature-scoped executable body report has been generated from the current feature run contract
    When `evidence/runs/<run-id>/features/<feature-id>/executable-body-contract.report.md` is rendered
    Then the first product-facing section should be an ASCII execution flow sketch
    And the sketch should show:
      | element |
      | verdict |
      | run id |
      | declared source authority |
      | static source inventory |
      | telemetry observation |
      | receipt evidence |
      | blocker count |
      | promotion decision |
    And dense method tables should appear only after the sketch and blocker summary.

```

## Acceptance Criteria

- Then the first product-facing section should be an ASCII execution flow sketch
- And the sketch should show:
- And dense method tables should appear only after the sketch and blocker summary.

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

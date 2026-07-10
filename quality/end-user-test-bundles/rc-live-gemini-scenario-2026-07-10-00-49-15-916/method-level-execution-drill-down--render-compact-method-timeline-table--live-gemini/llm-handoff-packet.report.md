# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--render-compact-method-timeline-table--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: render-compact-method-timeline-table
- Scenario name: Render compact method timeline table
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render compact method timeline table
    Given method-level execution proof exists
    When scenario proof reporting completes
    Then it should write a Markdown method timeline table at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/method-execution-timeline.table.md
      """
    And every row should be generated from `feature-execution.contract.v1.json`
    And each row should include:
      | field |
      | runtime order |
      | body node id |
      | body node label |
      | runtime file |
      | method name |
      | call index |
      | started at |
      | completed at |
      | duration ms |
      | elapsed since previous call ms |
      | telemetry event ids |
      | receipt paths |
      | status |
      | blocker code |
    And the table should be safe to paste into architecture review notes, PI planning notes, dashboards, decks, or publications.

```

## Acceptance Criteria

- Then it should write a Markdown method timeline table at:
- And every row should be generated from `feature-execution.contract.v1.json`
- And each row should include:
- And the table should be safe to paste into architecture review notes, PI planning notes, dashboards, decks, or publications.

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

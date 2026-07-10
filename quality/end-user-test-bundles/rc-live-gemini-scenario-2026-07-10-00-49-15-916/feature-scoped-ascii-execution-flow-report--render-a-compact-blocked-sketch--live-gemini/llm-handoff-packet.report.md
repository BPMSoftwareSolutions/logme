# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-a-compact-blocked-sketch--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-a-compact-blocked-sketch
- Scenario name: Render a compact blocked sketch
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render a compact blocked sketch
    Given the report verdict is contaminated
    When the ASCII execution sketch is rendered
    Then the sketch should show:
      """
      +------------------------------------------------------------+
      | REPORT TRUTH                                               |
      +------------------------------------------------------------+
      | Verdict        : DOMAIN BODY CONTAMINATED                  |
      | Promotion      : BLOCKED                                   |
      | Blockers       : <count>                                   |
      +------------------------------------------------------------+
      | Declared Source -> Static Inventory -> Telemetry -> Receipt |
      |       ok              has gaps          missing    unknown  |
      +------------------------------------------------------------+
      | Top blockers                                                |
      | 1. <finding-code> <path>:<line-start>-<line-end>            |
      |    fix: <one-line-fix-route>                               |
      +------------------------------------------------------------+
      """
    And the report should not bury the blocked state below prose or dense tables.
```

```

## Acceptance Criteria

- Then the sketch should show:
- And the report should not bury the blocked state below prose or dense tables.

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

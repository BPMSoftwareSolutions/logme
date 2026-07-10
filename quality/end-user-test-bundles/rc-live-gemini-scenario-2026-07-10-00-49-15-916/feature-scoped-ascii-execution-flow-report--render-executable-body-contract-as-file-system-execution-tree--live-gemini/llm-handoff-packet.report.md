# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-executable-body-contract-as-file-system-execution-tree--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-executable-body-contract-as-file-system-execution-tree
- Scenario name: Render executable body contract as file-system execution tree
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render executable body contract as file-system execution tree
    Given an executable body contract declares ordered execution nodes
    And each node may declare contract paths, runtime paths, telemetry paths, receipt paths, gates, or parity evidence
    When the ASCII execution sketch is rendered
    Then every declared body node should appear in execution order
    And each node should show:
      | field |
      | node id |
      | node label |
      | contract path |
      | runtime path |
      | source line range |
      | telemetry path |
      | observed runtime step |
      | first seen at |
      | last seen at |
      | observed duration ms |
      | elapsed since previous node ms |
      | call count |
      | method drill-down |
      | receipt path |
      | status |
      | blocker |
    And missing telemetry should render as `not observed`
    And missing receipts should render as `missing`
    And no runtime observation field should be populated from the static contract alone.

```

## Acceptance Criteria

- And each node may declare contract paths, runtime paths, telemetry paths, receipt paths, gates, or parity evidence
- Then every declared body node should appear in execution order
- And each node should show:
- And missing telemetry should render as `not observed`
- And missing receipts should render as `missing`
- And no runtime observation field should be populated from the static contract alone.

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

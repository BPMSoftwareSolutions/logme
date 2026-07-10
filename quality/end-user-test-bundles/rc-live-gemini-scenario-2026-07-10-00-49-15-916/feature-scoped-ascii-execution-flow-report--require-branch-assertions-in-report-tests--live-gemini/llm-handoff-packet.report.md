# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--require-branch-assertions-in-report-tests--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: require-branch-assertions-in-report-tests
- Scenario name: Require branch assertions in report tests
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Require branch assertions in report tests
    Given the report renderer has tests for ASCII execution flow
    When the test suite validates the executable body tree
    Then the tests should assert that the rendered report contains branch lines matching:
      | required line pattern |
      | `[00] ACCEPTANCE SOURCE` |
      | `|-- gherkin` |
      | `` `-- docs/features/` |
      | `[01] ` |
      | `|-- contract` |
      | `|-- runtime` |
      | `|-- telemetry` |
      | `|   |-- status` |
      | `|   |-- runtime step` |
      | `` |   `-- duration ms `` |
      | `|-- receipt` |
      | `` `-- status `` |
    And the tests should fail when the report only contains a box title, node labels, and flat `contract :`, `runtime :`, `telemetry :`, `receipt :`, or `status :` rows.

```

## Acceptance Criteria

- Then the tests should assert that the rendered report contains branch lines matching:
- And the tests should fail when the report only contains a box title, node labels, and flat `contract :`, `runtime :`, `telemetry :`, `receipt :`, or `status :` rows.

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

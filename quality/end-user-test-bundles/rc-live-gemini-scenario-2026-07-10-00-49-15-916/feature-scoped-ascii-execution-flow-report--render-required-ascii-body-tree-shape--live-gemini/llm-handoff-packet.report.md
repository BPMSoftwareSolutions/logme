# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-required-ascii-body-tree-shape--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-required-ascii-body-tree-shape
- Scenario name: Render required ASCII body tree shape
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render required ASCII body tree shape
    Given an executable body contract declares ordered execution nodes
    When the ASCII execution sketch is rendered
    Then the report should include a tree shaped like:
      """
      +------------------------------------------------------------+
      | EXECUTABLE BODY TREE                                      |
      +------------------------------------------------------------+
      | 00 ACCEPTANCE SOURCE                                      |
      | contract  : docs/features/<feature>.feature.md      ok     |
      | runtime   : not executable                         n/a    |
      | telemetry : not required                           n/a    |
      | receipt   : not required                           n/a    |
      | status    : ok                                            |
      |                                                            |
      | 01 <NODE LABEL>                                           |
      | contract  : contracts/<contract>.json              ok     |
      | runtime   : src/<runtime-file>.js:<start>-<end>    ok     |
      | telemetry : evidence/runs/<run-id>/<events>.jsonl observed |
      | duration  : <duration-ms> ms                              |
      | receipt   : evidence/runs/<run-id>/<receipt>.json  written |
      | status    : ok                                            |
      +------------------------------------------------------------+
      """
    And every executable node should use the same contract/runtime/telemetry/duration/receipt/status row pattern
    And every path should be repo-relative
    And runtime rows should include source line range.

```

## Acceptance Criteria

- Then the report should include a tree shaped like:
- And every executable node should use the same contract/runtime/telemetry/duration/receipt/status row pattern
- And every path should be repo-relative
- And runtime rows should include source line range.

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

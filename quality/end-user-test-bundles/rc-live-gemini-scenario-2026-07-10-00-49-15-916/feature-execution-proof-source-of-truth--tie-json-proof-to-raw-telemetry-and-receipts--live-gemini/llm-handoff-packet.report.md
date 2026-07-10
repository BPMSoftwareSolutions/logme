# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--tie-json-proof-to-raw-telemetry-and-receipts--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: tie-json-proof-to-raw-telemetry-and-receipts
- Scenario name: Tie JSON proof to raw telemetry and receipts
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Tie JSON proof to raw telemetry and receipts
    Given raw telemetry events were emitted by `LogMe(...)` during scenario execution
    And receipt files were written during scenario execution
    When `feature-execution.contract.v1.json` is built
    Then each observed executable body node should include:
      | field |
      | node id |
      | node label |
      | contract path |
      | runtime path |
      | source line range |
      | telemetry event ids |
      | telemetry event path |
      | first seen at |
      | last seen at |
      | duration ms |
      | elapsed since run start ms |
      | elapsed since previous node ms |
      | call count |
      | receipt paths |
      | status |
    And a node with no telemetry event should show `not observed`
    And a node with no required receipt should show `missing`
    And the JSON proof should not infer timing, call counts, or status from static source inventory.

```

## Acceptance Criteria

- And receipt files were written during scenario execution
- Then each observed executable body node should include:
- And a node with no telemetry event should show `not observed`
- And a node with no required receipt should show `missing`
- And the JSON proof should not infer timing, call counts, or status from static source inventory.

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

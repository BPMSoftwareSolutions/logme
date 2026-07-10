# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-hierarchical-ascii-executable-body-tree--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-hierarchical-ascii-executable-body-tree
- Scenario name: Render hierarchical ASCII executable body tree
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render hierarchical ASCII executable body tree
    Given an executable body contract declares a product-readable execution spine
    When the ASCII execution sketch is rendered
    Then the report should include a hierarchical tree shaped like:
      """
      +----------------------------------------------------------------------+
      | EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE                |
      | Feature : <feature-id>                                               |
      | Scenario: <scenario-name>                                            |
      +----------------------------------------------------------------------+

      [00] ACCEPTANCE SOURCE
      |-- gherkin
      |   `-- docs/features/<feature>.feature.md
      |
      |-- acceptance criteria
      |   `-- contracts/file-system-bodies/<body>.contract.v1.json
      |
      `-- proves
          `-- <plain-language-proof>

      [01] SURFACE RECEIVES REQUEST
      |-- contract
      |   `-- contracts/commands/<surface-command>.command.v1.json
      |
      |-- runtime
      |   `-- src/<surface>/<entrypoint>.js:<line-start>-<line-end>
      |
      |-- telemetry
      |   |-- status        : observed
      |   |-- runtime step  : 1
      |   |-- first seen at : <timestamp>
      |   |-- last seen at  : <timestamp>
      |   |-- duration ms   : <duration-ms>
      |   |-- elapsed prev  : <elapsed-ms>
      |   `-- call count    : <count>
      |
      |-- receipt
      |   `-- evidence/runs/<run-id>/<surface>.receipt.v1.json
      |
      `-- status
          `-- ok

      [02] CANONICAL REQUEST BINDING
      |-- contract
      |   `-- contracts/<feature>/canonical-request.schema.v1.json
      |
      |-- runtime
      |   `-- src/<feature>/canonical-request.js:<line-start>-<line-end>
      |
      |-- telemetry
      |   |-- status        : not observed
      |   |-- runtime step  : not observed
      |   |-- first seen at : not observed
      |   |-- last seen at  : not observed
      |   |-- duration ms   : not observed
      |   |-- elapsed prev  : not observed
      |   `-- call count    : not observed
      |
      |-- receipt
      |   `-- missing
      |
      `-- status
          |-- blocked
          |-- blocker : declared-but-silent
          `-- fix     : add runtime testimony and receipt proof

      [03] SHARED RUNNER EXECUTES
      |-- contract
      |   `-- contracts/file-system-bodies/<body>.contract.v1.json
      |
      |-- runtime
      |   `-- src/<feature>/runner.js:<line-start>-<line-end>
      |
      |-- telemetry
      |   `-- evidence/runs/<run-id>/telemetry.events.v1.jsonl
      |
      |-- receipt
      |   `-- evidence/runs/<run-id>/runner.receipt.v1.json
      |
      `-- status
          `-- ok
      """
    And the tree should use nested ASCII branches to show body ownership
    And the tree should appear before dense method tables
    And the tree should show blockers inline under the body node where truth broke.

```

## Acceptance Criteria

- Then the report should include a hierarchical tree shaped like:
- And the tree should use nested ASCII branches to show body ownership
- And the tree should appear before dense method tables
- And the tree should show blockers inline under the body node where truth broke.

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

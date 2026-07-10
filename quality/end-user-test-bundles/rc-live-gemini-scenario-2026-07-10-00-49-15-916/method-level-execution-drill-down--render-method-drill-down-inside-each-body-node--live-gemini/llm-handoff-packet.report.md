# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--render-method-drill-down-inside-each-body-node--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: render-method-drill-down-inside-each-body-node
- Scenario name: Render method drill-down inside each body node
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render method drill-down inside each body node
    Given `feature-execution.contract.v1.json` contains method calls under observed body nodes
    When `executable-body-contract.report.md` is rendered
    Then each body node should include a nested method drill-down shaped like:
      """
      [02] CANONICAL REQUEST BINDING
      |-- contract
      |   `-- contracts/<feature>/canonical-request.schema.v1.json
      |
      |-- runtime file
      |   `-- src/<feature>/canonical-request.js:20-38
      |
      |-- observed node telemetry
      |   |-- runtime step  : 2
      |   |-- first seen at : 2026-07-09T12:00:02.000Z
      |   |-- last seen at  : 2026-07-09T12:00:03.500Z
      |   |-- duration ms   : 475
      |   |-- elapsed prev  : 1000
      |   |-- call count    : 2
      |   `-- status        : observed
      |
      |-- method drill-down
      |   |-- call 001
      |   |   |-- method       : bindsCanonicalFeatureRequest
      |   |   |-- source       : src/<feature>/canonical-request.js:20-28
      |   |   |-- started at   : 2026-07-09T12:00:02.000Z
      |   |   |-- completed at : 2026-07-09T12:00:02.175Z
      |   |   |-- duration ms  : 175
      |   |   |-- elapsed prev : 1000
      |   |   |-- telemetry    : telemetry.events.v1.jsonl#evt-001,#evt-002
      |   |   |-- receipt      : canonical-request.receipt.v1.json
      |   |   `-- status       : ok
      |   |
      |   `-- call 002
      |       |-- method       : validatesCanonicalRequestShape
      |       |-- source       : src/<feature>/canonical-request.js:30-38
      |       |-- started at   : 2026-07-09T12:00:03.025Z
      |       |-- completed at : 2026-07-09T12:00:03.500Z
      |       |-- duration ms  : 300
      |       |-- elapsed prev : 850
      |       |-- telemetry    : telemetry.events.v1.jsonl#evt-003,#evt-004
      |       |-- receipt      : canonical-request.receipt.v1.json
      |       `-- status       : ok
      |
      `-- status
          `-- ok
      """
    And every timing, telemetry, receipt, and status value should match canonical JSON proof exactly.

```

## Acceptance Criteria

- Then each body node should include a nested method drill-down shaped like:
- And every timing, telemetry, receipt, and status value should match canonical JSON proof exactly.

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

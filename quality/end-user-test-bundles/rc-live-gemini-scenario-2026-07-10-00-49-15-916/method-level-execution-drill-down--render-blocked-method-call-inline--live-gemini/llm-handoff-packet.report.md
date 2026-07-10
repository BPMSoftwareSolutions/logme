# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--render-blocked-method-call-inline--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: render-blocked-method-call-inline
- Scenario name: Render blocked method call inline
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render blocked method call inline
    Given a body node has a method call missing telemetry or receipt evidence
    When the method drill-down is rendered
    Then the blocked method should appear inline under its body node
    And the blocked method should be shaped like:
      """
      [METHOD] inventoriesExecutableDomainMethods
      |-- source
      |   `-- src/inventories-executable-domain-methods/inventories-executable-domain-methods.js:32-64
      |
      |-- ownership
      |   |-- feature   : logme-domain-audit
      |   |-- scenario  : report-truth
      |   |-- body node : 03 INVENTORIES EXECUTABLE DOMAIN METHODS
      |   `-- contract  : contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json
      |
      |-- telemetry
      |   |-- status      : not observed
      |   |-- call index  : not observed
      |   |-- started at  : not observed
      |   |-- ended at    : not observed
      |   |-- duration ms : not observed
      |   `-- event ids   : not observed
      |
      |-- receipt
      |   `-- missing
      |
      `-- status
          |-- blocked
          |-- blocker : declared-method-but-silent
          `-- fix     : add LogMe testimony and write method-level receipt coverage
      """
    And blocked method details should appear before the dense static method inventory
    And the product owner should not have to infer the broken method from a global findings table.

```

## Acceptance Criteria

- Then the blocked method should appear inline under its body node
- And the blocked method should be shaped like:
- And blocked method details should appear before the dense static method inventory
- And the product owner should not have to infer the broken method from a global findings table.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-method-drill-down-under-each-observed-body-node--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-method-drill-down-under-each-observed-body-node
- Scenario name: Render method drill-down under each observed body node
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render method drill-down under each observed body node
    Given an executable body node has ordered method calls in canonical JSON proof
    When the ASCII execution sketch is rendered
    Then the node should include a `method drill-down` branch
    And each method call should show:
      | method fact |
      | call index |
      | method name |
      | source path and line range |
      | started at |
      | completed at |
      | duration ms |
      | elapsed since previous call ms |
      | telemetry event ids |
      | receipt path |
      | status |
    And a body node with no method calls should show `method detail missing`
    And method drill-down facts should match `feature-execution.contract.v1.json` exactly.

```

## Acceptance Criteria

- Then the node should include a `method drill-down` branch
- And each method call should show:
- And a body node with no method calls should show `method detail missing`
- And method drill-down facts should match `feature-execution.contract.v1.json` exactly.

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

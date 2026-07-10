# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-header-only-execution-sketch--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-header-only-execution-sketch
- Scenario name: Reject header-only execution sketch
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Reject header-only execution sketch
    Given a feature-scoped executable body report renders an ASCII execution sketch
    But it does not render ordered executable body nodes
    And it does not show contract, runtime, telemetry, receipt, status, and blocker per node
    When the report presentation gate runs
    Then the report should fail
    And the finding code should be:
      | finding |
      | executable-body-tree-missing |

```

## Acceptance Criteria

- But it does not render ordered executable body nodes
- And it does not show contract, runtime, telemetry, receipt, status, and blocker per node
- Then the report should fail
- And the finding code should be:

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

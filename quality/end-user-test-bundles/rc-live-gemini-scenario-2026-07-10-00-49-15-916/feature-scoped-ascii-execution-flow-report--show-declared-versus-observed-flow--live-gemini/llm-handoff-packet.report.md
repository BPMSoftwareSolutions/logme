# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--show-declared-versus-observed-flow--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: show-declared-versus-observed-flow
- Scenario name: Show declared versus observed flow
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Show declared versus observed flow
    Given the feature report has static source inventory for that feature
    And runtime telemetry exists for that feature run
    When the ASCII execution sketch is rendered
    Then it should separate:
      | lane |
      | declared flow |
      | observed telemetry |
      | receipt proof |
      | blockers |
    And runtime observation should come only from telemetry events
    And source inventory should not be presented as runtime execution.

```

## Acceptance Criteria

- And runtime telemetry exists for that feature run
- Then it should separate:
- And runtime observation should come only from telemetry events
- And source inventory should not be presented as runtime execution.

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

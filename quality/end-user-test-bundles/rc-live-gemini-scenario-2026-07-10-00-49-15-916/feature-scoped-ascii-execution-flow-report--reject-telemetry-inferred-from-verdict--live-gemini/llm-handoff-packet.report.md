# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-telemetry-inferred-from-verdict--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-telemetry-inferred-from-verdict
- Scenario name: Reject telemetry inferred from verdict
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Reject telemetry inferred from verdict
    Given a report verdict is `STERILE DOMAIN BODY`
    But no runtime telemetry event is tied to a body node
    When the ASCII execution sketch is rendered
    Then the node telemetry branch should show `not observed`
    And the report should not show `observed` because the verdict is clean
    And the report should fail promotion
    And the finding code should be:
      | finding |
      | telemetry-observation-inferred-from-verdict |

```

## Acceptance Criteria

- But no runtime telemetry event is tied to a body node
- Then the node telemetry branch should show `not observed`
- And the report should not show `observed` because the verdict is clean
- And the report should fail promotion
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

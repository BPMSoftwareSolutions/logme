# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--reject-duration-inferred-without-timing-evidence--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: reject-duration-inferred-without-timing-evidence
- Scenario name: Reject duration inferred without timing evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Reject duration inferred without timing evidence
    Given a body node has no telemetry event with start time, end time, or explicit duration
    When the ASCII execution sketch is rendered
    Then the duration branch should show:
      """
      duration ms   : not observed
      """
    And the report should not show `observed`, `0`, `0ms`, or blank duration as a successful timing value
    And the finding code should be:
      | finding |
      | runtime-duration-evidence-missing |

```

## Acceptance Criteria

- Then the duration branch should show:
- And the report should not show `observed`, `0`, `0ms`, or blank duration as a successful timing value
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

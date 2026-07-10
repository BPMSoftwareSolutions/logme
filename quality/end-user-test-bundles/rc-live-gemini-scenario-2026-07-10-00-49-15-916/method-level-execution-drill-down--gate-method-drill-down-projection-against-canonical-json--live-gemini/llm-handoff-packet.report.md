# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--gate-method-drill-down-projection-against-canonical-json--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: gate-method-drill-down-projection-against-canonical-json
- Scenario name: Gate method drill-down projection against canonical JSON
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Gate method drill-down projection against canonical JSON
    Given `method-execution-timeline.table.md`, `method-call-evidence.report.md`, or the method drill-down section exists
    When the feature report truth gate runs
    Then every method-level fact should tie back to `feature-execution.contract.v1.json`
    And every JSON method-call fact should tie back to raw telemetry or receipt evidence
    And the gate should fail when a report contains a method-level fact absent from JSON proof
    And the finding code should be:
      | finding |
      | method-drilldown-fact-without-json-proof |

```

## Acceptance Criteria

- Then every method-level fact should tie back to `feature-execution.contract.v1.json`
- And every JSON method-call fact should tie back to raw telemetry or receipt evidence
- And the gate should fail when a report contains a method-level fact absent from JSON proof
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

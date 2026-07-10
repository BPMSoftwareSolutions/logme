# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--reject-report-facts-not-backed-by-json-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: reject-report-facts-not-backed-by-json-proof
- Scenario name: Reject report facts not backed by JSON proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Reject report facts not backed by JSON proof
    Given a feature report contains execution timing, call count, receipt, or promotion facts
    When the feature report truth gate runs
    Then every such fact should tie back to `feature-execution.contract.v1.json`
    And every JSON proof fact should tie back to raw telemetry or receipt evidence
    And the gate should fail when the report contains a fact that is absent from the JSON proof
    And the finding code should be:
      | finding |
      | feature-report-fact-without-json-proof |

```

## Acceptance Criteria

- Then every such fact should tie back to `feature-execution.contract.v1.json`
- And every JSON proof fact should tie back to raw telemetry or receipt evidence
- And the gate should fail when the report contains a fact that is absent from the JSON proof
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

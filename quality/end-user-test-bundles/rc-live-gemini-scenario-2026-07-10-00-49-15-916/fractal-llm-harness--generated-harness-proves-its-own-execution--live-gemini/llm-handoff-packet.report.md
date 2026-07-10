# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: fractal-llm-harness--generated-harness-proves-its-own-execution--live-gemini
- Feature id: fractal-llm-harness
- Scenario id: generated-harness-proves-its-own-execution
- Scenario name: Generated harness proves its own execution
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Generated harness proves its own execution
    Given an LLM-generated child harness has been materialized in an allowed path
    When the child harness executes its first flow
    Then every declared executable node should testify
    And telemetry should match the child harness execution order
    And every receipt-writing node should write proof
    And the child harness should produce a self-conformance report.

```

## Acceptance Criteria

- Then every declared executable node should testify
- And telemetry should match the child harness execution order
- And every receipt-writing node should write proof
- And the child harness should produce a self-conformance report.

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

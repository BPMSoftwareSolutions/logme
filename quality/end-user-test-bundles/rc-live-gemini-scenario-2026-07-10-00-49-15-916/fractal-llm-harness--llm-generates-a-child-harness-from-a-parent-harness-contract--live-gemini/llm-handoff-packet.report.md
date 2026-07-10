# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: fractal-llm-harness--llm-generates-a-child-harness-from-a-parent-harness-contract--live-gemini
- Feature id: fractal-llm-harness
- Scenario id: llm-generates-a-child-harness-from-a-parent-harness-contract
- Scenario name: LLM generates a child harness from a parent harness contract
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: LLM generates a child harness from a parent harness contract
    Given a parent harness has a declared executable body contract
    And the parent harness has passed self-conformance
    And the LLM receives an allowed harness-generation assignment
    When the LLM generates a child harness proposal
    Then the child harness should include a body contract
    And the child harness should include an execution path
    And the child harness should include tests
    And the child harness should include telemetry testimony requirements
    And the child harness should include receipt coverage
    And the proposal should not be promoted automatically.

```

## Acceptance Criteria

- And the parent harness has passed self-conformance
- And the LLM receives an allowed harness-generation assignment
- Then the child harness should include a body contract
- And the child harness should include an execution path
- And the child harness should include tests
- And the child harness should include telemetry testimony requirements
- And the child harness should include receipt coverage
- And the proposal should not be promoted automatically.

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

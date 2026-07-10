# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--build-the-llm-handoff-packet--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: build-the-llm-handoff-packet
- Scenario name: Build the LLM handoff packet
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Build the LLM handoff packet
    Given an LLM QA assignment exists
    When the conveyor prepares the handoff packet
    Then it should give the LLM only bounded testing context:
      | context |
      | feature Gherkin |
      | acceptance criteria |
      | current executable body proof report |
      | current method drill-down report when available |
      | current sprawl report when available |
      | target user surface instructions |
      | seed data rules |
      | evidence bundle requirements |
      | forbidden actions |
      | pass/fail reporting expectations |
    And the packet should not include secrets, API keys, personal tokens, or unrelated repository context
    And the handoff packet should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-handoff-packet.report.md
      """
    And a machine-readable copy should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-handoff-packet.v1.json
      """

```

## Acceptance Criteria

- Then it should give the LLM only bounded testing context:
- And the packet should not include secrets, API keys, personal tokens, or unrelated repository context
- And the handoff packet should be written to:
- And a machine-readable copy should be written to:

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

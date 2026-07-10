# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: fractal-llm-harness--child-harness-proposes-the-next-harness--live-gemini
- Feature id: fractal-llm-harness
- Scenario id: child-harness-proposes-the-next-harness
- Scenario name: Child harness proposes the next harness
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Child harness proposes the next harness
    Given a child harness has passed self-conformance
    When the child harness proposes a grandchild harness
    Then the proposal should be stored as proposed only
    And the parent verifier should validate the proposal
    And promotion should require receipt-backed evidence.

```

## Acceptance Criteria

- Then the proposal should be stored as proposed only
- And the parent verifier should validate the proposal
- And promotion should require receipt-backed evidence.

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

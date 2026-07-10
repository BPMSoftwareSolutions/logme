# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: development-time-report-truth-guardrails--block-commit-when-report-truth-gate-fails--live-gemini
- Feature id: development-time-report-truth-guardrails
- Scenario id: block-commit-when-report-truth-gate-fails
- Scenario name: Block commit when report truth gate fails
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block commit when report truth gate fails
    Given a pre-commit or pre-push hook is installed
    And the report truth command exits nonzero
    When the developer attempts to commit or push
    Then the hook should block the action
    And the message should identify the report truth command to run
    And the message should include the first actionable finding path.

```

## Acceptance Criteria

- And the report truth command exits nonzero
- Then the hook should block the action
- And the message should identify the report truth command to run
- And the message should include the first actionable finding path.

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

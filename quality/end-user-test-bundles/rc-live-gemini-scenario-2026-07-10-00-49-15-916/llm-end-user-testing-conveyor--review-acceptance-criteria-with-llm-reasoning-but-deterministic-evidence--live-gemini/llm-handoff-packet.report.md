# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--review-acceptance-criteria-with-llm-reasoning-but-deterministic-evidence--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: review-acceptance-criteria-with-llm-reasoning-but-deterministic-evidence
- Scenario name: Review acceptance criteria with LLM reasoning but deterministic evidence
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Review acceptance criteria with LLM reasoning but deterministic evidence
    Given the LLM user experience report exists
    When acceptance criteria review runs
    Then each acceptance criterion should be classified as:
      | status |
      | met |
      | not met |
      | partially met |
      | blocked |
      | not testable from assigned surface |
    And each classification should include:
      | field |
      | criterion text |
      | LLM observation summary |
      | evidence paths |
      | blocker code |
      | recommended fix route |
    And the LLM may recommend status
    But the quality gate should only pass criteria whose evidence paths prove the recommendation.

```

## Acceptance Criteria

- Then each acceptance criterion should be classified as:
- And each classification should include:
- And the LLM may recommend status
- But the quality gate should only pass criteria whose evidence paths prove the recommendation.

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

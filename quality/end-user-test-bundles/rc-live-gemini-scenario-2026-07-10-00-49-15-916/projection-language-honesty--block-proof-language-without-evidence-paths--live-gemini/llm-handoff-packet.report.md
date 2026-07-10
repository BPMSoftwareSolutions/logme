# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: projection-language-honesty--block-proof-language-without-evidence-paths--live-gemini
- Feature id: projection-language-honesty
- Scenario id: block-proof-language-without-evidence-paths
- Scenario name: Block proof language without evidence paths
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block proof language without evidence paths
    Given the report text contains "proof", "supported", "runtime", "execution", or "receipt"
    But the report does not include an evidence path for that claim
    When the report language validator runs
    Then the report should be BLOCKED
    And the finding code should be:
      | finding |
      | projection-language-overclaim |
```

```

## Acceptance Criteria

- But the report does not include an evidence path for that claim
- Then the report should be BLOCKED
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

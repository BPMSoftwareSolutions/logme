# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-contract-schema-enforcement--block-empty-report-schema--live-gemini
- Feature id: report-contract-schema-enforcement
- Scenario id: block-empty-report-schema
- Scenario name: Block empty report schema
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block empty report schema
    Given the report schema is `{}` or has no required fields
    When the report generator runs in CI
    Then the report verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | report-schema-empty |
      | report-contract-not-enforced |
```

```

## Acceptance Criteria

- Then the report verdict should be BLOCKED
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

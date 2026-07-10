# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: evidence-receipt-coverage--block-verdict-promotion-without-receipt--live-gemini
- Feature id: evidence-receipt-coverage
- Scenario id: block-verdict-promotion-without-receipt
- Scenario name: Block verdict promotion without receipt
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block verdict promotion without receipt
    Given report.md claims a passing or sterile verdict
    But the report-generation receipt does not exist
    When the PI readiness gate runs
    Then the PI verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | report-verdict-without-receipt |
```

```

## Acceptance Criteria

- But the report-generation receipt does not exist
- Then the PI verdict should be BLOCKED
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

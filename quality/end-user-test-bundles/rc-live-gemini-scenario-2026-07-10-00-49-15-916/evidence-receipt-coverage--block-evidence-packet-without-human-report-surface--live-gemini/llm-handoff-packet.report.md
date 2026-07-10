# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: evidence-receipt-coverage--block-evidence-packet-without-human-report-surface--live-gemini
- Feature id: evidence-receipt-coverage
- Scenario id: block-evidence-packet-without-human-report-surface
- Scenario name: Block evidence packet without human report surface
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block evidence packet without human report surface
    Given a run writes canonical JSON evidence for feature execution, domain body analysis, or sprawl detection
    But the corresponding Markdown report is missing
    When the report truth gate runs
    Then the report verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | evidence-json-without-human-report |
    And `report.md` should not present the JSON-only evidence as product-owner ready.

```

## Acceptance Criteria

- But the corresponding Markdown report is missing
- Then the report verdict should be BLOCKED
- And the finding code should be:
- And `report.md` should not present the JSON-only evidence as product-owner ready.

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

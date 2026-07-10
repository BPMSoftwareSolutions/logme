# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-provenance-and-freshness-gate--block-stale-report-projection--live-gemini
- Feature id: report-provenance-and-freshness-gate
- Scenario id: block-stale-report-projection
- Scenario name: Block stale report projection
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block stale report projection
    Given report.md exists
    And the current source inventory hash differs from the hash rendered in report.md
    When the report truth gate runs
    Then the report verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | stale-report-projection |
      | report-source-hash-mismatch |
    And the report should not claim a clean or sterile state.
```

```

## Acceptance Criteria

- And the current source inventory hash differs from the hash rendered in report.md
- Then the report verdict should be BLOCKED
- And the finding code should be:
- And the report should not claim a clean or sterile state.

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

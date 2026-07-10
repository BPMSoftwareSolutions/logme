# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: summary-findings-and-method-row-tie-out--tie-findings-to-table-rows--live-gemini
- Feature id: summary-findings-and-method-row-tie-out
- Scenario id: tie-findings-to-table-rows
- Scenario name: Tie findings to table rows
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Tie findings to table rows
    Given a finding references a file path, method name, and reason
    When the report validator checks the finding
    Then the method table should contain a row with the same file path and method name
    And the row state should explain the finding
    And duplicate method names should be disambiguated by file path and line range.

```

## Acceptance Criteria

- Then the method table should contain a row with the same file path and method name
- And the row state should explain the finding
- And duplicate method names should be disambiguated by file path and line range.

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

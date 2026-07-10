# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--change-ascii-execution-sketch-without-code-changes--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: change-ascii-execution-sketch-without-code-changes
- Scenario name: Change ASCII execution sketch without code changes
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Change ASCII execution sketch without code changes
    Given the ASCII execution sketch is declared in a template file
    And the template references report data using declared variables
    When a product owner changes sketch spacing, grouping, labels, or visible fields in the template
    And the report generator runs
    Then report.md should reflect the updated sketch
    And no renderer code change should be required
    And every template variable should resolve against the report data contract.

```

## Acceptance Criteria

- And the template references report data using declared variables
- And the report generator runs
- Then report.md should reflect the updated sketch
- And no renderer code change should be required
- And every template variable should resolve against the report data contract.

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

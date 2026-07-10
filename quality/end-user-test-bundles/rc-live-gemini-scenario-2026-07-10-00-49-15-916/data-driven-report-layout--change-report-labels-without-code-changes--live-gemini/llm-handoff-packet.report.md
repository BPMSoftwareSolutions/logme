# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--change-report-labels-without-code-changes--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: change-report-labels-without-code-changes
- Scenario name: Change report labels without code changes
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Change report labels without code changes
    Given the report layout contract declares product-facing labels
    When a product owner changes a section title, field label, status label, or promotion label in the layout contract
    And the report generator runs
    Then report.md should render the updated labels
    And the underlying evidence fields should remain schema-validated.

```

## Acceptance Criteria

- And the report generator runs
- Then report.md should render the updated labels
- And the underlying evidence fields should remain schema-validated.

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

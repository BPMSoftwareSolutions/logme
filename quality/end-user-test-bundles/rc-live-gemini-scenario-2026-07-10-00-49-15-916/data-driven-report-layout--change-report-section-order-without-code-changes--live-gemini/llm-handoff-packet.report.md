# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--change-report-section-order-without-code-changes--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: change-report-section-order-without-code-changes
- Scenario name: Change report section order without code changes
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Change report section order without code changes
    Given the report layout contract declares section order
    And the report renderer reads the layout contract at generation time
    When a product owner changes section order in the layout contract
    And the report generator runs
    Then report.md should render sections in the new order
    And no application source code change should be required.

```

## Acceptance Criteria

- And the report renderer reads the layout contract at generation time
- And the report generator runs
- Then report.md should render sections in the new order
- And no application source code change should be required.

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

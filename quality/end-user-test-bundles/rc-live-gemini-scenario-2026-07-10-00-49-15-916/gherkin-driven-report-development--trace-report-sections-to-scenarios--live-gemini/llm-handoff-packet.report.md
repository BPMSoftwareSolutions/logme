# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: gherkin-driven-report-development--trace-report-sections-to-scenarios--live-gemini
- Feature id: gherkin-driven-report-development
- Scenario id: trace-report-sections-to-scenarios
- Scenario name: Trace report sections to scenarios
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Trace report sections to scenarios
    Given report.md contains a section
    When the report section index is rendered
    Then each section should show its owning feature id or scenario id
    And unowned report sections should be BLOCKED
    And the finding code should be:
      | finding |
      | report-section-without-acceptance-source |
```

```

## Acceptance Criteria

- Then each section should show its owning feature id or scenario id
- And unowned report sections should be BLOCKED
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

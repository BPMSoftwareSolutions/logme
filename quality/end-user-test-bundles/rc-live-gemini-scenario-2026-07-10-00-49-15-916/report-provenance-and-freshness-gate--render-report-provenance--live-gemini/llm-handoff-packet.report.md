# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: report-provenance-and-freshness-gate--render-report-provenance--live-gemini
- Feature id: report-provenance-and-freshness-gate
- Scenario id: render-report-provenance
- Scenario name: Render report provenance
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render report provenance
    Given the report generator has completed a domain audit
    When report.md is rendered
    Then the report should show:
      | field |
      | report schema version |
      | generator name |
      | generation timestamp |
      | generation command |
      | git commit or working tree marker |
      | config path |
      | config hash |
      | source inventory hash |
      | run id |
      | evidence directory |
    And every hash should be derived from the inputs used for the rendered report.

```

## Acceptance Criteria

- Then the report should show:
- And every hash should be derived from the inputs used for the rendered report.

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

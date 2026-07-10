# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: gherkin-driven-report-development--require-gherkin-before-report-feature-implementation--live-gemini
- Feature id: gherkin-driven-report-development
- Scenario id: require-gherkin-before-report-feature-implementation
- Scenario name: Require Gherkin before report feature implementation
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Require Gherkin before report feature implementation
    Given a report feature changes the rendered projection surface
    When a pull request is opened
    Then the pull request should include or reference a scenario under `docs/features/**/*.feature.md`
    And the implementation tests should reference the scenario id
    And the report should not add a new section or claim without acceptance criteria.

```

## Acceptance Criteria

- Then the pull request should include or reference a scenario under `docs/features/**/*.feature.md`
- And the implementation tests should reference the scenario id
- And the report should not add a new section or claim without acceptance criteria.

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

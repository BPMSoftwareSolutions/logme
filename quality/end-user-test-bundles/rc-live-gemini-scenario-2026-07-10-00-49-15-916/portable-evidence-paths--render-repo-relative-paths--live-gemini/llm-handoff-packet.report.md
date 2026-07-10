# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: portable-evidence-paths--render-repo-relative-paths--live-gemini
- Feature id: portable-evidence-paths
- Scenario id: render-repo-relative-paths
- Scenario name: Render repo-relative paths
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render repo-relative paths
    Given a method row references a file under the configured root
    When report.md is rendered
    Then the Location value should be repo-relative
    And the report should show line start and line end
    And the report should render the configured root once in the provenance section.

```

## Acceptance Criteria

- Then the Location value should be repo-relative
- And the report should show line start and line end
- And the report should render the configured root once in the provenance section.

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

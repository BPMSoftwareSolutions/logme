# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--keep-the-global-report-as-an-index-not-a-sketch-warehouse--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: keep-the-global-report-as-an-index-not-a-sketch-warehouse
- Scenario name: Keep the global report as an index, not a sketch warehouse
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep the global report as an index, not a sketch warehouse
    Given one or more feature scenario evidence packets were written for a run
    When the global `report.md` is rendered
    Then it should show a compact feature evidence index with:
      | field |
      | feature id |
      | scenario id |
      | feature verdict |
      | blocker count |
      | evidence packet path |
      | executable body report path |
      | execution timeline table path |
      | method timeline table path |
      | method evidence report path |
    And the global report should not embed every feature's full executable body tree
    And the global report should link to each feature-scoped report using repo-relative evidence paths.

```

## Acceptance Criteria

- Then it should show a compact feature evidence index with:
- And the global report should not embed every feature's full executable body tree
- And the global report should link to each feature-scoped report using repo-relative evidence paths.

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

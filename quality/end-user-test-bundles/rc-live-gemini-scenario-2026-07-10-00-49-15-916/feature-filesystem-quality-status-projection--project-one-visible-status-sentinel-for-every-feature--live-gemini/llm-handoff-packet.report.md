# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--project-one-visible-status-sentinel-for-every-feature--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: project-one-visible-status-sentinel-for-every-feature
- Scenario name: Project one visible status sentinel for every feature
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Project one visible status sentinel for every feature
    Given a feature file exists at:
      """
      docs/features/<feature-id>.feature.md
      """
    When the feature status projection runs
    Then it should write exactly one visible status sentinel at:
      """
      docs/features/_STATUS.<display-status>.<feature-id>.md
      """
    And the sentinel filename should be enough for a product owner to understand the feature's current quality state
    And the sentinel should be generated even when no implementation proof or QA evidence exists
    And the sentinel should link to the source feature document
    And the sentinel should link to the latest evidence bundle when one exists
    And no feature should be omitted because it is unimplemented, blocked, or not QAed.

```

## Acceptance Criteria

- Then it should write exactly one visible status sentinel at:
- And the sentinel filename should be enough for a product owner to understand the feature's current quality state
- And the sentinel should be generated even when no implementation proof or QA evidence exists
- And the sentinel should link to the source feature document
- And the sentinel should link to the latest evidence bundle when one exists
- And no feature should be omitted because it is unimplemented, blocked, or not QAed.

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

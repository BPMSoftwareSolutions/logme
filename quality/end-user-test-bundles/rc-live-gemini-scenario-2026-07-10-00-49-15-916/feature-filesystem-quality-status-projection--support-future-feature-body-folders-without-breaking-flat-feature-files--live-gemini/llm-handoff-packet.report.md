# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--support-future-feature-body-folders-without-breaking-flat-feature-files--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: support-future-feature-body-folders-without-breaking-flat-feature-files
- Scenario name: Support future feature body folders without breaking flat feature files
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Support future feature body folders without breaking flat feature files
    Given the repository currently stores feature specs as flat `docs/features/<feature-id>.feature.md` files
    When the projection writes filesystem status
    Then it should use the root-level `_STATUS.<display-status>.<feature-id>.md` sentinel pattern
    And if a future feature body folder exists at:
      """
      docs/features/<feature-id>/feature.md
      """
    Then the projection may also write:
      """
      docs/features/<feature-id>/_STATUS.<display-status>.md
      docs/features/<feature-id>/feature.status.v1.json
      docs/features/<feature-id>/latest-qa-bundle.pointer.json
      """
    But the flat-file projection should remain supported until the repository explicitly migrates feature specs into folders.

```

## Acceptance Criteria

- Then it should use the root-level `_STATUS.<display-status>.<feature-id>.md` sentinel pattern
- And if a future feature body folder exists at:
- Then the projection may also write:
- But the flat-file projection should remain supported until the repository explicitly migrates feature specs into folders.

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

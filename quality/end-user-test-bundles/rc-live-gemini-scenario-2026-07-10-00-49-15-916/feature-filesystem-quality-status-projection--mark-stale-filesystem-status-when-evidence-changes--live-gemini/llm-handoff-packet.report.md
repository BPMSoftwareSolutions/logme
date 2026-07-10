# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--mark-stale-filesystem-status-when-evidence-changes--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: mark-stale-filesystem-status-when-evidence-changes
- Scenario name: Mark stale filesystem status when evidence changes
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Mark stale filesystem status when evidence changes
    Given a status sentinel and JSON status contract exist for a feature
    And the source feature document hash, QA bundle manifest hash, or promotion decision hash has changed
    When the status projection verifies freshness
    Then the display status should become:
      | display status |
      | stale |
    And the stale reason should identify which source changed
    And no stale feature should be reported as promoted
    And the next recommended action should be to regenerate evidence or rerun the status projection.

```

## Acceptance Criteria

- And the source feature document hash, QA bundle manifest hash, or promotion decision hash has changed
- Then the display status should become:
- And the stale reason should identify which source changed
- And no stale feature should be reported as promoted
- And the next recommended action should be to regenerate evidence or rerun the status projection.

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

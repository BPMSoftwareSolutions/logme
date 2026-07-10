# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--mark-qa-blocked-from-the-filesystem-body--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: mark-qa-blocked-from-the-filesystem-body
- Scenario name: Mark QA blocked from the filesystem body
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Mark QA blocked from the filesystem body
    Given a latest QA bundle exists for a feature
    And its QA gate decision is `BLOCKED`
    When status projection runs
    Then the status sentinel should be:
      """
      docs/features/_STATUS.qa-blocked.<feature-id>.md
      """
    And the sentinel should include blocker count and blocker codes
    And the sentinel should link to:
      | artifact |
      | qa-evidence-bundle.report.md |
      | blocker-worklist.md |
      | qa-gate-decision.v1.json |
    And the next recommended action should point to the first blocker route.

```

## Acceptance Criteria

- And its QA gate decision is `BLOCKED`
- Then the status sentinel should be:
- And the sentinel should include blocker count and blocker codes
- And the sentinel should link to:
- And the next recommended action should point to the first blocker route.

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

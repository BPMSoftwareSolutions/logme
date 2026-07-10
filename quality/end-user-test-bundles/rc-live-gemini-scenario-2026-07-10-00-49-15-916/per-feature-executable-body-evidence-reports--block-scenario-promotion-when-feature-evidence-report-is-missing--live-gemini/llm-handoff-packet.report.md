# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--block-scenario-promotion-when-feature-evidence-report-is-missing--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: block-scenario-promotion-when-feature-evidence-report-is-missing
- Scenario name: Block scenario promotion when feature evidence report is missing
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block scenario promotion when feature evidence report is missing
    Given a feature scenario was executed during an end-to-end test, demo run, or PI validation run
    But no feature evidence packet exists under `evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/`
    When the feature promotion gate runs
    Then the feature scenario verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | feature-executable-body-report-missing |
    And no global report should mark the scenario promotion-ready.

```

## Acceptance Criteria

- But no feature evidence packet exists under `evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/`
- Then the feature scenario verdict should be BLOCKED
- And the finding code should be:
- And no global report should mark the scenario promotion-ready.

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

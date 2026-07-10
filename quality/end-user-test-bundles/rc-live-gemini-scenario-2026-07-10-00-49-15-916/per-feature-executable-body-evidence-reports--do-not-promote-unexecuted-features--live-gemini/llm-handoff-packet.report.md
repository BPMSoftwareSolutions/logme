# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--do-not-promote-unexecuted-features--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: do-not-promote-unexecuted-features
- Scenario name: Do not promote unexecuted features
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Do not promote unexecuted features
    Given a committed feature scenario exists in Gherkin or planning scope
    But the scenario was not executed in the current run
    When the global report renders the feature evidence index
    Then the scenario should show `not executed`
    And it should not show PASS, STERILE, observed telemetry, written receipts, SLO met, or SLA satisfied for that run
    And the scenario should not have a generated evidence packet unless execution actually occurred.

```

## Acceptance Criteria

- But the scenario was not executed in the current run
- Then the scenario should show `not executed`
- And it should not show PASS, STERILE, observed telemetry, written receipts, SLO met, or SLA satisfied for that run
- And the scenario should not have a generated evidence packet unless execution actually occurred.

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

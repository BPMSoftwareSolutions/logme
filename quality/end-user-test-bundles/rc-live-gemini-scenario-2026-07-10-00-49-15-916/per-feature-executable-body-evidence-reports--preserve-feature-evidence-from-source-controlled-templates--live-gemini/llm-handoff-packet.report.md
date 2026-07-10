# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--preserve-feature-evidence-from-source-controlled-templates--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: preserve-feature-evidence-from-source-controlled-templates
- Scenario name: Preserve feature evidence from source-controlled templates
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve feature evidence from source-controlled templates
    Given product-owned report templates and layout contracts are source controlled
    And generated feature evidence is not source controlled
    When a product owner changes the feature report template
    And a feature run is executed again
    Then the regenerated feature evidence report should use the updated template
    And no code deployment should be required for layout-only changes.
```

```

## Acceptance Criteria

- And generated feature evidence is not source controlled
- And a feature run is executed again
- Then the regenerated feature evidence report should use the updated template
- And no code deployment should be required for layout-only changes.

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

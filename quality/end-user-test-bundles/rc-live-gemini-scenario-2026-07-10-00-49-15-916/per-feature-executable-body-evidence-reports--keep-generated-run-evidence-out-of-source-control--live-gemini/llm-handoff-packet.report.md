# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--keep-generated-run-evidence-out-of-source-control--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: keep-generated-run-evidence-out-of-source-control
- Scenario name: Keep generated run evidence out of source control
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep generated run evidence out of source control
    Given feature evidence packets are generated under `evidence/runs/`
    When the developer checks source-control status
    Then generated run evidence should not be staged or committed by default
    And source control should keep only contracts, templates, schemas, and tests
    And CI may publish run evidence as build artifacts outside the committed source tree.

```

## Acceptance Criteria

- Then generated run evidence should not be staged or committed by default
- And source control should keep only contracts, templates, schemas, and tests
- And CI may publish run evidence as build artifacts outside the committed source tree.

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

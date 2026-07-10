# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--block-false-pass-in-promotion-workflow--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: block-false-pass-in-promotion-workflow
- Scenario name: Block false pass in promotion workflow
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block false pass in promotion workflow
    Given CI generated report evidence exists
    And the report claims `STERILE DOMAIN BODY` or any PASS-style verdict
    When the promotion workflow evaluates the evidence packet
    Then every hard-law blocker should be zero
    And the report schema should be valid
    And the freshness gate should pass
    And every required receipt should exist
    And every report section should trace to Gherkin acceptance criteria
    And every release-candidate promotion should have a QA evidence bundle
    And promotion should fail if any proof is missing.

```

## Acceptance Criteria

- And the report claims `STERILE DOMAIN BODY` or any PASS-style verdict
- Then every hard-law blocker should be zero
- And the report schema should be valid
- And the freshness gate should pass
- And every required receipt should exist
- And every report section should trace to Gherkin acceptance criteria
- And every release-candidate promotion should have a QA evidence bundle
- And promotion should fail if any proof is missing.

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

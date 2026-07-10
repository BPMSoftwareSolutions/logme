# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--block-product-template-from-weakening-truth-gates--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: block-product-template-from-weakening-truth-gates
- Scenario name: Block product template from weakening truth gates
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block product template from weakening truth gates
    Given a product owner changes the report layout contract or template
    When the report generator validates truth gates
    Then the template should not be able to hide:
      | required truth |
      | verdict |
      | blocker count |
      | stale provenance |
      | silent local methods |
      | anonymous executable methods |
      | missing telemetry |
      | missing receipt |
      | promotion decision |
    And generation should fail if the layout omits required truth fields.

```

## Acceptance Criteria

- Then the template should not be able to hide:
- And generation should fail if the layout omits required truth fields.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: data-driven-report-layout--keep-renderer-code-as-a-generic-engine--live-gemini
- Feature id: data-driven-report-layout
- Scenario id: keep-renderer-code-as-a-generic-engine
- Scenario name: Keep renderer code as a generic engine
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep renderer code as a generic engine
    Given report layout, section order, labels, and ASCII sketches are declared in contracts or templates
    When a report presentation change is requested
    Then the expected change should be made in product-owned report contracts or templates
    And renderer source code should change only when a new rendering primitive, validator, or data field is needed.
```

```

## Acceptance Criteria

- Then the expected change should be made in product-owned report contracts or templates
- And renderer source code should change only when a new rendering primitive, validator, or data field is needed.

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

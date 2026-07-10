# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--keep-method-drill-down-portable-for-html-and-visual-review--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: keep-method-drill-down-portable-for-html-and-visual-review
- Scenario name: Keep method drill-down portable for HTML and visual review
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Keep method drill-down portable for HTML and visual review
    Given the Markdown proof report will be transformed into HTML, a dashboard, a deck, or a publication
    When method drill-down ASCII is rendered
    Then it should use only portable ASCII characters
    And it should fit in Markdown without relying on color or terminal-specific rendering
    And long method names should wrap or be summarized without hiding the full method name from the detailed appendix
    And HTML visual QA should verify that method call branches remain readable.
```

```

## Acceptance Criteria

- Then it should use only portable ASCII characters
- And it should fit in Markdown without relying on color or terminal-specific rendering
- And long method names should wrap or be summarized without hiding the full method name from the detailed appendix
- And HTML visual QA should verify that method call branches remain readable.

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

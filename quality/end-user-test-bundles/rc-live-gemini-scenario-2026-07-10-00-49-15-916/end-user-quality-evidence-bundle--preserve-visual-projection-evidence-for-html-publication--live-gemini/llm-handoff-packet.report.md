# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--preserve-visual-projection-evidence-for-html-publication--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: preserve-visual-projection-evidence-for-html-publication
- Scenario name: Preserve visual projection evidence for HTML publication
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve visual projection evidence for HTML publication
    Given a Markdown report is intended to be transformed into HTML, a dashboard, a deck, or a publication
    When end-user QA runs
    Then the QA bundle should include an HTML preview index when HTML rendering is available
    And the preview index should include:
      | field |
      | source Markdown report path |
      | generated HTML path or artifact URL |
      | screenshot path |
      | viewport |
      | render timestamp |
      | visual QA status |
      | blocker code |
    And ASCII sketches should be checked for readable HTML rendering
    And visual render blockers should prevent QA pass.

```

## Acceptance Criteria

- Then the QA bundle should include an HTML preview index when HTML rendering is available
- And the preview index should include:
- And ASCII sketches should be checked for readable HTML rendering
- And visual render blockers should prevent QA pass.

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

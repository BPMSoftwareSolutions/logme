# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-scoped-ascii-execution-flow-report--render-clean-ascii-only--live-gemini
- Feature id: feature-scoped-ascii-execution-flow-report
- Scenario id: render-clean-ascii-only
- Scenario name: Render clean ASCII only
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render clean ASCII only
    Given the report is rendered for Markdown, terminal, and CI log review
    When the ASCII execution sketch is produced
    Then the sketch should use only portable ASCII characters:
      | character |
      | + |
      | - |
      | | |
      | ` |
      | > |
      | / |
      | \ |
    And the sketch should not depend on Unicode box drawing, emoji, color, or terminal-specific rendering.

```

## Acceptance Criteria

- Then the sketch should use only portable ASCII characters:
- And the sketch should not depend on Unicode box drawing, emoji, color, or terminal-specific rendering.

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

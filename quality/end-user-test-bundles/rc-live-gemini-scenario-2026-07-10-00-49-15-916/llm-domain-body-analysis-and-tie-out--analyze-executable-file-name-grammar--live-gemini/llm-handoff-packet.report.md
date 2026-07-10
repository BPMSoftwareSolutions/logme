# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-domain-body-analysis-and-tie-out--analyze-executable-file-name-grammar--live-gemini
- Feature id: llm-domain-body-analysis-and-tie-out
- Scenario id: analyze-executable-file-name-grammar
- Scenario name: Analyze executable file-name grammar
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Analyze executable file-name grammar
    Given LogMe discovers executable source files in the configured workspace
    When domain body analysis runs
    Then each executable file should be classified by file-name grammar:
      | classification |
      | action-bearing |
      | action-bearing-with-late-verb |
      | noun-or-capability-label |
      | non-executable |
    And an executable file without an action-bearing verb should receive:
      | finding |
      | executable-file-name-missing-action-verb |
    And the finding should explain that noun-only or capability-label files become responsibility dumping grounds.

```

## Acceptance Criteria

- Then each executable file should be classified by file-name grammar:
- And an executable file without an action-bearing verb should receive:
- And the finding should explain that noun-only or capability-label files become responsibility dumping grounds.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--render-method-evidence-appendix-for-deep-review--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: render-method-evidence-appendix-for-deep-review
- Scenario name: Render method evidence appendix for deep review
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render method evidence appendix for deep review
    Given method-level execution proof exists
    When scenario proof reporting completes
    Then it may write a detailed Markdown appendix at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/method-call-evidence.report.md
      """
    And the appendix should group method calls by:
      | grouping |
      | body node |
      | runtime file |
      | method name |
      | call index |
    And each method call should expose telemetry event ids, receipt paths, source line range, and blocker/fix route
    And the appendix should link back to `executable-body-contract.report.md`.

```

## Acceptance Criteria

- Then it may write a detailed Markdown appendix at:
- And the appendix should group method calls by:
- And each method call should expose telemetry event ids, receipt paths, source line range, and blocker/fix route
- And the appendix should link back to `executable-body-contract.report.md`.

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

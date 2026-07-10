# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--execute-real-end-user-qa-from-the-user-perspective--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: execute-real-end-user-qa-from-the-user-perspective
- Scenario name: Execute real end-user QA from the user perspective
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Execute real end-user QA from the user perspective
    Given a feature scenario is ready for quality validation
    When the QA test is executed
    Then the test should exercise the system through an end-user surface
    And an end-user surface may be:
      | surface |
      | CLI command used by a product owner |
      | generated Markdown report reviewed by a human |
      | browser-rendered HTML projection |
      | local app workflow |
      | CI preview artifact |
    And the QA test should validate the actual human projection when the feature produces one
    And a Markdown report feature should be QAed by generating and inspecting the Markdown artifact
    And an HTML projection feature should be QAed by rendering the Markdown-to-HTML artifact before promotion
    And unit tests alone should not satisfy end-user QA.

```

## Acceptance Criteria

- Then the test should exercise the system through an end-user surface
- And an end-user surface may be:
- And the QA test should validate the actual human projection when the feature produces one
- And a Markdown report feature should be QAed by generating and inspecting the Markdown artifact
- And an HTML projection feature should be QAed by rendering the Markdown-to-HTML artifact before promotion
- And unit tests alone should not satisfy end-user QA.

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

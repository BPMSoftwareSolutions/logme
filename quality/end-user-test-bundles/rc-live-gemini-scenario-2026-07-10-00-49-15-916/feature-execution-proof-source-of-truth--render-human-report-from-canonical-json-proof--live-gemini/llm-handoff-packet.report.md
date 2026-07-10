# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-execution-proof-source-of-truth--render-human-report-from-canonical-json-proof--live-gemini
- Feature id: feature-execution-proof-source-of-truth
- Scenario id: render-human-report-from-canonical-json-proof
- Scenario name: Render human report from canonical JSON proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render human report from canonical JSON proof
    Given `feature-execution.contract.v1.json` exists for a scenario
    When `executable-body-contract.report.md` is rendered
    Then the first product-facing section should be generated from the JSON proof
    And the ASCII sketch should show, for each body node:
      | field |
      | node label |
      | runtime path |
      | observed runtime step |
      | first seen at |
      | last seen at |
      | duration ms |
      | elapsed since previous node ms |
      | call count |
      | receipt status |
      | blocker status |
    And the report should include a supporting table or linked projection for dense timing and call-count details
    And the report should include or link the method-level drill-down projection
    And the report should include the generated report path and generated-at timestamp
    And the product owner should not need to open JSON to understand what happened.

```

## Acceptance Criteria

- Then the first product-facing section should be generated from the JSON proof
- And the ASCII sketch should show, for each body node:
- And the report should include a supporting table or linked projection for dense timing and call-count details
- And the report should include or link the method-level drill-down projection
- And the report should include the generated report path and generated-at timestamp
- And the product owner should not need to open JSON to understand what happened.

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

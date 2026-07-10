# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--render-runtime-file-drill-down-before-method-calls--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: render-runtime-file-drill-down-before-method-calls
- Scenario name: Render runtime-file drill-down before method calls
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Render runtime-file drill-down before method calls
    Given one body node executes methods from one or more runtime files
    When the method drill-down is rendered
    Then the body node should first show the participating runtime files
    And each runtime file row should include:
      | field |
      | runtime file path |
      | participating method count |
      | observed call count |
      | first seen at |
      | last seen at |
      | total duration ms |
      | slowest method |
      | receipt coverage status |
    And the method calls should be grouped under the runtime file when a node spans multiple files.

```

## Acceptance Criteria

- Then the body node should first show the participating runtime files
- And each runtime file row should include:
- And the method calls should be grouped under the runtime file when a node spans multiple files.

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

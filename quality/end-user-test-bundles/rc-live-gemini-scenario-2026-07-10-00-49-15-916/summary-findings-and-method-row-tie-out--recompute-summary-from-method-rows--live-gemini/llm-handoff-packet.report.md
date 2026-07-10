# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: summary-findings-and-method-row-tie-out--recompute-summary-from-method-rows--live-gemini
- Feature id: summary-findings-and-method-row-tie-out
- Scenario id: recompute-summary-from-method-rows
- Scenario name: Recompute summary from method rows
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Recompute summary from method rows
    Given the report method table contains method rows
    When the report validator recomputes summary metrics
    Then `localExecutableMethods` should equal the number of method rows
    And `methodsWithLogMeCall` should equal rows where LogMe is `yes`
    And `silentLocalMethods` should equal rows where LogMe is `no`
    And `methodsWithLogMeCall + silentLocalMethods` should equal `localExecutableMethods`
    And `coverage` should equal `methodsWithLogMeCall / localExecutableMethods`

```

## Acceptance Criteria

- Then `localExecutableMethods` should equal the number of method rows
- And `methodsWithLogMeCall` should equal rows where LogMe is `yes`
- And `silentLocalMethods` should equal rows where LogMe is `no`
- And `methodsWithLogMeCall + silentLocalMethods` should equal `localExecutableMethods`
- And `coverage` should equal `methodsWithLogMeCall / localExecutableMethods`

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

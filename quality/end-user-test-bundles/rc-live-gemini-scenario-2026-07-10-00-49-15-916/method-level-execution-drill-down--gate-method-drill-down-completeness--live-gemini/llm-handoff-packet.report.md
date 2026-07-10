# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--gate-method-drill-down-completeness--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: gate-method-drill-down-completeness
- Scenario name: Gate method drill-down completeness
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Gate method drill-down completeness
    Given a body node is marked `observed`
    And the canonical JSON proof has no method calls for that body node
    When the method drill-down gate runs
    Then the body node should be marked `method detail missing`
    And the feature scenario should not be promoted as fully drill-down proven
    And the finding code should be:
      | finding |
      | observed-body-node-without-method-drilldown |
    And the report should still render the body node with a clear missing-detail blocker.

```

## Acceptance Criteria

- And the canonical JSON proof has no method calls for that body node
- Then the body node should be marked `method detail missing`
- And the feature scenario should not be promoted as fully drill-down proven
- And the finding code should be:
- And the report should still render the body node with a clear missing-detail blocker.

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

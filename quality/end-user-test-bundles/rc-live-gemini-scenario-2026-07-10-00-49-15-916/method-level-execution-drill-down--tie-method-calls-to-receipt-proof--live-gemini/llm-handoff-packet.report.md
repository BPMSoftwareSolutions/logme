# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--tie-method-calls-to-receipt-proof--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: tie-method-calls-to-receipt-proof
- Scenario name: Tie method calls to receipt proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Tie method calls to receipt proof
    Given a method call performs or participates in a receipted action
    When method-level receipt tie-out runs
    Then the method call should list the receipt paths that prove the action
    And each receipt path should be repo-relative
    And each receipt path should include a content hash or receipt id in the canonical JSON proof
    And a required receipt missing from disk should block that method call
    And the finding code should be:
      | finding |
      | method-call-receipt-missing |

```

## Acceptance Criteria

- Then the method call should list the receipt paths that prove the action
- And each receipt path should be repo-relative
- And each receipt path should include a content hash or receipt id in the canonical JSON proof
- And a required receipt missing from disk should block that method call
- And the finding code should be:

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

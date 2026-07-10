# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: method-level-execution-drill-down--preserve-the-three-level-execution-review-model--live-gemini
- Feature id: method-level-execution-drill-down
- Scenario id: preserve-the-three-level-execution-review-model
- Scenario name: Preserve the three-level execution review model
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve the three-level execution review model
    Given a feature scenario has canonical execution proof
    When the human execution report is generated
    Then the report should expose three drill-down levels:
      | level | question answered | projection |
      | 01 Executive flow | Can I trust this run? | report truth sketch |
      | 02 Body-node flow | Which executable body nodes ran? | executable body tree |
      | 03 Method-by-method flow | Which methods executed inside each node, in what order, with what evidence? | method execution drill-down |
    And the method drill-down should appear after the body-node sketch
    And the dense static method inventory should appear only after runtime execution proof
    And the report should not make an architect jump from a body node directly to a hundreds-row static method table.

```

## Acceptance Criteria

- Then the report should expose three drill-down levels:
- And the method drill-down should appear after the body-node sketch
- And the dense static method inventory should appear only after runtime execution proof
- And the report should not make an architect jump from a body node directly to a hundreds-row static method table.

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

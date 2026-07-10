# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-body-sprawl-visibility--preserve-intentional-domain-cohesion--live-gemini
- Feature id: domain-body-sprawl-visibility
- Scenario id: preserve-intentional-domain-cohesion
- Scenario name: Preserve intentional domain cohesion
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Preserve intentional domain cohesion
    Given a file is large because it owns a single cohesive domain responsibility
    And the file's declared body contract or module contract authorizes that responsibility
    When the sprawl classifier runs
    Then the file may be classified as `authorized dense orchestrator`
    And the report should show the authorizing contract path
    And the report should still show line count, method count, and responsibility clusters
    And authorization should not hide the file from the sprawl report.

```

## Acceptance Criteria

- And the file's declared body contract or module contract authorizes that responsibility
- Then the file may be classified as `authorized dense orchestrator`
- And the report should show the authorizing contract path
- And the report should still show line count, method count, and responsibility clusters
- And authorization should not hide the file from the sprawl report.

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

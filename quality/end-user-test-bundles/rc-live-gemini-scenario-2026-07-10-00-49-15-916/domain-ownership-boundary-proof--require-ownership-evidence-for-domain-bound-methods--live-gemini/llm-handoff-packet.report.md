# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: domain-ownership-boundary-proof--require-ownership-evidence-for-domain-bound-methods--live-gemini
- Feature id: domain-ownership-boundary-proof
- Scenario id: require-ownership-evidence-for-domain-bound-methods
- Scenario name: Require ownership evidence for domain-bound methods
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Require ownership evidence for domain-bound methods
    Given a method is counted as domain-bound
    When the report ownership validator runs
    Then the method should show one of:
      | ownership proof |
      | declared file-system body contract path |
      | declared feature contract path |
      | package governance contract path |
      | explicit domain vocabulary ownership rule |
    And `domainBoundMethods` should count only methods with ownership proof.

```

## Acceptance Criteria

- Then the method should show one of:
- And `domainBoundMethods` should count only methods with ownership proof.

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

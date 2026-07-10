# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: feature-filesystem-quality-status-projection--mark-qa-passed-and-promoted-from-the-filesystem-body--live-gemini
- Feature id: feature-filesystem-quality-status-projection
- Scenario id: mark-qa-passed-and-promoted-from-the-filesystem-body
- Scenario name: Mark QA passed and promoted from the filesystem body
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Mark QA passed and promoted from the filesystem body
    Given a latest QA bundle exists for a feature
    And the QA bundle manifest hashes match
    And machine provenance exists
    And the deterministic promotion gate has promoted the feature
    When status projection runs
    Then the status sentinel should be:
      """
      docs/features/_STATUS.qa-passed.promoted.<feature-id>.md
      """
    And the JSON status should set:
      | field | value |
      | end-user QA status | QA passed |
      | promotion status | promoted |
    And the sentinel should link to the immutable promoted QA bundle
    And the sentinel should link to the promotion decision artifact.

```

## Acceptance Criteria

- And the QA bundle manifest hashes match
- And machine provenance exists
- And the deterministic promotion gate has promoted the feature
- Then the status sentinel should be:
- And the JSON status should set:
- And the sentinel should link to the immutable promoted QA bundle
- And the sentinel should link to the promotion decision artifact.

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

# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--block-release-without-qa-bundle--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: block-release-without-qa-bundle
- Scenario name: Block release without QA bundle
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Block release without QA bundle
    Given a release candidate is proposed for promotion
    But no QA evidence bundle exists under `quality/end-user-test-bundles/<release-candidate-id>/`
    When the quality promotion gate runs
    Then the release candidate should be BLOCKED
    And the finding code should be:
      | finding |
      | release-candidate-without-end-user-qa-bundle |
    And CI/CD should not mark the release candidate releasable.

```

## Acceptance Criteria

- But no QA evidence bundle exists under `quality/end-user-test-bundles/<release-candidate-id>/`
- Then the release candidate should be BLOCKED
- And the finding code should be:
- And CI/CD should not mark the release candidate releasable.

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

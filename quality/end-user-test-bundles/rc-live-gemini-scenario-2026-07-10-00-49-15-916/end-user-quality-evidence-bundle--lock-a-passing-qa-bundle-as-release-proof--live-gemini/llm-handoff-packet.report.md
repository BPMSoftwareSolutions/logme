# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--lock-a-passing-qa-bundle-as-release-proof--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: lock-a-passing-qa-bundle-as-release-proof
- Scenario name: Lock a passing QA bundle as release proof
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Lock a passing QA bundle as release proof
    Given a QA bundle has quality gate decision `QA passed`
    When the quality promotion gate runs
    Then it should mark the release candidate as promotable only if:
      | requirement |
      | all required feature scenarios are QA passed or explicitly waived |
      | every QA-passed scenario has executable body proof |
      | every required Markdown report exists |
      | every required HTML preview exists when the feature has an HTML projection |
      | machine provenance is present |
      | bundle manifest hashes match bundle contents |
      | blocker count is zero |
    And it should write the promotion decision to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/qa-gate-decision.v1.json
      """
    And a promoted bundle should be immutable
    And any correction should create a new QA run id, not mutate the promoted bundle.

```

## Acceptance Criteria

- Then it should mark the release candidate as promotable only if:
- And it should write the promotion decision to:
- And a promoted bundle should be immutable
- And any correction should create a new QA run id, not mutate the promoted bundle.

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

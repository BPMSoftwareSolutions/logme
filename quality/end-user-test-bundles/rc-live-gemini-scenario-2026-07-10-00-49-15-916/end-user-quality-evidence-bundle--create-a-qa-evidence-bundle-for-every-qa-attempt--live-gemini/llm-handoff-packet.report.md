# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: end-user-quality-evidence-bundle--create-a-qa-evidence-bundle-for-every-qa-attempt--live-gemini
- Feature id: end-user-quality-evidence-bundle
- Scenario id: create-a-qa-evidence-bundle-for-every-qa-attempt
- Scenario name: Create a QA evidence bundle for every QA attempt
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Create a QA evidence bundle for every QA attempt
    Given an end-user QA test has run
    And the release candidate id is `<release-candidate-id>`
    And the QA run id is `<qa-run-id>`
    When the QA evidence collector closes the run
    Then it should write a source-controlled QA bundle under:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/
      """
    And the bundle should be written for both passing and failing QA attempts
    And the bundle should contain:
      | artifact |
      | qa-evidence-bundle.manifest.v1.json |
      | qa-evidence-bundle.report.md |
      | qa-gate-decision.v1.json |
      | qa-execution-timeline.table.md |
      | machine-environment.v1.json |
      | end-user-test-session.md |
      | llm-user-experience.report.md |
      | acceptance-criteria-review.report.md |
      | feature-proof-links.v1.json |
      | report-artifact-index.v1.json |
      | blocker-worklist.md |
      | screenshots.index.md |
      | html-preview.index.md |
    And every artifact should include the same release candidate id and QA run id.

```

## Acceptance Criteria

- And the release candidate id is `<release-candidate-id>`
- And the QA run id is `<qa-run-id>`
- Then it should write a source-controlled QA bundle under:
- And the bundle should be written for both passing and failing QA attempts
- And the bundle should contain:
- And every artifact should include the same release candidate id and QA run id.

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

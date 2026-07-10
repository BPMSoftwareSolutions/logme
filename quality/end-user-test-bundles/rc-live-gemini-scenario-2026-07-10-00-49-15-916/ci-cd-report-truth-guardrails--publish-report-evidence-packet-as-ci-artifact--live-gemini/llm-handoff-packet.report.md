# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: ci-cd-report-truth-guardrails--publish-report-evidence-packet-as-ci-artifact--live-gemini
- Feature id: ci-cd-report-truth-guardrails
- Scenario id: publish-report-evidence-packet-as-ci-artifact
- Scenario name: Publish report evidence packet as CI artifact
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Publish report evidence packet as CI artifact
    Given the CI report truth workflow has generated report evidence
    When the workflow completes
    Then it should publish an artifact containing:
      | artifact |
      | method-inventory.v1.json |
      | report-contract.v1.json |
      | report.md |
      | report-generation.receipt.v1.json |
      | telemetry.events.v1.jsonl |
      | report-validation.v1.json |
      | adversarial-challenge-packet.md |
      | features/<feature-id>/executable-body-contract.report.md |
      | features/<feature-id>/executable-body-tree.ascii.md |
      | features/<feature-id>/feature-execution.receipt.v1.json |
      | quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/qa-evidence-bundle.report.md |
      | quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/qa-gate-decision.v1.json |
    And the pull request summary should link to the artifact.

```

## Acceptance Criteria

- Then it should publish an artifact containing:
- And the pull request summary should link to the artifact.

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

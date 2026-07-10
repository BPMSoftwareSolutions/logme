# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: llm-end-user-testing-conveyor--package-the-llm-qa-evidence-bundle--live-gemini
- Feature id: llm-end-user-testing-conveyor
- Scenario id: package-the-llm-qa-evidence-bundle
- Scenario name: Package the LLM QA evidence bundle
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Package the LLM QA evidence bundle
    Given LLM end-user testing has completed
    When the QA bundle is assembled
    Then the bundle should include:
      | artifact |
      | llm-qa-assignment.v1.json |
      | llm-handoff-packet.report.md |
      | llm-handoff-packet.v1.json |
      | llm-seed-data-proposal.v1.json |
      | seed-data.receipt.v1.json |
      | llm-end-user-session.v1.json |
      | end-user-test-session.md |
      | llm-user-experience.report.md |
      | acceptance-criteria-review.v1.json |
      | acceptance-criteria-review.report.md |
      | qa-evidence-bundle.manifest.v1.json |
      | qa-evidence-bundle.report.md |
      | qa-gate-decision.v1.json |
      | machine-environment.v1.json |
      | feature-proof-links.v1.json |
      | report-artifact-index.v1.json |
      | blocker-worklist.md |
    And each artifact should include the release candidate id, QA run id, feature id, and scenario id
    And the bundle manifest should include content hashes for every artifact.

```

## Acceptance Criteria

- Then the bundle should include:
- And each artifact should include the release candidate id, QA run id, feature id, and scenario id
- And the bundle manifest should include content hashes for every artifact.

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

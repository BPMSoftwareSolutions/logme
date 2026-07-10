# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: evidence-receipt-coverage--write-report-evidence-packet--live-gemini
- Feature id: evidence-receipt-coverage
- Scenario id: write-report-evidence-packet
- Scenario name: Write report evidence packet
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write report evidence packet
    Given a report run has completed
    When the receipt writer runs
    Then it should write an evidence packet containing:
      | artifact |
      | method-inventory.v1.json |
      | report-contract.v1.json |
      | report.md |
      | report-generation.receipt.v1.json |
      | telemetry.events.v1.jsonl |
      | report-validation.v1.json |
      | features/<feature-id>/feature-evidence-index.report.md |
      | features/<feature-id>/scenarios/<scenario-id>/executable-body-contract.report.md |
      | features/<feature-id>/scenarios/<scenario-id>/executable-body-tree.ascii.md |
      | features/<feature-id>/scenarios/<scenario-id>/execution-timeline.table.md |
      | features/<feature-id>/scenarios/<scenario-id>/method-execution-timeline.table.md |
      | features/<feature-id>/scenarios/<scenario-id>/method-call-evidence.report.md |
      | features/<feature-id>/scenarios/<scenario-id>/feature-execution.contract.v1.json |
      | features/<feature-id>/scenarios/<scenario-id>/feature-execution.receipt.v1.json |
      | domain-analysis/domain-body-analysis.contract.v1.json |
      | domain-analysis/domain-body-analysis.report.md |
      | sprawl/domain-body-sprawl.contract.v1.json |
      | sprawl/domain-body-sprawl.report.md |
      | sprawl/domain-body-sprawl-hotspots.table.md |
    And report.md should link to each artifact using repo-relative paths.

```

## Acceptance Criteria

- Then it should write an evidence packet containing:
- And report.md should link to each artifact using repo-relative paths.

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

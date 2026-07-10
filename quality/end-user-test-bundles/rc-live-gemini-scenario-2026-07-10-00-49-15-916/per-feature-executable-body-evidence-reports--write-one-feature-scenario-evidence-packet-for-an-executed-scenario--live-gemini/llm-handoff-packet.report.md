# LLM QA Handoff Packet: rc-live-gemini-scenario-2026-07-10-00-49-15-916

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- QA run id: per-feature-executable-body-evidence-reports--write-one-feature-scenario-evidence-packet-for-an-executed-scenario--live-gemini
- Feature id: per-feature-executable-body-evidence-reports
- Scenario id: write-one-feature-scenario-evidence-packet-for-an-executed-scenario
- Scenario name: Write one feature scenario evidence packet for an executed scenario
- Provider: Gemini
- Model: gemini-2.5-flash

## Feature Gherkin

```gherkin
  Scenario: Write one feature scenario evidence packet for an executed scenario
    Given a feature with feature id `<feature-id>` is executed by an end-to-end test, demo run, PI validation run, or local feature truth command
    And the executed scenario id is `<scenario-id>`
    And the run id is `<run-id>`
    When the feature execution completes
    Then the run should write a feature evidence packet under:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/
      """
    And the packet should contain:
      | artifact |
      | executable-body-contract.report.md |
      | executable-body-tree.ascii.md |
      | execution-timeline.table.md |
      | method-execution-timeline.table.md |
      | method-call-evidence.report.md |
      | feature-execution.contract.v1.json |
      | telemetry.tieout.v1.json |
      | receipt-coverage.v1.json |
      | promotion-decision.v1.json |
      | feature-execution.receipt.v1.json |
    And every artifact should include the same run id, feature id, and scenario id
    And `feature-execution.contract.v1.json` should be the source of truth for all report timing, call-count, receipt, and status facts.

```

## Acceptance Criteria

- And the executed scenario id is `<scenario-id>`
- And the run id is `<run-id>`
- Then the run should write a feature evidence packet under:
- And the packet should contain:
- And every artifact should include the same run id, feature id, and scenario id
- And `feature-execution.contract.v1.json` should be the source of truth for all report timing, call-count, receipt, and status facts.

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

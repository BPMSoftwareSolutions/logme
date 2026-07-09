```gherkin
Feature: Evidence receipt coverage

  As an enterprise product owner
  I want every report run to write durable evidence
  So that report.md can be independently challenged.

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
      | features/<feature-id>/scenarios/<scenario-id>/feature-execution.contract.v1.json |
      | features/<feature-id>/scenarios/<scenario-id>/feature-execution.receipt.v1.json |
      | sprawl/domain-body-sprawl.contract.v1.json |
      | sprawl/domain-body-sprawl.report.md |
      | sprawl/domain-body-sprawl-hotspots.table.md |
    And report.md should link to each artifact using repo-relative paths.

  Scenario: Block evidence packet without human report surface
    Given a run writes canonical JSON evidence for feature execution or sprawl detection
    But the corresponding Markdown report is missing
    When the report truth gate runs
    Then the report verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | evidence-json-without-human-report |
    And `report.md` should not present the JSON-only evidence as product-owner ready.

  Scenario: Block verdict promotion without receipt
    Given report.md claims a passing or sterile verdict
    But the report-generation receipt does not exist
    When the PI readiness gate runs
    Then the PI verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | report-verdict-without-receipt |
```

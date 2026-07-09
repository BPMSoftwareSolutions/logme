```gherkin
Feature: Per-feature executable body evidence reports

  As an adversarial product owner
  I want every executed feature scenario to write its own executable body contract report
  So that each scenario can prove its runtime body without stuffing every sketch into one global report.

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

  Scenario: Render the executable body tree in the feature report
    Given a feature evidence packet exists
    When `executable-body-contract.report.md` is rendered
    Then the first product-facing section should be the hierarchical ASCII executable body tree
    And the tree should be generated from the feature's executable body contract and runtime evidence
    And the tree should show:
      | proof lane |
      | acceptance source |
      | contract path |
      | runtime path and line range |
      | telemetry event path |
      | observed runtime step |
      | observed timestamp |
      | observed duration ms |
      | receipt path |
      | status |
      | blocker and fix route when blocked |
    And dense method tables should be optional supporting detail below the tree.

  Scenario: Keep the global report as an index, not a sketch warehouse
    Given one or more feature scenario evidence packets were written for a run
    When the global `report.md` is rendered
    Then it should show a compact feature evidence index with:
      | field |
      | feature id |
      | scenario id |
      | feature verdict |
      | blocker count |
      | evidence packet path |
      | executable body report path |
      | execution timeline table path |
      | method timeline table path |
      | method evidence report path |
    And the global report should not embed every feature's full executable body tree
    And the global report should link to each feature-scoped report using repo-relative evidence paths.

  Scenario: Block scenario promotion when feature evidence report is missing
    Given a feature scenario was executed during an end-to-end test, demo run, or PI validation run
    But no feature evidence packet exists under `evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/`
    When the feature promotion gate runs
    Then the feature scenario verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | feature-executable-body-report-missing |
    And no global report should mark the scenario promotion-ready.

  Scenario: Do not promote unexecuted features
    Given a committed feature scenario exists in Gherkin or planning scope
    But the scenario was not executed in the current run
    When the global report renders the feature evidence index
    Then the scenario should show `not executed`
    And it should not show PASS, STERILE, observed telemetry, written receipts, SLO met, or SLA satisfied for that run
    And the scenario should not have a generated evidence packet unless execution actually occurred.

  Scenario: Keep generated run evidence out of source control
    Given feature evidence packets are generated under `evidence/runs/`
    When the developer checks source-control status
    Then generated run evidence should not be staged or committed by default
    And source control should keep only contracts, templates, schemas, and tests
    And CI may publish run evidence as build artifacts outside the committed source tree.

  Scenario: Preserve feature evidence from source-controlled templates
    Given product-owned report templates and layout contracts are source controlled
    And generated feature evidence is not source controlled
    When a product owner changes the feature report template
    And a feature run is executed again
    Then the regenerated feature evidence report should use the updated template
    And no code deployment should be required for layout-only changes.
```

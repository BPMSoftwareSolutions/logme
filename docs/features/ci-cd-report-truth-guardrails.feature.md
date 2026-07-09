```gherkin
Feature: CI/CD report truth guardrails

  As an adversarial product owner
  I want CI/CD to enforce report truth before merge or promotion
  So that local generated projections cannot bypass evidence, schema, or verdict rules.

  Scenario: Block pull request when report truth validation fails
    Given a pull request changes report rendering, report contracts, source inventory, domain audit behavior, or Gherkin acceptance criteria
    When the CI report truth workflow runs
    Then it should run:
      | gate |
      | unit tests |
      | Gherkin traceability check |
      | report contract generation |
      | report schema validation |
      | summary-to-row validator |
      | verdict derivation validator |
      | path portability validator |
      | evidence receipt validator |
    And the pull request should fail if any gate fails.

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
    And the pull request summary should link to the artifact.

  Scenario: Block stale local report projection
    Given `report.md` is ignored by Git
    And a developer has a locally generated report
    When CI regenerates the report contract from the pull request source
    Then CI should ignore the developer's local `report.md`
    And CI should compare only freshly generated evidence
    And any stale local projection should have no promotion authority.

  Scenario: Block false pass in promotion workflow
    Given CI generated report evidence exists
    And the report claims `STERILE DOMAIN BODY` or any PASS-style verdict
    When the promotion workflow evaluates the evidence packet
    Then every hard-law blocker should be zero
    And the report schema should be valid
    And the freshness gate should pass
    And every required receipt should exist
    And every report section should trace to Gherkin acceptance criteria
    And promotion should fail if any proof is missing.
```

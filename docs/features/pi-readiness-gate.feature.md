```gherkin
Feature: PI readiness gate for report truth

  As an enterprise product owner
  I want the PI to pass only when the report projection is truthful and consistent
  So that leadership sees evidence, not aspiration.

  Scenario: Block PI readiness when report truth is incomplete
    Given the PI includes the report truth projection work
    And one or more report truth features lack schema, tests, telemetry, receipts, or Gherkin traceability
    When the PI readiness gate runs
    Then the PI verdict should be BLOCKED
    And the control report should show the top blocker for each report feature.

  Scenario: Pass PI readiness
    Given every report feature has:
      | requirement |
      | Gherkin acceptance criteria |
      | schema-enforced contract |
      | implementation tests |
      | source inventory tie-out |
      | telemetry or explicit no-telemetry label |
      | receipt coverage |
      | adversarial challenge packet |
    When the PI readiness gate runs
    Then the PI verdict should be PASS
    And report.md may be promoted as a truthful projection for that run.
```

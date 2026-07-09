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
      | end-user QA evidence bundle |
      | human-readable QA report |
      | machine provenance |
    When the PI readiness gate runs
    Then the PI verdict should be PASS
    And report.md may be promoted as a truthful projection for that run.

  Scenario: Block PI readiness without end-user QA proof
    Given one or more PI-scoped scenarios are implemented or proposed as releasable
    But no QA evidence bundle exists for the release candidate
    When the PI readiness gate runs
    Then the PI verdict should be BLOCKED
    And the control report should link to the missing QA proof requirement
    And the finding code should be:
      | finding |
      | pi-scope-without-end-user-qa-proof |
```

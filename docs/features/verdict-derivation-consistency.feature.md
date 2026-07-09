```gherkin
Feature: Verdict derivation consistency

  As an enterprise product owner
  I want report verdicts to be derived from hard laws
  So that a verdict cannot be stronger than the evidence below it.

  Scenario: Block sterile verdict when any hard law is violated
    Given the hard laws include "No local executable method without LogMe"
    And the report has one silent local method
    When the verdict is derived
    Then the verdict should be `DOMAIN BODY CONTAMINATED`
    And the report should show the silent method finding.

  Scenario: Allow sterile verdict only when all gates pass
    Given all local executable methods have LogMe testimony
    And no generic utility methods are inside the domain body
    And no anonymous executable methods exist
    And no method is outside the declared domain vocabulary
    And no unimplemented stub is reported as domain-bound code
    And the report contract schema is valid
    And the report freshness gate passes
    When the verdict is derived
    Then the verdict may be `STERILE DOMAIN BODY`.
```

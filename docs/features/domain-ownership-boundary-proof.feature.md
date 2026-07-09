```gherkin
Feature: Domain ownership boundary proof

  As an enterprise architect
  I want each domain-bound method to prove why it belongs to the domain
  So that package mechanics are not silently counted as domain truth.

  Scenario: Require ownership evidence for domain-bound methods
    Given a method is counted as domain-bound
    When the report ownership validator runs
    Then the method should show one of:
      | ownership proof |
      | declared file-system body contract path |
      | declared feature contract path |
      | package governance contract path |
      | explicit domain vocabulary ownership rule |
    And `domainBoundMethods` should count only methods with ownership proof.

  Scenario: Block package-governed claim without package receipt
    Given the report says external package methods are ignored or package-governed
    But no package governance contract or receipt path is rendered
    When the report is validated
    Then the report should show the package scope as UNVERIFIED
    And the finding code should be:
      | finding |
      | package-governance-unproven |
```

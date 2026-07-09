```gherkin
Feature: Summary, findings, and method row tie-out

  As an adversarial product owner
  I want every summary number to be recomputed from method rows and findings
  So that the report cannot show a clean verdict with dirty details.

  Scenario: Recompute summary from method rows
    Given the report method table contains method rows
    When the report validator recomputes summary metrics
    Then `localExecutableMethods` should equal the number of method rows
    And `methodsWithLogMeCall` should equal rows where LogMe is `yes`
    And `silentLocalMethods` should equal rows where LogMe is `no`
    And `methodsWithLogMeCall + silentLocalMethods` should equal `localExecutableMethods`
    And `coverage` should equal `methodsWithLogMeCall / localExecutableMethods`

  Scenario: Tie findings to table rows
    Given a finding references a file path, method name, and reason
    When the report validator checks the finding
    Then the method table should contain a row with the same file path and method name
    And the row state should explain the finding
    And duplicate method names should be disambiguated by file path and line range.

  Scenario: Block clean label with nonzero findings
    Given the report contains one or more findings
    When report.md is rendered
    Then the Findings section should not show the configured clean findings label
    And the verdict should not be `STERILE DOMAIN BODY`
    And the finding code should be:
      | finding |
      | clean-label-with-findings |
```

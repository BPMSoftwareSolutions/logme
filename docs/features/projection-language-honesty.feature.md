```gherkin
Feature: Projection language honesty

  As an adversarial product owner
  I want report labels to match the evidence behind them
  So that readers do not confuse source inventory order with runtime execution proof.

  Scenario: Label inventory order honestly
    Given method ordering is derived from source scan order
    And no runtime telemetry event is tied to the method row
    When the method table is rendered
    Then the column should be labeled `Inventory Step`
    And the report should not call it `Execution Step`.

  Scenario: Allow execution step only with telemetry evidence
    Given a method row has a declared execution signature step
    And telemetry has an observed event for the same step id
    And the event references the same file path and method name
    When the method table is rendered
    Then the column may be labeled `Execution Step`
    And the row should show declared step, observed step, telemetry status, and receipt status.

  Scenario: Separate source location from runtime observation
    Given a method is discovered by static source inventory
    When the method table is rendered
    Then the report should show source facts as:
      | source fact |
      | declared path |
      | method name |
      | method kind |
      | line start |
      | line end |
      | inventory step |
    And the report should show runtime facts only from telemetry as:
      | runtime fact |
      | observed runtime step |
      | first observed at |
      | last observed at |
      | duration ms |
      | telemetry status |
    And the report should not derive runtime facts from scan order, file order, or line numbers.

  Scenario: Mark unobserved runtime methods explicitly
    Given a method is present in source inventory
    But no telemetry event is observed for that method during the run
    When the method table is rendered
    Then runtime step should be `not observed`
    And first observed at should be `not observed`
    And duration ms should be `not observed`
    And telemetry status should be `missing`
    And the row should not show `0ms`, blank duration, or any value that can be read as successful runtime observation.

  Scenario: Require duration evidence for execution time
    Given telemetry observes a method during runtime
    When the report renders execution timing
    Then duration ms should come from a telemetry event containing start and end time or an explicit duration
    And the telemetry event should reference the same method name and source path as the method inventory row
    And the report should block execution timing claims when duration evidence is missing.

  Scenario: Block proof language without evidence paths
    Given the report text contains "proof", "supported", "runtime", "execution", or "receipt"
    But the report does not include an evidence path for that claim
    When the report language validator runs
    Then the report should be BLOCKED
    And the finding code should be:
      | finding |
      | projection-language-overclaim |
```

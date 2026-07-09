```gherkin
Feature: Data-driven report layout

  As an adversarial product owner
  I want report structure and presentation controlled by validated contracts and templates
  So that I can change the report format without deploying source code.

  Scenario: Change report section order without code changes
    Given the report layout contract declares section order
    And the report renderer reads the layout contract at generation time
    When a product owner changes section order in the layout contract
    And the report generator runs
    Then report.md should render sections in the new order
    And no application source code change should be required.

  Scenario: Change report labels without code changes
    Given the report layout contract declares product-facing labels
    When a product owner changes a section title, field label, status label, or promotion label in the layout contract
    And the report generator runs
    Then report.md should render the updated labels
    And the underlying evidence fields should remain schema-validated.

  Scenario: Change ASCII execution sketch without code changes
    Given the ASCII execution sketch is declared in a template file
    And the template references report data using declared variables
    When a product owner changes sketch spacing, grouping, labels, or visible fields in the template
    And the report generator runs
    Then report.md should reflect the updated sketch
    And no renderer code change should be required
    And every template variable should resolve against the report data contract.

  Scenario: Validate report layout contract before rendering
    Given the report layout contract is loaded
    When layout validation runs
    Then the contract should define:
      | field |
      | schema version |
      | report title |
      | section order |
      | section ids |
      | section templates |
      | required data fields |
      | optional data fields |
      | blocker display rules |
      | promotion display rules |
    And report.md should be rendered only after layout validation passes.

  Scenario: Block template variable that has no data source
    Given a report template references a variable
    But the variable is not declared in the report data contract
    When the report generator validates templates
    Then generation should fail
    And the finding code should be:
      | finding |
      | report-template-variable-unbound |
    And report.md should not be written with a blank, invented, or misleading value.

  Scenario: Block product template from weakening truth gates
    Given a product owner changes the report layout contract or template
    When the report generator validates truth gates
    Then the template should not be able to hide:
      | required truth |
      | verdict |
      | blocker count |
      | stale provenance |
      | silent local methods |
      | anonymous executable methods |
      | missing telemetry |
      | missing receipt |
      | promotion decision |
    And generation should fail if the layout omits required truth fields.

  Scenario: Keep renderer code as a generic engine
    Given report layout, section order, labels, and ASCII sketches are declared in contracts or templates
    When a report presentation change is requested
    Then the expected change should be made in product-owned report contracts or templates
    And renderer source code should change only when a new rendering primitive, validator, or data field is needed.
```

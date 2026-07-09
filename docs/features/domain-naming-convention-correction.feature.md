```gherkin
Feature: Domain naming convention correction

  As an enterprise architect
  I want the domain body to use one correct, unambiguous package name
  So that a leftover experimental name cannot cause confusion about which contract, path, or identifier is authoritative.

  Background:
    The declared file-system body contract, its `featureId` and `bodyId` fields, and the
    `contracts/domains/`, `contracts/gates/`, and `contracts/templates/` directories were
    originally authored under an experimental name, `logme2`. That name was a typo carried
    over from an earlier experiment and was never meant to survive into the current domain
    body. The correct domain name is `logme`, matching `package.json`, `README.md`, and
    every other authoritative reference in this repository.

  Scenario: Rename the declared file-system body contract
    Given the declared file-system body contract file is named
      `contracts/file-system-bodies/02_declared/logme2.file-system-body.contract.v1.json`
    When the domain naming convention correction is applied
    Then the file should be renamed to
      `contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json`
    And its `featureId` field should read `logme`
    And its `bodyId` field should read `logme.workspace-observability-domain`
    And no file named with `logme2` should remain declared as required.

  Scenario: Rename domain, gate, and template directories
    Given domain contracts live under `contracts/domains/logme2/`
    And gate contracts live under `contracts/gates/logme2/`
    And templates live under `contracts/templates/logme2/`
    When the domain naming convention correction is applied
    Then the directories should be renamed to `contracts/domains/logme/`,
      `contracts/gates/logme/`, and `contracts/templates/logme/`
    And every path string inside contract JSON files, source modules, and tests
      that references the old directories should be updated to the renamed paths
    And no runtime read or write should target a `logme2` path.

  Scenario: Update every in-repo reference after the rename
    Given source modules, tests, and documentation reference `logme2` paths or identifiers
    When the domain naming convention correction is applied
    Then every reference in `src/`, `packages/`, `tests/`, `contracts/`, and `docs/`
      should be updated to the corresponding `logme` path or identifier
    And the test suite should pass with no reference to `logme2` remaining anywhere in the repository
    And the report-truth gate should pass with the renamed contract in place.

  Scenario: Block reintroduction of the retired name
    Given the domain naming convention correction has been applied
    When a future change adds a new file, directory, or identifier containing `logme2`
    When the report generator or test suite runs
    Then the change should be treated as a naming regression
    And the finding code should be:
      | finding |
      | retired-domain-name-reintroduced |
    And the report should not promote a verdict while the retired name is present.
```

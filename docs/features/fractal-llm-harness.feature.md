```gherkin
Feature: Fractal LLM harness

  As a LogMe operator
  I want an LLM to generate bounded harnesses for its own future execution
  So that AI-assisted development becomes recursively governed, observable, and self-verifying.

  Scenario: LLM generates a child harness from a parent harness contract
    Given a parent harness has a declared executable body contract
    And the parent harness has passed self-conformance
    And the LLM receives an allowed harness-generation assignment
    When the LLM generates a child harness proposal
    Then the child harness should include a body contract
    And the child harness should include an execution path
    And the child harness should include tests
    And the child harness should include telemetry testimony requirements
    And the child harness should include receipt coverage
    And the proposal should not be promoted automatically.

  Scenario: Generated harness proves its own execution
    Given an LLM-generated child harness has been materialized in an allowed path
    When the child harness executes its first flow
    Then every declared executable node should testify
    And telemetry should match the child harness execution order
    And every receipt-writing node should write proof
    And the child harness should produce a self-conformance report.

  Scenario: Child harness proposes the next harness
    Given a child harness has passed self-conformance
    When the child harness proposes a grandchild harness
    Then the proposal should be stored as proposed only
    And the parent verifier should validate the proposal
    And promotion should require receipt-backed evidence.

  Scenario: LLM unsafe output is blocked
    Given the LLM proposes a harness that mutates outside allowed paths
    Or claims verification without telemetry
    Or invents receipt evidence
    When the verifier reviews the generated harness
    Then the harness should be blocked
    And a blocker receipt should be written
    And no code should be promoted.
```

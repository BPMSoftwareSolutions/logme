```gherkin
Feature: LLM domain body analysis and tie-out

  As an adversarial product owner
  I want an LLM-ready domain body analysis of the repository
  So that executable files have action-bearing names, declared meaning, decomposition guidance, and feature/scenario tie-out before promotion.

  Scenario: Analyze executable file-name grammar
    Given LogMe discovers executable source files in the configured workspace
    When domain body analysis runs
    Then each executable file should be classified by file-name grammar:
      | classification |
      | action-bearing |
      | action-bearing-with-late-verb |
      | noun-or-capability-label |
      | non-executable |
    And an executable file without an action-bearing verb should receive:
      | finding |
      | executable-file-name-missing-action-verb |
    And the finding should explain that noun-only or capability-label files become responsibility dumping grounds.

  Scenario: Tie every executable file to a file-body contract
    Given a source file contains executable methods
    When domain body analysis compares the file to declared body contracts
    Then the analysis should list every owning body contract
    And a file with no declaring body contract should receive:
      | finding |
      | file-body-contract-missing |
    And the recommended fix should name the contract or owned package boundary that must authorize the file.

  Scenario: Tie file bodies to features and scenarios
    Given an executable file belongs to a feature implementation
    When domain body analysis inspects the file body
    Then the file should tie to one or more feature ids and scenario ids
    And a file with no scenario tie-out should receive:
      | finding |
      | scenario-tieout-missing |
    And the analysis should not treat a method name, folder name, or loose report text as scenario proof.

  Scenario: Recommend decomposition without promoting the LLM recommendation
    Given an executable file has many responsibilities, multiple method-action clusters, or an actionless file name
    When domain body analysis builds decomposition guidance
    Then it should propose durable action-bearing boundaries
    And each proposed boundary should include:
      | field |
      | proposed file path |
      | reason |
      | source method names |
      | contract action required |
    And the finding code should be:
      | finding |
      | decomposition-recommended |
    And the LLM may narrate or challenge the recommendation
    But deterministic gates should decide whether the repository is promotable.

  Scenario: Produce an LLM handoff artifact from deterministic facts
    Given domain body analysis has completed
    When an LLM receives the analysis packet
    Then the packet should be a machine-readable JSON artifact
    And it should include only deterministic facts:
      | fact |
      | file path |
      | executable method count |
      | file-name grammar classification |
      | owning body contracts |
      | feature ids |
      | scenario ids |
      | responsibility clusters |
      | decomposition recommendations |
      | finding codes |
    And the LLM should not invent ownership, scenario proof, or promotion status.
    And the JSON handoff should be concise enough for a bounded worker assignment
    And the Markdown report should link to the JSON handoff instead of embedding all handoff facts.

  Scenario: Keep the Markdown analysis report product-owner readable
    Given domain body analysis has completed
    When the Markdown analysis report is rendered
    Then it should summarize:
      | section |
      | executive metrics |
      | product-owner interpretation |
      | priority work queues |
      | top domain body risks |
      | links to canonical JSON and LLM handoff JSON |
    And it should not dump every executable file into the Markdown body
    And it should not embed the full LLM handoff table
    And exhaustive machine facts should remain in JSON artifacts.
```

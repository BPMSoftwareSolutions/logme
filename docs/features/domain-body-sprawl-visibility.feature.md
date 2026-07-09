```gherkin
Feature: Domain body sprawl visibility

  As an adversarial product owner
  I want LogMe to report files that are accumulating too much responsibility
  So that durable product meaning stays visible, cohesive, and intentionally placed.

  Scenario: Inventory file responsibility signals
    Given LogMe scans the configured domain body
    When the sprawl inventory runs
    Then it should write a sprawl evidence JSON artifact at:
      """
      evidence/runs/<run-id>/sprawl/domain-body-sprawl.contract.v1.json
      """
    And each source file entry should include:
      | field |
      | file path |
      | package or domain scope |
      | line count |
      | byte count |
      | executable method count |
      | exported symbol count |
      | imported module count |
      | local nested function count |
      | domain vocabulary tokens |
      | responsibility clusters |
      | side-effect lanes |
      | feature ids referenced |
      | contract paths referenced |
      | generic mechanic candidates |
      | finding codes |
    And the human report should be rendered from this JSON artifact, not hand-authored prose.

  Scenario: Detect god-file candidates without automatically condemning them
    Given a source file has many executable methods, many lines, or many responsibility clusters
    When the sprawl classifier runs
    Then the file should be classified as one of:
      | classification |
      | focused |
      | watchlist |
      | god-file candidate |
      | package extraction candidate |
      | authorized dense orchestrator |
    And a `god-file candidate` should include the signals that triggered it
    And the report should not require a product owner to infer risk from line count alone
    And the finding code should be:
      | finding |
      | god-file-candidate |

  Scenario: Keep product meaning separate from generic mechanics
    Given a domain source file contains local methods that perform generic mechanics
    And the method names or bodies do not express domain responsibility
    When the sprawl classifier runs
    Then those methods should be reported as package extraction candidates
    And generic mechanics should include:
      | mechanic |
      | slug/string formatting |
      | CSV escaping or projection |
      | file line reading |
      | path joining or path normalization |
      | sorting comparators |
      | timestamp arithmetic |
      | table formatting |
      | schema-agnostic JSON writing |
    And the finding code should be:
      | finding |
      | package-worthy-mechanic-inside-domain-body |
    And the fix route should name a package destination or explain why the mechanic is domain-specific.

  Scenario: Preserve intentional domain cohesion
    Given a file is large because it owns a single cohesive domain responsibility
    And the file's declared body contract or module contract authorizes that responsibility
    When the sprawl classifier runs
    Then the file may be classified as `authorized dense orchestrator`
    And the report should show the authorizing contract path
    And the report should still show line count, method count, and responsibility clusters
    And authorization should not hide the file from the sprawl report.

  Scenario: Detect mixed responsibility clusters in one file
    Given one source file contains methods from multiple product responsibilities
    When responsibility clustering runs
    Then the report should show each detected cluster
    And clusters should be derived from:
      | signal |
      | method name vocabulary |
      | imported modules |
      | referenced feature ids |
      | referenced contract paths |
      | receipt paths written |
      | rendering or projection responsibilities |
      | validation or gate responsibilities |
      | IO and side-effect lanes |
    And files with unrelated clusters should be reported with:
      | finding |
      | mixed-responsibility-file |
    And the fix route should suggest the next durable boundary, not a mechanical split.

  Scenario: Detect artifact sprawl across directories
    Given feature code, contracts, tests, reports, receipts, or templates are introduced
    When the sprawl inventory runs
    Then it should verify that related artifacts follow the declared file-system body contract
    And it should report:
      | finding |
      | orphan-source-file |
      | orphan-test-file |
      | orphan-contract-file |
      | scattered-feature-artifact |
      | undeclared-generated-artifact |
    And each finding should include the expected home or declared owner.

  Scenario: Roll up method-level sterility findings into file-level sprawl hotspots
    Given the domain sterility gate reports local method findings
    When the sprawl report is rendered
    Then findings should be grouped by file so the product owner can see responsibility concentration
    And grouped sterility signals should include:
      | signal |
      | local method without testimony |
      | anonymous executable method |
      | method name outside domain vocabulary |
      | local generic utility detected |
      | unimplemented stub detected |
    And a file with many grouped findings should appear as a top sprawl hotspot
    And the report should distinguish:
      | hotspot type |
      | missing observability discipline |
      | anonymous local callback sprawl |
      | generic package-worthy mechanics |
      | unclear domain vocabulary |
      | unimplemented source body |

  Scenario: Render product-owner sprawl report
    Given `domain-body-sprawl.contract.v1.json` exists for a run
    When the global `report.md` is rendered
    Then it should include a compact sprawl summary with:
      | field |
      | total source files scanned |
      | focused files |
      | watchlist files |
      | god-file candidates |
      | package extraction candidates |
      | mixed-responsibility files |
      | orphan artifacts |
      | top sprawl hotspots |
    And each hotspot should show:
      | field |
      | file path |
      | classification |
      | line count |
      | executable method count |
      | responsibility cluster count |
      | generic mechanic count |
      | finding codes |
      | one-line fix route |
    And dense per-method detail should live in the sprawl evidence artifact or a linked sprawl report.

  Scenario: Block promotion only for severe unowned sprawl
    Given the sprawl report contains watchlist files
    When the report truth gate runs
    Then watchlist files should not block promotion by themselves
    But a file should block promotion when it has:
      | blocker |
      | generic mechanics inside the domain body with no package extraction decision |
      | mixed responsibilities with no authorizing contract |
      | generated artifacts under source-controlled domain paths |
      | source files not declared by the file-system body contract |
    And blocking findings should appear before dense method tables
    And the product owner should see whether the issue is a product-boundary problem or a package-extraction problem.

  Scenario: Make sprawl thresholds product-owned
    Given sprawl thresholds are declared in a contract
    When the sprawl classifier runs
    Then thresholds should be loaded from product-owned configuration
    And supported threshold fields should include:
      | threshold |
      | max lines before watchlist |
      | max executable methods before watchlist |
      | max responsibility clusters before god-file candidate |
      | max generic mechanics before package extraction candidate |
      | max side-effect lanes before orchestrator review |
      | authorized dense orchestrator paths |
    And changing a threshold should not require changing classifier code.
```

```gherkin
Feature: Method-level execution drill-down

  As an adversarial architect and product owner
  I want every executed feature body node to expand into method-by-method runtime proof
  So that I can see exactly how the feature moved through the code body, with timing, telemetry, and receipt evidence.

  Scenario: Preserve the three-level execution review model
    Given a feature scenario has canonical execution proof
    When the human execution report is generated
    Then the report should expose three drill-down levels:
      | level | question answered | projection |
      | 01 Executive flow | Can I trust this run? | report truth sketch |
      | 02 Body-node flow | Which executable body nodes ran? | executable body tree |
      | 03 Method-by-method flow | Which methods executed inside each node, in what order, with what evidence? | method execution drill-down |
    And the method drill-down should appear after the body-node sketch
    And the dense static method inventory should appear only after runtime execution proof
    And the report should not make an architect jump from a body node directly to a hundreds-row static method table.

  Scenario: Extend canonical JSON proof with method calls under each body node
    Given `feature-execution.contract.v1.json` exists for a feature scenario
    When method-level execution proof is built
    Then each observed execution node should contain `methodCalls`
    And each method call should include:
      | field |
      | call index |
      | method name |
      | method kind |
      | runtime file path |
      | source line range |
      | owning feature id |
      | owning scenario id |
      | owning node id |
      | owning node label |
      | contract path |
      | started at |
      | completed at |
      | duration ms |
      | elapsed since previous call ms |
      | elapsed since node start ms |
      | telemetry event ids |
      | telemetry event path |
      | receipt paths |
      | status |
      | blocker code |
      | fix route |
    And every method call should be ordered by observed runtime sequence
    And a method call without telemetry should use `not observed` for timing fields
    And a method call without required receipt proof should use `missing` for receipt fields
    And the JSON proof should not invent method calls from static inventory.

  Scenario: Distinguish discovered methods from observed method calls
    Given LogMe has a static source inventory
    And runtime telemetry exists for a scenario
    When method-level execution proof is rendered
    Then the report should distinguish:
      | concept | meaning | promotion authority |
      | discovered method | method found by static source scan | no runtime proof |
      | observed method call | method invocation proven by telemetry | runtime proof |
      | receipted method action | observed method call tied to durable receipt evidence | promotion proof |
    And the report should not label a discovered method as executed unless telemetry proves an observed call
    And the finding code for a false runtime claim should be:
      | finding |
      | static-method-presented-as-runtime-execution |

  Scenario: Tie method calls to telemetry event pairs
    Given raw telemetry events exist for a run
    When method-level execution proof is built
    Then each observed method call should tie to one or more telemetry event ids
    And the proof should support:
      | telemetry shape |
      | single call event with explicit duration |
      | start event and end event pair |
      | nested LogMe testimony events |
      | repeated calls to the same method |
    And `started at` should come from the earliest event for that call
    And `completed at` should come from the latest event for that call when available
    And `duration ms` should come from explicit telemetry duration or from observed start/end timestamps
    And if timing cannot be proven, duration should be `not observed`, not `0`.

  Scenario: Tie method calls to receipt proof
    Given a method call performs or participates in a receipted action
    When method-level receipt tie-out runs
    Then the method call should list the receipt paths that prove the action
    And each receipt path should be repo-relative
    And each receipt path should include a content hash or receipt id in the canonical JSON proof
    And a required receipt missing from disk should block that method call
    And the finding code should be:
      | finding |
      | method-call-receipt-missing |

  Scenario: Render method drill-down inside each body node
    Given `feature-execution.contract.v1.json` contains method calls under observed body nodes
    When `executable-body-contract.report.md` is rendered
    Then each body node should include a nested method drill-down shaped like:
      """
      [02] CANONICAL REQUEST BINDING
      |-- contract
      |   `-- contracts/<feature>/canonical-request.schema.v1.json
      |
      |-- runtime file
      |   `-- src/<feature>/canonical-request.js:20-38
      |
      |-- observed node telemetry
      |   |-- runtime step  : 2
      |   |-- first seen at : 2026-07-09T12:00:02.000Z
      |   |-- last seen at  : 2026-07-09T12:00:03.500Z
      |   |-- duration ms   : 475
      |   |-- elapsed prev  : 1000
      |   |-- call count    : 2
      |   `-- status        : observed
      |
      |-- method drill-down
      |   |-- call 001
      |   |   |-- method       : bindsCanonicalFeatureRequest
      |   |   |-- source       : src/<feature>/canonical-request.js:20-28
      |   |   |-- started at   : 2026-07-09T12:00:02.000Z
      |   |   |-- completed at : 2026-07-09T12:00:02.175Z
      |   |   |-- duration ms  : 175
      |   |   |-- elapsed prev : 1000
      |   |   |-- telemetry    : telemetry.events.v1.jsonl#evt-001,#evt-002
      |   |   |-- receipt      : canonical-request.receipt.v1.json
      |   |   `-- status       : ok
      |   |
      |   `-- call 002
      |       |-- method       : validatesCanonicalRequestShape
      |       |-- source       : src/<feature>/canonical-request.js:30-38
      |       |-- started at   : 2026-07-09T12:00:03.025Z
      |       |-- completed at : 2026-07-09T12:00:03.500Z
      |       |-- duration ms  : 300
      |       |-- elapsed prev : 850
      |       |-- telemetry    : telemetry.events.v1.jsonl#evt-003,#evt-004
      |       |-- receipt      : canonical-request.receipt.v1.json
      |       `-- status       : ok
      |
      `-- status
          `-- ok
      """
    And every timing, telemetry, receipt, and status value should match canonical JSON proof exactly.

  Scenario: Render runtime-file drill-down before method calls
    Given one body node executes methods from one or more runtime files
    When the method drill-down is rendered
    Then the body node should first show the participating runtime files
    And each runtime file row should include:
      | field |
      | runtime file path |
      | participating method count |
      | observed call count |
      | first seen at |
      | last seen at |
      | total duration ms |
      | slowest method |
      | receipt coverage status |
    And the method calls should be grouped under the runtime file when a node spans multiple files.

  Scenario: Render compact method timeline table
    Given method-level execution proof exists
    When scenario proof reporting completes
    Then it should write a Markdown method timeline table at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/method-execution-timeline.table.md
      """
    And every row should be generated from `feature-execution.contract.v1.json`
    And each row should include:
      | field |
      | runtime order |
      | body node id |
      | body node label |
      | runtime file |
      | method name |
      | call index |
      | started at |
      | completed at |
      | duration ms |
      | elapsed since previous call ms |
      | telemetry event ids |
      | receipt paths |
      | status |
      | blocker code |
    And the table should be safe to paste into architecture review notes, PI planning notes, dashboards, decks, or publications.

  Scenario: Render method evidence appendix for deep review
    Given method-level execution proof exists
    When scenario proof reporting completes
    Then it may write a detailed Markdown appendix at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/method-call-evidence.report.md
      """
    And the appendix should group method calls by:
      | grouping |
      | body node |
      | runtime file |
      | method name |
      | call index |
    And each method call should expose telemetry event ids, receipt paths, source line range, and blocker/fix route
    And the appendix should link back to `executable-body-contract.report.md`.

  Scenario: Preserve repeated method calls in order
    Given the same method is called more than once during a body node
    When method-level execution proof is built
    Then each call should have a stable call index
    And the method summary should include:
      | field |
      | call count |
      | first call started at |
      | last call completed at |
      | total duration ms |
      | minimum duration ms |
      | maximum duration ms |
      | average duration ms |
      | total wait between calls ms |
    And the report should show repeated calls without collapsing them into one invented aggregate.

  Scenario: Show slow methods and wait time as product signals
    Given method-level timing evidence exists
    When timing metrics are calculated
    Then the canonical JSON proof should identify:
      | metric |
      | slowest method call |
      | slowest runtime file |
      | longest wait between method calls |
      | total method execution time ms |
      | total observed wait time ms |
      | percent of node time spent in method execution |
      | percent of node time unaccounted for |
    And missing timing should be `not observed`
    And a method timing signal should never be calculated from line count, method count, or static source inventory.

  Scenario: Render blocked method call inline
    Given a body node has a method call missing telemetry or receipt evidence
    When the method drill-down is rendered
    Then the blocked method should appear inline under its body node
    And the blocked method should be shaped like:
      """
      [METHOD] inventoriesExecutableDomainMethods
      |-- source
      |   `-- src/inventories-executable-domain-methods/inventories-executable-domain-methods.js:32-64
      |
      |-- ownership
      |   |-- feature   : logme-domain-audit
      |   |-- scenario  : report-truth
      |   |-- body node : 03 INVENTORIES EXECUTABLE DOMAIN METHODS
      |   `-- contract  : contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json
      |
      |-- telemetry
      |   |-- status      : not observed
      |   |-- call index  : not observed
      |   |-- started at  : not observed
      |   |-- ended at    : not observed
      |   |-- duration ms : not observed
      |   `-- event ids   : not observed
      |
      |-- receipt
      |   `-- missing
      |
      `-- status
          |-- blocked
          |-- blocker : declared-method-but-silent
          `-- fix     : add LogMe testimony and write method-level receipt coverage
      """
    And blocked method details should appear before the dense static method inventory
    And the product owner should not have to infer the broken method from a global findings table.

  Scenario: Gate method drill-down projection against canonical JSON
    Given `method-execution-timeline.table.md`, `method-call-evidence.report.md`, or the method drill-down section exists
    When the feature report truth gate runs
    Then every method-level fact should tie back to `feature-execution.contract.v1.json`
    And every JSON method-call fact should tie back to raw telemetry or receipt evidence
    And the gate should fail when a report contains a method-level fact absent from JSON proof
    And the finding code should be:
      | finding |
      | method-drilldown-fact-without-json-proof |

  Scenario: Gate method drill-down completeness
    Given a body node is marked `observed`
    And the canonical JSON proof has no method calls for that body node
    When the method drill-down gate runs
    Then the body node should be marked `method detail missing`
    And the feature scenario should not be promoted as fully drill-down proven
    And the finding code should be:
      | finding |
      | observed-body-node-without-method-drilldown |
    And the report should still render the body node with a clear missing-detail blocker.

  Scenario: Keep method drill-down portable for HTML and visual review
    Given the Markdown proof report will be transformed into HTML, a dashboard, a deck, or a publication
    When method drill-down ASCII is rendered
    Then it should use only portable ASCII characters
    And it should fit in Markdown without relying on color or terminal-specific rendering
    And long method names should wrap or be summarized without hiding the full method name from the detailed appendix
    And HTML visual QA should verify that method call branches remain readable.
```

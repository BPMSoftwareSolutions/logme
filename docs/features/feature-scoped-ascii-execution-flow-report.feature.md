```gherkin
Feature: Feature-scoped ASCII execution flow report

  As an adversarial product owner
  I want each executed feature report to open with a clean ASCII execution sketch
  So that I can see that feature's runtime body, evidence, and blockers without decoding dense report prose.

  Scenario: Render executive execution flow first
    Given a feature-scoped executable body report has been generated from the current feature run contract
    When `evidence/runs/<run-id>/features/<feature-id>/executable-body-contract.report.md` is rendered
    Then the first product-facing section should be an ASCII execution flow sketch
    And the sketch should show:
      | element |
      | verdict |
      | run id |
      | declared source authority |
      | static source inventory |
      | telemetry observation |
      | receipt evidence |
      | blocker count |
      | promotion decision |
    And dense method tables should appear only after the sketch and blocker summary.

  Scenario: Render clean ASCII only
    Given the report is rendered for Markdown, terminal, and CI log review
    When the ASCII execution sketch is produced
    Then the sketch should use only portable ASCII characters:
      | character |
      | + |
      | - |
      | | |
      | ` |
      | > |
      | / |
      | \ |
    And the sketch should not depend on Unicode box drawing, emoji, color, or terminal-specific rendering.

  Scenario: Show declared versus observed flow
    Given the feature report has static source inventory for that feature
    And runtime telemetry exists for that feature run
    When the ASCII execution sketch is rendered
    Then it should separate:
      | lane |
      | declared flow |
      | observed telemetry |
      | receipt proof |
      | blockers |
    And runtime observation should come only from telemetry events
    And source inventory should not be presented as runtime execution.

  Scenario: Render executable body contract as file-system execution tree
    Given an executable body contract declares ordered execution nodes
    And each node may declare contract paths, runtime paths, telemetry paths, receipt paths, gates, or parity evidence
    When the ASCII execution sketch is rendered
    Then every declared body node should appear in execution order
    And each node should show:
      | field |
      | node id |
      | node label |
      | contract path |
      | runtime path |
      | source line range |
      | telemetry path |
      | observed runtime step |
      | observed duration ms |
      | receipt path |
      | status |
      | blocker |
    And missing telemetry should render as `not observed`
    And missing receipts should render as `missing`
    And no runtime observation field should be populated from the static contract alone.

  Scenario: Render required ASCII body tree shape
    Given an executable body contract declares ordered execution nodes
    When the ASCII execution sketch is rendered
    Then the report should include a tree shaped like:
      """
      +------------------------------------------------------------+
      | EXECUTABLE BODY TREE                                      |
      +------------------------------------------------------------+
      | 00 ACCEPTANCE SOURCE                                      |
      | contract  : docs/features/<feature>.feature.md      ok     |
      | runtime   : not executable                         n/a    |
      | telemetry : not required                           n/a    |
      | receipt   : not required                           n/a    |
      | status    : ok                                            |
      |                                                            |
      | 01 <NODE LABEL>                                           |
      | contract  : contracts/<contract>.json              ok     |
      | runtime   : src/<runtime-file>.js:<start>-<end>    ok     |
      | telemetry : evidence/runs/<run-id>/<events>.jsonl observed |
      | duration  : <duration-ms> ms                              |
      | receipt   : evidence/runs/<run-id>/<receipt>.json  written |
      | status    : ok                                            |
      +------------------------------------------------------------+
      """
    And every executable node should use the same contract/runtime/telemetry/duration/receipt/status row pattern
    And every path should be repo-relative
    And runtime rows should include source line range.

  Scenario: Render hierarchical ASCII executable body tree
    Given an executable body contract declares a product-readable execution spine
    When the ASCII execution sketch is rendered
    Then the report should include a hierarchical tree shaped like:
      """
      +----------------------------------------------------------------------+
      | EXECUTABLE BODY CONTRACT - FILE-SYSTEM EXECUTION TREE                |
      | Feature : <feature-id>                                               |
      | Scenario: <scenario-name>                                            |
      +----------------------------------------------------------------------+

      [00] ACCEPTANCE SOURCE
      |-- gherkin
      |   `-- docs/features/<feature>.feature.md
      |
      |-- acceptance criteria
      |   `-- contracts/file-system-bodies/<body>.contract.v1.json
      |
      `-- proves
          `-- <plain-language-proof>

      [01] SURFACE RECEIVES REQUEST
      |-- contract
      |   `-- contracts/commands/<surface-command>.command.v1.json
      |
      |-- runtime
      |   `-- src/<surface>/<entrypoint>.js:<line-start>-<line-end>
      |
      |-- telemetry
      |   |-- status        : observed
      |   |-- runtime step  : 1
      |   |-- first seen at : <timestamp>
      |   `-- duration ms   : <duration-ms>
      |
      |-- receipt
      |   `-- evidence/runs/<run-id>/<surface>.receipt.v1.json
      |
      `-- status
          `-- ok

      [02] CANONICAL REQUEST BINDING
      |-- contract
      |   `-- contracts/<feature>/canonical-request.schema.v1.json
      |
      |-- runtime
      |   `-- src/<feature>/canonical-request.js:<line-start>-<line-end>
      |
      |-- telemetry
      |   |-- status        : not observed
      |   |-- runtime step  : not observed
      |   |-- first seen at : not observed
      |   `-- duration ms   : not observed
      |
      |-- receipt
      |   `-- missing
      |
      `-- status
          |-- blocked
          |-- blocker : declared-but-silent
          `-- fix     : add runtime testimony and receipt proof

      [03] SHARED RUNNER EXECUTES
      |-- contract
      |   `-- contracts/file-system-bodies/<body>.contract.v1.json
      |
      |-- runtime
      |   `-- src/<feature>/runner.js:<line-start>-<line-end>
      |
      |-- telemetry
      |   `-- evidence/runs/<run-id>/telemetry.events.v1.jsonl
      |
      |-- receipt
      |   `-- evidence/runs/<run-id>/runner.receipt.v1.json
      |
      `-- status
          `-- ok
      """
    And the tree should use nested ASCII branches to show body ownership
    And the tree should appear before dense method tables
    And the tree should show blockers inline under the body node where truth broke.

  Scenario: Reject boxed node list when hierarchical body tree is required
    Given a feature-scoped executable body report contains an `EXECUTABLE BODY TREE` section
    But the section renders body nodes as flat boxed rows
    And the section does not render nested ASCII branches under each body node
    When the report presentation gate runs
    Then the report should fail
    And the finding code should be:
      | finding |
      | executable-body-tree-shape-mismatch |
    And the failure should explain that each node must contain branch groups for:
      | required branch |
      | contract |
      | runtime |
      | telemetry |
      | receipt |
      | status |

  Scenario: Require branch assertions in report tests
    Given the report renderer has tests for ASCII execution flow
    When the test suite validates the executable body tree
    Then the tests should assert that the rendered report contains branch lines matching:
      | required line pattern |
      | `[00] ACCEPTANCE SOURCE` |
      | `|-- gherkin` |
      | `` `-- docs/features/` |
      | `[01] ` |
      | `|-- contract` |
      | `|-- runtime` |
      | `|-- telemetry` |
      | `|   |-- status` |
      | `|   |-- runtime step` |
      | `` |   `-- duration ms `` |
      | `|-- receipt` |
      | `` `-- status `` |
    And the tests should fail when the report only contains a box title, node labels, and flat `contract :`, `runtime :`, `telemetry :`, `receipt :`, or `status :` rows.

  Scenario: Reject invented fallback execution body tree for promotion
    Given no explicit executable body contract nodes are provided
    And no product-owned report data contract declares `executionNodes`
    When the feature-scoped executable body report is rendered
    Then the renderer should not invent fallback body nodes
    And the report should show:
      """
      EXECUTABLE BODY TREE: missing
      """
    And promotion should be BLOCKED
    And the finding code should be:
      | finding |
      | executable-body-contract-missing |

  Scenario: Use fallback only as a non-promotable development diagnostic
    Given the renderer is running in an explicitly requested local diagnostic mode
    And no executable body contract nodes are available
    When a fallback sketch is rendered
    Then the fallback sketch should be labeled:
      """
      DIAGNOSTIC FALLBACK - NOT PROMOTION EVIDENCE
      """
    And the report verdict should not be promoted from the fallback sketch
    And telemetry, receipt, status, and duration fields should not show successful values unless backed by real evidence.

  Scenario: Render blocked ASCII body tree shape
    Given an executable body node is missing telemetry or receipt evidence
    When the ASCII execution sketch is rendered
    Then the report should include the blocked node inline like:
      """
      +------------------------------------------------------------+
      | EXECUTABLE BODY TREE                                      |
      +------------------------------------------------------------+
      | 03 <NODE LABEL>                                           |
      | contract  : contracts/<contract>.json              ok     |
      | runtime   : src/<runtime-file>.js:<start>-<end>    ok     |
      | telemetry : not observed                          missing |
      | duration  : not observed                                  |
      | receipt   : evidence/runs/<run-id>/<receipt>.json  missing |
      | status    : blocked                                       |
      | blocker   : <finding-code>                                |
      | fix       : <one-line-fix-route>                          |
      +------------------------------------------------------------+
      """
    And the blocked node should appear before the dense method table
    And the product owner should not need to infer the broken node from findings prose.

  Scenario: Reject header-only execution sketch
    Given a feature-scoped executable body report renders an ASCII execution sketch
    But it does not render ordered executable body nodes
    And it does not show contract, runtime, telemetry, receipt, status, and blocker per node
    When the report presentation gate runs
    Then the report should fail
    And the finding code should be:
      | finding |
      | executable-body-tree-missing |

  Scenario: Reject telemetry inferred from verdict
    Given a report verdict is `STERILE DOMAIN BODY`
    But no runtime telemetry event is tied to a body node
    When the ASCII execution sketch is rendered
    Then the node telemetry branch should show `not observed`
    And the report should not show `observed` because the verdict is clean
    And the report should fail promotion
    And the finding code should be:
      | finding |
      | telemetry-observation-inferred-from-verdict |

  Scenario: Reject duration inferred without timing evidence
    Given a body node has no telemetry event with start time, end time, or explicit duration
    When the ASCII execution sketch is rendered
    Then the duration branch should show:
      """
      duration ms   : not observed
      """
    And the report should not show `observed`, `0`, `0ms`, or blank duration as a successful timing value
    And the finding code should be:
      | finding |
      | runtime-duration-evidence-missing |

  Scenario: Preserve product-readable execution tree shape
    Given the executable body contract contains sections such as acceptance source, surface receipt, canonical binding, shared runner, root contract resolution, gates, routing, provider call, receipt writeback, and surface parity
    When the feature-scoped executable body report renders the body tree
    Then the report should keep the tree grouped by those body sections
    And each section should fit on screen without requiring the product owner to read a dense paragraph
    And every section should make the evidence route visible as:
      """
      contract -> runtime -> telemetry -> receipt -> status
      """
    And the report should show blockers directly under the section where truth broke.

  Scenario: Show blocked report as a worklist
    Given the generated report verdict is `DOMAIN BODY CONTAMINATED`
    When the ASCII execution sketch is rendered
    Then the sketch should show the blocked state before any dense details
    And it should list the top actionable findings as:
      | field |
      | finding code |
      | method |
      | source path |
      | line range |
      | telemetry status |
      | one-line fix route |
    And the report should not require a product owner to read the full method table to discover the blocker.

  Scenario: Render a compact happy-path sketch
    Given the report verdict is clean
    And every required runtime node has telemetry and receipt proof
    When the ASCII execution sketch is rendered
    Then the sketch should show:
      """
      +------------------------------------------------------------+
      | REPORT TRUTH                                               |
      +------------------------------------------------------------+
      | Verdict        : STERILE DOMAIN BODY                       |
      | Run            : <run-id>                                  |
      | Promotion      : ALLOWED                                   |
      +------------------------------------------------------------+
      | Gherkin -> Contract -> Source -> Telemetry -> Receipt      |
      |    ok         ok          ok        observed     written   |
      +------------------------------------------------------------+
      """
    And every `ok`, `observed`, or `written` label should be backed by evidence.

  Scenario: Render a compact blocked sketch
    Given the report verdict is contaminated
    When the ASCII execution sketch is rendered
    Then the sketch should show:
      """
      +------------------------------------------------------------+
      | REPORT TRUTH                                               |
      +------------------------------------------------------------+
      | Verdict        : DOMAIN BODY CONTAMINATED                  |
      | Promotion      : BLOCKED                                   |
      | Blockers       : <count>                                   |
      +------------------------------------------------------------+
      | Declared Source -> Static Inventory -> Telemetry -> Receipt |
      |       ok              has gaps          missing    unknown  |
      +------------------------------------------------------------+
      | Top blockers                                                |
      | 1. <finding-code> <path>:<line-start>-<line-end>            |
      |    fix: <one-line-fix-route>                               |
      +------------------------------------------------------------+
      """
    And the report should not bury the blocked state below prose or dense tables.
```

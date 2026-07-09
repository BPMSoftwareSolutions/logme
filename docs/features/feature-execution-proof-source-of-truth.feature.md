```gherkin
Feature: Feature execution proof source of truth

  As an adversarial product owner
  I want every executed feature scenario to produce canonical JSON execution proof
  So that human reports are readable projections of telemetry and receipts, not hand-authored claims.

  Scenario: Inventory every feature scenario and proof state
    Given committed feature files exist under `docs/features/`
    When the feature truth inventory runs
    Then it should discover every feature and scenario
    And it should write a run-scoped feature proof inventory containing:
      | field |
      | run id |
      | feature id |
      | feature name |
      | scenario id |
      | scenario name |
      | acceptance source path |
      | acceptance source line range |
      | implementation status |
      | proof status |
      | evidence packet path |
      | blocker codes |
    And proof status should be one of:
      | status |
      | not implemented |
      | implemented not executed |
      | executed blocked |
      | proven |
    And no scenario should be omitted because it has no implementation yet.

  Scenario: Write canonical JSON execution proof for a scenario
    Given a feature scenario has been executed by an end-to-end test, demo run, PI validation run, or local feature truth command
    And the run id is `<run-id>`
    And the feature id is `<feature-id>`
    And the scenario id is `<scenario-id>`
    When feature execution evidence is closed
    Then it should write canonical JSON proof at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/feature-execution.contract.v1.json
      """
    And the JSON proof should contain:
      | field |
      | schema version |
      | run id |
      | feature id |
      | scenario id |
      | scenario name |
      | generated at |
      | generator name |
      | acceptance source |
      | declared executable body |
      | observed execution timeline |
      | telemetry source paths |
      | receipt source paths |
      | timing metrics |
      | call count metrics |
      | blocker findings |
      | promotion decision |
    And every report field about execution should be derived from this JSON proof or explicitly marked `not observed`.

  Scenario: Write human-readable scenario proof report beside JSON proof
    Given `feature-execution.contract.v1.json` has been written for a scenario
    When scenario proof reporting completes
    Then it should write a Markdown proof report at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/executable-body-contract.report.md
      """
    And the report should be generated from `feature-execution.contract.v1.json`
    And the report should be suitable for product owners, architects, business owners, and PI planning review
    And the first product-facing section should be an ASCII execution sketch
    And the report should include:
      | section |
      | executive proof summary |
      | feature and scenario identity |
      | promotion decision |
      | ASCII executable body sketch |
      | ordered execution timeline |
      | timing and call-count metrics |
      | SLI summary |
      | SLO evaluation |
      | SLA support evidence |
      | blocker worklist |
      | source evidence links |
      | dense telemetry appendix |
    And the report should link back to the canonical JSON proof using a repo-relative path.

  Scenario: Write shareable timing table projection
    Given canonical JSON proof exists for a feature scenario
    When scenario proof reporting completes
    Then it may write a Markdown timing table at:
      """
      evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/execution-timeline.table.md
      """
    And every timing table row should be generated from the JSON proof
    And each row should include:
      | field |
      | runtime step |
      | node id |
      | node label |
      | runtime path |
      | first seen at |
      | last seen at |
      | duration ms |
      | elapsed since previous node ms |
      | call count |
      | status |
      | blocker code |
    And the table should be safe to paste into PI planning notes, architecture review notes, decks, dashboards, or publications.

  Scenario: Tie JSON proof to raw telemetry and receipts
    Given raw telemetry events were emitted by `LogMe(...)` during scenario execution
    And receipt files were written during scenario execution
    When `feature-execution.contract.v1.json` is built
    Then each observed executable body node should include:
      | field |
      | node id |
      | node label |
      | contract path |
      | runtime path |
      | source line range |
      | telemetry event ids |
      | telemetry event path |
      | first seen at |
      | last seen at |
      | duration ms |
      | elapsed since run start ms |
      | elapsed since previous node ms |
      | call count |
      | receipt paths |
      | status |
    And a node with no telemetry event should show `not observed`
    And a node with no required receipt should show `missing`
    And the JSON proof should not infer timing, call counts, or status from static source inventory.

  Scenario: Preserve repeated calls in the execution proof
    Given the same runtime method or body node is observed more than once during a scenario
    When canonical JSON proof is built
    Then the node should preserve each observed call in order
    And the node summary should include:
      | field |
      | call count |
      | first call timestamp |
      | last call timestamp |
      | total duration ms |
      | minimum call duration ms |
      | maximum call duration ms |
      | average call duration ms |
    And the report should show the call count in the ASCII sketch
    And any dense table projection should allow the product owner to inspect every call without changing the source JSON.

  Scenario: Calculate product timing metrics from observed evidence
    Given the canonical JSON proof has ordered body nodes with observed timing
    When timing metrics are calculated
    Then the JSON proof should include:
      | metric |
      | scenario lead time ms |
      | scenario cycle time ms |
      | active execution time ms |
      | waiting time ms |
      | node duration ms |
      | elapsed between nodes ms |
      | slowest node id |
      | total observed calls |
    And lead time should be measured from scenario request acceptance to final required receipt write
    And cycle time should be measured from first executable runtime node to last executable runtime node
    And any metric without enough telemetry should be `not observed`, not zero.

  Scenario: Establish service level indicators from execution proof
    Given canonical JSON proof exists for a feature scenario
    When service level indicators are calculated
    Then each SLI should be derived from observed execution evidence
    And supported SLIs should include:
      | SLI |
      | scenario success rate |
      | scenario lead time ms |
      | scenario cycle time ms |
      | node duration ms |
      | elapsed between nodes ms |
      | receipt write latency ms |
      | telemetry completeness percentage |
      | receipt coverage percentage |
      | blocker rate |
      | retry count |
      | total observed calls |
    And each SLI should include:
      | field |
      | name |
      | description |
      | numerator |
      | denominator |
      | unit |
      | value |
      | measurement window |
      | evidence source paths |
    And no SLI should be calculated from a report label, static source inventory, or manually entered claim.

  Scenario: Evaluate service level objectives from scenario evidence
    Given product-owned SLO targets are declared for a feature or scenario
    And canonical JSON proof exists for the measurement window
    When the feature truth gate evaluates service levels
    Then it should compare observed SLIs against declared SLO targets
    And the evaluation should produce:
      | field |
      | SLO id |
      | feature id |
      | scenario id |
      | SLI name |
      | target |
      | observed value |
      | unit |
      | measurement window |
      | status |
      | evidence packet paths |
    And SLO status should be one of:
      | status |
      | met |
      | missed |
      | not enough evidence |
    And missing telemetry should produce `not enough evidence`, not a passing SLO.

  Scenario: Preserve SLA evidence without turning reports into contracts
    Given an external or internal SLA depends on one or more SLOs
    When a feature scenario is executed during an SLA measurement window
    Then the JSON proof should preserve the evidence required to support the SLA calculation
    And the human report should show whether the supporting SLOs were met, missed, or lacked evidence
    And the report should not present an SLA as satisfied unless the underlying SLO evidence is satisfied
    And the finding code for unsupported SLA claims should be:
      | finding |
      | sla-claim-without-slo-evidence |

  Scenario: Render human report from canonical JSON proof
    Given `feature-execution.contract.v1.json` exists for a scenario
    When `executable-body-contract.report.md` is rendered
    Then the first product-facing section should be generated from the JSON proof
    And the ASCII sketch should show, for each body node:
      | field |
      | node label |
      | runtime path |
      | observed runtime step |
      | first seen at |
      | last seen at |
      | duration ms |
      | elapsed since previous node ms |
      | call count |
      | receipt status |
      | blocker status |
    And the report should include a supporting table or linked projection for dense timing and call-count details
    And the report should include the generated report path and generated-at timestamp
    And the product owner should not need to open JSON to understand what happened.

  Scenario: Reject report facts not backed by JSON proof
    Given a feature report contains execution timing, call count, receipt, or promotion facts
    When the feature report truth gate runs
    Then every such fact should tie back to `feature-execution.contract.v1.json`
    And every JSON proof fact should tie back to raw telemetry or receipt evidence
    And the gate should fail when the report contains a fact that is absent from the JSON proof
    And the finding code should be:
      | finding |
      | feature-report-fact-without-json-proof |

  Scenario: Keep JSON proof portable for downstream analysis
    Given canonical JSON proof exists for one or more scenario runs
    When a product owner, analyst, or CI job needs tabular analysis
    Then the JSON proof should be convertible to CSV without reading the human report
    And every row projection should preserve:
      | field |
      | run id |
      | feature id |
      | scenario id |
      | node id |
      | node label |
      | runtime path |
      | call index |
      | timestamp |
      | duration ms |
      | elapsed since previous node ms |
      | status |
      | blocker code |
    And CSV, Markdown, and ASCII projections should be treated as projections, not source truth.
```

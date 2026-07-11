```gherkin
Feature: Feature execution proof source of truth

  As an adversarial product owner
  I want every executed feature scenario to produce run-scoped JSON proof and every proven feature to publish a source-controlled Markdown proof body
  So that raw evidence can stay untracked while product owners still have durable feature proof in version control.

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
      | method call drill-down |
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
      | method-by-method execution drill-down |
    And the report should link back to the canonical JSON proof using a repo-relative path.
    And the run-scoped report should be treated as transient evidence, not the source-controlled product proof body.

  Scenario: Promote a selected proof run into a source-controlled feature proof body
    Given one or more scenario proof reports exist under `evidence/runs/<run-id>/features/<feature-id>/`
    And a product owner selects `<run-id>` as the proof run for `<feature-id>`
    When the feature proof publisher runs
    Then it should write a compact Markdown proof body at:
      """
      docs/feature-proofs/<feature-id>.proof.md
      """
    And the proof body should be safe to commit to version control
    And the proof body should include:
      | section |
      | feature identity |
      | selected proof run id |
      | proof run generated-at timestamp |
      | proof run artifact hashes |
      | scenario coverage summary |
      | scenario execution outcomes |
      | promotion decision |
      | blocker summary |
      | SLI and SLO summary |
      | source feature document link |
      | source-controlled proof body generated-at timestamp |
      | regeneration command |
    And the proof body should summarize raw telemetry and receipts instead of copying dense raw evidence
    And the proof body should link to the original run-scoped proof artifacts using repo-relative paths for local review.

  Scenario: Publish one feature-level proof body for the whole feature
    Given a feature has multiple Gherkin scenarios
    When a selected proof run is promoted into `docs/feature-proofs/<feature-id>.proof.md`
    Then the proof body should contain one section per scenario
    And each scenario section should include:
      | field |
      | scenario id |
      | scenario name |
      | acceptance source line range |
      | proof status |
      | selected run id |
      | execution summary |
      | blocker codes |
      | source proof artifact hashes |
    And scenarios without a proven run should remain visible as `not proven`
    And the product owner should not need to inspect every run folder to understand whole-feature proof status.

  Scenario: Block proven feature status without a committed proof body
    Given a feature status projection claims a feature is `proven`, `qa-passed`, or `promoted`
    When the feature proof source-truth gate runs
    Then a committed proof body should exist at:
      """
      docs/feature-proofs/<feature-id>.proof.md
      """
    And the proof body should cite the selected proof run id
    And the proof body should include the source proof artifact hashes used to generate it
    And the gate should block the claim when the proof body is missing
    And the finding code should be:
      | finding |
      | feature-status-without-source-controlled-proof-body |

  Scenario: Mark feature proof body stale when source or selected proof changes
    Given `docs/feature-proofs/<feature-id>.proof.md` exists
    When the feature source document, selected proof run hash, scenario list, or promotion decision changes
    Then the feature proof body should be marked stale
    And the finding code should be:
      | finding |
      | source-controlled-feature-proof-stale |
    And the recommended fix should regenerate the proof body from a selected proof run
    And the feature should not be promoted from a stale proof body.

  Scenario: Opt out of routine proof evidence when source-controlled proof is current
    Given `docs/feature-proofs/<feature-id>.proof.md` exists
    And the proof body cites a selected proof run id
    And the proof body artifact hashes match the current feature source, scenario list, executable body contract, and selected proof artifacts
    When a routine report truth run or feature truth inventory runs
    Then the feature should be classified as:
      | proof execution mode |
      | source-controlled proof satisfied |
    And the run should not regenerate dense feature proof evidence at:
      """
      evidence/runs/<current-run-id>/features/<feature-id>/
      """
    And the run may write only a lightweight inventory reference to:
      | field |
      | feature id |
      | proof body path |
      | selected proof run id |
      | proof body hash |
      | opt-out reason |
    And the opt-out reason should be:
      | reason |
      | source-controlled-feature-proof-current |
    And the feature should not be treated as missing proof merely because the current run skipped dense proof generation.

  Scenario: Re-enter proof execution when opt-out is invalidated
    Given `docs/feature-proofs/<feature-id>.proof.md` exists
    When any proof invalidation condition is detected:
      | condition |
      | feature source hash changed |
      | scenario added or removed |
      | scenario acceptance text changed |
      | executable body contract hash changed |
      | selected proof artifact hash changed |
      | selected proof run no longer exists locally and no proof body hash is available |
      | product owner requests proof refresh |
      | release-candidate or PI validation requires fresh proof |
      | SLO measurement window requires fresh execution |
    Then the feature should leave opt-out mode
    And the feature should be scheduled for proof execution
    And a new run-scoped proof packet may be written under:
      """
      evidence/runs/<current-run-id>/features/<feature-id>/
      """
    And the new proof run should not become source-controlled truth until it is promoted into `docs/feature-proofs/<feature-id>.proof.md`.

  Scenario: Block opt-out when proof body does not cover every current scenario
    Given a feature file contains scenarios under `docs/features/<feature-id>.feature.md`
    And `docs/feature-proofs/<feature-id>.proof.md` exists
    But one or more current scenarios are missing from the proof body
    When the feature proof source-truth gate runs
    Then the feature should not opt out of proof execution
    And the finding code should be:
      | finding |
      | source-controlled-feature-proof-missing-scenario |
    And the recommended fix should regenerate the proof body from a selected proof run that covers the current scenario list.

  Scenario: Keep raw run evidence out of version control
    Given feature proof evidence exists under `evidence/runs/<run-id>/`
    When a source-controlled proof body is published
    Then raw telemetry, dense receipts, run archives, screenshots, and large evidence packets should remain outside version control
    And the committed proof body should preserve only the product-readable proof summary, selected run id, artifact hashes, and links
    And the committed proof body should be enough for PI review without committing `evidence/runs/` or `evidence/archive/`
    And a pull request that adds raw run evidence should be blocked unless the product owner explicitly changes the repository evidence policy.

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

  Scenario: Preserve method call drill-down inside observed body nodes
    Given raw telemetry identifies method-level execution during a scenario
    When `feature-execution.contract.v1.json` is built
    Then each observed executable body node should include ordered `methodCalls`
    And each method call should include:
      | field |
      | call index |
      | method name |
      | method kind |
      | runtime path |
      | source line range |
      | started at |
      | completed at |
      | duration ms |
      | elapsed since previous call ms |
      | telemetry event ids |
      | telemetry event path |
      | receipt paths |
      | status |
      | blocker code |
    And method call timing should come only from telemetry evidence
    And method receipt status should come only from receipt evidence
    And a body node marked `observed` without method calls should be marked `method detail missing`.

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
    And the report should include or link the method-level drill-down projection
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

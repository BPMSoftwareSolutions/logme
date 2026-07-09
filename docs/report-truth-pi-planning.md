# PI Planning - Report Truth Projection Surface

Date: 2026-07-09

## Purpose

Make `report.md` a truthful, consistent projection surface. The report must be generated from declared contracts and observed evidence; it must never become the evidence itself.

This PI uses Gherkin acceptance criteria to drive report features. A report claim is acceptable only when it can be tied back to source inventory, configuration, tests, telemetry, receipts, and explicit acceptance criteria.

## Projection Under Review

| Surface | Path | Review note |
| --- | --- | --- |
| Generated report | `report.md` | Ignored by Git and excluded from the scan. Treat as volatile output, not committed truth. |
| Report renderer | `src/renders-domain-body-sterility-report/renders-domain-body-sterility-report.js` | Renders config, laws, summary, findings, and method table from the in-memory contract. |
| Summary calculator | `src/calculates-domain-body-sterility-summary/calculates-domain-body-sterility-summary.js` | Derives counts, coverage, and verdict. |
| Report table renderer | `packages/logme-report-primitives/src/renders-markdown-table.js` | Renders method rows and optional execution step column. |
| Report schema | `contracts/domains/logme2/sterility-report.schema.v1.json` | Currently empty; it cannot enforce report shape. |
| Config | `logme.config.json` | Declares report path, exclusions, vocabulary, laws, verdict labels, and finding codes. |

## Current Review Snapshot

The current generated `report.md` says:

| Metric | Current value |
| --- | --- |
| Files scanned | 33 |
| Local executable methods | 100 |
| Domain-bound methods | 100 |
| Methods with `LogMe` call | 97 |
| Silent local methods | 3 |
| Coverage | 97% |
| Verdict | `DOMAIN BODY CONTAMINATED` |

Current report findings:

| Finding | Method | File |
| --- | --- | --- |
| `local-method-without-testimony` | `createsExecutionStepState` | `src/inventories-executable-domain-methods/inventories-executable-domain-methods.js` |
| `local-method-without-testimony` | `nextExecutionStep` | `src/inventories-executable-domain-methods/inventories-executable-domain-methods.js` |
| `local-method-without-testimony` | `nextExecutionStep` | `src/runs-logme-domain-audit.js` |

Targeted verification performed:

| Command | Result | PO challenge |
| --- | --- | --- |
| `node --test tests\renders-domain-body-sterility-report.test.js` | Pass | Renderer shape is tested, but not against a schema. |
| `node --test tests\renders-markdown-table.test.js` | Pass | Table rendering is tested, but semantic truth of `Execution Step` still needs evidence. |
| `node --test tests\runs-logme-domain-audit.test.js` | Pass | Audit path passes, but `LOGME_AUDIT=1` floods stdout with telemetry events and needs a controlled evidence channel. |

## Adversarial PO Findings

| Risk | Why it matters | PI stance |
| --- | --- | --- |
| `report.md` is ignored by Git | A stale or locally regenerated report can be mistaken for reviewed evidence. | Require generated provenance and freshness validation. |
| Report schema is empty | No contract proves that summary, findings, rows, and verdict are internally consistent. | Build a real schema before expanding report claims. |
| Absolute paths are rendered | The report is machine-local and not portable across reviewers or CI. | Render repo-relative paths and include one normalized root. |
| `domainBoundMethods` equals all methods by construction | The report claims domain ownership without independent ownership proof. | Require ownership evidence or label the metric as inventory count. |
| `Execution Step` can read as runtime order | The column is currently derived from audit/inventory sequencing unless tied to telemetry. | Rename or prove the field with telemetry and execution signature evidence. |
| Runtime timing can be confused with static scan data | Line numbers come from source inventory, but execution step, timestamp, and duration must come from observed runtime telemetry. | Separate static source facts from telemetry-observed runtime facts. |
| `includeTestFiles` is `no` | The report cannot claim test support or TDD coverage from the current scan. | Add explicit test evidence before any tested/support claim. |
| External package methods are summarized as ignored | The report says package-governed without linking a package contract or receipt. | Require package governance proof or show as unverified. |
| Clean report labels are configured text | A label like "No findings" can be rendered if the contract says so, unless guarded by count validation. | Gate clean labels on computed zero findings. |
| Telemetry prints to stdout during audit | Projection evidence is noisy and hard to review deterministically. | Write telemetry to a receipt or event file with bounded report excerpts. |

## PI Objectives

| Objective | Outcome |
| --- | --- |
| Report freshness gate | `report.md` proves the source hash, config hash, generation command, timestamp, and run id behind the projection. |
| Report contract enforcement | A non-empty schema validates every generated report contract before markdown is written. |
| Summary-to-row consistency | Counts, coverage, findings, and verdict are recomputed from the same method inventory and cannot disagree. |
| Evidence-only language | Report text does not use support, proof, execution, runtime, or sterile language without backing evidence. |
| Gherkin-driven report features | Every report feature has acceptance criteria before implementation and tests map to those scenarios. |
| Development-time report truth guardrails | Developers can detect report contamination locally with one command before commit. |
| CI/CD report truth guardrails | Pull requests and promotions are blocked when the generated report contract, evidence packet, or verdict is stale or inconsistent. |
| Adversarial challenge packet | A reviewer or agent can disprove every major report claim using included evidence paths. |

## Feature: Report Provenance And Freshness Gate

```gherkin
Feature: Report provenance and freshness gate

  As an adversarial product owner
  I want report.md to prove when and how it was generated
  So that stale or hand-edited projections cannot be promoted as truth.

  Scenario: Render report provenance
    Given the report generator has completed a domain audit
    When report.md is rendered
    Then the report should show:
      | field |
      | report schema version |
      | generator name |
      | generation timestamp |
      | generation command |
      | git commit or working tree marker |
      | config path |
      | config hash |
      | source inventory hash |
      | run id |
      | evidence directory |
    And every hash should be derived from the inputs used for the rendered report.

  Scenario: Block stale report projection
    Given report.md exists
    And the current source inventory hash differs from the hash rendered in report.md
    When the report truth gate runs
    Then the report verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | stale-report-projection |
      | report-source-hash-mismatch |
    And the report should not claim a clean or sterile state.
```

## Feature: Report Contract Schema Enforcement

```gherkin
Feature: Report contract schema enforcement

  As an enterprise product owner
  I want the report contract validated before markdown is written
  So that report.md cannot omit proof fields or invent unsupported sections.

  Scenario: Validate non-empty sterility report schema
    Given `contracts/domains/logme2/sterility-report.schema.v1.json` defines required fields
    And the report generator has built an in-memory report contract
    When schema validation runs
    Then the contract should include:
      | field |
      | generatedBy |
      | schemaVersion |
      | reportPath |
      | configPath |
      | rootDir |
      | filesScanned |
      | localExecutableMethods |
      | domainBoundMethods |
      | methodsWithLogMeCall |
      | silentLocalMethods |
      | findings |
      | methods |
      | coverage |
      | verdict |
      | evidence |
    And markdown should be written only after schema validation passes.

  Scenario: Block empty report schema
    Given the report schema is `{}` or has no required fields
    When the report generator runs in CI
    Then the report verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | report-schema-empty |
      | report-contract-not-enforced |
```

## Feature: Summary, Findings, And Method Row Tie-Out

```gherkin
Feature: Summary, findings, and method row tie-out

  As an adversarial product owner
  I want every summary number to be recomputed from method rows and findings
  So that the report cannot show a clean verdict with dirty details.

  Scenario: Recompute summary from method rows
    Given the report method table contains method rows
    When the report validator recomputes summary metrics
    Then `localExecutableMethods` should equal the number of method rows
    And `methodsWithLogMeCall` should equal rows where LogMe is `yes`
    And `silentLocalMethods` should equal rows where LogMe is `no`
    And `methodsWithLogMeCall + silentLocalMethods` should equal `localExecutableMethods`
    And `coverage` should equal `methodsWithLogMeCall / localExecutableMethods`

  Scenario: Tie findings to table rows
    Given a finding references a file path, method name, and reason
    When the report validator checks the finding
    Then the method table should contain a row with the same file path and method name
    And the row state should explain the finding
    And duplicate method names should be disambiguated by file path and line range.

  Scenario: Block clean label with nonzero findings
    Given the report contains one or more findings
    When report.md is rendered
    Then the Findings section should not show the configured clean findings label
    And the verdict should not be `STERILE DOMAIN BODY`
    And the finding code should be:
      | finding |
      | clean-label-with-findings |
```

## Feature: Verdict Derivation Consistency

```gherkin
Feature: Verdict derivation consistency

  As an enterprise product owner
  I want report verdicts to be derived from hard laws
  So that a verdict cannot be stronger than the evidence below it.

  Scenario: Block sterile verdict when any hard law is violated
    Given the hard laws include "No local executable method without LogMe"
    And the report has one silent local method
    When the verdict is derived
    Then the verdict should be `DOMAIN BODY CONTAMINATED`
    And the report should show the silent method finding.

  Scenario: Allow sterile verdict only when all gates pass
    Given all local executable methods have LogMe testimony
    And no generic utility methods are inside the domain body
    And no anonymous executable methods exist
    And no method is outside the declared domain vocabulary
    And no unimplemented stub is reported as domain-bound code
    And the report contract schema is valid
    And the report freshness gate passes
    When the verdict is derived
    Then the verdict may be `STERILE DOMAIN BODY`.
```

## Feature: Projection Language Honesty

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

## Feature: Domain Ownership Boundary Proof

```gherkin
Feature: Domain ownership boundary proof

  As an enterprise architect
  I want each domain-bound method to prove why it belongs to the domain
  So that package mechanics are not silently counted as domain truth.

  Scenario: Require ownership evidence for domain-bound methods
    Given a method is counted as domain-bound
    When the report ownership validator runs
    Then the method should show one of:
      | ownership proof |
      | declared file-system body contract path |
      | declared feature contract path |
      | package governance contract path |
      | explicit domain vocabulary ownership rule |
    And `domainBoundMethods` should count only methods with ownership proof.

  Scenario: Block package-governed claim without package receipt
    Given the report says external package methods are ignored or package-governed
    But no package governance contract or receipt path is rendered
    When the report is validated
    Then the report should show the package scope as UNVERIFIED
    And the finding code should be:
      | finding |
      | package-governance-unproven |
```

## Feature: Portable Evidence Paths

```gherkin
Feature: Portable evidence paths

  As a reviewer
  I want report paths to be repo-relative
  So that CI, another developer, and leadership review the same projection.

  Scenario: Render repo-relative paths
    Given a method row references a file under the configured root
    When report.md is rendered
    Then the Location value should be repo-relative
    And the report should show line start and line end
    And the report should render the configured root once in the provenance section.

  Scenario: Block machine-local path leakage
    Given report.md contains an absolute local workspace path in a method row or finding
    When the report portability gate runs
    Then the report should be BLOCKED
    And the finding code should be:
      | finding |
      | report-path-not-portable |
```

## Feature: Evidence Receipt Coverage

```gherkin
Feature: Evidence receipt coverage

  As an enterprise product owner
  I want every report run to write durable evidence
  So that report.md can be independently challenged.

  Scenario: Write report evidence packet
    Given a report run has completed
    When the receipt writer runs
    Then it should write an evidence packet containing:
      | artifact |
      | method-inventory.v1.json |
      | report-contract.v1.json |
      | report.md |
      | report-generation.receipt.v1.json |
      | telemetry.events.v1.jsonl |
      | report-validation.v1.json |
    And report.md should link to each artifact using repo-relative paths.

  Scenario: Block verdict promotion without receipt
    Given report.md claims a passing or sterile verdict
    But the report-generation receipt does not exist
    When the PI readiness gate runs
    Then the PI verdict should be BLOCKED
    And the finding code should be:
      | finding |
      | report-verdict-without-receipt |
```

## Feature: Gherkin-Driven Report Development

```gherkin
Feature: Gherkin-driven report development

  As a product owner
  I want every report capability to start with Gherkin acceptance criteria
  So that report features are implemented only after their truth rules are explicit.

  Scenario: Require Gherkin before report feature implementation
    Given a report feature changes the rendered projection surface
    When a pull request is opened
    Then the pull request should include or reference a scenario under `docs/features/**/*.feature.md`
    And the implementation tests should reference the scenario id
    And the report should not add a new section or claim without acceptance criteria.

  Scenario: Trace report sections to scenarios
    Given report.md contains a section
    When the report section index is rendered
    Then each section should show its owning feature id or scenario id
    And unowned report sections should be BLOCKED
    And the finding code should be:
      | finding |
      | report-section-without-acceptance-source |
```

## Feature: Adversarial Challenge Packet

```gherkin
Feature: Adversarial challenge packet

  As an adversarial product owner
  I want a challenge packet generated with the report
  So that another reviewer can attempt to disprove every promoted claim.

  Scenario: Generate report challenge packet
    Given report.md has been generated
    When the challenge packet is produced
    Then it should ask a reviewer to disprove:
      | claim |
      | files scanned |
      | local executable method count |
      | domain-bound method count |
      | methods with LogMe call |
      | silent local method count |
      | coverage percentage |
      | no findings claim |
      | sterile verdict |
      | execution step labels |
      | package-governed exclusions |
    And it should include every source, config, schema, telemetry, and receipt path required for review.

  Scenario: Block false pass claim
    Given report.md claims a passing or sterile verdict
    When the challenge packet reveals any missing schema, stale hash, missing method testimony, path drift, missing receipt, or unsupported language
    Then the report verdict should be changed to BLOCKED
    And the finding code should be:
      | finding |
      | false-pass-claim |
      | report-overclaims-evidence |
```

## Feature: CI/CD Report Truth Guardrails

```gherkin
Feature: CI/CD report truth guardrails

  As an adversarial product owner
  I want CI/CD to enforce report truth before merge or promotion
  So that local generated projections cannot bypass evidence, schema, or verdict rules.

  Scenario: Block pull request when report truth validation fails
    Given a pull request changes report rendering, report contracts, source inventory, domain audit behavior, or Gherkin acceptance criteria
    When the CI report truth workflow runs
    Then it should run:
      | gate |
      | unit tests |
      | Gherkin traceability check |
      | report contract generation |
      | report schema validation |
      | summary-to-row validator |
      | verdict derivation validator |
      | path portability validator |
      | evidence receipt validator |
    And the pull request should fail if any gate fails.

  Scenario: Publish report evidence packet as CI artifact
    Given the CI report truth workflow has generated report evidence
    When the workflow completes
    Then it should publish an artifact containing:
      | artifact |
      | method-inventory.v1.json |
      | report-contract.v1.json |
      | report.md |
      | report-generation.receipt.v1.json |
      | telemetry.events.v1.jsonl |
      | report-validation.v1.json |
      | adversarial-challenge-packet.md |
    And the pull request summary should link to the artifact.

  Scenario: Block stale local report projection
    Given `report.md` is ignored by Git
    And a developer has a locally generated report
    When CI regenerates the report contract from the pull request source
    Then CI should ignore the developer's local `report.md`
    And CI should compare only freshly generated evidence
    And any stale local projection should have no promotion authority.

  Scenario: Block false pass in promotion workflow
    Given CI generated report evidence exists
    And the report claims `STERILE DOMAIN BODY` or any PASS-style verdict
    When the promotion workflow evaluates the evidence packet
    Then every hard-law blocker should be zero
    And the report schema should be valid
    And the freshness gate should pass
    And every required receipt should exist
    And every report section should trace to Gherkin acceptance criteria
    And promotion should fail if any proof is missing.
```

## Feature: Development-Time Report Truth Guardrails

```gherkin
Feature: Development-time report truth guardrails

  As an adversarial product owner
  I want developers to see report truth failures before commit
  So that "tests pass" cannot hide a contaminated architecture report.

  Scenario: Fail local verification when tests pass but report is contaminated
    Given all unit tests pass
    And the generated report verdict is `DOMAIN BODY CONTAMINATED`
    When the developer runs the local verification command
    Then the command should fail
    And the status should say:
      """
      tests pass, report truth gate fails
      """
    And the output should show:
      | field |
      | report verdict |
      | coverage |
      | silent local methods |
      | anonymous executable methods |
      | top finding codes |
      | top finding paths |
    And no local command should emit a promotion-ready or clean claim.

  Scenario: Provide one command for local report truth
    Given the developer is working locally
    When they run the report truth command
    Then it should regenerate the report contract from current source
    And it should validate report freshness
    And it should validate summary-to-row consistency
    And it should validate verdict derivation
    And it should print a bounded, human-readable failure summary
    And it should exit nonzero when the report is contaminated.

  Scenario: Keep local report truth output quiet enough to use
    Given report truth validation runs during development
    When telemetry or audit testimony is produced
    Then the command should not flood stdout with full telemetry event bodies
    And detailed telemetry should be written to an evidence artifact
    And stdout should show only the verdict, counts, and actionable top findings.

  Scenario: Block commit when report truth gate fails
    Given a pre-commit or pre-push hook is installed
    And the report truth command exits nonzero
    When the developer attempts to commit or push
    Then the hook should block the action
    And the message should identify the report truth command to run
    And the message should include the first actionable finding path.

  Scenario: Allow fast development mode without weakening truth
    Given the full report truth command is too slow for watch mode
    When the developer runs the fast report truth command
    Then it may skip long-running receipt artifact publication
    But it should still fail on:
      | blocker |
      | contaminated verdict |
      | stale report provenance |
      | summary-to-row mismatch |
      | silent local methods |
      | anonymous executable methods |
      | unsupported clean or sterile claim |
```

## PI Readiness Gate

```gherkin
Feature: PI readiness gate for report truth

  As an enterprise product owner
  I want the PI to pass only when the report projection is truthful and consistent
  So that leadership sees evidence, not aspiration.

  Scenario: Block PI readiness when report truth is incomplete
    Given the PI includes the report truth projection work
    And one or more report truth features lack schema, tests, telemetry, receipts, or Gherkin traceability
    When the PI readiness gate runs
    Then the PI verdict should be BLOCKED
    And the control report should show the top blocker for each report feature.

  Scenario: Pass PI readiness
    Given every report feature has:
      | requirement |
      | Gherkin acceptance criteria |
      | schema-enforced contract |
      | implementation tests |
      | source inventory tie-out |
      | telemetry or explicit no-telemetry label |
      | receipt coverage |
      | adversarial challenge packet |
    When the PI readiness gate runs
    Then the PI verdict should be PASS
    And report.md may be promoted as a truthful projection for that run.
```

## Suggested PI Slices

| Slice | Goal | Exit criteria |
| --- | --- | --- |
| 1 | Contract the report | Non-empty report schema, provenance header, freshness gate, and schema validation tests. |
| 2 | Make counts undeniable | Summary-to-row validator, finding-to-row tie-out, verdict derivation tests, and blocked clean-label cases. |
| 3 | Remove projection overclaims | Rename or prove execution fields, make paths portable, and add language honesty checks. |
| 4 | Add evidence receipts | Evidence packet written per run with inventory, report contract, telemetry, validation, and receipt artifacts. |
| 5 | Add development-time guardrails | One local command detects contaminated reports before commit without stdout noise. |
| 6 | Add CI/CD guardrails | Pull request workflow validates report truth, publishes evidence artifacts, and blocks stale or false-pass projections. |
| 7 | Operationalize adversarial review | Challenge packet and PI readiness gate can block false pass, stale report, and unsupported proof claims. |

## Definition Of Done

| Gate | Done means |
| --- | --- |
| Acceptance | Each report feature has Gherkin scenarios before implementation. |
| Schema | `sterility-report.schema.v1.json` rejects missing required fields. |
| Tests | Unit and audit tests prove every report section and verdict rule. |
| Evidence | Generated report links to its evidence packet and receipt. |
| Development loop | Local verification fails when tests pass but the report is contaminated. |
| CI/CD | Pull requests and promotions run report truth gates and publish evidence artifacts. |
| Portability | Report paths are repo-relative and stable across machines. |
| Honesty | The report never uses stronger language than the evidence supports. |
| Adversarial review | Challenge packet can be run by another reviewer without private local context. |

## Open Product Decisions

| Decision | Default PO position |
| --- | --- |
| Should `report.md` be committed? | Keep it generated and ignored, but require committed schema, tests, and sample fixtures. Publish run artifacts through evidence packets or CI artifacts. |
| Are `packages/` methods domain-bound? | Count them only when a contract says they are domain-owned or package-governed. Otherwise render them as unverified support mechanics. |
| Is `Execution Step` a runtime concept? | Yes. If the value is scan order, call it `Inventory Step`. |
| Can the report claim test coverage when `includeTestFiles` is `no`? | No. It can claim source testimony only until test evidence is added. |
| Can stdout telemetry be report evidence? | No. Persist bounded telemetry artifacts and reference them from the report. |
| Is green test output enough for developer readiness? | No. Local readiness requires tests passing and the report truth gate passing. |
| Should CI trust local `report.md`? | No. CI should regenerate the report contract and publish fresh evidence artifacts. |

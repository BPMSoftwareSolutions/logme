```gherkin
Feature: Feature folder source truth and proposed execution body

  As an adversarial product owner
  I want every feature to own its specification, status, proposed execution body, service expectations, and promoted proof inside one canonical folder
  So that feature intent, execution proof, and delivery readiness can be reviewed without chasing flat files, transient run evidence, or stale generated projections.

  Background:
    Given committed feature specifications currently exist under `docs/features/`
    And feature status contracts may exist under `docs/features/_feature-status/`
    And promoted feature proof bodies may exist under `docs/feature-proofs/`
    And raw run evidence may exist under untracked paths such as `evidence/runs/<run-id>/`
    And compressed archived evidence may exist under paths such as `evidence/archive/<year>/<run-id>.zip`
    And source-controlled feature truth should be compact, meaningful, and stable

  Scenario: Store each feature in a canonical feature folder
    Given a feature has the id `<feature-id>`
    When the feature source-truth layout is prepared
    Then the canonical feature folder should be:
      """
      docs/features/<feature-id>/
      """
    And the folder should contain:
      | artifact |
      | feature.feature.md |
      | status.v1.json |
      | proposed-execution-body.ascii.md |
      | proposed-execution-body.contract.v1.json |
      | service-levels.v1.json |
      | proof.md |
    And the folder may contain generated projections only when they are derived from the canonical JSON contracts
    And raw run evidence should not be copied into the canonical feature folder.

  Scenario: Preserve backwards compatibility during feature folder migration
    Given flat feature files still exist at `docs/features/<feature-id>.feature.md`
    And flat status contracts still exist at `docs/features/_feature-status/<feature-id>.status.v1.json`
    When the feature folder migration runs
    Then it should create or update `docs/features/<feature-id>/feature.feature.md`
    And it should create or update `docs/features/<feature-id>/status.v1.json`
    And it should preserve the original feature id, feature name, scenario ids, status values, and source paths
    And existing flat feature paths should remain readable until the migration is complete
    And any generated index should clearly identify whether a feature is using the flat layout or folder layout.

  Scenario: Define a proposed execution body before implementation proof exists
    Given a feature scenario is planned but not yet proven
    When the product owner, architect, or LLM worker prepares the proposed execution body
    Then it should write a human-readable ASCII sketch at:
      """
      docs/features/<feature-id>/proposed-execution-body.ascii.md
      """
    And it should write a machine-readable contract at:
      """
      docs/features/<feature-id>/proposed-execution-body.contract.v1.json
      """
    And the proposed execution body should describe the expected semantic execution shape before runtime proof exists
    And the proposed execution body should be source-controlled
    And the proposed execution body should be reviewed as product intent, not treated as observed proof.

  Scenario: Specify scenario-level method telemetry and timing budgets in the proposed body
    Given a proposed execution body is prepared for `<feature-id>`
    When the proposed body writer renders `proposed-execution-body.ascii.md`
    Then each scenario section should include:
      | section |
      | scenario id |
      | classification |
      | expected executable node label |
      | contract path |
      | runtime body file path |
      | expected service level |
      | method drill-down |
      | expected scenario timing |
      | blocker policy |
    And each method drill-down call should include:
      | field |
      | call index |
      | method name |
      | method kind |
      | source file and line range |
      | expected started at |
      | expected completed at |
      | expected duration ms |
      | expected elapsed previous ms |
      | SLO target |
      | SLO breach |
      | telemetry event expectation |
      | receipt expectation |
      | expected status |
    And the expected service level should define:
      | field |
      | SLI name |
      | SLO target |
      | SLO warning |
      | SLO breach |
      | SLA expectation |
      | measurement source |
    And simulated timing values may be used before runtime proof exists
    But simulated timing values should still be explicit enough for observed proof to compare against them.

  Scenario: Reject proposed execution bodies without named method proof shape
    Given `docs/features/<feature-id>/proposed-execution-body.ascii.md` exists
    And `docs/features/<feature-id>/proposed-execution-body.contract.v1.json` exists
    When the proposed execution body gate runs
    Then it should fail the feature source-truth check when any product-domain method call has:
      | unacceptable value |
      | not observed |
      | sampleMethod |
      | anonymous |
      | call only |
      | missing |
    And it should fail when a product-domain method call omits:
      | required field |
      | method name |
      | method kind |
      | source file and line range |
      | expected duration ms |
      | SLO target |
      | SLO breach |
      | telemetry event expectation |
      | receipt expectation |
    And the blocker code should be:
      | blocker code |
      | product-method-name-not-observed |
    And the proposed body should not be accepted as product source truth until the missing method proof shape is repaired.

  Scenario: Keep proposed execution bodies focused on native and boundary calls
    Given an LLM worker proposes an execution body for `<feature-id>`
    When the proposed execution body is validated
    Then each proposed executable node should be classified as one of:
      | classification |
      | product-domain-native |
      | product-domain-boundary-case |
      | package-boundary-summarized |
      | external-service-boundary |
      | generated-evidence-ignore |
      | product-owner-review-required |
    And the proposed body should include product-domain-native calls that express feature meaning
    And the proposed body should include product-domain-boundary-case calls when a boundary decision is part of the feature meaning
    And package internals should appear only as package-boundary summaries
    And pure utility methods should not appear as first-class feature body nodes
    And generated evidence mechanics should not appear as first-class feature body nodes.

  Scenario: Route required support methods outside the feature boundary
    Given `proposed-execution-body.contract.v1.json` defines the product-domain-native methods for `<feature-id>`
    And implementation planning discovers an additional method required to support the feature
    But the additional method is not listed as a product-domain-native or product-domain-boundary-case method in the proposed body
    When the feature boundary classifier evaluates the additional method
    Then it should classify the method as one of:
      | classification |
      | package-boundary-summarized |
      | pure-utility-extract |
      | external-service-boundary |
      | generated-evidence-ignore |
      | product-owner-review-required |
    And a method classified as `pure-utility-extract` should receive a package extraction proposal
    And a method classified as `package-boundary-summarized` should require a package audit receipt
    And a method classified as `external-service-boundary` should require external proof, release proof, or integrity proof
    And the proposed feature body should cite the support method only as a boundary summary
    And the source-domain proof should not expand the support method as a feature-native method call.

  Scenario: Keep proposed method map from becoming a dependency inventory
    Given `docs/features/<feature-id>/proposed-execution-body.contract.v1.json` exists
    When the proposed method map is validated
    Then `proposedMethodMap` should include only:
      | allowed method kind |
      | product-domain-native |
      | product-domain-boundary-case approved by product owner |
    And required support methods should be listed outside `proposedMethodMap` under a boundary classification such as:
      | boundary classification |
      | package-boundary-summarized |
      | pure-utility-extract |
      | external-service-boundary |
      | generated-evidence-ignore |
    And `proposedMethodMap` should not include pure utility, package-internal, generated evidence, path, formatting, hashing, or filesystem mechanics
    And the blocker code should be:
      | blocker code |
      | proposed-method-map-contains-support-method |

  Scenario: Block source contamination from methods outside the proposed native body
    Given a proposed execution body declares the allowed product-domain-native method set for `<feature-id>`
    And observed proof contains an extra method call inside the source-domain body
    When the proposed-to-observed tie-out gate runs
    Then the extra method call should be accepted only when it is:
      | allowed reason |
      | listed in the proposed method map |
      | listed as a product-domain-boundary-case |
      | summarized by a current package audit receipt |
      | covered by an external boundary proof |
      | explicitly approved by product-owner review |
    And the gate should block the proof when the extra method is an unclassified helper, utility, or generated evidence mechanic
    And the blocker code should be:
      | blocker code |
      | actual-execution-body-has-unclassified-support-method |
    And the remediation action should be one of:
      | remediation action |
      | add the method to the proposed native body with method telemetry and SLO budget |
      | classify the method as a product-domain-boundary-case |
      | extract the method to a package boundary |
      | summarize an existing package boundary with a package audit receipt |
      | suppress generated evidence mechanics |
      | ask for product-owner review |
    And proof promotion should remain blocked until zero unclassified support methods remain in the source-domain body.

  Scenario: Reject proposed execution bodies that hide product meaning
    Given `proposed-execution-body.contract.v1.json` exists
    When the proposed execution body gate runs
    Then it should fail the feature source-truth check when:
      | blocker code |
      | proposed-body-missing |
      | proposed-body-has-no-native-call |
      | proposed-body-contains-raw-utility-call |
      | proposed-body-contains-generated-evidence-mechanic |
      | proposed-body-has-unnamed-call-node |
      | proposed-body-missing-method-telemetry-budget |
      | proposed-body-missing-method-slo-target |
      | proposed-body-missing-method-source-range |
      | proposed-body-has-unclassified-support-method |
      | proposed-body-has-product-owner-review-required-node |
    And each blocker should include the feature id, scenario id when available, node id, classification, and recommended next action
    And the recommendation should be actionable enough for an LLM remediation worker to prepare a focused update packet.

  Scenario: Declare service expectations beside the proposed execution body
    Given a feature has expected delivery or runtime behavior
    When the feature service-level contract is written
    Then it should write `docs/features/<feature-id>/service-levels.v1.json`
    And each service-level entry should include:
      | field |
      | service level id |
      | feature id |
      | scenario id |
      | user-visible capability |
      | SLI name |
      | SLI measurement source |
      | SLO target |
      | SLO threshold |
      | SLA dependency |
      | evidence required |
      | product owner decision |
    And no SLO should be considered met without observed SLI evidence
    And no SLA support claim should be considered satisfied unless the underlying SLO evidence is satisfied.

  Scenario: Tie observed execution proof back to the proposed execution body
    Given a feature proof run has produced `feature-execution.contract.v1.json`
    And the feature has `proposed-execution-body.contract.v1.json`
    When the feature proof publisher prepares `docs/features/<feature-id>/proof.md`
    Then it should compare the observed execution body to the proposed execution body
    And it should report whether each proposed node was:
      | result |
      | observed as proposed |
      | observed with acceptable rename |
      | observed through package-boundary receipt |
      | missing from observed proof |
      | replaced by unapproved native call |
      | expanded into utility sprawl |
      | blocked by missing telemetry |
    And the promoted proof body should include the selected proof run id
    And the promoted proof body should include the proposed-to-observed tie-out summary
    And the promoted proof body should summarize raw evidence instead of copying raw run artifacts.

  Scenario: Block promotion when proof does not tie out to proposed execution
    Given a selected proof run exists for `<feature-id>`
    And the proposed execution body is current
    When the feature proof source-truth gate runs
    Then it should block proof promotion when:
      | blocker code |
      | proof-body-missing-proposed-source-truth |
      | actual-execution-body-missing-proposed-node |
      | actual-execution-body-has-unapproved-extra-native-node |
      | actual-execution-body-expanded-package-utility |
      | actual-service-level-misses-proposed-slo |
      | actual-service-level-lacks-sli-evidence |
      | actual-proof-run-id-not-selected |
    And each blocker should cite the proposed node or service-level id that failed tie-out
    And the source-controlled `proof.md` should not claim the feature is proven until blockers are resolved or explicitly waived.

  Scenario: Avoid status and proof churn when source truth has not changed
    Given `docs/features/<feature-id>/status.v1.json` exists
    And `docs/features/<feature-id>/proof.md` exists
    And a routine verification run produces no product-visible status change
    When source-truth artifacts are regenerated
    Then the status contract should not receive a new generated-at timestamp
    And the proof body should not receive a new generated-at timestamp
    And the run may write transient receipts under `evidence/runs/<run-id>/`
    And the canonical feature folder should remain unchanged.

  Scenario: Re-enter proof execution when proposed source truth changes
    Given `docs/features/<feature-id>/proof.md` is current
    When any of the following source-truth inputs change:
      | input |
      | feature.feature.md |
      | proposed-execution-body.ascii.md |
      | proposed-execution-body.contract.v1.json |
      | service-levels.v1.json |
      | selected package-boundary receipt |
      | product owner refresh request |
      | PI or release validation requirement |
    Then the feature should leave proof-satisfied opt-out mode
    And the next verification run should produce fresh run-scoped proof evidence
    And the promoted `proof.md` should remain unchanged until a selected proof run ties out to the changed source truth.

  Scenario: Give LLM workers a compact remediation packet for feature folder truth
    Given feature folder source truth has validation blockers
    When an LLM remediation packet is prepared
    Then the packet should include only:
      | field |
      | feature id |
      | feature folder path |
      | affected scenario ids |
      | current proposed execution body nodes |
      | observed execution body nodes when available |
      | service-level expectations |
      | blocker codes |
      | allowed classifications |
      | package-boundary receipts |
      | remediation objective |
    And the packet should exclude raw telemetry, dense evidence logs, and unrelated feature bodies
    And the packet should tell the LLM worker whether it is allowed to edit proposed source truth, status source truth, proof source truth, or only prepare a recommendation.

  Scenario: Show product owners one folder per feature during PI planning
    Given canonical feature folders exist under `docs/features/`
    When a product owner reviews PI planning readiness
    Then each feature folder should answer:
      | question |
      | What is the feature supposed to do? |
      | What execution body do we expect? |
      | Which native calls express the product meaning? |
      | Which package or external boundaries are expected? |
      | What SLI evidence is required? |
      | What SLO target must be met? |
      | What SLA claim depends on this feature? |
      | Which proof run was selected? |
      | Did observed execution tie out to proposed execution? |
      | What is the next product action? |
    And the product owner should not need to inspect every raw evidence run to answer those questions.
```

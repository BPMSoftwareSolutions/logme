```gherkin
Feature: LLM evidence curation and cleanup

  As a product owner
  I want LLM workers to curate, summarize, connect, and safely clean up evidence runs
  So that PI planning and delivery decisions use meaningful evidence instead of a noisy pile of run folders.

  Background:
    Given report evidence is written under:
      | path |
      | evidence/runs/<run-id>/ |
    And feature QA evidence may be written under:
      | path |
      | quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/ |
    And feature status projections may reference evidence paths under:
      | path |
      | docs/features/_feature-status/ |

  Scenario: Inventory evidence runs without deleting anything
    Given the repository contains many evidence run folders
    When the Evidence Curator Worker scans the evidence directory
    Then it should write an evidence catalog at:
      | artifact |
      | evidence/index/evidence-catalog.v1.json |
    And it should write a human-readable catalog report at:
      | artifact |
      | evidence/index/evidence-catalog.report.md |
    And each run entry should include:
      | field |
      | run id |
      | created at |
      | last modified at |
      | total byte size |
      | artifact count |
      | report verdict |
      | report truth status |
      | feature ids |
      | scenario ids |
      | release candidate ids |
      | PI ids |
      | referenced by |
      | retention classification |
    And the scan should not delete, archive, or rewrite any run artifact.

  Scenario: Produce a product-owner latest evidence surface
    Given an evidence catalog exists
    When the Evidence Curator Worker selects the most meaningful current evidence
    Then it should write a latest evidence report at:
      | artifact |
      | evidence/index/latest-evidence.report.md |
    And the report should show:
      | section |
      | latest report truth run |
      | latest passing report truth run |
      | latest blocked report truth run |
      | latest domain analysis run |
      | latest sprawl analysis run |
      | latest QA bundle by feature |
      | latest promotion-relevant evidence by release candidate |
      | evidence that needs product-owner attention |
    And each row should link to the source run or bundle using repo-relative paths
    And the report should hide obsolete runs from the default view while still linking to the complete catalog.

  Scenario: Connect evidence to feature and scenario ownership
    Given evidence artifacts contain feature ids, scenario ids, report sections, QA bundles, or feature status references
    When the Evidence Curator Worker builds a feature evidence index
    Then it should write a feature evidence index at:
      | artifact |
      | evidence/index/feature-evidence-index.v1.json |
    And each feature entry should include:
      | field |
      | feature id |
      | feature document path |
      | scenario ids |
      | latest evidence run ids |
      | latest QA bundle paths |
      | latest promotion decision paths |
      | blocker codes |
      | stale evidence count |
      | missing evidence count |
      | product-owner next action |
    And evidence with no feature or scenario tie-out should be classified as:
      | classification |
      | unowned evidence |
    And unowned evidence should be visible in the latest evidence report as a cleanup or tie-out risk.

  Scenario: Connect evidence to PI planning
    Given a PI planning window or PI id is declared
    When the Evidence Curator Worker prepares a PI evidence digest
    Then it should write a PI evidence digest at:
      | artifact |
      | evidence/index/pi/<pi-id>/pi-evidence-digest.report.md |
    And the digest should include:
      | section |
      | features ready for PI review |
      | features blocked by missing evidence |
      | features blocked by stale evidence |
      | latest meaningful QA bundles |
      | domain body risks that affect delivery |
      | evidence cleanup recommendations |
      | product-owner decisions needed |
    And the digest should not require the product owner to inspect every raw run folder manually.

  Scenario: Classify evidence retention value
    Given an evidence catalog has been built
    When the Retention Planner Worker classifies each evidence run
    Then each run should receive one retention classification:
      | classification |
      | protected-current |
      | protected-release-candidate |
      | protected-promoted |
      | protected-pinned |
      | keep-recent |
      | archive-candidate |
      | delete-candidate |
      | unsafe-to-delete |
    And the classification reason should cite deterministic references
    And a run should be protected when it is referenced by:
      | reference |
      | latest evidence report |
      | feature status contract |
      | QA evidence bundle |
      | promotion decision |
      | PI evidence digest |
      | report truth receipt |
      | manual pin |
    And the LLM should not mark evidence as deletable solely because it looks old or verbose.

  Scenario: Create a dry-run cleanup plan before destructive action
    Given evidence retention classifications exist
    When the Cleanup Planner Worker prepares evidence cleanup
    Then it should write a dry-run cleanup plan at:
      | artifact |
      | evidence/cleanup/evidence-cleanup-plan.v1.json |
    And it should write a product-owner cleanup report at:
      | artifact |
      | evidence/cleanup/evidence-cleanup-plan.report.md |
    And the plan should include:
      | field |
      | run id |
      | action |
      | reason |
      | bytes reclaimable |
      | artifact count |
      | protection checks |
      | references found |
      | approval required |
      | rollback or restore path |
    And supported cleanup actions should be:
      | action |
      | keep |
      | pin |
      | archive |
      | delete |
      | investigate |
    And the dry run should not remove any files.

  Scenario: Block cleanup of referenced evidence
    Given a cleanup plan marks a run as archive or delete
    But that run is referenced by a feature status contract, QA bundle, promotion decision, PI digest, latest pointer, report truth receipt, or manual pin
    When the Cleanup Guard evaluates the plan
    Then the action should be blocked
    And the finding code should be:
      | finding |
      | evidence-cleanup-protected-reference |
    And the recommended fix should explain which reference protects the run.

  Scenario: Require explicit approval for destructive cleanup
    Given a cleanup plan contains archive or delete actions
    When the cleanup command is requested
    Then the command should require explicit product-owner approval
    And the approval should include:
      | field |
      | approved by |
      | approved at |
      | cleanup plan path |
      | cleanup plan hash |
      | approved actions |
    And cleanup should be blocked when the plan hash differs from the approved plan hash
    And cleanup should be blocked when approval is missing.

  Scenario: Archive before deleting high-volume evidence
    Given a run is a delete candidate but contains artifacts that may be useful later
    When the Cleanup Executor prepares destructive cleanup
    Then it should prefer archive before delete unless policy explicitly allows direct deletion
    And archived evidence should be written under:
      | path |
      | evidence/archive/<year>/<run-id>/ |
    And an archive manifest should be written at:
      | artifact |
      | evidence/archive/<year>/<run-id>/archive-manifest.v1.json |
    And the manifest should include source path, destination path, artifact count, byte size, content hashes, and cleanup approval id.

  Scenario: Preserve the small set of evidence that matters for daily product work
    Given evidence cleanup has been executed
    When the product owner opens the evidence index
    Then the default view should show:
      | evidence |
      | latest meaningful report truth evidence |
      | latest feature QA evidence |
      | current PI evidence digest |
      | unresolved blockers |
      | pinned evidence |
      | cleanup history |
    And obsolete archived or deleted runs should not dominate the default report
    And complete cleanup history should remain available for audit.

  Scenario: Publish cleanup execution receipts
    Given approved evidence cleanup has completed
    When the Cleanup Executor writes its receipt
    Then it should write a cleanup receipt at:
      | artifact |
      | evidence/cleanup/evidence-cleanup.receipt.v1.json |
    And the receipt should include:
      | field |
      | cleanup id |
      | approved by |
      | approved at |
      | executed at |
      | cleanup plan hash |
      | kept runs |
      | archived runs |
      | deleted runs |
      | blocked actions |
      | bytes reclaimed |
      | errors |
    And the latest evidence report should link to the cleanup receipt.

  Scenario: Keep LLM evidence cleanup advisory until deterministic gates pass
    Given an LLM worker recommends deleting or archiving evidence
    When deterministic cleanup gates evaluate the recommendation
    Then the recommendation should remain advisory until all gates pass:
      | gate |
      | protected reference check |
      | approval check |
      | plan hash check |
      | archive manifest check |
      | cleanup receipt check |
    And the LLM should not be able to bypass a failed gate by changing narrative language.

  Scenario: Enforce an evidence sprawl budget without blocking fresh delivery evidence
    Given evidence run storage exceeds the configured run count or byte-size budget
    When the evidence sprawl budget gate runs
    Then it should warn when cleanup candidates exist
    And it should fail only when protected evidence cannot be found, latest evidence cannot be identified, or cleanup receipts are missing after an approved cleanup
    And fresh delivery evidence should not be deleted merely to satisfy a byte budget.

  Scenario: Pin evidence that product owners still need
    Given a product owner marks an evidence run as important
    When the Evidence Curator Worker updates retention metadata
    Then it should write or update a pin record at:
      | artifact |
      | evidence/index/pins/<run-id>.pin.v1.json |
    And the pin should include:
      | field |
      | run id |
      | pinned by |
      | pinned at |
      | reason |
      | expiry condition |
      | related feature ids |
      | related PI ids |
    And pinned evidence should be classified as protected-pinned until the pin expires or is removed.

  Scenario: Detect evidence that is too noisy for product review
    Given a run contains many low-level artifacts but no compact report, feature index, PI digest, or latest evidence summary
    When the Evidence Curator Worker evaluates product readability
    Then the run should receive:
      | finding |
      | evidence-run-too-noisy-for-product-review |
    And the recommended fix should be one of:
      | fix |
      | create compact human report |
      | connect evidence to feature and scenario |
      | connect evidence to PI digest |
      | archive as low-value historical evidence |
      | delete after approval |
```

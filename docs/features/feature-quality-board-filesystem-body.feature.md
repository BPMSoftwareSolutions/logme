```gherkin
Feature: Feature quality board filesystem body

  As an adversarial product owner
  I want `docs/features/` to include a stable generated feature quality board
  So that the repository itself shows what is releasable, blocked, untested, stale, or promoted without rewriting status files when nothing changed.

  Background:
    Given feature status contracts may exist under `docs/features/_feature-status/`
    And visible status sentinels may exist under `docs/features/`
    And end-user QA evidence bundles may exist under `quality/end-user-test-bundles/`
    And execution proof may exist under `evidence/runs/`
    And the feature quality board is a generated projection from evidence-backed status contracts
    And unchanged status contracts should not be rewritten just because a verification run happened

  Scenario: Generate the product-owner quality board
    Given feature status contracts have been generated
    When the feature quality board projection runs
    Then it should write a human-readable board at:
      """
      docs/features/_FEATURE-QUALITY-BOARD.md
      """
    And it should write a machine-readable board at:
      """
      docs/features/_FEATURE-QUALITY-BOARD.v1.json
      """
    And the Markdown board should be readable by product owners, architects, business owners, and PI stakeholders
    And the JSON board should be the source used to regenerate the Markdown board
    And the board should never be hand-authored.

  Scenario: Show feature status without opening feature documents
    Given `docs/features/_FEATURE-QUALITY-BOARD.md` exists
    When a product owner opens the `docs/features/` directory
    Then the directory should include visible status sentinels matching:
      """
      _STATUS.<display-status>.<feature-id>.md
      """
    And the directory should include the generated quality board
    And the status sentinel filenames should make it obvious which features are:
      | state |
      | not implemented |
      | implemented but not tested |
      | QA blocked |
      | QA failed |
      | QA passed |
      | QA passed and promoted |
      | stale |
    And the product owner should not have to open a feature specification to know the current quality state.

  Scenario: Populate the board with scan-friendly product fields
    Given feature status contracts exist
    When the Markdown quality board is generated
    Then each feature row should include:
      | field |
      | feature id |
      | feature name |
      | display status |
      | implementation status |
      | execution proof status |
      | end-user QA status |
      | promotion status |
      | latest release candidate id |
      | latest QA run id |
      | latest QA bundle path |
      | blocker count |
      | top blocker code |
      | stale indicator |
      | next action |
    And the board should sort features by product urgency:
      | order |
      | stale |
      | QA blocked |
      | QA failed |
      | implemented but not tested |
      | proof blocked |
      | not implemented |
      | QA passed but not promoted |
      | QA waived |
      | QA passed and promoted |
    And the board should group promoted features separately from features needing action.

  Scenario: Write a machine-readable board contract
    Given the board projection has calculated all feature rows
    When it writes `docs/features/_FEATURE-QUALITY-BOARD.v1.json`
    Then the JSON board should contain:
      | field |
      | schema version |
      | board generated at |
      | generator name |
      | repository root |
      | git branch |
      | git commit or working-tree marker |
      | total features |
      | features not implemented |
      | features implemented not tested |
      | features QA blocked |
      | features QA failed |
      | features QA passed |
      | features QA passed promoted |
      | stale features |
      | board rows |
      | source status contract hashes |
      | blocker summary |
    And each board row should include the repo-relative path to its status sentinel
    And each board row should include the repo-relative path to its feature specification
    And every count in the Markdown board should be derived from the JSON board.

  Scenario: Do not churn the board when source status contracts are unchanged
    Given `docs/features/_FEATURE-QUALITY-BOARD.v1.json` exists
    And the source status contract hashes are unchanged
    And the calculated board rows, counts, blocker summary, and stale indicators are unchanged
    When the feature quality board projection runs
    Then it should not rewrite:
      | artifact |
      | docs/features/_FEATURE-QUALITY-BOARD.md |
      | docs/features/_FEATURE-QUALITY-BOARD.v1.json |
      | docs/features/_FEATURE-QUALITY-TREE.txt |
    And the board generated-at timestamp should remain unchanged
    And the run may write a run-scoped board verification receipt under:
      """
      evidence/runs/<run-id>/feature-status-checks/feature-quality-board.receipt.v1.json
      """
    And a fresh verification timestamp alone should not dirty the source-controlled board artifacts.

  Scenario: Rewrite the board only for product-visible board changes
    Given the feature quality board projection has calculated the current board state
    When any board row, summary count, blocker summary, stale indicator, source status hash, or displayed next action changes
    Then it should rewrite the board JSON and Markdown
    And it should update the board generated-at timestamp
    And it should preserve the reason for the board rewrite
    And it should not rewrite the board solely because a status check was executed.

  Scenario: Generate a filesystem tree projection for review
    Given the status sentinels and board have been generated
    When the board projection writes review artifacts
    Then it should write a filesystem tree projection at:
      """
      docs/features/_FEATURE-QUALITY-TREE.txt
      """
    And the tree should show only product-owner scan surfaces:
      | surface |
      | generated quality board |
      | visible status sentinels |
      | feature source documents |
      | status contract directory |
    And the tree should make the quality state visible from filenames
    And the tree should be safe to paste into PI planning notes or architecture review notes.

  Scenario: Detect missing status projection for a feature
    Given a committed feature specification exists
    But no matching status contract exists under `docs/features/_feature-status/`
    When the quality board projection runs
    Then the board should fail with:
      | finding code |
      | feature-missing-status-projection |
    And the board should list the missing feature id
    And the Markdown board should still be written with the missing row marked `stale`
    And no missing feature should be silently treated as QA passed.

  Scenario: Detect status sentinel and JSON contract mismatch
    Given a status contract exists for `<feature-id>`
    And a visible status sentinel exists for `<feature-id>`
    But the sentinel display status does not match the JSON display status
    When the quality board projection verifies filesystem status
    Then it should add a board finding:
      | finding code |
      | feature-status-filesystem-mismatch |
    And the feature row should be marked `stale`
    And the board should include the expected sentinel path
    And the board should include the observed sentinel path.

  Scenario: Tie board status to immutable QA bundle evidence
    Given a feature row is marked `qa-passed` or `qa-passed.promoted`
    When the board projection validates the row
    Then it should verify that the latest QA bundle exists
    And it should verify that `qa-evidence-bundle.manifest.v1.json` exists
    And it should verify that all required bundle artifact hashes match
    And it should verify that `machine-environment.v1.json` exists
    And it should verify that `qa-gate-decision.v1.json` supports the displayed QA status
    And if any verification fails, the feature row should be marked `stale`
    And the board should include the failing artifact path.

  Scenario: Keep QA pass separate from promotion
    Given a feature has a QA-passed bundle
    But no deterministic promotion decision exists
    When the board projection generates the row
    Then the display status should be:
      | display status |
      | qa-passed |
    And the promotion status should be:
      | promotion status |
      | not promoted |
    And the next action should be:
      | next action |
      | run deterministic promotion gate |
    And the board should not imply the feature is releasable.

  Scenario: Promote only through deterministic evidence
    Given a feature status row is proposed as `qa-passed.promoted`
    When the board projection validates promotion
    Then it should require:
      | requirement |
      | latest QA gate decision is QA passed |
      | QA bundle manifest hashes match |
      | machine provenance exists |
      | required human reports exist |
      | deterministic promotion decision exists |
      | promotion decision points to the same release candidate id |
      | promotion decision points to the same QA run id |
      | no unresolved blocker findings exist |
    And an LLM-authored claim of promotion should not satisfy promotion
    And failure should produce:
      | finding code |
      | feature-promotion-not-evidence-backed |

  Scenario: Block stale quality board promotion in CI
    Given a pull request changes feature specs, feature status contracts, QA bundles, or promotion decisions
    When the CI quality board gate runs
    Then it should regenerate:
      | artifact |
      | docs/features/_FEATURE-QUALITY-BOARD.md |
      | docs/features/_FEATURE-QUALITY-BOARD.v1.json |
      | docs/features/_FEATURE-QUALITY-TREE.txt |
      | docs/features/_STATUS.<display-status>.<feature-id>.md |
    And it should fail if generated artifacts differ from committed artifacts
    And it should not fail because an unchanged board kept its previous board generated-at timestamp
    And the failure should include:
      | finding code |
      | feature-quality-board-stale |
    And a stale board should block release promotion.

  Scenario: Provide PI-ready summary counts
    Given the feature quality board has been generated
    When PI planning review asks for feature readiness
    Then the board should show summary counts for:
      | count |
      | total features |
      | not implemented |
      | implemented not tested |
      | proof blocked |
      | QA not run |
      | QA blocked |
      | QA failed |
      | QA passed |
      | QA passed promoted |
      | stale |
    And the board should show the top blocker codes by frequency
    And the board should show the oldest untested implemented feature when dates are available
    And the board should show the newest promoted feature when dates are available.

  Scenario: Preserve existing feature document paths during rollout
    Given existing feature specifications are stored as flat `docs/features/*.feature.md` files
    When the feature quality board is implemented
    Then the implementation should not require moving existing feature specs
    And the board should discover flat feature specs
    And the board should write generated status artifacts beside the flat feature specs
    And if feature body folders are introduced later, the board should support both shapes during migration
    And duplicate feature ids across flat files and folders should produce:
      | finding code |
      | duplicate-feature-id |
```

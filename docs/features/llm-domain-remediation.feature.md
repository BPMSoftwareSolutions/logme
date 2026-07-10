```gherkin
Feature: LLM domain remediation

  As an adversarial product owner
  I want LLM workers to remediate domain body analysis findings through bounded, evidence-backed work packets
  So that executable bodies gain declared meaning, scenario tie-out, action-bearing names, and verified decomposition without trusting unsupported LLM claims.

  Background:
    Given a domain body analysis evidence artifact exists at:
      | artifact |
      | evidence/runs/<run-id>/domain-analysis/domain-body-analysis.contract.v1.json |
    And a domain body sprawl evidence artifact exists at:
      | artifact |
      | evidence/runs/<run-id>/sprawl/domain-body-sprawl.contract.v1.json |
    And the remediation strategy document exists at:
      | artifact |
      | docs/llm-worker-domain-remediation-strategy.md |

  Scenario: Create a remediation backlog from a frozen evidence run
    Given a completed evidence run reports domain body findings
    When the remediation planner starts work for `<run-id>`
    Then it should create a remediation workspace at:
      | path |
      | quality/domain-remediation/<run-id>/ |
    And it should write a backlog artifact at:
      | artifact |
      | quality/domain-remediation/<run-id>/remediation-backlog.v1.json |
    And the backlog should preserve the source run id
    And each backlog item should include:
      | field |
      | packet id |
      | source run id |
      | finding codes |
      | affected paths |
      | recommended worker |
      | allowed mutation paths |
      | required evidence outputs |
      | verification commands |
      | promotion criteria |
    And the backlog should not rewrite the source evidence run.

  Scenario: Bound every LLM worker with a work packet
    Given a remediation backlog item has been selected
    When an LLM worker is assigned the item
    Then the worker should receive a work packet containing:
      | field |
      | packet id |
      | primary worker role |
      | source artifacts |
      | allowed paths |
      | blocked paths |
      | expected outputs |
      | verification commands |
      | promotion criteria |
    And the worker should not edit files outside the allowed paths
    And the worker should not change generated evidence from the source run
    And the worker should write proposal artifacts before making ownership, scenario, naming, decomposition, or package-extraction changes.

  Scenario: Map executable bodies before changing implementation
    Given the evidence run contains executable files with missing scenario tie-out
    When the Domain Cartographer Worker analyzes the run
    Then it should write a domain map proposal at:
      | artifact |
      | quality/domain-remediation/<run-id>/domain-map.proposal.v1.json |
    And it should write a product-owner report at:
      | artifact |
      | quality/domain-remediation/<run-id>/domain-map.report.md |
    And every executable file should receive one proposed primary body responsibility
    And every executable file should be classified as one of:
      | classification |
      | product-domain body |
      | package primitive |
      | generated evidence |
      | test body |
      | scaffold or entrypoint |
      | ambiguous |
    And ambiguous files should remain visible for product-owner review instead of receiving forced weak mappings.

  Scenario: Propose scenario tie-out with cited evidence
    Given the domain map proposal exists
    And executable files are missing scenario tie-out
    When the Scenario Tie-Out Worker builds a tie-out proposal
    Then it should write a scenario tie-out proposal at:
      | artifact |
      | quality/domain-remediation/<run-id>/scenario-tieout.proposal.v1.json |
    And each proposed tie-out should include:
      | field |
      | file path |
      | feature id |
      | scenario id |
      | evidence citation |
      | confidence |
      | reviewer action |
    And evidence citations should reference at least one of:
      | source |
      | feature document |
      | test file |
      | executable method |
      | generated report section |
      | receipt artifact |
    And the proposal should not treat a folder name, loose method name, or unsupported LLM interpretation as sufficient scenario proof.

  Scenario: Block scenario promotion without evidence citation
    Given a scenario tie-out proposal contains a mapping with no evidence citation
    When the promotion gate evaluates the proposal
    Then the mapping should be blocked
    And the finding code should be:
      | finding |
      | scenario-tieout-unsupported |
    And the recommended fix should require a feature document, test, report section, or receipt artifact citation.

  Scenario: Repair missing body contracts through a contract proposal
    Given the analysis report lists executable files missing body contracts
    When the Contract Steward Worker analyzes those files
    Then it should write a body contract proposal at:
      | artifact |
      | quality/domain-remediation/<run-id>/body-contract-patch.proposal.v1.json |
    And each proposed body entry should include:
      | field |
      | body id |
      | path |
      | body kind |
      | action verb |
      | responsibility |
      | feature ids |
      | scenario ids |
      | allowed dependencies |
      | verification |
      | decomposition status |
    And files that do not belong in the product domain body should receive a package, generated-evidence, test, scaffold, or waiver classification.

  Scenario: Block path-only body contracts
    Given a contract patch adds a file path without declaring responsibility
    When the promotion gate validates the body contract proposal
    Then the proposal should be blocked
    And the finding code should be:
      | finding |
      | body-contract-missing-responsibility |
    And the recommended fix should require ownership, intent, scenario tie-out, and verification fields.

  Scenario: Rename actionless executable bodies only when cohesion is proven
    Given an executable file name is noun-only or capability-labeled
    When the Naming And Decomposition Worker evaluates the file
    Then it should classify the remediation as one of:
      | classification |
      | mechanical rename |
      | rename plus contract update |
      | decompose before rename |
      | package-contract exception |
      | product-owner review required |
    And a mechanical rename should be allowed only when the file has one primary responsibility
    And the rename plan should include:
      | field |
      | current path |
      | proposed path |
      | action verb |
      | responsibility evidence |
      | import migration plan |
      | affected tests |
    And no rename should introduce another noun-only executable body.

  Scenario: Propose decomposition before splitting high-risk files
    Given an executable file is a decomposition candidate
    When the Naming And Decomposition Worker prepares a split
    Then it should write a decomposition plan at:
      | artifact |
      | quality/domain-remediation/<run-id>/decomposition-plan.report.md |
    And the plan should include:
      | field |
      | current responsibilities |
      | proposed action-bearing body names |
      | source methods to move |
      | scenario tie-outs |
      | contract updates |
      | import migration plan |
      | behavior-preserving tests |
      | rollback notes |
    And implementation files should not be changed until the decomposition plan is accepted.

  Scenario: Keep package extraction accountable
    Given a file or method is a package extraction candidate
    When the Package Extraction Worker proposes a move
    Then it should write a package extraction plan at:
      | artifact |
      | quality/domain-remediation/<run-id>/package-extraction-plan.report.md |
    And the plan should classify the candidate as one of:
      | classification |
      | existing package |
      | new package |
      | retained domain body |
      | rejected extraction |
      | product-owner review required |
    And extracted package behavior should have package-level ownership, tests, and vocabulary boundaries
    And domain call sites should continue to read in domain language after extraction.

  Scenario: Challenge weak LLM proposals before promotion
    Given a worker proposal is ready for review
    When the Adversarial Review Worker evaluates it
    Then it should write a review artifact at:
      | artifact |
      | quality/domain-remediation/<run-id>/review/<packet-id>.review.md |
    And the review should challenge:
      | risk |
      | scenario mapping without evidence |
      | decomposition that creates generic names |
      | package extraction that hides domain meaning |
      | contract patch that only lists paths |
      | behavior change without test coverage |
      | waiver without owner, reason, and expiry |
    And any high-risk objection should block promotion until it is resolved or explicitly accepted by the product owner.

  Scenario: Verify a promoted remediation packet
    Given a remediation packet has been accepted for promotion
    When the Verification Worker runs the packet verification
    Then it should run the packet's required verification commands
    And it should write a verification report at:
      | artifact |
      | quality/domain-remediation/<run-id>/verification/<packet-id>.report.md |
    And the verification report should include:
      | field |
      | commands run |
      | test results |
      | before metrics |
      | after metrics |
      | changed files |
      | unresolved risks |
      | promotion decision |
    And the promotion decision should be blocked when verification fails.

  Scenario: Track remediation metrics over time
    Given a remediation packet has been promoted
    When domain analysis and sprawl analysis are regenerated
    Then the remediation dashboard should compare before and after values for:
      | metric |
      | executable file names missing action verb |
      | files missing body contract |
      | files missing scenario tie-out |
      | decomposition candidates |
      | analysis blocker candidates |
      | god-file candidates |
      | package extraction candidates |
      | mixed-responsibility files |
      | orphan artifacts |
    And a packet should explain any metric that does not improve
    And a packet should not be marked successful solely because an LLM claimed the design is cleaner.

  Scenario: Enforce new executable files before legacy cleanup is complete
    Given legacy executable files may still have remediation findings
    When a new executable file is introduced
    Then the promotion gate should require the new file to have:
      | requirement |
      | action-bearing executable file name |
      | declared body contract |
      | feature id |
      | scenario id |
      | verification evidence |
    And a new executable file missing any requirement should be blocked
    And legacy findings should remain visible without preventing incremental cleanup unless configured as hard failures.

  Scenario: Require explicit waiver data for deferred remediation
    Given a remediation finding cannot be resolved in the current packet
    When the worker proposes a waiver
    Then the waiver should include:
      | field |
      | finding code |
      | affected path |
      | owner |
      | reason |
      | expiry condition |
      | evidence citation |
      | next review date |
    And a waiver without owner, reason, expiry, and evidence should be blocked.
```

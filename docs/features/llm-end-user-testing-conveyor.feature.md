```gherkin
Feature: LLM end-user testing conveyor

  As an adversarial product owner
  I want a live LLM to pick up a feature and test it as an end user
  So that quality evidence includes real user-perspective execution, seeded data, acceptance review, and a human-readable experience report.

  Scenario: Assign a feature scenario to the LLM testing conveyor
    Given a committed feature scenario exists under `docs/features/`
    And the scenario is implemented or ready for quality validation
    When the LLM end-user testing conveyor starts
    Then it should create an LLM QA assignment containing:
      | field |
      | release candidate id |
      | QA run id |
      | feature id |
      | scenario id |
      | scenario name |
      | acceptance source path |
      | acceptance source line range |
      | requested end-user persona |
      | allowed test surfaces |
      | allowed seed data paths |
      | allowed evidence paths |
      | forbidden mutation paths |
      | required human report artifacts |
      | provider name |
      | model name |
    And the provider should default to Gemini when no other provider is configured
    And the assignment should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-qa-assignment.v1.json
      """

  Scenario: Build the LLM handoff packet
    Given an LLM QA assignment exists
    When the conveyor prepares the handoff packet
    Then it should give the LLM only bounded testing context:
      | context |
      | feature Gherkin |
      | acceptance criteria |
      | current executable body proof report |
      | current method drill-down report when available |
      | current sprawl report when available |
      | target user surface instructions |
      | seed data rules |
      | evidence bundle requirements |
      | forbidden actions |
      | pass/fail reporting expectations |
    And the packet should not include secrets, API keys, personal tokens, or unrelated repository context
    And the handoff packet should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-handoff-packet.report.md
      """
    And a machine-readable copy should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-handoff-packet.v1.json
      """

  Scenario: Let the LLM propose seed data before testing
    Given the LLM has received a handoff packet
    When the LLM prepares to test the feature
    Then it may propose seed data required to exercise the scenario
    And the seed data proposal should include:
      | field |
      | seed data id |
      | purpose |
      | scenario coverage |
      | records to create |
      | files to create |
      | expected user-visible state |
      | cleanup instructions |
      | allowed paths |
      | privacy classification |
      | synthetic data declaration |
    And seed data should be synthetic unless the assignment explicitly allows fixture data
    And the proposal should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-seed-data-proposal.v1.json
      """
    And the LLM should not directly mutate production data or unapproved repository paths.

  Scenario: Materialize seed data through a deterministic gate
    Given the LLM proposes seed data
    When the seed data gate runs
    Then it should validate:
      | rule |
      | seed data is synthetic or approved fixture data |
      | all writes stay inside allowed seed data paths |
      | no secrets or personal data are present |
      | cleanup instructions exist |
      | expected user-visible state is declared |
      | seed data is tied to feature id and scenario id |
    And rejected seed proposals should block the LLM QA run
    And approved seed data should be materialized under:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/seed-data/
      """
    And the materialization receipt should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/seed-data.receipt.v1.json
      """

  Scenario: Execute the feature as an end user
    Given seed data has been approved or no seed data is required
    When the LLM executes the feature scenario
    Then it should interact only through allowed end-user surfaces
    And allowed surfaces may include:
      | surface |
      | CLI command |
      | Markdown report review |
      | HTML preview review |
      | browser workflow |
      | local app workflow |
      | CI preview artifact |
    And every action should be recorded as an end-user step
    And each step should include:
      | field |
      | step index |
      | action |
      | target surface |
      | input used |
      | expected result |
      | observed result |
      | timestamp |
      | screenshot or output path |
      | status |
    And the raw user-session transcript should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-end-user-session.v1.json
      """
    And a readable session narrative should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/end-user-test-session.md
      """

  Scenario: Validate generated Markdown and HTML projections as user-facing surfaces
    Given the tested feature produces Markdown, ASCII, or HTML reports
    When the LLM runs end-user testing
    Then it should inspect the generated Markdown report as a human-facing artifact
    And it should inspect the HTML projection when HTML rendering is available
    And the inspection should verify:
      | expectation |
      | executive summary is understandable |
      | ASCII sketches render clearly |
      | links use repo-relative or artifact-relative paths |
      | evidence paths resolve |
      | blocker states are visible before dense details |
      | timing and call-count facts are readable |
      | no JSON-only evidence is presented as product-ready |
      | report can be shared with architects and business owners |
    And visual or readability blockers should be recorded in the QA bundle
    And a screenshot index should be written when visual surfaces are inspected.

  Scenario: Tie LLM observations to executable proof
    Given the LLM records end-user observations
    And feature execution proof exists for the same scenario
    When the QA evidence collector closes the run
    Then each LLM observation should tie to one or more evidence sources:
      | evidence source |
      | executable-body-contract.report.md |
      | feature-execution.contract.v1.json |
      | method-execution-timeline.table.md |
      | method-call-evidence.report.md |
      | telemetry.events.v1.jsonl |
      | receipt files |
      | screenshot or terminal output |
      | HTML preview artifact |
    And an LLM observation without evidence should be marked `unproven observation`
    And unproven observations should not be used to pass the quality gate.

  Scenario: Generate the LLM user experience report
    Given the LLM has completed end-user testing
    When the conveyor asks for the user experience report
    Then the LLM should generate a Markdown report at:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/llm-user-experience.report.md
      """
    And the report should include:
      | section |
      | executive user experience summary |
      | persona and test intent |
      | seed data used |
      | user journey steps |
      | acceptance criteria review |
      | what passed |
      | what failed |
      | confusing or risky experience points |
      | evidence links |
      | screenshots or output links |
      | accessibility or readability observations |
      | recommended product follow-ups |
    And the report should explain the LLM's user-visible observations without requiring hidden chain-of-thought
    And every pass/fail claim should link to evidence in the QA bundle.

  Scenario: Review acceptance criteria with LLM reasoning but deterministic evidence
    Given the LLM user experience report exists
    When acceptance criteria review runs
    Then each acceptance criterion should be classified as:
      | status |
      | met |
      | not met |
      | partially met |
      | blocked |
      | not testable from assigned surface |
    And each classification should include:
      | field |
      | criterion text |
      | LLM observation summary |
      | evidence paths |
      | blocker code |
      | recommended fix route |
    And the LLM may recommend status
    But the quality gate should only pass criteria whose evidence paths prove the recommendation.

  Scenario: Package the LLM QA evidence bundle
    Given LLM end-user testing has completed
    When the QA bundle is assembled
    Then the bundle should include:
      | artifact |
      | llm-qa-assignment.v1.json |
      | llm-handoff-packet.report.md |
      | llm-handoff-packet.v1.json |
      | llm-seed-data-proposal.v1.json |
      | seed-data.receipt.v1.json |
      | llm-end-user-session.v1.json |
      | end-user-test-session.md |
      | llm-user-experience.report.md |
      | acceptance-criteria-review.v1.json |
      | acceptance-criteria-review.report.md |
      | qa-evidence-bundle.manifest.v1.json |
      | qa-evidence-bundle.report.md |
      | qa-gate-decision.v1.json |
      | machine-environment.v1.json |
      | feature-proof-links.v1.json |
      | report-artifact-index.v1.json |
      | blocker-worklist.md |
    And each artifact should include the release candidate id, QA run id, feature id, and scenario id
    And the bundle manifest should include content hashes for every artifact.

  Scenario: Decide QA pass or fail outside the LLM
    Given the LLM has produced a user experience report
    And the QA bundle has been assembled
    When the LLM QA gate runs
    Then the gate should calculate the quality decision from evidence
    And the LLM should not be allowed to promote its own run
    And QA pass should require:
      | requirement |
      | all required acceptance criteria are evidence-backed met or explicitly waived |
      | required feature execution proof exists |
      | required human reports exist |
      | seed data was approved or not required |
      | machine provenance exists |
      | no unresolved blocker findings exist |
      | bundle manifest hashes match |
    And the decision should be written to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/qa-gate-decision.v1.json
      """

  Scenario: Block unsafe or out-of-bounds LLM testing
    Given an LLM QA run attempts an unsafe or out-of-bounds action
    When the conveyor guardrail evaluates the action
    Then the run should be blocked if the LLM attempts to:
      | forbidden action |
      | mutate outside allowed paths |
      | use secrets or personal data in seed data |
      | claim acceptance without evidence |
      | skip required human report review |
      | send external notifications before notification capability is approved |
      | alter promoted QA bundle contents |
      | mark itself QA passed |
    And the finding code should be:
      | finding |
      | llm-end-user-testing-guardrail-violation |
    And the blocked run should still produce a QA bundle with the blocker evidence.

  Scenario: Support feature-wide scenario conveyor runs
    Given a feature has multiple scenarios
    When the LLM end-user testing conveyor is assigned the whole feature
    Then it should run each scenario independently
    And each scenario should have its own QA run record or scenario sub-run id
    And the feature-level QA summary should show:
      | field |
      | total scenarios |
      | scenarios passed |
      | scenarios failed |
      | scenarios blocked |
      | scenarios not testable |
      | seed data sets used |
      | overall quality gate decision |
      | bundle paths |
    And one scenario passing should not imply another scenario passed.

  Scenario: Preserve replayability for human reviewers
    Given an LLM QA bundle exists
    When a human reviewer opens the bundle
    Then the reviewer should be able to replay the test in sequence from:
      | replay source |
      | assignment |
      | handoff packet |
      | seed data receipt |
      | end-user session steps |
      | screenshots or terminal outputs |
      | user experience report |
      | acceptance criteria review |
      | QA gate decision |
    And the bundle should explain what command or surface was used
    And the bundle should distinguish LLM observations from deterministic gate results.

  Scenario: Prepare future notification without sending it
    Given an LLM QA run has produced a bundle
    When the conveyor prepares stakeholder notification content
    Then it may write a draft notification packet at:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/stakeholder-notification-draft.report.md
      """
    And the draft should summarize QA result, bundle path, report path, blockers, and recommended next step
    And the conveyor should not send email or external notifications until a separate notification feature is approved.
```

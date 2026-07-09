```gherkin
Feature: End-user quality evidence bundle

  As an adversarial product owner
  I want every releasable feature to have a human-readable QA evidence bundle
  So that architects, business owners, and PI stakeholders can review real end-user testing before promotion.

  Scenario: Inventory QA status for every feature scenario
    Given committed feature files exist under `docs/features/`
    And feature execution proof reports may exist for one or more scenarios
    When the quality inventory runs
    Then it should discover every feature scenario
    And it should classify each scenario as one of:
      | QA status |
      | not QAed |
      | QA attempted failed |
      | QA attempted blocked |
      | QA passed |
      | QA waived with approval |
    And each inventory row should include:
      | field |
      | feature id |
      | scenario id |
      | scenario name |
      | implementation proof status |
      | QA status |
      | latest QA run id |
      | latest QA bundle path |
      | quality gate decision |
      | reviewer or approver |
      | blocker codes |
    And no implemented or proven scenario should be omitted from the QA inventory.

  Scenario: Execute real end-user QA from the user perspective
    Given a feature scenario is ready for quality validation
    When the QA test is executed
    Then the test should exercise the system through an end-user surface
    And an end-user surface may be:
      | surface |
      | CLI command used by a product owner |
      | generated Markdown report reviewed by a human |
      | browser-rendered HTML projection |
      | local app workflow |
      | CI preview artifact |
    And the QA test should validate the actual human projection when the feature produces one
    And a Markdown report feature should be QAed by generating and inspecting the Markdown artifact
    And an HTML projection feature should be QAed by rendering the Markdown-to-HTML artifact before promotion
    And unit tests alone should not satisfy end-user QA.

  Scenario: Create a QA evidence bundle for every QA attempt
    Given an end-user QA test has run
    And the release candidate id is `<release-candidate-id>`
    And the QA run id is `<qa-run-id>`
    When the QA evidence collector closes the run
    Then it should write a source-controlled QA bundle under:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/
      """
    And the bundle should be written for both passing and failing QA attempts
    And the bundle should contain:
      | artifact |
      | qa-evidence-bundle.manifest.v1.json |
      | qa-evidence-bundle.report.md |
      | qa-gate-decision.v1.json |
      | qa-execution-timeline.table.md |
      | machine-environment.v1.json |
      | end-user-test-session.md |
      | llm-user-experience.report.md |
      | acceptance-criteria-review.report.md |
      | feature-proof-links.v1.json |
      | report-artifact-index.v1.json |
      | blocker-worklist.md |
      | screenshots.index.md |
      | html-preview.index.md |
    And every artifact should include the same release candidate id and QA run id.

  Scenario: Preserve machine and execution provenance
    Given a QA evidence bundle is created
    When machine provenance is captured
    Then `machine-environment.v1.json` should include:
      | field |
      | machine hostname or stable machine id |
      | operating system |
      | CPU architecture |
      | timezone |
      | Node.js version |
      | browser name and version when applicable |
      | viewport or terminal size when applicable |
      | git branch |
      | git commit or working-tree marker |
      | repository root |
      | command executed |
      | started at |
      | finished at |
      | duration ms |
      | CI provider and run URL when applicable |
    And secrets, API keys, and personal access tokens should be redacted.

  Scenario: Generate the human-readable QA bundle report
    Given `qa-evidence-bundle.manifest.v1.json` exists
    When `qa-evidence-bundle.report.md` is generated
    Then the first product-facing section should show:
      | field |
      | release candidate id |
      | QA run id |
      | quality gate decision |
      | tested feature scenarios |
      | QA operator or automation identity |
      | machine identity |
      | started at |
      | finished at |
      | duration ms |
      | blocker count |
      | promotion recommendation |
    And the report should include:
      | section |
      | executive QA summary |
      | tested user journeys |
      | end-user surface inspected |
      | generated Markdown reports reviewed |
      | generated HTML previews reviewed |
      | LLM user experience report |
      | acceptance criteria review |
      | linked executable body proof reports |
      | linked sprawl reports |
      | screenshots or visual evidence index |
      | machine and run provenance |
      | blocker worklist |
      | reviewer notes |
    And a product owner should not need to open JSON to understand whether the release candidate is QA passed.

  Scenario: Link executable body reports into the QA bundle
    Given a QA bundle validates one or more feature scenarios
    When the QA evidence bundle is assembled
    Then it should copy or link the relevant human reports:
      | report |
      | executable-body-contract.report.md |
      | execution-timeline.table.md |
      | method-execution-timeline.table.md |
      | method-call-evidence.report.md |
      | domain-body-sprawl.report.md |
      | domain-body-sprawl-hotspots.table.md |
      | report.md |
      | llm-user-experience.report.md |
      | acceptance-criteria-review.report.md |
    And the bundle manifest should include the source path and content hash for each linked report
    And missing required human reports should block QA pass
    And the finding code should be:
      | finding |
      | qa-bundle-missing-human-proof-report |

  Scenario: Lock a passing QA bundle as release proof
    Given a QA bundle has quality gate decision `QA passed`
    When the quality promotion gate runs
    Then it should mark the release candidate as promotable only if:
      | requirement |
      | all required feature scenarios are QA passed or explicitly waived |
      | every QA-passed scenario has executable body proof |
      | every required Markdown report exists |
      | every required HTML preview exists when the feature has an HTML projection |
      | machine provenance is present |
      | bundle manifest hashes match bundle contents |
      | blocker count is zero |
    And it should write the promotion decision to:
      """
      quality/end-user-test-bundles/<release-candidate-id>/<qa-run-id>/qa-gate-decision.v1.json
      """
    And a promoted bundle should be immutable
    And any correction should create a new QA run id, not mutate the promoted bundle.

  Scenario: Block release without QA bundle
    Given a release candidate is proposed for promotion
    But no QA evidence bundle exists under `quality/end-user-test-bundles/<release-candidate-id>/`
    When the quality promotion gate runs
    Then the release candidate should be BLOCKED
    And the finding code should be:
      | finding |
      | release-candidate-without-end-user-qa-bundle |
    And CI/CD should not mark the release candidate releasable.

  Scenario: Render QA status in the global report
    Given one or more QA evidence bundles exist in the repo
    When the global `report.md` is rendered
    Then it should include a compact QA readiness section with:
      | field |
      | release candidate id |
      | latest QA run id |
      | QA status |
      | quality gate decision |
      | tested scenario count |
      | failed scenario count |
      | waived scenario count |
      | bundle path |
      | QA report path |
      | machine provenance path |
    And `report.md` should link to `qa-evidence-bundle.report.md` using a repo-relative path
    And `report.md` should not embed the full QA bundle.

  Scenario: Preserve visual projection evidence for HTML publication
    Given a Markdown report is intended to be transformed into HTML, a dashboard, a deck, or a publication
    When end-user QA runs
    Then the QA bundle should include an HTML preview index when HTML rendering is available
    And the preview index should include:
      | field |
      | source Markdown report path |
      | generated HTML path or artifact URL |
      | screenshot path |
      | viewport |
      | render timestamp |
      | visual QA status |
      | blocker code |
    And ASCII sketches should be checked for readable HTML rendering
    And visual render blockers should prevent QA pass.

  Scenario: Keep transient run evidence separate from promoted QA evidence
    Given `evidence/runs/` contains transient generated evidence
    And a QA bundle is promoted
    When the QA bundle is assembled
    Then the promoted bundle should live under `quality/end-user-test-bundles/`
    And it should include hashes or copied snapshots of the evidence needed for human review
    And transient `evidence/runs/` paths alone should not be release authority
    And the source-controlled QA bundle should be the durable promotion record.
```

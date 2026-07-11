```gherkin
Feature: LLM testimony accuracy remediation

  As an adversarial product owner
  I want Gemini LLM workers to classify, repair, and verify noisy testimony calls through bounded remediation packets
  So that feature execution proof shows meaningful product calls while utility, package, and telemetry infrastructure work stays outside the product-domain audit surface.

  Background:
    Given a feature execution proof run exists under:
      | artifact |
      | evidence/runs/<run-id>/features/<feature-id>/scenarios/<scenario-id>/feature-execution.contract.v1.json |
    And the scenario proof may include method calls whose method name is `not observed`
    And the raw telemetry may include `sampleMethod` testimony events
    And Gemini is the preferred LLM provider for testimony remediation packets
    And deterministic gates, not LLM assertions, decide whether a remediation packet can be promoted.

  Scenario: Create a testimony remediation backlog from proof noise
    Given a proof run contains noisy method drill-down evidence
    When the testimony remediation planner analyzes `<run-id>`
    Then it should write a backlog artifact at:
      | artifact |
      | quality/domain-remediation/<run-id>/testimony-accuracy/remediation-backlog.v1.json |
    And each backlog item should include:
      | field |
      | packet id |
      | source run id |
      | feature id |
      | scenario id |
      | noisy proof artifact paths |
      | telemetry source paths |
      | affected source paths |
      | unnamed method call count |
      | repeated sampleMethod event count |
      | suspected primary product calls |
      | suspected package-boundary calls |
      | suspected pure utility calls |
      | suspected telemetry-infrastructure calls |
      | Gemini worker role |
      | allowed mutation paths |
      | blocked mutation paths |
      | required proposal artifacts |
      | required verification commands |
      | promotion criteria |
    And the backlog should not require a platform agent to manually inspect every call.

  Scenario: Delegate testimony classification to Gemini workers
    Given a testimony remediation backlog item exists
    When the Gemini Testimony Classifier Worker receives the work packet
    Then the work packet should contain only the relevant source slices, proof slices, telemetry summary, and body contract context
    And the worker should classify each candidate call as one of:
      | audit boundary |
      | product-domain-native |
      | product-domain-boundary-case |
      | package-boundary-summarized |
      | pure-utility-extract |
      | telemetry-infrastructure-suppress |
      | generated-evidence-ignore |
      | product-owner-review-required |
    And the worker should write the classification proposal to:
      | artifact |
      | quality/domain-remediation/<run-id>/testimony-accuracy/<packet-id>.classification.proposal.v1.json |
    And every classification should include:
      | field |
      | source path |
      | source line range |
      | current method name |
      | observed telemetry name |
      | inferred intended method name |
      | audit boundary |
      | reason |
      | evidence citations |
      | confidence |
      | recommended remediation action |
    And the worker should not edit implementation files during classification.

  Scenario: Build compact Gemini handoff JSON for testimony remediation
    Given a testimony remediation backlog item exists
    When the remediation coordinator prepares Gemini input
    Then it should write a compact handoff artifact at:
      | artifact |
      | quality/domain-remediation/<run-id>/testimony-accuracy/<packet-id>.gemini-handoff.v1.json |
    And the handoff should include:
      | field |
      | packet id |
      | source proof path |
      | source telemetry summary |
      | affected source slices |
      | current body contract entries |
      | current feature and scenario ids |
      | noisy call clusters |
      | candidate remediation actions |
      | allowed paths |
      | blocked paths |
      | required output schema |
    And the handoff should not include entire run folders, full historical archives, or unrelated source files
    And the LLM worker should return structured JSON, not prose-only recommendations.

  Scenario: Identify native product calls that require accurate testimony
    Given the Gemini classification proposal exists
    When the proposal contains `product-domain-native` calls
    Then each native product call should be required to testify with its actual method identity
    And the proposed testimony change should replace generic testimony such as:
      | generic testimony |
      | LogMe(sampleMethod) |
    With method-specific testimony that can render:
      | proof field |
      | method name |
      | method kind |
      | runtime path |
      | source line range |
    And the proposal should preserve the method's product-domain name rather than hiding it behind a helper, wrapper, or generic event label.

  Scenario: Move pure utility calls behind a package boundary
    Given the Gemini classification proposal contains `pure-utility-extract` calls
    When the Package Boundary Worker prepares remediation
    Then it should write a package extraction proposal at:
      | artifact |
      | quality/domain-remediation/<run-id>/testimony-accuracy/<packet-id>.package-extraction.proposal.v1.json |
    And each extraction candidate should include:
      | field |
      | current source path |
      | current method name |
      | proposed package path |
      | proposed package method name |
      | calling product-domain body |
      | reason it is utility, not product behavior |
      | behavior-preserving tests |
      | import migration plan |
      | package-level audit owner |
      | rollback note |
    And the product-domain proof should summarize the package call instead of expanding every utility method call.

  Scenario: Move extracted utilities out of source-domain audit scope
    Given a pure utility method has been accepted for package extraction
    When the utility is moved or mapped behind a package boundary
    Then the source-domain audit should stop treating that utility method as a product-domain executable body
    And the package audit should own the utility's testimony, behavior tests, and package contract
    And the source-domain proof should retain only:
      | field |
      | package name |
      | package operation summary |
      | package version or local package path |
      | package audit receipt path |
      | product-domain call site |
      | reason the package boundary is allowed |
    And the source-domain scan should not expand package-internal utility methods unless a complete workspace audit is requested.

  Scenario: Select audit scope from changed paths
    Given workspace changes have been detected
    When the audit planner calculates scan scope
    Then each changed path should be classified into one of:
      | audit scope |
      | source-domain audit |
      | package audit |
      | generated-evidence audit |
      | documentation-only audit |
      | complete workspace audit |
    And `src/` product-domain changes should trigger source-domain audit
    And package-owned changes should trigger only the owning package audit by default
    And changes that cross source and package boundaries should trigger both audits
    And a complete workspace audit should run only when explicitly requested, scheduled, or required by a boundary contract change.

  Scenario: Keep package audits independently provable
    Given a utility package owns extracted behavior
    When the package audit runs
    Then it should write a package audit receipt containing:
      | field |
      | package id |
      | package path |
      | package version or content hash |
      | changed files |
      | package methods audited |
      | package tests run |
      | package testimony status |
      | source-domain dependents |
      | audit decision |
    And the source-domain proof should cite the package audit receipt instead of duplicating package internals
    And the package audit should be reusable by any source-domain feature that depends on the package.

  Scenario: Support package externalization without weakening source-domain proof
    Given a package boundary has a current package audit receipt
    When the package is externalized into a separate repository or installed dependency
    Then the source-domain audit should require:
      | field |
      | package name |
      | package version |
      | package integrity hash |
      | external package audit receipt or release proof |
      | allowed API surface |
      | source-domain dependents |
    And source-domain agents should not mutate externalized package internals from this repository
    And the source-domain proof should fail if it depends on an external package without a current package proof.

  Scenario: Keep boundary cases visible for product-owner review
    Given the Gemini classification proposal contains `product-domain-boundary-case`
    When the remediation backlog is rendered for product-owner review
    Then each boundary case should remain visible with:
      | field |
      | candidate method |
      | competing classifications |
      | product meaning argument |
      | utility extraction argument |
      | expected proof impact |
      | reviewer decision needed |
    And no boundary case should be auto-extracted or auto-promoted solely because the LLM prefers a cleaner shape.

  Scenario: Suppress telemetry infrastructure from feature proof drill-down
    Given the proof call list includes testimony infrastructure calls
    When the testimony remediation packet is promoted
    Then calls classified as `telemetry-infrastructure-suppress` should not appear as product method calls
    And the proof should retain a telemetry infrastructure summary containing:
      | field |
      | event count |
      | suppressed method names |
      | telemetry package path |
      | suppression reason |
      | source evidence paths |
    And suppressed telemetry infrastructure should not reduce product-domain call clarity.

  Scenario: Generate a remediation patch only after classification is accepted
    Given a classification proposal has passed adversarial review
    And the product owner has accepted the candidate classifications
    When the Gemini Testimony Remediation Worker generates a patch proposal
    Then it should write a patch proposal at:
      | artifact |
      | quality/domain-remediation/<run-id>/testimony-accuracy/<packet-id>.patch.proposal.v1.json |
    And the patch proposal should include:
      | field |
      | changed paths |
      | testimony replacements |
      | package extraction changes |
      | import updates |
      | body contract updates |
      | feature and scenario tie-out updates |
      | expected before metrics |
      | expected after metrics |
      | verification commands |
    And the worker should not mutate blocked paths
    And the worker should not rewrite historical evidence under `evidence/runs/<run-id>/`.

  Scenario: Convert every classification into an actionable sterilization step
    Given a Gemini classification proposal has been accepted
    When the testimony sterilization planner creates the remediation plan
    Then it should write an actionable plan at:
      | artifact |
      | quality/domain-remediation/<run-id>/testimony-accuracy/<packet-id>.sterilization-plan.v1.json |
    And every contamination item should include exactly one next action:
      | next action |
      | replace testimony with native method identity |
      | extract pure utility to package boundary |
      | summarize existing package boundary |
      | suppress telemetry infrastructure from product proof |
      | update executable body source range |
      | split ambiguous boundary case for product-owner decision |
    And each action should include:
      | field |
      | contamination id |
      | source path |
      | source line range |
      | current method name |
      | audit boundary classification |
      | target package or product body |
      | mutation paths |
      | blocked paths |
      | expected proof change |
      | verification command |
      | zero-contamination assertion |
      | rollback note |
    And no finding should remain as a report-only observation without an executable remediation action.

  Scenario: Prevent report-only remediation loops
    Given testimony analysis artifacts exist
    But no accepted sterilization plan exists for the detected contamination
    When the remediation status is projected
    Then the feature should remain in:
      | status |
      | needs-remediation |
    And the finding code should be:
      | finding |
      | testimony-remediation-report-without-action |
    And the recommended fix should create or accept a Gemini sterilization plan with concrete mutation paths and verification commands.

  Scenario: Block platform-agent mechanical rewrites when Gemini work packets can do the work
    Given testimony remediation requires many repeated source edits
    When the remediation coordinator assigns the work
    Then the default executor should be a Gemini worker packet
    And a platform agent should be limited to:
      | responsibility |
      | creating bounded work packets |
      | running deterministic verification |
      | promoting accepted patches |
      | summarizing results for product-owner review |
    And a platform agent should not manually rewrite every `LogMe(sampleMethod)` call when the Gemini packet can propose the changes.

  Scenario: Route high-volume testimony remediation through Gemini budget
    Given a testimony remediation backlog contains high-volume repeated edits
    When the remediation coordinator selects an executor
    Then Gemini should be the preferred provider for:
      | work type |
      | noisy call classification |
      | method-name testimony replacement proposals |
      | utility extraction candidate discovery |
      | package-boundary summary proposals |
      | body contract patch drafting |
    And provider usage should be recorded with:
      | field |
      | provider |
      | model |
      | packet id |
      | prompt artifact path |
      | response artifact path |
      | token estimate |
      | retry count |
      | fallback reason |
    And fallback to another provider should require an explicit provider failure or product-owner override
    And the platform agent should not perform high-volume mechanical analysis when a Gemini packet can do it.

  Scenario: Promote remediation only through the sterilization gate
    Given a testimony remediation patch has been applied
    When the sterilization gate evaluates the changed workspace
    Then it should verify:
      | requirement |
      | product-domain-native calls have accurate method names |
      | product-domain-native calls have accurate method kinds |
      | pure utility calls are extracted or mapped to package boundaries |
      | package-boundary calls are summarized in product proof |
      | telemetry infrastructure calls are suppressed from product method drill-down |
      | executable body source ranges cover the observed work |
      | body contract entries match the new ownership boundary |
      | affected feature scenarios have regenerated proof |
    And the gate should block promotion when any requirement fails
    And the gate should write a sterilization receipt at:
      | artifact |
      | quality/domain-remediation/<run-id>/testimony-accuracy/<packet-id>.sterilization-receipt.v1.json |

  Scenario: Require zero product-domain contamination before closure
    Given testimony remediation has completed for a packet
    When the final sterilization summary is calculated
    Then the following contamination counts must be zero:
      | contamination count |
      | unnamed product-domain-native method calls |
      | product-domain-native calls with methodKind not observed |
      | unclassified silent methods in product-domain bodies |
      | pure utility methods remaining inside product-domain bodies |
      | package utilities expanded as product method rows |
      | telemetry infrastructure calls shown as product method rows |
      | incomplete executable body source ranges |
      | status or proof claims citing missing evidence |
    And if any count is greater than zero, the workflow should create the next remediation packet
    And the workflow should not mark the feature, scenario, or packet as sterilized.

  Scenario: Verify testimony accuracy after remediation
    Given a testimony remediation patch has been promoted
    When the verification worker reruns proof generation for the affected feature scenarios
    Then the new canonical JSON proof should show no product-domain-native method call with:
      | blocked value |
      | methodName: not observed |
      | methodKind: not observed |
    And package-boundary utility calls should be summarized, not expanded into repeated product method rows
    And telemetry infrastructure calls should be suppressed from product method drill-down
    And the verification report should compare:
      | metric |
      | unnamed product method calls before |
      | unnamed product method calls after |
      | sampleMethod telemetry events before |
      | sampleMethod telemetry events after |
      | package-boundary summarized calls |
      | product-domain-native calls with accurate names |
      | source-domain audit file count before |
      | source-domain audit file count after |
      | package audit file count |
      | skipped package-internal utility methods |
      | proof report byte size before |
      | proof report byte size after |

  Scenario: Prove scan efficiency improved after utility extraction
    Given a testimony sterilization packet extracts utility methods to package boundaries
    When the post-remediation scan metrics are calculated
    Then the verification report should compare:
      | metric |
      | source-domain files scanned before |
      | source-domain files scanned after |
      | source-domain methods scanned before |
      | source-domain methods scanned after |
      | package methods scanned separately |
      | source-domain scan duration before |
      | source-domain scan duration after |
      | source-domain proof rows before |
      | source-domain proof rows after |
      | package audit receipts reused |
    And the packet should not claim efficiency improvement unless source-domain scan scope, proof noise, or scan duration decreases
    And any package scan cost should be reported separately from source-domain scan cost.

  Scenario: Regenerate source truth after sterilization
    Given the sterilization gate passes
    When source truth artifacts are regenerated
    Then the workflow should update or create:
      | artifact |
      | declared file-system body contract |
      | package ownership contract |
      | feature execution proof JSON |
      | executable body report |
      | executable body tree |
      | source-controlled feature proof body |
      | feature status projection |
    And generated status should change only when the underlying status actually changes
    And regenerated proof should cite the sterilization receipt
    And raw run evidence should remain outside version control unless explicitly allowed by evidence policy.

  Scenario: Block proven status when product-domain method names are still missing
    Given a feature execution proof contains method calls classified as `product-domain-native`
    And one or more of those calls still have method name `not observed`
    When the promotion decision is calculated
    Then the scenario should not be marked `proven`
    And the finding code should be:
      | finding |
      | product-method-name-not-observed |
    And the recommended fix should create a Gemini testimony remediation packet.

  Scenario: Block incomplete executable body source ranges
    Given a declared executable body node has a source line range
    And observed or statically inferred work occurs outside that range
    When the proof source-truth gate evaluates the node
    Then the proof should be blocked
    And the finding code should be:
      | finding |
      | executable-body-source-range-incomplete |
    And the recommended fix should require the Gemini worker to propose an updated source range or a decomposed body node.

  Scenario: Preserve a concise product-owner proof surface
    Given a remediated proof contains product-domain-native calls and package-boundary summaries
    When `executable-body-tree.ascii.md` is rendered
    Then the first product-facing view should prioritize:
      | field |
      | product-domain-native method names |
      | product body node labels |
      | package-boundary summaries |
      | blocker findings |
      | source evidence paths |
    And dense utility detail should be available through linked package evidence only when needed
    And a product owner should not need to scan hundreds of repeated unnamed calls to understand execution.
```

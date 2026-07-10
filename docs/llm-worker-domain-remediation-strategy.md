# LLM Worker Strategy For Domain Body Remediation

## Evidence Snapshot

Source run: `162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd`

Domain body analysis:

- Evidence artifact: `evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/domain-analysis/domain-body-analysis.contract.v1.json`
- Analysis report: `evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/domain-analysis/domain-body-analysis.report.md`
- Total executable files: 62
- Action-bearing executable files: 44
- Executable file names missing action verb: 18
- Files missing body contract: 12
- Files missing scenario tie-out: 62
- Decomposition candidates: 52
- Analysis blocker candidates: 62

Domain body sprawl:

- Evidence artifact: `evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/sprawl/domain-body-sprawl.contract.v1.json`
- Sprawl report: `evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/sprawl/domain-body-sprawl.report.md`
- Total source files scanned: 65
- Focused files: 14
- Watchlist files: 15
- God-file candidates: 1
- Package extraction candidates: 34
- Mixed-responsibility files: 1
- Orphan artifacts: 65

## Product Position

The primary product risk is not only file size or naming. The sharper risk is that the repository cannot prove why each executable body exists, which scenario it serves, and whether its current shape is the smallest meaningful body for that scenario.

LLM workers should be used as analysis and drafting workers, not as silent authorities. They can infer candidate meaning, propose decompositions, and draft contract patches. They cannot mark remediation complete by assertion. A deterministic gate must accept every promoted change through contracts, evidence artifacts, reports, and tests.

The current numbers imply this order of concern:

1. Scenario tie-out is the universal blocker. `62/62` executable files are missing scenario tie-out, so the system cannot yet prove implementation-to-product coverage.
2. Body-contract coverage is the first concrete repair. `12` executable files are missing body contracts and should be triaged before large code motion.
3. Naming is a user-experience and maintenance problem. `18` executable files lack action-bearing names and are likely to become dumping grounds.
4. Decomposition needs careful sequencing. `52` decomposition candidates is too broad for one pass, so LLMs must work from scoped packets.
5. Package extraction must not become an escape hatch. `34` package extraction candidates need package-level contracts, not just file movement.
6. Orphan artifact status is an evidence problem. `65` orphan artifacts means ownership and feature mapping are not yet trustworthy enough for strict enforcement.

## Operating Rules For LLM Workers

Every LLM worker receives a bounded work packet. A packet names the source evidence, allowed files, expected outputs, permitted mutations, verification commands, and rollback notes.

LLM workers must produce proposal artifacts before code changes when they are changing ownership, naming, decomposition, or scenario mapping. Direct code edits are acceptable only for low-risk contract coverage, report wiring, tests, or clearly mechanical renames with deterministic verification.

Every promoted worker result must answer five questions:

1. What user-facing or domain scenario does this body serve?
2. What action does this executable body perform?
3. Why is this body not part of another body?
4. Which contract declares this body and its boundaries?
5. Which test or evidence artifact proves the claim?

No worker should be allowed to resolve a finding by suppressing it. Findings can be resolved only by one of these outcomes:

- The executable body receives a declared contract and scenario tie-out.
- The executable body is renamed to an action-bearing body name.
- The executable body is decomposed into smaller action-bearing bodies.
- The executable body is moved into a package with a package body contract.
- The finding is converted into an explicit waiver with owner, reason, expiry, and evidence.

## Worker Types

### 1. Domain Cartographer Worker

Purpose: Build the domain map that all other workers rely on.

Inputs:

- Domain analysis contract
- Domain sprawl contract
- File-system body contract
- Feature documents under `docs/features/`
- Tests and report evidence

Outputs:

- `quality/domain-remediation/<run-id>/domain-map.proposal.v1.json`
- `quality/domain-remediation/<run-id>/domain-map.report.md`

Responsibilities:

- Cluster executable files by feature, scenario, and body responsibility.
- Identify files that are product-domain bodies versus package primitives.
- Identify files that look like generated evidence, tests, scaffold, or entrypoints.
- Propose canonical scenario IDs and feature IDs.
- Detect conflicting meanings where one file appears to serve multiple scenarios.

Acceptance criteria:

- Every executable file has exactly one proposed primary body responsibility.
- Every executable file has at least one proposed feature or scenario tie-out, or a proposed waiver class.
- Ambiguous files are called out explicitly rather than forced into weak mappings.

### 2. Scenario Tie-Out Worker

Purpose: Close the `62/62` scenario tie-out gap without guessing silently.

Inputs:

- Domain map proposal
- Existing feature docs
- Existing tests
- Evidence reports

Outputs:

- `quality/domain-remediation/<run-id>/scenario-tieout.proposal.v1.json`
- Draft contract patch for accepted scenario fields
- Missing-scenario backlog for product owner review

Responsibilities:

- Define a scenario ID format such as `feature:<feature-id>#scenario:<slug>`.
- Propose scenario mappings for every executable file.
- Mark files that need a new feature or scenario document.
- Tie tests and generated reports back to the same scenario IDs.

Acceptance criteria:

- Scenario mappings are reviewable before promotion.
- Every mapping cites evidence: feature doc, test, executable method, or report section.
- The gate can distinguish missing tie-out from intentionally waived tie-out.

### 3. Contract Steward Worker

Purpose: Make file-body contracts a first-class product artifact rather than a path checklist.

Inputs:

- File-system body contract
- Domain map proposal
- Scenario tie-out proposal
- Missing body-contract list

Outputs:

- `quality/domain-remediation/<run-id>/body-contract-patch.proposal.v1.json`
- Contract patch for promoted changes
- Contract coverage report

Responsibilities:

- Add missing executable files to the declared body contract when they are real product bodies.
- Propose a richer body-entry shape where needed:
  - `bodyId`
  - `path`
  - `bodyKind`
  - `actionVerb`
  - `responsibility`
  - `featureIds`
  - `scenarioIds`
  - `allowedDependencies`
  - `verification`
  - `decompositionStatus`
- Separate required product bodies from package primitives, generated evidence, tests, and temporary scaffolding.

Acceptance criteria:

- Missing body contract count trends from `12` to `0`, or each remaining item has an explicit waiver.
- New contract entries do not merely list a path. They declare ownership and intent.
- The contract is validated by tests and report truth.

### 4. Naming And Decomposition Worker

Purpose: Stop noun-named executable files from becoming dumping grounds.

Inputs:

- Actionless executable file list
- Decomposition candidates
- Method inventory
- Domain vocabulary
- Scenario tie-out proposal

Outputs:

- `quality/domain-remediation/<run-id>/rename-plan.v1.json`
- `quality/domain-remediation/<run-id>/decomposition-plan.report.md`
- Optional code patch for low-risk approved packets

Responsibilities:

- Rename executable files to action-bearing names when the body is already cohesive.
- Split files when multiple action responsibilities are present.
- Preserve public imports through transitional adapters only when needed.
- Update tests, contracts, and reports in the same packet.

Acceptance criteria:

- No accepted executable file has a noun-only body name unless explicitly waived.
- A decomposition plan identifies before and after responsibilities.
- Each new body has one action, one contract entry, and scenario tie-out.
- Existing commands and tests continue to pass.

### 5. Package Extraction Worker

Purpose: Move reusable mechanics out of the domain body without losing accountability.

Inputs:

- Package extraction candidate list
- Existing packages under `packages/`
- Domain vocabulary
- File-system body contract

Outputs:

- `quality/domain-remediation/<run-id>/package-extraction-plan.report.md`
- Package body contract proposals
- Optional extraction patch for approved packets

Responsibilities:

- Decide whether each candidate belongs in an existing package, a new package, or the domain body.
- Propose package-level body contracts so extracted code is not orphaned.
- Preserve domain language at call sites while moving generic mechanics behind package boundaries.

Acceptance criteria:

- Extracted packages have declared ownership, allowed responsibilities, tests, and vocabulary boundaries.
- Domain code reads in domain terms after extraction.
- Package extraction does not hide untested behavior.

### 6. Adversarial Review Worker

Purpose: Challenge weak LLM proposals before they reach the codebase.

Inputs:

- Worker proposals
- Proposed patches
- Evidence run
- Product acceptance criteria

Outputs:

- `quality/domain-remediation/<run-id>/review/<packet-id>.review.md`

Responsibilities:

- Reject scenario mappings without evidence.
- Reject decompositions that create more generic names.
- Reject package extractions that remove domain meaning from call sites.
- Identify public API breakage, test gaps, or contract drift.

Acceptance criteria:

- Every promoted packet has at least one adversarial review note.
- High-risk objections are resolved or explicitly accepted by the product owner.

### 7. Verification Worker

Purpose: Prove that a promoted packet improved the domain body without breaking behavior.

Inputs:

- Promoted patch
- Updated contracts
- Test suite
- Domain analysis and sprawl commands

Outputs:

- `quality/domain-remediation/<run-id>/verification/<packet-id>.report.md`

Responsibilities:

- Run focused tests for touched behavior.
- Run `npm test`.
- Run `npm run report:truth:fast`.
- Compare before and after domain analysis metrics.
- Publish a concise pass or fail report.

Acceptance criteria:

- Verification is attached to the packet.
- Metrics improve or have a documented reason for no movement.
- No silent regression is accepted.

## Remediation Packet Shape

Each work packet should be represented as structured data so LLM workers can operate consistently.

```json
{
  "packetId": "domain-remediation-001",
  "sourceRunId": "162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd",
  "findingCodes": [
    "missing-scenario-tieout",
    "missing-body-contract"
  ],
  "primaryWorker": "scenario-tieout-worker",
  "allowedPaths": [
    "docs/features/",
    "contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json"
  ],
  "blockedPaths": [
    "evidence/runs/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/"
  ],
  "expectedOutputs": [
    "scenario-tieout.proposal.v1.json",
    "verification.report.md"
  ],
  "verificationCommands": [
    "npm test",
    "npm run report:truth:fast"
  ],
  "promotionCriteria": [
    "Every proposed scenario tie-out cites a feature doc, test, or report section.",
    "No unrelated code motion.",
    "Updated contracts validate."
  ]
}
```

## Recommended Execution Sequence

### Phase 0: Freeze The Baseline

Create a remediation workspace for this evidence run:

- `quality/domain-remediation/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/remediation-backlog.v1.json`
- `quality/domain-remediation/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/worker-assignments/`
- `quality/domain-remediation/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/worker-results/`
- `quality/domain-remediation/162db37c732514fdf33a2a30c417802dff3efbfda085f4e8e3d37876d49e04dd/promotion-gate.report.md`

This keeps remediation tied to a specific evidence run and prevents workers from chasing a moving target.

### Phase 1: Define Scenario Tie-Out Before Code Motion

Resolve the scenario model first because every executable file currently fails scenario tie-out. If we start with decompositions, the team will create more bodies without knowing how to prove their scenario ownership.

Deliverables:

- Scenario ID convention
- Scenario tie-out proposal
- Contract fields required to store scenario mappings
- Product-owner review of ambiguous scenario claims

Exit criteria:

- The system can represent scenario tie-out.
- At least one full vertical slice proves file, feature, scenario, test, report, and receipt alignment.

### Phase 2: Repair Missing Body Contracts

Use the missing body-contract list as the first concrete cleanup wave.

Initial target files:

- `scaffold.js`
- `src/builds-domain-body-sterility-contract/builds-domain-body-sterility-contract.js`
- `src/detects-retired-domain-name-reintroduction/detects-retired-domain-name-reintroduction.js`
- `src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js`
- `src/feature-execution-proof/feature-execution-proof.js`
- `src/feature-quality-board/feature-quality-board.js`
- `src/feature-scoped-ascii-execution-flow-report/feature-scoped-ascii-execution-flow-report.js`
- `src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js`
- `src/per-feature-executable-body-evidence-reports/per-feature-executable-body-evidence-reports.js`
- `src/report-provenance/report-provenance.js`
- `src/report-truth/report-truth.js`
- `src/runs-report-truth-gate/runs-report-truth-gate.js`

Exit criteria:

- Missing body-contract count is `0`, or every remaining file has an explicit product-owner waiver.
- Each new contract entry declares responsibility, not only path existence.

### Phase 3: Rename Low-Risk Actionless Executables

Start with cohesive files whose purpose is already obvious from methods, tests, and imports. Avoid high-risk public entrypoints until scenario and body contracts are settled.

The LLM worker should classify each actionless file into:

- Mechanical rename
- Rename plus contract update
- Decompose before rename
- Package-contract exception
- Product-owner review required

Exit criteria:

- Actionless executable file count trends from `18` to `0`, excluding explicit waivers.
- Tests and imports are updated in the same packet as each rename.

### Phase 4: Decompose High-Risk Bodies In Small Packets

Do not ask an LLM worker to resolve all `52` decomposition candidates at once. Sort candidates by blast radius and evidence value.

Recommended first deep-dive candidates:

- `src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js`
- `src/end-user-quality-evidence-bundle/end-user-quality-evidence-bundle.js`
- `src/feature-execution-proof/feature-execution-proof.js`
- `src/feature-quality-board/feature-quality-board.js`
- `src/report-truth/report-truth.js`

Each decomposition packet should include:

- Current responsibility summary
- Proposed new body names
- New scenario tie-outs
- Required contract changes
- Import migration plan
- Tests that prove unchanged behavior

Exit criteria:

- Each decomposed body has one primary action.
- No new noun-named executable body is introduced.
- Domain analysis and sprawl reports show measurable reduction or a documented reason for no change.

### Phase 5: Promote Package Extractions

Package extraction should happen after the scenario model and body contract model are stable. Otherwise generic mechanics will be moved out of the domain body without a proof of why they belong elsewhere.

Exit criteria:

- Package extraction candidates are either extracted, retained with reason, or converted to package-level backlog.
- Package bodies have contracts and tests.
- Domain call sites still read in domain language.

### Phase 6: Turn Analysis Into A Gate Gradually

Once the model can represent file bodies, scenario tie-out, decomposition status, package ownership, and waivers, make the gate stricter in stages.

Suggested gate progression:

1. Warn on missing scenario tie-out.
2. Fail on missing body contract for new executable files.
3. Fail on noun-only executable names for new files.
4. Fail on scenario tie-out missing for new files.
5. Fail on unauthorized god-file growth.
6. Fail on unresolved orphan artifacts outside accepted generated evidence paths.

## Product Acceptance Metrics

The target state is not "the LLM said it is clean." The target state is reportable evidence.

Near-term targets:

- Files missing body contract: `12 -> 0`
- Files missing scenario tie-out: `62 -> under 10`, then `0`
- Executable file names missing action verb: `18 -> under 5`, then `0`
- Orphan artifacts: `65 -> explained inventory`, then `0 unclassified`

Medium-term targets:

- Decomposition candidates: triaged `52/52`
- Package extraction candidates: triaged `34/34`
- God-file candidates: `1 -> 0`, or explicitly accepted with owner and expiry
- Mixed-responsibility files: `1 -> 0`

Quality targets:

- Every promoted packet has an evidence report.
- Every worker proposal is reviewable as an artifact.
- Every scenario tie-out cites source evidence.
- Every waiver has owner, reason, and expiry.

## First Three Worker Assignments

### Assignment 1: Scenario Tie-Out Convention

Worker: Scenario Tie-Out Worker

Goal: Define the scenario ID format and produce the first scenario tie-out proposal.

Allowed edits:

- `docs/features/`
- domain analysis contract schema if scenario fields need to be formalized
- report layout contract if scenario summary needs to be visible

Do not edit:

- Production source files
- Existing evidence run artifacts

Promotion gate:

- The proposal maps at least one complete feature vertical slice from feature doc to executable bodies to tests to report evidence.

### Assignment 2: Missing Body Contract Repair

Worker: Contract Steward Worker

Goal: Classify and contract the `12` missing executable files.

Allowed edits:

- `contracts/file-system-bodies/02_declared/logme.file-system-body.contract.v1.json`
- feature docs needed to clarify ownership
- tests only when contract validation changes

Promotion gate:

- Missing body contract count reaches `0`, or each remaining file has an explicit waiver.

### Assignment 3: LLM Conveyor Decomposition Plan

Worker: Naming And Decomposition Worker

Goal: Produce a decomposition plan for `src/llm-end-user-testing-conveyor/llm-end-user-testing-conveyor.js` before changing it.

Allowed edits:

- strategy and proposal artifacts under `quality/domain-remediation/<run-id>/`

Do not edit:

- Conveyor implementation until the plan is accepted.

Promotion gate:

- The plan identifies each responsibility, proposed action-bearing body names, scenario tie-outs, required tests, and migration risk.

## Things We Should Not Do Yet

- Do not auto-apply all decomposition recommendations from a single LLM pass.
- Do not make `missing-scenario-tieout` a hard fail until the contract model can store scenario tie-outs.
- Do not treat path presence as a complete body contract.
- Do not move package candidates before package ownership contracts exist.
- Do not let LLM workers rewrite generated evidence from an old run.
- Do not accept broad waivers without owner, reason, expiry, and evidence.

## Decision Rule

A remediation packet is product-acceptable only when it improves one or more measured findings, preserves behavior, and increases the repo's ability to explain itself to the next LLM worker.

That is the north star for this feature: not only cleaner files, but a repository that can prove the meaning of every executable body it contains.

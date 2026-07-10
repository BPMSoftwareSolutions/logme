# LogMe

LogMe is the seed implementation of the Fracto "lights-on" pattern: give an
application a bounded-context, bounded-vocabulary way to *testify* about its
own execution, so it can prove — not just claim — that it ran the path it
declared, in the order it declared, with receipts to show for it.

This repo is LogMe eating its own dog food. It audits its own workspace,
proves its own declared Gherkin features actually execute, and now uses two
LLM-driven subsystems (a recursive code-generation harness and an end-user QA
conveyor) whose output is never trusted directly — everything a model
produces has to pass through the same deterministic, evidence-backed checks
as everything else before it can move a verdict.

## What running LogMe actually does

`npm run report:truth` is the one command that ties the whole system
together. It:

1. Loads `logme.config.json` and re-discovers every source file, then
   inventories every executable method and checks it calls `LogMe(...)`.
2. Rebuilds three independent contracts from current source, each answering a
   different question:
   - **Sterility** — does every method testify honestly, with a
     domain-vocabulary name, and no silent/anonymous/generic-utility code?
   - **Domain body analysis** — is every file named with an action verb, does
     it have a declared owning file-system-body contract, and does it tie out
     to a feature/scenario id?
   - **Sprawl** — is any file getting too big, too mixed-responsibility, or
     hiding a generic mechanic that belongs in `packages/` instead?
3. Independently re-derives the verdict from the findings and blocks if the
   rendered report's claimed verdict doesn't match, if the report is stale
   against current source (provenance hash mismatch), or if summary/findings/
   method-table rows don't tie out to each other.
4. Renders `report.md` from a data-driven layout contract
   (`contracts/domains/logme/report-layout.contract.v1.json` +
   `contracts/templates/`), not hardcoded string concatenation — the report's
   structure can change without touching rendering code.
5. Regenerates the **Feature Quality Board** (`docs/features/`) — for each of
   the 26 declared Gherkin features, cross-references execution-proof
   evidence and end-user QA bundles to derive a status (`not-implemented` →
   `proof-blocked` → `qa-blocked`/`qa-failed` → `qa-passed` →
   `qa-passed.promoted`) and writes a filesystem sentinel per feature plus an
   aggregate `_FEATURE-QUALITY-BOARD.md`/`.v1.json`/`_FEATURE-QUALITY-TREE.txt`.
6. Writes evidence receipts for all of the above under `evidence/runs/<run-id>/`
   (gitignored, along with `report.md` itself).

`npm run report:truth:fast` does the same but skips evidence publication, for
watch-mode use. `node --test tests/` runs the unit suite (one file per unit).

## The three cooperating systems

**1. Domain body audit** (the original core, now three contracts deep) —
`src/discovers-configured-source-bodies`, `src/inventories-executable-domain-methods`,
`src/builds-domain-body-sterility-findings`, `src/builds-domain-body-analysis-contract`,
`src/builds-domain-body-sprawl-contract`, `src/calculates-domain-body-sterility-summary`,
`src/report-provenance`, `src/report-truth`. Orchestrated by
`src/builds-domain-body-sterility-contract`.

**2. Feature-quality / Gherkin proof layer** — `docs/features/*.feature.md`
declares 26 features. `src/feature-execution-proof` matches declared
execution nodes against observed telemetry and receipts to decide
`proven`/`blocked`. `src/per-feature-executable-body-evidence-reports` writes
the per-scenario evidence packet. `src/feature-scoped-ascii-execution-flow-report`
renders the per-feature ASCII tree. `src/feature-quality-board` aggregates all
of it into the board described above.

**3. LLM subsystems** — two distinct pipelines, both real (not mocked) when
`LOC_GEMINI_API_KEY` is set:
   - **Fractal LLM Harness** (`docs/Fractal LLM Harness — Implementation Plan.md`) —
     a recursive, self-governed code-generation pipeline. An LLM (Gemini,
     called from `src/calls-llm-harness-worker` via plain `fetch` — no SDK
     dependency) proposes a bounded child harness; nothing it proposes is
     trusted directly. `src/parses-llm-harness-output` mints the harness id
     itself, `src/validates-generated-harness` runs independent structural
     checks (forbidden paths, self-promotion language, invented receipts),
     `src/materializes-approved-harness` deterministically renders the only
     executable file (never LLM-authored text), `src/runs-generated-harness`
     executes it in a child process, and `src/verifies-generated-harness`
     independently ties declared telemetry/receipts against what was actually
     observed on disk before a harness can be marked `PROMOTED`. Generated
     harnesses land under `src/generated-harnesses/<harnessId>/` (empty until
     a generation is actually promoted).
   - **LLM end-user testing conveyor** (`src/llm-end-user-testing-conveyor`) —
     assembles, validates, and writes QA evidence bundles under
     `quality/end-user-test-bundles/<release-candidate>/<qa-run>/`, driven by
     an external LLM actor working through a handoff packet. Guardrails
     enforce that the LLM can never mark itself QA-passed, seed data must be
     synthetic, and no external notification is ever sent. This is what feeds
     the "QA Readiness" data in the feature quality board and the QA section
     `src/end-user-quality-evidence-bundle` renders into `report.md`.

See `docs/llm-integration-proposal.md` for the architecture rationale behind
treating LLM output as testimony to be independently checked rather than a
trusted verdict input.

## Usage

```js
const { runsLogMeDomainAudit } = require('./src/runs-logme-domain-audit');

const receipt = runsLogMeDomainAudit();
// receipt.reportPath    -> where the report was written
// receipt.reportContent -> the rendered report as a string
// receipt.bytesWritten  -> size of the written report
```

This triggers the full contract-building chain above (sterility + analysis +
sprawl + execution-flow nodes), not just the original method-testimony check.

## Configuration

`logme.config.json` at the package root declares: `rootDir`, `includeExtensions`,
`excludeDirectories`/`excludeFiles`, `forbiddenLocalUtilityNames`, the
`stubMarker` scaffold uses, `sprawlThresholds` (file-size/method-count limits
driving the sprawl contract), and `domainContract` (hard laws, verdict labels,
finding definitions the report is built from). `domainVocabulary` covers both
the original audit terms and the harness-pipeline vocabulary (`harness`,
`assignment`, `lease`, `assign`, `materialize`, `verify`, `propose`, etc.).

## Layout

- `src/` — five cooperating subsystems (domain body audit, feature-quality
  proof, LLM harness, LLM QA conveyor, report rendering/truth), roughly one
  directory per unit of behavior.
- `packages/` — generic mechanics shared across the domain body: AST parsing
  (`logme-method-inventory-primitives`), filesystem walking
  (`logme-source-body-primitives`), config loading (`logme-config-primitives`),
  markdown/report rendering (`logme-report-primitives`), and the
  testimony/telemetry core (`logme-testimony-core`).
- `contracts/domains/logme/` — schemas and the report-layout contract that
  drive validation and rendering.
- `contracts/llm-harness/` — schemas for harness requests, outputs,
  materialized harnesses, and promotion decisions.
- `contracts/file-system-bodies/02_declared/` — the declared shape of this
  package, checked by `tests/file-system-body.test.js`.
- `contracts/gates/logme/` — hard-law gate definitions. `contracts/templates/logme/`
  — the execution-sketch template used by the report-layout renderer.
- `docs/features/` — 26 Gherkin feature files plus the generated Feature
  Quality Board and per-feature status sentinels.
- `quality/end-user-test-bundles/` — QA evidence bundles produced by the LLM
  end-user testing conveyor.
- `tests/` — one test file per unit, run with `node --test tests/`.
- `scaffold.js` — standalone tool (`node scaffold.js [--refresh-stubs]`, not
  wired into `package.json`) that reads the declared file-system-body
  contract and stubs out any declared file that doesn't exist yet.

## Verifying sterility

```sh
node --test tests/
npm run report:truth
npm run report:truth:fast
```

`report.md` and everything under `evidence/runs/` are gitignored — they're
regenerated, not hand-maintained.

## Git hooks

To use the bundled hooks, point Git at the repository hook directory:

```sh
git config core.hooksPath .githooks
```

The pre-commit and pre-push hooks run the report-truth gate and block the
action when it fails.

## Further reading

- [`docs/report-truth-pi-planning.md`](docs/report-truth-pi-planning.md) —
  PI kickoff, product-owner review, and the Gherkin acceptance criteria behind
  most features described above.
- [`docs/llm-integration-proposal.md`](docs/llm-integration-proposal.md) —
  the architecture rationale for how LLM output is allowed into this system.
- [`docs/Fractal LLM Harness — Implementation Plan.md`](docs/Fractal%20LLM%20Harness%20—%20Implementation%20Plan.md) —
  the module-by-module design of the recursive code-generation pipeline.

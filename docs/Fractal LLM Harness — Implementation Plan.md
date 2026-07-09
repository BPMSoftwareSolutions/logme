# Fractal LLM Harness — Implementation Plan

## Context

LogMe's own report-truth gate already proves a working pattern: never trust generated content directly, validate before rendering/writing, fail closed. The Fractal LLM Harness feature (already scaffolded as 9 throw-stub files, 5 contract schemas, a Gherkin feature doc, and a declared file-system body) applies that same discipline one level up: an LLM proposes a bounded "child harness" — its own body contract, execution path, tests, telemetry requirements, receipt coverage — but the LLM's output is never trusted directly. It must be validated, materialized into an allowed on-disk lease, actually run, and independently verified against real telemetry/receipts before anything is "promoted." The LLM may propose; it may never promote itself.

Provider: **Gemini**, called directly via `fetch` (Node 18+ built-in — no new npm dependency), key from `process.env.LOC_GEMINI_API_KEY`. This mirrors the adapter pattern already proven in `cognitive-codebase/runtime/node/src/prompt-shell/providers/adapters/gemini.provider.ts` (reviewed directly), and matches `docs/llm-integration-proposal.md`'s explicit rejection of vault/alias credential machinery as disproportionate for LogMe — plain env var, nothing else.

## 0. Two required config edits (do first, before any module)

**Fork A — self-audit contamination.** `logme.config.json`'s `excludeDirectories` (currently `[".git", "node_modules", "evidence", "tests"]`) does not exclude `src/generated-harnesses`. Since `includeExtensions` is `[".js", ".ts"]`, any materialized child-harness file would get swept into LogMe's own sterility inventory and checked against *LogMe's* vocabulary/testimony rules, not the child's. Add `"src/generated-harnesses"` to `excludeDirectories`.

**Fork B — domain vocabulary gap.** `logme.config.json`'s `domainContract.domainVocabulary` has no nouns/verbs for "harness," "assignment," "proposal," "lease," etc. Every new function name across the 9 modules must draw from the vocabulary or the vocabulary must be extended. Add to `domainVocabulary`:
- `nouns`: `harness`, `assignment`, `proposal`, `lease`, `capability`, `contract`
- `verbs`: `assign`, `call`, `parse`, `validate`, `materialize`, `run`, `verify`, `propose`

Run `npm test` and `npm run report:truth` immediately after this edit to confirm the config change alone doesn't regress sterility.

## 1. Module boundaries (confirmed correct, no splits/merges)

The 9 stub files map 1:1 onto LogMe's existing precedent chain (`validates-report-layout-contract` → `renders-report-from-layout-contract`; `validates-report-contract`'s `resolvesDottedPath`; `detects-retired-domain-name-reintroduction`'s walk-and-find-finding pattern). `harness-promotion-decision.schema.v1.json` and `harness-repair-suggestion.schema.v1.json` are **return shapes** of modules #7 and #4 respectively — not separate files.

Dependency direction is strictly linear and acyclic:
```
builds → calls → parses → validates → materializes → runs → verifies → writes-receipt → proposes-next
```
`proposes-next-harness` closes the loop by producing a fresh `llm-harness-request` for the next generation but does not call `builds-llm-harness-assignment` itself — that's an outer orchestrator or integration test's job, not required for this slice.

## 2. Function signatures — one exported function per file, plain objects in/out

All modules follow repo convention exactly: named functions only (no arrow callbacks — extract a named helper and pass it by reference, per `validates-report-layout-contract.js`'s `isVariableUnbound`/`buildsUnboundVariableFinding` pattern), `if (process.env.LOGME_AUDIT === '1') { LogMe(sampleMethod); }` as the first statement of every local function, validators return `{isValid, findings}`, detectors return `Finding[]` (`{code, filePath, methodName, reason}`).

### 1. `builds-llm-harness-assignment.js`
```js
function buildsLlmHarnessAssignment(request) {
  // request: { runId, parentHarnessId, parentBodyContractRef,
  //            parentSelfConformanceReceiptRef, allowedMutationPaths, requestedCapability }
  // Validates every llm-harness-request.schema.v1 requiredField is present (throws if missing).
  // returns: { schemaVersion: 'llm-harness-request.schema.v1', ...request, assembledAt: <ISO8601> }
}
```
Builds; does not validate-and-report — mirrors `buildsReportProvenance`'s "build well-formed or throw" role.

### 2. `calls-llm-harness-worker.js` — Gemini call
```js
async function callsLlmHarnessWorker(assignment, options = {}) {
  // options: { apiKey, model, fetchImpl } — all optional, for test injection
  // returns: { runId, rawResponseText, rawResponseJson: null, model, finishReason, usage, callFailure: null }
  // On any failure, catch it — never throw across this boundary — and return
  // { ..., rawResponseText: null, callFailure: { type, message } } so module #3
  // can deterministically produce proposalStatus: 'rejected-unparseable'.
}
```

Concrete call shape (plain `fetch`, no SDK):
```js
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

async function callsLlmHarnessWorker(assignment, options = {}) {
  if (process.env.LOGME_AUDIT === '1') { LogMe(sampleMethod); }

  const apiKey = options.apiKey || process.env.LOC_GEMINI_API_KEY;
  const model = options.model || GEMINI_MODEL;
  const fetchImpl = options.fetchImpl || fetch;

  if (!apiKey) {
    return buildsWorkerResultFromFailure(assignment, { type: 'authentication-error', message: 'LOC_GEMINI_API_KEY is not set' });
  }

  try {
    const response = await fetchImpl(
      `${GEMINI_BASE_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildsGeminiRequestBody(assignment)),
      },
    );

    if (!response.ok) {
      return buildsWorkerResultFromFailure(assignment, await classifiesGeminiHttpFailure(response));
    }

    const data = await response.json();
    return buildsWorkerResultFromResponse(assignment, model, data);
  } catch (callError) {
    return buildsWorkerResultFromFailure(assignment, classifiesGeminiNetworkFailure(callError));
  }
}
```

`buildsGeminiRequestBody(assignment)` renders the harness-generation prompt (via a named `rendersHarnessAssignmentPrompt(assignment)` helper) into `{ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 8192, responseMimeType: 'application/json', responseSchema: buildsLlmHarnessOutputJsonSchema() } }` — Gemini's structured-output equivalent (`responseMimeType: 'application/json'` + `responseSchema`) built from `llm-harness-output.schema.v1.json`'s `requiredFields`, same rationale as the Claude design: constrains shape, not truthfulness — module #4 still independently checks truthfulness.

`buildsWorkerResultFromResponse` extracts `data.candidates[0].content.parts[].text` (joined), `data.candidates[0].finishReason`, and `data.usageMetadata` — mirroring the reference `gemini.provider.ts` adapter's parsing exactly. Treat `finishReason === 'SAFETY'` as a `callFailure` (`{ type: 'safety-blocked', message: ... }`), not a success.

`classifiesGeminiHttpFailure(response)` maps status codes the same way the reference adapter does: 401 → `authentication-error`, 404 → `model-not-found`, 429 → `rate-limit-error` (capture `Retry-After` header), ≥500 → `provider-overloaded`, else `api-error`. `classifiesGeminiNetworkFailure(callError)` maps `AbortError`/timeout → `timeout-error`, else `unknown-error`.

**No new package.json dependency** — `fetch` is a Node 18+ global.

### 3. `parses-llm-harness-output.js`
```js
function parsesLlmHarnessOutput(workerResult, assignment) {
  // Never throws. harnessId is minted HERE (sha256Hex(stableStringify(runId + assignment)),
  // matching report-provenance.js's pattern), never trusted from the LLM.
  // On callFailure, JSON.parse failure, or missing required field ->
  //   { ..., proposalStatus: 'rejected-unparseable', bodyContractDraft: null, ..., parseFailureReason }
  // On success -> { ..., proposalStatus: 'proposed', bodyContractDraft, executionPathDraft,
  //                 testPlanDraft, telemetryRequirementsDraft, receiptCoverageDraft, parseFailureReason: null }
}
```
Mirrors `report-truth.js`'s `buildsDomainBodySterilityContractSafely` try/catch-and-degrade shape. Since Gemini's `responseSchema` already constrains JSON shape, this module's main job is defending against `callFailure`, empty candidates, and the (still possible) case of a schema-conformant-but-field-missing response — never let a partial object escape as `'proposed'`.

### 4. `validates-generated-harness.js`
```js
function validatesGeneratedHarness(parsedOutput, assignment) {
  // returns: { isValid: boolean, findings: Finding[] }
}
```
Full check table (identical regardless of provider):

| Hard law | Concrete check | Finding code |
|---|---|---|
| No mutation outside declared lease | Walk `bodyContractDraft`/`executionPathDraft` string values that look like repo-relative paths; flag any outside `assignment.allowedMutationPaths` | `llm-proposed-forbidden-mutation` |
| No claiming verification without telemetry | Draft fields contain "verified"/"observed"/"proven" but `telemetryRequirementsDraft` is empty/missing required sub-fields | `llm-claimed-verification-without-telemetry` |
| No claiming a receipt not actually written | Any claimed receipt path in `receiptCoverageDraft` that already `fs.existsSync`s *before* materialization (a plan describing pre-existing evidence is a lie) | `llm-invented-receipt` |
| LLM never promotes itself | Recursively scan all 5 draft fields' strings for verdict-shaped tokens (`"PROMOTED"`, `"self-conformance-proven"`, `"approved"`, `"promotion: true"`) | `llm-promoted-itself` |
| Body contract / testimony / telemetry / receipt coverage present | `resolvesDottedPath`-style required-field walk against `llm-harness-output.schema.v1.json`, one finding per missing field | `generated-harness-missing-body-contract`, `generated-harness-missing-testimony`, `generated-harness-missing-receipt-coverage` |
| Not executed outside lease (pre-check) | Every `assignment.allowedMutationPaths` entry must start with `src/generated-harnesses/` | `generated-harness-executed-outside-lease` |
| No next-harness proposal without parent-proof | When `assignment.parentSelfConformanceReceiptRef` is set, that receipt must exist on disk and parse with `promotionDecision.decision === 'PROMOTED'` | `next-harness-proposal-without-parent-proof` |

Each check is a small named `findsX(parsedOutput, assignment)` function returning `Finding[]`, composed in `validatesGeneratedHarness` — `isValid = findings.length === 0`.

### 5. `materializes-approved-harness.js`
```js
function materializesApprovedHarness(parsedOutput, validationResult, options = {}) {
  // Throws if !validationResult.isValid or proposalStatus !== 'proposed' — never
  // silently materializes a blocked/unparseable proposal.
  // options.generatedHarnessesRoot defaults to <rootDir>/src/generated-harnesses
  // returns: { harnessId, materializationStatus: 'materialized', leasedPaths, writtenFiles, entryFilePath }
}
```

On-disk shape under `src/generated-harnesses/<harness-id>/`:
```
body-contract.json           # from bodyContractDraft
execution-path.json          # from executionPathDraft
test-plan.json                # from testPlanDraft
telemetry-requirements.json  # from telemetryRequirementsDraft
receipt-coverage.json         # from receiptCoverageDraft
index.js                      # GENERATED deterministically, NOT LLM-authored source
```

**Critical safety property:** `index.js` is never LLM-authored source text handed to `eval`/`require`. It is a template `materializesApprovedHarness` itself renders: requires `LogMe`/`sampleMethod`, walks `execution-path.json`'s declared steps, and for each calls `LogMe(sampleMethod)` + prints a fixed-format telemetry line (`TELEMETRY-STEP: <stepName>`), then writes a conformance marker file. Step names from the LLM are interpolated via `JSON.stringify(stepName)` — never raw string concatenation — so injection text in a step name becomes an inert string literal, not executable code.

Second, independent lease-boundary check (in addition to module #4's check against the LLM's *claims*): resolve the actual write target and verify it starts with `path.resolve(generatedHarnessesRoot) + path.sep` before any `fs.mkdirSync`/`fs.writeFileSync` call — closes the gap between "what the LLM said it would touch" and "what this function is about to touch."

### 6. `runs-generated-harness.js`
```js
function runsGeneratedHarness(materializationResult, options = {}) {
  // options: { timeoutMs = 30000, env = {} }
  // Never throws — a failed run is data.
  // returns: { harnessId, exitCode, timedOut, stdout, stderr, startedAt, finishedAt, entryFilePath }
}
```
Uses `child_process.spawnSync(process.execPath, [entryFilePath], { cwd: dirname(entryFilePath), timeout, env: {...process.env, ...options.env, LOGME_AUDIT: '1'}, encoding: 'utf8' })` — **not** `require()`, which would load untrusted-content-parameterized code into the parent process's module cache/env. `spawnSync` gives a wall-clock timeout and isolated, capturable stdout/stderr for module #7 to tie out against. `LOGME_AUDIT` is forced on in the child env regardless of the parent's setting, since observing testimony is the entire point of the run. No sandboxing beyond a normal `node <file>.js` invocation — same privilege as any test-suite run, proportionate to "local dev tool, not multi-tenant service."

### 7. `verifies-generated-harness.js` — the truth gate
```js
function verifiesGeneratedHarness(materializationResult, runResult, parsedOutput) {
  // returns a harness-promotion-decision.schema.v1 object:
  // { schemaVersion, harnessId, runId, decision: 'PROMOTED'|'BLOCKED', reason,
  //   requiredFindingsMustBeZero, telemetryTieOut, receiptTieOut, selfPromotionAttempted }
}
```
Adapts `report-truth.js`'s "regenerate and diff" to "run and observe" (harness execution is non-deterministic in wall-clock/PID in a way a report render isn't). Never trusts what the harness claims about itself in its own stdout — only trusts what module #6 independently captured plus what module #5 declared it *would* do, then diffs:

- `tiesOutDeclaredTelemetry`: parse `runResult.stdout` for `TELEMETRY-STEP:` lines, compare the ordered list against `execution-path.json` read back from disk (not an in-memory copy).
- `tiesOutDeclaredReceiptCoverage`: read `receipt-coverage.json` back from disk, independently `fs.existsSync` every claimed receipt path relative to the harness's own leased directory.
- `detectsSelfPromotionAttempt`: scan `runResult.stdout`/`stderr` for verdict-shaped tokens — same detector shape as module #4's, but against actual runtime output. If found, this can only ever **block** promotion, never grant it — the concrete asymmetry that implements "propose but never promote."
- `decision = requiredFindingsMustBeZero.length === 0 ? 'PROMOTED' : 'BLOCKED'`, plus a check that `runResult.exitCode === 0 && !runResult.timedOut`.

### 8. `writes-harness-receipt.js`
```js
function writesHarnessReceipt(promotionDecision, materializationResult, runResult) {
  // Pure I/O, mirrors writes-domain-receipt.js. Writes
  // evidence/runs/fractal-llm-harness/<runId>/harness-execution.receipt.v1.json
  // returns: { receiptPath, bytesWritten, receiptContent }
}
```
The sole `fs.writeFileSync` against `evidence/runs/...` in this pipeline — matches the existing "one writer" convention (`writes-domain-body-sterility-receipt.js`).

### 9. `proposes-next-harness.js`
```js
function proposesNextHarness(promotionDecision, materializationResult, requestedCapability) {
  // Throws if promotionDecision.decision !== 'PROMOTED' — a BLOCKED harness has
  // no parent-proof and must never seed a next-generation proposal.
  // returns a NEW llm-harness-request.schema.v1 object with proposalOnly: true
}
```
Deliberately produces module #1's *input* shape for the next generation, never a `harness-promotion-decision` — nothing downstream can mistake this for an authoritative promotion record, even inspected in isolation.

## 3. Self-audit boilerplate (all 9 files)

Every file: `const { LogMe } = require('../../packages/logme-testimony-core/src/LogMe'); const { sampleMethod } = require('../../packages/logme-testimony-core/src/sample-method');`, every local named function opens with the `LOGME_AUDIT` guard, no inline arrow callbacks anywhere (including inside `calls-llm-harness-worker.js` — extract named functions like `classifiesGeminiHttpFailure` instead of `.catch(err => ...)`).

## 4. Audit: where could generated/LLM output influence its own promotion?

Walked module-by-module (unchanged by the provider swap — audit logic, not provider specifics):

- **#2/#3** return raw/parsed LLM output — no `decision`/verdict field exists anywhere in `llm-harness-output.schema.v1.json`'s `requiredFields`, so neither module has a path to influence promotion.
- **#4** must never read a `decision`/`promoted` field *out of* `parsedOutput` and pass it through — `{isValid, findings}` is always independently computed by the `findsX` functions against fixed rules.
- **#5** writes `index.js` as fixed template code; LLM-supplied step names are only ever interpolated as `JSON.stringify`'d string literals passed to `LogMe`/`console.log`, never spliced into executable syntax.
- **#6** returns raw `stdout`/`exitCode` — the one place LLM-influenced content reaches the pipeline unfiltered, but this is safe *because* #7 never treats stdout content as a verdict, only as positive confirmation of declared telemetry, and treats any verdict-shaped token in stdout as a `BLOCKED` finding (never a `PROMOTED` one).
- **#7** is the only module that computes `decision`. Its signature (`materializationResult, runResult, parsedOutput`) must never grow a `decision`/`existingDecision`-shaped parameter — that would be the exact regression this design prevents. Every input to the decision is independently derived from disk/OS state inside this function.
- **#8** only writes what #7 already computed. **#9** explicitly throws on anything but `PROMOTED` and only ever emits a request (never a promotion record).

**Net conclusion:** the decision is computed exactly once, in exactly one function, from three independently-observed inputs — never from LLM-authored free text treated as ground truth.

## Files to touch, in implementation order

1. `logme.config.json` — Fork A + Fork B edits above.
2. `src/builds-llm-harness-assignment/builds-llm-harness-assignment.js` + test.
3. `src/calls-llm-harness-worker/calls-llm-harness-worker.js` + test (inject `options.fetchImpl` as a fake — never make a real network call in `node --test`).
4. `src/parses-llm-harness-output/parses-llm-harness-output.js` + test.
5. `src/validates-generated-harness/validates-generated-harness.js` + test.
6. `src/materializes-approved-harness/materializes-approved-harness.js` + test (use a temp dir via `options.generatedHarnessesRoot` — never write into the real `src/generated-harnesses/` from a test run).
7. `src/runs-generated-harness/runs-generated-harness.js` + test.
8. `src/verifies-generated-harness/verifies-generated-harness.js` + test.
9. `src/writes-harness-receipt/writes-harness-receipt.js` + test.
10. `src/proposes-next-harness/proposes-next-harness.js` + test.
11. Integration tests (`tests/fractal-harness-generation.test.js`, `tests/generated-harness-conformance.test.js`, `tests/recursive-harness-boundary.test.js`, `tests/llm-unsafe-output-blocked.test.js`) — wire all 9 modules with an injected fake fetch, covering: happy path to `PROMOTED`; forbidden-mutation-path output blocked at #4; unparseable response blocked at #3; non-zero-exit harness blocked at #7; a promoted harness seeding a `proposalOnly: true` next request via #9.
12. Run `npm test` and `npm run report:truth` after step 1 and after each subsequent module lands.

## Verification

1. `npm test` — all new + existing tests pass (all Gemini calls mocked via `fetchImpl` injection; zero real network calls in the suite).
2. `npm run report:truth` — verdict stays `STERILE DOMAIN BODY` for LogMe's own body once the 9 stubs are implemented (currently `DOMAIN BODY CONTAMINATED` from the unimplemented-stub findings — expected until this work lands) and generated-harness output stays excluded from LogMe's own inventory (Fork A).
3. Manual smoke test with a real `LOC_GEMINI_API_KEY` (already confirmed present): run the pipeline end-to-end once outside the test suite, inspect the written `evidence/runs/fractal-llm-harness/<run-id>/harness-execution.receipt.v1.json`, and confirm a deliberately-adversarial assignment (e.g. an `allowedMutationPaths` outside `src/generated-harnesses/`) gets blocked at module #4 with `generated-harness-executed-outside-lease`.

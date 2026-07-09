# LogMe: Capabilities and LLM Integration Proposal

**Architecture review memo — draft for discussion**
Subject: `logme` (03-engineering-intelligence) · Reference pattern: `cognitive-codebase/providers` · Status: pre-implementation, for review

## Reframe: LogMe is not a linter for itself — it's the "lights on" capability for any client app

The working repo audits its own source as a proving ground, but that undersells what it's actually for. Per the Fracto "lights on" doctrine, the point of `logMe()` is to give *any* client application a bounded-context, bounded-vocabulary way to testify about its own execution — so the app can prove, not just claim, that it ran the path it declared, in the order it declared, with receipts to show for it. That is a fundamentally different starting point for LLM integration than "add AI features to a linting tool":

> A glow of self-awareness that lets applications become self-healing through a bounded context and bounded domain language — sterilizing the architecture with light.

Concretely, the doctrine (see `Fracto app with Lights On.md`) describes a **lights-on spine** every client app can adopt: a Gherkin acceptance story → an executable body contract → a runtime that calls `logMe()` at each declared step → a telemetry stream → a receipt → a self-conformance report that ties all five back together and renders a **verdict** (`SELF-CONFORMANCE-PROVEN` / `BLOCKED`). LogMe-the-package is the seed implementation of the `logMe()` half of that spine; the sterility audit in this repo is really just LogMe eating its own dog food.

That reframe changes where the LLM opportunity actually is. A model bolted onto a linter can only narrate findings. A model given access to a *structured, verified truth stack* — Gherkin → contract → file → telemetry → receipt, with every claim independently checkable — can reason about a client application's real behavior without hallucinating, because it isn't reasoning from raw source guesswork. It's reasoning from testimony. Sections 4 and 5 below are written against this larger frame; the original three proposals are kept but re-scoped as the first slice of it.

---

## 1. What LogMe already guarantees

LogMe scans a configured workspace, inventories every executable method, and checks that each one *testifies* — calls `LogMe(sampleMethod)` — under an audit flag. Methods that stay silent, are anonymous, live under a generic-utility path, or are named outside the declared domain vocabulary get flagged. The result renders as `report.md`: a verdict, a blocker list, an ASCII execution sketch, and a provenance trail hashing the source tree and the report itself.

The distinctive part isn't the linting — it's that the report is not trusted by default. A separate **report-truth gate** regenerates the report from scratch and diffs it against what's committed. If they disagree, or if the verdict claimed doesn't match the verdict independently re-derived from the findings, the gate blocks — regardless of what the report text says.

```text
+------------------------------------------------------------+
| REPORT TRUTH                                                |
+------------------------------------------------------------+
| Verdict        : STERILE DOMAIN BODY                        |
| Promotion      : ALLOWED                                    |
| Gherkin -> Contract -> Source -> Telemetry -> Receipt        |
|    ok         ok          ok        observed     written    |
+------------------------------------------------------------+
```

The report layout itself — section order, labels, the ASCII sketch — was just made data-driven: a product owner edits a JSON layout contract and a template file, no code deploy required. But eight fields (verdict, blocker count, silent/anonymous method counts, missing telemetry, missing receipt, promotion decision, provenance hash) are hard-coded as non-negotiable in the validator. A layout contract that tries to omit one fails generation outright. **This is the load-bearing precedent for everything proposed below**: presentation is editable, truth is not.

| Capability | What it guarantees |
|---|---|
| Sterility audit | Every local method must call `LogMe(...)`; silent, anonymous, generically-named, or vocabulary-violating methods are flagged and drive the verdict down. |
| Verdict integrity | The verdict shown is independently re-derivable from the findings on every run — a report can't claim "clean" while findings are non-zero. |
| Truth & freshness gate | `npm run report:truth` fails even when unit tests pass, if the committed report doesn't match a fresh regeneration or the source hash has moved. Wired to optional pre-commit/pre-push hooks. |
| Data-driven layout | Section order, titles, and the ASCII sketch come from a product-owned contract + template, validated for unbound variables and truth-field omission before anything renders. |
| Provenance & evidence | Every run records a config hash, source-inventory hash, git marker, run id, and timestamp — the report shows its own chain of custody. |
| Language honesty | Words like "execution," "observed," or "proof" are reserved for claims backed by real telemetry — static scan order can't borrow runtime vocabulary. |

## 2. LLM footprint today

**None.** A full sweep of the codebase — dependencies, source, contracts, scripts, docs — turned up no provider SDK, no API key handling, no prompt template, and no model-calling code anywhere. The single dependency is `typescript`, used only to parse source files for the method inventory. This is greenfield: there is no existing pattern to reconcile with, only the reference architecture next door to borrow from.

## 3. The reference pattern

The `cognitive-codebase` repo's provider-adapters layer is the right thing to imitate — not its full governance stack, which is bespoke to that project's encrypted-secret-store and evidence-receipt machinery, but its core abstraction: a three-method `Provider` interface (`invoke`, `getHealthCheckEndpoint`, `getErrorCategory`) that every concrete provider implements, instantiated through a single `ProviderFactory`, with no dependency on anything beyond Node built-ins.

**Take as-is:**
- `Provider` interface + normalized `PromptResponse` shape
- `ProviderFactory.createProvider(config)` pattern
- Per-provider `ErrorCategory` mapping (rate-limited, auth-failed, timeout, …)
- Zero-external-dependency adapter style — plain `fetch`, no SDK lock-in

**Leave behind:**
- Encrypted SQLite secret store + alias resolver — LogMe has no persistence layer to hang this on
- JSON-contract-driven fallback/retry policy engine — disproportionate for one or two providers
- Evidence-receipt/gate machinery for provider calls — LogMe already has its own receipt system; don't duplicate it

In short: adopt the adapter shape, size the surrounding plumbing (secrets, retries) to what LogMe actually needs — an env-var-resolved key and a small retry helper, not a second governance subsystem.

## 4. Where a model could plug in

### 4a. Inside LogMe itself — the first slice

These three sit entirely within the current repo and use only evidence LogMe already produces. They're the safe, immediately buildable starting point — but see 4b for the larger opportunity they're a warm-up for.

### Blocker remediation narration — *lowest risk*

Today a blocker reads as a finding code, a file path, and a fixed lookup-table sentence (`"inspect the cited method and rerun the report"`). A model reads the actual flagged method's source and the finding reason, and writes one or two sentences explaining *why* this specific method trips the rule and what changing it would look like.

- **Input:** `finding.code`, `finding.reason`, the method's source snippet, the hard law it violates
- **Output:** a one-paragraph plain-language remediation note, rendered in the existing blocker box *below* the fixed fields — additive only

> **Guardrail.** The narration is decoration on an already-computed blocker. It never determines whether something is a blocker, never changes the finding code, and generation must still succeed with the fixed lookup-table sentence if the model call fails or times out.

### Layout-contract drafting assistant — *medium risk*

A product owner describes a presentation change in plain language — "put the blocker summary first, rename Sterility Summary to Coverage Report" — and a model drafts the edited `report-layout.contract.v1.json`. The draft is never applied directly: it always passes through the existing `validates-report-layout-contract` module, the same gate a human hand-edit would face.

- **Input:** natural-language request + the current layout contract as context
- **Output:** a candidate JSON contract, shown as a diff, validated before it's ever written to disk

> **Guardrail.** A model-drafted contract that omits a required truth field, or references an unbound template variable, fails the exact same way a careless human edit does — `report-layout-truth-field-omitted`, `report-template-variable-unbound`. The validator doesn't know or care who wrote the file.

### Finding-pattern triage across runs — *exploratory*

Across a history of evidence receipts, a model looks for patterns a single report can't show — the same finding code recurring in the same directory across many runs, a method that keeps drifting back to "silent" after being fixed. This is read-only analysis over already-written evidence, never a live input to the current run's verdict.

- **Input:** a batch of `evidence/runs/<run-id>/report-truth.v1.json` receipts, read after the fact
- **Output:** a separate advisory summary artifact — not `report.md`, not consumed by the truth gate

> **Guardrail.** This must write to its own output, never back into `report.md` or any file the truth gate reads. Keeping it downstream-only means a bad or hallucinated trend observation can't contaminate the audit it's commenting on.

### 4b. Across client applications — the actual "lights on" opportunity

This is the bigger idea in the room. Once a client app adopts the lights-on spine — Gherkin story → executable body contract → `logMe()` testimony → telemetry → receipt → self-conformance report — an LLM gains something it almost never has when working on a codebase: a **verified execution truth stack** instead of raw source to infer from. That changes what's safe to automate.

**Self-conformance report narration.** The self-conformance report (Section 01–10 per the doctrine: Executive Verdict, Runtime Truth Stack, Gherkin→Contract→File→Telemetry→Receipt tie-out, Findings/Drift/False Claims, Promotion Decision) is dense and structured — exactly the shape a model can narrate reliably, because every fact in it is already independently verified before the model ever sees it. A model summarizing "what changed since the last run" or "why this run is `BLOCKED` and the last one wasn't" is narrating a verdict that was computed deterministically, not generating one.

- **Input:** a client app's self-conformance receipt bundle (telemetry timeline, receipt coverage table, findings table — `declared-but-silent`, `executed-but-undeclared`, `wrong-order-execution`, `receipt-writer-silent`, `surface-drift`, `blocked-body-executed`)
- **Output:** a plain-language executive summary layered on top of the existing report, for a reviewer who doesn't want to read the ASCII tree
- **Guardrail:** narration only. The verdict, the findings table, and the promotion decision are computed before the model is invoked and are not model outputs.

**Body-contract drafting from intent.** The doctrine's minimum spine (one Gherkin scenario, one body contract, one runtime entry point, one `logMe()` call, one receipt, one verifier) is small but has real JSON-authoring overhead per client app. A model drafts the body contract and the first `logMe()`-calling stub from a plain-language description of the intended flow — the same "draft, then validate, never trust directly" pattern as the layout-contract assistant in 4a, applied to the thing that actually matters more: the execution contract itself.

- **Input:** natural-language flow description ("receive a request, validate it, call the pricing service, write a receipt")
- **Output:** a draft `*.file-system-body.contract.v1.json` + a stub runtime file with `logMe()` calls in place, both run through the same conformance verifier a hand-written version would face before anything is treated as declared
- **Guardrail:** a drafted contract that the verifier can't tie out against real telemetry is worthless by construction — the verifier doesn't know or care that a model wrote it, which is exactly the property that makes this safe to automate aggressively.

**Cross-app drift and pattern detection.** Once several client apps each produce a self-conformance receipt bundle in the same shape, a model can compare them: which apps' bodies keep drifting (`surface-drift`, `executed-but-undeclared`) after being "fixed," which finding codes cluster around which architectural pattern, which apps have gone quiet (no recent runs) versus which are actively producing fresh receipts. This is the same idea as the finding-pattern triage in 4a, but scaled from "one repo's history" to "every app that has adopted the lights-on spine" — which is where the "self-healing" half of the framing actually starts to mean something: a model that can see drift *across* apps can propose the same fix to all of them, instead of a human reviewing each report in isolation.

- **Input:** a fleet of self-conformance receipt bundles, read after the fact, across apps
- **Output:** a fleet-level advisory report — never written back into any single app's `report.md` or consumed by any single app's truth gate
- **Guardrail:** same as 4a's triage proposal, just wider — read-only over already-written evidence, its own output artifact, zero write path back into any app's verdict.

## 5. The one rule underneath all of it

LogMe's entire value — and the lights-on doctrine's entire value, at any scale — is that the report can't lie about itself. That's the whole point of the truth gate, the provenance hashes, the fixed truth-field allowlist added this session, and the doctrine's own promotion-decision table, which explicitly lists "LLM adversarial gauntlet" and "UI-triggered execution" as *blocked until later* even in its own worked example. Every proposal above, at either scale, is deliberately shaped to sit *outside* the verified boundary: a model can explain a blocker, draft a contract for a real verifier to accept or reject, narrate a computed verdict, or compare history across apps after the fact — but nothing a model produces is allowed to become an input to a verdict, a finding, a receipt, or a promotion decision without passing through the same deterministic checks a hand-written change would face. If a future proposal can't honestly make that claim, it doesn't belong in this system; it belongs somewhere the stakes are lower.

## 6. Finding-code surface (for scale reference)

For context on how much guardrail machinery already exists to route around: LogMe's control surface today spans roughly thirty finding codes across the sterility audit and the report-truth gate. A representative sample:

| Code | Meaning | Status |
|---|---|---|
| `local-method-without-testimony` | A method never calls `LogMe(...)` — the core "silent method" finding. | implemented |
| `anonymous-executable-method-detected` | A method has no domain-bearing name. | implemented |
| `report-template-variable-unbound` | A layout template references a field with no source in the report data contract. | implemented |
| `report-layout-truth-field-omitted` | A layout contract's required fields fail to cover one of the eight protected truth fields. | implemented |
| `stale-report-projection` | The committed report doesn't match a fresh regeneration. | implemented |
| `contaminated-verdict` | The regenerated verdict is `DOMAIN BODY CONTAMINATED`. | implemented |
| `telemetry-observation-inferred-from-verdict` | Telemetry shown as "observed" only because the verdict looked clean, with no real event behind it. | specified only |
| `executable-body-contract-missing` | No execution-tree nodes exist; renderer must show "missing," never invent a fallback. | specified only |
| `false-pass-claim` | An adversarial review packet finds a "pass" claim the evidence doesn't actually support. | specified only |

*"implemented" is enforced in running code today. "specified only" exists as Gherkin acceptance criteria in `docs/features/` but has no wired implementation yet — worth noting since any LLM proposal should assume the stricter, not-yet-built version of these gates eventually lands too.*

## 7. Open questions for the room

1. **Provider choice.** No specific model or vendor is assumed above. Does the team want to standardize on one provider now, or build the adapter interface first and stay provider-agnostic until a second use case forces the decision?
2. **Failure behavior.** Every proposal degrades to "no LLM output, everything else unchanged" on failure — confirm that's the right default rather than blocking a report on a model-call failure.
3. **Cost and rate limiting.** LogMe currently runs on every commit/push via git hooks. Blocker narration would mean a model call per blocker per commit — worth deciding whether narration runs on every local run or only in CI/on demand. Cross-app narration (4b) has a different cost shape entirely — per-run for one app, or fleet-wide on a schedule?
4. **Secrets.** LogMe has no existing credential storage. Plain environment variable, versus something closer to the alias-resolver pattern from the reference repo — how much of that machinery is actually warranted here?
5. **Scope for this cycle.** Section 4a is buildable now inside this repo alone. Section 4b requires other client apps to have actually adopted the lights-on spine (body contract + `logMe()` + receipts) before there's a fleet to reason across — is standardizing that adoption path the real near-term priority, ahead of any LLM work?

---

*Prepared for architecture review, not yet scoped as an implementation plan.*

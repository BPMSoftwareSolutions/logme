# Feature Proofs

This folder stores compact, source-controlled feature proof bodies.

Raw execution evidence stays under untracked paths such as `evidence/runs/<run-id>/` and compressed archives like `evidence/archive/<year>/<run-id>.zip`. A selected proof run can be promoted into a small Markdown body here so product owners can review durable feature proof without committing bulky run evidence.

Expected proof body shape:

- `docs/feature-proofs/<feature-id>.proof.md`

Each proof body should cite the selected proof run id, source feature document, scenario coverage, promotion decision, blocker summary, proof artifact hashes, and regeneration command.

Opt-out rule:

- When a proof body is current, routine feature truth runs should not regenerate dense `evidence/runs/<current-run-id>/features/<feature-id>/` proof packets for that feature.
- The feature should re-enter proof execution when the feature source, scenario list, executable body contract, selected proof artifacts, PI or release validation requirement, or product-owner refresh request invalidates the committed proof body.
- Feature status files and quality board files should also avoid churn: routine checks may write run-scoped receipts, but source-controlled status timestamps should change only when product-visible status changes.

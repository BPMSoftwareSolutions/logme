# LogMe

LogMe audits a configured workspace: it discovers source files, inventories
every executable method, checks that each one testifies with a `LogMe(...)`
call, and rejects silent, anonymous, or generically-named code. It renders
the result as a domain body sterility report.

## Usage

```js
const { runsLogMeDomainAudit } = require('./src/runs-logme-domain-audit');

const receipt = runsLogMeDomainAudit();
// receipt.reportPath    -> where the report was written
// receipt.reportContent -> the rendered report as a string
// receipt.bytesWritten  -> size of the written report
```

Configuration lives in `logme.config.json` at the package root: it declares
which files to scan, which directories/files to exclude, the domain
vocabulary a method name must stay within, and the full domain contract
(hard laws, verdicts, finding definitions) the report is built from.

## Layout

- `src/` — the domain body: config loading, source discovery, method
  inventory, sterility detection, and report rendering/writing.
- `packages/` — generic mechanics used by the domain body (AST parsing,
  filesystem walking, markdown rendering, testimony/telemetry core).
- `contracts/file-system-bodies/02_declared/` — the declared shape of this
  package, checked by `tests/file-system-body.test.js`.
- `tests/` — one test file per unit, run with `node --test tests/`.

## Verifying sterility

```sh
node --test tests/
node -e "console.log(require('./src/runs-logme-domain-audit').runsLogMeDomainAudit().reportContent)"
```

The second command regenerates `report.md` and prints its verdict.

# Report UX Audit: report.md

- Release candidate id: rc-live-gemini-scenario-2026-07-10-00-49-15-916
- Report under review: report.md
- UX verdict: DOES NOT FULLY MATCH EXPECTED UX
- Blocker/risk codes: report-ux-absolute-path-leak, report-ux-html-preview-missing, report-ux-shareability-risk

## Criteria Review

| expectation | status | evidence |
| --- | --- | --- |
| executive summary is understandable | met | report.md opens with verdict, promotion, run id, evidence state, blocker count |
| ASCII sketches render clearly | met | top fenced text block contains aligned ASCII execution tree |
| links use repo-relative or artifact-relative paths | not met | absolute Windows paths found in report surface |
| evidence paths resolve | partially met | evidence is named, but local absolute path reduces portability |
| blocker states are visible before dense details | met | Blocker Summary appears before config and dense method details |
| timing and call-count facts are readable | met | duration and method counts are visible in summary and tree |
| no JSON-only evidence is presented as product-ready | met | domain-analysis caveat separates deterministic findings from promotion gate |
| report can be shared with architects and business owners | partially met | summary is readable, but absolute paths are a sharing blocker |
| HTML projection inspected when available | blocked | no HTML preview artifact or screenshot index was produced for report.md in this run |

## Absolute Path Examples

- report.md:104: - Generation command: C:\nvm4w\nodejs\node.exe C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\scripts\report-truth.js --fast
- report.md:106: - Config path: C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\logme.config.json
- report.md:110: - Evidence directory: C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\evidence
- report.md:114: - Root: C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme
- report.md:116: - Config: C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\logme.config.json
- report.md:199: \| 1 \| 1 \| lowercasesSingleValue \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-config-primitives\src\lowercases-string-list.js:4-10 \|
- report.md:200: \| 2 \| 2 \| lowercasesStringList \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-config-primitives\src\lowercases-string-list.js:12-18 \|
- report.md:201: \| 3 \| 3 \| normalizesConfigStringArray \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-config-primitives\src\normalizes-config-string-array.js:5-11 \|
- report.md:202: \| 4 \| 4 \| readsJsonConfigFile \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-config-primitives\src\reads-json-config-file.js:5-12 \|
- report.md:203: \| 5 \| 5 \| resolvesConfiguredRootPath \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-config-primitives\src\resolves-configured-root-path.js:5-11 \|
- report.md:204: \| 6 \| 6 \| isMethodLikeNode \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\detects-logme-call-in-node.js:5-16 \|
- report.md:205: \| 7 \| 7 \| detectsLogmeCallInNode \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\detects-logme-call-in-node.js:18-58 \|
- report.md:206: \| 8 \| 8 \| searchesForLogmeCall \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\detects-logme-call-in-node.js:25-51 \|
- report.md:207: \| 9 \| 9 \| isMethodLikeNode \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\extracts-executable-method-nodes.js:5-16 \|
- report.md:208: \| 10 \| 10 \| extractsExecutableMethodNodes \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\extracts-executable-method-nodes.js:18-39 \|
- report.md:209: \| 11 \| 11 \| collectsMethodLikeNode \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\extracts-executable-method-nodes.js:25-35 \|
- report.md:210: \| 12 \| 12 \| getScriptKind \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\parses-javascript-typescript-source.js:6-17 \|
- report.md:211: \| 13 \| 13 \| parsesJavascriptTypescriptSource \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\parses-javascript-typescript-source.js:19-
- report.md:212: \| 14 \| 14 \| resolvesMethodKind \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\resolves-method-kind.js:5-35 \|
- report.md:213: \| 15 \| 15 \| resolvesMethodName \| function \| yes \| C:\source\repos\bpm\intelligence\03-engineering-intelligence\logme\packages\logme-method-inventory-primitives\src\resolves-method-name.js:6-42 \|

## Conclusion

The produced Markdown report is understandable and has a usable executive-first layout, but it does not fully match the expected shareable UX because it leaks machine-local absolute paths and lacks an HTML/rendered visual inspection artifact.

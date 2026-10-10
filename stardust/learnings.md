# Learnings — TEAG Thüringer Energie replica (aemcoder/dc15da58), 2026-10-08

### JSON-LD metadata row serves angle brackets entity-escaped
- failure class: metadata-pipeline (served structured data parses but no longer equals the source graph)
- evidence: /privatkunden/strom/stromtarife and /privatkunden/strom/ersatzversorgung carry FAQPage graphs whose Answer texts contain source HTML; a `json-ld` metadata row written with raw `<`/`>` was served as `&#x3c;section …&#x3e;` inside the script (parity check FAIL); writing the brackets as JSON `<`/`>` served the graph verbatim (8/8 PASS). Helper: stardust/.work/rollout/probes/jsonld-carry.mjs
- proposed change: `skills/rollout/scripts/autofix-aem.mjs` `eds-jsonld` fixer — turn `manual` into a deterministic fixer that writes the captured source graph as a `json-ld` metadata row with `<`/`>` escapes when a source capture exists; document the row in `skills/rollout/reference/checks.md` § ai-search/jsonld
- status: pending

### deploy-batch drops the bare `/` path
- failure class: path-safety
- evidence: a paths file listing `/` drove 6 of 7 pages (the home page silently skipped, `[deploy-batch] 6 pages`); `/index` drove it. G-aem, ledger stardust/deploy/ledger-g-jsonld.json
- proposed change: `skills/deploy/scripts/deploy-batch.mjs` path normalisation — map `/` to `/index` (or fail loud on an empty path) and say so in the `--paths` help line
- status: pending

### Block coverage rows never flipped by the C-deliver units
- failure class: ledger-gap
- evidence: at H-report `rollout.json.lastRun.blocks` read 17 total · 0 converted · 17 pending although every block was live on the published origin; the cluster/archetype briefs recorded page rows and units but never `update-coverage.mjs --block`
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C (Fan-out discipline) and § 5 Bookkeeping — each archetype/cluster unit ends with `update-coverage.mjs --block <id> --status deployed --eds-name <name>` for the blocks it shipped; `verify.mjs` could also derive block status from the pages that use them
- status: pending

### gate-all origin capture does not dismiss the consent manager or mask the chat widget
- failure class: capture-gap (false pixel delta)
- evidence: all-pages gate on thueringerenergie.de — origin stitch kept the Usercentrics layer and the moin.ai chat bubble; re-shoot with `stitch-shot.mjs … --settle --dismiss '#usercentrics-cmp-ui #accept'` plus `masks.json` rows was needed before the numbers were comparable (C-deliver gate-all unit)
- proposed change: `skills/replica/scripts/gate-all.mjs` — pass `--dismiss`/`--settle` through to the origin capture from `overrides.json`, and read `masks.json` for both sides; document in `skills/replica/reference/source-fidelity-gate.md` § The all-pages published-origin gate
- status: pending

### unit-geometry caches live units per slug without the width
- failure class: false-measurement
- evidence: `stardust/current/measure/<slug>-units.json` written at 1440 was reused for the 360 run until deleted by hand (gate-all 360, C-deliver)
- proposed change: `skills/replica/scripts/unit-geometry.mjs` — key the live cache by `<slug>-<width>`
- status: pending

### Source paths with `_` fail delivery-lint and need a redirect pair
- failure class: path-safety
- evidence: `/privatkunden/strom/haus-_-_baustromanschluss` and `/ueber_uns/unternehmen` were rejected by delivery-lint; served as `/privatkunden/strom/haus-baustromanschluss` and `/ueber-uns/unternehmen` with 2 rows in stardust/redirects.tsv, and every later roster/gate/done-check had to translate source → served paths by hand
- proposed change: `skills/replica/reference/handoff-contract.md` § 1 — a path-normalisation step before the first PUT that writes `stardust/redirects.tsv` and stores the served path on the coverage row (`path`) while keeping the source path (`sourcePath`), so gates and done-check read one field
- status: pending

### Nine-block archetype unit spent its round cap in one subagent
- failure class: budget / round-cap
- evidence: program template (stromtarife) archetype unit — 9 blocks, one subagent, 74 min and the round cap spent, still FAIL (7.95 % at 1440, 12.83 % at 360); article (3 blocks) and listing templates passed in 26 and 40 min
- proposed change: `skills/replica/reference/handoff-contract.md` § 3 row C Fan-out discipline — split a template with more than ~6 blocks into two waves (chrome + first-screen, then the rest) each with its own round cap, and pass the previous wave's report as the brief's "Notes for the next author"
- status: pending

### A consent manager's interim tier adds runtime UI the pixel gate counts
- failure class: dynamic-gap
- evidence: footer at 360 read −38 px height against the source — the Usercentrics runtime "Cookies" link rendered on the source footer only; not authored content, surfaced as a foundation residual at C-final
- proposed change: `skills/dynamics/reference/triage.md` — for a T-class (tag/CMP) row shipping an interim or scaffolded tier, list the runtime UI the source CMP injects (footer links, badges) and either replicate it statically or add a `masks.json` row before the gate
- status: pending

### Home page residual is live content drift, not a recreation defect
- failure class: live-drift
- evidence: index 32.96 / 33.09 % with content MISSING 80 — daily themes list, social wall posts and event dates differ between the capture and every later live capture; 2 of 3 rounds spent before the class was recognised
- proposed change: `skills/replica/reference/source-fidelity-gate.md` § Residual logging — a `drift` residual kind that pins the live side to the extract-time capture (`live.png` + captured JSON) for modules declared time-varying in `stardust/dynamic-features.md`, so the number measures the recreation
- status: pending

### python3 http.server is not available on the runner
- failure class: tooling
- evidence: the Phase 4 prototype server command failed; `node stardust/replica/lift/serve.cjs stardust/prototypes 8791` was written as a stand-in
- proposed change: `skills/replica/SKILL.md` Phase 4 and `skills/replica/scripts/` — ship a `serve.mjs` static server and reference it instead of `python3 -m http.server`
- status: pending

## 2026-10-09 — unit-geometry origin inventory cached per slug, not per width

- **Evidence:** fix-wave-15:index — `gate-all --width 1440 --only index --skip-existing` after a 360 roster run read units "off 77 / missing 39" against a 16 913-px origin inventory (`stardust/current/measure/index-units.json`, written by the 360 run); the same run with the cache set aside read "off 1 / missing 7".
- **Proposed change:** `skills/diff/scripts/unit-geometry.mjs` — key the `--slug` cache by width (`<slug>-<width>-units.json`) or store `width` in the record and refuse a mismatch; `gate-all.mjs` passes `--force` when `--recapture-origin` is set.
- **status:** pending

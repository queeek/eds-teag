# Unit `fix-wave-3:program` — close the `pages_failed` gap on the program template (re-prototype-level wave)

Status at hand-off (2026-10-08 21:00 UTC): rollout phases A–I are ended; the runner's done-check lists one gap —
`pages_failed:4: /, /privatkunden/strom/ersatzversorgung, /privatkunden/strom/stromtarife, /privatkunden/strom/stromtarife/teag-strom-easie`.
Roster gate (stardust/replica/gates/all-{1440,360}/summary.md): stromtarife 7.95 % (content MISSING 1, units off 3 / missing 8) / 12.83 %;
ersatzversorgung 7.6 % (units off 2) / 12.66 %; teag-strom-easie 11.2 % / 19.45 %. Clipped 0, |Δh| ≤ 5 % everywhere.
Two prior waves (stardust/rollout/units/archetype-privatkunden-strom-stromtarife.report.md, cluster-privatkunden-strom-stromtarife-program360.report.md
§ "Residuals after round 3" and § "Notes for the next author") spent their round caps on CSS-only fixes; the handoff contract's next step after the cap
is the RE-PROTOTYPE decision (replica handoff-contract § 3 row C): re-measure the program archetype against the live page at 360 with the
instruments and re-author the mobile layout of the blocks the band breakdown names — not another blind CSS round.

Rules (unchanged): the design is the captured one; content verbatim; foundation files in stardust/rollout/foundation-freeze.json are frozen
(header, footer, styles/*, scripts/*, head.html — queue a line in stardust/rollout/foundation-requests.md instead of editing); blocks obey the
EW1–EW10 editability contract and `block-roundtrip --ew`; every fix comes off an instrument (anchor.mjs band breakdown, measure.mjs boxes,
clip-probe), never off eyeballing; cap 3 gate rounds for this wave; no stealth, no header spoofing; run ≤ 3 Chromiums; wait for every job.

Procedure
1. Record `fix-wave-3:program` running: `node stardust/.work/rollout/probes/unit-record.mjs fix-wave-3:program --status running`.
2. Instruments first, 360 then 1440, one page at a time (stromtarife is the archetype; the siblings inherit its blocks):
   - `node stardust/scripts/replica/anchor.mjs https://www.thueringerenergie.de/privatkunden/strom/stromtarife --width 360 --cache stardust/replica/gates/privatkunden-strom-stromtarife-360/anchor-live.json`
     and the same against `https://main--dc15da58--aemcoder.aem.page/privatkunden/strom/stromtarife`; first hot band top-down.
   - `node stardust/scripts/replica/measure.mjs <live> --against <preview> --width 360 --all-matches --consent '#usercentrics-cmp-ui #accept' --selectors "<union of live + build selectors for the hot band>"`;
     `stardust/.work/rollout/program-360/summarize.mjs <json>` prints the deltas. Live side cached once; build side free.
   - Known measured residuals to start from (program360 report § Residuals after round 3): product-teasers stacked cards @360, cta-band eye-catcher
     text column, three-steps section bottom, text-module float section (`Rechtliche` under the floated figure), page-header-hero docked @360,
     tariff-calculator block height vs live `.verfuegbarkeitscheck-modul`.
3. Re-author the mobile layout of the named blocks in blocks/<block>/<block>.css (+ .js only if the DOM shape is wrong), as `@media (width <= 1024px)`
   rules scoped to the block; keep the 1440 numbers (re-gate both widths). Content changes only for the stromtarife content MISSING 1 / units missing 8
   (named probe asymmetries — see the archetype report) — content/privatkunden/strom/stromtarife.html, re-PUT with
   `node stardust/scripts/deploy/deploy-batch.mjs --org aemcoder --repo dc15da58 --branch main --content content --paths <list> --ledger stardust/deploy/ledger-fix3.json --log stardust/.work/rollout/fix-wave-3/deploy.log --concurrency 1 --force --token-file /shared/stardust-replica/.adobe-ims-token`
   (list `/index` for the home page, never `/`). Code lands with `git push origin main` (code sync is automatic; poll the preview with `curl -sf`, ≤ 5 s apart, capped).
4. Gate per round through run-bg, both widths sequentially (unit-geometry cache: delete stardust/current/measure/<slug>-units.json between widths):
   `node stardust/scripts/replica/run-bg.mjs start --name fix3-360 -- node stardust/scripts/replica/gate-all.mjs --only privatkunden-strom-stromtarife,privatkunden-strom-stromtarife-teag-strom-easie,privatkunden-strom-ersatzversorgung --width 360 --eds-host https://main--dc15da58--aemcoder.aem.live`
   then `wait`, then the 1440 run. Origin stitches at 360 need `--settle --dismiss/--consent '#usercentrics-cmp-ui #accept'`; moin.ai masks are in gates/all-<w>/masks.json.
   ≈ 7 min per 3-slug width run — plan 2 rounds inside a 60-minute window.
5. After the last round: `node stardust/scripts/rollout/update-coverage.mjs --gate stardust/replica/gates/all-1440/summary.json` and the 360 file,
   `node stardust/scripts/rollout/verify.mjs --base https://main--dc15da58--aemcoder.aem.live --all`, re-run optimize (`--all`), regenerate the dashboard,
   record the unit done with `--verdict` (pixel % per page per width, Δh, clipped, content, units) and the residuals, write the report to
   stardust/rollout/units/fix-wave-3-program.report.md with a "Notes for the next author" section, commit, boundary ask.
6. Home page (`/`, slug index, 32.96 / 33.09 %, content MISSING 80 — live content drift: daily themes list, social wall, event dates; 1 round left)
   is a SEPARATE unit `fix-wave-3:index` after this one: decide per the source-fidelity-gate residual rules whether the drift modules get mask rows
   (declared time-varying in stardust/dynamic-features.md) before any CSS round; what remains after that is an owner decision → event:"blocked".
7. Then `curl -s --max-time 300 localhost:8080/done-check`; only when `complete` is true write the `stardust:replica handoff end` line + journal section.

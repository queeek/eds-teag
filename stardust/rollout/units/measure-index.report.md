# measure:index — report

Measurement-only unit (no CSS, no content, no gate, no deploy). Live https://www.thueringerenergie.de/ vs served https://main--dc15da58--aemcoder.aem.page/, widths 1440 and 360, `measure.mjs --all-matches`, 2 runs per width (second run with corrected live selectors). Full tables: `stardust/.work/rollout/fix-wave-5-index/measurements.md` (+ 4 raw `--out` JSON files beside it).

## Facts
- Root 1440: live 8820 vs served 8380, Δ −440 (served shorter). No horizontal overflow at 1440 or 360.
- Social wall section: live 1547 vs served 1130 at 1440 (−417); 4387 vs 3559 at 360 (−828). Posts: served `.social-wall-post` 388 px (1440) / 385 px (360); live post box ≈ 574 / ≈ 481 (derived from the `.posts` grid height, 2 rows of 4 at 1440, 8 stacked at 360). Live has a 139 px load-more row under the grid that served does not render.
- Events button: live `a.link-button.enlarge` 54 px tall, line-height 54, padding 0 30, font 19 px, radius 0, w 211; served `.events-commands .button` 40 / 40 / 0 10 / 17 px / radius 2 px, w 139.
- product-teasers columns-2: padding-top 150 on both sides at 1440 (served 148/8 at 360); served block 578 vs live 568 (+10), 1124 vs 1117 at 360 (+7). Served block starts 34 px higher on the page than live.

## Fix leads (sign = effect on served height at 1440)
1. Social wall: `.social-wall-post` min-height/unclamp to ≈ 574 (1440) / ≈ 481 (360) and render the load-more row (≈ 139) → ADDS ≈ +470 (closes the −440 alone; consider ≈ 540 to avoid overshoot).
2. Events button: `.events-commands .button` height/line-height 54, padding 0 30, font-size 19, radius 0 → ADDS +14.
3. product-teasers: parity on padding; trim box 428 → 418 and 360 padding `150px 0 0` → REMOVES ≈ 10. Not a height lever.

## Notes for the next author
- `.page-foot-section.aktuelles:nth-of-type(2)` matches nothing live; use `.page-foot-section.aktuelles` all-matches, index [1] = social wall.
- The probe returned 0 matches for live `.posts > .list-entry` even though the HTML has `li.…list-entry.shadow`; if you need per-post live rects, try `.posts > li` or html-slice.
- ≈ 34 px of the deficit sits above product-teasers (served y 1614 vs live 1648) — not measured here.
- Served `.product-teasers.columns-2 > *` second child has `margin-top: 160px` at 360 — looks like an unintended rule worth a glance while in the file.

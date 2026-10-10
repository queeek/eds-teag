# fix-wave-5:index — report

Unit: `fix-wave-5:index` (home page `/`, slug index). Round 1, code only, from `stardust/.work/rollout/fix-wave-5-index/measurements.md` (measure:index, 2026-10-09 00:19–00:22Z). Session ended at the hard deadline 00:33Z; no gate was run.

## Round table

| round | what | status |
|---|---|---|
| 1 | social-wall post min-height 574 (1440) / 481 (360); `.events-commands .button` 54px / line-height 54px / padding 0 30px / 19px / radius 0, white on rgb(11 162 227) | code pushed (commit 124da1e), **gate pending** |
| 2 | — | not started |
| 3 | — | not started |

## Files changed

- `blocks/social-wall/social-wall.css` — `.social-wall-post { min-height: 574px }` base; `@media (width <= 1024px) { .social-wall-post { min-height: 481px } }` (measured live post ≈ 574 at 1440 vs served 388; ≈ 481 at 360 vs served 385).
- `blocks/events/events.css` — new `.events-commands .button` rule with the measured live `.link-button.enlarge` recipe (54 / 19px / 0 30px / radius 0). Adds +14 px at both widths.

Not changed: product-teasers (lead is a ≤ 10 px REMOVE item; 1440 Δh +440 sits one px inside the 5 % bar — left for a later round after the gate). Foundation-freeze files untouched. No overrides, no content re-PUT.

## Notes for the next author

- Expected effect at 1440 (unverified): social wall +372 (2 rows × 186) + button +14 ≈ +386 of the −440 root deficit → residual ≈ −54, inside the ≈ 441 px bar. The measured live "load-more row" (139 px, `a.dynamic-list-auto-loader.link-button.enlarge`) was NOT added: the block produces no such DOM (`.social-wall-more` in social-wall.js is the per-post "mehr" link, not a block-level loader). Adding it would need markup, i.e. a content/decorator decision, not CSS.
- At 360: social wall +768 (8 × 96) of the measured −828 section Δ; residual ≈ −60 plus the 139 loader.
- Gate per round (brief item 5), widths sequential, wait until `done`:
  `node stardust/scripts/replica/run-bg.mjs start --name fix5i-<w> -- node stardust/scripts/replica/gate-all.mjs --only index --width <w> --eds-host https://main--dc15da58--aemcoder.aem.live --skip-existing --recapture-eds`
  Delete `stardust/current/measure/index-units.json` between widths. No update-coverage.
- If the gate shows the social wall overshooting, lower the 1440 min-height toward 540 (measurements.md sum check) rather than touching other blocks.
- Then rounds 2–3 per the brief (`stardust/rollout/units/fix-wave-5-index-brief.md`); then `fix-wave-4:index` per MEMORY.

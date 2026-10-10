# cluster:privatkunden-strom-stromtarife — program-360 fix wave (shared-block round, not a re-authoring)

program-360: pages 3/3 live, gate 1440 8.06%/14.21%/7.88%* / 360 12.88%/18.42%/12.62%* (stromtarife/easie/ersatz), Δh 1440 +60/−31/+10* · 360 −15/+61/−29*, clipped 0, content 0 (stromtarife MISSING 1@1440 / 3@360 = the known badge-media + static-form probe asymmetries, unchanged), units off 3+8/8/2 @1440 · 22+8/12/23 @360 (see residuals), rounds 3, requests 0 (round 3 numbers below; the shipped code for ersatz equals round 2 after the withdrawn rhythm rule)

Verdict: FAIL on pixel for all three rows at 360 and easie at 1440 — but every 360 row moved toward the gate
(stromtarife 16.43 → 12.45, easie 19.9 → 18.72, ersatz 19.42 → 12.62; |Δh| 53/224/179 → 31/75/29) off measured boxes
only. 1440 rows unchanged (8.06 / 15.28 / 7.88). No 3rd round: the remaining hot bands have no measured, CSS-shaped
cause left (see residuals); the wall clock (19:10 UTC) left no room for a further measure + gate cycle.

## Round 3 (coordinator's list; 19:12 UTC wall clock)
Measured (`stardust/.work/rollout/program-360/m3-*.json`, `sum` via summarize.mjs):
- ersatz "Rechtliche" (`with-lists`, figure): children match live within 2 px at BOTH widths (header 23/35 mb48, figure 221/334, p 208/110 mb16, ul 26/27 mb20, h3 + content 296/172). The −52/−56 is not inside the module; the live module→next-section distance read 110 @360 vs the EDS 80. A `with-lists` wrapper margin-bottom 50 rule was authored → gate: ersatz 1440 7.88 → 13.39 % (Δh −50), 360 12.62 → 15.82 % (Δh −89) → WITHDRAWN (commit "withdraw the with-lists rhythm rule"); the shipped CSS for ersatz is round 2 again (its round-2 numbers are the valid ones, marked * above; no re-gate fit the wall clock).
- easie eye-catcher column @1440: every non-first live h3 has margin-top 30 (collapsing with p mb 16 → +14 each) — rule extended to all widths → easie 1440 15.28 → 14.21 % (Δh +69 → −31: the column now overshoots; the live column has 5 such h3 in the first 12 children, the EDS more). Kept.
- stromtarife card 4 ("Bestwahl"): live .description→.link 1 px vs block 17 → `.product-teasers:not(.columns-2) .product-teasers-description > p:last-child { margin-bottom: 0 }` ≤ 1024 → strom 360 12.45 → 12.88 % (Δh −31 → −15; band 6500-7000 32 → see below). Kept (measured, Δh improved; pixel noise ±0.4).

### gates (round 3 runs; ersatz * = round-2 code)
```json
{
  "privatkunden-strom-stromtarife": {
    "1440": {"pixelPct": 8.06, "heightDelta": 60, "clipped": 0, "contentMissing": 1, "unitsOff": 3, "unitsMissing": 8, "verdict": "FAIL (elements)", "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-54-24-704Z-privatkunden-strom-stromtarife.json"},
    "360":  {"pixelPct": 12.88, "heightDelta": -15, "clipped": 0, "contentMissing": 3, "unitsOff": 22, "unitsMissing": 8, "verdict": "FAIL", "run": "stardust/replica/gates/all-360/runs/2026-10-08T19-02-10-661Z-privatkunden-strom-stromtarife.json"}
  },
  "privatkunden-strom-stromtarife-teag-strom-easie": {
    "1440": {"pixelPct": 14.21, "heightDelta": -31, "clipped": 0, "contentMissing": 0, "unitsOff": 8, "verdict": "FAIL", "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-54-24-704Z-privatkunden-strom-stromtarife.json"},
    "360":  {"pixelPct": 18.42, "heightDelta": 61, "clipped": 0, "contentMissing": 0, "unitsOff": 12, "verdict": "FAIL", "run": "stardust/replica/gates/all-360/runs/2026-10-08T19-02-10-661Z-privatkunden-strom-stromtarife.json"}
  },
  "privatkunden-strom-ersatzversorgung": {
    "1440": {"pixelPct": 7.88, "heightDelta": 10, "clipped": 0, "contentMissing": 0, "unitsOff": 2, "verdict": "FAIL (elements)", "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-40-16-296Z-privatkunden-strom-stromtarife.json (round 2 = shipped code; round-3 run with the withdrawn rule: 13.39 %, …T18-54-24-704Z…)"},
    "360":  {"pixelPct": 12.62, "heightDelta": -29, "clipped": 0, "contentMissing": 0, "unitsOff": 23, "verdict": "FAIL", "run": "stardust/replica/gates/all-360/runs/2026-10-08T18-40-40-200Z-privatkunden-strom-stromtarife.json (round 2 = shipped code; round-3 run with the withdrawn rule: 15.82 %, …T19-02-10-661Z…)"}
  }
}
```
Units (sequential widths this round, cache cleared between): 1440 off 3/8/2, 360 off 22/12/2 — the ersatz 360 "23" of rounds 1–2 was the concurrent-cache artefact (2 with sequential runs); strom 22 / easie 12 persist → real family drift of the stacked program cards (aspect-ratio rule moved the boxes the `#List15736`/`.product-teasers-card` families pin) — index author: re-pin those families' expected boxes or accept as named.

### Residuals after round 3
- ersatz 2500-3000 @360 / 2000-2500 @1440 band: NOT the Rechtliche module (children match). The live `#PCS20119`→`#PCS20123` distance differs from the EDS rhythm in a way the +30 wrapper rule overshot by 60 at both widths — the live section above (accordion module) ends differently; measure `#PCS20119 .text-modul > *` and the EDS `with-accordion` module's children before touching rhythm again.
- easie 1440 column now −31 Δh (overshoot): if the index needs it, cap the rule to the first N h3 or re-measure the lower half of the column (children 13+ were beyond the 12-match cap).
- strom 360 6500-7000 band: cards 3/4 + three-steps header; the card-4 gap is fixed, the rest unmeasured.
- unchanged: easie tariff block (content), gif frame, cta-band text wrap, the three foundation requests.

## gates (round 2)
```json
{
  "privatkunden-strom-stromtarife": {
    "1440": {"pixelPct": 8.06, "heightDelta": 60, "clipped": 0, "contentMissing": 1, "unitsOff": 3, "unitsMissing": 8, "verdict": "FAIL (elements)", "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-40-16-296Z-privatkunden-strom-stromtarife.json"},
    "360":  {"pixelPct": 12.45, "heightDelta": -31, "clipped": 0, "contentMissing": 3, "unitsOff": 22, "unitsMissing": 8, "verdict": "FAIL", "run": "stardust/replica/gates/all-360/runs/2026-10-08T18-40-40-200Z-privatkunden-strom-stromtarife.json"}
  },
  "privatkunden-strom-stromtarife-teag-strom-easie": {
    "1440": {"pixelPct": 15.28, "heightDelta": 69, "clipped": 0, "contentMissing": 0, "unitsOff": 8, "verdict": "FAIL", "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-40-16-296Z-privatkunden-strom-stromtarife.json"},
    "360":  {"pixelPct": 18.72, "heightDelta": 75, "clipped": 0, "contentMissing": 0, "unitsOff": 12, "verdict": "FAIL", "run": "stardust/replica/gates/all-360/runs/2026-10-08T18-40-40-200Z-privatkunden-strom-stromtarife.json"}
  },
  "privatkunden-strom-ersatzversorgung": {
    "1440": {"pixelPct": 7.88, "heightDelta": 10, "clipped": 0, "contentMissing": 0, "unitsOff": 2, "verdict": "FAIL (elements)", "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-40-16-296Z-privatkunden-strom-stromtarife.json"},
    "360":  {"pixelPct": 12.62, "heightDelta": -29, "clipped": 0, "contentMissing": 0, "unitsOff": 23, "verdict": "FAIL", "run": "stardust/replica/gates/all-360/runs/2026-10-08T18-40-40-200Z-privatkunden-strom-stromtarife.json"}
  }
}
```
(the three rows of one width share one run file; the earlier files `…T18-30-59-212Z…` / `…T18-30-40-928Z…` are round 1.)

## Measured deltas fixed (measure.mjs, live vs preview, one 360-only run per page; `stardust/.work/rollout/program-360/sum-*.txt`, `m2-easie-360.json`)
| box (360 unless noted) | live | preview before | rule (block, `≤ 1024` unless noted) | after (gate) |
|---|---|---|---|---|
| stacked product-teaser picture (every program card incl. banking) | 331×189 | 331×149 (mobile rendition) | `.product-teasers:not(.columns-2) .product-teasers-figure img { aspect-ratio: 331 / 189; object-fit: cover }` | card tops/bottoms realigned; strom Δh −53 → −31 |
| columns-2 stacked cards (ersatz): li gap / ul top | mb 160 / 278 above card 1 | 0 / 230 | `.product-teasers.columns-2 { padding-top: 198px }`, `… .product-teasers-card + .product-teasers-card { margin-top: 160px }` | ersatz 19.42 → 12.62, Δh 179 → −29 |
| stacked card text top padding | 10 | 20 | `.product-teasers:not(.columns-2, .banking) .product-teasers-text { padding-top: 10px }` | — |
| cta-band text offset inside the purple band | 111 above / 41 below (eye-catcher: 135 / 64) | 89 / 62 both | `main .cta-band { padding-top: 22px; padding-bottom: 1px }`, `main .cta-band.eye-catcher { padding-top: 46px; padding-bottom: 22px }` | strom band 4500-5000 21.6 → 18.3 % |
| three-steps step (not keyfacts) | 203 / 202 / 254, padding-bottom 48, title 25 px/line ×2 lines + 16 | 172 / 146 / 198, pb 22, h4 16/19.2 single line + 8 | `.three-steps-content h4 { margin-bottom: 16px; font-size: 1.17em; line-height: 25px }`, step `padding-bottom: 40px` | easie 7500-8000 45 → 36.2 % |
| text-module eye-catcher flow box | 207, mb 0, overflow right under | 230 + 30 | `.text-module.eye-catcher-circle .text-module-eye-catcher { margin-bottom: -23px }` | — |
| eye-catcher column h3 (not first) | margin-top 30 | 0 (column −86) | `.text-module.eye-catcher-circle .text-module-overflow > h3:not(:first-child) { margin-top: 30px }` | easie Δh 153 → 75 |
| easie 1440 picture credits | 22 px above the picture bottom (81 above card bottom) | 21 above card bottom (59 low) | `@media (≥1025) .product-teasers.with-header .product-teasers-credits { inset: auto auto 81px calc(-1 * var(--gutter)) }` | 1440 pixel 15.3 → 15.28 (band 1500-2000 15.8 → 15.6) |

Not measured as different (no rule): page-header-hero at 360 (424 / 274 / 374 on both sides), three-steps section at 1440 (402 vs 403), keyfacts module (677 / 677), card @1440 (476 / 476), hero @1440.

## Band breakdown (round 2, origin y ranges)
- stromtarife 360 (12.45 %, Δh −31): 4500-5000:18.3% (cta-band 1 — text now at the live offset, remaining = text wrap), 5500-6000:16.5%, 6500-7000:32% (cards 3/4: card 4 "Bestwahl" p→button gap, three-steps header), 15500-16000:21.1%, 17500-17995:17.9% (footer +22 = foundation request).
- stromtarife 1440 (8.06 %, pixel pass): 10500-11000:29%, 11000-11500:16.5%, 11500-11605:41% — unchanged (banking badges 404 + footer).
- easie 360 (18.72 %, Δh 75): 1000-1500:41% (tariff-calculator block 530 vs live 621 — the easie tariff content is 42 px shorter than the stromtarife one on the preview while live is 30 px taller: content, not CSS), 2000-2500:25.8% (eye-catcher column top), 5000-5500:20.8%, 5500-6000:19.5% (with-lists module / cta-band), 7500-8000:36.2%, 8000-8161:21.4% (steps tail + footer).
- easie 1440 (15.28 %, Δh 69): 1500-2000:15.6%, 3000-3500:19.1%, 3500-4000:29.4%, 4000-4500:24%, 4500-5000:26.7% — unchanged: the eye-catcher column is −56 at 1440 (live h3 margin-top 30 not applied ≥ 1025 on purpose, see residuals).
- ersatz 360 (12.62 %, Δh −29): 2500-3000:23% (Rechtliche module −52 under the figure), 6500-7000:29.5% (teaser tail −20 + footer +22).
- ersatz 1440 (7.88 %, pixel pass): 2000-2500:17.7% (Rechtliche −56 under the floated figure).

## Residuals (measured, not fixed)
- easie tariff-calculator @360: preview block 530 vs live 621 (strom: 572 vs 591). Same block, different content height → the easie tariff content is missing ~42 px of rows versus the stromtarife one; a content (not CSS) item for the index author.
- eye-catcher column @1440 −56 (`.text-module-overflow` 1098 vs live `.overflow` 1154): the live h3 margin-top 30 most likely applies at 1440 too, but with ≥ 5 h3 in the column the rule would add ~120 → applied ≤ 1024 only (measured there: 86 ≈ 3 × 30). Needs one `measure.mjs … --width 1440 --all-matches --selectors ".text-modul .overflow > *,.text-module-overflow > *"` run before extending the rule.
- ersatz "Rechtliche" text-module: −52 @360 / −56 @1440 (preview 917 vs live 969 content at 360). Needs `.text-modul > *` / `.text-module-row > *` child boxes; nothing authored.
- units off grew (ersatz 360: 2 → 23, strom 360: 3 → 22, easie 1440: 1 → 8) in both rounds while the two width runs shared the `stardust/current/measure/<slug>-units.json` cache concurrently (brief: both jobs started together; the previous authors ran the widths sequentially). The unit families are the program card / keyfacts selectors whose boxes the aspect-ratio rule moved. Re-run the widths sequentially once (delete the three cache files in between) before reading the units column as a regression.
- the eye-catcher gif frame differs per capture (justified, not chased); cta-band text wrap (live `p.description` 182 vs the block's heading + paragraphs 295) is content shape, not spacing.
- foundation requests untouched (360 header band, footer +22, 1440 channel highlight). `foundation-freeze.mjs check` → `foundation unchanged (18 files)`.

## Notes for the next author (index)
- All program-360 rules are appended `@media (width <= 1024px)` blocks at the end of `blocks/product-teasers/product-teasers.css`, `blocks/cta-band/cta-band.css`, `blocks/three-steps/three-steps.css`, `blocks/text-module/text-module.css` (plus one `≥ 1025` credits rule scoped to `.product-teasers.with-header`). Settled values: stacked picture `aspect-ratio: 331 / 189` + `object-fit: cover`; stacked text `padding-top: 10px`; columns-2 `padding-top: 198px` / card gap `160px`; cta-band `padding-top: 22px; padding-bottom: 1px` (eye-catcher variant 46 / 22); three-steps h4 `1.17em / 25px`, mb 16, step `padding-bottom: 40px`; eye-catcher box `margin-bottom: -23px`; eye-catcher column `h3:not(:first-child) { margin-top: 30px }`.
- The index reuses photo-teasers, tariff-calculator, three-steps, service-cards, cta-band: the three-steps and cta-band 360 rules above apply to it unchanged; measure the tariff-calculator block against the live `.verfuegbarkeitscheck-modul` section (live 591 / 621 vs block 572 / 530 — per-page content height, check the index content has every row).
- Measuring: one `measure.mjs <live> --against <preview> --width 360 --all-matches --consent '#usercentrics-cmp-ui #accept'` run per page with the UNION of live and build selectors (the script measures the same list on both sides; the other side reports "no match") — `stardust/.work/rollout/program-360/summarize.mjs <json>` prints per side `selector :: y h w margin padding fs lh` per match. Live selectors that work: `#MainContent_contentheader`, `.product-teasers-modul li.product-teaser` (+ `img.wide-image`, `.picture-credits`, `.container`, `h3`, `.description`, `ul.benefit`, `.link`), `.teaser-modul.coloring-background` (+ `.container`, `.description`, `.commands`, `.eye-catcher-container`), `.step-by-step-123-modul` (+ `header`, `section.step`, `.content`, `.content header`, `.symbol`), `.text-modul.default`, `.text-modul .eye-catcher`, `.text-modul .overflow` (+ `> *`), `.page-content-section`.
- `json-query.mjs <run.json> --path rows.<i>.<field>` — a run file holds all rows of one width (`rows[].slug, pct, heightDelta, clipped, hotBands, content, units.off`).
- Gate timing: 3 slugs × 1 width ≈ 6.5–7 min per run-bg job; 4 gate cycles do not fit a 56-minute window with the measure runs — plan 2 rounds.

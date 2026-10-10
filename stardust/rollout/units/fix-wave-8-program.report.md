# fix-wave-8:program — report (2026-10-09 02:33–02:50Z)

Scope: teag-strom-easie @1440 only (11.32 % → ≤ 10 %), ersatzversorgung @1440 re-verified in every round (shared with-lists rules).
Brief: stardust/rollout/units/fix-wave-8-program-brief.md. Work dir: stardust/.work/rollout/fix-wave-8-program/ (measure JSONs
live-/build-sections.json, live-calc.json, live-calc2.json, build-calc.json, anchor-live.json, crops band-1500.png / band-3500.png,
build.plain.html). Deadline 03:25Z; closed at ~02:50Z with the pass in hand (round cap 3, two rounds used; a third round was not
taken — see Residuals, tariff-calculator).

## Round table (gate-all --only both program slugs, --width 1440, --eds-host main, --skip-existing --recapture-eds)

| round | ersatzversorgung @1440 | teag-strom-easie @1440 | commit |
|---|---|---|---|
| wave-7 state | 7.61 % Δh +10 units off 1 (override) | 11.32 % Δh −1 units off 1 FAIL (pixel) | — |
| r1 02:40Z | 7.57 % Δh +10 units off 1 (override) PASS | 18.11 % Δh −117 units 0 FAIL — downloads links dropped below the float | 7015034 |
| r2 02:43Z | 7.57 % Δh +10 units off 1 (override) PASS | **9.59 % Δh +13 clipped 0 content 0 MISSING units off 0 PASS** | 02256cc |

Hot bands easie @1440 before → after: 1000–1500 12.3 → 12.3, 1500–2000 16.3 → 16.3, 3000–3500 12.9 → 9.0, 3500–4000 21.3 → 13.1,
4000–4500 12.2 → 13.2, 4500–5000 12.1 → 7.9, tail 26.3 → 14.2 (doc 5096 vs 5083).

## Instrument facts (measure.mjs @1440, live `#Content` vs build `main`)

- Sections (anchor/measure): live 655/499, 1154/659, 1813/1316, 3129/678, 3807/434, 4241/498, footer 4739/335, doc 5096 (22 px after
  the footer on the live side — scroll-up/chat chrome). Build before: 655/506, 1161/659, 1820/1330, 3150/678, 3828/435, 4263/499,
  footer 4761/336, doc 5097. Build after r2: text-module 1 = 1316 (= live); doc 5083.
- Text-module 1 (`.text-module.eye-catcher-circle`): every h3/p box matched the live to ±1 px except the last paragraph: build
  margin-bottom 30 (generic `p:last-child`) vs live 16 → module 1250 vs 1236 (+14). Fixed @≥1025 (keyed on eye-catcher-circle).
- Text-module 2 (`.text-module.with-lists`, no accordion): live li.icon-teag-file-pdf = `display:flex; align-items:baseline`,
  margin 0, 28 px icon column, `a` block #000 400 `top:-4px` (li 942×441 beside the floated figure; a y −4; li 55/27/27/55 at
  pitch 55/27/28); build li list-item margin-bottom 5, a inline bold #0ba2e3 (pitch 60/33/32, a 50 vs 55). The live "Downloads" h4
  sits in `section > header` and carries the module header's margin-bottom 48 (p end → ul 91 px; build 51 with the 8 px h4 rule that
  was measured on ersatz). Both modules are float-governed (image 844×489 + 20 + 40), so the list rules do not change the section
  height on either page (ersatz 7.61 → 7.57).
- Round 1 lesson: an `inline-block` link with a long text next to a float is pushed below the float (ul +129 px, Δh −117); the live
  li is a flex container (a BFC) which shrinks to the 441 px column — r2 mirrors that.
- Units: `jetzt meinen preis berechnen` read within tolerance in both rounds (origin 305 → eds 316 in wave 7 was origin font variance,
  as predicted there).

## Residuals (easie @1440 after r2, 9.59 %)

- tariff-calculator section +7 (655/506 vs live 655/499) shifts everything from 1161 to the footer by 7 px (bands 1000–2000 12–16 %
  are mostly this offset + the moin.ai chat widget on the origin). Measured: live `.tab-control` 695 h349 → `.siegel-row` margin-top 40
  h30 → 40 padding = 1154; build `.tariff-calculator > div` 695 h253 + margin-bottom 103 + padding-bottom 70 + 40 = 1161. Live fields
  start at 735 (container 20 + `.clear-fix.left-content` padding 20), build at 715; live form-commands 821 vs build 816; the
  "Bereits TEAG-Kunde" row was not isolated on the live side (not under `.tab-control > *`). The block composes the live geometry
  with fixed margins (103/70/49) shared with stromtarife (DELIVERED, do not touch) — no single live value names the 7 px, so no
  rule was written (a guessed 7 px would be a disguised height override). Next author: measure `#Content .tab-control` descendants
  (`.container`, the `.bar`, the TEAG-Kunde row) and key an easie fix on `main:has(.text-module.eye-catcher-circle)` or fix the
  block for both pages with stromtarife re-gated.
- 1500–2000 16.3 %: the origin's moin.ai chat widget (right, ~300×150 at 1620–1760, masks.json absent) and the product-teasers
  caption (`©` icon + box) — not worked.
- 3500–4000 13.1 %: the downloads li lack the live `::before` PDF glyph (icon font, #870d87, 28 px column); caption `©` weight.
- Tail 14.2 %: live has 22 px after the footer (scroll-up/chat chrome), footer frozen.
- stylelint `no-descending-specificity` at text-module.css L311 is pre-existing (wave 7 ordering), not from this unit.

## Files changed

- blocks/text-module/text-module.css — fix-wave-8:program block at the end, all inside `@media (width >= 1025px)`:
  `.eye-catcher-circle .text-module-overflow > p:last-child` 16; with-lists:not(.with-accordion) downloads li flex / margin 0 /
  padding 28 and `a` block #000 400 top −4; `main:has(.text-module.eye-catcher-circle) … h4` margin-bottom 48.
- stardust/replica/gates/all-1440/{privatkunden-strom-stromtarife-teag-strom-easie,privatkunden-strom-ersatzversorgung}/ — r2 gate.
- stardust/rollout/units/fix-wave-8-program.report.md (this file); work dir evidence listed above.

## Notes for the next author

1. Margin is thin (9.59 vs 10): the coordinator's roster re-run can read above 10 on origin variance; the +7 tariff-calculator
   offset is the cheapest honest gain left (see Residuals), then the PDF glyph.
2. Never use `inline-block` on a long link beside a float — the whole box drops under the float; mirror the live `display:flex` li.
3. `:has()` page keys: `main:has(.text-module.eye-catcher-circle)` is easie-only among the program pages (stromtarife has plain
   `text-module`, ersatz has with-lists/with-accordion/center-content).
4. run-bg wait: a 2-slug 1440 round took ~125 s here; CDN served the CSS within 5–15 s of the push.

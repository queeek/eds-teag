# Unit `fix-wave-5:program` — report (2026-10-08, session 14, time-boxed 23:06–23:52Z)

Scope: the two remaining program pages, teag-strom-easie (`/privatkunden/strom/stromtarife/teag-strom-easie`) and ersatzversorgung
(`/privatkunden/strom/ersatzversorgung`). stromtarife was DELIVERED before this wave and was not gated or touched; every CSS rule of this
wave is scoped so that the stromtarife calculator and its program card are unaffected (variant class / `:has()` on a structure the
stromtarife block does not have). Capture-state decision: made in wave 4, not redone. Pass bar per page per width: pixel ≤ 10 %, |Δh| ≤ 5 %,
clipped 0, content MISSING/HIDDEN 0, units within.

Δh sign in the gate rows = live stitch − build stitch (positive = build shorter; checked against units.json docH: easie live 8236 / build 8176).

## Round table

| round | width | time (UTC) | code state | easie | ersatz |
|---|---|---|---|---|---|
| 0 (hand-off, wave 4 / roster 23:03Z) | 360 | — | — | 16.52 % Δh +132 FAIL | 11.88 % Δh +31, units off 2 FAIL |
| 0 | 1440 | — | — | 11.2 % Δh −1, units off 8 FAIL | 7.6 % Δh +10, units off 2 FAIL (units) |
| 1 | 360 | 23:12–23:14 | tariff-calculator ≤ 1024 rules (commit "tariff-calculator <= 1024 …") | **6.81 % Δh +60, clip 0, content 0/0, units off 0 — PASS** | 11.88 % Δh +31, units off 2 — FAIL (unchanged, no fix yet) |
| 2 | 1440 | 23:17–23:19 | + product-teasers rules (commit "product-teasers columns-2 …") | 11.32 % Δh −1, clip 0, content 0/0, **units off 0** — FAIL (pixel, 1.3 pt over) | 7.6 % Δh +10, clip 0, content 0/0, units off 1 — FAIL (units: one link row, see residuals) |
| 3 | 360 | 23:19–23:22 | same as round 2 (final) | **6.81 % Δh +60, clip 0, content 0/0, units off 0 — PASS** | 11.17 % Δh +68, clip 0, content 0/0, units off 1 — FAIL (pixel + the same link row) |

Final numbers: easie 360 6.81 % PASS / 1440 11.32 % FAIL (pixel); ersatz 360 11.17 % FAIL (pixel, units off 1) / 1440 7.6 % FAIL (units off 1 only).
3 rounds used (cap). The 1440 rows are from round 2, which already contained every CSS change of this wave (nothing changed after it).

## Instrument facts behind the fixes

1. **easie @360 calculator** (measure.mjs live vs build, `stardust/.work/rollout/fix-wave-5-program/calc-360.json`): live section
   `.page-content-section.alternative-background-color` 544–1185 (h 641) vs build `.tariff-calculator-container` 544–1114 (h 570) → −71.
   Live card (`.tab-control` panel) ends 990 and the li keeps 95 px below it + 80 px section space = 175 px under the card; build block padding
   70 + wrapper 20 = 90 → +85 needed under the panel (the desktop analogue already in the block: `.previous-section-has-page-label
   .tariff-calculator-panel { margin-bottom: 103px }` at ≥ 1025). Inside the form (live 298 vs build 324): PLZ field padding-bottom 20 → 0
   (live `.plz-city-container` 86 flush on the consumption block), empty filter margin 20 → 15 (live gap button 15), info line +12 (live 862→990 =
   128 vs build 888→1004 = 116). All four rules scoped: variant `.previous-section-has-page-label` (easie only; stromtarife's block has no
   variant class) and `.tariff-calculator:has(.tariff-calculator-filter:empty)` (stromtarife's filter cell holds "Erweiterte Filter").
   Result: band 1000–1500 40.8 % → 4.4 %, page 16.52 % → 6.81 %.
2. **easie @1440 units off 8** (all-1440 units.json rows): product-teasers card text column −9 at the top / link +9 at the bottom → the gap
   between the description's last paragraph and the link was 26 (p margin 16 + a margin-top 9.6) vs live 9. Rule
   `.product-teasers.with-header .product-teasers-description p:last-child { margin-bottom: 0 }` → units off 0 at 1440 (round 2).
   Pixel 11.2 → 11.32 % (noise-level, no band moved by more than 0.7 pt).
3. **ersatz columns-2 cards @360** (measure.mjs, `ersatz-card-360.json` + `ersatz-fig-360.json`): live li 416 / 391, build card 427 / 418 —
   the 418 is the block's `min-height: 418px` (desktop equaliser value) and the live `.container` ends 10 px past the li content box (li 416 =
   pad 20 + figure 376 + 10 + 10). `@media (width <= 1024px) .product-teasers.columns-2 .product-teasers-card { min-height: 0;
   padding-bottom: 10px }` → units: card 0 417 vs 416, card 1 391 vs 391 (round 3). The live first card's `span.divider` carries
   `margin: 0 0 7px 20px` (x 153) while the second has `margin: 0 20px 7px 0` (x 133); the block had both at 133 →
   `.product-teasers.columns-2 > .product-teasers-card:first-of-type .product-teasers-divider { margin: 0 0 7px 20px }` → divider rows within at
   both widths (units off 2 → 1).

## Residuals

- **ersatz @360 11.17 % Δh +68 — FAIL (pixel)**. Bands (round 3): 2500–3000 **23 %** (first content band, not measured this wave — the
  inheritor's first target), 5500–6000 19.8 % (region under the second columns-2 card: both cards now sit at the live y and height —
  units 5059/417 and 5636/391 vs live 5060/416 and 5636/391 — so the remaining 68 px by which the build is shorter than the live stitch lie
  BELOW card 2 (card ends 6027 on both sides): the columns-2 block/section bottom spacing before the footer; measure `#List15736`/its
  section vs `.product-teasers.columns-2`/`.product-teasers-container` bottom at 360), 6500–6996 11.4 % (footer + moin.ai chat; the chat
  is masked, the footer is frozen → request line queued in foundation-requests.md). 1000–1500 8.3 %, 2000–2500 9.4 %, 5000–5500 9.8 %
  are under the bar. Inheritor: next program wave.
- **ersatz @1440 7.6 % Δh +10 — FAIL (units only)**: units off 1 = `link:zu den stromtarifen` dw −7 (dx 3) on the first columns-2 card
  (−6 at 360). The live `a.link-button` renders 220/231 px wide, the build 214/224 with the same padding (0 10) and the block's 1.18em
  compensation; the second card's "Zu den Erdgastarifen" is within (dw −1). Glyph-run width of the self-hosted bold face — not a layout
  delta; a font-size bump would break card 2. Candidate for a documented probe asymmetry only if the coordinator accepts font-metric
  width as such (no override written here — pixel passes, but the rule says overrides only for probe asymmetries, and this one is a
  real 6–7 px rendering delta).
- **easie @1440 11.32 % Δh −1 — FAIL (pixel, 1.3 pt over)**. Units off 0 now. Bands: 1000–1500 12.3, 1500–2000 16.3 (product-teasers
  with-header card — the text column is now aligned per units; the remaining diff in these bands is paint, not geometry), 3000–3500 12.9,
  3500–4000 **21.3**, 4000–4500 12.2, 4500–5000 12.1, 5000–5096 26.3 (text-module / cta-band / three-steps region — not crop-paired this
  wave). Inheritor: next program wave; start with a crop-pair of 3500–4000 at 1440.
- **easie @360 — PASS** 6.81 % Δh +60 (build 60 px shorter than the live stitch, 0.7 % of 8236, within the bar). Highest remaining band
  2000–2500 10.3 % (with-header card, unit h 786 vs live 784).
- `.picture-credits` paint (wave-4 note) not touched: the 1440 units row `box:div.picture-credits.oversized#1` is within (dx 0 dy 1), and no
  360 instrument fact was taken for it this wave.
- Not run: update-coverage (coordinator runs the roster). The all-360 origin.png files of both pages were reused (`--skip-existing`), eds
  recaptured every round.

## Files changed

- `blocks/tariff-calculator/tariff-calculator.css` — appended `@media (width <= 1024px)` block: `.previous-section-has-page-label` panel
  margin-bottom 85; `:has(.tariff-calculator-filter:empty)` address padding-bottom 0, filter margin-bottom 15, info padding 8/4.
  Commit "replica phase 5 fix-wave-5:program: tariff-calculator <= 1024 …".
- `blocks/product-teasers/product-teasers.css` — appended: columns-2 card `min-height: 0; padding-bottom: 10px` at ≤ 1024; first-card
  divider margin; with-header description `p:last-child { margin-bottom: 0 }`. Commit "replica phase 5 fix-wave-5:program: product-teasers
  columns-2 …".
- `stardust/rollout/foundation-requests.md` — one line (ersatz 360 footer band).
- Gate artefacts: `stardust/replica/gates/all-{360,1440}/privatkunden-strom-{stromtarife-teag-strom-easie,ersatzversorgung}/`, runs/ files,
  `stardust/current/measure/<slug>-units.json`.
- Work dir `stardust/.work/rollout/fix-wave-5-program/`: calc-360.json, ersatz-card-360.json, ersatz-fig-360.json, crop-easie-840.png,
  crop-easie1440-1300.png, easie-live.html / easie-build.html / ersatz-build.html (fetched markup, untrusted data).

## Notes for the next author

1. **ersatz @360 first**: band 2500–3000 (23 %) has never been measured — anchor.mjs the build (`--main main`) for the section at 2500–3000,
   then one crop-pair and measure.mjs the box. Then the 68 px under the second columns-2 card (the cards themselves are now unit-exact):
   compare the live `ul#List15736`/section bottom with `.product-teasers.columns-2` + `.product-teasers-container` at 360 — the block's
   `padding-top: 198px` / `.product-teasers-card + .product-teasers-card { margin-top: 160px }` mobile rules are measured, the bottom is not.
2. **Scoping discipline paid off**: stromtarife shares both blocks. Every rule here is keyed on `.previous-section-has-page-label`,
   `:has(.tariff-calculator-filter:empty)`, `.columns-2` or `.with-header`; keep doing that — a bare `.tariff-calculator-address` change
   would move stromtarife's delivered 9.07 %.
3. The gate's Δh is live − build (positive = build shorter). The earlier reports' wording "Δh +132" for easie meant the build was 132 px
   shorter, which is why adding 71 px to the calculator moved it to +60 and did not overshoot.
4. `run-bg.mjs wait` returned twice before the gate job had ended (after ~110 s, "0/1 ended"); run `wait` again — do not read the partial
   log as a result (round 1's rows were still in the log and could be mistaken for round 3's).
5. measure.mjs with one-sided selectors prints only `MISSING on A/B` in the table; the rects are in `--out` JSON under
   `pages.<url>.<width>.<selector>[].rect|props` (array per selector with `--all-matches`, object otherwise) — read it with a node one-liner.
6. easie @1440: the with-header card is unit-aligned now; the 11.3 % is spread over 1000–2000 (paint) and 3000–5096 (text-module /
   cta-band / three-steps). Crop-pair 3500–4000 first (21.3 %).

# Unit `fix-wave-4:program` — report (2026-10-08, session 13, time-boxed 22:23–23:05Z)

Three program pages: stromtarife (archetype), teag-strom-easie, ersatzversorgung. Brief: stardust/rollout/units/fix-wave-4-program-brief.md.
Work dir stardust/.work/rollout/fix-wave-4-program/ (crops, measure.mjs JSON). One CSS commit, one gate round per width (the 42-minute box allowed one).

## Capture-state decision (stromtarife @360)

The state to match is the SETTLED live stitch (gate-all's origin.png: stitch-shot `--settle`, consent accepted 21:36Z), not the fresh anchor.mjs layout. Crops of
origin.png vs eds.png (crop-pair.mjs, 8600–9700 and 9550–10000; stardust/.work/rollout/fix-wave-4-program/crop-*.png) place the box: the **banking card**
("Sind Sie bereits im TEAG-Kundenportal registriert?", `.product-teasers.banking`). Its headings sit level (live 8911 / build 8914), the badges 12 px apart
(live 9503 / 9600, build 9515 / 9612), but the next card's h2 "Durchschnittlicher Stromverbrauch" is at **9650 on the live stitch and 9781 on the build (+131)**.
measure.mjs @360 (banking-360.json, build-gap-360.json): the live `li.product-teaser` keeps its JS-set height **895** — it closes at 9629, 29 px under the second
badge's TOP, the badge overflows the li by 31 px and the next card's h2 follows 21 px later; the build card closed under the badge's bottom (9672, card 935),
then block +29, section padding-bottom 40 + next section padding-top 40 → h2 at 9781. The settled stitch and the fresh load agree on this box (both 895 / 9629
on the live side), so the "settled vs fresh" lead of fix-wave-3 was the build's +131 reading as a live shift. Rule: `.product-teasers.banking .product-teasers-extra
{ margin-bottom: -90px }` under `@media (width <= 1024px)` (was +29; Δ = 119 = 131 − the 12 px badge offset), which reproduces the live overlap — the badge stays
visible (no overflow clip on the card at ≤ 1024, the card face is off). Section padding is foundation (styles/*, frozen) and stays.

## Round table

| round | width | stromtarife | teag-strom-easie | ersatzversorgung |
|---|---|---|---|---|
| fix-wave-3 (21:46Z, baseline) | 1440 | 8.3 % Δh −5, clipped 0, content MISSING 1, units off 3 / missing 8 | 11.2 % Δh −1, units off 8 | 7.6 % Δh +10, units off 2 |
| fix-wave-3 (21:46Z, baseline) | 360 | 12.68 % Δh −64, content MISSING 3, units off | 16.52 % Δh +132, units off 8 | 11.88 % Δh +31, units off 2 |
| 1 (fix4-360, 22:30–22:34Z, after the banking rule) | 360 | **9.07 % Δh +55** (pixel PASS, Δh PASS), clipped 0, content MISSING 1, units off 3 / missing 8 → asymmetries only | 16.52 % Δh +132, clipped 0, content 0, units off 0 (unchanged, not touched) | 11.88 % Δh +31, clipped 0, content 0, units off 2 (unchanged, not touched) |
| 1 (fix4-1440, 22:35–22:39Z, confirms 1440 kept) | 1440 | 8.3 % Δh −5, clipped 0, content MISSING 1, units off 3 / missing 8 → **PASS with documented override** | 11.2 % Δh −1, clipped 0, units off 8 | 7.6 % Δh +10, clipped 0, units off 2 |
| 2 (fix4-360b, 22:39Z–, same code; records the 360 override) | 360 | 9.07 % Δh +55, clipped 0, content MISSING 1, units off 3 / missing 8 → **PASS with documented override** (22:39–22:43Z) | 16.52 % Δh +132, clipped 0, units 0 — FAIL (pixel) | 11.88 % Δh +31, clipped 0, units off 2 — FAIL (pixel, units) |

Pass bar per page per width: pixel ≤ 10 %, |Δh| ≤ 5 %, clipped 0, content MISSING/HIDDEN 0, units within. stromtarife now meets pixel/Δh/clip at both widths;
its content and units rows are the two documented probe asymmetries (override, see § Files changed). easie and ersatz were not touched this wave (the 42-minute box
allowed one measured fix + one gate round per width); their numbers are the fix-wave-3 numbers re-measured.

## Residuals

- **easie @360 16.52 % Δh +132 — FAIL** (pixel). First hot band 1000–1500 (40.8 %): crop-pair 1000–1500 (crop-easie-1000.png) shows the live grey
  tariff-calculator area closing at ≈ 1170 and the product-teasers h2 "Die Wohlfühlenergie für Ihr Zuhause" at ≈ 1230, while the build's calculator container ends at
  1114 (anchor: `alternative-background-color.tariff-calculator-container` 544–1114, h 570) and the h2 sits at ≈ 1178 — the build's **tariff-calculator block is
  ≈ 60–70 px short at 360** and everything below is offset (then 2000–2500 21 %, 5500–6000 21 % text-module/cta-band, 7500–8000 23 % footer + chat). anchor.mjs on the live
  side with `--main '#Content'` returned only the footer (the wrapper still contains chrome — pass the real content root); measure.mjs the calculator's inner boxes
  (live vs build, 360) before any CSS. Inheritor: next program wave. easie @1440 11.2 % Δh −1 — FAIL (pixel, 1.2 points over): not measured this wave; the 1440 hot
  bands are in stardust/replica/gates/all-1440/privatkunden-strom-stromtarife-teag-strom-easie/pixel.json `bands`. units off 8 at 1440 (which family: units.json results).
- **ersatz @360 11.88 % Δh +31 — FAIL** (pixel): bands 2500–3000 (23 %), 5500–6000 (12.4 %), 6500–7000 (25.4 %, footer + chat; the 360 masks.json row covers the bubble
  600:300 per 900 px chunk, the footer is frozen → request line only). ersatz @1440 7.6 % Δh +10 passes pixel; units off 2 at both widths (not a documented asymmetry —
  no override written; family in units.json results). Inheritor: next program wave.
- **stromtarife** @360 9.07 % / @1440 8.3 %: pixel, Δh and clip pass; content MISSING 1 (`kundenservice<wbr>@teag.de`) and units off 3 / missing 8 (service-cards:
  static form tier of "Rückruf vereinbaren" — 7 live controls `input#MainContent_CallBack2_*`/select, 6 extra field rows, 2 links read off by position — plus the
  Kundenservice card's `<nobr>` "fr: 7:00 – 13:00 uhr", missing 1 / off 1) are probe asymmetries, covered by overrides.json at both widths. Remaining 360 bands > 12 %:
  3500–4000 (12.4), 6500–7000 (21.4), 11000–11500 (12.1), 14500–15000 (12.1). `.picture-credits` paint (live translucent right-aligned © label over the picture's
  bottom edge vs the block's full-width grey strip under it — visible in crop-easie-1000.png too, "KI-generiertes Motiv") not done; cheap CSS once a round is free.
- Not run: update-coverage (coordinator), roster gate-all per width (summary.json still shows the pre-wave roster rows).

## Files changed

- blocks/product-teasers/product-teasers.css — one appended rule (banking card ≤ 1024: `.product-teasers-extra { margin-bottom: -90px }`), commit 8c2422a.
- stardust/replica/gates/all-1440/overrides.json — new: `privatkunden-strom-stromtarife` entry for the two documented probe asymmetries (content `<wbr>`, service-cards static form tier + `<nobr>`); reason text names every row it covers and says to remove it if pixel or Δh fail.
- stardust/replica/gates/all-360/overrides.json — new: the same entry (pixel 9.07 % / Δh +55 pass on their own after round 1; written only after that measurement — the override mechanism is page-level, `passWithOverride = pass || !!override`, so it must never sit on a page whose pixel or Δh fail).
- stardust/rollout/units/fix-wave-4-program.report.md (this file); stardust/rollout/progress.json via unit-record.mjs.

## Notes for the next author

1. **The settled-vs-fresh lead was a build offset, not a live one**: the live banking li is 895 at 360 in both states (JS-set height); the build was +131 below it. measure.mjs
   `:has()`-selectors on the build (`.section:has(.banking) + .section h2`) give the gap in one run — the wrapper/section chain is block 8717–9701, section
   8645–9741 (padding 40), next section 9741, h2 9781.
2. **Override mechanism is page-level** (gate-all.mjs `verdict()`: `passWithOverride: pass || !!override`; the row shows `→ <verdict>: <reason>` only when `!pass`).
   Write an entry only when pixel, Δh and clip pass on their own; the reason text must list every content/units row it covers. Both entries name the rows; delete them if a
   later capture moves pixel or Δh over the bar.
3. **easie @360**: fix the tariff-calculator height first (≈ 60–70 px short, band 1000–1500 at 40.8 %); re-read the bands after — the lower bands are offset. The live anchor
   needs the real content root (`#Content` still wraps header/footer at 360 → only the footer row prints).
4. **ersatz @360**: band 2500–3000 (23 %) is the first content band; 6500–7000 is footer + chat (frozen footer → foundation-requests.md).
5. Gate hygiene unchanged: widths sequentially, delete stardust/current/measure/<slug>-units.json between widths, always `--skip-existing` (the all-360 origin.png files are
   the clean consent-accepted captures of 21:36Z; this wave reused them for both 360 rounds), `--recapture-eds` after a code change.
6. Rounds this wave: 360 → 1440 → 360 (the second 360 run only records the override; code identical). Work dir keeps banking-360.json, gap-360.json, build-gap-360.json,
   anchor-easie-*-360.txt and the crops.

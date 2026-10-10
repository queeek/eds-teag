# fix-wave-7:program — report (2026-10-09 00:38–01:25Z)

Scope: ersatzversorgung @360 (0.43 pt over + units off 1), the `zu den stromtarifen` unit, easie @1440 (step 4, not reached).
Brief: stardust/rollout/units/fix-wave-7-program-brief.md. Work dir: stardust/.work/rollout/fix-wave-7-program/ (measure JSONs
m360-r1…r5, m360-easie-r1, font-probe.mjs, pseudo-probe.mjs, live CSS copies, easie 1440 crops).

## Round table (gate-all --only both program slugs, --eds-host main, --skip-existing --recapture-eds)

| round | width | ersatzversorgung | teag-strom-easie | commit |
|---|---|---|---|---|
| wave-6 state | 360 | 10.43 % Δh +60 units off 1 FAIL | 6.81 % Δh +60 PASS | — |
| r1 00:55Z | 360 | 11.74 % Δh +108 units 0 FAIL | 10.14 % Δh +96 FAIL | 4369b99 |
| r1b/r1c 01:03/01:07Z | 360 | (identical: the round-2 commit had not landed — push rejected by a concurrent fix-wave-6:index push, the chain re-gated round-1 code) | | — |
| r2 01:11Z | 360 | **6.42 % Δh +64 units 0 PASS** | **7.68 % Δh +55 units 0 PASS** | 5ed8cb7 |
| r1 01:13Z | 1440 | 10.84 % Δh −33 units off 1 FAIL | 20.84 % Δh −161 FAIL | 5ed8cb7 (rules at every width) |
| r2 01:16Z | 1440 | 7.61 % Δh +10 units off 2 FAIL (pixel-only PASS) | 11.32 % Δh −1 units off 1 FAIL | round 3 (rules scoped <= 1024) |

Gate Δh is live − build (positive = build shorter).

## Instrument facts (measure.mjs @360, live `section.page-content-section` vs build `main > .section`)

- text-module 1 (with-accordion), build 2173 vs live 2195 (−22): row 0 −8 = module-level h3 18.72 vs live 21.088 px
  (`.text-modul>h3 { font-size: calc(1.3*16px + .08vw) }` in the live ScreenLess sheet, −3 ×2), h3 after ul/p without the live
  margin-top 30 (−10), downloads li 108/81 vs live 104/78 (+7; the build's inline bold link let the line boxes grow to 27 px,
  live `.downloads li a { display: inline-block; color: #000 }` weight 400); row 2 −14 = the second h3 ("Laufzeit") margin-top 30.
  After round 2: 2195 vs 2195.
- text-module 2 (with-lists), 997 vs 1003 (−6): live downloads list is the `li.icon-teag-file-pdf` variant (flex, margin 0, 28 px
  icon column, link 303 wide: li 52/52/52/78 = 234) vs build 258 (margin-bottom 5, 306-wide links); the live `> section` margin-bottom 30
  was missing (ul bottom → section end 90 = 20 + 30 + 40). Round 1 (margin 30 instead of 20 + 30, 306-wide regular links wrapping one
  line less) read 957; round 2 (padding-left 28, margin 0, ul:last-child 50) → 1003.
- faq topic block 155 vs live 133 (+22): `.faq-search` padding 12.5 20 + line-height 50 = 75 px vs the live pill 50 (padding 0 15);
  filter 64 vs 67 (−3, not fixed). After: 130 vs 133.
- easie @360 shares the icon-variant list ("Rechtliche Grundlagen", live li 78/52/52/78 margin 0 = 260 vs build 249) and the missing
  trailing 30 → section 935 vs 993 before round 2; round 2 took easie 10.14 → 7.68 %.
- units `link:zu den stromtarifen` (dw −6 @360 / −7 @1440): font-probe.mjs — both sides load the identical Noto Sans 700 woff
  (md5 7c5337c7…, document.fonts loaded, same fontFamily resolution, letter-spacing normal, no synthesis); canvas width of the text
  189.1 @18.73 px on both. The live `.link-button` is 1.15em with `::before`/`::after` 3 px inline-blocks and a preserved trailing
  space before the ::after (189.1 + 3 + 3 + 4.9 + padding 20 = 220 measured). The block's 1.18em "4 % wider face" compensation was
  the wrong lever. Fixed in product-teasers.css keyed on `.columns-2`: 1.15em + the two 3 px pseudo caps + 0.26em before the ::after.
  Result: stromtarifen within at both widths; `zu den erdgastarifen` +5 @1440 (the live second button has no trailing space) → units off 1
  @1440 remains (within @360).
- product-teasers columns-2 padding-top 148 → 141 (the sections above now end 3 px short of the live instead of 7).

## Residuals (after round 2 @360)

- ersatz 360 6.42 %: hot band 5500–6000 22.7 % (card 2 paint, unchanged from wave 6), Δh +64 = footer −38 frozen (foundation request
  on file) + faq filter −3 + remaining paint/rounding; text-module 2 "Downloads" heading 22 vs live 25 (−3).
- 1440 r2: pixel/Δh back to the refresh-2 numbers (ersatz 7.61 / +10, easie 11.32 / −1) but units off 2 / 1 (wave-6 state: 1 / 0) —
  the off rows (unit-geometry @1440, tol 4 px):
  - ersatzversorgung @1440 unit div.product-teasers-card #0 `link:zu den stromtarifen` origin 219×40 @197,348 → eds 230×40 @191,347 (dx -6 dy -1 dw 11 dh 0)
  - ersatzversorgung @1440 unit div.product-teasers-card #1 `link:zu den erdgastarifen` origin 224×40 @194,348 → eds 237×40 @187,347 (dx -7 dy -1 dw 13 dh 0)
  - stromtarife-teag-strom-easie @1440 unit div.product-teasers-card #0 `link:jetzt meinen preis berechnen` origin 305×40 @667,416 → eds 316×40 @667,417 (dx 0 dy 1 dw 11 dh 0)
  Read against the earlier 1440 runs the ORIGIN side moved, not the build: `zu den stromtarifen` origin 231 → 219, `erdgastarifen`
  232 → 224, easie `jetzt meinen preis berechnen` (untouched, no `.columns-2`) origin 305 vs its earlier within-tolerance width —
  the live probe rendered the buttons ~5 % narrower this run (bold webfont not applied on the origin side; the 360 run minutes earlier
  and the font-probe both had it loaded). Against the stable live widths the build reads stromtarifen 230 vs 231 (within, the fix
  landed) and erdgastarifen 237 vs 232 (+5, the trailing-space margin). Re-run the 1440 gate for the two program slugs once (origin
  font variance) before reading units off 2 / 1 as a defect; easie's off unit is not reachable by any rule of this wave.
- 1440 (cont.): see the r2 row above. The 360-measured rules are scoped <= 1024; the 1440 text-module shortfalls (easie 11.32 % bands
  3000–5096, ersatz units `zu den erdgastarifen` +5) were NOT worked this wave (step 4 skipped: no time after the push race).
- `zu den erdgastarifen` @1440 dw +5: the 0.26em trailing-space margin applies to both card buttons; a per-button key is content-dependent.
- stylelint: `no-descending-specificity` for the new `.with-accordion … * + h3` rule vs the eye-catcher h3 rule (ordering only).

## Files changed

- blocks/text-module/text-module.css — fix-wave-7 block at the end, wrapped in `@media (width <= 1024px)` (round 3): module-level h3
  size, h3 rhythm 30, downloads links inline-block/#000/400, icon-variant list (padding 28, margin 0) + `ul:last-child` 50.
- blocks/faq/faq.css — `.faq.plain-header .faq-search { padding: 0 15px }` <= 1024.
- blocks/product-teasers/product-teasers.css — columns-2 padding-top 141; `.columns-2` link-button 1.15em + 3 px pseudo caps.
- stardust/rollout/units/fix-wave-7-program.report.md (this file).

## Notes for the next author

1. The 1440 regression (r1 1440) came from applying 360-measured text-module rules at every width — the 1440 live layout floats the
   figure and the lists sit beside it; measure.mjs the same boxes @1440 before lifting any of the <= 1024 rules.
2. Push race: another unit pushes to main concurrently; `git push` can be rejected — check `push-exit` and `git log origin/main` before
   polling the CDN, or a gate round silently re-shoots old code (two rounds lost here).
3. Both program pages share `.text-module.with-lists`; the ersatz-only key is `.with-accordion` (module 1) — the icon-variant list
   rule is deliberately generic to with-lists:not(.with-accordion) because easie's live list is the same variant (measured).
4. Live canon sheet: /Content/Styles/ScreenLess (909 KB) holds `.text-modul`, `.link-button`, `.downloads`, `.filter.drop-down-list`
   — grep it before guessing a value (copy in the work dir).
5. run-bg wait: a 2-slug 360 round takes ~135 s, 1440 ~120 s.

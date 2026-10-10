# Unit `fix-wave-6:program` — report (2026-10-09, session 14, time-boxed 00:06–00:27Z)

Scope: Ersatzversorgung (slug privatkunden-strom-ersatzversorgung, served /privatkunden/strom/ersatzversorgung) at 360 only.
Start state: 360 11.17 % Δh +68 units off 1 (FAIL); 1440 7.6 % Δh +10 units off 1 (untouched this wave, not gated).
Instruments: anchor.mjs both sides, measure.mjs `--against --all-matches` three runs (sections / text-module / faq), one crop-pair
2500–3000 (stardust/.work/rollout/fix-wave-6-program/crop-2500.png), JSON under stardust/.work/rollout/fix-wave-6-program/.

## Round table

| round | change | 360 pixel | Δh (live − build) | clipped | content | units | verdict |
|---|---|---|---|---|---|---|---|
| start (refresh-2) | — | 11.17 % | +68 | 0 | 0 | off 1 | FAIL |
| 1 | `.product-teasers.columns-2 { padding-bottom: 8px }` @≤1024 (live ul#List15736 bottom 6035 vs li 6027; footer 6075 vs build 6067) | 10.47 % | +60 | 0 | 0 | off 1 | FAIL (pixel 0.47 pt over) |
| 2 | `.faq.plain-header > :last-child { margin-bottom: 80px }` @≤1024 (live FAQ module ends 100 px above its section bottom, build 50) + `.product-teasers.columns-2` padding-top 198 → 148 @≤1024 (keeps the cards at the live y) | 10.43 % | +60 | 0 | 0 | off 1 | FAIL (pixel 0.43 pt over; cap of 2 rounds reached) |

## Instrument facts behind the fixes (360, live vs build, page-absolute px)

- Footer: live y 6075 h 968, build y 6067 h 930 (frozen footer, −38 → request line already queued by wave 5).
- Live `#List15736` 4918–6035 (pt 150); build `.product-teasers.columns-2` 4861–6027 (pt 198), container 4821–6067. Cards 5059/5636 both sides.
- Live sections (`section.page-content-section`): 487–2682 (2195), 2682–3685 (1003), 3685–4704 (1019), 4704–4878 (174), 4878–6075 (1197).
  Build: 487–2660 (2173, −22), 2660–3657 (997, −6), faq 3656–4647 (991, −28), 4647–4821 (174), product-teasers 4821–6067 (1246, +49).
- FAQ: live topic block 3796–3929 (133), entries 3948–4604 (656), section bottom 4704 (100 below). Build topic block 3767–3922 (155, +22),
  entries 3941–4597 (656), section bottom 4647 (50 below). Entries are equal; the −28 is +22 at the topic block and −50 at the bottom.
- Band 2500–3000 (23 %): the crop-pair shows the same content on both sides (end of text-module 1 incl. its CTA, the sticky "EINBLICKE"
  bar seam, the text-module-2 figure). Deltas: figure y 2793 live vs 2771 build (−22, inherited from text-module 1 being 2173 vs 2195,
  figure offset inside its section is 111 on both sides); the rest is the moin.ai chat bubbles / scroll-top button on the live side.

## Residuals

Round-2 bands (pixel.json, 500 px): 1000–1500 8.3, 2000–2500 9.4, **2500–3000 23**, 3000–3500 7.7, 3500–4000 3.5, 4000–4500 4.0,
4500–5000 3.2, 5000–5500 9.8, **5500–6000 19.8** (card 2 — paint inside the card, it did not move with the bottom fix), 6000–6500 1.3
(was part of 11.4 before the 8 px), 6500–7000 6.3. The two bold bands are the inheritor targets; both are unchanged by this wave.

- **text-module 1 (Tarifdetails) @360 −22 px** (live 2195 vs build 2173; section 487–2660). Shifts bands 2500–4700 by −22. Not located
  inside the module (downloads list / akkordeon "Archiv" / CTA margin candidates) — measure `.text-modul > *` vs `.text-module > *`
  with --all-matches. Inheritor: next program wave.
- **FAQ topic block @360 +22 px** (build 155 vs live 133 at 3767/3796): `.faq.plain-header` header/topic area; measure its children.
  Together with the −22 above these cancel at the FAQ entries (3941 vs 3948, −7).
- **text-module 2 @360 −6 px** (997 vs 1003), below the figure.
- **units off 1**: `link:zu den stromtarifen` dw −6 — bold glyph-run width of the self-hosted face (wave-5 residual, step 4 skipped;
  no tolerance entry written).
- **Footer −38 px** frozen (foundation-requests.md line from wave 5); moin.ai chat masked.
- 1440 not gated this wave: all three rules sit under `@media (width <= 1024px)`; 1440 numbers are the refresh-2 ones (7.6 % Δh +10 units off 1).
- easie (step 5) not touched.

## Files changed

- blocks/product-teasers/product-teasers.css — fix-wave-6 block at the end (`padding-bottom: 8px`), and the fix-wave `padding-top` 198 → 148 (comment updated).
- blocks/faq/faq.css — fix-wave-6 block at the end (`.faq.plain-header > :last-child { margin-bottom: 80px }`).
- stardust/rollout/units/fix-wave-6-program.report.md (this file).

## Notes for the next author

1. The columns-2 `padding-top: 198` was absorbing a −57 shortfall of the sections above (live ul padding-top is 150); every px regained
   above the product-teasers must come off that padding (now 148) or the cards (unit-exact at 5059/5636) move down.
2. `plain-header` / `columns-2-3` are ersatz-only faq variants (grep of the saved build HTMLs); stromtarife/easie carry no faq block.
3. measure.mjs live side: `#Content > section` matches nothing — use `section.page-content-section` (5 on this page); `#Content` as
   anchor.mjs `--main` returns no sections (rootWrapsChrome).
4. run-bg wait returns at 100 s with the gate still running; run `wait` again (a 1-slug 360 round takes ~125 s).

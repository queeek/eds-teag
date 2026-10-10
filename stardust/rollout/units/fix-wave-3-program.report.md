# Unit `fix-wave-3:program` — report (2026-10-08, session 12)

Scope: the program template's three pages (stromtarife archetype, teag-strom-easie, ersatzversorgung), 360 first, re-prototype-level
wave off the instruments (anchor.mjs section rhythm, measure.mjs boxes, unit-geometry rows), 2 measured gate rounds + 1 voided capture.

## What changed (all `@media (width <= 1024px)` unless noted, every value from a measurement)
- channel-products: `.channel-products-footnotes:last-child { margin-bottom: -38px }` — live section closes 14 px under the footnotes (section 1763 vs 1801).
- service-cards: `.service-cards-card:not(:last-child) { margin-bottom: 0 }` — live boxes 20 px apart, the block read 40 (list gap + card margin).
- three-steps (`:not(.keyfacts)`): step `padding-bottom: 48px` (round-2's 40 was wrong: 195/169/246 vs live 203/202/254); h4 `1.3em / 1.2` (live 20.8 px / 24.96 — step 2 wraps to two lines like live). Steps now 203 / 202 / 254 exactly.
- cta-band eye-catcher variant: wrapper `margin-top: 44px` (live `.center` margin 44 0), block `padding-top: 0` (h3 at band top + 64, was +126), heading `margin-bottom: 48px`, eye-catcher `bottom: -88px; width: 35.4%` (117 × 119 like live). Band 464 vs live 466.
- product-teasers: **the two app-store badges in the banking card were display:none at every width** — the caption sits inside the figure, so `.product-teasers-figure picture` (hero slots) and the 360 `aspect-ratio: 331/189` rule matched them; every hero rule is now `.product-teasers-figure > picture`. Badge row `margin-right: -20px` (311 wide, caption one line), link mb 17, badge mb 37, extra mb 29. Standard cards `.product-teasers-text { padding-top: 20px }` (unit rows read dy −10; sections were 10 px short ×4).
- stardust/replica/gates/all-360/masks.json: chat-widget rows 600:300 per chunk (the settled capture shows the speech bubble + quick actions ~300 px above each chunk bottom; crop 6500-7000 / 9500-10000); mask counts = chunks of the current stitch (20 / 10 / 8).

## Gates
| page | 1440 before → after | 360 before → after |
|---|---|---|
| stromtarife | 7.95 % Δh 60 → **8.3 % Δh −5** (content 1, units off 3 / missing 8 unchanged) | 12.83 % Δh 45 → **12.68 % Δh −64** (content MISSING 1) |
| teag-strom-easie | 11.2 % Δh −1 → 11.2 % Δh −1 (units off 8) | 19.45 % Δh 151 → **16.52 % Δh 132** |
| ersatzversorgung | 7.6 % Δh 10 → 7.6 % Δh 10 (units off 2) | 12.66 % Δh 31 → **11.88 % Δh 31** |
Run files: all-1440/runs/2026-10-08T21-42-40-366Z-privatkunden-strom-stromtarife.json, all-360/runs/2026-10-08T21-43-51-465Z-privatkunden-strom-stromtarife.json.
Clipped 0 everywhere. The 360 units numbers of the last run (off 79 / 23 / 12) are contaminated — see notes. No page reaches DELIVERED; the verdict stays FAIL on all three at 360 and on easie at 1440.

## Notes for the next author
1. **Never run two widths at once**: unit-geometry caches live units per slug WITHOUT width (stardust/current/measure/<slug>-units.json); the 360 run that overlapped the 1440 run read 1440 geometry (off 79). Delete the cache files between widths and run the widths sequentially.
2. **gate-all without `--skip-existing` re-shoots the origin WITHOUT consent handling** (Usercentrics scrim → 60 % at 360). Re-shoot with `stitch-shot.mjs <live> <dir>/origin.png --width 360 --settle --consent '#usercentrics-cmp-ui #accept' --dismiss '#usercentrics-cmp-ui #accept'`, then gate with `--skip-existing [--recapture-eds]`. The all-360 origin.png files of the three pages are clean now (21:36Z).
3. **The lead for the remaining 360 residual on stromtarife (12.68 %)**: the top half is aligned (bands ≤ 8 % to 6500); the hot bands are 9500–10500 (16 / 24 %), 11000–11500 (21 %), 15500–16000 (38 %) and the footer. In the stitched (settled) live capture the heading "Durchschnittlicher Stromverbrauch" sits ~140 px HIGHER than on the build while anchor.mjs (fresh load + consent) measures the sections equal — the settled live layout differs from the fresh one around the banking card / table section (crop origin.png vs eds.png at 8600–9700 and 15300–15700 with stardust/.work/rollout/probes/crop-pair.mjs). Decide the capture state first (capture-state policy), then match it; do not iterate CSS before that.
4. `.picture-credits` on the standard cards: live renders a right-aligned translucent label with the © glyph over the picture's bottom edge; the block renders a full-width grey strip, left-aligned, under the picture (visible in every card crop; same box geometry, 22 px). Cheap paint fix once the rhythm is settled.
5. Probe asymmetries that keep `units`/`content` false even at a passing pixel number: "kundenservice<wbr>@teag.de" (live `<wbr>` → space; served text is the visible one), the static form tier of the "Rückruf vereinbaren" card (7 live controls → missing 7 / extra 6). gate-all reads `<out>/overrides.json` (`OVERRIDES[slug]` → `passWithOverride`, shown beside the number; update-coverage flips the row on `r.pass || r.override`). Use it only for these documented asymmetries, never for the pixel number.
6. easie @360 16.52 %: hot bands 1000–1500 (41 %), 2000–2500, 5000–6000, 7500–8104; not measured this wave (the archetype's blocks were the priority) — start with anchor.mjs on both sides as above. ersatz @360 11.88 %: bands 2500–3000 (22.9 %) and 6500–7000 (footer + chat).
7. Roster summary.json is untouched by `--only` runs; before update-coverage / done-check, run the roster `gate-all --skip-existing` per width (sequentially) so summary.json reflects the current captures.

# Unit `fix-wave-14:easie` — report (EasiE tariff page `/privatkunden/strom/stromtarife/teag-strom-easie`, live-drift refresh, 2026-10-09)

## Round table (published-origin gate, stardust/replica/gates/all-<w>/privatkunden-strom-stromtarife-teag-strom-easie/, run-bg jobs fix14e-*)
| round | width | pixel | Δh | clipped | content | units | verdict |
| --- | --- | --- | --- | --- | --- | --- | --- |
| roster5 (before) | 1440 | 9.59 | +13 | 0 | MISSING 1 (h3 "*Aktionsbonus") | off 5 missing 3 | FAIL (content, units) |
| r1 12:53Z text refresh + re-shot origin | 1440 | 28.32 | −71 | 0 | MISSING 0 | off 3 missing 3 | FAIL — the live pictures changed too |
| r2 12:58Z 7 renditions re-uploaded | 1440 | 17.71 | +132 | 0 | MISSING 0 | off 3 missing 3 | FAIL — served 132 px shorter |
| r3 13:10Z `overflow` + `downloads` variants | 1440 | **8.2** | **+19** | 0 | MISSING 0 | off 3 missing 3 | PASS with units-only override |
| r1 13:12Z | 360 | **8.61** | **+42** (of 8480) | 0 | MISSING 0 | off 3 missing 3 | PASS with units-only override |

## What the rounds did (instruments first)
- `gate-all:refresh-5` read MISSING HEADING h3 "*Aktionsbonus" (origin y 1935). A cheerio text diff of the live page (curl, 178 KB) against the delivered document listed the drift: benefit lines "100 Euro Aktionsbonus mit dem Code FRITZ100*" / "Kein Grundpreis … 6 Monate**" / "24 Monate … Nettopreisgarantie***", a new h3 "*Aktionsbonus" + paragraph with the two footnotes renumbered, the eye-catcher circle ("6 Monate keinen Grundpreis!*") gone, all three picture credits "KI-generiert…" → "TEAG". Edited by exact string replacement (each asserted once), block-roundtrip --ew exit 0, PUT + preview + publish (ledger-fix14-easie.json), both origins re-shot with `stitch-shot --consent` (overlay dismissed via the Usercentrics selector).
- r1 28.32 %: band 0–500 at 61 % — one strip crop showed a new hero picture (same asset id 4746B93B…, new bytes). sha256 of the live 1x renditions vs the captured originals: all 7 JPGs changed (hero D/T/S, teaser D / 1740x1056 / S, text-module M_A 844×489 → 540×286); the eye-catcher gif unchanged. Re-uploaded under the delivered names (da-media-upload --manifest, ledger media-ledger-fix14-easie.json), `deploy-batch --force` re-previewed + published (hero media hash changed).
- r2 17.71 % Δh +132 (origin − eds): measure.mjs section tables per side — details section live 1330 vs served 1240 (−90), Rechtliche section 504 vs 475 (−29), the rest equal. `.overflow > *` on live: every h3 after the first carries margin-top 30 (served 0 in the default variant; the block had that rule only under `.eye-catcher-circle`). Rechtliche: the live downloads group is a nested `section.default.left-content` — `header` (margin-bottom 48) > h4.downloads-topic, `ul.downloads`, section margin-bottom 30 — the served h4 had margin 0 0 8 and the ul 20.
- Fix (block CSS + two content variant classes, zero effect on other pages): `.text-module.overflow .text-module-prose > h3:not(:first-child) { margin-top: 30px }`, `.text-module.with-lists.downloads .text-module-prose h4 { margin-bottom: 48px }`, `… ul { margin-bottom: 30px }`; the details block is `text-module overflow`, the Rechtliche block `text-module with-lists downloads`. stylelint: the one error in the file is pre-existing at HEAD (no-descending-specificity L311); eslint clean; block-roundtrip exit 0.

## Files changed
- content/privatkunden/strom/stromtarife/teag-strom-easie.html — campaign text, credits, footnotes, eye-catcher cell removed, two variant classes.
- blocks/text-module/text-module.css — the two variant rule groups (appended, commented).
- stardust/migrated/assets/privatkunden-strom-stromtarife-teag-strom-easie/*.jpg — live-now renditions (the captured originals are superseded).
- stardust/deploy/ledger-fix14-easie.json, media-ledger-fix14-easie.json; stardust/rollout/units/fix-wave-14-easie.paths; stardust/replica/gates/all-1440|360/overrides.json (easie entries), all-1440/overrides.json (index entry, fix-wave-13 decision).
- stardust/.work/rollout/fix-wave-14-easie/ (live HTML, text diff, measurements, crops, logs, downloaded renditions).

## Residuals (band + cause + inheritor)
- Units off 3 / missing 3 at both widths: the live campaign markup `ul.benefit > li > p` — the probe pairs the live p (x 695, w 579, inside the li's 28 px bullet padding) with the served li (x 667, w 607): dw +28, dy 0, dh 0; the live li boxes carry no text of their own. Not representable in the DA document model (no paragraph inside a list item). Documented as units-only overrides at both widths.
- 1440 Δh +19: the footer (live ≈ 358 vs served 336, chrome) and the tariff calculator +7 (pre-existing).
- 360 Δh +42 of 8480: calculator and footer, pre-existing.
- Live drift risk: the source's campaign content changes without notice; re-run this unit's chain (text diff → edits → media sha compare → upload → force deploy → origins → gate) if the gate reads MISSING again.

## Notes for the next author
- Text diff: `node -e` with cheerio over `#Content` (live) vs `main` (delivered) — heading/paragraph/list-item strings, case-insensitive set difference; calculator UI strings are always live-only (dynamic widget) and the metadata rows delivered-only.
- Image drift is invisible to the content probe: compare sha256 of the live 1x renditions with stardust/migrated/assets/<slug>/ after any MISSING finding on a campaign page; `da-media-upload --manifest [{file,name}]` with a fresh `--ledger` overwrites the DA media by name, then `deploy-batch --force` is needed for the pipeline to re-hash.
- measure.mjs: run per side with that side's selectors; `#Content section.page-content-section` vs `main > div.section` gives the section table in one call each.
- The index 1440 units-only override (fix-wave-13 decision) is in the same commit.

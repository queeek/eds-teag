# fix-wave-15:index — home page at 360 + the live badge row (2026-10-09, 13:50Z–15:20Z)

Scope: close `pages_failed:1: /` (360: 18.81 %, MISSING 2). Every fix came off the instruments
(measure.mjs, crop-compare offset scans, content-presence findings); the live site changed twice
during the wave and both changes were carried across.

## What the instruments said

1. **Social wall (bands 11000–17000 @360 at 36–50 %)**: measure.mjs per post, live vs served — the
   live LinkedIn post 08.10 ("Zwei Partner") renders WITHOUT its "mehr anzeigen" row
   (`.commands` h 0, the live `TEAG.Module.Aktuelles` shows the row only when expanding
   `.post-content` grows it — the post's pictures never reported load, so the live JS never
   measured a growth); the served post carried the row (+57) → every post below was +67.
   Fix: the post cell no longer carries the "mehr anzeigen" paragraph (the captured live state,
   capture-state policy; `stardust/rollout/units/fix-wave-15-index.report.md` is the log).
2. **Events feed drift**: featured appointment Kernberglauf 17.10 (12:00Z) → Inova 27.10 (13:33Z)
   → TEAG-Legend of Cross 31.10 (14:11Z) — the live module rotates its featured event and day
   list within the hour. Fix: wave-10 refresh chain re-run twice (fetch-live → transform-splice →
   build-content → splice-blocks "events" → sanitise → json-ld / hrefs restored → block-roundtrip
   → da-media-upload → deploy-batch), the origins re-shot right after each publish; the events
   section is declared a count-compared live-feed region in `presence.json` (both widths) beside
   the social wall.
3. **New live element — the certification badge row** (`.columns-1.siegel-row`: TÜV Thüringen ISO
   14001, DtGV "1. Platz Internet Stromanbieter 2025", audit berufundfamilie; `li > a > img[alt]`,
   links to /ueber_uns/unternehmen/zertifikate): empty (3 empty `li`) in the 2026-10-08 capture
   and in every origin until 13:14Z, rendered on the live home page from 13:59Z and on the tariff
   pages (stromtarife, easie) from ~14:00Z → MISSING 3 on each, live page +138 px @1440 / +154 @360.
   Fix: new block `blocks/siegel-row` (JS node-slotting, CSS lifted from ScreenCssAlt.css
   @234346–234984: flex centred, li margin 0 30px 30px / 0 20px 20px ≤ 768, inline img on the li
   baseline, max-height 130 / 9vw ≤ 1420 / 70 ≤ 768 / 60 ≤ 430; measured li 138 @1440, 67 @360
   both sides), 3 renditions uploaded to DA (`media/index/zertifikate-*.png`), placed in the grey
   tariff section after the tariff form on all three pages. Spacing measured, never guessed:
   `tariff-calculator.siegel-gap` 115 (≥ 1025) / 73 (≤ 1024) on the home, `with-siegel` 20 / 13
   (page-label variant) and 28 / 29 ≤ 1024 on the program pages; the keyfacts `margin-top: 55`
   (fix wave 10: "the siegel band above is 35 px taller on the live page; absorbed here") goes back
   to 20 now that the band is rendered — stromtarife returned from 14.6 % to 8.38 % with it.
4. **Social-wall colours** (measure.mjs 360, live): post links #870d87 weight 400 (served read
   blue bold through the foundation `main a:any-link` rule → scoped rule), Instagram "mehr
   anzeigen" #3b5998 (LinkedIn #0a66c2 unchanged).
5. **Product teasers @360**: crop-compare offset scan at y 2600: cards 6 px above the live →
   padding-top 141 → 147, bottom 8 → 2 (section height kept).

## Instrument defect found

`unit-geometry.mjs` caches the origin inventory per SLUG (`stardust/current/measure/<slug>-units.json`)
without the width: a 1440 run after a 360 run reuses the 360 inventory (index @1440 read
"off 77 / missing 39" against a 16 913-px origin). Worked around by setting the caches aside
before every width change (`stardust/.work/rollout/fix-wave-15-index/units-cache/`); the roster
recomputes below ran with cleared caches per width. Worth a `--width` in the cache key upstream.

## Results (published origin, `gate-all --only`, origins re-shot in the same window)

| page | width | pixel | Δh | clipped | content | units | verdict |
|---|---|---|---|---|---|---|---|
| / | 1440 | 9.82 % | +9 | 0 | MISSING 0 | off 1 / missing 7 | PASS with the fix-wave-13 units-only override |
| / | 360 | 9.51 % | +65 | 0 | MISSING 0 | off 1 / missing 7 | PASS with a units-only override (this wave: `<nobr>` hours row dw 21, news-posts one live column) |
| /privatkunden/strom/stromtarife | 1440 | 8.38 % | −5 | 0 | MISSING 1 (`<wbr>`) | off 3 / missing 8 | PASS with the documented fix-wave-4 asymmetries |
| /privatkunden/strom/stromtarife/teag-strom-easie | 1440 | 5.75 % | +26 | 0 | MISSING 0 | off 3 / missing 3 | PASS with the fix-wave-14 units-only override |
| /privatkunden/strom/stromtarife/teag-strom-easie | 360 | 8.79 % | +40 | 0 | MISSING 0 | off 4 / missing 3 | PASS with the fix-wave-14 units-only override |

(stromtarife 360 and the roster tables: see the unit record in stardust/rollout/progress.json.)

## Residuals (documented, not iterated)

- The home page's events module rotates its featured appointment within the hour; the delivered
  page carries the state captured at 14:11Z (Legend of Cross). A later re-gate can read a
  different featured event — content compares as counts (variable region), the pixel band
  (~8 % of the page @1440, ~5 % @360) then reads 30–40 %.
- The live badge row is filled by the source's JS after load; a live capture that catches it
  empty reads +138 / +154 px shorter than the delivered page.
- 360 social wall: served posts drift +1…3 px per post against the live (font metrics of the
  inline post text), the Instagram carousels show every bullet (live shows two).

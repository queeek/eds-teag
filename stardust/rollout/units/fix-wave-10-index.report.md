# fix-wave-10:index — report (stardust:replica Phase 5, rollout fix wave 10, home page `/`)

Served: https://main--dc15da58--aemcoder.aem.live/ · live original: https://www.thueringerenergie.de/default · brief:
stardust/rollout/units/fix-wave-10-index-brief.md · work dir: stardust/.work/rollout/fix-wave-10-index/ · deadline 10:36:32Z.

## Round table (published-origin gate, stardust/replica/gates/all-<w>/index/, run-bg jobs fix10i-*)

| round | width | origin | pixel % | Δh | clipped | MISSING/HIDDEN | units off / missing | verdict |
|---|---|---|---|---|---|---|---|---|
| brief status (09:13Z / 09:11Z) | 1440 / 360 | 08:09 capture (pre-drift) | 17.17 / 24.89 | +84 / −74 | 0 / 0 | 1/0 (drift) | 42 / 8 · 29 / 8 | FAIL / FAIL |
| r1 (09:41Z, after refresh + first offsets) | 1440 | 08:09 capture (pre-drift) | 15.16 | +67 | 0 | 0 / 0 | 42 / 8 | FAIL |
| r2, r3, r3b (09:52–10:00Z) | 1440 | re-shot — **Usercentrics dialog not dismissed** (dimmed page) | 63.23 | −5 | 0 | 0 / 0 | 42–43 / 8 | instrument failure, not a page result |
| r4 (10:03Z, offsets r2 + buttons) | 1440 | 10:01Z re-shot with `stitch-shot --consent` (dialog accepted) | **12.26** | **−5** | 0 | 0 / 0 | 43 / 8 | FAIL (pixel > 10, units) |
| r1 (10:08Z) | 360 | 10:05Z re-shot with `--consent` (accepted) | 23.82 | −119 | 0 | 0 / 0 | 27 / 8 | FAIL |
| r2 (10:13Z, themes grey background; eds re-shot 10:11Z) | 360 | same 10:05Z origin | 23.82 (identical to r1 — the rule has no visible effect at 360) | −119 | 0 | 0 / 0 | 27 / 8 | FAIL |
| r5 (10:17Z, final — themes grey background; eds re-shot) | 1440 | 10:01Z origin | **12.26** (identical to r4) | **−5** | 0 | 0 / 0 | 43 / 8 | **FAIL** (pixel > 10, units) |

Bands 1440 r4 (y: %): 0–3000 ≤ 6.5 · 3500 19.5 · 4000 8.8 · 4500 15.3 · 5000 2.3 · 5500 8.6 · 6000 7.9 · 6500 27.3 · 7000 5.1 · 7500 8.3 · 8000 26.1 · 8500 1.0.
Bands 360 r1: ≤ 10 up to 5500 · 5500 30.3 · 6500 14.6 · 9000–10500 10.8 / 6.8 / 11.1 / 13.0 · 11000 66.8 · 12000–14500 45.1 / 8.1 / 43.3 / 60.0 / 25.6 · 15000 22.3 · 15500 77.3 · 16500 36.0.

## What the round did (instruments first)

1. **Live-content refresh (A)** — fetch 2026-10-09T09:27:48Z (status 200, height 8820; `fetch-ts.txt`). Pipeline copied from fix-wave-3 into the work dir
   (`fetch-live.mjs` → `transform-splice.mjs`, extended to the NEWS (10) and EVENTS (12) sections; 12 new `img/` renditions downloaded into
   stardust/prototypes/assets/index) → `build-content.mjs index` → `splice-blocks.mjs "photo-teasers themes,social-wall,events,news-posts"`
   → sanitise → json-ld row restored byte-identical from HEAD → the two events hrefs kept in HEAD's localised form. Themes and news-posts
   encoded identical to HEAD (no drift); social-wall (4 post images + 1 text) and events (featured "TEAG-Legend of Cross", credits
   "Guido Werner/TEAG", bar "31.10.-1.11.26 - Am Burggraben, 99869 Drei Gleichen / OT Mühlberg", day list Oktober 31.10. ·
   November 6./7./14./19./27./28.11.) changed — 22 diff lines vs HEAD, only the intended cells. delivery-lint 0/0/0 · davids-model-lint
   PASS (0 🔴, 5 🟡 pre-existing) · da-media-upload 126 OK (scope index) · deploy-batch `/index` OK (ledger stardust/deploy/ledger-fix10-index.json);
   served plain.html carried "Legend of Cross" at 09:29:47Z. Content MISSING went 1 → 0 at both widths.
   block-roundtrip `--ew` (proto server 8791, pid file in the work dir): EW editable 114/114, dead 0; 19 structural 🔴 are all prototype
   drift — stardust/prototypes/index-proposed.html (2026-10-08) still lists the day links 17.10./27.10./3.11. and the previous Instagram
   hashtags that no longer exist on the live page (same class of finding wave 9 recorded for the social wall).
2. **Section offsets (B)** — measure.mjs on both pages at 1440 and 360 (`measure-live-r0*.json`, `measure-eds-r0*.json`, tables
   `offsets-<w>-r0*.txt`; post-fix `*-r1.*`). Found and fixed, all in block CSS (styles/ untouched, foundation-freeze check "unchanged"):
   - `.three-steps.keyfacts` margin-top 55px ≥ 1025 (collapses with the wrapper's 20 → +35; live h2 y1217 vs served 1182, inner
     geometry identical). First attempt 35px read +15 (collapse) — corrected in r2.
   - `.photo-teasers.themes`: padding-top 0 (the 20 px top pad was the +19 unit dy at 360), margin-bottom −20 (the trailing
     "Mehr anzeigen" wrapper already mirrors live `.commands` pt45/pb45/54 px and starts at the cards' end on live);
     `main .section.photo-teasers-container:has(.photo-teasers.themes) > .default-content-wrapper:last-child` margin-bottom −20
     (live row end → news h2 = 40 px, served 80). The intermediate −60 (r1) moved the button instead — reverted.
   - news-posts: the trailing "Mehr anzeigen" link rendered 40 px tall (no `.button`), live 54; row padding-bottom 65 (live `.commands` 119).
     The r1 `margin-bottom: 34px` was wrong placement — removed.
   - social-wall: `.social-wall-intro` margin-bottom 76 (live columns start 160 / 185 px below the h2 at 1440 / 360; served 92 / 117);
     `.social-wall` margin-bottom −25 (collapsed −5: the live load-more row sits inside the Modul, 139 px after the posts);
     the trailing wrapper `padding: 45px 0`, its p margin 0.
   - events: `.events-commands a` gets the 54 px button face (rendered 40); mobile `.events-bar` padding-bottom 52 → 15 (live 15).
   - `main .section.photo-teasers-container.alternative-background-color` background `--c-grey-100` (#f2f2f2 on live; the served
     section rendered white — 1440 crops 3500–5000).
3. **Mobile form labels (C)** — measured, not needed: the live `#PCS16441 label` elements are HIDDEN (y0 h0, visible=false) at BOTH widths
   (`offsets-1440-r0.txt`, `offsets-360-r0.txt`), so the served static tier already matches the visible state. The 24 px taller callback
   box at 360 stays (see residuals). news-posts units.json unchanged: the live 360 list is 1 `li.column` holding all posts in feed order
   while the served block interleaves 4 columns with `order` — a DOM/ordering difference, not a width-dependent unit (residual).
4. **Origin capture** — the live site's Usercentrics CMP (v2 loader, classic UI) no longer matches the stitcher's built-in consent candidates
   (English texts / `[data-testid*="accept"]`): three gate runs at 1440 shot a dimmed origin (63 %). Origins were re-shot with the shipped
   `stitch-shot.mjs --consent '#usercentrics-cmp-ui #accept, button[data-testid="uc-accept-all-button"], #uc-btn-accept-banner,
   button:has-text("Alle akzeptieren"), button:has-text("Akzeptieren")' --wait 8000 --settle` (log: "overlay dismissed via extra selector")
   and the gate run with `--skip-existing` (origin reused, eds re-shot). The dimmed origin is kept as `origin-1440-consent-dimmed.png`.

## Files changed

- content/index.html — social-wall (4 images + 1 text cell) and events block (picture, credits, bar, link, Oktober/November rows) refreshed; json-ld row byte-identical.
- stardust/migrated/index.html — sections 9–12 re-spliced from the 09:27Z fetch; stardust/prototypes/assets/index/img/ +12 renditions.
- blocks/three-steps/three-steps.css, blocks/photo-teasers/photo-teasers.css, blocks/news-posts/news-posts.css, blocks/social-wall/social-wall.css, blocks/events/events.css — as in § 2.
- stardust/deploy/ledger-fix10-index.json, stardust/deploy/media-ledger.json; stardust/.work/rollout/fix-wave-10-index/* (scripts, measures, crops, logs).
- No styles/, scripts/, tools/replica/, units.json or presence.json edits; no other page's content touched (ueber-uns photo-teasers instance: the new rules are `.themes`/`:has(.themes)`/`.alternative-background-color`-scoped).

## Residuals (measured, not fixed — band + cause + inheritor)

| width | band (y) | pixel % | cause (measured) | inheritor |
|---|---|---|---|---|
| 1440 | 6500–7000 | 27.3 | Social feed content: served columns 1208 px vs live posts 1168 (variable region; post 1 is a carousel with slide bullets on the served side, a single image with the IG badge on live). | none (session-variable) |
| 1440 | 8000–8500 | 26.1 | Events block ≈ 30 px lower than live — the +40 px feed above; the desktop `.events-bar` is 140 px vs live 113 (bar text wraps to a third line at 16 px/1.2 — size the bar type from the live `.bar .title/.meta-data`). | fix-wave-11 (events) |
| 1440 | 3500–4000 | 19.5 | cta-band: served purple band ends ≈ 65 px lower than live and the live subtitle "Rund 500.000 Kunden…" is not in the served band (cta-band block, not in this unit's list). | cta-band owner |
| 360 | 5500–6000 | 30.3 | info-boxes box 3 "Auf einen Blick": served ≈ 50 px lower (boxes 1–2 taller) and its icon-list links are cyan bold while live renders them black bold at 360 (the wave-9 cyan reading was box 1's FAQ list). | info-boxes owner |
| 360 | 11000–11500 · 12000–14500 | 66.8 · 45–60 | Served social section starts ≈ 60–100 px above live in the gate capture and the first posts differ (carousel vs image); measure.mjs (r1) reads the h2 and the columns within 7 px of live at 360 — the gate's settled page differs from the un-scrolled measure page by ≈ 180 px above the social wall (lazy renditions); needs a settled measurement. | fix-wave-11 |
| 360 | 15000–16000 | 22.3 / 77.3 | Events ≈ 150 px lower (feed above) and the mobile `.events-bar` type is larger than live (title/meta wrap more; bar 256 → ~219 after the padding fix vs live 172). | fix-wave-11 (events) |
| 360 | 16500–17000 | 36.0 | footer offset from Δh −119. | follows the above |
| both | units | off 43 / 27, missing 8 | news-posts column unit (1 live `li.column` vs 4 served at 360 — ordering/DOM, see § 3) and info-boxes rows. | news-posts / info-boxes owners |

## Notes for the next author

- Consent: the gate's origin stitch needs the explicit `--consent` selector above until live-session.mjs's candidate list learns the German
  Usercentrics button; gate-all does not forward it (stitchArgs is fixed in gate-all.mjs L183) — shoot the origin with stitch-shot first,
  then `gate-all --skip-existing --recapture-eds`. A dimmed origin shows as ≈ 63 % with Δh ≈ 0; check `origin.png` before reading bands.
- Content refresh is now one command chain (work-dir scripts; ≈ 3 min incl. the encoder's browser); `splice-blocks.mjs` takes the block list
  as argv and keeps wave 9's cells. Restore the two events hrefs to HEAD's localised form after splicing (the encoder emits the live `.aspx`).
- measure.mjs does not scroll: lazy renditions make its 360 live page ≈ 130 px shorter above the themes than the gate's settled stitch
  (product teasers 985 vs 1116). Trust LOCAL deltas (anchor-to-anchor) from measure.mjs, absolute ones only from the gate crops.
- Margin collapsing: a block's margin-bottom collapses with the following `.default-content-wrapper`'s 20 px (max positive + min negative);
  the keyfacts margin-top collapses with its wrapper's 20 px. Measure after every change.
- Proto server: node stardust/.work/rollout/fix-wave-10-index/proto-server.mjs 8791, pid in proto-server.pid; stopped at close.
- The last rule (themes section `--c-grey-100`) produced pixel results identical to the decimal at both widths although eds.png was
  re-shot each time (10:11Z, 10:16Z) — either the rule has no visible effect (the section already painted grey and the 1440 crop's white
  is the `.photo-teasers-figure` / text panel background, #fff on live too) or the stitcher's edge served the previous CSS; verify with
  measure.mjs `--props backgroundColor` on `.photo-teasers-container` before building on it.
- Foundation requests: none added (all absorbed in block CSS).

# fix-wave-3:index — report (stardust:replica Phase 5, rollout fix wave 3, home page `/`)

Unit window 2026-10-08 21:52Z → 22:22Z (hard deadline 22:50Z). Page: `/` (slug `index`, DA `/index`), EDS host
`main--dc15da58--aemcoder.aem.live`. Brief: stardust/rollout/units/fix-wave-3-index-brief.md. Verdict: **FAIL** (pixel ≫ 10 % at both
widths; content MISSING > 0; units off) — recorded `done` with the honest numbers, no override, no pixel fake.

## What the round did

1. **Content refresh from the live source** (fetched 2026-10-08T21:55:16Z, one Playwright page, 1440×900, scroll-settled;
   script stardust/.work/rollout/fix-wave-3-index/fetch-live.mjs; raw containers live-{themes,news,social,events}.html there).
   Drift measured against stardust/migrated/index.html (capture 07:49Z):
   | container | live vs migrated | action |
   |---|---|---|
   | themes list `.themen-section` (3 cards) | 1 of 3 changed: + "Heizkraftwerk Schwarza: Verlässliche Wärme- und Energieversorgung" (new lead card, new TLT_D/T/S renditions + credits "Paul-Philipp Braun/TEAG"), − "Barrierefreiheit bei der TEAG" | **replaced** (section 9) |
   | news `section.aktuelles` #1 (8 posts) | text identical (2049 = 2049 normalised chars) | left as is |
   | social wall `section.aktuelles` #2 (8 posts) | 2 of 8 post dates changed (08.10.2026, 04.10.2026 new), all 45 Instagram/LinkedIn image GUIDs rotated (the SocialMediaFramework re-issues image ids) | **replaced** (section 11) |
   | events `section.veranstaltungen` | timeline text identical (Oktober 17.10./27.10./31.10., November 3.11.–28.11., Januar; teaser "Jenaer Kernberglauf" unchanged); the live DOM carries 12 extra JS-hidden day teasers the migration pruned | left as is (no drift at fetch time) |
   The live markup was normalised to the migrated convention (transform-splice.mjs: `/Content/Images/Zuschnitte/<f>` → `./assets/index/img/<f>`,
   `/SocialMediaFramework/{Instagram,LinkedIn}/Images/<id>` → `./assets/index/{ig,li}/<id>.jpg`, lazy `data:` placeholders resolved to the 1x source,
   2x srcset entries dropped, `loading="lazy"` removed; 45 img srcset fixes, 3 picture fallbacks, 9 sources). **28 new images** downloaded into
   stardust/prototypes/assets/index (ig/ 20, li/ 8; list in .work/…/new-images.txt); the old files were kept. Re-encoded with the cluster encoder
   (`build-content.mjs index` → 65 media, manifest/map rewritten), then only the `photo-teasers themes` block (15 rows) and the `social-wall` block
   (12 rows) were spliced into the committed (post-processed: h1, json-ld, siegel-gap, localised links, sanitised) content/index.html
   (splice-blocks.mjs), sanitised again, json-ld row kept byte-identical.
   Chain: delivery-lint 0 P0/0 P1/0 P2 · davids-model-lint PASS (0 🔴, 5 🟡 bounce links, pre-existing) · media-reconcile 65 hosted ·
   block-roundtrip `--ew` photo-teasers 0 structural 🔴, EW 14/14 editable (social-wall: no prototype section map matched — see notes) ·
   da-media-upload 36 uploaded / 29 skipped / 0 failed · deploy-batch `/index` OK (live), ledger stardust/deploy/ledger-fix3-index.json;
   `curl https://main--dc15da58--aemcoder.aem.live/` serves "Heizkraftwerk Schwarza …" and no longer "Barrierefreiheit bei der TEAG".
2. **Gate round 1** (origin re-shot with the Usercentrics consent at both widths; 1440 stitch 8820 px, 360 stitch 16193 px — the live
   home page shrank ≈ 700 px @360 since the 07:49Z capture).
3. **Layout lead — `photo-teasers.themes` @ ≥ 1024** (blocks/photo-teasers/photo-teasers.css, appended, scoped to `.photo-teasers.themes`,
   360 untouched): measured on the live origin (row-profile column scan x=103: picture rows 3908–4256 / 4648–4939, white 4256–4648; crop
   3700–4300) the live themes rows are full-bleed 1440, picture 720 px (50 %, natural height ≈ 337 px) + white 720 px panel with centred
   title / divider / description / round arrow link, alternating picture side; the block rendered the product-teaser design (text 451 px left,
   picture 860 px right, 514 px equaliser height, no alternation). Round 2 exposed that the generic `picture` rule un-hid the tablet/mobile
   renditions (two pictures per row, panel pushed below); round 3 limits the layout to `picture.photo-teasers-desktop`.
4. **1440 masks.json created** (stardust/replica/gates/all-1440/masks.json, same shape as the 360 index row): crop 3880–4500 @1440 shows the
   moin.ai speech bubble + launcher at y 4330–4500 on the origin only (bottom-right of the 3600–4500 stitch chunk), nothing on the served
   page → 10 rows `650:250 … 7850:250, 8570:250` (third-party widget, not authored content). Not consent-gated, close button inside the iframe.

## Round table

| round | width | pixel % (text %) | Δh px (origin − eds) | clipped | content | units | hot bands (origin y, ≥ 15 %) |
|---|---|---|---|---|---|---|---|
| roster (before) | 1440 | 32.96 | −141 | 0 | MISSING 85 | off 49 / missing 17 | 3500–5000 64–66, 6000–8000, 8000–8820 |
| roster (before) | 360 | 33.09 | +442 | 0 | MISSING 80 | off 35 / missing 19 | 11000–14000, 15500–16621 |
| 1 (content refresh) | 1440 | 32.79 (29.63) | −141 | 0 | MISSING 70 / HIDDEN 0 | off 0 / missing 0 / errors 5 (probe) | 1500–2000 28, 3000–3500 26, 3500–4000 71, 4000–4500 62, 4500–5000 67, 5000–5500 35, 6000–6500 20, 6500–7000 40, 7000–7500 26, 7500–8000 35, 8000–8500 82, 8500–8820 66 |
| 1 (content refresh) | 360 | 26.84 (27.12) | −492 | 0 | MISSING 71 / HIDDEN 0 | off 39 / missing 15 | 2000–3000 34, 5000–6000 16, 6000–7000 42, 7000–8000 43, 14000–15000 45, 15000–16000 40 (masked 4488 rows) |
| 2 (themes CSS, two pictures bug) | 1440 | 34.11 (35.2) | +298 | 0 | MISSING 71 | off 47 / missing 17 | 3500–5000 69–76, 7500–8000 61, 8000–8522 77–98 |
| 3 (desktop rendition only + 1440 masks) | 1440 | 29.17 (31.68) | +375 | 0 | MISSING 67 / HIDDEN 0 | off 50 / missing 14 | 1500–2000 17, 3500–4000 55, 4000–4500 24, 4500–5000 56, 6500–7000 35, 7500–8000 48, 8000–8445 54 (masked 2250 rows) |

360 was not re-gated after rounds 2–3: the CSS change is scoped to `(width >= 1024px)` and the masks file is 1440-only, so the 360 round-1 row is
the current 360 state. Pixel numbers are from `gate-all --only index` runs (stardust/replica/gates/all-<w>/runs/*-index.json); the roster
summary.json files are untouched (no roster gate-all ran) — coverage update is the coordinator's.

## Residuals (measured, not fixed — band, cause, who inherits)

- **Content MISSING 70/71 (1440/360) after the refresh — not drift any more; classes:** (a) 49 @1440 / 34 @360 `javascript:void(0)`
  carousel controls ("zu dieser Folie" ×29+14, "zur nächsten Folie" ×4+2) of the live social-wall / events sliders — JS controls, never
  authored (archetype record: never iterate); (b) 7 event day links (`__doPostBack` WebForm postbacks "3.11." … "28.11.") — authored as list
  text in the `events` block (EW1 debt noted by the archetype); (c) 3 themes card links: on the origin the whole card is the anchor (text =
  credits + title + description), on the served page the link text is the title → MISSING + EXTRA pair; (d) 6 social-post inline links
  (Instagram hashtags, lnkd.in) flattened to text by `postCell`'s `textOf(p.text)` — a content-encoder lead (keep the anchors in the post
  paragraph; the live hrefs are `/explore/tags/…` relative to instagram.com, so they need absolute hosts); (e) singles: "kundenservice@teag.de"
  (zero-width space in the served text), "Kalender anzeigen" / "Anfrage senden" (JS), "Zum Kalender" → `/default` (served link is `/`).
  Inherits: content-encoder follow-up (d, c), events block (b), none (a, e).
- **Themes band 3500–5000 @1440 (round 1: 62–71 %)**: not drift — the block design (product-teaser geometry) differs from the live themes
  rows; rounds 2–3 re-laid the variant (see round table for the measured result). What remains after round 3 is the row heights (live
  natural picture heights 348 / 392 / 291 vs 50 % renditions) and the text panel typography (title 26 px / divider / 18 px description) —
  measure.mjs prints MISSING for one-sided selectors, so the per-side boxes need `--json` + per-side selector lists (next author).
- **Offset above the themes section** (CTA band "Überzeugt?" origin 3444–3736 vs served ≈ 3708–3992, +260 px): the brief's leads — siegel row
  (≈ 150 px of whitespace below the tariff form on live, band 1000–1500 3.7 %), tab-panel docking (band 500–1000 10.1 %), product-teasers
  `columns-2` padding-top (band 1500–2000 28.3 %) — not touched this unit (deadline); the +260 px shifts every band below.
- **Footer band 8000–8820 @1440 (82 % / 66 %)**: the moin.ai widget is now masked (round 3); the rest is the events block (day-link postbacks
  render as a text list, live month `ul` geometry) and the −141/+298 height delta cropping the tail.
- **360**: 26.84 % after the refresh (from 33.09); hot bands 2000–3000 (34 %: tariff panel / siegel row @360), 6000–8000 (42–43 %: themes
  cards stacked), 14000–16000 (40–45 %: events + footer); the 360 header/footer foundation requests stay queued (no duplicate request).
- **Units**: 1440 round 1 off 0 / missing 0 / errors 5 (unit probe errored after the cache delete — instrument state, as the archetype's
  record); round 2 off 47 / missing 17; 360 off 39 / missing 15 (families keyfact-cards, product-teasers, service-boxes, theme-teasers,
  news-posts — `stardust/replica/units.json` build selectors).
- **Events container**: identical to the live timeline at 21:55Z, so not replaced; the live DOM has 12 extra hidden day teasers (13
  `li.list-entry`) the encoder ignores (`q('.appointment .list-entry')` takes the first) — safe to replace later with the same transform.

## Files created / changed

- content/index.html — `photo-teasers themes` + `social-wall` blocks refreshed (sanitised; h1 / json-ld / siegel-gap / localised links kept).
- stardust/migrated/index.html — sections 9 (themes) and 11 (social wall) replaced with the normalised live containers (capture-state
  record: "refreshed from the live source at 2026-10-08T21:55:16Z"; the rest of the page is the 07:49Z capture).
- stardust/prototypes/assets/index/{ig,li}/*.jpg — 28 new social images (old kept).
- stardust/.work/rollout/cluster-privatkunden-strom-stromtarife/media-{map,manifest}-index.json + media/index/*.jpg — encoder outputs.
- stardust/deploy/media-ledger.json (+36), stardust/deploy/ledger-fix3-index.json, stardust/rollout/units/fix-wave-3-index.paths (`/index`).
- blocks/photo-teasers/photo-teasers.css — `themes` variant @ ≥ 1024 appended (two commits).
- stardust/replica/gates/all-1440/masks.json — new (index row, moin.ai).
- stardust/replica/gates/all-{1440,360}/index/* — fresh origin / eds / diff / content / units captures; runs/*-index.json.
- stardust/.work/rollout/fix-wave-3-index/ — fetch-live.mjs, transform-splice.mjs, splice-blocks.mjs, live-*.html, mig-*.html, new-*.html,
  new-images.txt, fetch-ts.txt, deploy.log, crops, diff-1440*.png, diff-360.png, proto-server.log.

## Notes for the next author

- The content refresh is repeatable in ≈ 3 min: `node stardust/.work/rollout/fix-wave-3-index/fetch-live.mjs` → `transform-splice.mjs`
  (restore stardust/migrated/index.html from git first — the splice looks for `data-section="9"/"11"` and aborts on unclean bounds) →
  `build-content.mjs index` → `splice-blocks.mjs` (keeps the post-processed document; copy content/index.html to encoded-index.html and
  `git show HEAD:content/index.html` to head-index.html before) → sanitise → lint chain → da-media-upload → deploy-batch with the `/index`
  paths file. Extend `transform-splice.mjs` to the events section only if the timeline text differs (compare `list-quartals` text first).
- The consent click `#usercentrics-cmp-ui #accept` times out on a plain Playwright page (the CMP does not render headless without the
  stitch-shot UA/wait); the containers are still complete. stitch-shot / measure / gate-all do click it.
- `block-roundtrip --map` for the social wall: the prototype's two `section.aktuelles` are not siblings of one parent, so
  `section.aktuelles:nth-of-type(3)` did not match — find the selector with html-slice.mjs on index-proposed.html before mapping.
- The 1440 unit probe reports `errors 5` right after deleting stardust/current/measure/index-units.json (round 1) and `off 47 / missing 17`
  on the next run — treat the first run after a cache delete as instrument state.
- Themes variant: the live row heights are natural (348 / 392 / 291 px at 1440); if the pixel number is to move further, read the live boxes
  with `measure.mjs --json` (one-sided selectors print MISSING in the table) and size the panel typography from them; keep the tablet/mobile
  renditions hidden (`picture.photo-teasers-mobile/-tablet { display: none }`) — round 2 showed what happens otherwise.
- Proto server for this unit: started on 8791 (pid file stardust/.work/proto-server.pid) and stopped by that pid at close.
- Foundation requests: none added (no header/footer/styles edits were needed for the content refresh).

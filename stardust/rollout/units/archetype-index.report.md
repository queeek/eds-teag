# archetype:index — report (stardust:replica Phase 5, rollout C-deliver, unit kind `archetype`, #126)

archetype:index: page 1/1 live, blocks 11, gate 1440 32.96% / 360 33.42%, Δh -141/+382, clipped 0, content 85/79, header band 1.84%/2.52%, footer band 15.41%/12.27%, chrome deltas 38/32, rounds 2, requests 0

```json
{
  "gates": {
    "1440": { "pixelPct": 32.96, "textPct": 29.66, "heightDelta": -141, "originH": 8820, "edsH": 8961, "clipped": 0, "contentMissing": 85, "contentHidden": 0, "unitsOff": 49, "unitsMissing": 17, "maskedRows": 0, "verdict": "FAIL", "headerBandPct": 1.84, "footerBandPct": 15.41, "chromeDeltas": 38, "overflow360": null, "run": "stardust/replica/gates/all-1440/runs/2026-10-08T19-43-53-969Z-index.json" },
    "360":  { "pixelPct": 33.42, "textPct": 30.8, "heightDelta": 382, "originH": 17026, "edsH": 16644, "clipped": 0, "contentMissing": 79, "contentHidden": 0, "unitsOff": 35, "unitsMissing": 19, "maskedRows": 4500, "verdict": "FAIL", "headerBandPct": 2.52, "footerBandPct": 12.27, "chromeDeltas": 32, "scrollWidth": 360, "run": "stardust/replica/gates/all-360/runs/2026-10-08T19-44-35-631Z-index.json" }
  },
  "page": "/",
  "sourcePath": "/default",
  "preview": "https://main--dc15da58--aemcoder.aem.page/",
  "live": "https://main--dc15da58--aemcoder.aem.live/",
  "blocks": ["hero-slider", "tariff-calculator", "three-steps", "product-teasers", "info-boxes", "cta-band", "photo-teasers", "news-posts", "social-wall", "events", "metadata"],
  "newBlocks": ["hero-slider", "info-boxes", "news-posts", "social-wall", "events"],
  "rounds": 2,
  "foundationRequests": 0,
  "publish": true,
  "deadline": "2026-10-08T20:10:00Z (round 2 extension; first 20:00:16Z)"
}
```

Status: **deployed + published, gate FAILED at both widths (done-with-residuals candidate, not verified)**. The page is live
(`/index` → `/`, deploy-batch `1 ok`, `.plain.html` 200, one `<h1>`, 0 `about:error`, 62/62 media hosted, ai-readability
100 % strict / 100 % code). Coverage row `index` → `failed` with the numbers. Two fix rounds were run (the second on the coordinator's
extension to 20:10 UTC); the remaining pixel delta is the live-drift / footer-region residual class plus the two named
layout items below.

## What the round did
- Round 0 (first gate): 1440 70.09 % / 360 61.69 % — the live origin stitch carried the Usercentrics v3 consent layer
  (header band 94.55 % thick). Re-shot both origins with `stitch-shot.mjs … --settle --wait 5000 --consent '#usercentrics-cmp-ui #accept' --dismiss …`
  (`origin-first.png` kept beside the new `origin.png` in each gate dir).
- Round 1 (code): hero-slider bar = ONE link around title + description (content-diff flagged the live CTA as missing);
  `--skip-existing --recapture-eds` at both widths → 33.23 % / 32.22 %.

- Round 2 (coordinator list, measured boxes only; code + content re-PUT with `--force`):
  1. **360 horizontal overflow** — DOM probe (`stardust/.work/rollout/archetype-index/overflow-probe.mjs <url> 360`: right edges,
     scrollWidth > clientWidth, text-range boxes): `main` scrollWidth 426 came from `.info-boxes-icon-list li` (Netzstörung entry)
     rendered as a non-wrapping flex row — the "(24h)" text range reached x 426. Fix: the li is `display: block; padding-left: 1.65em`
     with the icon absolutely positioned (the live `span.entries` block). Before → after: scrollWidth 426 → **360** (probe re-run
     on the deployed page before gating; `right: []`).
  2. **Siegel-row whitespace** — `tariff-calculator siegel-gap` variant (additive CSS, content class): intended 130 px @1440 /
     120 px ≤1024 (lift: padding 20 + collapsed margins 40 + row 30/20 + center 20 + padding 20). Measured effect on the stitched
     page: edsH 8939 → 8961 @1440 (+22), 16621 → 16644 @360 (+23) — only ≈ 22 px of the margin lands (the block's own
     margin rules / wrapper override absorb the rest); the band 1000–1500 @1440 left the hot list, 1500–2000 fell 45.5 → 28.2 %.
     Next author: put the gap on `main .section.tariff-calculator-container > .tariff-calculator-wrapper` (wrapper margin, as
     the ueber-uns note) and re-measure.
  3. **Tab-panel docking** — not changed (no CSS-only change on hero-slider makes the boxes match: the live tabs sit on the white
     panel that contains the form; here the form is the next section with the 80 px rhythm and grey background); named below.
  Gate after round 2: 1440 32.96 % (was 33.23), 360 33.42 % (was 32.22 — the +23 px shift moves the drift bands, not a regression
  of a measured box); Δh −141 / +382, clipped 0 / 0, content 85 / 79 unchanged (drift class), units off 49 / 35.

## Band breakdown after round 2 (origin y ranges, hot ≥ 15 %)
- 1440: 1500–2000 28 % (keyfacts / product-teasers columns-2 padding vs the live 150 px) · 3000–3500 26 % (info-boxes form rhythm)
  · 3500–5000 63–71 % (cta-band docking + themes list drift: live leads with "Heizkraftwerk Schwarza") · 5000–5500 39 %
  (themes) · 6000–8000 19–40 % (news posts → social wall drift) · 8000–8820 66–82 % (events dates drift + footer region / moin.ai).
- 360: 2000–3000 30–38 % (tariff form rows / keyfacts) · 5500–6500 18–27 % (steps) · 6500–8500 18–71 % (info-boxes form, cta)
  · 11000–14000 40–65 % (social wall drift) · 14000–16644 16–74 % (events drift + footer region).

## Residuals (measured, not fixed — named bands, cause, archetype-record row)
- **Live content drift** (archetype record `residuals`: themes list, mega-menu teaser, social wall = nondeterministic): the live
  themes list now leads with "Heizkraftwerk Schwarza …" (origin y 3918–4256 @1440, hot bands 3500–5000 @1440 at 64–66 %), the
  social wall posts/ids/hashtags changed since capture (bands 6000–8000 @1440, 11000–14000 @360; 29 × "zu dieser Folie" + 4 ×
  "zur nächsten Folie" carousel controls, LinkedIn company links); the events panel/timeline dates moved (8000–8820 @1440,
  15500–16621 @360). ≈ 70 of the 85/79 "missing" content items are this class. Never iterate; recorded.
- **Footer region** (archetype row: moin.ai + scroll-up): footer band 15.41 % / 12.11 % — the moin.ai iframe sits inside the band
  on the live origin (360 masks rows `655:250` + 900 n, 4500 masked rows) and the band also contains the drifted events block
  at both widths; the 1440 `masks.json` does not exist for any page (no masking at 1440, as the other archetypes).
- **Header band**: 1.84 % @1440 (PASS ≤ 2 %), 2.52 % @360 (the already-requested 360 header band / nav ticker; no duplicate request).
  chrome-parity 38 / 32 deltas = the same header/footer text pairing class as the other archetypes (footer 27 at both widths).
- **Siegel row** (`#PCS16444`, 3 empty `<li>` on live = ≈150 px of whitespace below the tariff form @1440 / ≈100 @360): not
  authored (an empty section is dropped by EDS); band 1000–1500 @1440.
- **Tab panel docking**: on live the Strom/Erdgas/Energielösungen tabs sit on the white tariff panel inside the slider section;
  here the tabs are the last hero-slider row and the reused `tariff-calculator` is the next section (80 px section rhythm,
  grey background) → band 500–1000 @1440.
- **Units**: 1440 off 67 / missing 49 (the `unit-geometry` cache `stardust/current/measure/index-units.json` was deleted
  before the 360 runs only; the 1440 round-1 probe shows `within 0` — a stale-cache / instrument-state row like the
  archetype record's `unit-geometry = instrument state`); 360 off 35 / missing 19 / errors 1 on both runs (the families are
  keyfact-cards, product-teasers, service-boxes = `.info-boxes-box`, theme-teasers, news-posts; `build` selectors set in
  `stardust/replica/units.json`, `protoBuild` kept).
- **Measured (360-only measure.mjs, `run-bg log measure-index-360`)**: preview scrollWidth 426 > 360 (+66 px horizontal
  overflow; live 360) and scrollHeight 16621 vs 17026 (−405). The overflow element is not a laid-out box (the probe
  `stardust/.work/rollout/archetype-index/overflow-probe.mjs <url> 360` lists only one 37 px anchor at right 387, y 4962) —
  suspect the events month `ul` inline widths (426 = October) or a nowrap string; first item of fix round 2. measure.mjs
  prints MISSING for one-sided selectors (live vs build names differ), so per-block heights need the union list per side.
- EW: info-boxes 20/20 editable; news-posts / social-wall EW-clean after the round-1 moves; events 5/11 (month names, day
  labels and the teaser title are re-tagged `span`s — EW1 debt for the next author); hero-slider credits/title/description
  moved (EW-clean), the tabs `ul` is rebuilt (EW1 debt).

## Files created / changed
- New blocks: `blocks/hero-slider/`, `blocks/info-boxes/`, `blocks/news-posts/`, `blocks/social-wall/`, `blocks/events/`
  (JS + CSS, `decorate()` re-entrant via `data-decorated`, CSS scoped to `.<name>`, mobile-first `@media (width >= 1025px)`).
- Additive: `blocks/photo-teasers/photo-teasers.css` (variant `themes`: natural heights, centred header / button rhythm).
- Content: `content/index.html` (sanitised, links localised: `/`, `/privatkunden/strom/stromtarife`,
  `/privatkunden/strom/haus-baustromanschluss`, `/datenschutz`; other source-host links absolute).
- Encoder: `stardust/.work/rollout/cluster-privatkunden-strom-stromtarife/build-content.mjs` — `index` row in SLUGS,
  media keys are now asset-relative paths (sub-folders `img/ li/ ig/`), a `media-manifest-<slug>.json` is written; encoders in
  `stardust/.work/rollout/archetype-index/index-encoders.js` (patched in by `patch-encoder.mjs`).
- Media: 62 images → `media/index/` (manifest upload, `stardust/deploy/media-ledger.json`), all `✓ hosted` (media-reconcile).
- Schema / log: `stardust/eds-schema/index.json`, `stardust/eds-conversion-log.md` (index line under "Per-section decode tiers").
- Gate config: `presence.json` (both widths, `main: "#Content=main"`), `all-360/masks.json` (index row), `stardust/replica/units.json`.
- Rollout: `stardust/rollout/units/archetype-index.paths` (`/index`), `stardust/deploy/ledger-archetype-index.json`,
  `stardust/rollout/coverage/` (deployed → failed), `stardust/state.json` row (`deployed`, liveUrl, deployedPath `/`).
- Work dir: `stardust/.work/rollout/archetype-index/` (deadline.txt, deploy.log, patch-encoder.mjs, index-encoders.js).

## Decode tiers
hero-slider template-slotted (controls restored = capture-state `restoreAtDelivery`) · tariff-calculator reused static form tier ·
three-steps keyfacts / three-steps reused · product-teasers list-style-1 columns-2 reused · info-boxes template-slotted static form
tier · cta-band reused · photo-teasers themes reconstructive · news-posts / social-wall reconstructive (row = column, cell = post;
captured posts frozen, carousel first slide, no live embed — capture-state policy) · events template-slotted (timeline 142 px/day).
Davids: PASS, 5 🟡 (D3 differing cell counts on tariff-calculator / info-boxes / events, D10 tariff 5 columns, D1 cta-band) — the
bespoke-widget exceptions of the earlier archetypes.

## Capture-state restorations delivered
Slider controls (arrows, bullet, play; opacity 0 → 1 on hover / focus-within) rendered by `hero-slider.js`; a single slide
means the auto-switch is a no-op. Social wall / news / events: captured items as static content (recorded above).

## Notes for the final unit
- Foundation requests still queued (none added here): 360 header band, 360 footer +22 px, 1440 active-channel highlight.
- Fix round 3 candidates with a measurable box delta (run `measure.mjs <live> --against <preview> --width 360 --all-matches
  --consent '#usercentrics-cmp-ui #accept' --selectors …` — see `run-bg log measure-index-360`): siegel-row gap (only ≈ 22 of 130 px
  landed — move the margin to the wrapper), tab panel docking (tabs → white panel → form),
  product-teasers `columns-2` padding-top vs the live 150 px, info-boxes callback form field rhythm, events panel height @360.
- `deploy-batch` needs the paths file as `/index` (a bare `/` maps to no content file: "0 pages").
- Origin captures of `/` need the consent re-shoot before every gate run (gate-all's shared consent candidates miss Usercentrics v3).
- Redirects: `/default` → `/` is the same document (archetype liveUrl); nothing added to `stardust/redirects.tsv`.
- Proto server started on 8791 for this unit and stopped by `stardust/.work/proto-server.pid`.

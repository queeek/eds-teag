# archetype:privatkunden-strom-stromtarife — unit report (stardust Phase 5, rollout C-deliver, template `program`)

**archetype:privatkunden-strom-stromtarife: page 1/1 live, blocks 9, gate 1440 8.06% / 360 16.43%, Δh 60/70, clipped 0, content MISSING 1/3, header band 9.01%/2.52%, footer band 15.39%/6.88%, chrome deltas 39/32, rounds 3+3, requests 3**

Verdict: **FAIL** (fix wave 2 closed after its 3 rounds). 1440 now passes the pixel bar (8.06 %, Δh 60 = 0.5 %, clipped 0);
360 stays at 16.43 % (Δh 70 = 0.4 %). Content MISSING 1 @1440 / 3 @360 and units off 3 / missing 8 (both widths) are the named
probe asymmetries below, not layout faults; the strict bar (MISSING 0, units off/missing 0) is therefore not met on either row.
Live: `https://main--dc15da58--aemcoder.aem.page/privatkunden/strom/stromtarife` (and .aem.live; content re-PUT with `--force`
this wave, ledger `stardust/deploy/ledger-archetype-stromtarife.json`).

```json
{
  "gates": {
    "1440": {
      "pixelPct": 8.06,
      "textPct": 14.62,
      "heightDelta": 60,
      "originH": 11665,
      "edsH": 11605,
      "clipped": 0,
      "contentMissing": 1,
      "contentHidden": 0,
      "unitsOff": 3,
      "unitsMissing": 8,
      "maskedRows": 0,
      "verdict": "FAIL (pixel PASS 8.06 %; content 1 + units 3/8 are the named probe asymmetries)",
      "headerBandPct": 9.01,
      "footerBandPct": 15.39,
      "chromeDeltas": 39,
      "run": "stardust/replica/gates/all-1440/runs/2026-10-08T16-48-31-195Z-privatkunden-strom-stromtarife.json"
    },
    "360": {
      "pixelPct": 16.43,
      "textPct": 16.82,
      "heightDelta": 70,
      "originH": 17995,
      "edsH": 17925,
      "clipped": 0,
      "contentMissing": 3,
      "contentHidden": 0,
      "unitsOff": 3,
      "unitsMissing": 8,
      "maskedRows": 0,
      "verdict": "FAIL",
      "headerBandPct": 2.52,
      "footerBandPct": 6.88,
      "chromeDeltas": 32,
      "run": "stardust/replica/gates/all-360/runs/2026-10-08T16-52-06-850Z-privatkunden-strom-stromtarife.json"
    }
  },
  "rounds": "3+3",
  "requests": 3
}
```

## Fix wave 2 (3 fresh rounds, 2026-10-08) — trajectory
- Start (round 3 of the original unit): 1440 12.74 % / Δh 119, 360 14.01 % / Δh 22, units off 8/4.
- Round 1 (the five named fixes): `main .service-cards-content p.service-cards-checkbox { margin: 57px 0 20px }` (specificity),
  keyfacts icon `margin-bottom: .5em` @≥1025, stacked `product-teasers` ≤1024 authored to the measured live 360 boxes
  (card 4 last `p` margin 0 → −16 px; banking card: no top padding, text padding-top 28, ul→button −26, button→badges 58,
  badges 180×60 stacked with 30 px gaps, −33 px extra margin for the live overflow), e-mail link `kundenservice@teag.de`
  without `<wbr>` + re-PUT `--force`. → 1440 11.27 % / Δh 64 (keyfacts within), 360 14.44 % / Δh −24. The 57 px margin
  over-shot: checkbox label +38, "Anfrage senden" +36 (the lost rule had been worth 19/25).
- Round 2 (measured block deltas, measure.mjs section children live vs block roots preview, both widths; JSON under
  `stardust/.work/rollout/archetype-privatkunden-strom-stromtarife/w2-*.json`): checkbox margin 19/22 px (→ labels within);
  `cta-band` padding-bottom +22 @360 / +18 @1440 (both variants read 22/18 px short); steps variant "Ihr Wechsel": header h3 at
  `var(--fs-h2)` (live 35 px @1440, 2×23 @360), step padding-bottom 22 px ≤1024 (list 659 vs 593), list padding-bottom 12 px
  @1440 (304 vs 292); `tariff-calculator-panel` padding-bottom 49 px @1440 (live panel 323 vs 294); `channel-products-controls:last-child`
  margin-bottom −21 px (pager-ended block 505 vs 484 @1440, 430 vs 409 @360). → 1440 12.31 % / Δh 34 (the tariff fix exposed
  the keyfacts block's +26 px from "Unsere Bestseller" on), 360 16.43 % / Δh 70.
- Round 3: keyfacts step `margin-bottom: 0` @≥1025 (was 1.6em = 26 px; live step has none); cta-band padding made explicitly
  additive (`calc(0px + 22px)`, no-op). → **1440 8.06 % / Δh 60**, 360 16.43 % / Δh 70 (360 unchanged: round 3 touched 1440 only).
- Not iterated (by brief): the eye-catcher gif frame (6000–7500 @1440 fell out of the hot list in round 3).

## Band breakdown (round 3 of fix wave 2, `hotBands` of the run JSON)
- 1440 (8.06 %): 10500–11000 29 %, 11000–11500 16.5 %, 11500–11605 41 % — service boxes + footer under the Δh 60 shift, the live
  scroll-up button and moin.ai chat widget over the footer. Everything above 10500 is under 15 %.
- 360 (16.43 %): 4500–5000 18 % (cta band 1 + "Weitere Angebote" top), 5500–6000 21.4 % / 6500–7000 43.8 % (teaser cards 2–4: the
  stacked cards still arrive ~40 px later than live — the tariff/keyfacts/channel-products stack above them is 360-only off, the
  channel-products block with footnotes reads +38 px at 360 against +2 at 1440 and was not split further), 8500–9000 25.4 %
  (eye-catcher gif + banking card: the two app-badge images 404 on the preview host, see residuals), 15000–16000 15.1/29.8 %
  (service boxes: the static form tier has no inputs — the live inputs/select are 7 boxes the probe cannot pair), 17000–17925
  18.5/21.1 % (footer under Δh 70 + the requested 360 footer +22 px).
- Units (both widths): service box 1 `em` dw 3/dh 5 @1440 (`<nobr>` in the live hours line, the self-hosted face wraps differently;
  360 dw 25/dh 4); box 2 "Datenschutzerklärung" dw 12/11 and "Anfrage senden" dx 7/dw −7 (the live bold face renders ~4 % wider — a
  foundation font residual already recorded); missing 8 = 7 live form controls (`input`/`select`/date link, static tier, no backend)
  + the `<nobr>` text node. Checkbox label and "Anfrage senden" are within at both widths now.
- Content MISSING: "kundenservice @teag.de" — the probe reads the live `<wbr>` as a space; the served link text is the live visible
  text `kundenservice@teag.de` (`stardust/current/pages/privatkunden-strom-stromtarife.json` has it as one string ×9) → justified probe
  asymmetry. 360-only: the two app-badge image links — alt text present in the served HTML, matched at 1440; but the badge media
  (`content.da.live/.../0760988a-m-a-100.png`, `a5502534-m-a-100.png`) resolve to `media_…jpg` URLs that return 404 on the preview
  host (badges render 0 px high at both widths) — a media-deploy residual, not a probe artefact.

Shell gate (≤ 2 % per band): 1440 header 9.01 % = the live active-channel highlight ("PRIVATKUNDEN", requested); 360 header 2.52 %
and 360 footer 6.88 % (`--y 17027 --y-b 16957 --height 968`; the requested +22 px) are archetype:impressum's items; 1440 footer 15.39 %
(`--y 11330 --y-b 11270 --height 335`) is the moin.ai widget + scroll-up button over the live footer plus the page Δh. No new request
line (foundation-requests.md stays at 3). chrome-parity 39 @1440 / 32 @360 reused (chrome unchanged). `foundation-freeze.mjs check` → unchanged.

## Residuals (fix wave 2)
- 360 pixel 16.43 %: the stacked column above teaser card 2 is +40 px at 360 (channel-products with footnotes +38, cta −22 fixed,
  pager −21 fixed) and the "Ihr Wechsel"/eye-catcher/banking stack is −69 px — both need live per-element boxes at 360 (one
  measure.mjs run each on `#Content > section:nth-of-type(5|11|12) > * > * > *`), not guessed margins.
- Banking app badges: media 404 on the preview host at both widths (content `content.da.live` PNG → `media_….jpg` not found). Needs
  the media re-upload path of deploy-batch (media-ledger has no row for `0760988ADCD443CBBDEBBAFF1339114A`); fixes the 1440 banking
  card (live 600 vs 538) and the 360 MISSING 2.
- Static form tier (7 live controls) and `<nobr>`/`<wbr>` text nodes: structural probe asymmetries; recorded, not fixable in CSS.

## Files created / changed
- `blocks/tariff-calculator/` (js, css, arrow-right.svg), `blocks/product-teasers/` (js, css, checkmark-pos.svg), `blocks/channel-products/` (js, css, checkmark-pos.svg),
  `blocks/cta-band/`, `blocks/three-steps/`, `blocks/text-module/`, `blocks/table/`, `blocks/faq/`, `blocks/service-cards/` (all new)
- `blocks/page-header-hero/page-header-hero.css` (additive variant `docked subline`, scoped with `:has(.docked)` — the baustromanschluss rendering unchanged)
- `content/privatkunden/strom/stromtarife.html` (new; generated from the migrated page by `stardust/.work/rollout/archetype-privatkunden-strom-stromtarife/build-content.mjs`, sanitised 241 chars)
- `stardust/eds-schema/privatkunden-strom-stromtarife.json` (sections renamed `page-content-section.<block>-n`, table section split out, `pruned` notes)
- `stardust/eds-conversion-log.md` (10 tier lines + schema decision), `stardust/replica/units.json` (5 program families `build` → EDS selectors, `protoBuild` kept)
- `stardust/deploy/media-ledger.json` (+37 under `media/privatkunden-strom-stromtarife/`, incl. `eye-catcher.gif`), `stardust/deploy/ledger-archetype-stromtarife.json`
- `stardust/replica/gates/all-{1440,360}/presence.json` (+ page), `all-360/masks.json` (+ page, 20 chunk rows), page gate dirs + `runs/`
- `stardust/state.json` (row → deployed + liveUrl + deployedPath, history entry), `stardust/rollout/coverage/*` (deployed → failed with the numbers)
- `stardust/rollout/units/archetype-privatkunden-strom-stromtarife.{paths,report.md}`
- `stardust/.work/rollout/archetype-privatkunden-strom-stromtarife/` (build-content.mjs, code-sync.mjs, state-schema.mjs, round-trip / davids / qa-gate / deploy / chrome-parity logs, measure-*.json, media/, crops)

## Decode tiers
- page-header-hero — reused, variant `docked subline` (3 picture rows PG_D/PG_T/PG_S, credits `<p>`, `<h1>`, `<h2>`). EW 3/3.
- tariff-calculator — template-slotted, STATIC interim tier (D-05): fields as grey boxes with the authored placeholder paragraphs, persons / stepper / filter / submit as inert `aria-disabled` buttons carrying the authored nodes. EW 10/10.
- product-teasers — reconstructive, one row per list-style-2 teaser (pictures ×3, credits, text, link, banking extra); variants `image-right`, `banking`. EW 5/5.
- three-steps — reconstructive (header row + step rows, CSS counter, decorative connectors); variant `keyfacts`. EW 7/7.
- channel-products — reconstructive (header row, card rows, footnote row; anchor wraps the card; `--channel-products-n` slider track). EW 33/33.
- cta-band — template-slotted (text cell + optional eye-catcher picture); the section is the purple band. EW 3/3.
- text-module — reconstructive (picture / credits / prose rows; floated figure after the h2). EW 6/6. table — reconstructive block-collection shape. EW 10/10.
- faq — reconstructive (header, service row with 2 drop-down pills + search, entry rows; collapsed answers + ported toggles). EW 32/32.
- service-cards — reconstructive (header + box rows; icon list / link list / STATIC call-back form, D-04). EW 13/13.

## Chain evidence
- block-roundtrip per block + whole page: EW dead 0 everywhere after the fixes; remaining 🔴 are the prototype's hidden live-JS markup (tariff result panel / Hinweis overlay,
  FAQ YouTube cookie notice, voting rows) and the static-tier ROLE SWAPs (`#` / `javascript:` CTAs authored as text or list items) — recorded in the conversion log.
- delivery-lint 0/0/0; media-reconcile 37 hosted; davids-model-lint PASS (9 🟡 D3/D10 span-shaped rows, 1 D1 cta-band — justified in the log); localize-links CHECK PASS 0
  (nav/footer rewrites reverted); qa-gate 56 ok / 4 warn (wide-2560 product-teasers 1520 px = the source's extra-wide 1920 cap) / 1 fail (frozen header logos — accepted);
  `npm run lint` clean.

## Notes for the next author (teag-strom-easie, ersatzversorgung, index)
- Row shapes unchanged (see the previous report revision in git for the full list): `product-teasers` [pictures ×3][credits p][h2 + p + ul][p>strong>a]
  (+[p + badge links] for `banking`); `channel-products` [h2] / [pictures][credits][kicker p + h3 + p + h4 + ul][p>a] / [footnote p…]; `three-steps`
  [h3] / [h4 + p]; `three-steps keyfacts` [h2] / [h3 + p]; `cta-band` [h3 + p + p>strong>a] (+[gif picture] for `eye-catcher`); `service-cards` static form tier.
- Fix wave 2 settled values: `main .service-cards-content p.service-cards-checkbox { margin: 19px 0 22px }` (NOT 57 — the lifted 57 px was the
  live label's absolute offset, not a margin); keyfacts icon `.5em`, keyfacts step margin-bottom 0 @≥1025; steps-variant h3 at `var(--fs-h2)`,
  step padding-bottom 22 px ≤1024; `main .cta-band { padding-bottom: 22px / 18px }`; `tariff-calculator-panel` padding-bottom 49 px @≥1025;
  `channel-products-controls:last-child { margin-bottom: -21px }`; stacked banking card rules in the `≤ 1024` block of product-teasers.css.
- 360 live measurements are only trustworthy from a 360-only measure.mjs run — a `--width 1440,360` run re-lays the live teaser cards collapsed
  (−834 px); the first 360-only run matched the gate's origin capture within 2 px.
- `measure.mjs` reads `main .section` as 0×0 on the preview host; block roots (`.tariff-calculator`, `.channel-products`, `.cta-band`, …) and
  `*-wrapper` read fine; the preview section rhythm is 80 px between block roots (40 + 40) — compare live section heights to block + 80.
- Served CSS/HTML from aem.page is gzip-encoded: `curl --compressed` before grepping for a sync string.
- Badge media: check `curl -o /dev/null -w %{http_code}` on the served `media_…` URL of every content.da.live PNG before gating a page with app badges.
- `unit-geometry` cache (`stardust/current/measure/<slug>-units.json`) deleted between widths; `gate-all` runs sequentially per width (one Chromium each).

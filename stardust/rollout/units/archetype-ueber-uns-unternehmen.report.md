# archetype:ueber-uns-unternehmen — unit report (stardust Phase 5, rollout C-deliver, template `listing`)

archetype:ueber-uns-unternehmen: page 1/1 live, blocks 3, gate 1440 5.05% / 360 4.23%, Δh 22/3, clipped 0, content 0, header band 6.49%/2.52%, footer band 1.72%/2.57%, chrome deltas 25/32, rounds 3, requests 0

```json
{
  "gates": {
    "1440": { "pixelPct": 5.05, "textPct": 8.35, "heightDelta": 22, "originH": 2510, "edsH": 2488, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "unitsOff": 0, "maskedRows": 0, "verdict": "PASS", "headerBandPct": 6.49, "footerBandPct": 1.72, "chromeDeltas": 25, "run": "stardust/replica/gates/all-1440/runs/2026-10-08T14-46-52-498Z-ueber-uns-unternehmen.json" },
    "360":  { "pixelPct": 4.23, "textPct": 6.45, "heightDelta": 3, "originH": 5065, "edsH": 5062, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "unitsOff": 0, "maskedRows": 1497, "verdict": "PASS", "headerBandPct": 2.52, "footerBandPct": 2.57, "chromeDeltas": 32, "run": "stardust/replica/gates/all-360/runs/2026-10-08T14-47-07-148Z-ueber-uns-unternehmen.json" }
  },
  "page": "/ueber-uns/unternehmen",
  "sourcePath": "/ueber_uns/unternehmen",
  "preview": "https://main--dc15da58--aemcoder.aem.page/ueber-uns/unternehmen",
  "live": "https://main--dc15da58--aemcoder.aem.live/ueber-uns/unternehmen",
  "blocks": ["photo-teasers", "breadcrumb", "channel-cards"],
  "rounds": 3,
  "foundationRequests": 0
}
```

PASS criteria (pixel ≤ 10 %, |Δh| ≤ 5 %, clipped 0, MISSING+HIDDEN 0, required units within 4 px) hold at both widths. Δh 22 @1440 is the live
stitch's 22 blank tail rows (EDS 2488 = live content height; the live DOM probe reports 2482 pre-equaliser). 360 is masked (1497 rows,
`stardust/replica/gates/all-360/masks.json`: moin.ai chat widget bands at the bottom of every 900 px chunk, as the haus unit).

Shell gate (≤ 2 % per band): 1440 footer PASS (1.72 %, `--y 2153 --y-b 2152 --height 335`). 1440 header 6.49 % = the live active-channel highlight
("ÜBER UNS", `li.level-1-7.active > a` #c60086) + "Suche" placeholder — the item archetype:privatkunden-strom-haus-baustromanschluss already requested;
360 header 2.52 % and 360 footer 2.57 % (`--y 4075 --y-b 4072 --height 968`, EDS footer +22 px) are the two items archetype:impressum requested.
No new request line (foundation-requests.md stays at 3). chrome-parity: 25 deltas @1440 / 32 @360 (the same classes as the earlier units:
mobile bar item, Kundenportal/Karriere span→a, Kontrast label→span, footer social labels, "X"). `foundation-freeze.mjs check` → `foundation unchanged (18 files)`.

## Path normalisation
`/ueber_uns/unternehmen` (underscore) is not delivery-safe → authored `content/ueber-uns/unternehmen.html`, served `/ueber-uns/unternehmen`;
`stardust/redirects.tsv` row 2. localize-links rewrote the nav's "Unternehmen" link in `content/nav.html` → reverted (frozen chrome document, re-PUT at C-final).
Card links (`/ueber_uns/unternehmen/portraet_und_geschaeftszahlen` …) and the "Über uns" crumb stay absolute source-host links (not in the migration set).

## Files created / changed
- `blocks/photo-teasers/photo-teasers.js|.css` (new), `blocks/channel-cards/channel-cards.js|.css` (new)
- `content/ueber-uns/unternehmen.html` (new; sanitised, 25 non-ASCII chars entity-encoded)
- `stardust/eds-schema/ueber-uns-unternehmen.json` (new; `sections[2].section` renamed `page-content-section.channel-modul`, see `notes`)
- `stardust/eds-conversion-log.md` (tiers + decisions appended), `stardust/redirects.tsv` (+1 row)
- `stardust/deploy/media-ledger.json` (+9 under `media/ueber-uns-unternehmen/`: hero-desktop|tablet|mobile, card-*), `stardust/deploy/ledger-archetype-ueber-uns-unternehmen.json`
- `stardust/replica/units.json`: `listing-image-teaser-card` `build` → `.channel-cards > .channel-cards-card` (`protoBuild` keeps the prototype's)
- `stardust/replica/gates/all-{1440,360}/presence.json` (+ page), `all-360/masks.json` (+ page), page gate dirs + `runs/`
- `stardust/state.json` (row → deployed + liveUrl + deployedPath, history entry), `stardust/rollout/coverage/*` (deployed → verified)
- `stardust/rollout/units/archetype-ueber-uns-unternehmen.{paths,report.md}`
- `stardust/.work/rollout/archetype-ueber-uns-unternehmen/` (round-trip, davids, qa-gate, deploy, chrome-parity logs, measure-*.json, media/, plain.html)

## Decode tiers
- photo-teasers — reconstructive: one row per teaser; cells pictures (1/2/3 renditions → `.photo-teasers-desktop|tablet|mobile`), credits `<p>`, text (kicker, h2, description), optional link; equaliser height 514.27 / container 451.607 as CSS. EW 4/4.
- breadcrumb — reused as-is, variant `trailing-gap` (row 1 screen-reader `<h1>`, row 2 `<ul>`). EW 2/2.
- channel-cards — reconstructive: one row per card; cells picture, credits `<p>`, body (h3 + p), link `<p><a>`; the first authored anchor wraps the whole card (as the source), its text stays in the authored paragraph (footer label). EW 24/24.

## Chain evidence
- block-roundtrip per block (`--map photo-teasers=#MainContent_PCS30987`, `channel-cards=#PCS30218`, `breadcrumb=.page-meta-section`) + whole page: 0 structural 🔴 (🟡 IMG COUNT 1 vs 3 = hero renditions; 🟠 EXTRA h1 = the screen-reader title; 🟠 EXTRA on card headings/CTAs = the proto classifier reads 0 text nodes inside the card links).
- delivery-lint 0/0/0; media-reconcile 9 hosted; davids-model-lint PASS (1 🟡 D1 breadcrumb, justified in the log); localize-links CHECK PASS 0 still localizable;
  qa-gate 18 ok / 1 warn (wide-2560 photo-teasers 1736 px = the source's extra-wide 1920 cap) / 1 fail (frozen header logos — accepted); `npm run lint` clean.
- `.plain.html` 200, one `<h1>`, 0 `about:error`, 0 `/img/`, 9 `<picture>` as `./media_…`; ai-readability 100 % (gate 98); aem.live 200.
- Round 0 → origins re-shot with `--dismiss '#usercentrics-cmp-ui #accept'` (71 % / 60 % were the consent modal). Round 1: content MISSING 6 links — the live card link wraps the whole card
  → the authored anchor now wraps the figure (keeping the authored `<p>` as label: the first attempt dropped it = 6 DEAD TEXT). Round 2: credits text 16 px off — FontAwesome © is a
  separate 21 px inline box on live → `::before` on the credits div, `<p>` inline. Round 3: "Mehr erfahren" label box 180 px too wide (block `<p>` vs inline span) → `display: inline`.

## Notes for the next author (stromtarife, index)
- `photo-teasers` is generic for the index: one row per teaser, cells [pictures][credits][text][link]; 3 pictures = PT3_D/PT2_T/PT2_S; the fixed 514.27/451.607 values are this page's equaliser state — a variant class for other heights, not a rewrite.
- `channel-cards`: one row per card [picture][credits][h3 + p][`<p><a>`]; the anchor wraps the card, so never author a second link in a card row (it is unwrapped and kept as text).
- `decorateButtons` turns a lone `<p><a>` into `.button` — strip `button`/`button-container` in decorate when the source renders links as text.
- unit-geometry compares the TEXT element boxes: an inline source span must stay inline on EDS (a block `<p>` fails by its width); a FontAwesome glyph is a 21 px inline box.
- qa-gate maps schema sections to blocks by the FIRST section of the same name — rename colliding `section` names in the page schema (recorded in `notes`).
- block-roundtrip needs `--map <block>=<proto selector>` when the proto section has no matching class; the whole-page run takes repeated `--map` flags.
- The empty source `header.extra-margin-bottom` (64 px) is a wrapper margin override `main .section.<block>-container > .<block>-wrapper`.
- Header band @1440 fails on every channel page (active-channel highlight) — requested once; 360 header/footer items requested by impressum; do not re-request.

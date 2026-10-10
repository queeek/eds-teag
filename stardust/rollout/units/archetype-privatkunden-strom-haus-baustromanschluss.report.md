# archetype:privatkunden-strom-haus-baustromanschluss — unit report (stardust Phase 5, rollout C-deliver, template `article`)

archetype:privatkunden-strom-haus-baustromanschluss: page 1/1 live, blocks 3, gate 1440 5.21% / 360 1.86%, Δh 21/0, clipped 0, content 0, header band 9.01%/2.52%, footer band 4.28%/8.8%, chrome deltas 26/26, rounds 2, requests 1

```json
{
  "gates": {
    "1440": { "pixelPct": 5.21, "textPct": 3.95, "heightDelta": 21, "originH": 1710, "edsH": 1689, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "unitsOff": 0, "maskedRows": 0, "verdict": "PASS", "headerBandPct": 9.01, "footerBandPct": 4.28, "chromeDeltas": 26, "run": "stardust/replica/gates/all-1440/runs/2026-10-08T14-03-12-839Z-privatkunden-strom-haus-baustromanschluss.json" },
    "360":  { "pixelPct": 1.86, "textPct": 2.93, "heightDelta": 0, "originH": 2505, "edsH": 2505, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "unitsOff": 0, "maskedRows": 750, "verdict": "PASS", "headerBandPct": 2.52, "footerBandPct": 8.8, "chromeDeltas": 26, "run": "stardust/replica/gates/all-360/runs/2026-10-08T14-03-14-142Z-privatkunden-strom-haus-baustromanschluss.json" }
  },
  "page": "/privatkunden/strom/haus-baustromanschluss",
  "sourcePath": "/privatkunden/strom/haus-_-_baustromanschluss",
  "preview": "https://main--dc15da58--aemcoder.aem.page/privatkunden/strom/haus-baustromanschluss",
  "live": "https://main--dc15da58--aemcoder.aem.live/privatkunden/strom/haus-baustromanschluss",
  "blocks": ["page-header-hero", "breadcrumb", "cta-box"],
  "rounds": 2,
  "foundationRequests": 1
}
```

PASS criteria (pixel ≤ 10 %, |Δh| ≤ 5 %, clipped 0, MISSING+HIDDEN 0, required units within 4 px) hold at both widths. The 360 pixel number is
masked (750 rows, printed on the verdict): the live page carries the moin.ai chat widget (`#moinloader` iframe, 360×227, absolute at the
bottom of every 900 px stitch chunk); it is not consent-gated (`#accept` and `#deny` captures both show it) and its close button is inside
the iframe, out of reach of `--dismiss`. Unmasked the same capture pair scored 19.19 % (origin) → the masked rows are
`stardust/replica/gates/all-360/masks.json`. At 1440 the widget sits over the footer's last chunk and is left unmasked (5.21 %).

Shell gate (≤ 2 % per band): all four bands exceed it. 1440 header 9.01 % = the live nav's active-channel highlight ("PRIVATKUNDEN",
`li.level-1-1.active > a` #c60086, 235×75) which the frozen header has no state for, plus the "Suche" placeholder → ONE new foundation
request line (`stardust/rollout/foundation-requests.md`, 3 lines now). 360 header 2.52 % and the 360 footer +22 px are the two items already
requested by archetype:impressum (not duplicated). Footer bands (1440 4.28 % at `--y 1353 --height 335`; 360 8.8 % at `--y 1515 --height 968`)
are inflated by the moin.ai widget that overlaps the footer in the last chunk and, at 360, the +22 px foundation drift. chrome-parity: 26 deltas
at both widths (same classes as impressum: mobile bar item, Kundenportal/Karriere span→a, Kontrast label→span, footer social labels, "X").
`foundation-freeze.mjs check` → `foundation unchanged (18 files)`.

## Path normalisation
delivery-lint P0: `/privatkunden/strom/haus-_-_baustromanschluss` is not delivery-safe → content authored at
`content/privatkunden/strom/haus-baustromanschluss.html`, served at `/privatkunden/strom/haus-baustromanschluss`;
`stardust/redirects.tsv` (new) records `source<TAB>served`. localize-links rewrote the nav's link to this page in `content/nav.html`
as a side effect — reverted (foundation document, out of unit scope); the coordinator should either re-publish `/nav` with the normalised
link or configure the redirect at tools.aem.live, else the nav entry 404s on the preview host.

## Files created / changed
- `blocks/page-header-hero/page-header-hero.js|.css` (new)
- `blocks/cta-box/cta-box.js|.css|arrow-right.svg` (new; svg copied from blocks/text-additions)
- `blocks/breadcrumb/breadcrumb.css` (additive variant `trailing-gap` only — impressum / datenschutz rendering unchanged)
- `content/privatkunden/strom/haus-baustromanschluss.html` (new; sanitised)
- `stardust/eds-schema/privatkunden-strom-haus-baustromanschluss.json` (new; `P.` repeat pruned, see `pruned`)
- `stardust/eds-conversion-log.md` (tiers + decisions appended), `stardust/redirects.tsv` (new)
- `stardust/deploy/media-ledger.json` (+3 hero renditions under `media/privatkunden-strom-haus-baustromanschluss/`),
  `stardust/deploy/ledger-archetype-haus-baustromanschluss.json`
- `stardust/replica/units.json`: `linklist-row` / `bread-crumb-item` `build` → served EDS selectors (`protoBuild` keeps the prototype's)
- `stardust/replica/gates/all-{1440,360}/presence.json` (+ page), `all-360/masks.json` (new), page gate dirs + `runs/`
- `stardust/state.json` (row → deployed + liveUrl + deployedPath), `stardust/rollout/coverage/*` (deployed → verified), `stardust/rollout/foundation-requests.md` (+1)
- `stardust/rollout/units/archetype-privatkunden-strom-haus-baustromanschluss.{paths,report.md}`
- `stardust/.work/rollout/archetype-privatkunden-strom-haus-baustromanschluss/` (round-trip, davids, qa-gate, deploy, stitch, chrome-parity logs, media/, code-sync.mjs)

## Decode tiers
- page-header-hero — template-slotted: picture rows (1 = all widths, 2 = desktop/mobile, 3 = PG_D/PG_T/PG_S) moved into the figure, credits `<p>` into the figcaption (© pseudo-element), `<h1>` into the bar. EW 2/2.
- breadcrumb — reused as-is (no title row; the `<h1>` lives in the hero). EW 1/1.
- cta-box — template-slotted: cell 1 the text module (h2, p, h3, link list) → 2/3 column; cell 2 the call-to-action box (h3, `<strong><a>` button) → 1/3 marginal. EW 8/8.

## Chain evidence
- block-roundtrip per block + whole page: 0 structural 🔴 (🟡 IMG COUNT 1 vs 3 = the three renditions; 🟡 EXTRA ×2 = the two ZWSP spacers).
- delivery-lint 0/0/0 (after path normalisation + `<footer>`); media-reconcile 3 hosted; davids-model-lint PASS (1 🟡 D1 breadcrumb, justified in the log);
  localize-links 0 still localizable; qa-gate 18 ok / 1 fail (the frozen header's two logos — accepted); `npm run lint` clean.
- `.plain.html` 200, one `<h1>`, 0 `about:error`, 0 `/img/`, 3 `<picture>`; ai-readability 100 % (gate 98); aem.live 200.
- Round 1: `.page-header-hero-container` collided with the SECTION class EDS assigns (`<block>-container`) → the section floated right at 75 %;
  renamed the inner bar wrapper `.page-header-hero-bar-inner`. Round 2: the text column's trailing margin collapsed into the marginal's
  margin-top at ≤ 768 (source column is a float) → `.cta-box-column { display: flow-root }`; the source's stray trailing `&nbsp;` on the
  first link-list item (wraps to a 26 px line at 360) survives the pipeline as `&nbsp;&#8203;`; the active crumb's 12 px empty `::after`
  padding (unit-geometry off 1) → breadcrumb variant `trailing-gap`.
- Live content drift: the box's paragraph "Sie benötigen einen Haus- oder Baustromanschluss? …" exists on live, not in the capture — the
  capture is the spec; it fits inside the 88 px service container (+6 px) so the gate absorbs it.

## Notes for the next author (stromtarife, ueber-uns-unternehmen, index)
- `page-header-hero` is ready for stromtarife: author the PG_D/PG_T/PG_S renditions as three picture rows (`da-media-upload --scope <slug>`), then credits `<p>`, then `<h1>`; a docked/overlay bar variant is a new class, not a rewrite.
- `cta-box` row = [text module, box]; put more boxes as further rows (each row's 2nd cell appends to the marginal); the button is `<strong><a>` (blue) — `<em><a>` would be purple.
- NEVER name an inner wrapper `<block>-container` or `<block>-wrapper`: those are the section / wrapper classes EDS assigns.
- Column margins: the source's float columns do not collapse margins — give the EDS column `display: flow-root` or the mobile stack is 30 px short.
- `&nbsp;` survives the pipeline when followed by `&#8203;`; a bare trailing `&nbsp;` is dropped.
- delivery-lint rejects `_` in paths: author the normalised file name, record `stardust/redirects.tsv`, and revert the `content/nav.html` rewrite localize-links makes.
- `stardust/replica/units.json` `build` is the served-side selector for gate-all: set it to the EDS selector per family (keep `protoBuild`).
- Live overlays: Usercentrics → re-shoot with `--dismiss '#usercentrics-cmp-ui #accept'`; the moin.ai chat widget cannot be dismissed → `masks.json` row bands at the bottom of every 900 px chunk (660+/1560+/2255+ at 360), reason documented.
- Header active-channel highlight (#c60086 on the current level-1 item) is missing in the frozen header on every channel page — requested once; do not re-request.

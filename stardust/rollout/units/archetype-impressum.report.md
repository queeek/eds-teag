# archetype:impressum — unit report (stardust Phase 5, rollout C-deliver, template `static`)

archetype:impressum: page 1/1 live, blocks 2, gate 1440 2.69% / 360 4.8%, Δh 25/1, clipped 0, content 0, header band 1.85%/2.52%, footer band 1.50%/2.68%, chrome deltas 38/32, rounds 1, requests 2

```json
{
  "gates": {
    "1440": { "pixelPct": 2.69, "textPct": 3.02, "heightDelta": 25, "originH": 4623, "edsH": 4598, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "verdict": "PASS", "headerBandPct": 1.85, "footerBandPct": 1.50, "chromeDeltas": 38, "run": "stardust/replica/gates/all-1440/runs/2026-10-08T12-54-20-773Z-impressum.json" },
    "360":  { "pixelPct": 4.8, "textPct": 11.03, "heightDelta": 1, "originH": 6534, "edsH": 6533, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "verdict": "PASS", "headerBandPct": 2.52, "footerBandPct": 2.68, "chromeDeltas": 32, "run": "stardust/replica/gates/all-360/runs/2026-10-08T12-54-26-596Z-impressum.json" }
  },
  "page": "/impressum",
  "preview": "https://main--dc15da58--aemcoder.aem.page/impressum",
  "live": "https://main--dc15da58--aemcoder.aem.live/impressum",
  "blocks": ["breadcrumb", "text-additions"],
  "rounds": 1,
  "foundationRequests": 2
}
```

Shell gate criterion is ≤ 2 % per band: 1440 header + footer PASS; 360 header (2.52 %) and footer (2.68 %, EDS footer 990 px vs live 968 px) FAIL → two foundation request lines in `stardust/rollout/foundation-requests.md` (no frozen file edited; `foundation-freeze.mjs check` → `foundation unchanged (18 files)`).

## Files created / changed
- `blocks/breadcrumb/breadcrumb.js`, `blocks/breadcrumb/breadcrumb.css` (new)
- `blocks/text-additions/text-additions.js`, `blocks/text-additions/text-additions.css`, `blocks/text-additions/arrow-right.svg` (new; svg copied from `stardust/prototypes/assets/index/site/arrow-right.svg`)
- `content/impressum.html` (new; sanitised, 74 non-ASCII chars entity-encoded)
- `stardust/eds-schema/impressum.json` (new; `P.` repeat groups pruned, see `pruned`)
- `stardust/eds-conversion-log.md` (tiers + decisions appended)
- `stardust/rollout/units/archetype-impressum-brief.md`, `.paths`, `.report.md`
- `stardust/rollout/foundation-requests.md` (new, 2 lines)
- `stardust/deploy/ledger-archetype-impressum.json` (deploy-batch ledger)
- `stardust/state.json`: impressum row → `status: deployed`, `liveUrl`, `deployedPath` (gate-all selects `status === 'deployed' && liveUrl`; `state.mjs advance` has no `deployed` state, so this was a direct write with a history entry)
- `stardust/rollout/coverage/pages.json` (update-coverage: deployed → verified)
- `stardust/replica/gates/all-1440/impressum/`, `all-360/impressum/` (+ `runs/`): origin/eds captures, pixel/clip/content JSON, `crop-header.png`, `crop-footer.png`, `chrome-live.json`
- `stardust/.work/rollout/archetype-impressum/`: deploy.log, stitch-origin-*.log, chrome-parity-*.txt, band crops

## Decode tiers
- breadcrumb — template-slotted (row 1 page `<h1>` moved into screen-reader `.breadcrumb-title`; row 2 crumb `<ul>` moved into `nav.breadcrumb-trail`; glyph + ">" are pseudo-elements). EW 2/2 editable.
- text-additions — template-slotted (one row per source text module, cells moved whole into the 2/3 flex column + empty 1/3 marginal float; section style `separator` = `.with-section-seperator`). EW 34/34 + 9/9 editable, 0 dead, 0 duplicated.

## Chain evidence
- block-roundtrip per block + whole page: 0 structural 🔴 (one 🟠 EXTRA: the screen-reader `<h1>` has no proto source because the proto classifier skips the hidden h1).
- delivery-lint 0/0/0; media-reconcile nothing (no images); davids-model-lint PASS (2 🟡 D1 justified in the log); localize-links 0 to localize, 5 source-host links kept (targets not in the migration set), no redirects recorded (`stardust/redirects.tsv` not created).
- qa-gate: 18 ok / 1 fail — "2 broken images" are the frozen header's logos (`content.da.live/.../media/chrome/*.png`) which the local dev server cannot fetch; on the preview origin the same images deliver as `./media_…png` (HTTP 200). Everything else green (one h1, blocks loaded, unit counts 6 ≥ 5, cap 1420 holds at 2560).
- `.plain.html`: 200, one `<h1>`, 0 `about:error`, 0 `/img/`; ai-readability 100 % (gate 98). aem.live 200.
- Pipeline transport findings: `<p>&nbsp;</p>` spacers and leading/trailing `<br>` are dropped by the DA→EDS conversion; authored as `<p>&#8203;</p>` / `&#8203;<br>` / `<br>&#8203;` they survive (4 ZWSP spacers). The empty `ul.linklist` of the last addition (20 px on live) is dropped.
- gate-all tooling: `--eds-host` needs the scheme (`https://…`), else "Cannot navigate to invalid URL". The gate-all origin stitch does not dismiss the Usercentrics consent modal (65 % pixel diff); origin re-shot with `stitch-shot.mjs … --dismiss '#usercentrics-cmp-ui #accept'` into the gate dir, then `--skip-existing`.
- Round 1 (the only fix round): breadcrumb section padding lost to `main > .section:first-of-type` specificity (+40 px at 360), button text inherited the body-link blue, trailing `<br>` spacer dropped, horizontal overflow +36 px at 360 (388 px button) → `main .section.text-additions-container { overflow: hidden }` (source: `#Content { overflow: hidden }`); 360 scrollWidth now 360.

## Notes for the next author (datenschutz + later templates)
- Reuse `text-additions` as-is for datenschutz: one row per `.text-modul.default` / `section.addition.show-separation`, h2 first in each addition row; put `style: separator` section-metadata on a `#…with-section-seperator` section.
- Reuse `breadcrumb`: row 1 `<h1>` (screen-reader), row 2 `<ul>`; the active crumb links to the page itself (never `href="#"`).
- Section-level overrides must be written `main .section.<block>-container { … }` — a bare `.<block>-container` loses to `main > .section` / `:first-of-type` in styles.css.
- Buttons: `<em><a>` = purple `.button.secondary` (the source's default link-button face); inside text modules re-assert `a.button { color: #fff }` because the body-link rule (`var(--c-info)`, 700, underline) wins at equal specificity.
- External-link glyph: `a[href^='http']:not([href*='thueringerenergie.de'])::after` with teag-2017 "I" — no icon svg or authored span needed.
- Author spacers as `<p>&#8203;</p>`; `&nbsp;`-only paragraphs and a leading or trailing `<br>` do not survive the pipeline.
- gate-all: pass `--eds-host https://…`; set `stardust/state.json` row to `status: deployed` + `liveUrl` before `--only`; if the origin capture shows the consent modal, re-shoot with `--dismiss '#usercentrics-cmp-ui #accept'` and re-run with `--skip-existing`.
- Footer band at 360 is +22 px (990 vs 968) and the header band 2.52 % — foundation items already requested; do not chase them from a page unit.
- 1440 residual bands (y 3500–4000, tail) are the fixed header bar at stitch chunk boundaries + the live scroll-up button; Δh +25/+1 includes the live 22 blank tail rows.

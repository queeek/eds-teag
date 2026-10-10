# fix-wave-9:index — report (stardust:replica Phase 5, rollout fix wave 9, home page `/`)

Unit brief: stardust/rollout/units/fix-wave-9-index-brief.md. Work dir: stardust/.work/rollout/fix-wave-9-index/.
Scope: the FOUR failing blocks' structure (events F1, social-wall F2, photo-teasers `themes` F3, info-boxes F4) and the
content-presence MISSING count, both widths. Only `/index` content was touched; the shared `photo-teasers` block was
changed under its `themes` variant only (ueber-uns/unternehmen round-trip re-run: 0 🔴, EW 4/4).

## Round table

| round | width | pixel % | Δh (origin − eds) | clipped | MISSING / HIDDEN | units off / missing | verdict |
|---|---|---|---|---|---|---|---|
| before (08:20Z) | 1440 | 16.22 | +68 (8820 / 8752) | 0 | 54 / 0 | 47 / 14 | FAIL |
| before (08:20Z) | 360 | 24.66 | −57 (16193 / 16250) | 0 | 57 / 0 | 37 / 15 | FAIL |
| r1 (08:50Z, fix9i-1440-r1) | 1440 | 17.82 | −20 (8820 / 8840) | 0 | 1 / 0 | 42 / 8 | FAIL (pixel) — the one MISSING is live drift: the featured appointment is now "TEAG-Legend of Cross 31.10." (authored: "Jenaer Kernberglauf", captured 2026-10-08) |
| r1 (08:54Z, fix9i-360-r1) | 360 | 36.56 | −1683 (16913 / 18596) | 0 | 2 / 0 | 42 / 8 | FAIL — themes cards showed all three renditions at 360 (813 / 786 / 831 px vs live 469 / 442; the themes picture rule out-specified the slot rules), + the live drift link and the mobile-only "Zur nächsten Veranstaltung" postback arrow |
| r2 (08:59Z, fix9i-360-r2) | 360 | 29.33 | −680 (16913 / 17593) | 0 | 2 / 0 | 27 / 8 | FAIL — themes fixed (one rendition); the two single-picture Instagram posts render their 9:16 poster at full height (589 px) where the live `li.video-post div.video` is capped at 342 px |
| r2 (09:04Z, fix9i-1440-r2) | 1440 | 18.58 | −48 (8820 / 8868) | 0 | 1 / 0 | 42 / 8 | FAIL (pixel) — same video-post cap missing (2 × +220 px in row 2), section buttons now 54 px |
| **r3 (09:10Z, fix9i-360-r3b)** | 360 | **24.89** | **−74** (probe docH 16913 / 17100) | 0 | **1 / 0** | 29 / 8 | FAIL (pixel, the one drift link, units) |
| **r3 (09:14Z, fix9i-1440-r3)** | 1440 | **17.17** | **+84** (8820 / 8736) | 0 | **1 / 0** | 42 / 8 | FAIL (pixel, the one drift link, units) |

Gate cap (3 rounds per width) reached; no override, no mask, no faked pass. Content MISSING 54 → 1 (1440) and 57 → 1 (360), HIDDEN 0 → 0;
the remaining MISSING at both widths is live content drift (below), not block structure.

## What the round did (code, instruments first)

Measured on the live origin with `measure.mjs` (stardust/.work/rollout/fix-wave-9-index/measure-live.json, 33 selectors,
1440 + 360, read with read-measure.mjs) and lifted from stardust/current/assets/css/ScreenLess.css / ScreenCssAlt.css
(`css-rules.mjs`); nothing eyeballed.

1. **events (F1)** — blocks/events/events.js + events.css. Day labels: the authored label node (text, `<strong>`, or the
   DA round-trip's `<p>`) is MOVED into the day link (`span.events-day-label`); all 10 labels render. Day-link href = the
   calendar page the block's button row carries (static tier — the live `lbDay` links are ASP.NET postbacks, no static
   equivalent; the hidden `.days-menu` entries are links to the same page for the same reason). The authored day `<ul>`/`<li>`,
   month `<p>` and button `<p>` are reused / moved (EW1: round-trip dead 7 → 0). Geometry: live JS spreads the days evenly
   over the 1420 px rail (measured 1440: 7 rendered days → 202.8 px each) → month `flex-basis` and day `left` as
   percentages of the total day count. Rail = `.events-timeline::before` (live `.update-panel-for-timeline .timeline`:
   absolute top 20px, `4px dotted #870d87`, max 1420). Markers = the source's `appointments-day*.png` data URLs
   (ScreenCssAlt.css, 1x; 24×24 / 29×24 "more", active variants; files marker-*.txt). Button = live
   `.commands a.link-button.enlarge` (211×54, 0 30px, 19/54 bold white, computed background-image = the source's
   cut-corner purple face, 9 px `::before/::after`).
2. **social-wall (F2)** — blocks/social-wall/social-wall.js + .css; encoder `socialWall()` emits the block's FIRST row
   `[intro p][tooltip p]` (live `.text-editor-container p` + `div.toolTip` text), the section-level intro `<p>` is dropped.
   decorate renders the intro paragraph with `a.social-wall-tooltip-opener[role=button][aria-label=Tooltip]` (live 18×18,
   2px #6c757d ring, radius 12, FontAwesome `\f129`) and the tooltip panel (`role=tooltip`, `hidden` until click, close
   button "×" aria-label "Dialog schließen", 2px #0ba2e3 border / padding 10). Post shapes from the network cell:
   Instagram = media FIRST (carousel, date, account, collapsed text — live `.post-content` measures 5 px until
   "mehr anzeigen"), LinkedIn = date, account, text, then the carousel inside `.social-wall-wrapper` (live
   `.post-content > div`: margin 12 0 8, left −20, +40 wide). Carousel = live `.slider` (overflow hidden, `ul` N×100 %,
   li 100/N %), controls as presentational elements created by decorate: bullets `a[role=button][aria-label="Zu dieser
   Folie"]` ×N (12px `\f111`, active #0ba2e3), arrows "Zur vorherigen / nächsten Folie" (20px discs, prev hidden on
   slide 0 as the live `btn-left`); click → translate + active bullet (motion record: active-bullet switch only; the
   "mehr anzeigen" click toggles `.expanded` and flips the teag-2017 arrow N → K — nothing else).
3. **photo-teasers `themes` (F3)** — encoder authors cell 3 = h3 only, cell 4 = `<p><a href>DESCRIPTION</a></p>`;
   decorate (themes only) unwraps that anchor (description stays in `.photo-teasers-text`, EW6), wraps the figure in
   `a.photo-teasers-card-link`, adds `span.photo-teasers-divider` and `span.photo-teasers-arrow` (teag-2017 "c", the live
   `span.icon-teag-arrow-right-pos`). Served link text = credits + title + description = the live key. CSS replaced the
   drawn round button with the lifted layout: ≥769 figcaption 50 % + `.container` 80 % (60 % ≥ 1421) centred,
   font `calc(.8em + .2vw)`, title 1.8em / `calc(1em + .9vw)`, divider 25 % / 7px, description 1.2em / 1.2 + padding-bottom
   45 / 55, icon 1.4 / 1.75em absolute bottom; ≤768 stacked card, credits in flow (float right, top −22px), container 96 %
   + 30px 2 %, title 1.6em, description 1.1em + 45px, icon 1.75em (measured 360: a 360×469 = img 187.5 + credits 21 +
   container 261).
4. **info-boxes (F4)** — content: "Anfrage senden" authored `<p><strong><a href="…/privatkunden/service/kontakt">` (the
   live `a#MainContent_CallBack2_c_send` is a postback — static tier), mailto authored WITHOUT `<wbr>`; decorate renders the
   send link as the live face (161×40, 17/40 bold white on the computed cut-corner blue background-image), inserts
   `<wbr>` at the "@" of mailto links by splitting the text node (no character change), and renders the datepicker
   opener `a.info-boxes-calendar[role=button][aria-label="Kalender anzeigen"]` (teag-2017 `\e931`, #870d87, 17×27)
   beside the date field. Both static-tier controls recorded in stardust/dynamic-features.md row D-05.
5. **presence.json** (both widths): `index.variable = ["#MainContent_Aktuelles23058_Modul=.social-wall .social-wall-columns"]`
   — the live social feed is session-variable (new posts daily; per-post slide counts follow the feed).
6. Content pipeline: `build-content.mjs index` (encoder patched: themes cell 3/4, socialWall intro row, formPrep send link +
   no `<wbr>`) → stardust/.work/rollout/fix-wave-9-index/splice-blocks.mjs (themes + social-wall blocks from the encoded
   doc into the HEAD document, intro `<p>` dropped, the two info-boxes cells as targeted edits so the block's localised
   links stay) → sanitise (json-ld row restored byte-identical) → delivery-lint 0/0/0 · davids-model-lint PASS (0 🔴, 5 🟡
   pre-existing) → deploy-batch `/index` OK (ledger stardust/deploy/ledger-fix9-index.json). Diff vs HEAD: 13 + / 9 −, only
   the intended cells (git show 975902f -- content/index.html).

## Files changed

- blocks/events/events.js, blocks/events/events.css
- blocks/social-wall/social-wall.js, blocks/social-wall/social-wall.css
- blocks/photo-teasers/photo-teasers.js, blocks/photo-teasers/photo-teasers.css (themes variant section rewritten)
- blocks/info-boxes/info-boxes.js, blocks/info-boxes/info-boxes.css
- content/index.html (themes link cells, social-wall intro row, callback send link, mailto without `<wbr>`)
- stardust/.work/rollout/cluster-privatkunden-strom-stromtarife/build-content.mjs (encoder; before-copy in the work dir)
- stardust/replica/gates/all-1440/presence.json, stardust/replica/gates/all-360/presence.json (`index.variable`)
- stardust/dynamic-features.md (D-05 row, one line)
- stardust/.work/rollout/fix-wave-9-index/ — measure-live.json, read-measure.mjs, marker-*.txt, btn-bg.txt, send-bg.txt,
  splice-blocks.mjs, proto-server.mjs, roundtrip-*.log, encoded-index.html, head-index.html, served-plain-*.html, crops
- No foundation (styles/, scripts/) edits; no foundation request needed.

## MISSING per class — before (08:20Z gate) → after (final round)

| class (origin link key) | 1440 before | 360 before | cause | after (both widths) |
|---|---|---|---|---|
| events day labels "3.11." … "28.11." | 7 | 0 (timeline hidden ≤ 768) | loose-list `<li><p>` read as a whitespace text node → empty labels | 0 — label node moved into the link |
| social slider bullets "Zu dieser Folie" + arrows "Zur nächsten Folie" | 29 + 4 + 6 + 1 = 40 | 35 + 7 + 6 = 48 | no carousel controls on the served posts | 0 — controls created by decorate (variable region counts them) |
| social intro tooltip opener "Tooltip" | 1 | 1 | plain paragraph, no `a.toolTip-opener` | 0 — intro row + opener + panel |
| themes card links "paul-philipp braun/teag <title> <description>" | 3 (+3 EXTRA title-only links) | 3 (+3 EXTRA) | served card linked the title only | 0 — one anchor around the figure, description text in the link cell |
| info-boxes "anfrage senden" | 1 | 1 | authored `<p><strong>` without a link | 0 — static-tier link to the contact page |
| info-boxes "kalender anzeigen" | 1 | 1 | no datepicker opener | 0 — inert `a[role=button][aria-label]` beside the date field |
| info-boxes "kundenservice @teag.de" (+1 EXTRA with U+200B) | 1 | 1 | DA served U+200B for `<wbr>` | 0 — `<wbr>` inserted by decorate at the "@" |
| events mobile arrow "zur nächsten veranstaltung" | — | 1 | JS-shown live postback arrow, no served counterpart | 0 — static-tier arrow link (≤ 1024 only) |
| live feed drift (Instagram hashtags #teaggruppe #welcomeday …) | 0 | 11 | the 02:50Z origin probe saw other posts than the 08:53Z one — feed is session-variable | 0 at 08:53Z; covered by the `variable` region from now on |
| **live drift: featured appointment** "guido werner/teag teag-legend of cross 31.10.–1.11.26 …" | 0 | 0 | the live panel now features "TEAG-Legend of Cross" (new picture, credits "Guido Werner/TEAG"); the authored teaser is "Jenaer Kernberglauf" (captured 2026-10-08, 17.10.) | **1 at both widths — content refresh, not structure (see Residuals)** |


## Residuals (measured, not fixed — band + cause + inheritor)

| width | band (y) | pixel % | cause (measured) | inheritor |
|---|---|---|---|---|
| both | events panel 8000–8500 @1440 (26.8), 15500–16000 @360 (65.0); MISSING 1 | — | **Live drift**: the featured appointment is now "TEAG-Legend of Cross 31.10.–1.11.26 – Am Burggraben, 99869 Drei Gleichen" with a new picture (credits "Guido Werner/TEAG"); the authored teaser is still "Jenaer Kernberglauf" (captured 2026-10-08). Structure is right (10 labels, rail, markers, button); the panel's picture and bar text differ. | content refresh: extend stardust/.work/rollout/fix-wave-3-index/transform-splice.mjs to the events section (fetch-live → splice → build-content → splice-blocks → deploy) |
| 1440 | 6500–7000 | 38.4 | Social wall: the live feed's first slides / post order differ per session (variable region; counts only). Served post 1 is 574 px as the live one; the pixel delta is image content, not geometry. | none (session-variable by nature) |
| 360 | 11000–11500 | 66.6 | Same social-wall feed variance + the served social section starts ≈ 60 px higher (served intro row 52 px vs live `.text-modul` 137 px incl. 48 px margin-bottom — the h2/intro spacing is default-content, i.e. styles/ (frozen)). | fix-wave-10 or a foundation request if the coordinator wants the 48 px `.text-modul` margin |
| 360 | 5500–6000 | 30.3 | info-boxes: units dh +24 / +10, rows off 16 / 8, missing 2 / 6 — the static form tier renders no field labels ("Vorname", "Name", "Rückrufdatum"…, live `label` elements) and the callback box is 24 px taller; the FAQ list links are cyan bold on the live page too (measured `.icon-list li a` rgb(11,162,227) 700 at 360 — the brief's "bold black" expectation did not hold). | D-04/D-05 form backend owner; static tier stays |
| 360 | 6500–7000 | 30.2 | themes: unit dy +19, dh 0 — the served section starts 19 px lower (default-content h2 margin above the block; styles/ frozen). Card geometry matches (469 / 442 / 470 px vs live 469 / 442). | none in this unit |
| 1440 | 3500–5000 | 15.1 / 17.8 / 25.9 | themes rows start at 3890 vs live 3918 (−28 px, section/h2 spacing, styles/ frozen); title typography matches (`calc(1em + .9vw)` = 29.56 px measured on both). | none in this unit |
| 1440 | 1500–2000 | 16.5 | tariff / keyfacts band — pre-existing (fix-wave-5…8), untouched here. | inherited |
| both | units | off 42 / 29, missing 8 | news-posts column unit: origin 1 `li.column` vs served 4 at 360 (live collapses the news list to one column; the unit map pairs them 1:4) — pre-existing, block not in this unit's scope. | news-posts owner |

## Notes for the next author

- `npm run lint` needed the devDependencies: `npm install --legacy-peer-deps` (+ `@babel/core --no-save`) in the project
  root; package-lock.json was restored, nothing saved. Pre-existing stylelint errors remain in blocks/faq, product-teasers
  and text-module (5) — out of this unit's scope; eslint is clean.
- block-roundtrip prototype maps for the home page: `events=section.veranstaltungen`, `photo-teasers=section.themen-section`,
  `info-boxes=section#PCS16441`, `social-wall="section.aktuelles + section.aktuelles"`; unternehmen:
  `photo-teasers=section#MainContent_PCS30987`. The social-wall round-trip reports 12 MISSING CTA because
  stardust/prototypes/index-proposed.html (07:49Z capture) still shows the pre-refresh posts; info-boxes reports
  "TEAG-Kundenportal" (absolute vs localised href) — both pre-existing and outside this unit's cells.
- The live events timeline is itself dynamic: measure.mjs (08:30Z) rendered 7 day links, the 02:50Z gate 10 — the
  authored 10 days stay; the percentage layout follows whatever count is authored.
- `measure.mjs --json`: per match the values are under `props`; `read-measure.mjs <json> <width> <selRegex>` prints them.
- Proto server: node stardust/.work/rollout/fix-wave-9-index/proto-server.mjs 8791 (pid file stardust/.work/proto-server.pid),
  stopped by that pid at close. One browser at a time held: measure → build-content → round-trips → gates in sequence.

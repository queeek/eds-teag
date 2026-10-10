# fix-wave-4:index — report (stardust:replica Phase 5, rollout fix wave 4, home page `/`)

Unit `fix-wave-4:index`, slug `index`, served `/`, DA `/index`, live https://www.thueringerenergie.de/. Work dir
stardust/.work/rollout/fix-wave-4-index/ (anchor caches, measure JSONs, live.html / served.plain.html snapshots).
Session 23:25Z–23:46Z, deadline 00:02Z; 2 of 3 gate rounds used, both widths sequential (origin.png reused,
`--skip-existing --recapture-eds`). Every fix below came off an instrument (anchor.mjs section table, measure.mjs
box deltas); no override was written, no foundation file touched, content untouched (no re-PUT).

## What the round did

- **Δh (both widths, one box)**: anchor.mjs both sides showed the info-boxes section served 954 vs live 726 @1440
  (+228) and 2461 vs 1949 @360 (+512). measure.mjs union: `.info-boxes-header` h170 @1440 / h140 @360 against the live
  `.widget-header` 36 / 29 — its children sum to 36 px; the box was `styles.css` `header { height: var(--nav-height) }`
  reaching the block's `<header>` elements. Fix `blocks/info-boxes/info-boxes.css`: `.info-boxes-header { height: auto }`
  (block-scoped, no foundation edit) + the 20 px flex `gap` moved into the `>= 1025px` row rule (the column layout at
  360 had gap 20 + margin-bottom 20 = 40 between boxes vs live 20). Measured after: section 729 vs 726 @1440.
- **Events (1440 −172, 360 −83)**: measure.mjs `.veranstaltungen > * > *` live has the `commands` block ("Zum
  Kalender", 144 px @1440 pad 45/45, 99 px @360) that was MISSING on the served page: `scripts.js decorateButtons`
  had already replaced the authored `<strong><a>` with `a.button`, so `events.js`'s `strong a, a strong` finder never
  matched (the same predicate also drove the months filter). Fix `blocks/events/events.js`: finder `a.button, strong a,
  a strong`. And `.events ul { margin: 0 }` (0,1,1) beat `.events-months` (0,1,0): the live `.list-quartals` margin
  `10 0 30` was lost (−30 px) — rule now `.events ul.events-months`.
- Not reached (deadline): the encoder fixes (flattened post links, whole-card anchor pairing), the overrides for the
  carousel-control / postback probe asymmetries (pixel does not pass at either width, so none were allowed), the
  1440 first hot band 1500–2000 (product-teasers), the social wall height.

## Round table

| round | width | pixel % (text %) | Δh px (origin − served) | clipped | content | units | verdict | what changed |
|---|---|---|---|---|---|---|---|---|
| start (roster 23:03Z) | 1440 | 29.17 | +375 | 0 | MISSING 67 | off 50 / missing 14 | FAIL | — |
| start | 360 | 26.84 | −492 | 0 | MISSING 71 | off 39 / missing 15 | FAIL | — |
| 1 (23:30Z) | 1440 | 21.82 (24.72) | +600 | 0 | MISSING 65 | off 47 / missing 14 | FAIL (pixel, height) | info-boxes header height auto, column gap |
| 1 | 360 | 25.55 (28.64) | +6 | 0 | MISSING 68 | off 36 / missing 15 | FAIL (pixel) | same |
| 2 (23:38Z) | 1440 | 22.14 (19.15) | +440 | 0 | MISSING 69 | off 47 / missing 14 | FAIL (pixel; height passes: 440 ≤ 441 = 5 % of 8820) | events commands row + months margin |
| 2 | 360 | 25.77 (32.64) | −99 | 0 | MISSING 57 | off 36 / missing 15 | FAIL (pixel) | same |

Note on the Δh sign: the gate's `heightDelta` is origin − served. The brief's "+375 @1440" meant the served page was
already 375 px SHORTER than the 8820 px origin (live anchor doc 8759 vs served 8445); fixing the info-boxes made it
shorter still (+600) while the pixel number fell 7.4 points because every band from 2750 px down re-aligned. The events
commands block brought it back to +440. At 360 the served page was 492 px taller; after round 2 it is 99 px shorter.
Pixel at 1440 moved 21.82 → 22.14 between the rounds (+0.3) although the only change was the events block: the band
8000–8380 (events/footer) reads 51 % with the new 144 px commands block vs 32 % before — the live `a.link-button.enlarge`
geometry (54 px tall, centred) is not what the global `.button` renders; see Residuals.

Units: the round-1 1440 figure (off 47) is the second run after a cache delete (fix-wave-3 note). Round 2: the 360 gate was
started by run-bg ~20 s before the 1440 gate had finished (run-bg ran both concurrently — it does NOT serialise gate jobs);
the units cache was deleted at the 360 start, so the round-2 units numbers may carry instrument state. The families are
unchanged (keyfact-cards, product-teasers, service-boxes, theme-teasers, news-posts).

## Residuals (band + cause + inheritor)

- **1440 pixel 22.14 % — hot bands** (origin y): 1500–2000 16.5 % (product-teasers `columns-2` padding-top vs live
  150 px — brief lead, not measured this unit); 4000–4500 16.7 % / 4500–5000 25.1 % (themes variant: live natural row
  heights 348 / 392 / 291, text panel typography — fix-wave-3 residual, unchanged); 6500–7000 35.1 %, 7500–8000 48.6 %,
  8000–8380 51.1 % (social wall + events + footer tail). Inheritor: next fix wave (product-teasers first: first hot band
  top-down, measured lead exists in the archetype notes).
- **Social wall @1440 served 1130 vs live 1487 (−357), @360 3559 vs 4156 (−597)** — the single largest Δh/pixel box
  left. measure.mjs with `.social` hit the footer "FOLGEN SIE UNS" element, not the wall; the live wall is the second
  `.page-foot-section.aktuelles` (anchor label) and its inner selectors were not read in this unit. Served: 8 posts
  h388 (content `max-height: 250px` + "mehr anzeigen" 57 px) in 2 rows of 4 @1440. Next author: measure the live
  `.page-foot-section.aktuelles:nth-of-type(2) > * > *` ladder and the post boxes with `--json` before touching
  `blocks/social-wall/social-wall.css` (brief lead; design is the captured one).
- **Events commands button**: live `a.link-button.enlarge` (commands block 144 @1440 / 99 @360 incl. padding) vs the
  served global `.button` inside `.events-commands` — no block rule styles the button yet. The block height now matches
  (+144 / +99 came back) but the band 8000–8380 reads 51 %; measure `.veranstaltungen .commands a` (height, padding,
  font-size, colour) and add `.events-commands .button { … }` in events.css. Inheritor: next fix wave.
- **Section offsets @1440 after round 2** (anchor, served − live): tariff end −35, product-teasers +10, info-boxes +3,
  CTA band: the live `teaser-modul` is `dock-to-previous-section` (section 3368–3735 overlapping the grey info-boxes
  section that ends 3504; visible band 3444–3736) vs served `cta-band-container` 284 px starting where info-boxes ends
  (≈ +39 at the band, +31 at the themes start); themes +21; news −42. Not touched.
- **360 pixel 25.77 % — hot bands**: 2000–3000 (38 / 31 %: product-teasers / tariff panel @360), 5500–8000 (31–62 %:
  info-boxes tail → CTA → themes cards stacked), 14500–15000 84 % (events panel @360), 15500–16000 35 % (footer: the
  360 footer foundation request is still queued — no duplicate added). The 360 anchor also shows hero+tariff ending
  1347 vs live 1270 (+77) and product-teasers 1246 vs 1197 (+49).
- **Content MISSING 69 / 57** (grouped findings n-weighted): (a) `javascript:void(0)` carousel controls "zu dieser Folie" /
  "zur nächsten Folie" of the live sliders (JS, never authored) — probe asymmetry, override NOT written because pixel
  fails at both widths; (b) 7 `__doPostBack` day links "3.11." … "28.11." (events timeline authored as text, EW1 debt);
  (c) 3 themes cards: origin anchor = whole card (credits + title + description) vs served title-only → MISSING + EXTRA
  pair (encoder); (d) 9–10 social-post inline links (Instagram hashtags → `/explore/tags/…` needs the instagram.com host,
  lnkd.in) flattened by `postCell`'s `textOf(p.text)` (encoder, stardust/.work/rollout/archetype-index/index-encoders.js
  via patch-encoder.mjs, then re-encode + re-PUT `/index` --force + publish); (e) singles: "kundenservice@teag.de"
  (zero-width space in the served text), "Kalender anzeigen" / "Anfrage senden" / "tooltip" (JS), "Zum Kalender" →
  `/default` on the origin vs the served absolute mediathek link. The count moves between runs with the live slider
  state (65 → 69 @1440 with no content change). Inheritor: content-encoder follow-up (c, d); events block (b); overrides
  once pixel passes (a, e).
- **Units off 47 / 36, missing 14 / 15**: unchanged families; see the instrument-state note above.

## Files changed

- `blocks/info-boxes/info-boxes.css` — `.info-boxes-header { height: auto }` (+ comment naming the measured cause), flex
  gap moved into the `>= 1025px` row rule. Commit "replica phase 5 fix-wave-4:index: info-boxes widget header height
  auto …".
- `blocks/events/events.js` — `BUTTON = 'a.button, strong a, a strong'` for the months filter and the commands finder.
- `blocks/events/events.css` — `.events ul.events-months` (specificity over `.events ul`), comment.
- `stardust/rollout/units/fix-wave-4-index.report.md` — this file.
- Work dir (uncommitted instruments, under .hlxignore'd stardust/.work): anchor-live-{1440,360}.json, measure-info-boxes.json,
  measure-hdr.json, measure-tail.json, measure-ev.json, live.html, served.plain.html, served-info-boxes.css.
- No foundation file edited; no foundation request added (both fixes were block-scoped). No content re-PUT. No overrides.

## Notes for the next author

- `styles.css` `header { height: var(--nav-height) }` reaches EVERY block that builds a `<header>` element (info-boxes did;
  faq / channel-products / cta-band / three-steps comment "header" but set their own heights — verify with
  `measure.mjs --selectors '.<block> header'` before trusting them). If more blocks hit it, that is a foundation request
  (`header.header`-scoped rule) rather than per-block `height: auto`.
- `scripts.js decorateButtons` runs before block decoration: any `<strong><a>` / `<em><a>` row arrives as
  `div.button-wrapper > a.button.primary|secondary|accent` — never select `strong a` in a block decorator.
- `.events ul { margin: 0 }` style resets at (0,1,1) silently beat `.events-xxx` class rules; the measure.mjs `mar:` column
  shows it (computed 0 vs the rule's value).
- run-bg does NOT serialise gate jobs (two gates ran concurrently for ~20 s this unit); to keep widths sequential, `wait`
  until the first gate is `done` before `start`ing the second (the 100 s wait ceiling returns early — call `wait` again).
- Δh sign: `heightDelta` = origin − served. 1440 is still +440 (just inside 5 %): the next 1440 fix that REMOVES served
  height (e.g. the product-teasers padding-top lead) will push |Δh| over 441 unless the social wall (−357) or events
  button geometry is fixed in the same round — plan both together.
- Anchor caches for the live side are in the work dir (`--cache`); live doc 8759 @1440 / 16794 @360 at 23:26Z, origin
  stitches 8820 / 16156.
- Nothing from this unit is still running; no proto server was started (the preview was measured directly).

# Lift — impressum ("static" page type: impressum + datenschutz; archetype page impressum)

Sources: live measure `impressum-measure-live.json` (text report, 26 selectors, 1440 + 360), captured rules `impressum-cssrules.txt` (css-rules.mjs over ScreenLess.css — the only sheet that matches), build script `build-impressum.cjs` (generic walker over `#Content > article > section.page-content-section`; chrome copied verbatim from index-proposed.html, no active nav item — Impressum is a footer link). Chrome/container/buttons/type: `index.md` (reused unchanged). Breadcrumb/columns/text-modul base rules: same source rules as the article layer (repeated in css/impressum.css).
Doc height live: 1440 → DOM 4601 (header 170 + #Content 4096 + footer 335), stitch 4623 (+22 blank rows); 360 → stitch 6534 (fonts applied; the pre-webfont DOM probe reports #Content 5325 instead of 5405). Build 4601 / 6515.

## Page composition (impressum)
- `#Content > article`: `h1#MainContent_h1Alternative.screen-reader.visible-only` (1×1 abs, canon `.screen-reader`) → `.page-meta-section` breadcrumb → `section.page-content-section` (text-modul.default + 5 × `section.addition.show-separation`, empty `.columns-1-3.marginal-column.float-right`) → `section#PCS10200.page-content-section.with-section-seperator` (text-modul.default + 1 addition, empty marginal `.top`).
- Nothing but text: h2 (addition headers), h3 ×5, p with `<br>` runs (address blocks) and `<strong>`, `ul.linklist` ×4 (one empty), 2 link-buttons inline in p (default purple face 210+20 ×40, 368+20 ×40 with external icon — PNG faces rehosted from the inline data URLs to `assets/impressum/btn/`), mailto/http links. No images, tables, accordions. datenschutz (39 headings) renders from the same layer: h2/h3/p/ul.linklist/strong/a.

## Box model / fonts
- content-box everywhere (source `*` reset); fonts policy as canon. Body text `calc(16px + .08vw)`/1.6 = 17.152 / 16.288 (p, li); `section`/`header`/`div` 16px (so 3em = 48).

## Container model (canon section tier)
- 1440: `.page-meta-section` padding 20 4vw 0, `.center` margin 20 0 0, breadcrumb row 27.44 → section 67. `.page-content-section` padding 20 57.59, `.center` margin 20 0 → content column 1324.8; `.columns-2-3` float left 66 % (874.4) mr 2 %; `.marginal-column` 32 % (423.9) h 0.
- `#PCS10200.with-section-seperator`: padding-top 0; `> .center:first-child` margin-top 0; `> .columns-2-3` border-top 1px #d9d9d9 + padding-top 20; `> .marginal-column` padding-top 20.
- 360: meta padding-top 0 (`.center` margin 20 collapses up to the `#Content` BFC — `#Content{overflow:hidden}` — so `article` starts at y 160); columns 100 % (≤768), **`.marginal-column { margin-top: 30px }` ≤768 — even the empty marginal float adds 30 px inside the clear-fixed `.center` (2 × 30 px on this page)**.

## Text modules
- `.text-modul > header, .text-modul ~ .addition > header { margin-bottom: 3em }` (48), left-aligned (canon centers `.text-modul > header` — override); h2 `calc(1em + .9vw)`/1.2 bold = 28.96 / 19.24 (2 lines 69.47 @1440, 4 lines 92.31 @360).
- `.page-content-section section.addition.show-separation { border-top: 1px solid #d9d9d9; margin-top: 30px; padding-top: 25px }`.
- `.text-modul > h3, .text-modul ~ .addition > h3`: `calc(1.3*16px + .08vw)` = 21.95 / 21.09, lh 1.2, margin 30 0 16 (computed-value lift for the margins).
- p margin-bottom 16; `<br>`-only lines = one line box each; empty `<p></p>` = 0 high + 16 margin (kept verbatim).
- **Body-text links `.text-modul p a, .text-modul ~ .addition p a`: #0ba2e3, weight 700, underline** (computed: rgb(11,162,227)/700; the article layer's purple/400 is NOT what live renders here — bold Noto Sans makes each link line 1 px taller).
- `ul.linklist` mb 20; `section ul.linklist li a` inline-block padding-left 25 #000 bg arrow-right.svg left 5px / 17px (rehosted index asset); captured inline `background-image` on these anchors is dropped (same svg).
- `.text-modul a.link-button`: inline-block relative inside p, h 40 lh 40 padding 0 10 (canon); width from the inline style (210 / 368); `.icon-icons-link-external` inline-block vertical-align middle margin −3 0 0 6 (white in buttons). The 388 px button overflows the 331 px column at 360 on live too (clip-probe "horizontal 2" advisory on both sides; `#Content{overflow:hidden}`).

## Image renditions: none (page has no images). Icons: teag-2017 "i" (breadcrumb home), "I" (external link).

## Gate results
- 1440: iter1 2.12 % / iter2 2.16 % (confirmation after the two 360 fixes), Δh 22, overflow ok, Clipped 0, cap-probe PASS at 2560 (5 rows, `gates/impressum-2560/`). 360: iter1 12.10 % Δh 88 → iter2 8.02 % Δh 19 after (a) `.marginal-column` margin-top 30 ≤768 (+60) and (b) bold blue body links (+5).

## Gate notes (for the next author)
- `measure.mjs` on live at 360 runs before Noto Sans applies: #Content 5325 vs 5405 in the font-asserted stitch (−80 px of text wraps). Use `--against` deltas per element (Δh), not absolute live heights, on text-heavy pages.
- The empty `.marginal-column` is not free: at ≤768 live adds 30 px (margin-top) per section into the clear-fixed `.center`; at `.with-section-seperator` sections another 20 px padding-top.
- Live body-text links in text modules are bold #0ba2e3 (not the purple of the article layer) — lift link colour/weight per page type, it changes line heights by 1 px.
- 360 chrome-parity header: live mobile fixed bar shows "Über uns" as its one nav item on this page; the canon js/index.js bar shows another item → 1 header MISSING delta (canon owner's item, same class as the fixed-bar residual at 1440).
- 1440 chrome-parity 8 header + 1 footer Δx/Δw ≤ 11 px are byte-identical to the gated article round (live DOM probe pre-webfont) — inherited, do not chase.
- 360 band y 500–1000 (14.8 %, not flagged hot): canon `.chat-teaser` panel visible in the build chunk, not in live's (strip-500-iter2.png) — inherited teaser timing; the live mobile fixed bar shows EINBLICKE in the stitch like the build, the "Über uns" MISSING comes from the DOM probe's scroll state.
- Permanent: Δh +22 blank tail rows on live (both widths; 360 measured 19 because the build is 3 px taller than the DOM sum), content-diff 🔴 "Heizkraftwerk Schwarza" mega-menu teaser CTA (header, index capture), visual-diff FLUSH-LEFT flag on the 1×1 screen-reader h1 (live-identical), motion `visible` extra on build (canon `.chat-teaser` timing).

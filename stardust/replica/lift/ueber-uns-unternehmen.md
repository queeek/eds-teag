# Lift — ueber-uns-unternehmen ("listing" page type, 1 page)

Sources: live measure `ueber-uns-unternehmen-measure-live.json` (text report, 51 selectors, 1440 + 360; compact table `-compact.txt`), captured rules `-cssrules.txt` (ScreenLess.css),
outline `-outline.txt`, build script `build-ueber-uns.cjs` (helpers from build-baustrom.cjs; chrome copied verbatim from index-proposed.html with `li.level-1-7.active` = Über uns).
Doc height live: 1440 → stitch 2510 (header 170 + #Content 1983 + footer 335 + 22 blank rows); 360 → stitch 5065 (140 + 3935 + 968 + 22). Build 2487 / 5039.
**The live DOM probe of this page is pre-webfont/pre-equaliser**: it reported the hero card 486 high @1440 and 486 (overflowing, figure 633) @360; the stitch + anchor runs (truth) give 514 / 633.

## Box model / fonts
- content-box everywhere (source `*` reset); fonts as canon (Noto Sans self-hosted). Body-size elements (p, li) `calc(16px + .08vw)` = 17.152 / 16.288; section/div/header 16px. `#Content{overflow:hidden}` (live).

## Page header = list-style-3 product teaser (`.product-teasers-modul.extra-wide.full-content.cover-whole-modul.alternative-page-header`, image right)
- section padding 20 0 (`section.page-content-section.product-teasers-modul.extra-wide` to outrank canon `section.extra-wide{padding:0}`); `.center` 1440 wide margin 20 0; `ul.list-style-3` margin 0 15, padding 20 4% 0 (≤1520 rule; 1294.81 wide @1440), clear-fix (li floats right).
- li `.product-teaser`: relative, float right, width calc(100% − 40px) padding 0 20; **height 514.27 @1440 = live JS equaliser in the font-applied state** (DOM probe said 486.27; stitch/anchor 614-section ⇒ 514). Text `.container` in flow at the top: width **451.607 (JS-set inline)**, padding 20 40 20 0, white; children padding-left 20; p "TEAG" mb 16; h2 **3em** (51.456)/1.2 mb 5; divider inline-block 25 % ml 20 mb 7 **transparent**; description p 17.15/1.6 (9 lines = 246.9).
- picture abs top −20 right −4vw, width `calc(100% + 4vw − 491.607px)` (% = li padding box ⇒ 860.8), PT3_D 1220×685 → 860.8×483.3 natural; shadow 0 20px 92px −45px rgba(0,0,0,.65), 0 0 10px rgba(0,0,0,.1). Credits abs right −4vw, bottom 52.4 (1.4 px above the picture bottom), 13.72/1.6.
- 360 (≤768): ul padding 20 0 0 margin 0 (needs `.alternative-page-header.product-teasers-modul .products.list-style-3` specificity); li float none padding 0 4% width 92 % mb 50 height auto; figure text-align right; picture inline-block relative top −40 mb −40 width 100 % (PT2_S 731×418 → 331×189.4, vertical-align bottom ⇒ line box 149.4); figcaption relative; credits abs right 0 bottom 100 % (image bottom-right); `.container` relative **top 1em** (visual +16.6, no flow impact), padding 10 0, children padding 0, divider ml 0, h2 2em (≤414; `calc(2.1em + .9vw)` ≤1024). li = 149.4 + 483.8 = 633.2 ⇒ section 783.

## Breadcrumb: as baustrom (`.page-meta-section` padding 20 4% 0, ≤1024 padding-top 0; row 27.44 @1440 / 26.44 @360).

## Channel modul (`.page-content-section.channel-modul` > `.modul-content.items-6.columns-1` > empty `header.extra-margin-bottom` (mb **64**, collapses with `.center` 20 ⇒ list starts 64 below the section padding) + `.list-container.style-links-as-text{display:contents}`)
- `ul.boxes.columns-3.clear-fix.boxes-6`: flex wrap, gap 80 (`--flex-gap`; 70 ≤1024, 65 ≤768, 60 ≤414); li width calc(100%/3 − 160px/3) = 388.27 @1440, margin 0, white, **no shadow**; rows stretch (509 @1440 from the longest card); the `clear-fix::after` table is a 0-high flex item ⇒ one trailing row gap (80 / 60) inside the ul — keep `clear-fix` on the ul.
- card `li.box.image-teaser > a` (block, #000): img block 100 % **aspect-ratio 1.64, object-fit cover** (388.27×236.73 / 316.22×192.81, same on live for 365×250 and 493×250 renditions), shadow 0 20px 70px −35px rgba(0,0,0,.65), 0 0 10px rgba(0,0,0,.1); figcaption relative padding 30 30 0 (20 20 0 ≤768), credits abs top −22 right 0 (box padding-right 0, the text span carries the right 5px — unit-geometry); h3 1.3em/1.2 bold mb 30; description mb 20 (p mb 16); footer `.link` bold: `.link-text` with `icon-teag-arrow-right-pos` (glyph "c", purple, mr 6) + text; `.link-button.full-size` display none (style-links-as-text).
- 360: ul padding 15 10 15 5 (316.22 wide), li 100 %, gap 60; li heights 444/419/445/445/367/471.
- Renditions: cards 1–4 PLT_W 1095×750 (365×250 file) at ≤540 and ≥769, 2190×1500 (730×500) at 541–768 (card 2's wide twin is a different image id A01F…); cards 5–6 PLT_W_rdax_100s 986×499 / 1479×749 (493×249). Hero PT3_D ≥1025, PT2_T 769–1024, PT2_S ≤768.

## Gate notes (for the next author)
- Fixed desktop header bar (`.combined-header.fixed`, canon + js/index.js) lacks the live search magnifier and spreads the 7 items wider — same in the gated index build ⇒ every chunk boundary (y 900, 1800 …) costs ~1 point at 1440. Canon owner's item.
- Chat teaser panel (`.chat-teaser`, index.js timing) appears in different chunks than live's moin.ai panel (1440: live-visible/build-not at y 700–880; 360: build-visible/live-not at y 1500–1800) ⇒ a hot ≤500 px band per width, inherited.
- Build mobile bar paints a 50×5 magenta bar under the burger (index chrome) — not on live; negligible pixels, not traced.
- unit-geometry 360 cache: run `diff/unit-geometry.mjs … --width 360 --force` (evidence `gates/<slug>-360/units-iter2b.txt`) — the gate's own 360 units row reused the 1440 origin (all 16 elements "off").
- content-diff 🔴 "Heizkraftwerk Schwarza" CTA = live mega-menu teaser drift (header, index capture) — permanent chrome residual class.

# Lift — privatkunden-strom-stromtarife ("program" page type; also covers -teag-strom-easie, privatkunden-strom-ersatzversorgung)

Sources: live measure `privatkunden-strom-stromtarife-measure-live.json` (150 selectors, 1440 + 360; compact tables `-compact-1440.txt`, `-compact-360.txt`),
captured rules `-cssrules.txt`, `-cssrules2.txt.condensed`, outlines `-outline.txt`, `-outline-deep.txt`. Chrome/container/buttons/type: see `index.md` (reused unchanged).
Doc height live: 1440 → 11703 (DOM probe; header 170 + #Content 11198 + footer 335); 360 → DOM probe 17164 but the stitched capture is 17995
(list-style-2 teasers re-layout to stacked cards only after the live resize handler; the stitch is the truth at 360).

## Box model / fonts
- content-box everywhere (source `*` reset); exceptions as index.md (`select`, `input[type=checkbox]`, and `table` computes border-box). Fonts policy as index (Noto Sans self-hosted, stack order kept).
- Section tier = canon: `section.page-content-section { padding: 20px 4vw }` + `.center { max-width 1420; margin 20px auto }` → column 1325 @1440 / 331 @360.
- Element-level fluid type: body-size elements (p, li) `calc(16px + .08vw)` = 17.152 / 16.288; `section`, `div` stay 16px (em-based offsets such as the eye-catcher `8em` resolve at 16px).

## Page header (`.page-header-section.extra-wide.with-header-subline.has-docked-section`)
- 1440: image 1440×543 (PG_D 1920×724 picked by `(min-width:1025px)`), credits abs right 0 bottom 1 (12.8px/17, bg rgba(255,255,255,.45)); `.bar` relative, width 92 % (1324.8), margin 0 auto, `bottom: calc(8.5em + 1.4*1.05em)` = 159.52 → bar top at 553; `.container` inline-block purple padding 30 (659×122); h1 28.96/1.2 bold white padding-right 30; h2 19.2/1.4 400 white. Section height 665 (bar stays in flow).
- 360: image 360×217 (PG_S), bar static full width, container block padding 30 4vw 50 (331 content), h1 19.24/1.2 (23), h2 19.2/1.4 (54, 2 lines) → bar 157; section 374.
- Next section `#MainContent_PCS16073` (tariff): `margin-top: calc(-8.5em - 20px - 1.4*1.05em)` = −179.52 @1440; `−20px; padding-top 0; .center margin-top 0` ≤1024.

## Tariff section (`.modul-section.dock-to-previous-section.alternative-background-color`, bg #f2f2f2)
- `.tab-control.columns-1.static-integration` tabs-1: tab header `a.shadow` hidden, panel `.container` static (white, padding 20, shadow .3) → 253 high @1440 (form 2 rows + info p 3 lines + 16 margin), 511 @360. Form = index availability check (canon). Siegel row 30 / 20 (margin-top 40).

## Product teasers, list-style-2 (`.product-teasers-modul.extra-wide.full-content`, sections 26438 / 21931 / 23137 / 16169(image right) / 15749 energieBanking)
- section padding 20 0; `.center` 100 % (max 1920) margin 20 auto; `ul.products` margin 0 15px, padding 20px 4vw 0 (→ 1294.81 wide @1440; margin 0 @360).
- li `.box.product-teaser`: relative, float right (image-left lists) / float left (`starts-with-image-right`), width calc(100% − 40px), padding 0 20, white, shadow 0 0 10 rgba(0,0,0,.2). Height = picture height (live JS equaliser) → replicated as `figure { height:0; padding-top: calc((50% + 4vw) * 554/915) }` (image-right: `(50% + 4vw − 40px)`; PT2 915×555 → ×.60656) = 414.7 / 415.5 / 390.5.
- picture abs top −20 left −4vw width calc(50% + 4vw − 20px) = 685 (image-right: right −4vw, width −60px = 645), img 100 %.
- `.container` abs, vertically centred (top 0 bottom 0 margin auto, height fit-content), white: image-left `left calc(50% − 20px); width calc(50% − 20px); padding 20 0 20 40` (667 border-box, 627 content); image-right `left 0; width calc(50% + 20px); padding 20 40 20 0` (707); children padding-right 20. h2 1.5em/1.2 mb 5; divider inline-block 25 %×1 purple mr 20 mb 7 (own line box 27.44); p 17.15/1.6 mb 16 (last 0); `ul.benefit` flex column, li padding-left 28 bg checkmark-pos.svg; `.link` bold, link-button mt .5em 1.15em (face PNG rehosted `assets/<slug>/btn/`). Credits abs left −4vw bottom 21 (image-right: right −4vw) 13.72/1.6.
- energieBanking (`.alternative-background-color`, bg #f2f2f2, section padding-top calc(20px + 1em) after the eye-catcher teaser): li 100 % no card; `.container` relative in flow left 10 % width calc(50% − 20px) padding 20 40 20 0 (content-sized); picture abs right 10 % width calc(50% − 20px) top −20 (627×380); description = p + `ul.icon-list` (li flex lh 2em mb .5em, ul mb 3em) + p; `.link` button; `.additional-content` p + `.columns-3` (two 180×60 badge figures, float left margin 6 40 20 0).
- 360 (from stitch): stacked card — li padding-top 20, picture relative top −40 margin-bottom −40 width 100 %, container static padding 10 0 (h2 24.43/1.2), credits abs top −31 left 0 (image bottom).

## Channel products (`.channel-products-modul.mobile-slider`, 15997 Bestseller / 15996 Weitere Angebote)
- header `.extra-margin-bottom` mb 64 (32 @360); h2 28.96/1.2 centre. `.overflow-container` padding 15, overflow hidden auto; ul flex; li `.box` flex width calc(25% − 15px) (307.64) mr 20 mb 20 white shadow .2 → 714 / 278 high (stretch).
- image-teaser card: section/a flex, figure column; picture 307.64×114.5 (PLT_D 454×169); figcaption flex column padding 20 (relative); credits abs top −22 right 0; header mb 2em (span #767676 inline, h3 1.3em/1.2 mb 0); description p mb 16; h4 1em bold mb 8; benefit list as above; `.footer` flex bg #ededed padding 15 20 margin 30 −20 −20 (min-height calc(3em − 30px)); link bold lh 1.4 flex baseline, icon purple mr 6 top 2.
- image-less card (`.box:not(.image-teaser)`): section padding 20 20 0 width calc(100% − 40px); a column; `.content` flex column grow; footer margin 10 −20 −20.
- controls: margin-top 15, 42 high, opacity 0 @desktop (arrows 40×40 #a0a0a0 circles), visible ≤1024. Footnotes: container mb 20; p flex 12.8/1.4 margin 2 0 .25em, span flex-grow pl 3.
- 360: section padding-right 0; ul width calc(4*88% + 3*30px) (1200.9), li calc(100%/4 − 3*30px/4) = 276.67 mr 30; li 760 / 267 high.

## Teaser modul (not docked; 16420 and 15963 with eye-catcher)
- padding 20 4vw, purple; `.center` margin 20 auto (eye-catcher variant: `calc(20px + 3em)` = 68 @1440, `calc(20px + 2.5em)` = 60 @360); h3 28.96 mb .5em + header mb 1em; description mb 1.5em; blue button 187×40 (dynamic-size PNG).
- eye-catcher: `> section` width calc(100% − 600px); `.eye-catcher-container` abs right 0 bottom calc(−20px − 8em) width 300 (gif 2465×2510 → 305 high); @360 width 36vw right −4vw bottom calc(−20px − 6em).

## Text modul (16174, 16173)
- header h2 28.96/1.2 mb 48; p 17.15/1.6 mb 16; `figure.modul-image` float left margin 6 40 20 0 (501×281; inline img width kept), credits abs right 0 bottom −18 padding 0 0 0 5; `.text-modul > section` mb 30, h3 1.17em (18.72)/1.2 mb 16; `.image-remove-margin figure` margin 0 0 20 (665×422), `.overflow.clear` clears.
- table: inline width 500 → 642 natural (cells nowrap), border-collapse; th.head purple white 20px/1.4 500 padding 10 20; body th/td padding 10 20 border-bottom 1px #000 400; cell p mb 0; p.footnote 12.8/1.4 mt 2. @360 figure inline-block mb 30 width 100 %; table scrolls inside `.scrollable-table_mode-horizontal` (overflow-x auto).

## FAQ (`.module-faq.filter_drop-down-list_modul`)
- widget header h2 `calc(1em + .98vw)` (30.11) + divider; `.service-row` relative margin 35 0 calc(35px − 1em) (149 high @1440, 241 @360); pills `.filter.drop-down-list` inline-block radius 22.25 bg #ededed padding 12.5 15 (111×67 / 101×67): label .6667em bold #6a6a6a, title 1.1em bold #000, fa-chevron-down .7em 18×18 purple; filter-2 floats right (≤1450), filter-3 clears (full width), search pill float right 50 high radius 22.25 padding 0 15: input 185×40 #ededed mr 30, `icon-teag-suche` (glyph "r") 1.5em abs right 15.
- accordion `ul.akkordeon-list` mb 30; li.entry border-bottom 1px #a0a0a0 padding-bottom 16 mb 16; `p.topic` flex 1.05em/1.6 bold, title calc(100% − 30px), `icon-teag-arrow-down-pos` (glyph "a") 30×30 purple; answer `.container` hidden (display none, opened by click on live).
- 360: pills full width (padding 12.5 3 %, width 94 %), chevron abs right 3 % top 12; search padding 12.5 20 width calc(100% − 40px).

## Shared with index (canon): key facts (`#List15395`, li>section margin-bottom 0 here), 1-2-3 steps, service boxes (`#MainContent_Boxes15425`, centred widget h2 header mb 48, divider inline-block), callback form.
## Image renditions: hero PG_D/PG_S (+PG_T), product PT2_D (915×554/555) both widths, channel PLT_D (454×169) @1440 / PLT_S @360, text-modul M_A 501×281 & 665×422, badges M_A 180×60, eye-catcher animated gif (restoreAtDelivery: the gif animates on live; captured frame differs per run).

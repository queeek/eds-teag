# Lift — index (landing), thueringerenergie.de/default

Full per-selector tables (live, computed, both widths): `index-table-1440.txt`, `index-table-360.txt`
(from `index-measure-live.json`, 339 selectors). Anchors cached in `gates/index-{1440,360}/anchor-live.json`.
Doc height live: 1440 → 8737–8759 px (run-to-run drift from the social wall); 360 → 16819–16951 px.

## Box model
- Every container family is **content-box** (source `*` reset sets margin/padding/font-family only).
  Only `select` (callback form) and `input[type=checkbox]` compute border-box. No universal border-box reset.
- Inputs: `width: calc(100% - 18px)` + padding 0 9px (content-box) = 100 %.

## Container model (the sizing MODEL, not px)
- Section tier: `section.page-content-section { padding: 20px 4vw }` (57.59 @1440, 14.39 @360); inner `.center { width:100%; max-width:1420px; margin:20px auto; position:relative }` → content column 1325 @1440, 331 @360, capped 1420 at probeWidth 2560.
- `section.extra-wide > .center { max-width: 1920px; width:100% }`, `≤1919px: max-width:100%` (hero, themes, events are full-bleed).
- Header `.center`: margin `0 4vw`, no cap below 1920 (1321 @1440); nav `.center`: `max-width:1420px; margin:0 auto` (x 10 @1440). Footer `.center`: width auto inside `padding 0 15px` (1410 @1440), 1420 cap at ≥1920.
- `.center` margins collapse with child margins (no BFC): siegel-row margin-top 40 collapses with .center 20 → row at section+20+40.
- Fluid type formula used site-wide: body text `calc(16px + .08vw)` (17.152 @1440 / 16.288 @360), lh 1.6; h2 `calc(1em + .9vw)` (28.96 / 19.24); keyFacts h3 `calc(1em + .58vw)`; `.aktuelles h2, .veranstaltungen h2` 1.9em (30.4 fixed); label 16px/1.6; input/select 14px.

## Chrome
- Header 170 @1440 (section-1 90 white + section-2 80 purple #870d87, shadow 0 0 15px rgba(0,0,0,.2)); 140 @360 (90 + 50).
- Logo 147×53 at y 19. Quick links (Kundenportal/Karriere) 17.152px #767676 icons #870d87, titles hidden ≤1024; search pill 250×45 #ededed radius 22.25 at top 21 (hidden ≤768); contrast switch pill 37×25 border 1px #8c8c8c radius 18, knob 23 #767676, label hidden ≤1024.
- Desktop nav: 7 items uppercase bold 17.152 white lh 80, padding 0 15, flex-grow row filling 1420. ≤1024: burger li.nav-button 68×50 (icon bg purple 45 wide at left 11 top 3), items hidden.
- Footer 335 @1440: section-1 purple padding 30 15 15, `.center` flex space-between wrap margin 20 0: contact (h3 uppercase 18.72/40, li 600 lh 40, label pl 16 w 60), social (li 45 wide font calc(1em+.9vw), FontAwesome), newsletter min-width 40 % (p 500 mb 15, input 320+13 pad ×40 white, button 155×40). section-2 padding 0 15, `.center` flex flex-end padding-top 25, li inline-block lh 50 mr 30, copyright flex-grow 1 span border-left 1px #000 pl 30. @360: 968 (section-1 padding 20 4vw 40; newsletter margin-top 15; section-2 nav column li lh 40, ul mb 20, copyright mb 15 lh 25.6).

## Buttons
- `.link-button`: inline-block h 40 lh 40 padding 0 10 #fff bold 17px nowrap center; face = inline-style background PNG (rehosted `assets/index/btn/<hash>.png`, flat colour with cut bottom-right corner), width = png − 20; `.enlarge` h 54 lh 54 19px padding 0 30 (png 220/211 ×54); `.full-size` width calc(100% − 20px); `.blue` #0ba2e3; default #870d87.

## Hero (slider-section, bg #f2f2f2)
- Image 1440×540 @1440 (S_D 5757×2160 → 1919×720 natural, picked by `(min-width:840px)`), 360×220 @360 (S_S 1080×660, `<415`), S_T between.
- `.bar`: abs right 0 bottom 100 max-width 30 % padding 25 purple; title 1.5em/1.2 bold; description 1.05em/1.4, icon .8em ml 4. ≤1024: static, max-width 100 %, padding-bottom calc(2em + 25px).
- Controls: flex gap 10, bottom 25 from image, centered (174×44); group padding 2 gap 16 bg rgba(255,255,255,.5) radius 9999; arrows 40×40 #870d87 font 40; bullets li 12×35; pause hidden (paused state → play shown).
- Credits: abs right 0 bottom −1 (above image bottom) bg rgba(255,255,255,.45) .8em/1.6 padding 0 5.
- Tabs wrap `.center` margin-top −32 padding 0 25 50 → tabs row y 678 (81 high ×3 = 1390/3), a.shadow lh 80 1.2em bold uppercase shadow 0 0 15 rgba(0,0,0,.3), icon #0ba2e3; panel (abs on live, static here) padding 20 white shadow, h 237 @1440 / 495 @360. @360: tab 103×88, a padding-top 40 font 11.744/19, icon abs top 10 font 24.

## Tariff form (Strom; Erdgas hidden twin)
- module .container padding 20; form flex: address 32 % (mr 34.3) / consumption 65.3 %. label 16/1.6 mb 2; PLZ input 43 high #ededed 14px padding 0 25 0 9 mb 15; "Erweiterte Filter" bold pl 25 bg arrow-right.svg.
- Consumption: minus/plus 30×30 purple radius 5 (hidden @360); dots: active 27 purple circle white bold, inactive 14 #a0a0a0 (mt 8.576 ml 10.29) label span abs pt 1.6em #a0a0a0 24 wide; line abs 1px #a0a0a0 at y center; li mr 20 w 37.
- Verbrauch input w calc(100% − 58px) + "kWh" label 33; Calculate full-size 40 at y +58. info p padding 0 20 lh 1.4 (@360 padding 20 0 0).

## Siegel row: ul flex center, li 0×0 margin 0 30 30 (@360 0 20 20) → row 30/20 high.
## Key facts: header mb 48; li flex 1 mr 20 (last 0), section padding 20 text center, icon 2.5em circle padding .25em border 2 purple bg purple #fff mb .5em; h3 purple; p mb 16; section mb 1.6em. @360 column, li mb 30, icon left (mr .5em), text left.
## Product teasers: ul padding-top 150; li calc(50% − 20px) mr 20 padding 20 white shadow .2, **height 377.625px fixed (live JS equaliser, kept at 360 too)**; figure 95 % wide; picture margin-top −150; credits abs top −30 right 0; container padding 20 center; h2 1.5em/1.2 mb 5; divider 25 % ×1 purple ml 20 mb 7; p 1.6; .link bold; button mt .5em 1.15em. @360 li 100 %, PT_S 667×388.
## Steps: header mb 64; container flex margin 0 10 %; step 21 % column center; symbol 5em circle mb 2em, span 3em bold; content header margin 0 5 % 1em; h4 1.3em/1.2 mb 8; connector 17 %: bow abs h 9em w 150 % left −25 % border-top 2 dashed purple radius 50 %; cover abs white top 2.5em h 3.5em inset −2. @360: step row padding-bottom 48, symbol 4.5em mr 16, span 2.5em, content mt 20 left; connector-vertical abs left 50 top symbol-bottom h 121 border-left 3 dashed? (measured 3 wide).
## Service boxes: ul flex gap 20, li flex 1 stretch white shadow .2 mb 20; sections padding 20 20 0 / 20; widget h3 1.3056em/1.2, divider block 1px #8c8c8c mt .5em, header mb 26; icon-list li flex mb 1em, icon 1.1em mr .55em, label bold pr .25em, hilite #0ba2e3 bold, suffix #767676 600 pl .5em; link-list li mb .75em a bold, icon purple mr 6; figure mb 20. Callback: p mb 16; inputs 43 (#ededed), names 190 float l/r (@360 143), date flex + calendar icon, select 43 border-box, checkbox row mt 20 mb 20 label .85em/1.4 pl 6, send 161×40 float right. @360 column.
## Teaser-modul: margin-top −136; padding 104 4vw 20 (@360 0 4vw 20, .center margin 0 0 20); purple; header mb 48; description mb 1.5em; button 207×40 blue. Previous section z-index above.
## Themes (extra-wide, #f2f2f2): header pt 100 mb 48; li 100 % h = img (50 %, TLT_D 960×449, opacity .9) alternating left/right; figcaption abs other half; container 60 % abs centered font calc(.8em+.2vw); title calc(1em+.9vw)/1.2 (@360 1.6em); divider 25 % mb 7; description 1.2em/1.2 pb 55 (@360 1.1em pb 45), icon abs bottom 0 1.75em purple; credits odd: w 100 % right 100 % bottom 1 text-right; even: right −100 %. @360 stacked: img 100 % (TLT_S 768×399), credits relative top −22 in flow 21 high, container inline-block padding 30 2vw. commands padding 45 0, button 220×54.
## News/Social (.aktuelles): padding 20 4vw, no bg; h2 1.9em; header mb 48 (`.extra-margin-bottom` = 48); columns float w calc(25% − 15px) mr 20 (@360 100 %); post inline-block 100 % mb 20 white shadow .2; a padding 15 20 0; date/post-label 1.6; p.text 1.1em bold/1.4 mb 8; description/link 1.4 mb 8; link icon .8em purple mr 4. Social: date padding 15 20 0 (fa #0a66c2 pr 4), p.text padding 0 20, post-content padding 0 20 12 max-height 250 overflow hidden (collapsed), carousel left −20 w +40 slides-6 width 600 %, img bg #666, dots abs bottom 10 center #0ba2e3 12px, commands padding 15 20 right .9em #0a66c2. Instagram video: .video max-height 342 collapsed mask; post-content max-height 5px. commands padding 0 0 45. Social wall is **nondeterministic live** (posts/ids changed between capture and gate → permanent residual).
## Events (extra-wide, padding 20 0): h2 mb 40; panel white shadow .2 padding-bottom 15 (@360 0); appointment margin 10 0 20; teaser image 100 % (ALT_D 1920×487 → 1440×365; @360 ALT_S); bar abs top 60 right 0 padding 15 40 max-width 40 % lh 1.2 white on purple; title 1.9em bold, meta 1.2em icon .7em pl 6; nav buttons abs 35×35 (arrow-only-*.svg) hidden desktop; timeline ul margin 10 0 30 h 32 max-width 1420 (hidden @360): month li inline widths 426/994, days abs left 71+142n, day-link 24×24 bg png ml −6 (more 29.25), span abs bottom −19 .65em 600; commands padding 45 0 (@360 45 0 0) button 211×54.
## Image renditions per width: see `index-asset-map.json`; selected: hero S_D/S_S, product PT_D/PT_S, themes TLT_D/TLT_S, events ALT_D/ALT_S, box figure PLT_W both widths, social 1200×800 & 1080×1350 both.
## Fonts: Noto Sans 400/700 (+italics) self-hosted from capture; stack "Segoe UI","Noto Sans","San Francisco",Roboto,Helvetica,Arial,sans-serif kept; `body{text-rendering:geometricPrecision}`; icon fonts teag-2017 (woff/ttf) + FontAwesome 4.7 woff2 self-hosted.

## Gate notes (for the next archetype)
- Live overlays: Usercentrics **v3** (`aside#usercentrics-cmp-ui`, shadow DOM, button `#accept` "Alle Cookies zulassen") is NOT caught by the shared consent candidates -> take the live stitches yourself: `stitch-shot.mjs LIVE gates/<slug>-<w>/live.png --width W --settle --wait 5000 --consent '#usercentrics-cmp-ui #accept'` (gate.sh reuses live.png). The moin.ai teaser is an iframe (cannot be dismissed) -> replicated as fixed chrome (canon `.chat-teaser`, `.scroll-up`).
- Fixed chrome: desktop `.combined-header.fixed` (80px: logo + 7 items + search) once scrollY > 170; mobile (<=1024) `.seperated-header.fixed` (50px: burger + one nav item); `#PageHeader{height:140px}` at <=1024 keeps the page height stable when the bar goes fixed; `#Widgets` service/login tabs fixed at top 197 (hidden <=1024). JS in js/index.js.
- Live DOM probes (anchor/measure/unit-geometry/chrome-parity) may run before the Noto Sans webfont applies -> 2-line vs 3-line wraps; the stitched pixel captures assert fonts and match the build.
- Live content drifts between runs: themes list, mega-menu teaser, social wall (posts, order, hashtags) -> permanent residual class.

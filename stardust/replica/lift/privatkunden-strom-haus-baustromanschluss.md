# Lift — privatkunden-strom-haus-baustromanschluss ("article" page type, 1 page)

Sources: live measure `privatkunden-strom-haus-baustromanschluss-measure-live.json` (43 selectors, 1440 + 360, text report), captured rules via css-rules.mjs (ScreenLess.css),
build script `build-baustrom.cjs` (helpers sliced from build-stromtarife.cjs; chrome copied verbatim from index-proposed.html with `li.level-1-1.active`). Chrome/container/buttons/type: `index.md` (reused unchanged).
Doc height live: 1440 → DOM 1688 (header 170 + #Content 1183 + footer 335) but root scrollHeight / stitch 1710 (+22 blank rows below the footer; every body child beyond the footer is 0×0);
360 → DOM 2483 (140 + 1375 + 968), stitch 2505 (+22 again). Build = DOM sums (1688 / 2483).

## Box model / fonts
- content-box everywhere (source `*` reset); fonts policy as canon (Noto Sans self-hosted, stack order kept). Body-size elements (p, li) `calc(16px + .08vw)` = 17.152 / 16.288; `section`, `div`, `header` 16px.

## Page header (`.page-header-section.extra-wide`, title-only bar, NO docked section)
- section `padding: 0 0 54px` (must be written `section.page-header-section` — canon `section.extra-wide{padding:0}` outranks a lone class); `.center` margin 0 0 20 → section 617 @1440.
- 1440: image 1440×543 (PG_D 1920×724 via `(min-width:840px)`), credits abs right 0 bottom 1 (12.8px/17, rgba(255,255,255,.45)); `div.bar` **absolute left 0 bottom −70px** width 60 % (inline style `width:calc(66.6667%)` → 960) purple; `.container` float right width 75 % (720) padding 30 0; h1 28.96/1.2 bold white padding-right 30 → bar 94.73 high, top at image-bottom −25.
- 360: section padding-bottom 0; image 360×217 (PG_S 375×226, `<376`; PG_T between); bar static full width (inline position/width overridden with !important ≤1024); container padding `calc(15px + .5vw)` ×3 + left 4 % (16.8 / 14.39); h1 19.24/1.2 → bar 56.67; section 273.6.

## Page meta (breadcrumb)
- `.page-meta-section` padding 20px 4 % 0 (@≤1024 padding-top 0); `.center` margin 20 0 0; li inline 17.152/1.6; a .9em (15.44) #767676 400, `a::after` ">" padding 0 6 inline-block (none on last); home `span.icon[data-icon="i"]` inline-block mr 6; `li.active a` #870d87. Row 27.44 @1440 (section 67), 2 lines 52.9 @360 (section 53).

## Article section `#PCS871` (canon section tier: padding 20 4vw, `.center` margin 20 auto, clear-fix)
- `.columns-2-3` float left width 66 % mr 2 % (874.4); `.columns-1-3.marginal-column.float-right.top` float right width 32 % (423.9). ≤768: both 100 %, marginal margin-top 30.
- text-modul: header mb 48 (left-aligned; canon centers `.text-modul > header` — override), h2 28.96/19.24 /1.2; p 17.152/1.6 mb 16 (two `&nbsp;`-only p's = 27.44 each); `> section` mb 30, h3 1.17em (18.72)/1.2 mb 16; `ul.linklist` mb 20, `li a` inline-block padding-left 25 bg `arrow-right.svg` left 5px / 17px (rehosted index asset), colour #000; `.icon-icons-link-external` inline-block vertical-align middle margin −3 0 0 6 purple (white inside link-button); first li carries a trailing `&nbsp;` text node (wraps to its own 26px line @360 → li 104 vs a 78).
- marginal box `section.box.call-to-action`: margin 0 0 30 30 (left 0 ≤768), padding 20, purple, white text, shadow .2 (canon .box); header mb 0; h3 1.5em/1.6 padding 0 0 5 border-bottom 1px #870d87 (invisible on purple, +1px) — ≤768 font `calc(1em + .9vw)` (19.24); empty `.service-container` 66 high @1440 / 88 @360 (computed-value lift: min-height; the source rule was not found in the sheets); `.link-container` mt 30; blue link-button 201+20×40 (face PNG rehosted `assets/<slug>/btn/`), external icon white.
- Build boxes matched live within 1px at both widths after the two fixes (hero padding selector, mobile h3 size).

## Image renditions: hero PG_D 1920×724 @1440 / PG_S 375×226 @360 (+PG_T); no other images. Icons: teag-2017 glyphs "i" (home), "I" (external link); FontAwesome © in credits.

## Gate notes (for the next author)
- unit-geometry caches the live origin per slug WITHOUT width at `stardust/current/measure/<slug>-units.json`: the 360 round reused the 1440 origin (→ bogus "off 5"). Re-run `stardust/scripts/diff/unit-geometry.mjs … --width 360 --force` (evidence `gates/<slug>-360/units-iter2b.json`) or delete that cache before the 360 round.
- cap-probe treats every element child of `#Content` as a module: keep `.scroll-up` OUTSIDE `<main id="Content">` (live has `article` + script only) or the article collapses to one 1920-capped module and the 1420 row fails.
- Live scrollHeight exceeds the three roots' sum by 22 px at both widths (blank rows) → permanent Δheight 22 residual for this page type unless the source element is identified.
- Live content drifted after capture (content-diff 🟡 "Sie benötigen einen Haus- oder Baustromanschluss…" exists on live, not in the capture); capture is the spec.

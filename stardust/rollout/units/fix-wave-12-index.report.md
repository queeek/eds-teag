# fix-wave-12:index — report (2026-10-09, 11:12Z–11:58Z, published-origin gate `gate-all --only index --recapture-eds`, origins reused: 1440 = the 10:01Z `stitch-shot --consent` shot, 360 = the 10:05Z re-stitch)

Unit `fix-wave-12:index`, home page `/`. Verdict: **1440 pixel bar PASSED (9.7 %) — FAIL on content (4 live-drift MISSING links) + 1 unit row; 360 FAIL (18.96 %)**. Six rounds (cap 3 per width), four code commits (6ba429f, e203b5d, 57441dd, f2957e0, 8b9fe14 + the close commit), no content change, no overrides, no masks.

## Round table

| job | width | pixel % (text) | Δh | clipped | MISSING / HIDDEN | units off / missing | verdict |
|---|---|---|---|---|---|---|---|
| wave-11 r3 (baseline) | 1440 | 10.1 | +44 | 0 | 0 / 0 | 42 / 8 | FAIL |
| fix12i-1440-r1 (as is, news fix b6cc2dd now in the shot) 11:15Z | 1440 | 10.74 (15.2) | +36 | 0 | 0 / 0 | 29 / 8 | FAIL pixel |
| fix12i-1440-r2 (info-boxes + themes + news fixes) 11:48Z | 1440 | 9.71 (14.79) | +41 | 0 | 4 / 0 | 5 / 7 | FAIL content + units (pixel ✓) |
| fix12i-1440-r3 (label padding, Weiterlesen block) 11:53Z | 1440 | **9.7** (14.77) | +41 | 0 | 4 / 0 | 1 / 7 | FAIL content + units (pixel ✓) |
| wave-11 r3 (baseline) | 360 | 16.04 | +52 | 0 | 0 / 0 | 29 / 8 | FAIL |
| fix12i-360-r1 (info-boxes 360 geometry + themes h2 +60) 11:31Z | 360 | 16.7 (17.11) | +48 | 0 | 1 / 0 | 8 / 7 | FAIL |
| fix12i-360-r2 (news card margins, unit rows; consent-label JS bug +19 px) 11:40Z | 360 | 23.46 (20.03) | −15 | 0 | 1 / 0 | 5 / 7 | FAIL |
| fix12i-360-r3 (consent-label fix) 11:45Z | 360 | **18.96** (18.65) | +4 | 0 | 1 / 0 | 2 / 7 | FAIL |

Pass bar per width: pixel ≤ 10, |Δh| ≤ 5 %, clipped 0, MISSING + HIDDEN 0, required units within tolerance. The 7 "missing" unit rows at both widths are the same 7 as in waves 10–11 (declaration rows with no served counterpart, unchanged by this wave). The 8b9fe14 round-3 code is what the 1440 r3 shot measured; the close commit only re-wraps one comment line in news-posts.js (eslint max-len).

## What the rounds did (instruments first)

1. **1440 r1** — re-gate as is. The news-posts fix (b6cc2dd) moved the page: 5500–6000 11.x → 7.7, Δh 44 → 36, units off 42 → 29, but 6500–7000 (social) 17.8 → 22.3 and the total 10.1 → 10.74 (offset-contaminated below news).
2. **measure.mjs, live vs served, 1440 + 360 in one run per side** (`.service-boxes …` vs `.info-boxes-…`, `--all-matches`, files stardust/.work/rollout/fix-wave-12-index/measure-live-r1.json / measure-eds-r1.json; tabulated with tab.mjs there). Live box heights at 360: 650 / 636 / 523, served 674 / 646 / 540 (+24 +10 +17 = the +51). Causes, all lifted from ScreenLess.css (`css-rules.mjs … "service-boxes|icon-list|\.entries|\.hilite|widget-header|\.divider|link-list"`):
   - `.campaign .service-column .box .widget-header { margin-bottom: 1.5em }` (served 26 px), `h3 { font-size: 1em }` at ≤ 768 (served 1.3056em → header 35 vs 29, four widgets);
   - `.widget-header .divider { width: 57.5% }` (223 of 388 @1440, 167 of 291 @360; served 100 %);
   - `.icon-list .entry { display: flex }`, `.icon { margin-right: .5em; font-size: 1.1em }` → one-line rows measure 30 / 29 (the icon's line box), served 27 / 26 with 23 px text boxes (the dh −7 rows); entries with br / annotation / suffix live in `span.entries` (served: `.info-boxes-entries` built in JS), `.suffix` "(24h)" (padding-left .5em, #767676, 600), the annotation lines after the first `<br>` wrapped as `.info-boxes-annotation`;
   - `.link-list li:last-child` without margin (served clearfix kept 12 px inside two boxes);
   - `.netzstoerung .icon-list .entry .label { display: block }` at ≤ 414 (served inline label pushed "0800" onto the label line);
   - call-back form: name inputs 49 % + 49 % (served 162 / 184 of 388), input margin-bottom 15 (served 16 via `.info-boxes-content p`), date input `calc(100% - 22px)` with the calendar opener 17 × 27 on the content edge, `div.checkBox` = checkbox (13 px, margin 3) + label (block, padding-left 6) → served `::before` + `span.info-boxes-consent-label` in a flex p, label link 400 (styles' `main a:any-link { 700 }` trap), `margin-top: 35px` on that row (live select margin 15 + div margin 20 do not collapse — the select is inline-block), `.info-boxes-send` without trailing margin (served +16 inside the clearfix);
   - external link glyph on "Störungsauskunft" (teag-2017 "I" in a 23 px box, margin 6 — live 207 vs served 178).
   After the first push: served boxes 650 / 635 / 520 @360, 625 @1440 (live 626), section 1945 vs live 1949 (measure-eds-r2.json).
3. **Themes**: the wave-11 `+60` (`.default-content-wrapper:first-child { padding-top: 60px }`) now applies at every width (its `>= 1025` guard removed — the info-boxes height was the blocker); credits `font-weight: 400` (card link inherited 700, dw 10); even-card credits `width: auto` at ≤ 768 (live ≤ 768 rule sets no width — only odd cards keep the desktop 100 %; gate units 360 r1 dx −180).
4. **360 r1** 16.7 %: info-boxes in place (section +8 upstream only), but the whole lower page still off. measure.mjs news at 360 (measure-live-news-360.json / measure-eds-news-360.json): the two news-post cards (no "Pressemitteilung" label) end with `p.link` margin-bottom **20** (press cards 8) → live 218 / 291 vs served 206 / 279 (also the 1440 unit row li#TEAG_30991 dh −12); last card → `.commands` 60 on live vs 40 served → `padding-top: 20px` on the commands wrapper at ≤ 1024 (measured at 360 only). Together +44 → served social columns 11074 vs live DOM 11051 (+23, of which +8 upstream and the +15 below).
5. **360 r2** 23.46 %, Δh −15: a JS bug — the consent-label wrapper read `previousElementSibling` after the previous cell child had already moved into the container, so nothing was wrapped and the flex p split "Ich habe die" / link / "gelesen…" into three items (+19 px, Datenschutz link dx −46). Fixed in f2957e0 (`container.lastElementChild`).
6. **360 r3** 18.96 %, Δh +4, units off 2: residual bands are the social wall and below (see Residuals). 360 cap reached.
7. **1440 r2** 9.71 % (pixel ✓), units off 5: label padding lost inside the new wrapper (Serviceline a dx −5, Gas label dw −5 → `.info-boxes-entries > strong { padding-right: .25em }`), entries `flex: 0 1 auto` (live span.entries shrinks to its longest line — at ≤ 414 the block labels measure 164 like live, not 264 / 141), "Weiterlesen": live `p.link` is the block carrying icon + text (276 × 24) — the served inline `a` measured 102 at x 38 → icon inside the link, `a { display: block }`. **1440 r3** 9.7 %, units off 1 (product-teasers).

## Files changed

- blocks/info-boxes/info-boxes.css — header margin 1.5em, title 1em ≤ 768, divider 57.5 %, flex entry rows + `.info-boxes-entries` / `-suffix` / `-annotation` / `-consent-label`, link-list last li, external glyph box, form field widths / margins, calendar opener geometry, consent row (flex, ::before box, margin 35), send row margin, netzstoerung label block ≤ 414.
- blocks/info-boxes/info-boxes.js — `wrapEntry()` (entries / suffix / annotation wrappers for the icon-list rows), consent-label wrapper.
- blocks/photo-teasers/photo-teasers.css — themes h2 +60 at every width (home-page `:has(.photo-teasers.themes)` scope kept), themes credits 400, even-card credits width auto ≤ 768. The ueber-uns-unternehmen instance is untouched (all three rules are `.photo-teasers.themes` / `:has(.photo-teasers.themes)` scoped).
- blocks/news-posts/news-posts.css + .js — news-post variant `p.news-posts-more { margin-bottom: 20px }`, commands wrapper padding-top 20 ≤ 1024, Weiterlesen block link with the icon inside.
- No content, no styles/, no scripts/, no units.json / presence.json / overrides.json. Other pages: news-posts, info-boxes and the themes variant exist only on `/`; product-teasers was NOT touched (its dw 5 row would need a rule that also hits the stromtarife pages).

Evidence: stardust/replica/gates/all-1440/index/ (r3 state), all-360/index/ (r3 state), runs/ 11-15-04 / 11-48-31 / 11-53-06 (1440) and 11-31-41 / 11-40-29 / 11-45-45 (360); run-bg json + logs stardust/.work/replica/bg/fix12i-*; measurements, crops (crop-360-r1-6500 / -11000), pixel snapshots per round and roundtrip logs under stardust/.work/rollout/fix-wave-12-index/.

## Residuals (band + cause + inheritor)

1440 (9.7 % — pixel bar met; FAIL by content + units):
- **Content MISSING 4 — live drift, not derivable**: the live events section gained "Jenaer Kernberglauf 17.10.26 …" (→ /Ueber_uns/Mediathek/Veranstaltungen.aspx) and the timeline day links 17.10. / 27.10. / 3.11. (postback links) since the frozen content; the 1440 r1 probe at 11:14Z still had MISSING 0, the 360 r1 probe at 11:30Z already 1. Inheritor: a content refresh of the events section via the wave-10 fetch chain (fetch-live.mjs → transform-splice.mjs → splice-blocks.mjs; keep the localised events hrefs and the json-ld row byte-identical), then one re-gate per width. Note the pixel origins (10:01Z / 10:05Z shots) predate that live change too, so a refresh also needs re-shot origins (`stitch-shot --consent`).
- 4500–5000 (17.6) themes rows: unchanged from wave 11 — geometry equal, photos differ (live renditions changed since the 09:27Z fetch). Inheritor: themes content refresh (brief § D), not CSS.
- 6500–7000 (19.9) social: live LinkedIn post 1 hides its "mehr anzeigen" row (336 vs served 395) — the wave-11 non-derivable rule; the +59 shifts the rest of the column. Inheritor: coordinator decision (units-only override candidate — see notes).
- 8000–8500 (17.1) events: picture rendition + the live events list drift above; footer 336 vs live ≈ 389 (chrome).
- Units: 1 required row off — `.product-teasers .product-teasers-card u1 link "zu den erdgastarifen"` dw 5 (237 vs 232, `font-size: 1.18em` vs the live bold face). Not fixed here because every product-teasers rule also renders on the stromtarife pages (brief: other pages unchanged); a home-page-scoped selector needs the coordinator's say. 7 missing rows as before.

360 (18.96 %):
- 0–5500 all ≤ 8.3 (info-boxes section 1945 vs live 1949, +8 upstream from the product-teasers / keyfacts region as in wave 11).
- 5500–7500 (13 / 9.2 / 18.7 / 10.8) info-boxes bottom → cta → themes: the themes band crop (crop-360-r1-6500, 27 % "thick") with the served h2 / cards at +3 px of the live DOM — the photos themselves (wave-11 finding) and the two unit rows below. Inheritor: themes content refresh (§ D) — not run in this unit (time; the events drift makes a combined refresh the better next step).
- **11000–16000 (20 / 49.5 / 38 / 48 / 27 / 25.5 / 52.6) social wall + events, 16500 (30.4) footer**: served social columns start 11074 vs live DOM 11051 (+23: +8 upstream, +15 news — live `.commands` 10668 vs served 10670 is equal, so the +15 sits in the news h2 / wrapper margins: live h2 8023 → list 8108 = 85, served 8027 → 8131 = 104; inheritor: news-posts h2 margin-bottom at ≤ 1024 (48 → 29), one measured lift). Below that the same non-derivable LinkedIn "mehr anzeigen" (+59 in column 2 at 1440, post 2 336 vs 394 at 360) and the live events drift (new event + day links; the origin stitch is from 10:05Z). Δh +4 overall.
- Units off 2: `mo-do: …` annotation dw 21 (live `<nobr>Fr: 7:00 – 13:00 Uhr</nobr>` keeps "Fr: …" on one line; served text breaks after "Fr:" — a content `<nobr>` equivalent, i.e. a nowrap span the DA round-trip would have to carry) and `netzstörung gas:` dw −23 (fixed in 8b9fe14 via the entries shrink-to-fit — the 360 cap was reached before a gate measured it; the 1440 r3 units confirm the same rule's padding effect).
- Content MISSING 1: the live Kernberglauf event (drift, as at 1440).

## Notes for the next author

- Origins reused (undimmed); gate-all still does not forward `--consent`. The live DOM at 360 flickered between two states in this unit too: the 11:17Z measure placed the info-boxes section at 3968 (box 0 at 4008), the 11:36Z one at 4099 like wave 11 — compare local deltas only (box heights, row spacing), never absolute y across runs.
- measure.mjs once per side with that side's selectors; tab.mjs (stardust/.work/rollout/fix-wave-12-index/tab.mjs `<json> [selectorRegex] [props]`) prints `sel [i/n] y h x w "text" props` from a measure.mjs json.
- JS structure matters for the unit rows: the text-node probe takes the nearest element box, so bare text ("(24h)", the annotation, the consent label) needs the live wrapper element to compare at all. In `decorate()`, cell children are moved into `container` as they are processed — read the previous sibling from `container.lastElementChild`, not `previousElementSibling` (the r2 regression).
- Specificity traps (styles/ frozen): `main a:any-link { 700 }` hit the consent link and the themes credits; `.info-boxes-content p { margin: 0 0 16px }` (0,1,1) beat `.info-boxes-field` and `.info-boxes-send` (0,1,0). Margins between a served block p and the previous block collapse where the live inline-block input / select kept them apart (the 35 px consent row).
- Proto server: `node stardust/.work/rollout/fix-wave-10-index/proto-server.mjs 8791`, pid in stardust/.work/rollout/fix-wave-12-index/proto-server.pid, stopped at close by that pid. block-roundtrip exit 0 for r1 / r2 / r3 (roundtrip-r*.log); lint clean for the touched blocks (pre-existing faq / product-teasers / text-module stylelint errors out of scope).
- The news commands `padding-top: 20px` is ≤ 1024 only (measured at 360); measure `.aktuelles .dynamic-list > div .commands` vs the last card at 1440 before widening it.
- Foundation requests: none.

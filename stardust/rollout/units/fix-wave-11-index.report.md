# Unit `fix-wave-11:index` — report (home page `/`, published-origin gates, 2026-10-09)

Verdict: **FAIL at both widths, pixel only** — 1440 **10.1 %** (≤ 10 needed; 11.0 at r1, 12.26 wave 10), 360 **16.04 %** (23.18 at r1).
Δh, clipped, content MISSING/HIDDEN all within the bar; required units off (news-posts / info-boxes rows, see § Residuals).
Rounds capped (r1 wave-11 pre-spent, r2 + r3 run here per width). No mask, no override, no content change (no deploy; ledger not needed).

## Round table

| round | width | eds shot | pixel | Δh (origin − eds) | clipped | MISSING / HIDDEN | units off / missing | verdict |
|---|---|---|---|---|---|---|---|---|
| r1 (10:30Z, before this session) | 1440 | 10:30Z | 11.0 | −5 | 0 | 0 / 0 | 42 / 8 | FAIL |
| r2 (fix11i-1440-r2, 10:51Z) | 1440 | 10:49Z (commit da16d14) | 10.06 | 60 | 0 | 0 / 0 | 42 / 8 | FAIL |
| r3 (fix11i-1440-r3, 10:58Z) | 1440 | 10:56Z (6bb82e8 + 7377dc1) | **10.1** | **44** | 0 | 0 / 0 | 42 / 8 | FAIL (pixel +0.1, units) |
| r1 (10:30Z, before this session) | 360 | 10:30Z | 23.18 | −72 | 0 | 0 / 0 | 29 / 8 | FAIL |
| r2 (fix11i-360-r2, 11:02Z) | 360 | 11:00Z (7377dc1) | 19.86 | 52 | 0 | 0 / 0 | 27 / 8 | FAIL |
| r3 (fix11i-360-r3, 11:07Z) | 360 | 11:04Z (b6cc2dd + 404457f) | **16.04** | **52** | 0 | 0 / 0 | 29 / 8 | FAIL (pixel, units) |

Origins reused (`--skip-existing`): 1440 origin.png 10:01Z (consent accepted, 8820 px), 360 origin 17026 px; both undimmed.
Evidence: stardust/replica/gates/all-<w>/index/, measurements + crops in stardust/.work/rollout/fix-wave-11-index/ (measure-live-*.json / measure-eds-*.json — one side per run, that side's selectors; crop-1440-r1-3500, crop-1440-r2-3500 / -4500 strips).

## What the rounds did (instruments first)

1. **cta-band @1440 (band 3500–4000 19.5 → 9.6).** measure.mjs live `section.teaser-modul` y 3368 h 367, margin-top −136, padding-top 104, `.center` margin 20 — i.e. the live home-page band is dock-to-previous-section at desktop too; served `.cta-band-container` y 3518 h 284 (started at the grey end). The brief's "subtitle missing" was a stitch artefact: the served `<p>` exists (y 3623 h 55) and sat under the sticky header in both crops. Fix: `main .section.info-boxes-container + .section.cta-band-container { margin-top:-136px; padding-top:104px }` at ≥ 1025 (blocks/cta-band/cta-band.css). After: y 3382 h 368 (live 3368 / 367; the +14 is an upstream offset: info-boxes section 2789 vs live 2778, h 729 vs 726).
2. **themes h2 (+60).** live `section.themen-section header` 135 / 123 tall, h2 100 px under the section top at both widths; served 40. Fix in blocks/photo-teasers/photo-teasers.css on the home-page `:has(.photo-teasers.themes)` first wrapper. At 1440 it lands (h2 3850 vs live 3836 = the same +14). At 360 the gate (r2) went 6500–7000 14.6 → 38.1 %: the served section already starts +59 late (info-boxes 360 height, § Residuals) and the old 40 had coincidentally aligned h2/cards with live (6369/6440 vs 6370/6441); the rule is now scoped to ≥ 1025 with the sequencing note in the CSS.
3. **social-wall posts (1440 6500–7000 16.5 → 17.8 with content differences; 360 11000–14500 64/38/43/57/26 → 57/32/31/26/15).** live per-post heights are natural (554 carousel / 493 video / 339 LinkedIn without "mehr anzeigen" / 396 with it @1440; 568 / 490 / 336 / 393 @360) while the served posts were pinned to `min-height: 574` (481 ≤ 1024) → columns 1208 vs 1168 @1440, 4234 vs 3984 @360. Removed both min-heights; `.social-wall p.social-wall-account` keeps its 8 px margin (`.social-wall p { margin: 0 }` had beaten it, every post 7–8 px short); carousel media gets the live 8 px under the slides (live `.slider` 403 for a 395 image); the live `span.fa-instagram` badge (30 × 30 at 5/5, white, 24.4 px) added as `.social-wall-instagram .social-wall-media::before`; JS hides the "mehr anzeigen" row when the text alone fits the 250 px cap (ResizeObserver, the section is display:none while loading). Served after (measure 10:55Z): carousel 547 → 555 expected with the margin fix (live 554), video 485 → 493, LinkedIn 388 → 396 (live 396 for posts 7/8).
4. **events (1440 8000–8500 26.1 → 16.9).** live `.list-quartals` is float-collapsed (h 0, li paint below; margin 10 0 30) → panel 430; served months row 32 → 462: `.events ul.events-months { height: 0 }`. The commands button rendered 40 (styles' `main a.button:any-link` (0,2,1) beat `.events-commands a`) → `main .events .events-commands a` 54 px → row 144 / 99 as live. After: panel 430 = live, section 733 vs 731.
5. **info-boxes @360:** icon-list links black bold as live (`rgb(0,0,0) 700` for Störungsauskunft / TEAG-Kundenportal / Zählerstandsmeldung / Kontaktformular; phone links stay cyan on both sides) — ≤ 1024 only (no 1440 live colour measured).
6. **news-posts (units 1440 r3: li 370 vs 354, a 362 vs 354, description 96 vs 120).** served card link inherited styles' `main a:any-link { font-weight: 700 }` (live 17/27/400 → wider bold text wrapped one more line) → `main .news-posts a.news-posts-link { font-weight: 400 }`; `.news-posts p { margin: 0 }` had removed the 8 px margins of description and "weiterlesen" → `p.news-posts-description / p.news-posts-more`. Shipped after the 1440 cap (b6cc2dd, 11:02Z) — in the 360 r3 gate, NOT in the 1440 r3 gate.

## Files changed

- blocks/cta-band/cta-band.css (desktop dock, home page only), blocks/photo-teasers/photo-teasers.css (themes h2 +60 at ≥ 1025), blocks/social-wall/social-wall.css + social-wall.js (natural heights, account margin, carousel 8 px, IG badge, more-row rule), blocks/events/events.css (months collapsed, 54 px button specificity), blocks/info-boxes/info-boxes.css (≤ 1024 link colour), blocks/news-posts/news-posts.css (link weight, p margins).
- stardust/.work/rollout/fix-wave-11-index/* (measurements, crops, served-plain-r1.html, roundtrip-r2.log, proto-server pid/log). No content/, styles/, scripts/, tools/replica/, units.json, presence.json, mask or override edits; no deploy (ledger-fix11-index.json not created — nothing was PUT).
- Other pages: all new rules are scoped to the home-page variants (`.info-boxes-container + .cta-band-container`, `:has(.photo-teasers.themes)`), to blocks used only on `/` (social-wall, events, news-posts, info-boxes), so the ueber-uns-unternehmen photo-teasers instance is untouched. The cta-band desktop dock applies only where an info-boxes section precedes the band (home page).
- Commits: da16d14, 6bb82e8, 7377dc1, b6cc2dd, 404457f (+ this report).

## Residuals (band + cause + inheritor)

1440 (10.1 %, needs ≤ 10 — 0.1 point):
- 4000–5000 (11.8 / 22.3) themes rows: geometry matches (cards 3933 vs live 3918 = upstream +14 + 1); the crops differ in the PHOTOS — the live renditions changed since the 09:27Z wave-10 fetch (row 2 shows a different frame of the Tag der offenen Tür shoot). Inheritor: a content refresh of the themes pictures (wave-10 fetch chain), not CSS.
- +14 upstream at the info-boxes section (y 2789 vs live 2778, h 729 vs 726) shifts every band 3400–8500 by 14 px; bands 0–3500 are all ≤ 6.5 %. Inheritor: a product-teasers / keyfacts measure (unit rows there are within tolerance; the +11 comes from above 2778).
- 6500–7000 (17.8) social: live LinkedIn post 1 (col 2) hides its "mehr anzeigen" row (339) although its text overruns the cap and it carries 8 pictures like posts 7/8 (396, row shown) — no derivable rule; served 396 (+57 shift in col 2). Live feed is dynamic (data-cachetimestamp 10:48) — the eight posts still match the frozen content at 11:00Z.
- 8000–8500 (16.9) events: panel/timeline now equal; what remains is the picture rendition + the footer top (served footer 336 vs live ≈ 389 at 1440 → Δh 44; chrome unit, not this block).
- news-posts fix (b6cc2dd) landed after the 1440 cap — the coordinator's `gate-all --skip-existing` refresh at 1440 will include it (expected: the 5500–6000 band and units `news-posts` rows dh −16/−8 → 0).
- Units off 42 / missing 8 (required): info-boxes rows (divider width 165 — the live span.divider is 223 wide vs served 388; text rows dh −7: live line boxes 30 vs 23 in the box lists), news-posts rows (should drop with b6cc2dd), themes credits (dw 10), product-teasers link dw 5. Inheritor: next info-boxes wave (divider width, list line-height).

360 (16.04 %):
- 5500–6000 (30.3) + everything below +59: info-boxes section 2000 vs live 1949 (+51) and +8 upstream. Per link: box 1 rows run +10, box 2 phone links "0800 686-1166/-1177" wrap to two lines on served (a 239 × 49 vs live 112 × 22) while the live li spacing is larger (53 vs 54 per row), box 3 top +40. Unit rows: heading dh +6, text rows dy +11 dh −7. Inheritor: info-boxes 360 wave — measure `section:has(+ section.teaser-modul) ul li` per row against `.info-boxes-list > li` children, then add the themes +60 at ≤ 1024 (see photo-teasers.css comment).
- 6500–7000 (14.6) themes: offset-contaminated by the +59 above (cards themselves equal: 1399 vs 1398).
- 9000–11000 (9.5): news — live `.dynamic-list` 2679 vs served 2436 + the commands row; b6cc2dd adds ≈ 16 px per card (8 cards) and removes wrapped lines; re-measure after the refresh.
- 11000–14500 (57 / 32 / 31 / 26 / 15) social: columns start 10947 vs live 11051 (−104, upstream from news), per-post now natural (IG carousel 572 vs 568, video 492 vs 490, LinkedIn 395 vs 393; post 2 (LinkedIn "Zwei Partner") live 336 without the row vs served 395 — the same undetermined live rule as at 1440). Post 1 differs in the first slide only if the live feed moved on.
- 15000–16000 (13.2 / 30.7) events + 16500 footer: follow the social end (−104 + 59 = −45 net) and the live `.commands` 99 (now equal).

## Notes for the next author

- Consent / origin: as wave 10 (origins reused here, undimmed; the 1440 one is the 10:01Z `stitch-shot --consent` shot). gate-all still does not forward `--consent`.
- measure.mjs: run once per side with that side's selectors (`--all-matches` pairs by index). The live page height flickered 8820 / 8788 / 8820 across three loads (dynamic social feed) — trust local deltas.
- Specificity traps found this wave (styles/ frozen): `main a:any-link { font-weight: 700 }` (0,1,1) and `main a.button:any-link` (0,2,1) beat single-class block rules; `.social-wall p { margin: 0 }` / `.news-posts p { margin: 0 }` (0,1,1) beat `.x-account { margin-bottom }` (0,1,0). Measure margins with `--props marginBottom` after every lift.
- The live "mehr anzeigen" visibility on LinkedIn posts is not derivable from text length or picture count (post 3 hidden, posts 7/8 shown, all with pictures, all with text > 250 px); the served rule (hide when the paragraphs fit the cap) is the closest honest approximation.
- Proto server: node stardust/.work/rollout/fix-wave-10-index/proto-server.mjs 8791, pid in stardust/.work/rollout/fix-wave-11-index/proto-server.pid; stopped at close. block-roundtrip r2 exit 0 (log roundtrip-r2.log); lint clean for the touched blocks (pre-existing faq / product-teasers / text-module stylelint errors out of scope).
- Foundation requests: none (all absorbed in block CSS).

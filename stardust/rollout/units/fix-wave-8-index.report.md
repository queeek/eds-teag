# fix-wave-8:index — report

Home page `/` (slug index), 2026-10-09 02:04–02:35Z, 360 only (the 1440 themes band and the encoder defects were not reached — deadline 02:50Z, fixing stopped 02:28Z after round 3). Brief: stardust/rollout/units/fix-wave-8-index-brief.md. Facts: stardust/.work/rollout/fix-wave-8-index/ (anchor-live-360.json / anchor-eds-360.json / anchor-eds-360-r2.json, measure-live-hero-360.json / measure-eds-hero-360.json, measure-live-cta-360.json / measure-eds-cta-360.json, measure-eds-ib-360.json, crops band-480-1380.png and band-5750-6450.png — origin over eds). Reference: the settled 17026 px origin.png (recapture:index-360-origin). Start: 29.35 % Δh +17.

## Round table

| round | what | gate |
|---|---|---|
| 1 (360) | anchor.mjs both sides (live `--main '#Content'`): the "section above the teasers" of the brief is NOT taller — three-steps is 783 on both sides, product-teasers 1197 / 1196; the +77 offset at 2000–3000 comes from hero + tariff (live ends 1270, build 1347). measure.mjs: live tab row 88 px (517–605) with the tariff card flush under it (605–1100), then 50 px section padding + the empty 120 px siegel section → next section 1270; build tab row 138 (50 px padding-bottom), card docked −20 into it (30 px gap, 605–635), card tail 210 (padding 70 + siegel-gap margin 120 + section 20). Fix ≤ 1024: `.hero-slider-tabs { padding-bottom: 0 }`, `main .section.hero-slider-container + .section.tariff-calculator-container { margin-top: 0 }`, `main .tariff-calculator.siegel-gap { padding-bottom: 30px }` (hero-slider.css, tariff-calculator.css — landing-page scoped, ≥ 1025 untouched). anchor after: three-steps 1277 vs live 1270 (+7, the 502 vs 495 card body). | **24.91 % Δh +87**, band 2000–3000 cleared (31 / 24 → < 15), MISSING 57, units off 35 / missing 15 — fix8i-360, 02:13Z |
| 2 (360) | first remaining hot band 5500–8000: measure.mjs + crop 5750–6450: live `section.teaser-modul` is `dock-to-previous-section` — starts 136 px before the grey info-boxes end (5912 vs 6048), `.center` 318 at the band top (the h3 sits under the info-boxes card, which paints over the band), band 358 tall, next section at grey end + 222; build band 398 (40 / 40 padding) started at the grey end (visible +176). Fix ≤ 1024 in cta-band.css: `main .section.info-boxes-container + .section.cta-band-container { position: relative; margin-top: -136px; padding-top: 0 }`. | **25.59 % Δh +243**: bands 6000–6500 32.3 → 10.8, 6500–7000 57.1 → 36.7, 7500–8000 27.8 → 14.8, 7000–7500 27.2 → 33; tail 15500–16000 37.1 → 78.4, 16000–16783 8.3 / 21.2 → 18.6 / 42.7 (the served page is now 243 px short: themes −84, news −138, social-wall −62 below the band) — fix8i-360-r2b, 02:21Z |
| 3 (360) | anchor.mjs: the band docked only −117 (5990 vs grey end 6107) — with padding-top 0 the wrapper's 20 px margin-top collapsed through the section into the negative margin. Added `… + .section.cta-band-container > .cta-band-wrapper { margin-top: 0 }` (live `.center` is at the band top). | **26.58 % Δh +263**, bands 6000–6500 16.1, 6500–7000 45.7, 7000–7500 36.6, 7500–8000 15.9, 15500–16000 75.0; MISSING 67, units off 35 / missing 15 — fix8i-360-r3, 02:27Z. Kept (measured geometry; the headline moves with the tail offset, see Notes) |

Final verdict @360: **FAIL — 26.58 % Δh +263 (height PASS, 5 % = 851), clipped 0, content MISSING 67, units off 35 / missing 15** (start 29.35 / +17; best headline this unit 24.91 after round 1). 1440: not gated this unit (no 1440 code changed — all three rules are `@media (width <= 1024px)`; last known 16.22 % Δh +68).

## Files changed

- `blocks/hero-slider/hero-slider.css` — ≤ 1024 `.hero-slider-tabs { padding-bottom: 0 }` (round 1).
- `blocks/tariff-calculator/tariff-calculator.css` — ≤ 1024 landing-page dock 0 (`hero-slider-container + tariff-calculator-container`) and `.siegel-gap` padding-bottom 30 (round 1).
- `blocks/cta-band/cta-band.css` — ≤ 1024 `info-boxes-container + cta-band-container` dock −136 / padding-top 0 / wrapper margin-top 0 (rounds 2–3).
- `stardust/replica/gates/all-360/index/*` — gate evidence per round (eds.png, pixel.json, content.json, units.json, clip.json, diff.png); `stardust/.work/rollout/fix-wave-8-index/` — anchor / measure JSON + two crops.

## Residuals (band + cause + inheritor)

- **360 ladder after round 3 (anchor, served − live)**: three-steps +7 (tariff card body 502 vs 495), info-boxes **2000 vs 1949 (+51)** — the live inner ladder was not read (my `#Content > section:nth-of-type(6) > .center > ul` selector matched nothing; served li's 674 / 646 / 540, first li children 289 + 386 — measure the live boxes with their own class names first), CTA band at grey end − 136 on both sides, **themes 1629 vs 1713 (−84), news 2705 vs 2843 (−138), social-wall 4326 vs 4388 (−62)**, events 845 vs 823 (+22). The three negative sections are the Δh +263 and the tail bands (11000–14000, 15000–16763); fix top-down: themes first (band 6500–7500 is themes cards stacked at 360).
- **Content MISSING 67** (57 at round 1 — moves with the live slider state), classes unchanged from fix-wave-6 (carousel `void(0)` controls, `__doPostBack` day links, flattened post links, themes whole-card anchors); encoder step not reached.
- **Caption "©" glyph** (brief) and **moin.ai panel over 2410–2680**: band 2000–3000 fell under 15 % after round 1, so neither was touched; the mask stays as is.
- **1440** untouched: themes band 4000–5000, CTA dock (fix-wave-6 measured −136 / +104 there and reverted because of the −52 flow shift — the 360 dock is scoped ≤ 1024 and does not apply at 1440).

## Notes for the next author

- Gate sign unchanged: Δh = origin − eds (positive = served short). The 360 served page is now 263 px short entirely below the CTA band; the pixel headline rose 24.91 → 26.58 because the overlap-crop compares a shifted tail, not because the fixed bands regressed (6000–6500 32.3 → 16.1, 7500–8000 27.8 → 15.9). If the coordinator prefers the headline over the measured geometry, reverting the two cta-band rules alone returns to round 1 (24.91 / +87); the measured facts say keep them and fix themes / news / social-wall next.
- At 360 the live tariff card is flush under the 88 px tab row and the landing page's post-card whitespace is 170 px (section 50 + empty siegel section 120) — the `siegel-gap` margin (120) is right, the 70 px block padding was the 1440 siegel-row value.
- measure.mjs JSON: per match the computed values are under `props` (not `style`); anchor on the live side needs `--main '#Content'`.
- Round-2 incident: a `git commit -o` with untracked evidence files failed silently in a chained command and a gate was started against the un-pushed origin; stopped by the recorded pid (`stardust/.work/replica/bg/<job>.json` childPid), re-committed, re-pushed, origin polled, gate re-run (fix8i-360-r2b). `git add -f` the evidence before `commit -o`.
- One browser at a time held: each measure/anchor run waited for the previous gate's `done`.

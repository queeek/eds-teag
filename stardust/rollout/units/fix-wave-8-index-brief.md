# Unit `fix-wave-8:index` — home page, 360 band breakdown against the SETTLED origin, then 1440 themes band + encoder defects

Deadline: stardust/.work/rollout/fix-wave-8-index/deadline.txt (`date -u` is the truth; stop fixing 10 min before it, close the unit honestly). Work dir stardust/.work/rollout/fix-wave-8-index/. Commit AND push after EVERY round (code + gate evidence), so nothing is lost if the session is stopped.

Status (2026-10-09 02:02Z): `/` (slug index, DA path /index) 360 against the re-stitched settled origin (17026 px, unit recapture:index-360-origin):
pixel 29.35 % Δh +17 (height PASS), clipped 0, content MISSING ~57, units off ~37 / missing 15 — FAIL (pixel). 1440 16.22 % Δh +68, MISSING 63.
The e53a0a6 "natural height" reset is reverted (481 px ≤1024 post min-height restored, fix-wave-7:index) — do not touch the post height again
without measuring against the settled origin.png in stardust/replica/gates/all-360/index/.
Read FIRST, by section only: fix-wave-6-index.report.md § Notes for the next author, fix-wave-6-index-brief.md steps 3–4, fix-wave-4-index.report.md § Residuals.

Hot bands @360 (gates/all-360/index/pixel.json, ≥ 15 %), top-down: 2000–3000 (31 / 24), 5500–8000 (41 / 31 / 62 / 32 / 38), 11000–11500 (63),
12000–12500 (56), 13000–14000 (40 / 49), 15000–16000 (20 / 43), 16500–17000 (29). Fix the FIRST hot band first (anchor.mjs both sides at 360,
one crop-pair.mjs of 2000–3000, measure.mjs the named box); everything below is offset-contaminated until it is fixed. Gate after each fix:
`node stardust/scripts/replica/run-bg.mjs start --name fix8i-360 -- node stardust/scripts/replica/gate-all.mjs --only index --width 360 --eds-host https://main--dc15da58--aemcoder.aem.live --skip-existing --recapture-eds`
(delete stardust/current/measure/*-units.json before EVERY gate-all run; one width at a time; `wait` again at 100 s). Cap 3 rounds. Then 1440
(themes band 4000–5000, CTA dock lead in fix-wave-6-index.report.md), then the encoder defects (step 4 of fix-wave-6-index-brief.md). Rules,
deadline, concurrency, close procedure identical to fix-wave-6-index-brief.md (one unit at a time from now on — parallel pushes collided).

## measure:index-360-band1 facts (coordinator, 02:05Z — one crop of 2000–3000, origin over eds: stardust/.work/rollout/fix-wave-6-index/band-2000-3000.png)
- The first product-teaser card ("Stromtarife im Überblick", photo + h3 + text + cyan "Zu den Stromtarifen" button) starts ≈ 70 px LOWER on the build
  (crop y ≈ 210 vs ≈ 140): the preceding text block ("… zuverlässige Energieversorgung zu fairen Preisen und flexiblen Konditionen.") still runs to
  page y ≈ 2070 on the build while it has ended before 2000 on the live page → the section ABOVE the teasers is ≈ 70 px taller on the build at 360.
  Measure that section (anchor.mjs both sides at 360, measure.mjs its box with `--all-matches --consent '#usercentrics-cmp-ui #accept'`) before
  touching the cards; the card itself (image 275 px, h3, text, button) reads the same composition on both sides.
- The live capture carries the moin.ai proactive panel ("Wie kann ich Ihnen helfen?" + three quick-reply chips + avatar + close + a scroll-top arrow)
  over the card text at page y ≈ 2410–2680; masks.json's 227 px chunk-bottom mask covers only its lower part — if the panel keeps appearing, extend
  the mask rows for this chunk (documented, origin-only) rather than iterating CSS against it.
- Caption detail: the build's photo caption reads "Guido Werner/TEAG" without the live "©" glyph — check the encoder's caption text (content, not CSS).

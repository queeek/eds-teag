# fix-wave-6:index — report

Home page `/` (slug index), 2026-10-09 00:38–01:06Z. Brief: stardust/rollout/units/fix-wave-6-index-brief.md. Facts: stardust/.work/rollout/fix-wave-6-index/measurements.md (+ measure-360.json, measure-cta-1440.json).

## Round table

| round | what | gate |
|---|---|---|
| 2 (360) | measured the live post ladder at 360 (measure-360.json): live section 4387 / served 3559 (−828), posts 3984 vs 8 × 385 + 20, loader row 139, live post `img` 413 px (10 of 12 loaded) vs served 3 of 12 visible. BUT the frozen gate reference `all-360/index/origin.png` is 16193 px vs live document 16913–17026 — the stitch renders the wall at the natural (image-less) height, and Δh = origin − eds, so every ≤1024 min-height moves the served page away from it (481 → −823 in round 1). Kept `min-height: 0` (commit e53a0a6 state); no code change. | **360: 24.66 % Δh −57 (height PASS, pixel FAIL), MISSING 57, units off 36 / missing 15** — fix6i-360, 00:45Z |
| 2 (1440 confirm) | no change since e53a0a6 at 1440 | **1440: 16.19 % Δh +68, MISSING 63, units off 47 / missing 14** — fix6i-1440, 00:48Z |
| 3 (1440) | CTA band dock, measured (measure-cta-1440.json + stitch row scan x=40): live purple 3368–3735 (368) over the grey info-boxes end 3504, content 124 below the top / 40 above the end, next section at grey end + 232; served 3483–3767 (284), content 40 / 40, next at + 284. Rule `main .section.info-boxes-container + .section.cta-band-container { position: relative; margin-top: -136px; padding-top: 104px }` @ ≥1025 (commit 2991bc0). Gate: **19.59 % Δh +120** (fix6i-1440-r3, 00:53Z) — the band matches locally but the −52 px flow shift lifts everything below: hot bands 3500–4000 19.1 (new), 4000–4500 16.7 → 26.7, 4500–5000 25.1 → 32.2, 7500–8000 21.5 (new), 8000–8500 22.8 → 33.0. **Reverted** (commit: this unit's revert, cta-band.css only); origin polled clean; confirming gate fix6i-1440-r3c below. | 1440 after revert: **16.22 % Δh +68, MISSING 54, units off 47 / missing 14** — fix6i-1440-r3c, 01:04Z (state = 00:48Z, within capture noise) |

Pixel never passed at either width; no override, no fake pass. Cap of 3 rounds reached (2 rounds @360 across waves 5–6, 3 @1440).

## Files changed

- `blocks/cta-band/cta-band.css` — dock rule added (2991bc0) and removed again (revert commit); net zero.
- `stardust/.work/rollout/fix-wave-6-index/` — measurements.md, measure-360.json, measure-cta-1440.json.
- `stardust/replica/gates/all-360/index/*`, `all-1440/index/*`, `runs/*index.json` — gate records (fix6i-360, fix6i-1440, fix6i-1440-r3, r3b [duplicate run against the un-reverted origin after a rejected push: 19.61 %], r3c).
- Not touched: encoder, `/index` content, overrides.json, frozen foundation files, the neighbouring unit's blocks (text-module, product-teasers).

## Residuals

- **360 reference vs live**: the frozen 360 origin stitch (16193, 2026-10-08 22:01) is ≈ 830 px shorter than the live document (content probe 16913, measure 17026) — the social-wall posts without images. Anyone re-capturing the 360 origin will get a reference ≈ 830 px taller and the wall will then read −93 px per post again; do not set a min-height before knowing which reference the gate uses. Request line (frozen foundation): decide whether the 360 home origin stitch is to be re-captured with images settled.
- **1440 Δh +68** unchanged; **CTA dock** is a measured lead (numbers above) but only pays off together with the sections below it (themes rows 348/392/291, news −42, social wall/events/footer 6500–8500) — apply it LAST in a wave that re-aligns the lower half, or compensate nothing (no unmeasured spacers).
- **Next-section background @1440**: live section after the CTA band is grey (240) at 3736; served `.cta-band-container + .section` is white (256) at 3767 — a section-style/encoder item (alternative-background-color missing on the themes section?), not touched.
- **Content MISSING per class** (1440 / 360): carousel `void(0)` controls 6 / ≈4 (tooltip, "zu dieser Folie" ×2, "zur nächsten Folie" ×2, "Kalender anzeigen"); `__doPostBack` 8 / ≈7 (7 day links + "Anfrage senden"); social post links 8 / — (5 Instagram hashtag anchors, 3 `/einblicke/…` post links — encoder flattening); mailto 1; MOVED LINK 11 / 6; EXTRA LINK 5 / 5; EXTRA HEADING 8 / 8 (news titles — whole-card anchor pairing); COUNT 2, CONTROL 1. Step 4 (encoder fix + re-PUT) not started — < 15 min remained after round 3; overrides for carousel/postback stay out until pixel + Δh pass.
- **Units**: 1440 off 47 / missing 14; 360 off 36 / missing 15 — unchanged this unit.

## Notes for the next author

- Gate sign: Δh = origin − eds (positive = served short). The fix-wave-6 brief's reading of "−99 = build short" was inverted; round 1's 481 px proved it (−99 → −823). At 360 the natural post height is the best match to the current reference.
- The social-wall served posts hide 9 of 12 images (`.social-wall-content` max-height 250 + the decorator) while the live posts show 413 px images; if the 360 reference is ever re-captured with images, the fix is to show the image (not a min-height) — measure `.posts li li` / `li.list-entry` per post first (this unit's `.posts > li` hit the 4 column li's, not the posts).
- Concurrency incident: a push was rejected (non-fast-forward, neighbouring unit) and `git pull --rebase` + `commit --amend` briefly swept the neighbour's uncommitted edits into a local commit (never pushed); fixed with `git reset --mixed origin/main` and a `git commit -o <file>` revert. Always `git fetch && git rebase origin/main` before committing, and commit with `-o <file>`.
- Gate per round: `node stardust/scripts/replica/run-bg.mjs start --name <job> -- node stardust/scripts/replica/gate-all.mjs --only index --width <w> --eds-host https://main--dc15da58--aemcoder.aem.live --skip-existing --recapture-eds`; delete `stardust/current/measure/index-units.json` between widths; pid lives in `stardust/.work/replica/bg/<job>.json` (`childPid`).

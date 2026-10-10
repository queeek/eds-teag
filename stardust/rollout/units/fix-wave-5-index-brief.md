# Unit `fix-wave-5:index` — home page, social wall + events button + product-teasers padding in ONE round, time-boxed

> Measured facts for step 2 are in stardust/.work/rollout/fix-wave-5-index/measurements.md and stardust/rollout/units/measure-index.report.md (unit `measure:index`, 00:23Z): social wall posts 388 → ≈574 px @1440 / 385 → ≈481 @360 + the 139 px load-more row (adds ≈ +470 of the −440 served shortfall); events button 40 → 54 px, padding 0 30, 19 px, radius 0 (adds +14); product-teasers padding already 150 both sides, served box 428 vs live 418 (removes ≈ 10). Start round 1 from these numbers, no re-measurement needed.

Status (2026-10-09 ~00:10Z, after fix-wave-4:index + roster refresh gate-all:refresh-2): `/` (slug index, DA path /index) 1440 22.14 % Δh +440
(pass by 1 px: bar is 441), content MISSING 69, units off 47 / missing 14; 360 25.77 % Δh −99, content MISSING 57, units off 36 / missing 15;
clipped 0. Read FIRST, by section only: stardust/rollout/units/fix-wave-4-index.report.md § Residuals and § Notes for the next author
(the `header { height }` foundation reach, decorateButtons, the Δh sign warning), then fix-wave-3-index.report.md § Notes (content-refresh recipe —
re-run it only if the live themes / social wall changed again; compare `list-quartals` for events).

Deadline: set by the coordinator at spawn (stardust/.work/rollout/fix-wave-5-index/deadline.txt). Rules identical to fix-wave-4-index-brief.md.

Procedure
1. Work dir stardust/.work/rollout/fix-wave-5-index/. Unit already recorded `running`.
2. Plan the first round as ONE combined fix, because 1440 Δh is +440 (build shorter): measure, then fix together —
   (a) the social wall: live `.page-foot-section.aktuelles:nth-of-type(2) > * > *` ladder and post boxes (`measure.mjs --json`, consent accepted)
       vs `blocks/social-wall/social-wall.css` (served 1130 vs live 1487 @1440, 3559 vs 4156 @360 — the largest box; served posts h388 with
       `max-height: 250px` + "mehr anzeigen" 57 px, 2 rows of 4 @1440);
   (b) the events commands button: live `.veranstaltungen .commands a.link-button.enlarge` (height, padding, font-size, colour) → add
       `.events-commands .button { … }` in blocks/events/events.css (144 @1440 / 99 @360 incl. padding);
   (c) product-teasers `columns-2` padding-top vs live 150 px @1440 (first hot band 1500–2000, 16.5 %) — this REMOVES served height, so only
       together with (a).
3. Round 2 (if the numbers warrant): themes variant natural row heights 348 / 392 / 291 @1440 + text panel typography (bands 4000–5000); CTA band
   `dock-to-previous-section` overlap (+39 at the band) — only if measured.
4. Content MISSING: the encoder defects (flattened post links, whole-card anchor pairing on the 3 themes cards) are fixed in the encoder
   (stardust/.work/rollout/archetype-index/index-encoders.js via patch-encoder.mjs), re-encode, re-PUT `/index` with deploy-batch.mjs
   (`--force --token-file /shared/stardust-replica/.adobe-ims-token --concurrency 1`, publish). The carousel controls ("zu dieser Folie",
   `javascript:void(0)`) and the 7 `__doPostBack` day links are probe asymmetries → stardust/replica/gates/all-<w>/overrides.json ONLY once pixel
   and Δh pass at that width, same shape as the stromtarife entries.
5. Gate per round: `node stardust/scripts/replica/run-bg.mjs start --name fix5i-<w> -- node stardust/scripts/replica/gate-all.mjs --only index --width <w> --eds-host https://main--dc15da58--aemcoder.aem.live --skip-existing --recapture-eds`,
   widths sequential (wait until `done`), delete stardust/current/measure/index-units.json between widths. No update-coverage.
6. Close like fix-wave-4:index: unit-record done with honest verdict, report with "Notes for the next author", commit prefix
   `replica phase 5 fix-wave-5:index:`, push, stop anything you started by pid file. Return one verdict line + report path + one coordinator note.

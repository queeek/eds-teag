# cluster:privatkunden-strom-stromtarife — report

cluster:privatkunden-strom-stromtarife: pages 2/2 live, blocks 8 (5 extended additively), gate 1440 15.3%/7.88% / 360 19.9%/19.42%, Δh 69/10 · 224/179, clipped 0/0, content 0/0, rounds 3, requests 0

```json
{
  "gates": {
    "privatkunden-strom-stromtarife-teag-strom-easie": {
      "360": {
        "pixelPct": 19.9,
        "textPct": 18,
        "heightDelta": 224,
        "originH": 8236,
        "edsH": 8012,
        "clipped": 0,
        "contentMissing": 0,
        "contentHidden": 0,
        "unitsOff": 1,
        "unitsMissing": 0,
        "maskedRows": 2000,
        "verdict": "FAIL",
        "hotBands": [
          "1000-1500:41%",
          "2000-2500:23.9%",
          "5000-5500:21.6%",
          "5500-6000:21.8%",
          "7500-8000:45%",
          "8000-8012:42.5%"
        ],
        "run": "stardust/replica/gates/all-360/runs/2026-10-08T18-08-35-268Z-privatkunden-strom-stromtarife-teag-strom-easie.json"
      },
      "1440": {
        "pixelPct": 15.3,
        "textPct": 14.91,
        "heightDelta": 69,
        "originH": 5096,
        "edsH": 5027,
        "clipped": 0,
        "contentMissing": 0,
        "contentHidden": 0,
        "unitsOff": 10,
        "unitsMissing": 0,
        "maskedRows": 0,
        "verdict": "FAIL",
        "hotBands": [
          "1500-2000:15.8%",
          "3000-3500:19.1%",
          "3500-4000:29.4%",
          "4000-4500:24%",
          "4500-5000:26.7%"
        ],
        "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-04-01-750Z-privatkunden-strom-stromtarife-teag-strom-easie.json"
      }
    },
    "privatkunden-strom-ersatzversorgung": {
      "360": {
        "pixelPct": 19.42,
        "textPct": 16.74,
        "heightDelta": 179,
        "originH": 7064,
        "edsH": 6885,
        "clipped": 0,
        "contentMissing": 0,
        "contentHidden": 0,
        "unitsOff": 2,
        "unitsMissing": 0,
        "maskedRows": 1750,
        "verdict": "FAIL",
        "hotBands": [
          "2500-3000:23%",
          "5000-5500:23.7%",
          "5500-6000:40.8%",
          "6000-6500:21.2%",
          "6500-6885:42.3%"
        ],
        "run": "stardust/replica/gates/all-360/runs/2026-10-08T18-08-35-268Z-privatkunden-strom-stromtarife-teag-strom-easie.json"
      },
      "1440": {
        "pixelPct": 7.88,
        "textPct": 12.41,
        "heightDelta": 10,
        "originH": 4421,
        "edsH": 4411,
        "clipped": 0,
        "contentMissing": 0,
        "contentHidden": 0,
        "unitsOff": 2,
        "unitsMissing": 0,
        "maskedRows": 0,
        "verdict": "FAIL (elements): pixel PASS 7.88 %, Δh 10; units off 2 = divider ±20 px (live itself varies 230/250 between its two cards) + button 7 px narrower (font) — named asymmetry",
        "hotBands": [
          "2000-2500:17.7%"
        ],
        "run": "stardust/replica/gates/all-1440/runs/2026-10-08T18-04-01-750Z-privatkunden-strom-stromtarife-teag-strom-easie.json"
      }
    }
  }
}
```

PASS rule: pixel ≤ 10 % AND |Δh| ≤ 5 % AND clipped 0 AND MISSING+HIDDEN 0 AND units off/missing 0. Both pages are live and
published on the preview origin (`.plain.html` 200, one h1, 0 about:error, 8 ./media_ images each, ai-readability 100 %),
delivery-lint clean, davids-model-lint PASS (🟡 only), localize-links check PASS. The rows FAIL on pixel (and units); no clip,
no content loss. Rounds used: 1 (section-height fixes: faq entry rule, with-header card, +20 bottom, tariff 103 px), 2 (h3 size,
ul gap), 3 = the gate re-runs after the consent-dismissed origin re-shoots; a 4th is the coordinator's call.

## Band breakdown of the failing rows (hot bands, origin y ranges)
- teag-strom-easie 1440 (15.3 %, Δh 69): 1500-2000:15.8%, 3000-3500:19.1%, 3500-4000:29.4%, 4000-4500:24%, 4500-5000:26.7% — the card text column (h3/ul gaps), then the cumulative −56 px of the eye-catcher text column (live h3 spacing in `.overflow`) and −24 px of the three-steps section shift everything below 3000 by up to 69 px.
- teag-strom-easie 360 (19.9 %, Δh 224): 1000-1500:41%, 2000-2500:23.9%, 5000-5500:21.6%, 5500-6000:21.8%, 7500-8000:45%, 8000-8012:42.5%.
- ersatzversorgung 360 (19.42 %, Δh 179): 2500-3000:23%, 5000-5500:23.7%, 5500-6000:40.8%, 6000-6500:21.2%, 6500-6885:42.3%.
- ersatzversorgung 1440: pixel PASS 7.88 % (band 2000-2500 17.7 % = the Rechtliche module: live keeps 56 px under the floated figure, EDS section ends at the float); units off 2 named above.
- 360 round 1 (64.24 % / 55.87 %) was the consent second layer painted into every origin chunk (`--dismiss` alone clicked but the mobile layer re-rendered); re-shot with `--consent '#usercentrics-cmp-ui #accept'` + dismiss selectors → 19.9 % / 19.42 %.
- Not chased (instrument-measured, left for the next round): easie eye-catcher text column −56 px @1440; easie credits 59 px low on the 476 px card; ersatz Rechtliche −56 px; three-steps section bottom (archetype block, untouched); the 360 header band / footer +22 px are the existing foundation requests (no duplicate line).

## Files created / changed
- blocks: `page-header-hero/page-header-hero.{js,css}` (variant `with-page-label`), `product-teasers/product-teasers.css` (h3, `with-header`, `columns-2`), `text-module/text-module.{js,css}` + `checkmark-pos.svg` (variants `with-lists`, `center-content`, `with-accordion`, `eye-catcher-circle`), `faq/faq.js` (entry-vs-service-row rule) + `faq.css` (`plain-header`, `columns-2-3`), `tariff-calculator/tariff-calculator.css` (`previous-section-has-page-label`). All additive; `foundation-freeze.mjs check` → foundation unchanged.
- content: `content/privatkunden/strom/stromtarife/teag-strom-easie.html`, `content/privatkunden/strom/ersatzversorgung.html` (+ `content/privatkunden/strom/stromtarife.html`: badge media + 2 localized sibling links).
- `stardust/eds-schema/{privatkunden-strom-stromtarife-teag-strom-easie,privatkunden-strom-ersatzversorgung}.json`, `stardust/eds-conversion-log.md` (8 lines), `stardust/deploy/media-ledger.json` (+18 rows), `stardust/deploy/ledger-cluster-stromtarife.json`, `stardust/replica/units.json` (pages + family `columns-product-teasers`), `stardust/replica/gates/all-{1440,360}/presence.json`, `all-360/masks.json`, gate dirs + runs, `stardust/state.json` rows deployed, coverage.
- work: `stardust/.work/rollout/cluster-privatkunden-strom-stromtarife/` (build-content.mjs <slug>, outline/dump helpers, live/eds measures, round-trip logs, deploy logs, state-deployed.mjs, media/, badges/, crops).

## Badge residual (step 7)
Uploaded the two app badges from the archetype work dir under scope `privatkunden-strom-stromtarife` (ledger rows for 0760988a / a5502534 added), `media-reconcile --apply` on `content/privatkunden/strom/stromtarife.html` (37 hosted), re-PUT with `--force` (1 ok, live) — the page now serves the badge PNGs as `./media_…png`.

## Round-trip / lint notes
- block-roundtrip (mapped): all page-header-hero / breadcrumb / text-module ×5 / product-teasers / cta-band / three-steps rows closed (EW dead 0); tariff-calculator and faq keep the archetype's static-tier 🔴 (javascript:void links, hidden result panel, voting Ja/Nein) and faq shows one EW probe artifact — the identical "Zum Preisrechner Strom/Erdgas" list authored in 3 answers is matched by text and reported dead once (faq.js moves the nodes; the block code of the archetype is unchanged in that path).
- davids-model-lint 🟡 only (5-column tariff row, 2-cell faq rows, 1-row center-content text-module).

## Notes for the next author (index archetype)
- The program encoder `stardust/.work/rollout/cluster-privatkunden-strom-stromtarife/build-content.mjs <slug>` is table-driven (SLUGS map): add the index row and reuse `hero()`, `productTeasers()` (list-style-1/2, columns-2, with-header, image-right), `textModule()` (lists, accordion, eye-catcher), `faq()`, `ctaBand()`, `steps()`, `tariff()`.
- photo-teasers / channel-cards / service-cards / cta-band / three-steps: the archetype blocks render unchanged; product-teasers now covers the list-style-1 card grid (`columns-2`) — the index's `#List15736` family in units.json still points at the prototype selector.
- Every new look is a variant class scoped to the sibling content; live pages untouched (foundation unchanged). The live JS equaliser heights (476 / 418 px) are CSS min-heights.
- Origin stitches at 360 need `--consent '#usercentrics-cmp-ui #accept'` (dismiss alone leaves the mobile second layer in every chunk); delete `stardust/current/measure/<slug>-units.json` between widths; run the two widths sequentially.
- Remaining gaps are measured (see band breakdown): text-module spacing under floated figures and in `.overflow` columns, three-steps section bottom, credits anchoring on tall cards.

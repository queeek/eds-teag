# rollout — https://www.thueringerenergie.de/ → aem-eds (aemcoder/dc15da58@main) — 2026-10-08, refreshed 2026-10-09 after fix-wave-15

```
rollout — www.thueringerenergie.de → aem-eds
==================================================
Pages       9 total · 9 verified · 0 deployed · 0 pending · 0 content-pending · 0 stale · 0 failed
Templates   8 (impressum 1/1 · index 1/1 · haus-baustromanschluss 1/1 · stromtarife 1/1 · program 2/2 · search 1/1 · static 1/1 · ueber-uns-unternehmen 1/1)
Blocks      18 total · 18 converted · 0 pending   (siegel-row added 2026-10-09 — the live badge row)
Quality     health 100/100 · open P1 0 / P2 0 / P3 0   (8 fixed, 1 accepted; judgment layers not assessed)
Pixel table prototypes 3/5 PASS (1440) · 3/5 PASS (360) · deployed 8/8 delivered at 1440 (4 PASS + 4 documented units/content-probe overrides, pixel 8/8 ≤ 10 %) · 8/8 at 360 (5 PASS + 3 overrides, pixel 8/8 ≤ 10 %) — gates/{prototypes,all}-{1440,360}/summary.md
To deliver  none — all 8 planned pages + /search are live and published on the aem.live origin
Content     0 pages awaiting content track
```

Scope: exactly the 8 pages of stardust/.labs/site-plan.json plus the migration's own /search results page (noindex). Publish decision: publish — every page, /nav, /footer, the redirects sheet (2 rows) and the sitemap are live on https://main--dc15da58--aemcoder.aem.live.

## What's missing

Nothing — after fix-wave-15 (2026-10-09, stardust/rollout/units/fix-wave-15-index.report.md) every coverage row is `verified`: the all-pages published-origin gate reads 8/8 delivered at both widths.

| page | 1440 | 360 | note |
|---|---|---|---|
| / (index) | 9.82 % Δh +9 | 9.51 % Δh +65 | units-only overrides (product-teaser inline width; news-posts one live column at 360); events + social wall are live feeds compared as counts |
| /privatkunden/strom/stromtarife | 8.38 % Δh −5 | 9.98 % Δh +54 | documented probe asymmetries (`<wbr>` mail link, static form controls) |
| /privatkunden/strom/stromtarife/teag-strom-easie | 5.75 % Δh +26 | 8.79 % Δh +40 | units-only override (live `li > p` benefit rows) |
| /privatkunden/strom/ersatzversorgung | 7.57 % Δh +10 | 6.42 % Δh +64 | 1440 units-only override (inline button width); 360 PASS |

Passing rows: /impressum 2.57 / 1.51 %, /datenschutz 3.91 / 5.1 %, /privatkunden/strom/haus-baustromanschluss 4.49 / 1.86 %, /ueber-uns/unternehmen 5.05 / 4.25 %. The source changed during the run (its certification badge row is rendered by JS since 2026-10-09 ~14:00Z on the home and tariff pages; the home page's events module rotates its featured appointment within the hour) — both carried across, see the fix-wave-15 report for the residual policy.

## Quality (optimize, run-2)

- Baseline detectors over 9 live rows: title, description, canonical, single h1, `<main>` landmark, img alt, sitemap, duplicate title/description — all clean.
- `ai-search/jsonld`: 8 findings fixed by carrying each page's captured source JSON-LD graph through the `json-ld` metadata row (served graph = source graph on 8/8 pages); the /search finding is accepted (noindex results page without a source counterpart).
- Judgment layers (brand-tensions, design-ux, content-conversion) are not assessed: a replica carries the captured design; no critique source applies.

## Dynamic parity (stardust/qa/dynamics-report.md, D2)

Replayed 13 checks over 10 features · pass 13 · fail 0.

| feature | class | status | check | result |
|---|---|---|---|---|
| menu-template-xhr — desktop mega-menu | A | done | dom-count / no-page-errors | PASS |
| site-search — header search → /search from /query-index.json | S | done | fetch-json + 3 search-query replays | PASS |
| contrast-mode-switch — high-contrast toggle | A | done | dom-count | PASS |
| tariff-calculator-bridge — itcProduktrechner | F | interim (disabled bridge, owner decision) | dom-count | PASS |
| consent-cmp-usercentrics | T | scaffolded-awaiting-owner | consent-gate | PASS |
| tags-gtm-sgtm — GTM, sGTM, Google Ads, Facebook pixel | T | scaffolded-awaiting-owner | consent-gate | PASS |
| analytics-etracker | T | scaffolded-awaiting-owner | consent-gate | PASS |
| chat-widget-moin-ai | T/V | scaffolded-awaiting-owner | consent-gate | PASS |
| external-portal-links — Kundenportal, Mein Zuhause, Störungsauskunft | X | done | dom-count | PASS |
| contact-widget-form — WidgetKontakt1 + BotDetect captcha | F | scaffolded-awaiting-owner | (no replayable check) | — |

Owner decisions outstanding (stardust/dynamic-features.md): production form backend + captcha replacement (D-04), tariff calculator bridge (D-05), consent manager / tag / analytics / chat activation keys (D-06…D-09) — scripts/site-config.js ships every tag disabled.

## Links and site assembly

- Redirects sheet live (2 rows, source `_` paths → served paths, 301); sitemap served 8 = assembled 8; /nav + /footer noindex and published.
- Link audit on the live tree: 359 distinct hrefs, internal 8 → 0 failing; 225 out-of-scope nav/footer targets repointed to the source site (decision in stardust/direction.md § Link-audit decisions); 2 source-side 404s carried verbatim (teag-gas-extra, teag-gas-natur) for the owner.

## Evidence

stardust/replica/gates/all-1440/, all-360/ (origin/eds/diff per page, summary.{json,md}); stardust/replica/gates/prototypes-{1440,360}/; stardust/rollout/optimize/{findings,scorecard}.json; stardust/rollout/coverage/{pages,templates,blocks}.json; stardust/qa/dynamics-report.md; stardust/journal.md.

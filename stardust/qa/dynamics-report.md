# Dynamics parity check — https://main--dc15da58--aemcoder.aem.live — 2026-10-08T20:35:22.439Z

Replayed 13 checks over 10 features · pass 13 · fail 0. Flows, not presence.

| feature | class | status | check | result | detail | third-party requests |
|---|---|---|---|---|---|---|
| menu-template-xhr — desktop mega-menu | A | done | dom-count | PASS | 465 × header .page-header a[href] (min 200) |  |
| menu-template-xhr — desktop mega-menu | A | done | no-page-errors | PASS | none on 3 page(s) |  |
| site-search — header search → /search results from /query-index.json | S | done | fetch-json | PASS | 200 · 8 rows · keys columns,data,offset,limit,total,:type |  |
| site-search — header search → /search results from /query-index.json | S | done | search-query | PASS | 1 results · first: impressum · matches the source |  |
| site-search — header search → /search results from /query-index.json | S | done | search-query | PASS | 3 results · first: strompreise und tarife · matches the source |  |
| site-search — header search → /search results from /query-index.json | S | done | search-query | PASS | 2 results · first: ersatzversorgung strom · matches the source |  |
| contrast-mode-switch — high-contrast toggle | A | done | dom-count | PASS | 1 × header .contrast-switch [role="switch"] (min 1) |  |
| tariff-calculator-bridge — itcProduktrechner | F | interim | dom-count | PASS | 9 × .tariff-calculator [aria-disabled="true"] (min 1) |  |
| consent-cmp-usercentrics | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 3 gated host pattern(s) before consent |  |
| tags-gtm-sgtm — Google Tag Manager, sGTM, Google Ads, Facebook pixel | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 6 gated host pattern(s) before consent |  |
| analytics-etracker | T | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| chat-widget-moin-ai | T/V | scaffolded-awaiting-owner | consent-gate | PASS | no request to 2 gated host pattern(s) before consent |  |
| external-portal-links — Kundenportal, Mein Zuhause, Störungsauskunft | X | done | dom-count | PASS | 2 × a[href^="https://kundenportal.teag.de"] (min 1) |  |

## Features without checks

- contact-widget-form — WidgetKontakt1 with BotDetect captcha (F) — scaffolded-awaiting-owner · owner: production form backend (endpoint + field mapping) and captcha replacement; the customer number is personal account data, so the form is never auto-wired

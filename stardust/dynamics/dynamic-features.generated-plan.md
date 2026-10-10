<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-10-08T11:56:40.512Z · input stardust/current/_dynamics.json (5 pages, 19 findings) · target probe https://main--dc15da58--aemcoder.aem.page -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-www-google-com | A | unknown third-party host www.google.com | 5/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 5/5 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 3 | a-unknown-third-party-host-cfg-moin-ai | A | unknown third-party host cfg.moin.ai | 3/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-www-etracker-de | A | unknown third-party host www.etracker.de | 1/5 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | f-form-protection-captcha-antibot | F | form protection: captcha / antibot | 2/5 | rebuild-native | needs-backend | pending | forms | production backend (vendor form id + field mapping) |  |
| 6 | i18n-locale-variants-de | I18N | locale variants de | 1/5 | rebuild-native | needs-business-decision | pending | locale-tree | scope of the locale trees |  |
| 7 | s-site-search-form-default | S | site search form → /default | 1/5 (reach 0/8) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 8 | s-site-search-form-privatkunden-strom-stromtarife | S | site search form → /privatkunden/strom/stromtarife | 1/5 (reach 0/8) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 9 | s-site-search-form-privatkunden-strom-haus-baustromanschluss | S | site search form → /privatkunden/strom/haus-_-_baustromanschluss | 1/5 (reach 0/8) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 10 | s-site-search-form-ueber-uns-unternehmen | S | site search form → /ueber_uns/unternehmen | 1/5 (reach 0/8) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 11 | s-site-search-form-impressum | S | site search form → /impressum | 1/5 (reach 0/8) | index-backed | self | pending | search-index-backed | none (corpus = the migrated pages; second corpora stay out) |  |
| 12 | t-consent-usercentrics | T | consent: Usercentrics | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | CMP domain script reuse on the new host |  |
| 13 | t-marketing-ad-retargeting-pixel | T | marketing: ad / retargeting pixel | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 14 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 15 | t-unknown-third-party-host-code-etracker-com | T | unknown third-party host code.etracker.com | 5/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-unknown-third-party-host-www-etracker-de | T | unknown third-party host www.etracker.de | 4/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-unknown-third-party-host-widget-moin-ai | T | unknown third-party host widget.moin.ai | 3/5 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 18 | v-iframe-without-src-runtime-injected-embed | V | iframe without src (runtime-injected embed) | 5/5 | embed-passthrough | needs-human-capture | pending | embed-passthrough | resolve the runtime src from a rendered capture |  |
| 19 | x-sign-in-account-links | X | sign-in / account links | 5/5 | decided-out | needs-backend | pending | decided-out | auth / commerce on the new host? |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 6 row(s) — read-settings, search-index-backed.
- **One owner decision batch:** 12 row(s) — inspect the XHR, add a vendor row · production backend (vendor form id + field mapping) · scope of the locale trees · CMP domain script reuse on the new host · which tags run on the new host; property ids · resolve the runtime src from a rendered capture.
- **Already delivered by the capture pipeline:** 0 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **tags** — 6
- **search** — 5
- **detect** — 4
- **forms** — 1
- **locale wave** — 1
- **embeds** — 1
- **register** — 1

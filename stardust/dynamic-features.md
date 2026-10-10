# Dynamic features — thueringerenergie.de (TEAG Thüringer Energie)

Curated from `stardust/dynamics/dynamic-features.generated-plan.md` (19 drafted rows, 5 archetypes probed, reach over 8/8 planned pages).
Scope: the 8 pages selected in `stardust/.labs/site-plan.json`; the site is single-locale (`lang=de`, no hreflang, no switcher).
Target origin probed: https://main--dc15da58--aemcoder.aem.page (no first-party API paths recorded on the page host besides the WebForms postback and the menu template → host-bound 0/0).

## Listings contract
none — no listing blocks were detected on the planned pages (`listingCandidates` empty on all 5 archetypes; the "Unternehmen" overview is a static teaser grid captured in full). No per-page `<meta>` index contract is required for the static path. A `helix-query.yaml` is still authored for the site search (D-02).

## Features
| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| D-01 | menu-template-xhr | Desktop mega-menu loaded at runtime (`GET /Scripts/Template.Menu.Desktop.html`, 200 text/html on every archetype) | A | 5/5 | rebuild-native | self | done (D2: nav document renders the settled menu; parity D-01) | nav-block | — | `_dynamics.json` pages.*.firstPartyApi[1]; settled DOM in `current/pages/*.html` contains the rendered menu |
| D-02 | site-search | Header site search (`ctl00$tbSearch`, mobile twin `ctl00$tbSearch2`), WebForms postback to the same page; results page not in the planned scope | S | 5/5 (reach: form on 8/8) | index-backed | self | done (D2: `helix-query.yaml` → `/query-index.json` total 8, `/search` results block, header form GET `/search?q=`; parity D-02) | search-index-backed | none — corpus = the 8 migrated pages (a smaller corpus than the source is a parity note); the header form never keeps the source origin's results URL | merged rows 7–11 of the draft; fields signature in `_dynamics.json` findings[6] |
| D-03 | contrast-mode-switch | High-contrast mode toggle (`ContrastModusSwitch…CheckBox1`, UpdatePanel postback that swaps the stylesheet) | A | 5/5 | client-only | self | done (D2: client-only class toggle in the header; parity D-03) | client-toggle | — | form1 signature; `itch26876_upContrastModusSwitch` in captured HTML |
| D-04 | contact-widget-form | Contact widget (`WidgetKontakt1`: customer yes/no, customer number, topic, request type, first/last name, phone, e-mail) with BotDetect captcha (`remote.captcha.com`) on 2/5 archetypes and the WebForms postback | F | 2/5 (reach: 8/8 pages carry form1) | rebuild-native (UI) — submission blocked | needs-backend | scaffolded-awaiting-owner (D2: the widget was a hidden postback form at capture — no form rendered, nothing submits; decision batch) | forms | OWNER: production form backend (endpoint + field mapping) and captcha replacement; the customer number is personal account data, so the form is never auto-wired | merged rows 5 + form1 of the draft |
| D-05 | tariff-calculator-bridge | Hidden tariff-calculator bridge form `itcProduktrechner` (hidden fields itcPlz, itcOrt, itcConsum, itcProduct…; action set by script) on home and Stromtarife | F | 2/5 | data-fed (external calculator) — interim static | needs-backend | interim (D2: static tier live — controls as captured, submit `aria-disabled`; parity D-05; fix-wave-9 home callback form: "Anfrage senden" links /privatkunden/service/kontakt, "Kalender anzeigen" datepicker opener rendered inert) | forms | OWNER: calculator endpoint (ITC) and parameter contract for the new host | `_dynamics.json` pages./.forms[1].hidden (12 fields) |
| D-06 | consent-cmp-usercentrics | Usercentrics CMP (`web.cmp.usercentrics.eu`, `v1.api.service.cmp.usercentrics.eu`, consent API) — one dialog on every page | T | 5/5 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner (D2: `scripts/site-config.js` consent.usercentrics enabled: false; parity consent-gate) | consent-gated-tags | OWNER: reuse the CMP settings id on the new domain | draft row 12 |
| D-07 | tags-gtm-sgtm | Google Tag Manager (`www.googletagmanager.com`) with server-side collection on `sgtm.thueringerenergie.de/g/collect`, `dataLayer` (13 pushes on home), Google Ads conversion/remarketing (`www.google.com/ccm/collect`, `/rmkt/collect/…`, `ad.doubleclick.net`, `googleads.g.doubleclick.net`), Facebook pixel (`connect.facebook.net`) | T | 5/5 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner (D2: `scripts/site-config.js` tags.gtm enabled: false; parity consent-gate) | consent-gated-tags | OWNER: which tags run on the new host; sGTM domain mapping | merged draft rows 1, 2, 13, 14 |
| D-08 | analytics-etracker | etracker analytics (`code.etracker.com`, `www.etracker.de`) | T | 5/5 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner (D2: `scripts/site-config.js` tags.etracker enabled: false; parity consent-gate) | consent-gated-tags | OWNER: etracker account on the new host | merged draft rows 4, 15, 16 |
| D-09 | chat-widget-moin-ai | moin.ai chat widget (`cfg.moin.ai/widget/config/Ho8evAJs`, `widget.moin.ai`) — renders the four src-less iframes ("Chat-Einleitung Rahmen", "Öffnen Chat Rahmen", "Chat input field", "Chatfenster") on 3/5 archetypes | T/V | 3/5 | embed-passthrough | needs-business-decision | scaffolded-awaiting-owner (D2: `scripts/site-config.js` chat.moinAi enabled: false; parity consent-gate) | embed-passthrough | OWNER: moin.ai widget allowed on the new domain (the key is domain-bound) | merged draft rows 3, 17, 18 |
| D-10 | external-portal-links | Links to the customer portals (`https://kundenportal.teag.de/`, `/portal/`, `https://mein-zuhause.teag.de`) and to `störungsauskunft.de` | X | 5/5 | rebuild-native (plain anchors, verbatim hrefs) | self | done (D2: verbatim anchors; parity D-10) | external-link | — no sign-in exists on the migrated pages; the draft's evidence URL (an "Einblicke" article) was noise | captured HTML hrefs |

Dropped from the draft as noise: row 6 `i18n-locale-variants-de` (its only evidence is an `apps.apple.com/de/…` store link; the site has one locale, `de`, no hreflang, no switcher).

## Decision batch
One message to the site owner, grouped by what each needs. The static migration does not wait for any of it; every row ships its interim tier.

- **Form backends (D-04, D-05):** production endpoint and field mapping for the contact widget (incl. a captcha replacement for BotDetect) and for the ITC tariff calculator bridge. Until then both forms render as on the live site with submission disabled and a visible "no backend connected" message.
- **Consent and tags (D-06, D-07, D-08):** confirm the Usercentrics settings id, the GTM container / sGTM domain mapping, the Google Ads, Facebook and etracker ids for the new host. Until then all are recorded in `scripts/site-config.js` and disabled.
- **Chat (D-09):** allow the moin.ai widget key on the new domain. Until then the loader is recorded and disabled.

Hands-off resolution applied (dynamics SKILL § Hands-off resolutions): interim tier shipped for every non-`self` row, decision recorded by name here and in the plan; none of these rows is `decided-out` — that takes an owner statement.

## Register (decided-out)
| feature | reason | production statement |
|---|---|---|
| — | none | — |

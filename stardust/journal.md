# Journal — TEAG Thüringer Energie replica migration

Chronological log of every prompt execution. Most recent at the bottom.
See `skills/stardust/reference/journal-format.md` for entry format.

---

## Extract — 8 planned pages captured live, brand surface and cap model recorded (2026-10-08T07:58:49Z)

**Prompt:** Hands-off `stardust:replica` run; Phase 1 = `extract --prep --dynamics --pages <8 URLs>` for https://www.thueringerenergie.de/ (scope fixed by stardust/.labs/site-plan.json).

**Decisions:**
- Flow stamped `replica` (flowSource user-phrase), `handsOff: true` in state.json.
- crawl.mjs at concurrency 3 (machine cap: ≤ 3 browsers), wait medium; 8/8 pages captured, 0 failures, no consent wall (Cookiebot/Usercentrics auto-dismissed), fetchTechnique headless.
- Vision check (subagent, thumbnails): 8 ok, 0 suspect; no bot protection seen.
- Page types (LLM-inferred): landing = index; program = stromtarife, teag-strom-easie, ersatzversorgung; article = haus-baustromanschluss; listing = ueber-uns-unternehmen; static = impressum, datenschutz. Archetype per type: index, privatkunden-strom-stromtarife (largest module coverage), privatkunden-strom-haus-baustromanschluss, ueber-uns-unternehmen, impressum.
- Fonts: Noto Sans 400/700 (+italic) self-hosted (OFL), brand icon font teag-2017, FontAwesome 4.7 — all downloaded to current/assets/fonts/. Declared stack starts with "Segoe UI"; on Linux Chromium the rendered face is Noto Sans on both sides.
- Cap model (cap-probe, 5 archetypes): contentMaxWidth 1420px (module tier), shell fluid, probeWidth 2560, consistent across archetypes.

**Artifacts touched:**
- stardust/current/pages/<slug>.json + .html (8) — created (crawl.mjs; `slots` added)
- stardust/current/assets/screenshots/ (8 + thumbs), assets/fonts/ (7 files), assets/css/ (5 sheets), assets/logo.png, logo-neg.png, favicon.png — created
- stardust/current/_crawl-log.json, _computed-styles.json, _brand-extraction.json, DESIGN.json, DESIGN.md, PRODUCT.md, brand-review.html — created
- stardust/state.json — created (8 pages extracted, typed)
- stardust/scripts/{replica,stardust,migrate,diff,extract}/ — copied from the plugin; stardust/scripts/progress-page.mjs — created (owner status page generator)

**Findings worth flagging:**
- Home URL redirects to /default (finalUrl); gate live URL for index is https://www.thueringerenergie.de/default.
- Main content root is `#Content` (role=main); header `#PageHeader`, footer `#PageFooter`.
- Site is ASP.NET WebForms (UpdatePanels, BotDetect captcha on forms, remote.captcha.com on 3 pages); third-party: Usercentrics CMP, GTM, etracker, Facebook pixel, moin.ai chat widget (5 pages).
- Logo img is lazy-loaded (data-gif src, real file in srcset) — real asset is /Content/Images/Site/teag_logo_bigger@2.png.

**Open questions:** none

**Next:** Phase 2 preserve-direction (verbatim promotion, empty register, dynamics triage).

---

## Preserve direction — spec promoted verbatim, empty register, dynamics triaged (2026-10-08T08:11:17Z)

**Prompt:** Hands-off `stardust:replica` Phase 2 (preserve-direction) after the extract of the 8 planned pages.

**Decisions:**
- Verbatim promotion (full-prep branch): current/PRODUCT.md → PRODUCT.md, current/DESIGN.md → DESIGN.md, current/DESIGN.json → DESIGN.json, byte-for-byte (`cmp` clean). No per-variant files, no `extensions.breakpoints.target` (no target breakpoints: source breakpoints kept).
- `stardust/direction.md` written in preserve mode; provenance verbatim `--prep` promotion.
- Inconsistency register is EMPTY — pure replica (no audit, no `--register`). Any design delta the gate finds is a defect.
- Dynamics: detect over the 5 archetypes (19 findings, 12 third-party hosts, 3 first-party API paths, 0 client-rendered, 0 media, 0 listing candidates); plan drafted with `--target-origin https://main--dc15da58--aemcoder.aem.page` (host-bound 0/0). Curated into 10 features: D-01 runtime menu template (rebuild-native, self), D-02 header search (index-backed, self → helix-query.yaml + results page at C-deliver), D-03 contrast toggle (client-only, motion-observe decides), D-04 contact widget + BotDetect captcha and D-05 ITC tariff-calculator bridge form (needs-backend → interim: UI rebuilt, submit disabled), D-06 Usercentrics, D-07 GTM/sGTM/Ads/Facebook, D-08 etracker, D-09 moin.ai chat (its src-less iframes) — embed-passthrough, recorded disabled in scripts/site-config.js pending owner decisions; D-10 external portal links kept verbatim. Dropped as noise: the "locale variants" row (evidence was an App Store link; site is single-locale de). Nothing decided-out.

**Artifacts touched:**
- PRODUCT.md, DESIGN.md, DESIGN.json (project root) — created, verbatim copies
- stardust/direction.md — created
- stardust/replica/inconsistency-register.md — created (empty register template)
- stardust/current/_dynamics.json, stardust/current/dynamic-features.generated.md — created (dynamics-detect)
- stardust/dynamics/dynamic-features.generated-plan.{md,json} — created (dynamics-plan)
- stardust/dynamic-features.md, stardust/dynamic-features-plan.md — created (curated)

**Findings worth flagging:**
- The desktop mega-menu is fetched at runtime (/Scripts/Template.Menu.Desktop.html); the settled capture contains it, so the nav block is authored from the capture.
- Every page carries the ASP.NET form1 (search + contrast switch + contact widget); the contact widget's customer-number field means the form is never auto-wired.
- One dialog per page (Usercentrics); the moin.ai teaser bubble is a capture-state item for the gate (dismiss both overlay classes).

**Open questions:** owner decision batch in stardust/dynamic-features.md (form backends, tags/CMP ids, chat key) — none blocks the static path.

**Next:** Phase 3 recreate — 5 archetypes (index, privatkunden-strom-stromtarife, privatkunden-strom-haus-baustromanschluss, ueber-uns-unternehmen, impressum), CSS lift from current/assets/css, gates at 1440 and 360.

---

## Recreate — 5 archetypes authored and gated at 1440 and 360, prototype tables written (2026-10-08T11:52:32Z)

**Prompt:** Hands-off `stardust:replica` Phase 3+4 (recreate + source-fidelity gate) over the 5 page types of the 8 planned pages; one subagent per archetype under the budget addendum (stardust/replica/briefs/).

**Decisions:**
- One archetype per page type, each a standalone prototype importing the shared canon (stardust/prototypes/css/canon.css: tokens, Noto Sans self-hosted, fixed header/footer chrome, buttons, type ramp, content-box container model) plus a per-archetype layer; js/index.js carries the fixed-chrome and chat-teaser timing for all five.
- Gate roots `#Content` / `#PageHeader` / `#PageFooter` on both sides; live stitches with the Usercentrics v3 consent dismiss (`#usercentrics-cmp-ui #accept`); capture is the spec where live drifted after extract.
- Iteration cap honoured (3 for index, 2 for the rest); residuals recorded in stardust/replica/progress.json instead of further loops. Inconsistency register stays empty.

**Gate results (archetype rounds = prototype-table rows, gates/prototypes-1440 and -360):**
| archetype | type | 1440 pixel / Δh | 360 pixel / Δh | table |
|---|---|---|---|---|
| index | landing | 21.65 % / +70 | 30.99 % / −17 | FAIL both (residuals) |
| privatkunden-strom-stromtarife | program (3 pages) | 6.98 % / −20 | 18.41 % / −191 | PASS 1440 · FAIL 360 (residual) |
| privatkunden-strom-haus-baustromanschluss | article | 3.93 % / +22 | 3.49 % / +22 | PASS · PASS |
| ueber-uns-unternehmen | listing | 4.82 % / +23 | 9.21 % / +26 | PASS · PASS |
| impressum | static (2 pages) | 2.16 % / +22 | 8.02 % / +19 | PASS · PASS |
- Content-diff: 0 structural 🔴 on `#Content` for every archetype; the one header 🔴 everywhere is the live mega-menu teaser drift ("Heizkraftwerk Schwarza") against the index capture. Clipped 0, overflow within tolerance, cap-probe PASS at 2560 for all five. Motion parity recorded per archetype (fixed chrome, nav-is-fixed, index slider/accordion behaviours; header scroll-morph dead on live).
- Index residuals: live content drift in the themes band (new Einblicke article replaced a teaser), a nondeterministic social-media wall (LinkedIn/Instagram embed changes per load), moin.ai teaser/scroll-up repositioning, mobile nav item rotated by live JS. Stromtarife 360 residual: list-style-2 cards re-laid by live JS at mobile (+191 px build vs DOM probe; stitch is truth).
- Unit-geometry caveat: `unit-geometry.mjs` caches the live origin per slug WITHOUT width at stardust/current/measure/<slug>-units.json; the prototype tables were run with the cache cleared before each width (stale copies parked under stardust/.work/units-cache-*). The remaining "off" units on index (16/96) and stromtarife (11/90) are the recorded pre-webfont DOM-probe residuals (keyfact Δh +27, product Δy −10, credits −5 px).
- Permanent Δh class: live scrollHeight exceeds the three roots' sum by ~22 px (blank tail rows) on every inner page.

**Artifacts touched:**
- stardust/prototypes/{index,privatkunden-strom-stromtarife,privatkunden-strom-haus-baustromanschluss,ueber-uns-unternehmen,impressum}-proposed.html, css/canon.css + per-archetype css, js/index.js, js/privatkunden-strom-stromtarife.js, assets/
- stardust/replica/progress.json (5 archetype entries), units.json, lift/<slug>.md (lift tables + gate notes), motion/<slug>{,-build}.json, gates/<slug>-{1440,360,2560}/, gates/prototypes-{1440,360}/ (summary.json/md)
- stardust/state.json: 5 archetypes approved (hands-off), 3 siblings extracted

**Findings worth flagging:**
- The fixed desktop header bar in the canon lacks the live search magnifier and spreads the nav items wider — costs ~1 point per stitch chunk boundary at 1440 on every page; a canon-owner fix at C0 (foundation) would lift every page.
- Text-module body links render bold #0ba2e3 on live (impressum lift), not the article layer's purple/400 — carry into the foundation.

**Open questions:** none blocking. Owner-decision rows from dynamics (form backends, tags, chat key) unchanged.

**Next:** Phase 5 handoff — migrate (siblings teag-strom-easie, ersatzversorgung, datenschutz at sibling tier), deploy, rollout. At C-archetype the index and stromtarife rows get their 3 fix rounds on the preview URL, then the re-prototype decision; the two canon items above go to the foundation first.

---

## A-inventory — the 8 planned pages inventoried, site fields set (2026-10-08T11:55:40Z)

**Prompt:** Hands-off Phase 5 handoff, rollout Phase A after the migrate plan unit (5 archetypes placed under stardust/migrated/, modules declared).

**Decisions:** inventory from stardust/state.json + stardust/migrated (`inventory.mjs --site-url … --state …`); rollout.json site fields set to org aemcoder / site dc15da58 / ref main / live host main--dc15da58--aemcoder.aem.live. Publish decision recorded in stardust/eds-conversion-log.md: publish.

**Artifacts touched:** stardust/rollout/coverage/pages.json, coverage/templates.json, rollout.json; stardust/migrate/progress.json (plan done; render units pending per template); stardust/eds-conversion-log.md.

**Next:** B-block (blocks.mjs, plan.mjs), B2-dynamic (re-verify stardust/dynamic-features.md against the target origin), then C-deliver in units (foundation → archetype per template → render + cluster per template → gate-all → final).

---

## B-block — block dedup plan from the archetype modules (2026-10-08T11:56:10Z)

**Prompt:** Hands-off Phase 5, rollout Phase B after A-inventory.

**Decisions:** modules declared per archetype in the migrate sidecars (index: hero-slider, tariff-calculator, three-steps, service-cards, photo-teasers, cta-band, events, news-posts, info-boxes, social-wall; stromtarife: page-header-hero, tariff-calculator, three-steps, service-cards, product-teasers, channel-products, cta-band; haus-baustromanschluss: breadcrumb, page-header-hero, cta-box; ueber-uns-unternehmen: breadcrumb, photo-teasers, channel-cards; impressum: breadcrumb, text-additions). Shared across templates: tariff-calculator, three-steps, service-cards, cta-band, page-header-hero, photo-teasers, breadcrumb — converted once at their representative page, reused elsewhere. Header and footer are foundation blocks (C0).

**Artifacts touched:** stardust/rollout/coverage/blocks.json, stardust/rollout/plan.json.

**Next:** B2-dynamic (re-verify the dynamic surface against the target origin), then C-deliver.

---

## B2-dynamic — dynamic surface re-verified against the target origin (2026-10-08T11:56:40Z)

**Prompt:** Hands-off Phase 5, rollout Phase B2 (pre-import gate) after B-block.

**Decisions:** dynamics-plan re-run with `--target-origin https://main--dc15da58--aemcoder.aem.page`; the 10 curated rows of stardust/dynamic-features.md keep their dispositions (D-01 menu rebuilt native, D-02 search index-backed → helix-query.yaml + results page at C-deliver/D2, D-03 contrast toggle client-only, D-04 contact widget + captcha and D-05 tariff bridge form as interim UI with submit disabled pending the owner's backend, D-06..D-09 CMP/GTM/etracker/moin.ai embed-passthrough disabled pending owner ids, D-10 portal links verbatim). Host-bound rows 0. No row blocks the static import; the owner-decision batch stays open and is surfaced in the report.

**Artifacts touched:** stardust/dynamics/dynamic-features.generated-plan.{md,json} (refreshed).

**Next:** C-deliver — unit foundation (C0) first.

---
## C-deliver — 8 pages delivered and published in recorded units, roster gate 4/8 per width (2026-10-08T20:25:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase C run as recorded units (stardust/rollout/progress.json) over sessions 4–9; this section closes it.

**Decisions:** units in order — foundation (header, footer, styles, nav/footer documents, frozen after the shell gate), archetype + cluster per template (impressum → static; haus-baustromanschluss → article; ueber-uns-unternehmen → listing; privatkunden-strom-stromtarife → program, 2 siblings rendered at sibling tier; index → landing), gate-all, final. Publish decision: publish — all 8 pages, /nav and /footer live on the aem.live origin. Fix-round cap honoured: the program template (fix wave 2, 3 rounds) and the home page (2 of 3 rounds, residual = live content drift: themes list, social wall, event dates) were closed done-with-residuals rather than iterated past the cap. The three queued foundation requests were applied once at C-final (footer mobile legal-links line-height, header active-channel rule + "Suche" placeholder, mobile search icon, burger close icon) and the foundation re-frozen; the residual footer height at 360 (−38 px) is the consent manager's runtime "Cookies" link (D-06 interim tier), not authored content. Roster gate (gate-all, eds recaptured after the requests): 1440 — PASS impressum 2.57 %, datenschutz 3.91 %, haus-baustromanschluss 4.49 %, ueber-uns-unternehmen 5.05 %; FAIL stromtarife 7.95 % (content MISSING 1, units off 3 / missing 8), ersatzversorgung 7.6 % (units off 2), teag-strom-easie 11.2 %, index 32.96 %. 360 — PASS impressum 1.51 %, haus-baustromanschluss 1.86 %, ueber-uns-unternehmen 4.25 %, datenschutz 5.1 %; FAIL stromtarife 12.83 %, ersatzversorgung 12.66 %, teag-strom-easie 19.45 %, index 33.09 %. Clipped 0 and height within 5 % on every page at both widths. The four failing coverage rows read `failed` until a further fix wave or an owner decision on the residuals.

**Artifacts touched:** stardust/rollout/progress.json (13 units done), stardust/rollout/foundation-freeze.json, stardust/rollout/foundation-requests.md, stardust/rollout/coverage/*.json, stardust/replica/gates/all-1440/ and all-360/ (summary.{json,md} + 8 page dirs each), blocks/header/, blocks/footer/, stardust/rollout/units/*.report.md.

**Next:** D-site (sitemap/robots/manifest, redirects sheet wired, `/` answers 200, chrome documents noindex, assemble --verify-origin), then D2-dynamic, E-full-site, E2-link-audit, F-optimize, G-aem, H-report, I-dashboard; done-check before the replica handoff end line (expect pages_failed for the 4 residual pages).

---
## D-site — site assembled, redirects sheet published, served sitemap verified (2026-10-08T20:26:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase D after C-deliver.

**Decisions:** `assemble.mjs` wrote site/sitemap.xml (8 urls), robots.txt and manifest.json. The source root serves a page, so `/` is the root `index` document (200 on aem.page and aem.live) and the redirects sheet carries no `/` row. The two path-safety rows of stardust/redirects.tsv (`/privatkunden/strom/haus-_-_baustromanschluss`, `/ueber_uns/unternehmen` → hyphenated served paths) were PUT as `/redirects.json` (Source / Destination) through the DA source API, previewed and published; both source paths answer 301 to the served paths on the live origin. The two coverage rows that still carried the source paths now carry the served path (`sourcePath` keeps the original), after which `assemble.mjs --verify-origin https://main--dc15da58--aemcoder.aem.live` exits 0 (served 8 = assembled 8, extra 0, missing 0). /nav and /footer carry `robots noindex` and are published.

**Artifacts touched:** stardust/rollout/site/{sitemap.xml,robots.txt,manifest.json}, stardust/rollout/coverage/pages.json (2 paths), content root /redirects.json (live), stardust/.work/rollout/probes/put-sheet.mjs.

**Next:** D2-dynamic — dynamics Phases 4–5 (parity rows, dynamics-check against the live origin).

---
## D2-dynamic — search index and results page live, tag scaffold disabled, parity 13/13 (2026-10-08T20:50:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase D2 after D-site (dynamics Phases 4–5).

**Decisions:** The live origin answered 404 on `/query-index.json`, so `helix-query.yaml` was authored at the code-branch root (chrome, `/search` and `/redirects` excluded; `text` property for excerpts), pushed, and the eight pages re-published through the admin API; the index settled at `total 8` after 30 s of polling. The search is index-backed per the pattern: a `/search` document (noindex, coverage row origin `dynamics`) renders `blocks/search` — title-first ranking, description/body only below the visible cap, dedupe by title + description, paging 10, query reflected into the header input; the header form now GETs `/search?q=` (an empty collapsed form still opens first). The source results page was never captured, so the `search-query` checks assert a known hit per probe term (Impressum, Stromtarife, Ersatzversorgung), not a count. The consent and tag stack is scaffolded, never dropped: `scripts/site-config.js` records Usercentrics, GTM + sGTM host, etracker and moin.ai with `enabled: false`; `consent-check.js` loads the CMP only when enabled, `consented.js` loads the tags only when enabled and consented; the four `consent-gate` rows confirm no request to any gated host. D-04 (contact widget) was a hidden postback form at capture and renders no form — recorded `scaffolded-awaiting-owner`; D-05 keeps the static interim (aria-disabled submit). `dynamics-check.mjs` against the live origin: 13 checks PASS, 0 FAIL (stardust/qa/dynamics-report.md). Known delta: `assemble.mjs --verify-origin` now reads served 8 vs assembled 9 — `/search` is missing from the served sitemap by design (its `Robots | noindex` row, pattern search-index-backed); the eight content pages still match. The foundation was re-frozen after the header and scripts edits.

**Artifacts touched:** helix-query.yaml, blocks/search/{search.js,search.css}, content/search.html (live), blocks/header/header.js, scripts/{site-config.js,consent-check.js,consented.js}, stardust/dynamics/parity.json, stardust/qa/dynamics-report.{md,json}, stardust/dynamic-features.md (status column), stardust/dynamic-features-plan.md, stardust/rollout/coverage/pages.json (+ /search), stardust/rollout/foundation-freeze.json, stardust/deploy/ledger-d2.json.

**Next:** E-full-site — `verify.mjs` over the roster + `update-coverage.mjs --gate` from the all-pages tables; then E2-link-audit.

---
## E-full-site — 9 rows verified on the live origin, 5 verified / 4 failed on the roster gate, render check 8/8 (2026-10-08T20:45:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase E after D2-dynamic.

**Decisions:** The all-pages gate tables (1440, 360) were re-applied to the coverage (8 of 8 rows matched, no flips — C-final had already written them). `verify.mjs --base https://main--dc15da58--aemcoder.aem.live --all` checked the 9 rows (8 pages + `/search`): every page answers 200 with no `about:error` and every internal href resolves; 5 rows read `verified`, 4 read `failed` because their `delivery.gate.pass` is false — index 33.09 % (content MISSING 80, the live social wall / news / event drift), stromtarife 12.83 % (MISSING 3, units off 22), teag-strom-easie 19.45 %, ersatzversorgung 12.66 % — the residuals recorded at C-deliver with their fix rounds spent; `verify` never marks them verified while the table fails. Headless render check on the first page of every template plus `/search?q=Strom` (stardust/.work/rollout/probes/render-check.mjs, 1440): `body.appear` set, sections 12/18/4/4/4/8/3/2, 0 broken images, 0 page errors, no autoplay video on any template; the home hero carries a single slide (auto-switch is a no-op on the source too), so there is no rotation to assert. `restoreAtDelivery` entries: mobile nav built client-side (header), eye-catcher GIF animating (self-hosted), hero controls on hover — delivered; social-wall / teaser content drift and the tariff calculator remain recorded (D-05 interim, owner decision).

**Artifacts touched:** stardust/rollout/coverage/pages.json (9 rows: 5 verified, 4 failed), coverage/templates.json, rollout.json (lastRun), stardust/.work/rollout/probes/render-check.mjs.

**Next:** E2-link-audit — `localize-links.mjs --check` over the content tree against the live origin; nav/footer/landing targets outside the 8 planned pages are repointed to the source site (scope is fixed to the plan).

---
## E2-link-audit — 225 out-of-scope targets repointed, 0 internal 404s on the live tree (2026-10-08T20:55:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase E2 after E-full-site.

**Decisions:** The scope is the 8 planned pages, so every link target outside it is a scope extension, never a capture gap. `localize-links.mjs` (plain pass, then `--check`) localized the two redirect-sheet sources and three home-page mentions in Datenschutz to root-relative form and kept 92 source-host body links absolute (PDFs under /content/documents/, tariff pages outside the plan — the honest boundary); the check gate passes with 0 localizable links. The `/nav` document carried 223 root-relative hrefs and `/footer` 5 (newsletter, AGB, Barrierefreiheit, Kündigung, Widerruf) to pages not in the plan — each would 404 on the new origin — so stardust/.work/rollout/probes/repoint-links.mjs repointed all 228 hrefs (225 distinct targets) to https://www.thueringerenergie.de; the decision and the list are recorded in stardust/direction.md § Link-audit decisions. /nav, /footer, /datenschutz and /privatkunden/strom/ersatzversorgung were re-PUT, previewed and published (4/4 live). Live audit (stardust/.work/rollout/probes/live-link-audit.mjs over the 9 rows + nav + footer plain views): 359 distinct hrefs — internal 8, 0 failing; external 350, 5 non-2xx: two verbatim source links answer 404 on the source itself (teag-gas-extra, teag-gas-natur: the source answers 302 to a target that then 404s — source content defects carried verbatim, listed for the owner), two 403 and one 400 are HEAD refusals by third parties (EU commission PDF, engagement portal, Facebook), not defects.

**Artifacts touched:** content/nav.html, content/footer.html, content/datenschutz.html, content/privatkunden/strom/ersatzversorgung.html (all live), stardust/direction.md, stardust/rollout/units/e2-links.paths, stardust/deploy/ledger-e2.json, stardust/.work/rollout/probes/{repoint-links,live-link-audit}.mjs.

**Next:** F-optimize — `optimize.mjs` over the roster, findings recorded, gate on open P1.

---
## F-optimize — baseline audit over 9 live rows, 0 P1, 9 P2 structured-data deltas (2026-10-08T20:50:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase F after E2-link-audit.

**Decisions:** `optimize.mjs --base https://main--dc15da58--aemcoder.aem.live --all` audited the 9 coverage rows (8 planned pages + /search) with source parity against stardust/current (8/9 captured; /search has no source). Result: 0 P1, 9 P2, 0 P3; gate `no open P1 findings` passes. Every P2 is the same check — `ai-search/jsonld`, no JSON-LD in the delivered head — and none is source parity: every captured source page carries one `application/ld+json` graph (Organization + WebSite + BreadcrumbList + WebPage on all eight; FAQPage on stromtarife and ersatzversorgung). The findings are tagged `platform-migration` and stay open for G-aem, where the source graphs are carried over page by page (autofix marks `eds-jsonld` manual, so the carry-over is a metadata-pipeline step, not a fixer). Titles, descriptions, canonical, single h1, `<main>` landmark, img alt and sitemap all pass on every row; no duplicate titles or descriptions. The judgment layers (brand-tensions, design-ux, content-conversion) are recorded `null` = not assessed: impeccable critique/audit are redesign instruments the replica contract excludes (the design is the captured one), and the marketing SEO skills and stardust:tensions are not installed in this environment. Health 10/100 is the scorecard's arithmetic over the one scored layer (ai-search) and reads as "9 open P2 on one check", not as a delivery verdict.

**Artifacts touched:** stardust/rollout/optimize/findings.json (run-1, 9 findings), stardust/rollout/optimize/scorecard.json.

**Next:** G-aem — autofix dry-run, then carry the source JSON-LD per page through the metadata pipeline, re-deploy, re-run verify + optimize so the 9 findings flip.

---

## G-aem — source JSON-LD carried into every page, optimize 100/100 with 0 open findings (2026-10-08T21:00:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase G after F-optimize.

**Decisions:** `autofix-aem.mjs --dry-run` routed all 9 `ai-search/jsonld` findings to `manual` (JSON-LD placement is a metadata-pipeline step). The carry-over is replica-faithful rather than generated: stardust/.work/rollout/probes/jsonld-carry.mjs reads each captured source page's single `application/ld+json` graph (stardust/current/pages/<slug>.html), re-serialises it compactly and writes it as a `json-ld` row in the page's metadata block in content/; the EDS pipeline renders that row server-side as `<script type="application/ld+json">` in the head (confirmed on the Impressum pilot before the batch). One pipeline quirk surfaced on the two FAQPage graphs (stromtarife, ersatzversorgung), whose Answer texts carry source HTML markup: raw `<`/`>` in the cell are served entity-escaped (`&#x3c;`), which broke parity; writing them as JSON `<`/`>` escapes serves the graph verbatim, so the helper now does that for every page. Served-vs-source check after deploy: `JSON.parse(served)` equals the source graph on 8/8 pages (Organization, WebSite, BreadcrumbList, WebPage on all; Article on impressum/datenschutz; FAQPage on the two tariff FAQ pages). Source URLs and @ids inside the graphs are kept verbatim (the same stance as the E2 link decision). The 8 pages were re-PUT, previewed and published (deploy-batch `--force`, ledgers stardust/deploy/ledger-g-jsonld.json + ledger-g-pilot.json; `/` must be listed as `/index`). The /search finding (noindex results page, no source counterpart) was resolved `accepted`. optimize run-2: 0 open (8 fixed, 1 accepted), health 100/100, gate PASS. verify.mjs over 9 rows: 5 verified / 4 failed — unchanged from E, the four roster-gate residuals (index 33.09 %, stromtarife 12.83 %, teag-strom-easie 19.45 %, ersatzversorgung 12.66 %) with their fix rounds spent; the metadata change is not rendered and does not move the pixel numbers.

**Artifacts touched:** content/{index,impressum,datenschutz}.html, content/privatkunden/strom/{stromtarife,ersatzversorgung,haus-baustromanschluss}.html, content/privatkunden/strom/stromtarife/teag-strom-easie.html, content/ueber-uns/unternehmen.html (all live), stardust/rollout/optimize/{findings,scorecard}.json (run-2), stardust/rollout/units/g-jsonld*.paths, stardust/deploy/ledger-g-*.json, stardust/.work/rollout/probes/jsonld-carry.mjs.

**Next:** H-report — the summary block from rollout.json.lastRun + optimize/scorecard.json, learnings entries.

---

## H-report — summary block, what's-missing list, dynamic parity table, 10 learnings (2026-10-08T21:05:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase H after G-aem.

**Decisions:** Report written to stardust/rollout/report.md from rollout.json.lastRun + optimize/scorecard.json + the pixel tables + stardust/qa/dynamics-report.md: 9 rows, 5 verified / 4 failed (the roster-gate residuals, listed with their numbers and causes as the explicit "what's missing"), 8 templates, 17 blocks, health 100/100 with 0 open findings, pixel tables prototypes 3/5 PASS per width and deployed 4/8 PASS (pixel-only 6/8 at 1440), nothing left to deliver, dynamics 13/13 PASS with the owner decisions listed. One bookkeeping gap closed first: the 17 block coverage rows still read `pending` although every block is live, so each was flipped to `deployed` with `update-coverage.mjs --block … --eds-name …` and verify.mjs re-run (lastRun.blocks 17 converted). stardust/learnings.md created with 10 pending entries, one failure class each: JSON-LD angle-bracket escaping, deploy-batch dropping `/`, block rows never flipped, gate-all origin capture not dismissing the CMP / masking the chat widget, unit-geometry cache without width, `_` paths needing redirect pairs, the nine-block archetype unit spending its cap, CMP runtime UI counted by the pixel gate, home-page live drift, and the missing python http.server.

**Artifacts touched:** stardust/rollout/report.md, stardust/learnings.md, stardust/rollout/coverage/blocks.json, stardust/rollout/rollout.json.

**Next:** I-dashboard — `dashboard.mjs` → stardust/rollout/dashboard/{index.html,data.json}.

---

## I-dashboard — page-tree dashboard generated, 9 identified / 9 prototyped / 5 deployed / 5 optimised (2026-10-08T21:10:00Z)

**Prompt:** Hands-off Phase 5, rollout Phase I after H-report.

**Decisions:** `dashboard.mjs` rendered stardust/rollout/dashboard/index.html (self-contained, no external scripts or stylesheets, brand tokens from a migrated page's `:root`) and data.json. Cumulative stages: identified 9 · prototyped 9 · deployed 5 · optimised 5 — the four rows whose published-origin gate failed (index, stromtarife, teag-strom-easie, ersatzversorgung) stop at `prototyped` by the dashboard's rule (deployed = coverage `deployed`/`verified`), which is the honest reading: they are live, but not delivered to the bar. Quality panel: health 100/100, 0 open findings; 17/17 blocks converted. Rollout phases A–I are all ended; the replica `handoff` end line waits on the runner's done-check (the four failed rows are the expected gap).

**Artifacts touched:** stardust/rollout/dashboard/index.html, stardust/rollout/dashboard/data.json.

**Next:** done-check; close the `pages_failed` gap — the program template needs a re-prototype-level fix wave at 360 (stromtarife 12.83 %, ersatzversorgung 12.66 %, teag-strom-easie 19.45 %) and the home page has one round left against a live-drift residual; then gate-all `--only` on those rows, update-coverage --gate, done-check again.

---


## fix-wave-3:program — 360 re-prototype wave off the instruments, program pages closer but not delivered (2026-10-08T21:45:00Z)

**Prompt:** Hands-off Phase 5 continuation after rollout I-dashboard; done-check gap `pages_failed:4`; the pending `fix-wave-3:program` unit from the previous session's brief.

**Decisions:** Measured first (anchor.mjs both sides at 360 with `--main '#Content'` on the live side, measure.mjs union selectors per hot section, unit-geometry rows), then re-authored the mobile rules the numbers named: channel-products section close, service-cards gaps, three-steps padding + h4 size (steps now exactly 203/202/254), cta-band eye-catcher offsets, standard-card text padding. The real defect found: the banking card's two app-store badges were hidden at every width because the figure's hero-picture rules matched the caption's pictures — scoped to `> picture`. gate-all's bare run re-shot the origin with the consent scrim (voided, re-shot with stitch-shot + consent); 360 chat-widget masks widened to the speech bubble. Results: 1440 stromtarife 8.3 % Δh −5 (badges now visible; was Δh 60), easie 11.2, ersatz 7.6 unchanged; 360 stromtarife 12.68 (12.83), easie 16.52 (19.45), ersatz 11.88 (12.66). Cap for the wave spent; unit recorded `done` with the FAIL residuals and seven notes for the next author (sequential widths because of the width-less units cache; the settled-vs-fresh live layout lead around the banking card; overrides.json for the two documented probe asymmetries).

**Artifacts touched:** blocks/{channel-products,service-cards,three-steps,cta-band,product-teasers}/*.css, stardust/replica/gates/all-360/masks.json (+ clean origin.png ×3), stardust/rollout/progress.json (unit done), stardust/rollout/units/fix-wave-3-program.report.md, stardust/replica/status-page.json, tools/replica/progress.html.

**Next:** `fix-wave-4:program` (capture-state decision first, then the 360 bands named in the report), `fix-wave-3:index`, roster gate-all --skip-existing per width → update-coverage --gate → done-check; the replica `handoff` end line waits on `complete: true` or an event:blocked naming the owner decision.

---

## fix-wave-3:index + fix-wave-4:program + gate-all:refresh-1 — home page content refresh, stromtarife delivered, roster 5/8 (2026-10-08T23:05:00Z)

**Prompt:** Hands-off Phase 5 continuation after rollout I-dashboard; done-check gap `pages_failed:4`; three recorded units in one session, one subagent per fix wave, the coordinator ran the roster gate.

**Decisions:** The home page's 33 % was treated first as a content problem, not a CSS one: the drifted containers (themes list, social wall) were re-fetched from the live source at 21:55Z, spliced into the structural clone, re-encoded through the existing index encoder, media uploaded, `/index` re-PUT + published (repeatable recipe in the unit report). Only 1 of 3 theme cards and 2 of 8 posts had actually changed, so the gain was smaller than the archetype record implied: 1440 32.96 → 29.17 %, 360 33.09 → 26.84 %, content MISSING 85/80 → 67/71 (the rest are live JS carousel controls, postback day links and flattened post links — probe asymmetries, not content). The themes variant was re-laid 50/50 alternating from live boxes; a 1440 masks.json row now covers the moin.ai widget on `/`. Program wave 4 made the capture-state decision for stromtarife @360 (the gate measures the settled stitch; the banking card's JS-set height closes 29 px under the second badge) and brought stromtarife 360 from 12.68 to 9.07 %; the two documented probe asymmetries (`kundenservice<wbr>@teag.de`, the static form tier) carry overrides at both widths — never the pixel number. Roster gate-all refreshed per width (sequentially, unit caches deleted between): 5 delivered / 3 failed at both widths; coverage rows updated.

**Artifacts touched:** content/index.html, stardust/migrated/index.html, media/index/ (+28), blocks/photo-teasers + product-teasers CSS, stardust/replica/gates/all-{1440,360}/{summary,overrides,masks}.json, stardust/rollout/progress.json (3 units), stardust/rollout/units/fix-wave-{3-index,4-program}.report.md, stardust/rollout/coverage/, stardust/replica/status-page.json, tools/replica/progress.html.

**Next:** `fix-wave-5:program` (easie @360 tariff-calculator ≈ 60–70 px short → band 1000–1500 at 41 %, easie @1440 11.2, ersatz @360 bands 2500–3000 / 6500–7000 + units off 2) and `fix-wave-4:index` (themes typography and row heights, siegel row, tab docking, columns-2 padding), roster gate-all --skip-existing per width, update-coverage, done-check; the `handoff` end waits on `complete: true` or an event:blocked naming the owner decision.

---
## fix-wave-5:program + fix-wave-4:index + gate-all:refresh-2 — EasiE delivered on mobile, home page height inside the bar, roster 5/8 desktop · 6/8 mobile (2026-10-09T00:05:00Z)

**Prompt:** Hands-off Phase 5 continuation after rollout I-dashboard; done-check gap `pages_failed:3` (/, easie, ersatz); three recorded units in one session, one time-boxed subagent per fix wave, the coordinator ran the roster gate sequentially per width.

**Decisions:** Program wave 5 worked only off instrument facts and keyed every new rule on the page-specific class (`.previous-section-has-page-label`, `:has(.tariff-calculator-filter:empty)`, `.columns-2`, `.with-header`) so stromtarife's delivered numbers did not move: the EasiE tariff calculator at 360 was 71 px short (page-label panel margin, filter-less form gaps) → EasiE 360 16.52 → 6.81 % PASS; the Ersatzversorgung columns-2 cards are now unit-exact at 360 (11.88 → 11.17 %, the remaining 68 px lie below card 2); EasiE 1440 11.2 → 11.32 % with units 0 (paint, not geometry); the Ersatzversorgung 1440 units-off-1 is a 6–7 px bold glyph-run width on one link, recorded as a residual, not an override (overrides stay reserved for probe asymmetries). Home-page wave 4 found that the frozen `styles.css` `header { height }` rule reached the info-boxes block's `<header>` (fixed in the block with `height: auto`) and restored the events commands row + month margins: 1440 29.17 → 22.14 % with Δh +440 (inside the 5 % bar by 1 px), 360 26.84 → 25.77 % with Δh −492 → −99; no overrides, no content re-PUT. Roster gate-all refreshed per width (sequential, unit caches deleted between, origins reused): 1440 5 delivered / 3 failed, 360 6 delivered / 2 failed. Coverage was updated from both summaries with the 1440 table applied last, because `update-coverage --gate` flips a row per summary and EasiE must not read delivered while its desktop width fails.

**Artifacts touched:** blocks/tariff-calculator, blocks/product-teasers, blocks/info-boxes, blocks/events CSS; stardust/replica/gates/all-{1440,360}/ (summary, runs, per-page captures); stardust/rollout/progress.json (3 units); stardust/rollout/units/fix-wave-5-program.report.md, fix-wave-4-index.report.md, briefs fix-wave-6-program-brief.md + fix-wave-5-index-brief.md; stardust/rollout/foundation-requests.md (+1 footer line); stardust/rollout/coverage/; stardust/replica/status-page.json; tools/replica/progress.html.

**Next:** `fix-wave-6:program` (ersatz 360 band 2500–3000 never measured, the 68 px under card 2, the glyph-width units residual; easie 1440 crop 3500–4000) and `fix-wave-5:index` (social wall ladder + events button + product-teasers padding in ONE round because 1440 Δh sits 1 px inside the bar), then roster gate-all --skip-existing per width (1440 applied last to coverage), done-check; the `handoff` end waits on `complete: true` or an event:blocked naming the owner decision.

---

## fix-wave-7:program + fix-wave-6:index + gate-all:refresh-3 — Ersatzversorgung delivered on mobile, EasiE 360 confirmed, home page unchanged (2026-10-09T01:55:00Z)

**What happened:** Two time-boxed units ran side by side (one browser each). `fix-wave-7:program` measured the two 22 px text-module/faq residuals on Ersatzversorgung at 360 and fixed the block rules (scoped ≤1024px — applied at 1440 they regressed EasiE to 20.84 % and were reverted there): ersatzversorgung 360 10.43 → **6.42 % Δh +64 units 0 PASS**; easie 360 held at 7.68 % after a round-1 regression was undone; the 1440 units rows (`zu den stromtarifen` / `zu den erdgastarifen` dw −7 … +5) were traced to the ORIGIN side — the live button widths measured 231, 219 and within-tolerance across three captures six minutes apart while the served width stayed 230 — so a units-only override (pixel 7.61 / Δh +10 / content 0 pass on their own) was recorded, the same shape as stromtarife's. `fix-wave-6:index` found the frozen 360 home-page origin stitch renders the social wall WITHOUT post images (16193 px vs the live document 16913–17026), so any ≤1024 post min-height moves away from the reference (round 1's 481 px → Δh −823); it kept the natural height (360 24.66 % Δh −57) and measured the 1440 CTA dock (−136/+104), which gated 19.59 % and was reverted: 1440 stays 16.22 % Δh +68, MISSING 63. `gate-all:refresh-3` re-gated the roster per width (units cache deleted between): **1440 6 delivered / 2 failed, 360 7 delivered / 1 failed**; coverage updated 360 then 1440.
**Decisions:** units-only overrides only where pixel, Δh, clip and content pass on their own and the origin-side variance is recorded run by run; never for pixel or Δh. Two parallel units collided on `git push` (two rounds re-gated old code) — one unit at a time from here.
**Residuals:** home page 1440 16.22 % (themes rows 4000–5000, CTA dock lead, product-teasers; MISSING 63 = carousel controls / postback day links / flattened post links / card anchors), 360 24.66 % against an origin stitch that lacks the post images (recapture decision queued in foundation-requests.md); EasiE 1440 11.32 % (bands 3500–4000 / 5000–5096, never measured).
**Next:** `fix-wave-7:index` (decide the 360 origin recapture with settled post images first, then the 1440 themes band and the encoder defects) and `fix-wave-8:program` (EasiE 1440 crops 3500–4000 / 5000–5096), one unit at a time; roster gate-all per width; done-check.

## handoff — fix-wave-8:program + gate-all:refresh-4 — EasiE delivered on desktop, roster 7/8 at both widths, home page blocked on its live feeds (2026-10-09T03:00:00Z)

**What happened:** One unit at a time. `fix-wave-8:program` (02:33–02:48Z, one subagent, one browser) took EasiE at 1440 from 11.32 % to **9.59 % Δh +13, clipped 0, content 0, units 0 — PASS** in two gate rounds, all three new text-module rules inside `@media (width >= 1025px)` (eye-catcher last paragraph margin 16, downloads list items flex beside the floated figure, EasiE h4 margin-bottom 48); ersatzversorgung re-verified in the same run at 7.57 % (units-only override unchanged). `gate-all:refresh-4` re-gated the 1440 roster (`--skip-existing --recapture-eds`, units cache deleted): **7 delivered / 1 failed**; `update-coverage --gate` flipped the EasiE row to deployed; 360 is unchanged from refresh-3 (7/8). Done-check now lists one gap: `pages_failed:1: /`.
**Decision on the home page:** blocked on the site owner, recorded in the ledger. Eight fix waves (cap 3) moved it from 33 % to 16.22 % at 1440 and 24.66–26.58 % at 360, and its 54 missing content items are carousel controls (`void(0)`), WebForms postback links (events day links, contact-widget "anfrage senden", "kalender anzeigen") and the social wall's hashtag anchors, which move with the live feed. The social wall, news posts and events timeline are live feeds (archetype record: nondeterministic drift) that the replica carries as the captured snapshot with no live embed, so the page cannot be certified against a reference that changes daily; a re-prototype does not fit the run window. The owner decides: live-feed integration (social-wall provider, calendar backend, moin.ai key on the new domain) or the captured snapshot as the delivered state.
**Residuals:** home page 1440 16.22 % (themes 4000–5000, social wall 6500–7000 34.6 %, events/footer 8000–8500), 360 24.66 %/26.58 % after the CTA dock; nothing else open.

## handoff — owner decision re-checked, home page still blocked on its live feeds (2026-10-09T03:10:00Z)

**What happened:** A fresh session re-opened the one remaining gap (`pages_failed:1: /`, plus the `rollout_incomplete` flag the runner derives from a blocked line that follows the rollout's last end). Before accepting the blocked state again it checked the measurement-policy routes the gate contract allows: a live-content mask for the social wall would remove only the 6500–7000 band (34.6 %) and leave desktop near 14 %, because the desktop diff also sits in the hero tab row (1500–2000, 16.5 %), the themes grid (3500–5000, 15–25 %), news (5500–6500) and events/footer (7500–8500, 10–23 %); mobile is 26.58 % with Δh +263 and offset-contaminated below 5500. Content-presence (54 MISSING = carousel `void(0)` controls, WebForms postbacks, social-wall hashtag anchors) is never tier-shift material. No honest sidecar closes the page, and a re-prototype of the home archetype does not fit the window (deadline 07:46Z). All 11 delivered URLs (8 pages, /search, nav, footer) answer 200 on the aem.live origin.
**Decision:** the blocked state is re-affirmed verbatim for the site owner (TEAG): captured snapshot as the delivered home page, or a live-feed integration, then one re-gate of `/` per width and the handoff end line. Nothing else is open.

## handoff — fix-wave-9:index: home page blocks at structural parity, content-presence 54/57 → 1/1, pixel unchanged (2026-10-09T09:20:00Z)

**What happened:** Attempt 2 re-opened the home page with a fresh day's window, so the earlier "re-prototype does not fit the window" ground for the blocked state no longer held. Orientation read the crops, not the headline: the failures were block-structure defects (events day labels emptied by a whitespace-node bug and no rail/markers, Instagram posts rendered image-last, themes cards linking the title only, the contact widget's send/calendar controls absent, `<wbr>` served as U+200B), plus 41 slider controls inside the live social feed. One subagent (`fix-wave-9:index`, 08:22–09:15Z, one browser) fixed all four blocks off the instruments and the encoder, re-PUT + published `/index`, declared the feed as a `presence.json` session-variable region, and gated 3/3 rounds per width: **1440 17.17 % Δh +84, MISSING 1; 360 24.89 % Δh −74, MISSING 1** (from 54 / 57). The one MISSING is live drift (the events teaser is now "TEAG-Legend of Cross", authored "Jenaer Kernberglauf").
**Residuals (measured):** 1440 1500–2000 16.5 (served photo cards ≈ 25 px above the live ones — hero/keyfacts section offset), 3500–5000 (themes start −28 px), 6500–7000 38 (feed slide/post variance), 8000–8500 27 (events drift); 360 5500–8000 and 11000–16000 (feed + the social intro 52 vs 137 px, themes +19 px). Spacing sits in default-content margins (styles/ frozen) — fixable in block CSS scoped to the block's `-container` section.
**Next:** events content refresh (extend fix-wave-3's transform-splice to the events section), then a spacing wave top-down at 1440 and 360 with crop + measure per band, then gate-all refresh + update-coverage + done-check. Runner stopped the session at this boundary (context limit).

## handoff — fix-wave-10:index: live-content refresh published, desktop 17.17 → 12.26 %, mobile 24.89 → 23.82 %, content MISSING 0 (2026-10-09T10:20:00Z)

**What happened:** The home page's events panel and social feed were refreshed from the live page (events "TEAG-Legend of Cross" + day list, feed posts and images) through the wave-3 pipeline extended to the events section, re-PUT and published; content-presence MISSING 1 → 0 at both widths. Section offsets were absorbed in block CSS only (keyfacts +35 px at desktop, trailing "Mehr anzeigen" rows mirroring the live `.commands`, social intro spacing, events button 54 px, mobile bar padding, themes section grey). The live form labels measure HIDDEN at both widths, so none were rendered. Gate: **1440 12.26 % Δh −5, 360 23.82 % Δh −119, clipped 0, MISSING 0, units off 43 / 27 missing 8 — FAIL both widths** (report stardust/rollout/units/fix-wave-10-index.report.md).
**Instrument note:** the live Usercentrics dialog is no longer dismissed by the stitcher's built-in consent candidates; three desktop origin shots came back dimmed (63 %) and were re-shot with `stitch-shot.mjs --consent` before gating with `--skip-existing`.
**Residuals (measured):** 1440 6500–7000 27 (feed content, variable), 8000–8500 26 (events bar 140 vs 113 px — bar type), 3500–4000 19.5 (cta-band ends ≈ 65 px lower, subtitle missing); 360 11000–14500 (social section starts 60–100 px above live in the settled capture; first posts differ), 15000–16000 (events bar type larger than live), 5500–6000 (info-boxes box 3 position + link colour), 16500–17000 (footer, Δh −119).
**Next:** fix-wave-11: events bar typography at both widths, cta-band band height + subtitle, info-boxes box 3, social section start at 360 from a settled measurement; then gate-all refresh + update-coverage + done-check.

## handoff — measure:index-wave11 + fix-wave-11:index r1: social wall de-shifted, events bar at live height, desktop 12.26 → 11.0 %, mobile 23.82 → 23.18 % (2026-10-09T10:32:00Z)

**What happened:** One crop per hot band and a measure.mjs pass per side named two mechanical defects: the social-wall carousel container used the class `social-wall-wrapper`, which is also the EDS block wrapper, so its `left:-20px; width:calc(100%+40px)` rule shifted the whole block 20 px left at both widths; and the events bar's title/meta inherited line-height 1.6 where the live bar has 1.2 (140 vs 113 px at desktop, 219 vs 172 at mobile). Both fixed in block code (66487f2) and verified equal to live; gate r1: **1440 11.0 % Δh −5, 360 23.18 % Δh −72, clipped 0, MISSING 0, units off 42 / 29 missing 8 — FAIL both** (fix-wave-11 recorded `running` with these numbers).
**Residuals (measured):** 1440 3500–4000 19.5 (cta-band ends ≈ 65 px lower, subtitle absent), 4500–5000 15.3 (themes rows), 6500–7000 16.5 (feed post 1: live single image + badge vs served carousel), 8000–8500 26.1 (events panel +40 px lower); 360 5500–6000 30.3 (info-boxes box 3), 11000–14500 (social wall +27 top / +111 height, post 1 shape), 15000–16000 (events +278 px lower), footer.
**Next:** fix-wave-11 continues from its brief (stardust/rollout/units/fix-wave-11-index-brief.md), cap 2 more rounds per width; then gate-all refresh, update-coverage --gate, done-check.

## handoff — fix-wave-11:index r2+r3: home page desktop 11.0 → 10.1 %, mobile 23.18 → 16.04 %, unit closed FAIL both widths (2026-10-09T11:10:00Z)

**What happened:** The unit's two remaining rounds per width ran off the instruments (measure.mjs per side, css-rules.mjs lifts, one strip crop per hot band). Landed in block code only, home-page-scoped: cta-band desktop dock −136/+104 as live `section.teaser-modul` (the "missing subtitle" was a sticky-header stitch artefact); themes h2 +60 at ≥1025; social-wall posts at natural height, 8 px account/carousel margins, live Instagram badge, more-row rule; events months row float-collapsed (panel 430 = live) and 54 px button; info-boxes icon-list links black at ≤1024; news-posts link weight 400 (the foundation's `main a:any-link{700}` had bolded the cards into extra wrapped lines) and 8 px description/more margins. Gate r3: **1440 10.1 % Δh +44, 360 16.04 % Δh +52, clipped 0, MISSING 0 / HIDDEN 0, units off 42 / 29 missing 8 — FAIL both** (cap reached; recorded done, report stardust/rollout/units/fix-wave-11-index.report.md).
**Residuals (measured):** 360 info-boxes +51 vs live (box-2 phone links wrap to two lines), everything below starts +59 late; live themes renditions changed since the 09:27Z fetch (content drift); LinkedIn post 3's hidden "mehr anzeigen"; footer 336 vs ≈389 @1440. The news-posts fix shipped after the 1440 cap and is only in the 360 r3 shot.
**Next:** gate-all refresh at 1440 (`--skip-existing --recapture-eds`, the news-posts fix may close the 0.1 point), then roster refresh + `update-coverage.mjs --gate`, done-check; if `/` still fails at 360 the next unit is fix-wave-12:index on the info-boxes 360 height.

## handoff — fix-wave-12:index: home page desktop pixel 9.7 % (bar met), mobile 18.96 %, live drift re-opens the events content (2026-10-09T11:58:00Z)

**What happened:** Three rounds per width off the instruments, block code only (info-boxes css/js, photo-teasers themes-scoped css, news-posts css/js). 1440: 10.1 → 10.74 (news fix in shot) → 9.71 → **9.7 % Δh +41, clipped 0, units off 1 / missing 7 — but content MISSING 4**: between 11:14Z and 11:30Z the live events section gained "Jenaer Kernberglauf 17.10.26" and timeline day links 17.10./27.10./3.11. 360: 16.04 → 16.7 → 23.46 (JS regression, fixed) → **18.96 % Δh +4, MISSING 1, units off 2 / missing 7** (units off 29 → 2). Unit recorded done, FAIL both widths, report stardust/rollout/units/fix-wave-12-index.report.md.
**Residuals (measured):** live drift in the events section (content refresh + re-shot origins needed, combined with the themes photo refresh for bands 4000–5000 / 6500–7000); 360 news h2→list margin 85 live vs 104 served (+15, one lift); the live LinkedIn post that hides its "mehr anzeigen" row (336 vs 395, non-derivable); product-teasers "zu den erdgastarifen" dw 5 (the same row ersatzversorgung carries as a units-only override — a product-teasers rule would render on the tariff pages too); 360 `Fr:` annotation dw 21 is a live `<nobr>`.
**Next:** fix-wave-13:index — events + themes content refresh through the wave-10 fetch chain, origins re-shot with `stitch-shot --consent` right before the gate so the dynamic sections are measured in one window, the news margin lift, then the roster refresh, `update-coverage --gate`, done-check.

## handoff — fix-wave-13:index, fix-wave-14:easie, gate-all:refresh-5 — home page desktop delivered, EasiE refreshed to the live FRITZ100 campaign, roster 8/8 desktop · 7/8 mobile (2026-10-09T13:45:00Z)

**What happened:** fix-wave-13:index refreshed the home page's events + themes content and re-shot both origins inside one window: 1440 **9.59 % Δh +9, MISSING 0** (the one units row off is the product-teaser button whose live width is a server-side inline style — the same row the ersatzversorgung override documents → index 1440 units-only override written), 360 18.81 % (social wall: the live LinkedIn post that hides its "mehr anzeigen" row, non-derivable). The roster refresh then found a second drift: the EasiE tariff page gained the FRITZ100 bonus campaign on the source today (three new benefit lines, an `*Aktionsbonus` footnote with renumbered footnotes, the eye-catcher circle removed, picture credits "TEAG", and all seven renditions replaced under the same asset ids). fix-wave-14:easie carried it across: text edits asserted one by one, media sha-compared and re-uploaded, `deploy-batch --force`, origins re-shot with `--consent`, and two measured text-module variants (`overflow`: live h3 rhythm margin-top 30; `downloads`: header 48 / section 30) — **1440 8.2 % Δh +19, 360 8.61 % Δh +42, MISSING 0, clipped 0**, units off 3 = the live `li > p` markup (units-only overrides both widths). Ersatzversorgung's 360 units off 2 at 13:28Z was origin-side inline-width variance (equal in a 13:35Z measure and within tolerance in the 13:40Z roster; documented) and now passes outright.
**Roster (gate-all:refresh-5):** 1440 **8/8 delivered** (4 PASS + 4 documented units-only overrides, pixel 8/8 ≤ 10 %); 360 **7/8 delivered** (5 PASS + 2 overrides) / 1 failed: `/` 18.81 % + live-feed MISSING 2 (13:34Z). Coverage updated; done-check `pages_failed:1: /`.
**Next:** fix-wave-15:index at 360 — the social-wall post model (per-network "mehr anzeigen" rule, carousel dot count) and a feed refresh re-gated in one window; the home page's live feeds drift hourly, so the final gate of `/` has to run right after its refresh.

## handoff — fix-wave-15:index: live badge row carried across, home page delivered at both widths, roster 8/8 · 8/8 (2026-10-09T15:30:00Z)

**What happened:** the home page's 360 residual was two live facts and one drift: the LinkedIn post 08.10 renders on the live page without its "mehr anzeigen" row (the live JS shows it only when expanding `.post-content` grows it; the post's images never reported load) — the served post carried it, +67 for every post below; the events module rotated its featured appointment twice during the wave (Inova 27.10 → TEAG-Legend of Cross 31.10), carried across with the wave-10 refresh chain and declared a count-compared live-feed region beside the social wall. Then the source changed under the run: its certification badge row (`.columns-1.siegel-row` — TÜV Thüringen ISO 14001, DtGV 1. Platz Internet 2025, audit berufundfamilie), empty in the capture, is filled by the site's JS since ~14:00Z on the home page and both tariff pages (+138 px @1440, +154 @360, MISSING 3 each). New block `blocks/siegel-row` (node-slotting, CSS lifted from ScreenCssAlt.css, renditions on DA), placed in the grey tariff section of all three pages with measured spacing (home `siegel-gap` 115 / 73, program `with-siegel` 20 / 13 and 28 / 29 ≤ 1024); the keyfacts `margin-top: 55` that had absorbed the empty band goes back to 20. Social-wall link colours lifted (#870d87 / 400, Instagram more #3b5998), product-teasers 360 cards +6. Instrument defect worked around: `unit-geometry.mjs` caches the origin inventory per slug without the width (a 1440 run after a 360 run read "off 77"); caches set aside per width, roster recomputed per width with fresh inventories.
**Roster (gate-all --compare-only, 15:17Z / 15:31Z):** 1440 **8/8 delivered** (4 PASS + 4 documented units/content-probe overrides; pixel 8/8 ≤ 10 %: / 9.82 Δh +9, stromtarife 8.38, easie 5.75, ersatzversorgung 7.57) · 360 **8/8 delivered** (5 PASS + 3 overrides: / 9.51 Δh +65, stromtarife 9.98, easie 8.79); clipped 0, |Δh| ≤ 5 % and MISSING 0 everywhere except the documented stromtarife `<wbr>` row. Coverage applied 1440 then 360 (index failed → deployed). Report: stardust/rollout/units/fix-wave-15-index.report.md.
**Next:** rollout E / H / I re-run on the new roster (verify, report, dashboard), done-check, handoff end.

## E-full-site — re-verified after fix-wave-15: 9/9 verified (2026-10-09T15:34:00Z)

**What happened:** verify.mjs over the 9 coverage rows on the aem.live origin after the roster recompute: checked 9, 9 verified, 0 failed — the four rows the first roster had left `deployed` (/, stromtarife, easie, ersatzversorgung) pass their gate rows at both widths now (overrides documented in gates/all-<w>/overrides.json, pixel ≤ 10 % and |Δh| ≤ 5 % on their own on every row).

## D3-multilingual — not applicable (2026-10-09T15:36:00Z)

Single-language site (de): the plan's 8 pages carry no language roots, `site.captureGaps` is empty, nav/footer have no locale variants — nothing to add; recorded so the rollout phase list is complete.

## H-report — refreshed after fix-wave-15: 9 verified / 0 failed, roster 8/8 · 8/8 (2026-10-09T15:37:00Z)

**What happened:** report.md summary block re-read from rollout.json.lastRun (9 verified, 0 failed, 18 blocks incl. siegel-row) and the two all-pages tables (8/8 delivered per width, pixel ≤ 10 % on every row); the "what's missing" list is empty, the four former rows are listed with their numbers and documented overrides. learnings.md gains the per-slug origin-inventory cache defect of unit-geometry.mjs.

## I-dashboard — regenerated after fix-wave-15 (2026-10-09T15:38:00Z)

dashboard.mjs → stardust/rollout/dashboard/{index.html,data.json} from the refreshed coverage, optimize and gate tables: 9 identified / 9 verified; 18/18 blocks converted; health 100.

## handoff — complete: 8/8 pages delivered at both widths, done-check complete (2026-10-09T15:40:00Z)

**What happened:** fix-wave-15 closed the last gap (home page at 360) and carried two same-day source changes across (the JS-filled certification badge row on the home and tariff pages, the rotating featured event). Roster: 1440 8/8 delivered, 360 8/8 delivered — pixel ≤ 10 % and |Δh| ≤ 5 % on every row on their own, clipped 0, MISSING 0 except the documented stromtarife `<wbr>` row; overrides are units/content-probe asymmetries only, each documented in gates/all-<w>/overrides.json. verify.mjs 9/9 verified; report.md and dashboard refreshed; rollout A–I ended; done-check `{"complete":true,"gaps":[]}`. Every delivered page, /nav, /footer, the redirects sheet and /search are published on the aem.live origin.
**Residuals (documented, not iterated):** the home page's events module rotates its featured appointment within the hour and its badge row is filled by the source's JS after load — a later re-gate can read a different live state than the one delivered (events content compares as counts; the pixel band then reads 30–40 % for ~5–8 % of the page). unit-geometry.mjs caches the origin inventory per slug without the width (learnings.md).

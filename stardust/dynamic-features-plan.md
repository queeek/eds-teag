# Dynamic features — plan (thueringerenergie.de replica)

Inventory: `stardust/dynamic-features.md`. The static recreation (Phases 3–4) runs regardless of this plan; each phase below replaces one degradation with the live behaviour, in the C-deliver window unless noted.

## Phase S0 — static first (recreate + foundation) · self
- **D-01 menu**: the nav block carries the full desktop menu content as captured (settled DOM); no runtime fetch. Verified by content-diff on the header root (0 structural 🔴) and chrome-parity.
- **D-03 contrast switch**: `motion-observe.mjs` decides — if the toggle fired on the live page it is implemented as a client-only class toggle swapping the contrast stylesheet; if dead it is recorded as dead. Verified by motion-compare.
- **D-10 external portal links**: verbatim anchors. Verified by content-presence (0 MISSING links).
- **D-04 / D-05 forms, interim**: the visible controls are rebuilt as captured (pixel gate), the form has no action, the submit control is disabled and shows "Kein Backend verbunden – das Formular ist in der Vorschau deaktiviert." (interim message only; not source copy). Effort: in the archetype prototype, no extra wave.

## Phase S1 — search (C-deliver, after foundation) · self
- Author `helix-query.yaml` (index over the 8 migrated pages: path, title, description, lastModified), push, publish, poll `/query-index.json` (bounded, ≥ 5 s apart).
- Header search block submits to a `/suche` results page rendered from the index (count + titles). Parity check: one probe term recorded at detect time is missing (`searchFormPages 0` — the source results page is not in scope), so the rebuilt search is checked for presence and for a non-empty result on a title word from the corpus.
- Effort: one block + one yaml + one results page.
- **Status (D2, 2026-10-08):** done — `helix-query.yaml` committed, `/query-index.json` total 8 after re-publishing the pages; `/search` (noindex, coverage row origin `dynamics`) renders `blocks/search`; header form submits `?q=` (the source's `tbSearch` names are accepted too). The source results page was never captured, so the parity checks assert a known hit per probe term, not a count.

## Phase S2 — consent-gated tags (C-deliver) · owner decision
- `scripts/site-config.js` carries, disabled: Usercentrics settings id (D-06), GTM container + sGTM host (D-07), etracker id (D-08), moin.ai widget key (D-09). Enabling any of them is the owner's switch; the loader order is CMP first, then consent-gated tags.
- Verification: with everything disabled, no third-party request leaves the migrated pages (parity.json records 0 third-party hosts).
- **Status (D2, 2026-10-08):** scaffolded-awaiting-owner — `scripts/site-config.js` written (all `enabled: false`), `consent-check.js` loads the CMP only when enabled, `consented.js` loads GTM / etracker / moin.ai only when enabled and consented; parity `consent-gate` rows replayed against the live origin.

## Phase S3 — form backends · owner decision
- D-04 contact widget and D-05 tariff bridge are wired to the owner-provided endpoints; captcha replaced by the owner's choice. Until then Phase S0's interim stays.
- **Status (D2, 2026-10-08):** awaiting owner — D-05 interim live (parity D-05); D-04 renders no form (the widget was a hidden postback form at capture).

## Owner decision batch
See `stardust/dynamic-features.md` § Decision batch — three groups: form backends, consent and tags, chat.

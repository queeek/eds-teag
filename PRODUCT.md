<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-08T07:58:00Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/index.json
    - stardust/current/pages/privatkunden-strom-stromtarife.json
    - stardust/current/pages/ueber-uns-unternehmen.json
  synthesizedInputs: []
  stardustVersion: 0.29.1
-->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

_provenance: inferred — basis: top-navigation labels and page descriptions in pages/index.json, pages/privatkunden-strom-stromtarife.json, pages/ueber-uns-unternehmen.json._

- **Private households (Privatkunden)** in Thüringen and, for electricity and gas, across Germany: people comparing or switching an electricity/gas tariff, moving house (Haus- & Baustromanschluss), or landing in Ersatzversorgung. Their job on the site: enter PLZ and annual consumption, compare tariffs, order online, reach customer service ("Sie haben Fragen?", "Rückruf vereinbaren", "Netzstörung?").
- **Business and public customers** — Geschäftskunden, Kommunen, Stadtwerke — reached through dedicated top-nav branches (not captured in this crawl).
- **Existing customers** using the Kundenportal/app (login links on every page) and **job seekers** (Karriere link in the utility bar).
- **Corporate audiences** reading the Über uns section: management, structure, certificates, publication duties (EEG, REMIT, Stromkennzeichnung), events.

## Product Purpose

TEAG Thüringer Energie is the regional energy utility for the Free State of Thüringen. The site's own description: "Die TEAG versorgt Sie mit Strom, Erdgas und Fernwärme - Ihr führender Energiedienstleister in Thüringen." (pages/index.json#description). It sells and services electricity, natural gas and district-heating supply, hosts a tariff calculator (Strom / Erdgas / Energielösungen, PLZ + Jahresverbrauch), and acts as the corporate front door for the TEAG group (press, events, social wall, publication duties). Success, as the site frames it: a completed tariff switch ("Für den Vertragsabschluss benötigen Sie nur 5 Minuten", "Wir übernehmen den Rest") and a serviced customer relationship ("Rund 500.000 Kunden aus ganz Deutschland vertrauen auf die TEAG").

## Positioning

Source: pages/ueber-uns-unternehmen.json body, pages/privatkunden-strom-stromtarife.json headings.

- "Energiekompetenz aus Thüringen": the leading energy service provider in the Free State, over 500,000 customers, supplying households, businesses, industry and Stadtwerke — a regional incumbent with a Germany-wide retail offer.
- Three repeated proof points on home and tariff pages: **Überall / Bundesweit**, **Einfach**, **Sicher**.
- Tariff range spans "Preisoptimierer", "langfristige Planer", "Wärme-Liebhaber", dynamic tariffs (TEAG.Strom dynamic, börsenpreisbasiert, iMSys-only) and Grundversorgung; campaign line on the sub-brand page: "Mehr Thüringen, weniger Kosten."
- Group breadth signalled in news: TEAG Solar (Agri-PV), TEAG Mobil (E-LKW charging), Thüringer Netkom (fibre), TEAG Akademie (training).

## Capabilities and Constraints

Observed in pages/*.json (ctas, links, customProps, body) and _brand-extraction.json#systemComponents.

- **Tariff calculator** on index, stromtarife and teag-strom-easie: tabs Strom / Erdgas / Energielösungen, inputs PLZ + geschätzter Jahresverbrauch, cyan CTA "Preisvorteil berechnen"; fully online ordering ("Einfach online bestellen").
- **Customer self-service** lives off-site at kundenportal.teag.de (Kundenportal link + Login on all 8 pages) and in the TEAG-Kundenportal-App; the website itself is marketing, tariff sales and service entry points.
- **Service channels on every page**: fixed purple "Kontakt" side tab, chat bubble, hotline Tel. 03641-8171111, kundenservice@teag.de, Rückruf form, Netzstörung link, footer newsletter form; service hours shown in the footer band.
- **Content types present**: landing (index), program/tariff pages, article (Haus- & Baustromanschluss), listing (Über uns → Unternehmen), static legal (Impressum, Datenschutz), FAQ accordion, legal downloads, news cards with dates, social wall, events.
- **Platform facts**: ASP.NET WebForms postbacks (`WebForm_DoPostBackWithOptions` in link hrefs), site search at /suche, 75 CSS custom properties per page — Bootstrap-named `--bs-primary` … `--bs-danger` rewired to brand values (`--bs-primary-rgb: 135,13,135`), plus `--box-padding-*` and `--flex-gap-*` layout props. Capture used Playwright, wait mode medium (2500 ms), HTTP 200 on all pages, consent handled automatically.
- **Terminology** (keep verbatim): Grundpreis, Arbeitspreis / Verbrauchspreis, Erstlaufzeit, Nettopreisgarantie, Grundversorgung, Ersatzversorgung, Fernwärme, iMSys (intelligentes Messsystem), PLZ, Jahresverbrauch, Tarifrechner, Kundenportal.
- **Not captured**: Geschäftskunden, Kommunen, Stadtwerke, Akademie and Einblicke branches; the Kundenportal; any English-language variant (none observed).

## Brand Commitments

Source: _brand-extraction.json § site, palette, type, voice, register; DESIGN.md.

- **Name**: TEAG Thüringer Energie (short form "TEAG", group "TEAG-Gruppe"); mascot bear illustration on purple CTA bands.
- **Register**: `brand` — marketing and service site, no app-like UI.
- **Voice**: German (de-DE) only, formal **Sie**-form, service-oriented ("Wir übernehmen den Rest", "Sie haben Fragen?"), regional pride ("Energiekompetenz aus Thüringen", "Mehr Thüringen, weniger Kosten."), plain benefit words repeated as proof points (Überall · Einfach · Sicher). CTA samples: "Preisvorteil berechnen", "Mehr erfahren", "Jetzt wechseln", "Weiterlesen", "Tarifdetails".
- **Identity constraints observed**: TEAG purple `#870d87` for structure (nav bar, bands, title boxes, links), cyan `#0ba2e3` for action buttons, magenta `#c60086` accent, black text on white, boxed `.center` content; type stack `"Segoe UI", "Noto Sans", …` with self-hosted Noto Sans 400/700; brand icon font teag-2017; radii 4 px (buttons) / 12 px (cards) / 50 % (circles); soft `0 0 10px rgba(0,0,0,.2)` shadows.
- **Assets**: assets/logo.png (294×106), assets/logo-neg.png (260×98, for purple grounds), assets/favicon.png (192×192), assets/fonts/NotoSans-*.woff, assets/fonts/teag-2017.woff.
- **Anti-references (observed absences)**: no glassmorphism, no inner shadows, no modular type scale, no dark theme (a high-contrast mode exists behind the "Kontrast" toggle, off by default), purple is never used for primary action buttons and cyan never for structural chrome.

## Evidence on Hand

All under stardust/current/:

- pages/<slug>.json + pages/<slug>.html for 8 pages: index, privatkunden-strom-stromtarife, privatkunden-strom-stromtarife-teag-strom-easie, privatkunden-strom-ersatzversorgung, privatkunden-strom-haus-baustromanschluss, ueber-uns-unternehmen, impressum, datenschutz (headings, body text, 100 CTAs/page, links, media, customProps, slots).
- assets/screenshots/<slug>.png (full-page, 1440 px) and <slug>-thumb.png for all 8 pages; assets/fonts/ (Noto Sans ×4, teag-2017 .woff/.ttf, fontawesome-webfont.woff2); assets/css/ (ScreenLess.css, Bundle.css, HhFrameworks.css, ScreenCssAlt.css, jQuery-Ui.css); assets/logo.png, assets/logo-neg.png, assets/favicon.png.
- _brand-extraction.json (palette, type, motifs, system components, voice), _computed-styles.json (census at 1440 and 360 px), _crawl-log.json (8 pages, 0 failures, 0 capture gaps), DESIGN.md, DESIGN.json (12 module candidates).
- Real copy on hand: tariff names and benefit bullets, 500,000-customer claim, press releases dated 2026 (TEAG Solar Agri-PV, Netkom/1&1, TEAG Mobil), Akademie Azubi news, hotline and e-mail.
- **Absent — do not fabricate**: testimonials, case studies, price figures per tariff (only labels captured), imagery licences beyond credits in body text ("gstockstudio/stock.adobe.com", "Carlo Bansini/TEAG", "trurnit"), business-customer content, English copy, measured container width (DESIGN.json has no extensions.breakpoints).

## Product Principles

_provenance: inferred — basis: repeated headings and body copy across index and stromtarife (three-steps, service cards, proof points)._

1. Switching is a three-step, five-minute job: calculate, order online, "Wir übernehmen den Rest".
2. Regional trust first, national reach second: Thüringen identity carries the brand; "bundesweit" is the extension.
3. Service is always one click away: contact tab, chat, callback and hotline on every page, not buried in a help centre.
4. One finder for every energy: Strom, Erdgas and Energielösungen share the same PLZ-plus-consumption entry.

## Accessibility & Inclusion

Observed only: "Weiter zum Inhalt" skip link first in the CTA order on all 8 pages; a "Kontrast" toggle in the utility bar driving `.user-prefers-more-contrast` rules (off by default); a "Barrierefreiheit" link in the footer legal row; language de-DE. 65 of 164 captured `<img>` elements (40 %) carry empty alt text, 38 of them on index (social wall and teaser imagery). Body text is pure black on white.

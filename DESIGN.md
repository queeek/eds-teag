<!-- stardust:provenance
  writtenBy: stardust:extract
  writtenAt: 2026-10-08T07:56:10Z
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/_computed-styles.json
    - stardust/current/assets/css/ScreenLess.css
  synthesizedInputs: []
  stardustVersion: 0.29.1
-->
---
name: TEAG Thüringer Energie — current state
description: Regional energy utility site; purple brand, boxed content on white, photo heroes with purple title boxes, cyan action buttons.
colors:
  primary: "#870d87"
  primary-deep: "#5f175f"
  accent-magenta: "#c60086"
  secondary: "#0ba2e3"
  secondary-deep: "#0c669e"
  text: "#000000"
  text-muted: "#666666"
  text-subtle: "#767676"
  background: "#ffffff"
  surface: "#f2f2f2"
  surface-alt: "#ededed"
  border: "#d9d9d9"
  border-strong: "#a0a0a0"
  icon-muted: "#8c8c8c"
  error: "#e62a30"
typography:
  display:
    fontFamily: "\"Segoe UI\", \"Noto Sans\", \"San Francisco\", Roboto, Helvetica, Arial, Sans-Serif"
    fontSize: "28.96px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  heading-2:
    fontFamily: "\"Segoe UI\", \"Noto Sans\", \"San Francisco\", Roboto, Helvetica, Arial, Sans-Serif"
    fontSize: "28.96px"
    fontWeight: 700
    lineHeight: 1.2
  heading-3:
    fontFamily: "\"Segoe UI\", \"Noto Sans\", \"San Francisco\", Roboto, Helvetica, Arial, Sans-Serif"
    fontSize: "18.72px"
    fontWeight: 700
    lineHeight: 1.3
  heading-4:
    fontFamily: "\"Segoe UI\", \"Noto Sans\", \"San Francisco\", Roboto, Helvetica, Arial, Sans-Serif"
    fontSize: "20.8px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "\"Segoe UI\", \"Noto Sans\", \"San Francisco\", Roboto, Helvetica, Arial, Sans-Serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  small:
    fontFamily: "\"Segoe UI\", \"Noto Sans\", \"San Francisco\", Roboto, Helvetica, Arial, Sans-Serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  xs: "4px"
  sm: "5px"
  md: "10px"
  lg: "12px"
  xl: "18px"
  pill: "50%"
spacing:
  xs: "8px"
  sm: "16px"
  md: "20px"
  lg: "40px"
  xl: "60px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.background}"
    rounded: "{rounded.xs}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.secondary-deep}"
    textColor: "{colors.background}"
  button-purple:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.xs}"
  button-purple-hover:
    backgroundColor: "{colors.primary-deep}"
  card:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
  band-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
---

# TEAG Thüringer Energie — current design system (descriptive)

## Overview

This document describes the design of www.thueringerenergie.de **as it is today** (captured 2026-10-08, 8 pages, 1440 and 360 px). It is the replica target: nothing here is a proposal. Values come from the computed-style census (`_computed-styles.json`) and the site's own stylesheet (`assets/css/ScreenLess.css`); every number can be traced to a source listed in `_brand-extraction.json`.

## Colors

- **TEAG purple `#870d87`** is the brand: header navigation bar, CTA bands, hero title boxes, text links, footer contact band, the fixed "Kontakt" side tab. Hover/footer depth uses `#5f175f`; magenta `#c60086` appears as an accent.
- **Cyan blue `#0ba2e3`** is the action color for primary buttons (tariff calculator, "Preisvorteil berechnen"); a left-to-right gradient `#0c669e → #0ba2e3` paints a few wide bands.
- Content sits on **white**; light greys `#f2f2f2` / `#ededed` carry card backgrounds, form fields and the legal footer row; borders are `#d9d9d9` / `#a0a0a0`.
- Body text is pure black; secondary text `#666` / `#767676`. Error red `#e62a30`.
- Contrast mode exists (`.user-prefers-more-contrast` rules) but is off by default and out of replica scope unless registered.

## Typography

- One stack everywhere: `"Segoe UI", "Noto Sans", "San Francisco", Roboto, Helvetica, Arial, Sans-Serif`. The site self-hosts **Noto Sans** 400/700 (normal + italic) as webfonts; on systems without Segoe UI (all gate captures) Noto Sans is the rendered face. Replica ships the same stack with the same Noto Sans files.
- Headings are bold (700). Measured levels: h1 and h2 both 28.96 px (1.81 em), h4 20.8 px, h3 18.72 px (1.17 em); card titles 22.3–25.7 px; the campaign hero reaches 51.46 px once. The ramp is **ad-hoc** (em-derived per module), not modular.
- Body 16 px / 1.5; footnotes and legal rows 13–14 px.
- Icons: brand icon font **teag-2017** (`.icon.icon-*` glyphs via `::before`) and FontAwesome 4.7 for social icons.

## Layout

- Full-bleed shell (header bars, hero photos, purple bands, footer band) with **boxed content** in `.center { margin: 20px auto }`; the measured container width and content caps are recorded by cap-probe in `DESIGN.json → extensions.breakpoints`.
- Two-tier header: light utility bar (logo 147×53 at x 58, Kundenportal, Karriere, search, Kontrast toggle) over a purple main-navigation bar with a mega-menu (Privatkunden, Geschäftskunden, Kommunen, Stadtwerke, Akademie, Einblicke, Über uns).
- Common grids: 3 icon cards; 2-column photo + text; 4-column tariff / text cards; 3×2 teaser grid; 3 numbered steps with dotted connectors; 3 boxed service cards.
- Source breakpoints are the site's own media queries (`max-width: 364/430/1080px`, `min-width: 641/769/1861px` seen in the CSS); replica keeps them.
- Fixed elements: purple "Kontakt" side tab on the left edge and a round chat bubble bottom-right on most pages.

## Elevation & Depth

- Cards and boxed modules: `0 0 10px rgba(0,0,0,.2)` (dominant, 107 elements), `0 0 15px rgba(0,0,0,.2)` for larger boxes.
- Dramatic drop `0 20px 70px -35px rgba(0,0,0,.65)` under hero/campaign imagery (12 elements).
- No glassmorphism, no inner shadows.

## Shapes

- Dominant radius **12 px** (cards, tiles); the largest painted area uses **4 px** (buttons, inputs, bands); 10 px and 18 px on teaser boxes; 22.25 px pills on tabs; **50 %** circles for step numbers, icons and social buttons.

## Components

- **Buttons**: flat, no border, 4 px radius; cyan primary with white text; purple variant; white-outline ghost on purple bands. Text links purple, underline on hover.
- **Hero**: full-bleed photo with a purple title box (program pages) or a purple campaign banner (home); the "Über uns" landing uses a boxed split hero.
- **Tariff calculator**: tabs (Strom / Erdgas / Energielösungen), PLZ + usage fields, cyan CTA.
- **Cards**: white, shadowed, image-top teasers with "Mehr erfahren" links; icon cards with teag-2017 glyphs.
- **CTA band**: full-bleed purple with mascot bear illustration and a single CTA.
- **Footer**: purple band (Kontakt, service hours, social icons, newsletter form) and a light legal row (Impressum, Datenschutz, …).
- **Breadcrumb** under the hero on inner pages.

## Do's and Don'ts

- Do keep purple for structure and cyan for action; never swap them.
- Do keep the two-tier header and the boxed `.center` content model.
- Don't introduce new radii, shadows or type sizes — every value above is the source's.
- Don't "improve" ad-hoc sizes toward a modular scale; this is a replica.

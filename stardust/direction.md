---
_provenance:
  writtenBy: stardust:replica
  writtenAt: 2026-10-08T08:06:53Z
  againstInput: https://www.thueringerenergie.de/
  readArtifacts:
    - stardust/current/PRODUCT.md
    - stardust/current/DESIGN.md
    - stardust/current/DESIGN.json
---

# Direction — preserve mode (same-design migration)

Mode: PRESERVE. The target spec is the captured current state of https://www.thueringerenergie.de/,
promoted verbatim (no direct invocation, no creative decisions).

Promoted: current/PRODUCT.md → PRODUCT.md · current/DESIGN.md → DESIGN.md ·
current/DESIGN.json → DESIGN.json (at 2026-10-08T08:06:53Z).

Provenance: verbatim `--prep` promotion (extract ran with `--prep --dynamics --pages <8 planned URLs>`;
the full descriptive synthesis exists, so the bounded branch does not apply).

Permitted deltas: ONLY the entries of stardust/replica/inconsistency-register.md
(empty — pure replica).

Fidelity: ia verbatim · design verbatim · content verbatim.

Scope: the 8 pages selected in stardust/.labs/site-plan.json; breakpoints 1440 (desktop) and 360 (mobile), source breakpoints kept (no target set).

## Link-audit decisions (rollout E2, 2026-10-08)

**Scope is the 8 planned pages** (stardust/.labs/site-plan.json); no capture gap exists because the plan is fixed, so every link target outside it is a **scope extension**, repointed to the source site, never authored from a live read.

- **Repointed to `https://www.thueringerenergie.de`:** 225 distinct root-relative targets (228 hrefs) in the `/nav` document (223) and the `/footer` document (5) — the whole mega-menu tree outside the plan (Privatkunden / Geschäftskunden / Kommunen & Stadtwerke / Über uns subtrees, Karriere, Presse, News, Mediathek), plus `/newsletter`, `/agbs`, `/barrierefreiheit`, `/cookieerklaerung`, `/kontakt`-style service pages. Helper: stardust/.work/rollout/probes/repoint-links.mjs (report in its stdout). Scope debt: these pages are delivered only when the plan grows.
- **Kept absolute (already source-host bounce links in the page bodies):** 92 hrefs — PDFs under `/content/documents/`, tariff and service pages outside the plan; `localize-links.mjs --check` passes (0 localizable).
- **Localized:** the two redirect-sheet sources (`/privatkunden/strom/haus-_-_baustromanschluss`, `/ueber_uns/unternehmen`) now point at the served hyphenated paths.
- **External and portal targets** (kundenportal.teag.de, mein-zuhause.teag.de, störungsauskunft.de, social networks) are verbatim.

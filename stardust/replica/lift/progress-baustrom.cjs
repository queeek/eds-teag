// progress-baustrom.cjs — writes archetypes.privatkunden-strom-haus-baustromanschluss into stardust/replica/progress.json (read-modify-write of that key only)
const fs = require("fs"); const f = "stardust/replica/progress.json"; const p = JSON.parse(fs.readFileSync(f, "utf8")); p.archetypes = p.archetypes || {};
const S = "privatkunden-strom-haus-baustromanschluss";
p.archetypes[S] = {
  type: "article", pages: [S], liveUrl: "https://www.thueringerenergie.de/privatkunden/strom/haus-_-_baustromanschluss", status: "gated-with-residuals",
  prototype: "stardust/prototypes/" + S + "-proposed.html", canon: "stardust/prototypes/css/canon.css", contentRoot: "#Content",
  iterations: { "1440": 2, "360": 2 },
  gates: {
    "1440": { pixelPct: 3.93, heightDelta: 22, structuralRed: 1, visualFlags: 0, overflow: "scrollWidth 1440 = viewport ok", clipped: 0, chromeParity: "9 deltas (nav text x/w <= 11px from the pre-webfont live DOM probe; header band 0-170 pixel diff 1.81%)", capProbe: "PASS at 2560 (0 of 4 rows failed, after moving .scroll-up outside #Content)", units: "6 compared, within 6 -> PASS", label: "iter2" },
    "360": { pixelPct: 3.49, heightDelta: 22, structuralRed: 1, visualFlags: 0, overflow: "scrollWidth 360 = viewport ok", clipped: 0, chromeParity: "3 deltas (mobile fixed-bar nav items Einblicke / Ueber uns + footer 'Folgen Sie uns auf' w -4; inherited chrome)", capProbe: "n/a (1440 row)", units: "6 compared, within 6 -> PASS (units-iter2b: --force re-probe at 360; the gate round had reused the 1440 origin cache)", label: "iter2" }
  },
  residuals: [
    { width: 1440, band: "whole page", pct: "dHeight 22px", cause: "live root scrollHeight 1710 vs header+#Content+footer 1688: 22 blank rows below the footer; every body child beyond the footer probes 0x0", "why-not-fixed": "source element not identifiable from the DOM probe; build equals the live DOM sum (1688); pixel 3.93% with no hot band" },
    { width: 360, band: "whole page", pct: "dHeight 22px", cause: "same 22px trailing blank rows (live stitch 2505 vs DOM sum 2483)", "why-not-fixed": "as above; build 2483" },
    { width: 1440, band: "content-diff header", pct: "1 structural red", cause: "mega-menu teaser drift: live teaser 'Heizkraftwerk Schwarza' replaced the captured one (same residual as index / stromtarife)", "why-not-fixed": "runtime-fetched live content; chrome reused verbatim from the gated index" },
    { width: 360, band: "content-diff header", pct: "1 structural red", cause: "same mega-menu teaser drift", "why-not-fixed": "as above" },
    { width: 1440, band: "chrome-parity", pct: "9 deltas", cause: "nav item x/w differ <= 11px in the live DOM probe (fallback font before Noto Sans applies); footer 'Folgen Sie uns auf' w -4", "why-not-fixed": "pixel header band 0-170 = 1.81% diff (PASS); chrome is the gated index chrome" },
    { width: 360, band: "chrome-parity", pct: "3 deltas", cause: "mobile fixed bar: live lists 'Einblicke' at y64 and 'Ueber uns'; build fixed bar shows one item (index chrome behaviour)", "why-not-fixed": "inherited gated chrome; header band not hot" }
  ],
  motion: { observed: 9, implemented: 2, dead: ["header scroll-morph, #Widgets tab click, nav hover: no measured diff on live", "nav hover classes hover/active + 250ms background-color/box-shadow transitions: live mega-menu hover JS in the shared chrome (index policy: dead, no style change lifted)"], parity: "motion-compare: 2 parity (fixed, nav-is-fixed), 4 missing = chrome nav-hover classes/transitions (not implemented, inherited chrome), 0 extra, 3 dead on live" },
  captureState: [],
  boxModel: "content-box for every container family (source * reset); no border-box exceptions on this page",
  fonts: "canon: Noto Sans 400/700 (+italic) self-hosted, stack Segoe UI, Noto Sans, ... kept; teag-2017 + FontAwesome icon fonts self-hosted",
  canonChanges: [],
  units: ["linklist-row", "bread-crumb-item"],
  notes: ["section.page-header-section padding needs the element prefix (canon section.extra-wide{padding:0})", "keep .scroll-up outside #Content for cap-probe", "unit-geometry origin cache is per slug, not per width: --force at 360", "live content drifted after capture (yellow MISSING BODY 'Sie benoetigen einen Haus- oder Baustromanschluss...')"],
  finishedAt: new Date().toISOString()
};
fs.writeFileSync(f, JSON.stringify(p, null, 1)); console.log("progress.json archetypes:", Object.keys(p.archetypes).join(", "), "| status:", p.archetypes[S].status, p.archetypes[S].finishedAt);

// write-progress.cjs — writes the archetypes.index entry of stardust/replica/progress.json (read-modify-write, other keys untouched)
const fs = require('fs'); const p = '/workspace/dc15da58/stardust/replica/progress.json'; const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.archetypes.index = {
  type: 'landing', pages: ['index'], liveUrl: 'https://www.thueringerenergie.de/default', status: 'gated-with-residuals',
  prototype: 'stardust/prototypes/index-proposed.html', canon: 'stardust/prototypes/css/canon.css', contentRoot: '#Content',
  iterations: { 1440: 3, 360: 3 },
  gates: {
    1440: { pixelPct: 21.65, heightDelta: 70, structuralRed: 7, visualFlags: '1 justified (1x1 sr-only h1 at x -1, mirrors live #MainContent_h1Alternative)', overflow: 0, clipped: 0, chromeParity: 'header 8 deltas <=11px (nav item widths; live DOM probed pre-webfont), footer uniform dy only (page height); header crop 1.81% PASS, footer crop 13.2% (chat-teaser overlay + crop anchor)', capProbe: 'PASS at 2560 (0 of 14 rows failed)', label: 'iter3 (confirm, final pixel round held)' },
    360: { pixelPct: 30.99, heightDelta: -17, structuralRed: 7, visualFlags: '1 justified (same sr-only h1)', overflow: 0, clipped: 0, chromeParity: 'header: live nav ticker shows a different item (Ueber uns vs Einblicke, nondeterministic); footer uniform dy; header crop 2.57%, footer crop 18.5% (chat-teaser overlay)', capProbe: 'n/a (1440 row)', label: 'iter3 (final pixel round held)' }
  },
  residuals: [
    { width: 1440, band: 'y 3736-5073 (themes) + header mega-menu teaser', pct: 38.7, cause: 'live content drift: a new Einblicke article (Heizkraftwerk Schwarza) replaced the first theme teaser and the mega-menu teaser after capture; prototype carries the captured set', 'why-not-fixed': 'authored-volatile content, not conversion fidelity; same cause behind the 1 header MISSING CTA', flaggedFor: 'delivery' },
    { width: 1440, band: 'y 6152-7640 (social media wall)', pct: 53.8, cause: 'nondeterministic live embed: LinkedIn/Instagram posts, order and hashtag links change per load (6 MISSING CTA are hashtags of a post that did not exist at capture); live DOM height drifts 8390-8820 between probes', 'why-not-fixed': 'moving target (capture-state policy); prototype freezes the captured posts', flaggedFor: 'delivery' },
    { width: 1440, band: 'y 8485-8820 (footer region)', pct: 13.2, cause: 'moin.ai chat teaser + scroll-up overlay repositioning on live (shifts 65px when the scroll-up shows) and Rubik webfont inside the teaser (not rehosted); footer DOM parity is a uniform dy only', 'why-not-fixed': 'third-party iframe widget replicated as static fixed chrome', flaggedFor: 'user' },
    { width: 360, band: 'y 5500-8000 (themes) and y 11000-16000 (social wall)', pct: 60, cause: 'same live content drift as 1440 (themes article, social posts/order)', 'why-not-fixed': 'as above', flaggedFor: 'delivery' },
    { width: 360, band: 'chrome header crop', pct: 2.57, cause: 'mobile nav bar shows a JS-rotated nav item (EINBLICKE frozen in the prototype; live cycles items)', 'why-not-fixed': 'nondeterministic live ticker', flaggedFor: 'user' },
    { width: 'both', band: 'unit-geometry', pct: 0, cause: 'keyfact dh +27 and product dy -10 on the DOM probe come from the live probe measuring before the Noto Sans webfont applied (2-line fallback wraps); the stitched pixel captures wrap identically (gates/index-1440/strip5-keyfacts.png); at 360 the unit instrument measured the live origin at 1440 geometry (origin 58,1299 428x309), so every 360 unit row is off by the breakpoint', 'why-not-fixed': 'instrument state, not a build defect', flaggedFor: 'user' }
  ],
  motion: { observed: 5, implemented: 4, dead: ['mega-menu hover (no style change on live hover; opens on click, panel layout not lifted)', 'init-only live classes: watermarked, is-animating, no-more-months, video-container-cutted, i179... ids'], parity: 'motion-compare: 6 parity (expanded, fixed, icon-arrow-up-pos, previous-is-active, user-prefers-more-contrast, active), 24 missing = live init-time classes, 1 advisory (scroll-up .visible)' },
  captureState: [
    { what: 'Usercentrics v3 consent dialog (aside#usercentrics-cmp-ui, shadow DOM) is not dismissed by the shared candidates (German label, no data-testid); live captures taken with --consent "#usercentrics-cmp-ui #accept"', replicatedAs: 'dismissed on the live side only', restoreAtDelivery: false },
    { what: 'moin.ai chat teaser + button iframes (fixed bottom-right in every viewport) and .scroll-up; teaser shifts 65px left (1440) / 70px up (360) once the scroll-up shows', replicatedAs: 'static fixed chrome (.chat-teaser, .scroll-up) with the harvested avatar; scroll-up threshold 900px (live threshold not lifted)', restoreAtDelivery: true },
    { what: 'hero slider: single slide, auto-switch paused, controls hidden until hover (live .controls opacity 0)', replicatedAs: 'same markup, controls opacity 0 / hover 1', restoreAtDelivery: true },
    { what: 'product-teaser heights set by live JS (377.625px at 1440; natural height + 160px margin on card 1 at 360)', replicatedAs: 'fixed CSS values', restoreAtDelivery: false },
    { what: 'lazy images (data-gif src + srcset) replicated with the real 1x renditions; picture/source media queries lifted', replicatedAs: 'assets/index/**', restoreAtDelivery: false },
    { what: 'mobile nav bar rotates nav items by JS (EINBLICKE frozen); ul.mobile-nav is built client-side from the mega-menu lists (226 links) - mirrored in js/index.js at <=1024', replicatedAs: 'js/index.js', restoreAtDelivery: true },
    { what: 'watermark placeholders (PLZ, Jahresverbrauch, Ihr Vorname, ..., E-Mail-Adresse) rendered by live JS', replicatedAs: 'placeholder attributes (EXTRA PLACEHOLDER x9, justified)', restoreAtDelivery: false },
    { what: 'social wall / themes list / mega-menu teaser content drift between capture and gate', replicatedAs: 'captured state frozen', restoreAtDelivery: true }
  ],
  boxModel: 'content-box for every container family (source * reset = margin/padding/font only); border-box only on select and input[type=checkbox]; no universal reset - see canon.css header',
  fonts: 'same public source: Noto Sans 400/700(+italic) woff self-hosted from the capture, stack order kept (Segoe UI first); teag-2017 + FontAwesome 4.7 self-hosted; icon ::before content uses the source alt-text syntax ("x" / "") so content-diff icon signatures pair',
  canonChanges: [],
  units: ['keyfact-cards', 'product-teasers', 'service-boxes', 'theme-teasers', 'news-posts'],
  notes: 'prototype generated by stardust/replica/lift/build-index.cjs from the capture (templates + whitelist serializer for hidden mega-menu/tooltip DOM); the prototype http server on 8791 was dead at start (python http.server IDNA error) and was replaced by stardust/replica/lift/serve.cjs (PID in stardust/.work/proto-server.pid)',
  finishedAt: new Date().toISOString()
};
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n'); console.log('progress written');

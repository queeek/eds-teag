# Unit `cluster:impressum` — report (template static, sibling `datenschutz`)

cluster:impressum: pages 1/1 live, blocks 2, gate 1440 3.91% / 360 5.13%, Δh +49/-29, clipped 0, content 0, rounds 1, requests 0

```json
{
  "1440": { "pixelPct": 3.91, "textPct": 6.49, "heightDelta": 49, "originHeight": 21031, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "verdict": "PASS", "run": "stardust/replica/gates/all-1440/runs/2026-10-08T13-32-12-352Z-datenschutz.json" },
  "360":  { "pixelPct": 5.13, "textPct": 7.25, "heightDelta": -29, "originHeight": 43173, "clipped": 0, "contentMissing": 0, "contentHidden": 0, "verdict": "PASS", "run": "stardust/replica/gates/all-360/runs/2026-10-08T13-33-26-939Z-datenschutz.json" }
}
```

Live: https://main--dc15da58--aemcoder.aem.page/datenschutz (published: aem.live 200). Source: https://www.thueringerenergie.de/datenschutz.

## What was delivered
- `content/datenschutz.html` — forked from the impressum encoder by `stardust/.work/rollout/cluster-impressum/build-datenschutz.mjs`
  (source: the hydrated capture's `#Content` — the render's hrefs are rewritten to `../x/index.html`, the capture keeps the originals;
  strings verbatim: 1 h2, 34 h3, 1 h4, 135 p, 9 ul / 50 li, 46 links, 0 images). Metadata block from `_meta.json`; breadcrumb block
  (h1 row + crumb ul, active crumb → `/datenschutz`); ONE `text-additions (flush-top)` row whose cell 1 is the text module and cell 2
  the marginal downloads module (h4 "Download", p, 7 PDF links). Spacers: 1 leading `<br>` → `&#8203;<br>`; no `&nbsp;` paragraphs.
  Links: root-relative → `https://www.thueringerenergie.de/…` (localize-links keeps them: targets outside the 8 planned pages),
  `/default` → `/`; `/Cookieerklaerung`, PDFs under `/Content/Documents/` kept on the source host.
- `blocks/text-additions/text-additions.js` — a row's extra cells now feed `.text-additions-marginal` (source `.marginal-column > section`);
  impressum rows are single-cell, so its render is unchanged (block-roundtrip --ew re-run: 0 structural 🔴, EW 45/45).
- `blocks/text-additions/text-additions.css` — `flush-top` variant (`.text-additions.flush-top .text-additions-default { padding-top: 0 }`),
  benefit lists (`ul:not(:has(a))` → checkmark-pos.svg left 6px / 20px, padding-left 28, mb 1.6em when not last), marginal downloads
  (h4 calc(1em + .9vw)/1.6 with the purple divider, `li::before` teag-2017 "z" 20px / 28px column, link #000 top -4px),
  body links corrected to the live truth (purple / 400 / underline; `a[href^='mailto:']` blue / 700), external glyph inherits line-height.
- `blocks/text-additions/checkmark-pos.svg` (rehosted from the stromtarife lift assets).
- `stardust/replica/gates/all-{1440,360}/presence.json` — `datenschutz: { main: "#Content=main" }` (see tooling findings).

## Decode tiers
- breadcrumb — template-slotted, unchanged. EW 2/2.
- text-additions — template-slotted; row 1 cell 1 = default module (h2 + h3/p/ul), cell 2 = marginal module (h4/p/ul). EW 179/179, 0 dead, 0 duplicated.

## Chain evidence
- block-roundtrip (`--map breadcrumb=.page-meta-section --map text-additions=.page-content-section`): per block + page exit 0, 0 structural 🔴
  (🟠 EXTRA screen-reader h1 as on the archetype; 🟡 the ZWSP-prefixed body). delivery-lint 0/0/0. media-reconcile: nothing (no images).
  davids-model-lint PASS (1 🟡 D1 breadcrumb, same as archetype). localize-links: 0 to localize, source-host links kept; `--check` PASS. sanitise: 716 chars encoded.
- qa-gate (harness on local aem up, impressum schema): 16 ok / 1 fail — the known "2 broken images" = frozen header logos the dev server cannot fetch.
- deploy-batch: 1 ok (preview + publish). `.plain.html` 200, one h1, 0 about:error, 0 /img/. ai-readability 100 % (gate 98).
- Round 1 (the only fix round), found with a DOM probe (`stardust/.work/rollout/cluster-impressum/measure*.mjs`, live vs EDS per element):
  (a) nested `:has()` inside `:has()` is invalid CSS — the benefit-list margin rule was silently dropped (ul mb 20 vs live 25.6);
  (b) live body links in the text module are rgb(135,13,135) / 400, only `a[href^="mailto:"]` is rgb(11,162,227) / 700 — the archetype's
  "700 everywhere" made every link line 1 px taller at 360 and re-wrapped one paragraph; (c) glyph line-height. 360 went 10.19 % → 5.13 %, 1440 7.61 % → 3.91 %.
- Pipeline transport: nothing new (ZWSP survives; UTF-8 sanitised to entities).

## Tooling findings
- gate-all's origin stitch does not dismiss Usercentrics (63 % / 47 % diff): origin re-shot with `stitch-shot.mjs … --dismiss '#usercentrics-cmp-ui #accept'`, then `--skip-existing`.
- content-presence has no consent handling at all: at 1440 the open modal overlaps the first content band and its 5 links/buttons were reported MISSING
  (at 360 they fell into the chrome band). Fixed via the documented `presence.json` sidecar (`main: "#Content=main"`), which scopes both sides to the page
  content root — the content probe then reports MISSING 0 / HIDDEN 0 on the real content (34 headings, 46 links).
- Δh +49 at 1440: live blank tail rows + scroll-up button (archetype note) and the marginal column; -29 at 360 is within the footer band item already requested.

## Files changed
content/datenschutz.html, blocks/text-additions/{text-additions.js,text-additions.css,checkmark-pos.svg}, stardust/state.json, stardust/migrated/datenschutz/_meta.json,
stardust/rollout/{coverage/pages.json,coverage/templates.json,rollout.json,units/cluster-impressum.paths,units/cluster-impressum-brief.md,units/cluster-impressum.report.md},
stardust/replica/gates/all-{1440,360}/{presence.json,runs/*-datenschutz.json,datenschutz/*}, stardust/deploy/ledger-cluster-impressum.json,
stardust/.work/rollout/cluster-impressum/{build-datenschutz.mjs,measure.mjs,measure-a.mjs,measure-links.mjs,offset.mjs,side.mjs,code-sync.mjs,deploy.log,qa-gate.log,roundtrip-*.log}.
Foundation: `foundation-freeze.mjs check` → foundation unchanged (18 files); no foundation request added.

## Notes for the next author (later templates' cluster subagents)
- Fork from the hydrated capture's `#Content`, not the render: the render rewrites hrefs to `../slug/index.html` and truncates nothing else; strings are identical.
- Converter pattern (`build-datenschutz.mjs`): cut module sections by their opening tag, strip `<header>` wrappers and icon spans, keep only `href`/`title` on `<a>`,
  drop every class/id; the block CSS must then express the source classes structurally (`ul:not(:has(a))` = benefit list, `li a` = linklist, marginal cell = 2nd cell).
- Never nest `:has()` inside `:has()` — Chromium drops the whole rule silently; lint does not catch it. Verify with a computed-style probe, not by reading CSS.
- Before trusting an archetype's typography note, probe the live page per element (measure.mjs: tag/top/height/lh/margins side by side); it found the ul margin,
  the link weight and the wrap in one run and turned a 10.19 % fail into 5.13 %.
- Gate recipe that passes clean: start both widths via run-bg, re-shoot origins with `--dismiss '#usercentrics-cmp-ui #accept'`, add the page to
  `presence.json` (`main: "#Content=main"`), then `--skip-existing` (+ `--recapture-eds` after a code push).
- Code-sync poll: fetch the block CSS from the preview host and grep for a string only the new revision has (≤ 24 × 5 s; it took 1–3 polls).
- The marginal (1/3) column is now authorable as a second cell in any text-additions row; its downloads styling is scoped to `.text-additions-marginal`.

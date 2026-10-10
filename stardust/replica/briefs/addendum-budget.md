# Addendum — budget and reuse rules for archetypes 2–5 (read AFTER archetype-brief.md)

The first archetype (index) spent 272 tool calls and 86 minutes. You have a HARD budget: **at most 80 tool calls and 2 gate iterations
per breakpoint** (iter1 --full, one fix pass, iter2 --full as confirmation; a third iteration only if iter2 is within 2 points of the 10 % bar).
Prefer recording a residual over another loop. Keep every tool result small (head/tail/grep, --tsv, --path).

Reuse, never redo:
- stardust/prototypes/css/canon.css is gated (header, footer, fixed chrome, buttons, type ramp, container model, fonts, .chat-teaser, .scroll-up).
  Import it unchanged; only APPEND new shared rules. js/index.js holds the fixed-chrome JS — reuse it (copy the header/footer markup and the
  <script src="js/index.js"> wiring from stardust/prototypes/index-proposed.html's #PageHeader and #PageFooter; those two subtrees are the gated
  chrome and may be reused verbatim since they are our own authored markup).
- stardust/prototypes/assets/fonts/ and assets/index/ (logo, icons, button face PNGs) already exist — reference them, do not re-download.
- stardust/replica/lift/index.md holds the lifted chrome/container/button/type values AND the gate notes (Usercentrics v3 consent selector,
  live stitch command, fixed-chrome behaviour). Read it ONCE in full (10 kB) instead of re-lifting the chrome. Lift only this page's NEW modules.
- Reference docs: read at most THREE sections total — recreation-procedure.md "CSS lifting" only if a module's sizing model is unclear,
  source-fidelity-gate.md "Pass bar" and "Residual logging format". Everything else you need is in the brief and index.md.
- Instrument output: `run-bg.mjs wait` then `log <job> --grep 'verdict|pixel|hot band|Clipped|overflow|🔴|FAIL|PASS'` — never the whole log.
- Live stitches: the shared consent dismiss misses Usercentrics v3 — before iter1 at each width run the stitch-shot command from index.md's
  gate notes to write gates/<slug>-<w>/live.png yourself (gate.sh reuses it). Check the live.png is not a consent-covered capture by ONE
  crop-compare strip of the top band, not by viewing the whole image.
- Author the prototype as one HTML file + css/<slug>.css by hand (templates from the page JSON through a small node script are fine;
  the index used stardust/replica/lift/build-index.cjs — reuse its helpers if that is faster, but keep the script under stardust/replica/lift/).
- Finish by writing stardust/replica/progress.json's archetypes.<slug> entry and stardust/replica/lift/<slug>.md, then `run-bg.mjs status`.

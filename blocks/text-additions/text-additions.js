/**
 * Text additions — the source's `.text-modul.default` module and its sibling
 * `section.addition.show-separation` modules, laid out in the 2/3 text column next to the
 * (empty) 1/3 marginal column of a `.page-content-section`.
 * Schema: stardust/eds-schema/impressum.json sections[1] and sections[2].
 * Tier: template-slotted (NODE-slotting). Row 1 = the default module, every further row = one
 * addition (h2 header, then h3 / p / ul / buttons as authored). A row's FIRST cell is the module;
 * any further cell is the marginal column's content (source `.marginal-column > section`: h4
 * topic, p, downloads ul — the datenschutz sibling; impressum leaves it empty). Cells are MOVED
 * whole (EW1) — the authored h1-h6 / p / ul / strong / em / a stay untouched; the wrappers carry
 * the classes (EW2). Buttons come from `decorateButtons()` (em → secondary).
 * Section style `separator` (section-metadata) renders the source's `.with-section-seperator`;
 * block variant `flush-top` = the sibling's first module without the archetype's top padding.
 * Re-entrant: a block that already carries the column is left alone (EW9).
 * @param {HTMLElement} block the text-additions block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .text-additions-column')) return;
  const column = document.createElement('div');
  column.className = 'text-additions-column';
  const marginal = document.createElement('div');
  marginal.className = 'text-additions-marginal';
  [...block.children].forEach((row, index) => {
    const cells = [...row.children];
    const [module, ...extra] = cells;
    if (!module) return;
    const kind = index === 0 ? 'text-additions-default' : 'text-additions-addition';
    module.className = `text-additions-module ${kind}`;
    extra.forEach((cell) => marginal.append(...cell.childNodes));
    column.append(module);
  });
  block.replaceChildren(column, marginal);
}

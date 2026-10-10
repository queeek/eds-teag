/**
 * Three steps — the source's `.step-by-step-123-modul` (centred heading, 3 numbered purple
 * discs connected by dashed bows, each with h4 + p). Variant `keyfacts` = the `.keyFacts-modul`
 * (centred h2, 3 icon cards: purple disc, purple h3, p).
 * Tier: reconstructive (NODE-slotting). Row 1 (single cell holding only a heading) = the module
 * header; every further row = one step / fact (heading + paragraphs). The step numbers are a
 * CSS counter, the connectors are decorative elements. Authored nodes are MOVED (EW1).
 * Re-entrant (EW9).
 * @param {HTMLElement} block the three-steps block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .three-steps-list')) return;
  const rows = [...block.children];
  const parts = [];
  const first = rows[0];
  if (first && first.children.length === 1 && first.firstElementChild.children.length === 1
    && first.querySelector('h1, h2, h3, h4')) {
    const header = document.createElement('div');
    header.className = 'three-steps-header';
    header.append(...first.firstElementChild.childNodes);
    parts.push(header);
    rows.shift();
  }
  const list = document.createElement('div');
  list.className = 'three-steps-list';
  rows.forEach((row, i) => {
    if (i > 0) {
      const connector = document.createElement('div');
      connector.className = 'three-steps-connector';
      const bow = document.createElement('div');
      bow.className = 'three-steps-bow';
      const cover = document.createElement('div');
      cover.className = 'three-steps-cover';
      bow.append(cover);
      connector.append(bow);
      list.append(connector);
    }
    const step = document.createElement('div');
    step.className = 'three-steps-step';
    const symbol = document.createElement('div');
    symbol.className = 'three-steps-symbol';
    const content = document.createElement('div');
    content.className = 'three-steps-content';
    [...row.children].forEach((cell) => content.append(...cell.childNodes));
    const vertical = document.createElement('div');
    vertical.className = 'three-steps-connector-vertical';
    step.append(symbol, content, vertical);
    list.append(step);
  });
  parts.push(list);
  block.replaceChildren(...parts);
}

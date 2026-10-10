/**
 * CTA box — the source's `.page-content-section` of the article page type: the 2/3 text
 * column (`.columns-2-3 > .text-modul`: h2 header, paragraphs, h3 sub-sections with
 * `ul.linklist`) next to the 1/3 marginal column whose content is the purple
 * `section.box.call-to-action` (h3 topic, the empty service container, one link-button).
 * Schema: stardust/eds-schema/privatkunden-strom-haus-baustromanschluss.json sections[2].
 * Tier: template-slotted (NODE-slotting). One row: the FIRST cell is the text module, the
 * SECOND cell is the box (an author may omit either). Cells are MOVED whole (EW1) — the
 * authored h2 / h3 / p / ul / strong / a stay untouched; the wrappers carry the classes (EW2).
 * The button comes from `decorateButtons()` (strong → primary = the source's blue face).
 * Re-entrant: a block that already carries the column is left alone (EW9).
 * @param {HTMLElement} block the cta-box block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .cta-box-column')) return;
  const column = document.createElement('div');
  column.className = 'cta-box-column';
  const marginal = document.createElement('div');
  marginal.className = 'cta-box-marginal';
  [...block.children].forEach((row) => {
    const [text, box, ...rest] = [...row.children];
    if (text) {
      text.className = 'cta-box-text';
      column.append(text);
    }
    if (box) {
      box.className = 'cta-box-box';
      marginal.append(box);
    }
    rest.forEach((cell) => marginal.append(...cell.childNodes));
  });
  const parts = [];
  if (column.childElementCount) parts.push(column);
  if (marginal.childElementCount) parts.push(marginal);
  block.replaceChildren(...parts);
}

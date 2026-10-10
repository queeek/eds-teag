/**
 * Table — the source's `.scrollable-table_mode-horizontal > table` (purple header row, body rows
 * with a 1px bottom border). Block-collection shape: one block row per table row, the first row
 * is the header. Tier: reconstructive (NODE-slotting): the authored cell contents are MOVED into
 * th / td. Re-entrant (EW9).
 * @param {HTMLElement} block the table block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .table-scroll')) return;
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');
  [...block.children].forEach((row, i) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement(i === 0 ? 'th' : 'td');
      if (i === 0) td.setAttribute('scope', 'col');
      td.append(...cell.childNodes);
      tr.append(td);
    });
    (i === 0 ? thead : tbody).append(tr);
  });
  table.append(thead, tbody);
  const scroll = document.createElement('div');
  scroll.className = 'table-scroll';
  scroll.append(table);
  block.replaceChildren(scroll);
}

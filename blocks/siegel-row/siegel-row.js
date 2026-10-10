/*
 * siegel-row — the source's `.columns-1.siegel-row` (three certification badges in a centred row
 * inside the grey section under the tariff form). The source fills the three `li` after load
 * (empty in the 2026-10-08 capture, rendered from 2026-10-09 13:59Z on): `li > a > img[alt]`, the
 * alt text is the link's accessible name. One row, one cell per badge: a picture wrapped in its
 * link (or a picture and a lone link). Authored nodes are MOVED into the list (EW1); re-entrant
 * (EW9): a block that already carries the list is left alone.
 */
export default function decorate(block) {
  if (block.querySelector(':scope > ul')) return;
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      const li = document.createElement('li');
      const link = cell.querySelector('a[href]');
      const pic = cell.querySelector('picture');
      if (link && pic) {
        if (!link.contains(pic)) {
          const img = pic.querySelector('img');
          if (img && !img.getAttribute('alt') && link.textContent.trim()) img.alt = link.textContent.trim();
          link.textContent = '';
          link.append(pic);
        }
        li.append(link);
      } else if (link || pic) {
        li.append(link || pic);
      } else {
        li.append(...cell.childNodes);
      }
      ul.append(li);
    });
  });
  block.textContent = '';
  block.append(ul);
}

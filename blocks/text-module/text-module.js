/**
 * Text module — the source's `.text-modul.default` in a single column: a heading, a figure with
 * credits floated left (margin 6px 40px 20px 0) and the prose beside it; a row without a heading
 * is the source's `section.image-remove-margin` (figure, then the cleared paragraph below).
 * Tier: reconstructive (NODE-slotting), one row per text module / sub-section. Cells, each
 * optional: picture, credits paragraph (text only), prose (h2, h3, p, lists). The figure is
 * placed after the heading when there is one. Authored nodes are MOVED (EW1). Re-entrant (EW9).
 * Additive variants (program siblings teag-strom-easie / ersatzversorgung):
 * `eye-catcher-circle` — the row's last cell (paragraphs only) is the source's
 * `.eye-catcher.circle`, floated right after the heading; the prose beside it is the source's
 * `.overflow` column. `with-accordion` — a 2-cell row whose first cell is a single paragraph
 * is one `ul.akkordeon-list > li.entry` (topic + collapsed content, toggled on click).
 * `with-lists` / `center-content` are CSS-only.
 * @param {HTMLElement} block the text-module block
 */
function accordionRow(row, cells) {
  row.className = 'text-module-accordion';
  const topic = cells[0].querySelector('p');
  topic.className = 'text-module-accordion-topic';
  topic.setAttribute('role', 'button');
  topic.setAttribute('tabindex', '0');
  topic.setAttribute('aria-expanded', 'false');
  const title = document.createElement('span');
  title.className = 'text-module-accordion-title';
  title.append(...topic.childNodes);
  const icon = document.createElement('span');
  icon.className = 'text-module-accordion-icon';
  topic.append(title, icon);
  const content = document.createElement('div');
  content.className = 'text-module-accordion-content';
  content.append(...cells[1].childNodes);
  row.replaceChildren(topic, content);
  const toggle = () => {
    const open = row.classList.toggle('opened');
    topic.setAttribute('aria-expanded', String(open));
  };
  topic.addEventListener('click', toggle);
  topic.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
}

function eyeCatcherCell(block, cells) {
  if (!block.classList.contains('eye-catcher-circle') || cells.length < 2) return null;
  const last = cells[cells.length - 1];
  if (last.querySelector('h1, h2, h3, h4, h5, h6, picture, ul, ol')) return null;
  return cells.pop();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .text-module-row, :scope > .text-module-accordion')) return;
  const accordion = block.classList.contains('with-accordion');
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (accordion && cells.length === 2 && cells[0].querySelectorAll('p').length === 1
      && !cells[0].querySelector('h1, h2, h3, h4, h5, h6, ul, ol, picture')) {
      accordionRow(row, cells);
      return;
    }
    row.className = 'text-module-row';
    const figure = document.createElement('figure');
    figure.className = 'text-module-figure';
    const caption = document.createElement('figcaption');
    caption.className = 'text-module-credits';
    const prose = document.createElement('div');
    prose.className = 'text-module-prose';
    const eyeCell = eyeCatcherCell(block, cells);
    cells.forEach((cell) => {
      const picture = cell.querySelector('picture');
      if (picture && !cell.querySelector('h1, h2, h3, h4, h5, h6')) {
        figure.prepend(picture);
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6, ul, ol')
        || cell.querySelectorAll('p').length > 1 || cell.textContent.length > 120) {
        prose.append(...cell.childNodes);
      } else {
        caption.append(...cell.childNodes);
      }
    });
    if (caption.childElementCount) figure.append(caption);
    const parts = [];
    if (figure.querySelector('picture')) {
      const heading = prose.querySelector(':scope > h1, :scope > h2');
      if (heading) {
        heading.after(figure);
        row.classList.add('with-heading');
      } else {
        parts.push(figure);
        row.classList.add('full');
      }
    }
    if (eyeCell) {
      const eye = document.createElement('div');
      eye.className = 'text-module-eye-catcher';
      eye.append(...eyeCell.childNodes);
      const overflow = document.createElement('div');
      overflow.className = 'text-module-overflow';
      const heading = prose.querySelector(':scope > h1, :scope > h2');
      [...prose.children].filter((c) => c !== heading).forEach((c) => overflow.append(c));
      if (heading) heading.after(eye, overflow);
      else prose.prepend(eye, overflow);
    }
    parts.push(prose);
    row.replaceChildren(...parts);
  });
}

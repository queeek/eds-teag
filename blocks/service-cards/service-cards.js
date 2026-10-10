/**
 * Service cards — the source's `section.service-boxes > ul.boxes.columns-3 > li.box` under a
 * centred widget heading: the contact box (h3, picture + credits, icon list with mail / phone
 * links), the call-back box (h3, static form: two intro paragraphs, 5 fields, privacy checkbox,
 * submit) and the link-list box (h3, p, link list).
 * Tier: reconstructive (NODE-slotting). Row 1 (single cell with only a heading) = the module
 * header; every further row = one box: cells, each optional: heading, pictures, credits
 * paragraph (text only), content. A content cell whose list has no links is the call-back form
 * (interim STATIC tier, owner decision D-04: fields rendered as grey boxes carrying the
 * placeholder text, an <em> item is the select, the trailing paragraph the checkbox, the bold
 * paragraph the inert submit face — never a fake submit). Authored nodes are MOVED (EW1).
 * Re-entrant (EW9).
 * @param {HTMLElement} block the service-cards block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .service-cards-list')) return;
  const rows = [...block.children];
  const parts = [];
  const first = rows[0];
  if (first && first.children.length === 1 && first.firstElementChild.children.length === 1
    && first.querySelector('h1, h2, h3, h4')) {
    const header = document.createElement('div');
    header.className = 'service-cards-header';
    header.append(...first.firstElementChild.childNodes);
    const divider = document.createElement('span');
    divider.className = 'service-cards-divider';
    header.append(divider);
    parts.push(header);
    rows.shift();
  }
  const list = document.createElement('ul');
  list.className = 'service-cards-list';
  rows.forEach((row) => {
    const card = document.createElement('li');
    card.className = 'service-cards-card';
    const inner = document.createElement('div');
    inner.className = 'service-cards-inner';
    const figure = document.createElement('figure');
    figure.className = 'service-cards-figure';
    const credits = document.createElement('figcaption');
    credits.className = 'service-cards-credits';
    const content = document.createElement('div');
    content.className = 'service-cards-content';
    [...row.children].forEach((cell) => {
      const picture = cell.querySelector('picture');
      const heading = cell.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && cell.children.length === 1) {
        const header = document.createElement('div');
        header.className = 'service-cards-card-header';
        header.append(heading);
        const divider = document.createElement('span');
        divider.className = 'service-cards-card-divider';
        header.append(divider);
        inner.append(header);
      } else if (picture && !heading) {
        figure.prepend(picture);
      } else if (!cell.querySelector('ul, ol, a, strong, em') && cell.textContent.length < 80) {
        credits.append(...cell.childNodes);
      } else {
        const formList = cell.querySelector('ul');
        if (formList && !formList.querySelector('a')) {
          cell.classList.add('service-cards-form');
          formList.className = 'service-cards-fields';
          [...formList.children].forEach((li, i) => {
            li.className = `service-cards-field service-cards-field-${i + 1}`;
            const em = li.querySelector('em');
            if (em) {
              li.classList.add('service-cards-select');
              em.replaceWith(...em.childNodes);
            }
            if (i === 2) {
              // a.extender.icon-calendar — inert (no date picker without script)
              const cal = document.createElement('button');
              cal.type = 'button';
              cal.className = 'service-cards-calendar';
              cal.setAttribute('aria-label', 'Kalender anzeigen');
              cal.setAttribute('aria-disabled', 'true');
              cal.title = 'Kalender ohne Skript (statische Vorschau)';
              li.append(cal);
            }
          });
          const after = formList.nextElementSibling;
          if (after && after.tagName === 'P' && !after.querySelector('strong')) {
            after.className = 'service-cards-checkbox';
          }
          const strongP = [...cell.querySelectorAll('p')].reverse()
            .find((p) => p.querySelector('strong') && !p.querySelector('a') && p !== cell.firstElementChild);
          if (strongP) {
            // inert button inside the authored paragraph (the <strong> moves in): no handler,
            // no form, never a fake submit
            strongP.className = 'service-cards-submit';
            const button = document.createElement('button');
            button.type = 'button';
            button.setAttribute('aria-disabled', 'true');
            button.title = 'Formular ohne Backend-Anbindung (statische Vorschau)';
            button.append(strongP.querySelector('strong'));
            strongP.append(button);
          }
        } else if (formList) {
          formList.className = formList.querySelector('a[href^="mailto"], a[href^="tel"]')
            ? 'service-cards-icon-list' : 'service-cards-link-list';
        }
        content.append(...cell.childNodes);
        if (cell.classList.contains('service-cards-form')) content.classList.add('service-cards-form');
      }
    });
    if (credits.childElementCount) figure.append(credits);
    if (figure.querySelector('picture')) inner.append(figure);
    inner.append(content);
    card.append(inner);
    list.append(card);
  });
  parts.push(list);
  block.replaceChildren(...parts);
}

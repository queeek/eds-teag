/**
 * FAQ — the source's `.module-faq.filter_drop-down-list_modul`: a widget heading with divider,
 * the service row (two drop-down pills "Thema" / "Rubrik" + the search pill) and the accordion
 * list (`ul.akkordeon-list.auto-close-opened-entries > li.entry`). Answers are collapsed by
 * default; the fired behaviours (entry open / read toggle with the arrow flip, pill chevron
 * rotate with the option list toggle) are ported from the prototype's JS. The filters and the
 * search are static (no backend).
 * Tier: reconstructive (NODE-slotting). Rows: single-cell heading row = header; a 3-cell row
 * whose cells carry label p + title p + option list / the search label = the service row; every
 * 2-cell row = one entry (topic paragraph, answer). Authored nodes are MOVED (EW1).
 * Re-entrant (EW9).
 * @param {HTMLElement} block the faq block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .faq-list')) return;
  const parts = [];
  const list = document.createElement('ul');
  list.className = 'faq-list';
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1 && cells[0].querySelector('h1, h2, h3, h4')) {
      const header = document.createElement('div');
      header.className = 'faq-header';
      header.append(...cells[0].childNodes);
      parts.push(header);
      return;
    }
    // service row: 3 cells, or 2 cells whose FIRST cell carries an option list (an entry's
    // first cell is the topic paragraph only — its answer may hold lists)
    if (cells.length >= 3 || (cells.length === 2 && cells[0].querySelector('ul'))) {
      const service = document.createElement('div');
      service.className = 'faq-service-row';
      cells.forEach((cell, i) => {
        const options = cell.querySelector('ul');
        const ps = [...cell.querySelectorAll('p')];
        if (options) {
          const filter = document.createElement('div');
          filter.className = `faq-filter faq-filter-${i + 1}`;
          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'faq-filter-toggle';
          toggle.setAttribute('aria-expanded', 'false');
          const content = document.createElement('span');
          content.className = 'faq-filter-content';
          if (ps[0]) {
            ps[0].className = 'faq-filter-label';
            content.append(ps[0]);
          }
          if (ps[1]) {
            ps[1].className = 'faq-filter-title';
            content.append(ps[1]);
          }
          const chevron = document.createElement('span');
          chevron.className = 'faq-filter-chevron';
          toggle.append(content, chevron);
          options.className = 'faq-filter-options';
          [...options.children].forEach((li) => {
            if (li.querySelector('strong')) li.classList.add('active');
          });
          filter.append(toggle, options);
          toggle.addEventListener('click', () => {
            const open = filter.classList.toggle('opened');
            toggle.setAttribute('aria-expanded', String(open));
            chevron.classList.toggle('rotate180', open);
          });
          service.append(filter);
        } else {
          const search = document.createElement('div');
          search.className = 'faq-search faq-filter-3';
          const label = document.createElement('span');
          label.className = 'faq-search-label';
          label.append(...cell.childNodes);
          const field = document.createElement('span');
          field.className = 'faq-search-field';
          // a.extender.icon-teag-suche — inert button (no search backend)
          const icon = document.createElement('button');
          icon.type = 'button';
          icon.className = 'faq-search-icon';
          icon.setAttribute('aria-label', 'In FAQs suchen');
          icon.setAttribute('aria-disabled', 'true');
          icon.title = 'Suche ohne Backend-Anbindung (statische Vorschau)';
          search.append(label, field, icon);
          service.append(search);
        }
      });
      parts.push(service);
      return;
    }
    const entry = document.createElement('li');
    entry.className = 'faq-entry';
    const topicP = (cells[0] && cells[0].querySelector('p')) || document.createElement('p');
    if (cells[0] && !topicP.parentElement) topicP.append(...cells[0].childNodes);
    topicP.className = 'faq-topic';
    topicP.setAttribute('role', 'button');
    topicP.setAttribute('tabindex', '0');
    topicP.setAttribute('aria-expanded', 'false');
    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    cells.slice(1).forEach((cell) => answer.append(...cell.childNodes));
    entry.append(topicP, answer);
    const toggle = () => {
      const open = entry.classList.toggle('opened');
      entry.classList.add('read');
      topicP.setAttribute('aria-expanded', String(open));
      if (open) {
        [...list.querySelectorAll(':scope > .faq-entry.opened')].forEach((other) => {
          if (other !== entry) {
            other.classList.remove('opened');
            other.querySelector('.faq-topic').setAttribute('aria-expanded', 'false');
          }
        });
      }
    };
    topicP.addEventListener('click', toggle);
    topicP.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
    list.append(entry);
  });
  parts.push(list);
  block.replaceChildren(...parts);
}

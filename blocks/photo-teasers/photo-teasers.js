/**
 * Photo teasers — the source's `ul.list.list-style-3.products` (product teaser list, image
 * right): each `li.product-teaser` is a figure whose picture floats to the right of a white
 * text container (kicker, h2, divider, description) with a credits line pinned to the image.
 * Schema: stardust/eds-schema/ueber-uns-unternehmen.json sections[0].
 * Tier: reconstructive (NODE-slotting), one row per teaser. Cells, in any order and each
 * optional: pictures (1 = every width, 2 = desktop / mobile, 3 = desktop >= 1024 / tablet
 * 769-1023 / mobile <= 768 — the source's PT3_D / PT2_T / PT2_S renditions), the credits
 * paragraph (text only), the text (heading + paragraphs) and a lone link. Authored nodes are
 * MOVED into the figure / figcaption wrappers (EW1); the wrappers carry the classes (EW2).
 * Re-entrant: a block that already carries an item is left alone (EW9).
 *
 * Variant `themes` (landing page, live `section.themen-section ul.teaser-list li.list-entry`):
 * the live card is ONE `a.detail-page-link` around the figure (credits + title + divider +
 * description + arrow icon). The link cell is authored as `<p><a href>DESCRIPTION</a></p>`:
 * decorate unwraps that anchor (the description text stays in `.photo-teasers-text`, EW6),
 * wraps the whole figure in `a.photo-teasers-card-link`, and adds the presentational divider
 * and arrow spans — so the served link's visible text is the live key (credits title description).
 * @param {HTMLElement} block the photo-teasers block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .photo-teasers-item')) return;
  const themes = block.classList.contains('themes');
  const slots = { 1: ['all'], 2: ['desktop', 'mobile'], 3: ['desktop', 'tablet', 'mobile'] };
  [...block.children].forEach((row) => {
    row.className = 'photo-teasers-item';
    const figure = document.createElement('figure');
    figure.className = 'photo-teasers-figure';
    const caption = document.createElement('figcaption');
    const credits = document.createElement('div');
    credits.className = 'photo-teasers-credits';
    const text = document.createElement('div');
    text.className = 'photo-teasers-text';
    const pictures = [];
    let cardHref = null;
    [...row.children].forEach((cell) => {
      const found = [...cell.querySelectorAll('picture, img')]
        .filter((el) => !el.closest('picture') || el.tagName === 'PICTURE');
      if (found.length) {
        pictures.push(...found);
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
        text.append(...cell.childNodes);
      } else if (cell.querySelector('a') && themes) {
        // themes: the lone link carries the card href; its text is the description paragraph
        const a = cell.querySelector('a[href]');
        if (a) cardHref = a.getAttribute('href');
        [...cell.querySelectorAll('a')].forEach((link) => {
          link.classList.remove('button');
          link.parentElement.classList.remove('button-container');
          link.replaceWith(...link.childNodes);
        });
        const heading = text.querySelector('h1, h2, h3, h4, h5, h6');
        const headingText = heading ? heading.textContent.trim() : '';
        [...cell.children].forEach((p) => {
          if (p.textContent.trim() && p.textContent.trim() !== headingText) {
            p.className = 'photo-teasers-description';
            text.append(p);
          }
        });
      } else if (cell.querySelector('a')) {
        const link = document.createElement('div');
        link.className = 'photo-teasers-link';
        [...cell.querySelectorAll('a')].forEach((a) => {
          a.classList.remove('button');
          a.parentElement.classList.remove('button-container');
        });
        link.append(...cell.childNodes);
        text.append(link);
      } else {
        credits.append(...cell.childNodes);
      }
    });
    const names = slots[pictures.length] || ['all'];
    pictures.forEach((picture, index) => {
      picture.classList.add(`photo-teasers-${names[index] || 'all'}`);
      figure.append(picture);
    });
    if (themes) {
      // live: h3.title, span.divider, .description (with span.icon-teag-arrow-right-pos inside)
      const heading = text.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        const divider = document.createElement('span');
        divider.className = 'photo-teasers-divider';
        divider.setAttribute('aria-hidden', 'true');
        heading.after(divider);
      }
      const description = text.querySelector('.photo-teasers-description') || text.querySelector('p:last-of-type');
      if (description) {
        description.classList.add('photo-teasers-description');
        const arrow = document.createElement('span');
        arrow.className = 'photo-teasers-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        description.append(arrow);
      }
    }
    if (credits.childElementCount) caption.append(credits);
    if (text.childElementCount) caption.append(text);
    if (caption.childElementCount) figure.append(caption);
    if (themes && cardHref) {
      const card = document.createElement('a');
      card.className = 'photo-teasers-card-link';
      card.href = cardHref;
      card.append(figure);
      row.replaceChildren(card);
    } else {
      row.replaceChildren(figure);
    }
  });
}

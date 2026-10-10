/**
 * Channel products — the source's `.channel-products-modul.mobile-slider`: a centred module
 * heading, a row of up to 4 product cards (`li.box`, stretch-equal height, mobile slider), the
 * slider controls (decorative) and the footnotes.
 * Tier: reconstructive (NODE-slotting). Rows: a single-cell row holding only a heading = the
 * module header; a single-cell row of paragraphs = the footnotes; every other row is one card:
 * cells, each optional: pictures (PLT_D / PLT_T / PLT_S renditions), credits paragraph (text
 * only), body (kicker p, h3, description p, h4, benefit list), link paragraph. As on the source
 * the card link wraps the whole card; its text stays in the authored paragraph (the footer
 * label). Authored nodes are MOVED (EW1), wrappers carry the classes (EW2). Re-entrant (EW9).
 * @param {HTMLElement} block the channel-products block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .channel-products-list')) return;
  const names = { 1: ['all'], 2: ['desktop', 'mobile'], 3: ['desktop', 'tablet', 'mobile'] };
  const list = document.createElement('ul');
  list.className = 'channel-products-list';
  const parts = [];
  let header = null;
  let footnotes = null;
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const only = cells.length === 1 ? cells[0] : null;
    if (only && only.querySelector('h1, h2, h3, h4') && only.children.length === 1) {
      header = document.createElement('div');
      header.className = 'channel-products-header';
      header.append(...only.childNodes);
      row.remove();
      return;
    }
    if (only && [...only.children].every((el) => el.tagName === 'P')) {
      footnotes = document.createElement('div');
      footnotes.className = 'channel-products-footnotes';
      footnotes.append(...only.childNodes);
      row.remove();
      return;
    }
    const card = document.createElement('li');
    card.className = 'channel-products-card';
    const figure = document.createElement('figure');
    figure.className = 'channel-products-figure';
    const caption = document.createElement('figcaption');
    const credits = document.createElement('div');
    credits.className = 'channel-products-credits';
    const body = document.createElement('div');
    body.className = 'channel-products-body';
    const footer = document.createElement('div');
    footer.className = 'channel-products-footer';
    let anchor = null;
    cells.forEach((cell) => {
      const pictures = [...cell.querySelectorAll('picture')];
      if (pictures.length) {
        const slots = names[pictures.length] || ['all'];
        pictures.forEach((picture, i) => {
          picture.classList.add(`channel-products-${slots[i] || 'all'}`);
          figure.append(picture);
        });
        card.classList.add('has-image');
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
        body.append(...cell.childNodes);
        const head = document.createElement('div');
        head.className = 'channel-products-head';
        const kicker = body.firstElementChild;
        if (kicker && kicker.tagName === 'P') {
          kicker.classList.add('channel-products-kicker');
          head.append(kicker);
        }
        const h3 = body.querySelector('h3');
        if (h3) head.append(h3);
        if (head.childElementCount) body.prepend(head);
      } else if (cell.querySelector('a')) {
        [...cell.querySelectorAll('a')].forEach((a) => {
          a.parentElement.classList.remove('button-container');
          if (anchor) {
            a.classList.remove('button');
            return;
          }
          anchor = a;
          a.className = 'channel-products-card-link';
          a.replaceWith(...a.childNodes);
        });
        footer.append(...cell.childNodes);
      } else {
        credits.append(...cell.childNodes);
      }
    });
    if (credits.childElementCount) caption.append(credits);
    if (body.childElementCount) caption.append(body);
    if (footer.childElementCount) caption.append(footer);
    figure.append(caption);
    if (anchor) {
      anchor.replaceChildren(figure);
      card.append(anchor);
    } else {
      card.append(figure);
    }
    list.append(card);
    row.remove();
  });
  const n = list.children.length;
  block.style.setProperty('--channel-products-n', n);
  if (header) parts.push(header);
  const overflow = document.createElement('div');
  overflow.className = 'channel-products-overflow';
  overflow.append(list);
  parts.push(overflow);
  // slider controls (decorative, visible <= 1024 as on the source)
  const controls = document.createElement('div');
  controls.className = 'channel-products-controls';
  const arrow = (cls, label) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `channel-products-arrow ${cls}`;
    b.setAttribute('aria-label', label);
    b.setAttribute('aria-disabled', 'true');
    b.title = 'Slider ohne Skript (statische Vorschau)';
    return b;
  };
  const left = arrow('channel-products-arrow-left', 'Vorherige Folie');
  const right = arrow('channel-products-arrow-right', 'Nächste Folie');
  const bullets = document.createElement('span');
  bullets.className = 'channel-products-bullets';
  for (let i = 0; i < n; i += 1) {
    const b = document.createElement('span');
    b.className = `channel-products-bullet${i === 0 ? ' active' : ''}`;
    bullets.append(b);
  }
  controls.append(left, bullets, right);
  parts.push(controls);
  if (footnotes) parts.push(footnotes);
  block.replaceChildren(...parts);
}

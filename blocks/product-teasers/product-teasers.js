/**
 * Product teasers — the source's `ul.products.list-style-2 > li.box.product-teaser`: one
 * full-width card per block, picture on one half (left; variant `image-right`), the white text
 * container vertically centred on the other half (h2, divider, description, benefit list, blue
 * button). Variant `banking` = the energieBanking module (no card, text left at 10 %, image
 * right at 10 %, additional content with app badges).
 * Tier: reconstructive (NODE-slotting), one row per teaser. Cells, each optional: pictures
 * (1 = every width, 2 = desktop / mobile, 3 = PT2_D / PT2 tablet / PT2_S), credits paragraph
 * (text only), text (h2, paragraphs, lists), link paragraph, additional content (banking).
 * Authored nodes are MOVED into figure / figcaption wrappers (EW1); the divider is a decorative
 * span. Re-entrant (EW9).
 * @param {HTMLElement} block the product-teasers block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .product-teasers-card')) return;
  const names = { 1: ['all'], 2: ['desktop', 'mobile'], 3: ['desktop', 'tablet', 'mobile'] };
  [...block.children].forEach((row) => {
    row.className = 'product-teasers-card';
    const figure = document.createElement('figure');
    figure.className = 'product-teasers-figure';
    const caption = document.createElement('figcaption');
    const credits = document.createElement('div');
    credits.className = 'product-teasers-credits';
    const container = document.createElement('div');
    container.className = 'product-teasers-text';
    const link = document.createElement('div');
    link.className = 'product-teasers-link';
    const extra = document.createElement('div');
    extra.className = 'product-teasers-extra';
    let textSeen = false;
    [...row.children].forEach((cell) => {
      const pictures = [...cell.querySelectorAll('picture')];
      const hasHeading = cell.querySelector('h1, h2, h3, h4, h5, h6');
      if (pictures.length && !cell.querySelector('a') && !hasHeading) {
        const slots = names[pictures.length] || ['all'];
        pictures.forEach((picture, i) => {
          picture.classList.add(`product-teasers-${slots[i] || 'all'}`);
          figure.append(picture);
        });
      } else if (hasHeading) {
        textSeen = true;
        container.append(...cell.childNodes);
        const heading = container.querySelector('h1, h2, h3, h4, h5, h6');
        const divider = document.createElement('span');
        divider.className = 'product-teasers-divider';
        heading.after(divider);
        // .description: everything after the divider (padding-right 20 on desktop)
        const description = document.createElement('div');
        description.className = 'product-teasers-description';
        while (divider.nextSibling) description.append(divider.nextSibling);
        if (description.childNodes.length) divider.after(description);
      } else if (textSeen && cell.querySelector('a') && !link.childElementCount) {
        link.append(...cell.childNodes);
      } else if (textSeen) {
        extra.append(...cell.childNodes);
      } else {
        credits.append(...cell.childNodes);
      }
    });
    if (link.childElementCount) container.append(link);
    if (extra.childElementCount) container.append(extra);
    if (credits.childElementCount) caption.append(credits);
    caption.append(container);
    figure.append(caption);
    const inner = document.createElement('div');
    inner.append(figure);
    row.replaceChildren(inner);
  });
}

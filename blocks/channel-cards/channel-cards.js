/**
 * Channel cards — the source's `.channel-modul` list (`ul.boxes.columns-3 > li.box.image-teaser`):
 * each card is a link wrapping a figure (cover-fitted picture, credits line, h3, description,
 * "Mehr erfahren" arrow link; the link button is hidden = `style-links-as-text`).
 * Schema: stardust/eds-schema/ueber-uns-unternehmen.json sections[2] (6x LI.box).
 * Tier: reconstructive (NODE-slotting), one row per card. Cells, each optional: picture,
 * credits paragraph (text only), body (heading + paragraphs), link. Authored nodes are MOVED
 * into the figure / figcaption wrappers (EW1); the wrappers carry the classes (EW2). The
 * first authored anchor becomes the card link wrapping the figure, as on the source; its text
 * stays in the authored paragraph (the footer label). No nested anchors, nothing rebuilt.
 * Re-entrant: a block that already carries a card is left alone (EW9).
 * @param {HTMLElement} block the channel-cards block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .channel-cards-card')) return;
  [...block.children].forEach((row) => {
    row.className = 'channel-cards-card';
    const figure = document.createElement('figure');
    figure.className = 'channel-cards-figure';
    const caption = document.createElement('figcaption');
    const credits = document.createElement('div');
    credits.className = 'channel-cards-credits';
    const body = document.createElement('div');
    body.className = 'channel-cards-body';
    const footer = document.createElement('div');
    footer.className = 'channel-cards-link';
    let anchor = null;
    [...row.children].forEach((cell) => {
      const picture = cell.querySelector('picture, img');
      if (picture) {
        figure.append(picture.closest('picture') || picture);
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
        body.append(...cell.childNodes);
      } else if (cell.querySelector('a')) {
        [...cell.querySelectorAll('a')].forEach((a) => {
          const holder = a.parentElement;
          holder.classList.remove('button-container');
          if (anchor) {
            a.classList.remove('button');
            return;
          }
          anchor = a;
          a.className = 'channel-cards-card-link';
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
    if (caption.childElementCount) figure.append(caption);
    if (anchor) {
      anchor.replaceChildren(figure);
      row.replaceChildren(anchor);
    } else {
      row.replaceChildren(figure);
    }
  });
}

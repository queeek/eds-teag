/**
 * CTA band — the source's `.teaser-modul.coloring-background` (not docked): a purple full-width
 * band with a centred heading, a description paragraph and a blue button. Variant `eye-catcher`
 * adds the animated graphic hanging below the band's right edge (`.eye-catcher-container`).
 * Tier: template-slotted (NODE-slotting). Row 1 cell 1 = the text (h3, p, button paragraph),
 * optional cell 2 = the eye-catcher picture. Authored nodes are MOVED (EW1). Re-entrant (EW9).
 * @param {HTMLElement} block the cta-band block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .cta-band-text')) return;
  const text = document.createElement('div');
  text.className = 'cta-band-text';
  const eye = document.createElement('div');
  eye.className = 'cta-band-eye-catcher';
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    const picture = cell.querySelector('picture');
    if (picture && !cell.querySelector('h1, h2, h3, h4, h5, h6, a')) {
      eye.append(picture);
    } else {
      text.append(...cell.childNodes);
    }
  });
  const heading = text.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) heading.classList.add('cta-band-heading');
  const parts = [text];
  if (eye.childElementCount) parts.push(eye);
  block.replaceChildren(...parts);
}

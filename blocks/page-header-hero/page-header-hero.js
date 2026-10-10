/**
 * Page header hero — the source's `section.page-header-section.extra-wide`: the full-width
 * header picture with its credits line and the purple title bar that hangs 70px below the
 * image (desktop) or sits under it as a full-width band (<= 1024).
 * Schema: stardust/eds-schema/privatkunden-strom-haus-baustromanschluss.json sections[0].
 * Tier: template-slotted (NODE-slotting). Picture rows first (1 picture = every width;
 * 2 = desktop >= 840 / mobile; 3 = desktop / tablet 376-839 / mobile <= 375 — the source's
 * PG_D / PG_T / PG_S renditions), then the credits paragraph, then the page `<h1>`. Authored
 * elements are MOVED (EW1): pictures into the figure, the credits <p> into the figcaption,
 * the heading into `.page-header-hero-bar-inner` (`-container` is the section's class); the
 * wrappers carry the classes (EW2).
 * Variant `with-page-label` (program sibling teag-strom-easie): a `<p>` that directly precedes the
 * `<h1>` in its cell is the source's `p.page-label` and moves into the bar as
 * `.page-header-hero-label` (other blocks keep the paragraph as credits — additive).
 * Re-entrant: a block that already carries the figure is left alone (EW9).
 * @param {HTMLElement} block the page-header-hero block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .page-header-hero-figure')) return;
  const figure = document.createElement('figure');
  figure.className = 'page-header-hero-figure';
  const caption = document.createElement('figcaption');
  caption.className = 'page-header-hero-credits';
  const bar = document.createElement('div');
  bar.className = 'page-header-hero-bar';
  const container = document.createElement('div');
  container.className = 'page-header-hero-bar-inner';
  bar.append(container);
  const pictures = [];
  const withLabel = block.classList.contains('with-page-label');
  const isLabel = (el) => withLabel && el.tagName === 'P' && el.nextElementSibling
    && el.nextElementSibling.tagName === 'H1';
  [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => {
    const picture = el.matches('picture, img') ? el : el.querySelector('picture, img');
    if (picture) {
      pictures.push(picture);
    } else if (isLabel(el)) {
      el.classList.add('page-header-hero-label');
      container.append(el);
    } else if (/^H[1-6]$/.test(el.tagName)) {
      container.append(el);
    } else {
      caption.append(el);
    }
  });
  const slots = { 1: ['all'], 2: ['desktop', 'mobile'], 3: ['desktop', 'tablet', 'mobile'] };
  const names = slots[pictures.length] || ['all'];
  pictures.forEach((picture, index) => {
    picture.classList.add(`page-header-hero-${names[index] || 'all'}`);
    figure.append(picture);
  });
  if (caption.childElementCount) figure.append(caption);
  const parts = [];
  if (pictures.length) parts.push(figure);
  if (container.childElementCount) parts.push(bar);
  block.replaceChildren(...parts);
}

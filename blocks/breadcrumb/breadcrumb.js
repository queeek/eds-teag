/**
 * Breadcrumb — the source's `.page-meta-section`: the visually hidden page `<h1>` plus the
 * crumb trail (`.bread-crumb ul`). Schema: stardust/eds-schema/impressum.json sections[0].
 * Tier: template-slotted (NODE-slotting). Row 1 carries the page heading, row 2 one `<ul>`
 * whose items are the crumbs (last item = current page). Authored elements are MOVED into the
 * wrappers (EW1); the wrappers carry the layout classes (EW2); nothing is rebuilt from text.
 * Re-entrant: a block that already carries the trail wrapper is left alone (EW9).
 * @param {HTMLElement} block the breadcrumb block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .breadcrumb-trail')) return;
  const title = document.createElement('div');
  title.className = 'breadcrumb-title';
  const trail = document.createElement('nav');
  trail.className = 'breadcrumb-trail';
  trail.setAttribute('aria-label', 'Breadcrumb');
  const authored = [...block.querySelectorAll(':scope > div > div > *')];
  authored.forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) {
      title.append(el);
    } else {
      trail.append(el);
    }
  });
  const parts = title.childElementCount ? [title, trail] : [trail];
  block.replaceChildren(...parts);
}

/*
 * info-boxes — the landing page's service boxes (live `.service-boxes.campaign`): one row per
 * box, one cell per widget ([h3][content…]). Static form tier: the callback form's fields are
 * authored as `<p><em>placeholder</em></p>` and rendered as inert fields; "Anfrage senden" is
 * authored `<p><strong><a href>…</a></strong></p>` (the live `a#MainContent_CallBack2_c_send`
 * is a postback — static tier links the contact page) and rendered as the blue button face;
 * the date field gets the live datepicker opener (`a[role=button][aria-label="Kalender
 * anzeigen"]`, inert). A mailto link gets a `<wbr>` before its "@" (DOM split of the text node —
 * the live markup carries `kundenservice<wbr>@teag.de`; the DA round-trip cannot).
 */
function wordBreakAt(a) {
  const walker = document.createTreeWalker(a, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const at = node.data.indexOf('@');
    if (at > 0) {
      const tail = node.splitText(at);
      tail.before(document.createElement('wbr'));
      return;
    }
    node = walker.nextNode();
  }
}

/*
 * Live `.icon-list .entry` (fix wave 12): a flex row of icon + label + link; an entry with more
 * than that (br, annotation lines, "(24h)" suffixes) keeps everything after the icon in one wrapper
 * (live span.entries), its "(…)" text nodes as span.suffix and the lines after the first <br> as
 * span.annotation — the static markup carries bare text nodes, so the wrappers are built here.
 */
function wrapEntry(li, icon) {
  const nodes = [...li.childNodes]
    .filter((n) => n !== icon && !(n.nodeType === 3 && !n.data.trim()));
  const is = (n, sel) => n.nodeType === 1 && n.matches(sel);
  const simple = nodes.length === 2 && is(nodes[0], 'strong') && is(nodes[1], 'a');
  if (simple) return;
  const entries = document.createElement('span');
  entries.className = 'info-boxes-entries';
  [...li.childNodes].forEach((n) => {
    if (n !== icon) entries.append(n);
  });
  li.append(entries);
  [...entries.childNodes].forEach((n) => {
    if (n.nodeType === 3 && /^\s*\([^)]*\)\s*$/.test(n.data)) {
      const suffix = document.createElement('span');
      suffix.className = 'info-boxes-suffix';
      n.replaceWith(suffix);
      suffix.append(n);
    }
  });
  const br = entries.querySelector(':scope > br');
  if (!br) return;
  const rest = [];
  for (let n = br.nextSibling; n; n = n.nextSibling) rest.push(n);
  if (rest.length && rest.every((n) => n.nodeType === 3 || (n.nodeType === 1 && n.matches('br')))) {
    const annotation = document.createElement('span');
    annotation.className = 'info-boxes-annotation';
    br.after(annotation);
    rest.forEach((n) => annotation.append(n));
  }
}

export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';
  const boxes = document.createElement('ul');
  boxes.className = 'info-boxes-list';
  [...block.children].forEach((row) => {
    const box = document.createElement('li');
    box.className = 'info-boxes-box';
    if (row.children.length > 1) box.classList.add('multiple-sections');
    [...row.children].forEach((cell) => {
      const widget = document.createElement('section');
      widget.className = 'info-boxes-widget';
      const h = cell.querySelector('h1, h2, h3, h4');
      if (h) {
        const header = document.createElement('header');
        header.className = 'info-boxes-header';
        h.className = 'info-boxes-title';
        const divider = document.createElement('span');
        divider.className = 'info-boxes-divider';
        header.append(h, divider);
        widget.append(header);
      }
      const pics = [...cell.querySelectorAll(':scope > p > picture')];
      if (pics.length) {
        const figure = document.createElement('figure');
        figure.className = 'info-boxes-figure';
        pics.forEach((p, i) => {
          const holder = p.parentElement;
          if (i === 0) figure.append(p); else p.remove();
          holder.remove();
        });
        const next = cell.querySelector(':scope > p');
        if (next && !next.querySelector('a, em, strong') && next.textContent.trim().length < 40
          && cell.querySelector(':scope > p + p')) {
          const cr = document.createElement('figcaption');
          cr.className = 'info-boxes-credits';
          cr.append(next);
          figure.append(cr);
        }
        widget.append(figure);
      }
      const container = document.createElement('div');
      container.className = 'info-boxes-content';
      [...cell.children].forEach((node) => {
        if (node.matches('p') && node.children.length === 1 && node.firstElementChild.matches('em')) {
          node.className = 'info-boxes-field';
          if (/datum/i.test(node.textContent)) {
            // live: span.flex-box.with-extender > input + a.extender.icon.icon-calendar
            //   .calendar-extender-button[role=button][aria-label="Kalender anzeigen"]
            const opener = document.createElement('a');
            opener.className = 'info-boxes-calendar';
            opener.href = '#';
            opener.setAttribute('role', 'button');
            opener.setAttribute('aria-label', 'Kalender anzeigen');
            opener.addEventListener('click', (e) => e.preventDefault());
            node.append(opener);
          }
        } else if (node.matches('p') && container.lastElementChild
          && container.lastElementChild.matches('p.info-boxes-field')) {
          // (the previous cell child already moved into the container — read it there)
          // live div.checkBox.opt-in: input + label — the label is one block beside the box
          const label = document.createElement('span');
          label.className = 'info-boxes-consent-label';
          label.append(...node.childNodes);
          node.append(label);
        } else if (node.matches('p') && node === cell.lastElementChild
          && node.querySelector(':scope > strong, :scope > a.button')
          && node.textContent.trim() && !node.querySelector('em')) {
          node.className = 'info-boxes-send';
          node.querySelectorAll('a').forEach((a) => a.classList.remove('button', 'primary'));
        } else if (node.matches('ul')) {
          const hasStrong = node.querySelector('li > strong');
          node.className = hasStrong ? 'info-boxes-icon-list' : 'info-boxes-link-list';
          node.querySelectorAll('li').forEach((li) => {
            const icon = document.createElement('span');
            icon.className = 'info-boxes-icon';
            icon.setAttribute('aria-hidden', 'true');
            const target = hasStrong ? li : li.querySelector('a') || li;
            target.prepend(icon);
            if (hasStrong) wrapEntry(li, icon);
          });
        }
        container.append(node);
      });
      container.querySelectorAll('a[href^="mailto:"]').forEach(wordBreakAt);
      widget.append(container);
      box.append(widget);
    });
    boxes.append(box);
  });
  block.textContent = '';
  block.append(boxes);
}

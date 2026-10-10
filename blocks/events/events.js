/*
 * events — "Veranstaltungen." (live `section.veranstaltungen`): rows [h2] /
 * [pictures][credits][title + meta][link] / one row per month ([month p][days ul]) / [button].
 * Template-slotted; the timeline is rebuilt from the day lists. The live JS spreads the days
 * evenly over the 1420 px rail (measured 1440: 7 days → 202.8 px each) — here as percentages of
 * the total day count. A day label is the authored node MOVED into the day link (the DA
 * round-trip serves the list loose: `<li><p>3.11.</p></li>`), its href is the calendar page the
 * block's button row carries (static tier — the live day links are ASP.NET postbacks).
 */
function pictureFrom(cell) {
  const imgs = [...cell.querySelectorAll('img')];
  const picture = document.createElement('picture');
  if (imgs.length > 1) {
    const source = document.createElement('source');
    source.srcset = imgs[0].getAttribute('src');
    source.media = '(min-width: 1024px)';
    picture.append(source);
  }
  const img = document.createElement('img');
  img.src = imgs[imgs.length - 1].getAttribute('src');
  img.alt = imgs[0].alt || '';
  img.loading = 'lazy';
  picture.append(img);
  return picture;
}

export default function decorate(block) {
  if (block.dataset.decorated) return;
  block.dataset.decorated = 'true';
  const rows = [...block.children];
  const frag = document.createDocumentFragment();
  const heading = rows.find((r) => r.querySelector('h1, h2, h3'));
  if (heading) {
    const h = heading.querySelector('h1, h2, h3');
    h.className = 'events-heading';
    frag.append(h);
  }
  const teaser = rows.find((r) => r.querySelector('picture'));
  // scripts.js decorateButtons has already replaced the authored <strong><a> with a.button
  const BUTTON = 'a.button, strong a, a strong';
  const button = rows.find((r) => r.querySelector(BUTTON));
  const calendar = button && button.querySelector('a[href]');
  const calendarHref = calendar ? calendar.getAttribute('href') : '#';
  const panel = document.createElement('div');
  panel.className = 'events-panel';
  if (teaser) {
    const [pics, credits, text, link] = [...teaser.children];
    const a = document.createElement('a');
    a.className = 'events-teaser';
    const href = link && link.querySelector('a[href]');
    if (href) a.href = href.href;
    const figure = document.createElement('figure');
    figure.append(pictureFrom(pics));
    const caption = document.createElement('figcaption');
    if (credits && credits.textContent.trim()) {
      const cr = document.createElement('div');
      cr.className = 'events-credits';
      cr.append(...credits.children);
      caption.append(cr);
    }
    figure.append(caption);
    const bar = document.createElement('div');
    bar.className = 'events-bar';
    if (text) {
      const [title, meta] = [...text.querySelectorAll('p')];
      if (title) {
        title.className = 'events-title';
        bar.append(title);
      }
      if (meta) {
        meta.className = 'events-meta';
        const icon = document.createElement('span');
        icon.className = 'events-icon';
        icon.setAttribute('aria-hidden', 'true');
        meta.append(icon);
        bar.append(meta);
      }
    }
    figure.append(bar);
    a.append(figure);
    const appointment = document.createElement('div');
    appointment.className = 'events-appointment';
    appointment.append(a);
    // live mobile panel: a.navigation-button.button-next[aria-label="Zur nächsten Veranstaltung"]
    // (postback; JS-shown <= 1024, 35 x 35 at right 17px) — static tier: the calendar page
    const next = document.createElement('a');
    next.className = 'events-nav-next';
    next.href = calendarHref;
    next.setAttribute('role', 'button');
    next.setAttribute('aria-label', 'Zur nächsten Veranstaltung');
    appointment.append(next);
    if (link) {
      // the authored link paragraph is kept (EW1) but not rendered — the figure anchor is
      // the live a.teaser
      [...link.children].forEach((n) => {
        n.className = 'events-teaser-source';
        appointment.append(n);
      });
    }
    panel.append(appointment);
  }
  const months = rows.filter((r) => r !== heading && r !== teaser && r !== button);
  if (months.length) {
    const timeline = document.createElement('div');
    timeline.className = 'events-timeline';
    const ul = document.createElement('ul');
    ul.className = 'events-months';
    const dayLists = months.map((r) => r.firstElementChild.querySelector(':scope > ul'));
    const total = dayLists.reduce((n, d) => n + (d ? d.children.length : 0), 0) || 1;
    months.forEach((r, m) => {
      const cell = r.firstElementChild;
      const li = document.createElement('li');
      li.className = 'events-month';
      const monthP = cell.querySelector(':scope > p');
      if (monthP) {
        monthP.className = 'events-month-name';
        li.append(monthP);
      }
      const days = dayLists[m];
      if (days) {
        const items = [...days.children];
        li.style.flexBasis = `${(items.length / total) * 100}%`;
        days.className = 'events-days';
        items.forEach((d, i) => {
          d.style.left = `${((i + 0.5) / items.length) * 100}%`;
          if (d.querySelector('strong')) d.className = 'active';
          const sub = d.querySelector(':scope > ul');
          const a = document.createElement('a');
          a.className = `events-day${sub ? ' more' : ''}`;
          a.href = calendarHref;
          const label = document.createElement('span');
          label.className = 'events-day-label';
          // the authored label (text node, <strong> or the round-trip's <p>) MOVES into the link
          [...d.childNodes].filter((n) => n !== sub).forEach((n) => label.append(n));
          a.append(label);
          d.prepend(a);
          if (sub) {
            // live .days-menu entries are a.day-menu-link (postbacks) — static tier: the
            // calendar page
            sub.className = 'events-day-menu';
            [...sub.children].forEach((item) => {
              const menuLink = document.createElement('a');
              menuLink.className = 'events-day-menu-link';
              menuLink.href = calendarHref;
              menuLink.append(...item.childNodes);
              item.append(menuLink);
            });
          }
        });
        li.append(days);
      } else {
        li.style.flexBasis = '0%';
      }
      ul.append(li);
    });
    timeline.append(ul);
    panel.append(timeline);
  }
  frag.append(panel);
  if (button) {
    const cmd = document.createElement('div');
    cmd.className = 'events-commands';
    cmd.append(...button.firstElementChild.childNodes);
    frag.append(cmd);
  }
  block.textContent = '';
  block.append(frag);
}

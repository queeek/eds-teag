/**
 * Tariff calculator — the source's `.verfuegbarkeitscheck-modul` (availability check) inside the
 * docked grey section: PLZ field, 1–5 persons selector, kWh field, "Erweiterte Filter" link and
 * the blue submit, plus the TEAG-Kundenportal info line. Interim STATIC tier (owner decision
 * D-05, stardust/dynamic-features.md): the ASP.NET postbacks have no backend here, so the fields
 * are rendered as captured and the submit is an inert face (aria-disabled) — never a fake submit.
 * Tier: template-slotted (NODE-slotting). Row 1 cells: [label p, placeholder p] (PLZ),
 * [label p, ul of 5 persons — <strong> marks the active one], [label p, placeholder p, unit p]
 * (kWh), [filter link text p], [button text p>strong]. Row 2: the info paragraph.
 * Re-entrant (EW9).
 * @param {HTMLElement} block the tariff-calculator block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .tariff-calculator-panel')) return;
  const rows = [...block.children];
  const cells = rows[0] ? [...rows[0].children] : [];
  const panel = document.createElement('div');
  panel.className = 'tariff-calculator-panel';
  const form = document.createElement('div');
  form.className = 'tariff-calculator-form';
  panel.append(form);
  const field = (p, cls) => {
    const f = document.createElement('div');
    f.className = `tariff-calculator-field${cls ? ` ${cls}` : ''}`;
    if (p) f.append(p);
    return f;
  };
  const label = (p) => {
    const l = document.createElement('div');
    l.className = 'tariff-calculator-label';
    if (p) l.append(p);
    return l;
  };
  // PLZ
  const address = document.createElement('div');
  address.className = 'tariff-calculator-address';
  if (cells[0]) {
    const [l, ph] = cells[0].querySelectorAll('p');
    address.append(label(l), field(ph, 'tariff-calculator-plz'));
  }
  // persons
  const persons = document.createElement('div');
  persons.className = 'tariff-calculator-persons';
  if (cells[1]) {
    const select = document.createElement('div');
    select.className = 'tariff-calculator-select';
    const line = document.createElement('span');
    line.className = 'tariff-calculator-line';
    const stepper = (cls, text) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `tariff-calculator-step ${cls}`;
      b.setAttribute('aria-label', text);
      b.setAttribute('aria-disabled', 'true');
      return b;
    };
    const minus = stepper('tariff-calculator-minus', 'Eine Person weniger im Haushalt');
    const plus = stepper('tariff-calculator-plus', 'Eine Person mehr im Haushalt');
    const list = cells[1].querySelector('ul');
    if (list) {
      [...list.children].forEach((li, i) => {
        const strong = li.querySelector('strong');
        li.className = strong ? 'tariff-calculator-active' : 'tariff-calculator-inactive';
        if (strong) strong.replaceWith(...strong.childNodes);
        // the source's a.inactive / a.active control — an inert button here (no script)
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'tariff-calculator-dot';
        dot.setAttribute('aria-label', `${i + 1}-Personen-Haushalt`);
        dot.setAttribute('aria-disabled', 'true');
        const num = document.createElement('span');
        num.className = 'tariff-calculator-num';
        num.append(...li.childNodes);
        dot.append(num);
        li.append(dot);
      });
    }
    select.append(line, minus, list || '', plus);
    persons.append(label(cells[1].querySelector('p')), select);
  }
  // kWh
  const input = document.createElement('div');
  input.className = 'tariff-calculator-input';
  if (cells[2]) {
    const [l, ph, unit] = cells[2].querySelectorAll('p');
    const unity = document.createElement('div');
    unity.className = 'tariff-calculator-unity';
    const u = document.createElement('span');
    u.className = 'tariff-calculator-unit';
    if (unit) u.append(unit);
    unity.append(field(ph), u);
    input.append(label(l), unity);
  }
  // filter link (static text, the live link opens the filter settings)
  const filter = document.createElement('div');
  filter.className = 'tariff-calculator-filter';
  if (cells[3]) {
    const p = cells[3].querySelector('p');
    if (p) {
      // a.filter-settings-open-button — inert button inside the authored paragraph
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-disabled', 'true');
      button.title = 'Filter ohne Backend-Anbindung (statische Vorschau)';
      button.append(...p.childNodes);
      p.append(button);
    }
    filter.append(...cells[3].childNodes);
  }
  // submit — disabled, no backend connected (static interim tier)
  const commands = document.createElement('div');
  commands.className = 'tariff-calculator-commands';
  if (cells[4]) {
    // inert button inside the authored paragraph (the <strong> moves in): no handler, no form,
    // never a fake submit
    const p = cells[4].querySelector('p') || cells[4];
    p.className = 'tariff-calculator-submit';
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-disabled', 'true');
    button.title = 'Tarifrechner ohne Backend-Anbindung (statische Vorschau)';
    button.append(p.querySelector('strong') || p.firstChild || '');
    p.append(button);
    commands.append(p);
  }
  form.append(address, persons, input, filter, commands);
  if (rows[1]) {
    const info = document.createElement('div');
    info.className = 'tariff-calculator-info';
    info.append(...rows[1].querySelectorAll(':scope > div > *'));
    panel.append(info);
  }
  block.replaceChildren(panel);
}

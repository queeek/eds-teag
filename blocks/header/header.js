import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header block — template-slotted chrome of thueringerenergie.de (prototype #PageHeader).
 * Authored document /nav: section 1 = brand (logo link + negative logo), section 2 = the
 * mega-menu link tree (one nested <ul>), section 3 = quick links (<ul>).
 * Every authored node is MOVED with append(); the fixed desktop bar and the mobile menu are
 * presentational clones (stripInstrumentation).
 * @ew-exempt skip link, search field placeholder/label, contrast label, menu button labels —
 * UI control text of the chrome, not editorial content.
 */

// mobile/tablet width (source breakpoint)
const isDesktop = window.matchMedia('(min-width: 1025px)');

const ICON_MENU = 'G';
const ICON_CLOSE = 'H';
const ICON_SEARCH = 'r';
const ICON_CONTRAST = '';

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function icon(glyph, className = '') {
  const span = el('span', `icon ${className}`.trim(), { 'aria-hidden': 'true' });
  span.dataset.icon = glyph;
  return span;
}

/** Removes Experience Workspace indices from a presentational clone (EW4). */
function stripInstrumentation(root) {
  root.querySelectorAll('[data-prose-index], [data-image-index], [data-block-index]')
    .forEach((n) => {
      delete n.dataset.proseIndex;
      delete n.dataset.imageIndex;
      delete n.dataset.blockIndex;
    });
  return root;
}

/** Unwraps the <p> the pipeline puts around a list item's trigger link on live (#98). */
function unwrapTriggers(ul) {
  ul.querySelectorAll('li > p').forEach((p) => {
    if (p.children.length === 1 && p.firstElementChild.tagName === 'A') {
      p.replaceWith(p.firstElementChild);
    }
  });
}

function toggleMenu(menu, forceExpanded = null) {
  const button = menu.querySelector(':scope > .nav-button');
  const container = menu.querySelector(':scope > .mobile-nav-container');
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : button.getAttribute('aria-expanded') === 'true';
  const open = !expanded && !isDesktop.matches;
  button.setAttribute('aria-expanded', open);
  button.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
  container.hidden = !open;
  menu.classList.toggle('open', open);
  document.body.style.overflowY = open ? 'hidden' : '';
}

function buildSearch(collapsed) {
  const form = el('form', `search${collapsed ? ' collapsed' : ''}`, {
    role: 'search',
    'aria-label': 'Suchformular',
    action: '/search',
    method: 'get',
  });
  const input = el('input', '', {
    type: 'text',
    name: 'q',
    'aria-label': 'Suche',
    placeholder: 'Suche',
    autocomplete: 'off',
  });
  const submit = el('button', 'icon', { type: 'submit', 'aria-label': 'Suchen' });
  submit.dataset.icon = ICON_SEARCH;
  form.append(input, submit);
  // index-backed search (dynamics D-02): an empty collapsed form first opens; a term is
  // submitted to the /search results page, which answers from /query-index.json
  form.addEventListener('submit', (e) => {
    if (input.value.trim()) return;
    e.preventDefault();
    if (collapsed) form.classList.toggle('collapsed');
    input.focus();
  });
  return form;
}

function buildContrastSwitch() {
  const wrap = el('div', 'contrast-switch');
  const vis = el('span', 'visualization');
  const knob = el('button', 'icon', {
    type: 'button',
    role: 'switch',
    'aria-checked': 'false',
    'aria-label': 'Kontrast-Modus einschalten',
  });
  knob.dataset.icon = ICON_CONTRAST;
  vis.append(knob);
  const label = el('span', 'contrast-label');
  label.textContent = 'Kontrast';
  wrap.append(vis, label);
  const toggle = () => {
    const on = !wrap.classList.contains('active');
    wrap.classList.toggle('active', on);
    knob.setAttribute('aria-checked', on);
    document.body.classList.toggle('user-prefers-more-contrast', on);
  };
  knob.addEventListener('click', toggle);
  label.addEventListener('click', toggle);
  return wrap;
}

/** Marks nested items and wraps sub-lists in the mega-menu panel. */
function decorateTree(ul) {
  unwrapTriggers(ul);
  const channel = window.location.pathname.split('/')[1] || '';
  ul.querySelectorAll(':scope > li').forEach((li, i) => {
    li.classList.add(`level-1-${i + 1}`);
    const link = li.querySelector(':scope > a[href]');
    const target = link ? new URL(link.getAttribute('href'), window.location).pathname : '';
    if (channel && target.split('/')[1] === channel) li.classList.add('active');
    const sub = li.querySelector(':scope > ul');
    if (!sub) return;
    li.classList.add('has-children');
    const mega = el('div', 'mega', { hidden: '' });
    const columns = el('div', 'columns');
    columns.append(sub);
    mega.append(columns);
    li.append(mega);
    const trigger = li.querySelector(':scope > a');
    const show = (on) => {
      mega.hidden = !on;
      li.classList.toggle('expanded', on);
    };
    li.addEventListener('mouseenter', () => {
      if (isDesktop.matches) show(true);
    });
    li.addEventListener('mouseleave', () => show(false));
    li.addEventListener('focusout', (e) => {
      if (!li.contains(e.relatedTarget)) show(false);
    });
    if (trigger) {
      trigger.addEventListener('focus', () => {
        if (isDesktop.matches) show(true);
      });
    }
  });
  ul.querySelectorAll('li > ul').forEach((sub) => {
    sub.parentElement.classList.add('has-children');
  });
}

/** Builds the accordion mobile nav from a clone of the authored tree (EW4). */
function buildMobileNav(ul) {
  const container = el('div', 'mobile-nav-container', { hidden: '' });
  const clone = stripInstrumentation(ul.cloneNode(true));
  clone.className = 'mobile-nav';
  clone.querySelectorAll('.mega').forEach((mega) => {
    const sub = mega.querySelector('ul');
    mega.replaceWith(sub);
  });
  clone.querySelectorAll('li.has-children').forEach((li) => {
    li.classList.remove('expanded');
    li.classList.add('closed');
    const sw = el('button', 'nav-switch', { type: 'button', 'aria-expanded': 'false' });
    sw.setAttribute('aria-label', 'Unterpunkte anzeigen');
    sw.dataset.icon = 'N';
    li.querySelector(':scope > a').after(sw);
    sw.addEventListener('click', () => {
      const open = li.classList.toggle('closed');
      sw.setAttribute('aria-expanded', !open);
    });
  });
  container.append(clone);
  return container;
}

/** Fixed desktop bar: negative logo + top-level links (clones) + collapsed search. */
function buildCombinedHeader(brandNode, ul) {
  const bar = el('div', 'section-2 combined-header');
  const center = el('div', 'center');
  const nav = el('nav', '', { 'aria-label': 'Hauptnavigation (fixiert)' });
  const menu = el('div', 'menu mega-style');
  const list = el('ul', 'level-1');
  const logo = el('li', 'logo');
  if (brandNode) logo.append(stripInstrumentation(brandNode));
  list.append(logo);
  ul.querySelectorAll(':scope > li > a').forEach((a) => {
    const li = el('li', 'nav-link');
    li.append(stripInstrumentation(a.cloneNode(true)));
    list.append(li);
  });
  const search = el('li', 'search-container');
  search.append(buildSearch(true));
  list.append(search);
  menu.append(list);
  nav.append(menu);
  center.append(nav);
  bar.append(center);
  return bar;
}

function wireScrollState(root) {
  const combined = root.querySelector('.combined-header');
  const separated = root.querySelector('.seperated-header');
  const header = root.closest('header') || root;
  let ticking = false;
  const update = () => {
    ticking = false;
    const on = window.scrollY > header.offsetHeight;
    document.body.classList.toggle('nav-is-fixed', on);
    combined.classList.toggle('fixed', on && isDesktop.matches);
    separated.classList.toggle('fixed', on && !isDesktop.matches);
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }, { passive: true });
  isDesktop.addEventListener('change', update);
  update();
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;

  block.textContent = '';
  const sections = [...fragment.children].filter((s) => s.tagName === 'DIV');
  const content = (i) => {
    const s = sections[i];
    if (!s) return [];
    const wrappers = s.querySelectorAll(':scope > .default-content-wrapper');
    const hosts = wrappers.length ? [...wrappers] : [s];
    return hosts.flatMap((h) => [...h.children]);
  };
  const brandNodes = content(0);
  const [tree] = content(1).filter((n) => n.tagName === 'UL');
  const toolNodes = content(2);

  const root = el('div', 'page-header');
  const main = document.querySelector('main');
  if (main && !main.id) main.id = 'main';
  const skip = el('a', 'skip-link', { href: '#main' });
  skip.textContent = 'Weiter zum Inhalt';
  root.append(skip);

  // section 1: brand bar
  const section1 = el('div', 'section-1');
  const center1 = el('div', 'center');
  const logo = el('div', 'logo');
  const [brandMain, brandNeg] = brandNodes;
  if (brandMain) {
    brandMain.querySelectorAll('a.button').forEach((a) => {
      a.className = '';
    });
    if (brandMain.classList.contains('button-wrapper')) brandMain.className = '';
    logo.append(brandMain);
  }
  const tools = el('div', 'header-tools');
  const quick = el('div', 'quick-links');
  toolNodes.forEach((n) => {
    if (n.tagName === 'UL') {
      unwrapTriggers(n);
      [...n.children].forEach((li, i) => li.classList.add(`quick-${i + 1}`));
    }
    quick.append(n);
  });
  const searchPanel = el('div', 'search-panel');
  searchPanel.append(buildSearch(false));
  const buttons = el('div', 'header-buttons');
  buttons.append(buildContrastSwitch());
  tools.append(quick, searchPanel, buttons);
  center1.append(logo, tools);
  section1.append(center1);
  root.append(section1);

  // section 2: main navigation (desktop mega menu / mobile burger)
  const section2 = el('div', 'section-2 seperated-header');
  const center2 = el('div', 'center');
  const nav = el('nav', '', { 'aria-label': 'Hauptnavigation' });
  const menu = el('div', 'menu mega-style');
  const burger = el('button', 'nav-button', {
    type: 'button',
    'aria-expanded': 'false',
    'aria-label': 'Menü öffnen',
  });
  burger.append(icon(ICON_MENU, 'icon-menu'), icon(ICON_CLOSE, 'icon-close-menu'));
  burger.addEventListener('click', () => toggleMenu(menu));
  menu.append(burger);
  if (tree) {
    decorateTree(tree);
    menu.append(tree);
    const mobileNav = buildMobileNav(tree);
    menu.append(mobileNav);
    const sixth = tree.querySelector(':scope > li.level-1-6');
    if (sixth) sixth.classList.add('mobile-visible');
  }
  nav.append(menu);
  center2.append(nav);
  section2.append(center2);
  root.append(section2);

  // fixed desktop bar (scroll state) — negative logo authored as the 2nd brand node
  const negClone = brandNeg ? brandNeg.cloneNode(true) : null;
  if (brandNeg) brandNeg.remove();
  root.append(buildCombinedHeader(negClone, tree || el('ul')));

  block.append(root);
  toggleMenu(menu, false);
  isDesktop.addEventListener('change', () => toggleMenu(menu, false));
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && menu.classList.contains('open')) {
      toggleMenu(menu, false);
      burger.focus();
    }
  });
  wireScrollState(root);
}

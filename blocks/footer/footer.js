import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Footer block — template-slotted chrome of thueringerenergie.de (prototype #PageFooter).
 * Authored document /footer, one section per band: 1 contact (h3 + ul), 2 social (h3 + ul of
 * network links), 3 newsletter (h3 + p + CTA), 4 legal (ul + copyright p).
 * Authored nodes are MOVED with append(); the newsletter input is a static control.
 * @ew-exempt newsletter e-mail field placeholder/label — a form control, not editorial text.
 */

const SOCIAL = [
  ['linkedin', 'linkedin'],
  ['facebook', 'facebook'],
  ['instagram', 'instagram'],
  ['xing', 'xing'],
  ['youtube', 'youtube'],
  ['twitter', 'x'],
  ['x.com', 'x'],
];

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

function sectionNodes(section) {
  if (!section) return [];
  const wrappers = section.querySelectorAll(':scope > .default-content-wrapper');
  const hosts = wrappers.length ? [...wrappers] : [section];
  return hosts.flatMap((h) => [...h.children]);
}

/** Wraps the leading label text node of each contact row in a span (node moved, not copied). */
function decorateContact(nodes, host) {
  nodes.forEach((n) => {
    if (n.tagName === 'UL') {
      n.querySelectorAll(':scope > li').forEach((li) => {
        const first = li.firstChild;
        if (first && first.nodeType === Node.TEXT_NODE && first.textContent.trim()) {
          const label = el('span', 'label');
          label.append(first);
          li.prepend(label);
        }
      });
    }
    host.append(n);
  });
}

function decorateSocial(nodes, host) {
  nodes.forEach((n) => {
    if (n.tagName === 'UL') {
      n.querySelectorAll(':scope > li').forEach((li) => {
        const a = li.querySelector('a[href]');
        if (!a) return;
        const href = a.getAttribute('href').toLowerCase();
        const match = SOCIAL.find(([needle]) => href.includes(needle));
        li.classList.add(`social-${match ? match[1] : 'link'}`);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
      });
    }
    host.append(n);
  });
}

function decorateNewsletter(nodes, host) {
  const form = el('form', 'newsletter-form', { action: '#', method: 'post' });
  const input = el('input', '', {
    type: 'email',
    name: 'email',
    placeholder: 'E-Mail-Adresse',
    'aria-label': 'E-Mail-Adresse',
    autocomplete: 'email',
  });
  form.append(input);
  nodes.forEach((n) => {
    if (n.classList.contains('button-wrapper')) form.append(n);
    else host.append(n);
  });
  // static replica: no newsletter backend
  form.addEventListener('submit', (e) => e.preventDefault());
  host.append(form);
}

function decorateLegal(nodes, host) {
  const nav = el('nav', 'legal-links', { 'aria-label': 'Rechtliche und regulatorische Hinweise' });
  const copyright = el('div', 'copyright');
  nodes.forEach((n) => {
    if (n.tagName === 'UL' || n.tagName === 'OL') nav.append(n);
    else copyright.append(n);
  });
  host.append(nav, copyright);
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  block.textContent = '';
  const sections = [...fragment.children].filter((s) => s.tagName === 'DIV');

  const root = el('div', 'page-footer');
  const section1 = el('div', 'section-1');
  const center1 = el('div', 'center');
  const contact = el('div', 'contact');
  const social = el('div', 'social');
  const newsletter = el('div', 'newsletter');
  decorateContact(sectionNodes(sections[0]), contact);
  decorateSocial(sectionNodes(sections[1]), social);
  decorateNewsletter(sectionNodes(sections[2]), newsletter);
  center1.append(contact, social, newsletter);
  section1.append(center1);

  const section2 = el('div', 'section-2');
  const center2 = el('div', 'center');
  decorateLegal(sectionNodes(sections[3]), center2);
  section2.append(center2);

  root.append(section1, section2);
  block.append(root);
}

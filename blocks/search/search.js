/**
 * Search — results page for the header search (dynamics D-02, pattern search-index-backed).
 * The source's WebForms search (`ctl00$tbSearch`) posted back to the same page; here the
 * header form GETs `/search?q=` and this block answers from the platform's `/query-index.json`
 * (helix-query.yaml): title matches rank first, description and body text are consulted only
 * while fewer than VISIBLE title hits exist, results are deduped by title + description and
 * paged client-side. Chrome and search documents are excluded from the index.
 * The one authored cell (the empty-state copy) is moved into the wrapper (EW1).
 * @param {HTMLElement} block the search block
 */
const INDEX = '/query-index.json';
const PARAMS = ['q', 'tbSearch', 'ctl00$tbSearch', 'ctl00$tbSearch2'];
const VISIBLE = 3;
const PAGE_SIZE = 10;
let rowsCache = null;

function readQuery() {
  const params = new URLSearchParams(window.location.search);
  const key = PARAMS.find((p) => params.get(p));
  return {
    q: key ? params.get(key).trim() : '',
    page: Math.max(1, parseInt(params.get('page') || '1', 10) || 1),
  };
}

async function loadRows() {
  if (rowsCache) return rowsCache;
  const rows = [];
  for (let off = 0; ; off += 500) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetch(`${INDEX}?offset=${off}&limit=500`);
    if (!res.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await res.json();
    rows.push(...(json.data || []));
    if (off + 500 >= (json.total || 0)) break;
  }
  rowsCache = rows;
  return rows;
}

function search(rows, q) {
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const hasAll = (s) => terms.every((t) => String(s || '').toLowerCase().includes(t));
  const titleHits = rows.filter((r) => hasAll(r.title));
  const descHits = titleHits.length < VISIBLE
    ? rows.filter((r) => !hasAll(r.title) && hasAll(r.description)) : [];
  const textHits = titleHits.length + descHits.length < VISIBLE
    ? rows.filter((r) => !hasAll(r.title) && !hasAll(r.description) && hasAll(r.text)) : [];
  const seen = new Set();
  return [...titleHits, ...descHits, ...textHits].filter((r) => {
    const key = `${r.title}|${r.description}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Excerpt window around the first match, after the breadcrumb + title lead of `text`. */
function excerpt(row, q) {
  const text = String(row.text || '');
  const title = String(row.title || '').split('|')[0].trim();
  const leadEnd = title ? text.indexOf(title) + title.length : 0;
  const body = text.slice(Math.max(0, leadEnd)).replace(/\s+/g, ' ').trim();
  const term = q.toLowerCase().split(/\s+/).find((t) => t.length > 1) || '';
  const at = term ? body.toLowerCase().indexOf(term) : -1;
  if (at < 0) return row.description || body.slice(0, 180);
  const start = Math.max(0, at - 80);
  const end = Math.min(body.length, at + 120);
  return `${start ? '… ' : ''}${body.slice(start, end)}${end < body.length ? ' …' : ''}`;
}

function pageLink(q, page, label, rel) {
  const a = document.createElement('a');
  a.href = `?q=${encodeURIComponent(q)}&page=${page}`;
  a.textContent = label;
  a.rel = rel;
  a.className = 'button secondary';
  return a;
}

function render(block, hits, q, page) {
  const results = block.querySelector('.search-results');
  const status = block.querySelector('.search-status');
  const nav = block.querySelector('.search-pagination');
  results.replaceChildren();
  nav.replaceChildren();
  block.querySelector('.search-empty').hidden = hits.length > 0 || !q;
  if (!q) {
    status.textContent = '';
    return;
  }
  status.textContent = hits.length === 1
    ? `1 Ergebnis für „${q}“`
    : `${hits.length} Ergebnisse für „${q}“`;
  hits.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).forEach((row) => {
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const a = document.createElement('a');
    a.href = row.path;
    a.textContent = String(row.title || row.path).split('|')[0].trim();
    h3.append(a);
    const p = document.createElement('p');
    p.textContent = excerpt(row, q);
    const url = document.createElement('span');
    url.className = 'search-result-url';
    url.textContent = `${window.location.origin}${row.path}`;
    li.append(h3, p, url);
    results.append(li);
  });
  if (page > 1) nav.append(pageLink(q, page - 1, 'Zurück', 'prev'));
  if (page * PAGE_SIZE < hits.length) nav.append(pageLink(q, page + 1, 'Weiter', 'next'));
}

export default async function decorate(block) {
  if (block.querySelector(':scope > .search-results')) return;
  const authored = [...block.querySelectorAll(':scope > div > div > *')];
  const empty = document.createElement('div');
  empty.className = 'search-empty';
  authored.forEach((el) => empty.append(el));
  if (!empty.childElementCount) {
    const p = document.createElement('p');
    p.textContent = 'Keine Ergebnisse. Bitte versuchen Sie einen anderen Suchbegriff.';
    empty.append(p);
  }
  const form = document.createElement('form');
  form.className = 'search-form';
  form.setAttribute('role', 'search');
  form.method = 'get';
  form.action = window.location.pathname;
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.setAttribute('aria-label', 'Suche');
  input.placeholder = 'Suche';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button';
  submit.textContent = 'Suchen';
  form.append(input, submit);
  const status = document.createElement('p');
  status.className = 'search-status';
  status.setAttribute('aria-live', 'polite');
  const results = document.createElement('ul');
  results.className = 'search-results';
  const nav = document.createElement('nav');
  nav.className = 'search-pagination';
  nav.setAttribute('aria-label', 'Seiten');
  block.replaceChildren(form, status, results, empty, nav);

  const { q, page } = readQuery();
  input.value = q;
  const headerInputs = document.querySelectorAll('header .search input[name="q"]');
  headerInputs.forEach((el) => { el.value = q; });
  if (!q) {
    render(block, [], '', 1);
    return;
  }
  status.textContent = 'Suche läuft …';
  const rows = await loadRows();
  render(block, search(rows, q), q, page);
}

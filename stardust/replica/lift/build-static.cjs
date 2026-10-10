// build-static.cjs — structural clone (Path A′) of the gated impressum prototype for a "static" sibling: node build-static.cjs <slug> (derived from build-impressum.cjs; template CSS css/impressum.css).
// Helpers sliced from build-baustrom.cjs (query-not-copy rules); chrome copied verbatim from the gated index prototype. No images on this page; link-button faces are rehosted from the inline data-URL PNGs.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const cheerio = require('/app/node_modules/cheerio');
const ROOT = '/workspace/dc15da58'; const SLUG = process.argv[2] || 'impressum';
const $ = cheerio.load(fs.readFileSync(path.join(ROOT, `stardust/current/pages/${SLUG}.html`), 'utf8'));
const HOST = 'https://www.thueringerenergie.de'; const missing = new Set();
const BTN = path.join(ROOT, `stardust/prototypes/assets/${SLUG}/btn`); fs.mkdirSync(BTN, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (k, v) => v == null || v === '' ? '' : ` ${k}="${esc(v)}"`;
const txt = el => $(el).text().replace(/\s+/g, ' ').trim();
const aria = el => el && el.attribs ? attr('aria-label', el.attribs['aria-label']) + attr('title', el.attribs.title) : '';
const href = h => { if (!h) return '#'; if (/^javascript:(var options|__doPostBack)/.test(h)) return '#'; return h; };
const dataUrlFile = s => { const m = String(s || '').match(/url\((["']?)(data:image\/png;base64,([^)"']+))\1\)/); if (!m) return ''; const k = 'd' + crypto.createHash('md5').update(m[2]).digest('hex').slice(0, 8); const f = path.join(BTN, k + '.png'); if (!fs.existsSync(f)) fs.writeFileSync(f, Buffer.from(m[3], 'base64')); return `assets/${SLUG}/btn/${k}.png`; };
function iconClass(el) { return (el.attribs.class || '').split(/\s+/).filter(c => c === 'icon' || c === 'fa' || /^icon-/.test(c) || /^fa-/.test(c)).join(' '); }
const lb = (el) => { const a = el.attribs || {}; const cls = (a.class || '').split(/\s+/).filter(c => ['link-button', 'blue', 'enlarge', 'full-size', 'dynamic-size', 'hover-dark-blue', 'float-right'].includes(c)).join(' '); const bg = dataUrlFile(a.style); const m = (a.style || '').match(/width:\s*([\d.]+)px/); const style = [bg ? `background-image:url(${bg})` : '', m && !/full-size/.test(cls) ? `width:${m[1]}px` : ''].filter(Boolean).join(';'); const ic = $(el).children('span.icon').get(0); return `<a class="${cls}"${attr('href', href(a.href))}${attr('style', style)}${aria(el)}>${esc(txt(el))}${ic ? `<span class="${iconClass(ic)}"></span>` : ''}</a>`; };
const KEEP_ID = /^(PCS\d+|MainContent_(PCS\d+|h1Alternative|BreadCrumbList|BreadCrumbActivePageListItem))$/;
const DROP_CLS = /^(i\d+-\d+|update-panel|aspNetDisabled|do-not-priorizes|uses-startUp-animations|initialized|manually-initialization|not-smartphone-mode|-style|default-style|is-initialized-for-redirect|has-external-link-icon|dynamic-list-detail-page-link|animated)$/;
const DROP_TAG = new Set(['script', 'style', 'noscript', 'iframe', 'template', 'input']);
const VOID = new Set(['img', 'br', 'wbr', 'hr', 'source']);
const classes = n => (n.attribs.class || '').split(/\s+/).filter(c => c && !DROP_CLS.test(c)).join(' ');
function gen(n) {
  if (n.type === 'text') return esc(n.data); if (n.type !== 'tag') return '';
  const t = n.tagName; const a = n.attribs || {}; if (DROP_TAG.has(t)) return '';
  if (t === 'img' || t === 'picture' || t === 'source') { missing.add(a.src || a.srcset || t); return ''; }
  if (t === 'a' && /\blink-button\b/.test(a.class || '')) return lb(n);
  if (t === 'nobr') return `<span class="nowrap">${$(n).contents().toArray().map(gen).join('')}</span>`;
  const hiddenInline = /display:\s*none/.test(a.style || '');
  let cls = classes(n); if (hiddenInline && !/\bhidden\b/.test(cls)) cls = (cls + ' hidden').trim();
  const open = `<${t}${attr('id', KEEP_ID.test(a.id || '') ? a.id : null)}${attr('class', cls)}${attr('href', t === 'a' ? href(a.href) : null)}${attr('data-icon', a['data-icon'])}${attr('aria-label', a['aria-label'])}${attr('title', a.title)}${attr('colspan', a.colspan)}${attr('role', a.role)}>`;
  if (VOID.has(t)) return open;
  return open + $(n).contents().toArray().map(gen).join('') + `</${t}>`;
}
const genSel = sel => $(sel).toArray().map(gen).join('');
function meta() {
  const items = $('#MainContent_BreadCrumbList > li').toArray().map(li => { const a = $(li).children('a').get(0); const ic = $(a).children('span.icon').get(0); return `<li${attr('class', classes(li))}><a href="${esc(a.attribs.href || '#')}">${ic ? `<span class="icon"${attr('data-icon', ic.attribs['data-icon'])}></span>` : ''}${esc(txt(a))}</a></li>`; }).join('');
  return `<section class="page-meta-section"><div class="center clear-fix"><div class="clear-fix"><div class="bread-crumb clear-fix"><ul id="MainContent_BreadCrumbList" class="clear-fix">${items}</ul></div></div></div></section>`;
}
const h1 = $('#MainContent_h1Alternative'); const h1Html = `<h1 id="MainContent_h1Alternative" class="screen-reader visible-only">${esc(txt(h1))}</h1>`;
const sections = genSel('#Content > article > section.page-content-section');
const chrome = fs.readFileSync(path.join(ROOT, 'stardust/prototypes/index-proposed.html'), 'utf8');
const headerHtml = chrome.slice(chrome.indexOf('<header id="PageHeader">'), chrome.indexOf('<main id="Content">'));
const footerHtml = chrome.slice(chrome.indexOf('<footer id="PageFooter">'), chrome.indexOf('</body>'));
const page = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc($('title').first().text().trim())}</title>
<meta name="description" content="${esc($('meta[name=description]').attr('content') || '')}">
<link rel="icon" href="assets/index/favicon.png">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/impressum.css">
</head>
<body class="site">
${headerHtml}<main id="Content">
<article>
${h1Html}
${meta()}
${sections}
</article>
</main><div class="scroll-up" role="button" aria-label="Zum Seitenanfang" tabindex="0"></div>
${footerHtml}<script src="js/index.js"></script>
</body>
</html>
`;
const spaced = page.replace(/>(<(?:div|p|h[1-6]|ul|li|section|header|figure|figcaption|form|nav|label|select|option|table|thead|tbody|tr)\b)/g, '>\n$1');
fs.writeFileSync(path.join(ROOT, `stardust/prototypes/${SLUG}-proposed.html`), spaced);
console.log('written', spaced.length, 'bytes; missing assets:', [...missing], 'btn pngs:', fs.readdirSync(BTN).length, 'sections:', $('#Content > article > section.page-content-section').length);

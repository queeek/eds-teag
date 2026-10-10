// build-baustrom.cjs — assemble stardust/prototypes/privatkunden-strom-haus-baustromanschluss-proposed.html (article page type) from the captured page; helpers sliced from build-stromtarife.cjs (same query-not-copy rules), chrome copied verbatim from the gated index prototype.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const cheerio = require('/app/node_modules/cheerio');
const ROOT = '/workspace/dc15da58'; const SLUG = 'privatkunden-strom-haus-baustromanschluss';
const $ = cheerio.load(fs.readFileSync(path.join(ROOT, `stardust/current/pages/${SLUG}.html`), 'utf8'));
const assetMap = JSON.parse(fs.readFileSync(path.join(ROOT, `stardust/replica/lift/${SLUG}-asset-map.json`), 'utf8'));
const dataUrls = {}; const HOST = 'https://www.thueringerenergie.de'; const missing = new Set();
const BTN = path.join(ROOT, `stardust/prototypes/assets/${SLUG}/btn`); fs.mkdirSync(BTN, { recursive: true });
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (k, v) => v == null || v === '' ? '' : ` ${k}="${esc(v)}"`;
const txt = el => $(el).text().replace(/\s+/g, ' ').trim();
const local = u => { if (!u) return ''; u = u.trim().split(/\s+/)[0]; const p = u.startsWith(HOST) ? u.slice(HOST.length) : u; if (assetMap[p]) return assetMap[p]; if (!/^data:/.test(u)) missing.add(u); return ''; };
const aria = el => el && el.attribs ? attr('aria-label', el.attribs['aria-label']) + attr('title', el.attribs.title) : '';
const href = h => { if (!h) return '#'; if (/^javascript:(var options|__doPostBack)/.test(h)) return '#'; return h; };
const dataUrlFile = s => { const m = String(s || '').match(/url\((["']?)(data:image\/png;base64,([^)"']+))\1\)/); if (!m) return ''; const k = 'd' + crypto.createHash('md5').update(m[2]).digest('hex').slice(0, 8); const f = path.join(BTN, k + '.png'); if (!fs.existsSync(f)) fs.writeFileSync(f, Buffer.from(m[3], 'base64')); return `assets/${SLUG}/btn/${k}.png`; };
function srcset1x(ss) { if (!ss) return ''; const cands = ss.split(',').map(c => c.trim()).filter(Boolean); const one = cands.filter(c => !/\s[23]x$/.test(c)).map(c => { const [u] = c.split(/\s+/); const l = local(u); return l ? `${l} 1x` : ''; }).filter(Boolean); return one.join(', '); }
function imgTag(imgEl, extraClass) { const a = imgEl.attribs || {}; const ss = a.srcset || a['data-srcset'] || ''; const first = ss ? ss.split(',')[0].trim().split(/\s+/)[0] : (a['data-src'] || a.src); const src = local(first); return `<img${attr('src', src)}${attr('alt', a.alt == null ? '' : a.alt)}${attr('class', extraClass)}>`; }
function pictureTag(picEl) { const srcs = $(picEl).children('source').toArray(); const sources = srcs.map(s => `<source${attr('srcset', srcset1x(s.attribs.srcset))}${attr('media', s.attribs.media)}>`).join(''); const img = $(picEl).children('img').get(0); if (!img) return `<picture>${sources}</picture>`; const fb = srcs.length ? srcs[srcs.length - 1].attribs.srcset.split(',')[0].trim().split(/\s+/)[0] : ''; const a = img.attribs || {}; return `<picture>${sources}<img${attr('src', local(fb) || local(a['data-src'] || a.src))}${attr('alt', a.alt == null ? '' : a.alt)}></picture>`; }
function credits(figEl) { const c = $(figEl).find('.picture-credits').first(); if (!c.length) return ''; const name = txt(c.find('span').last()); return `<div class="picture-credits"><span class="fa fa-copyright"></span> <span>${esc(name)}</span></div>`; }
function iconClass(el) { const cls = (el.attribs.class || '').split(/\s+/).filter(c => c === 'icon' || c === 'fa' || /^icon-/.test(c) || /^fa-/.test(c) || ['unchecked', 'checked', 'arrow-left', 'arrow-right', 'bullet', 'label', 'entries', 'annotation', 'suffix', 'hilite', 'title', 'link-text', 'required', 'bold', 'has-external-link-icon', 'is-initialized-for-redirect', 'extender', 'toolTip-opener', 'close-button', 'tooltip-closer', 'menu-closer'].includes(c)); return cls.join(' '); }
// inline serializer for richtext: text + a/b/strong/i/em/br/wbr/nobr/span(icon|fa|whitelisted)
function inline(el) { let out = ''; $(el).contents().each((i, n) => { if (n.type === 'text') { out += esc(n.data); return; } if (n.type !== 'tag') return; const t = n.tagName; if (t === 'input' || t === 'script' || t === 'style') return; if (t === 'br' || t === 'wbr') { out += `<${t}>`; return; } if (n.attribs && /display:\s*none/.test(n.attribs.style || '')) { out += `<span class="hidden">${inline(n)}</span>`; return; } if (t === 'a') { out += `<a${attr('href', href(n.attribs.href))}${attr('class', iconClass(n))}${attr('data-icon', n.attribs['data-icon'])}${aria(n)}>${inline(n)}</a>`; return; } if (t === 'nobr') { out += `<span class="nowrap">${inline(n)}</span>`; return; } if (['b', 'strong', 'i', 'em', 'u', 'sup', 'sub'].includes(t)) { out += `<${t}>${inline(n)}</${t}>`; return; } if (t === 'span' || t === 'label' || t === 'div' || t === 'p' || t === 'ul' || t === 'li' || t === 'h2' || t === 'h3' || t === 'h4' || t === 'img' || t === 'figure' || t === 'figcaption' || t === 'picture' || t === 'source' || t === 'section' || t === 'header' || t === 'option' || t === 'select') { out += clean(n); return; } out += inline(n); }); return out; }
// whitelist serializer for hidden/non-visual DOM
function clean(n) { const t = n.tagName; if (t === 'img') return imgTag(n); if (t === 'picture') return pictureTag(n); if (t === 'source') return ''; const cls = (n.attribs.class || '').split(/\s+/).filter(c => c && !/^i\d+-\d+$/.test(c) && !/^(clear-fix|update-panel|aspNetDisabled|do-not-priorizes|uses-startUp-animations|initialized|not-smartphone-mode|-style|default-style|dynamic-list-detail-page-link)$/.test(c)).join(' '); const dataIcon = n.attribs['data-icon']; return `<${t}${attr('class', cls)}${attr('href', t === 'a' ? href(n.attribs.href) : null)}${attr('data-icon', dataIcon)}${aria(n)}>${inline(n)}</${t}>`; }
const lb = (el) => { // link-button from captured anchor (inline background png → rehosted, width = png − padding)
  const a = el.attribs || {}; const cls = (a.class || '').split(/\s+/).filter(c => ['link-button', 'blue', 'enlarge', 'full-size', 'dynamic-size', 'hover-dark-blue', 'float-right'].includes(c)).join(' '); const bg = dataUrlFile(a.style); const m = (a.style || '').match(/width:\s*([\d.]+)px/); const style = [bg ? `background-image:url(${bg})` : '', m && !/full-size/.test(cls) ? `width:${m[1]}px` : ''].filter(Boolean).join(';'); const ic = $(el).children('span.icon').get(0); return `<a class="${cls}"${attr('href', href(a.href))}${attr('style', style)}${aria(el)}>${esc(txt(el))}${ic ? `<span class="${iconClass(ic)}"></span>` : ''}</a>`; };

/* ---------------------------------------------------------------- header */
const KEEP_ID = /^(PCS\d+|List\d+|Heading\d+|MainContent_(PCS\d+|CPMList\d+|Boxes\d+|FootnoteContainer\d+|contentheader(top)?|h1HeaderImagePage|h3HeaderImagePage|headerPictureCredits|Faqs1_(FaqModul|ServiceRow|pnlFilter|pnlFilterSub|pnlSearch|tbSearch|lbSearch|ListContainer)|ul\d+)|TeaserModulContainer\d+)$/;
const DROP_CLS = /^(i\d+-\d+|update-panel|aspNetDisabled|do-not-priorizes|uses-startUp-animations|initialized|manually-initialization|not-smartphone-mode|-style|default-style|is-initialized-for-redirect|has-external-link-icon|dynamic-list-detail-page-link|animated)$/;
const DROP_TAG = new Set(['script', 'style', 'noscript', 'iframe', 'template']);
const VOID = new Set(['img', 'br', 'wbr', 'hr', 'input', 'source']);
const classes = n => (n.attribs.class || '').split(/\s+/).filter(c => c && !DROP_CLS.test(c)).join(' ');
function gen(n, opts = {}) {
  if (n.type === 'text') return esc(n.data); if (n.type !== 'tag') return '';
  const t = n.tagName; const a = n.attribs || {}; if (DROP_TAG.has(t)) return '';
  if (t === 'input') { if ((a.type || 'text') !== 'text' || /hidden/.test(a.class || '')) return ''; return `<input type="text"${attr('id', KEEP_ID.test(a.id || '') ? a.id : null)}${attr('class', classes(n))}${attr('placeholder', a.placeholder)}${attr('aria-label', a['aria-label'])}${attr('maxlength', a.maxlength)} autocomplete="off">`; }
  if (t === 'picture') return pictureTag(n); if (t === 'img') return imgTag(n); if (t === 'source') return '';
  if (t === 'a' && /\blink-button\b/.test(a.class || '')) return lb(n);
  if (t === 'nobr') return `<span class="nowrap">${$(n).contents().toArray().map(c => gen(c, opts)).join('')}</span>`;
  const tag = t === 'nobr' ? 'span' : t; const hiddenInline = /display:\s*none/.test(a.style || '');
  let cls = classes(n); if (hiddenInline && !/\bhidden\b/.test(cls)) cls = (cls + ' hidden').trim();
  let style = ''; if (t === 'img') {} if (opts.keepWidth && /width:\s*\d+px/.test(a.style || '') && (t === 'img' || t === 'table')) style = (a.style.match(/width:\s*\d+px/) || [''])[0];
  const open = `<${tag}${attr('id', KEEP_ID.test(a.id || '') ? a.id : null)}${attr('class', cls)}${attr('href', t === 'a' ? href(a.href) : null)}${attr('data-icon', a['data-icon'])}${attr('aria-label', a['aria-label'])}${attr('title', a.title)}${attr('alt', t === 'img' ? (a.alt || '') : null)}${attr('style', style)}${attr('for', a.for)}${attr('colspan', a.colspan)}${attr('role', a.role)}>`;
  if (VOID.has(t)) return open;
  return open + $(n).contents().toArray().map(c => gen(c, opts)).join('') + `</${tag}>`;
}
const genSel = (sel, opts) => $(sel).toArray().map(n => gen(n, opts)).join('');
/* ---------------------------------------------------------------- modules */
/* ---------------------------------------------------------------- modules (this page) */
function hero() {
  const h = $('#MainContent_contentheader'); const fig = h.find('> figure').get(0); const bar = h.find('> .bar').get(0);
  const style = (bar.attribs.style || '').replace(/\s+/g, ' ').trim();
  return `<section id="MainContent_contentheadertop" class="page-header-section extra-wide"><div class="center"><header id="MainContent_contentheader"><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig).replace('<div class="picture-credits">', '<div id="MainContent_headerPictureCredits" class="picture-credits">')}</figcaption></figure><div class="bar clear-fix"${attr('style', style)}><div class="container"><h1 id="MainContent_h1HeaderImagePage" class="title">${esc(txt(h.find('h1.title')))}</h1></div></div></header></div></section>`;
}
function meta() {
  const items = $('#MainContent_BreadCrumbList > li').toArray().map(li => { const a = $(li).children('a').get(0); const ic = $(a).children('span.icon').get(0); return `<li${attr('class', classes(li))}><a href="${esc(a.attribs.href)}">${ic ? `<span class="icon"${attr('data-icon', ic.attribs['data-icon'])}></span>` : ''}${esc(txt(a))}</a></li>`; }).join('');
  return `<section class="page-meta-section"><div class="center clear-fix"><div class="clear-fix"><div class="bread-crumb clear-fix"><ul id="MainContent_BreadCrumbList" class="clear-fix">${items}</ul></div></div></div></section>`;
}
function article() {
  const text = genSel('#PCS871 .columns-2-3 > section.text-modul');
  const box = $('#PCS871 .marginal-column > section.box.call-to-action').get(0);
  const boxHtml = `<section class="box call-to-action"><header><h3>${esc(txt($(box).find('> header h3')))}</h3></header><div class="service-container"></div><div class="link-container">${lb($(box).find('.link-container > a').get(0))}</div></section>`;
  return `<section id="PCS871" class="page-content-section"><div class="center clear-fix"><div class="columns-2-3">${text}</div><div class="columns-1-3 marginal-column float-right top">${boxHtml}</div></div></section>`;
}
const chrome = fs.readFileSync(path.join(ROOT, 'stardust/prototypes/index-proposed.html'), 'utf8');
const headerHtml = chrome.slice(chrome.indexOf('<header id="PageHeader">'), chrome.indexOf('<main id="Content">')).replace(/<li class="(level-1-1[^"]*)"(?=><a href="\/privatkunden">)/g, '<li class="$1 active"');
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
<link rel="stylesheet" href="css/${SLUG}.css">
</head>
<body class="site">
${headerHtml}<main id="Content">
<article>
${hero()}
${meta()}
${article()}
</article>
</main><div class="scroll-up" role="button" aria-label="Zum Seitenanfang" tabindex="0"></div>
${footerHtml}<script src="js/index.js"></script>
</body>
</html>
`;
const spaced = page.replace(/>(<(?:div|p|h[1-6]|ul|li|section|header|figure|figcaption|form|nav|label|select|option|table|thead|tbody|tr|span class="divider")\b)/g, '>\n$1');
fs.writeFileSync(path.join(ROOT, `stardust/prototypes/${SLUG}-proposed.html`), spaced);
console.log('written', spaced.length, 'bytes; missing assets:', [...missing].slice(0, 20), 'btn pngs:', fs.readdirSync(BTN).length);

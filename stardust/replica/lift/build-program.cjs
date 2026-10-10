// build-program.cjs — structural clone (Path A′) of the gated program archetype prototype (privatkunden-strom-stromtarife) for a program sibling: node build-program.cjs <slug>
// Derived from build-stromtarife.cjs (helpers + module builders sliced verbatim, query-not-copy: every string comes from the capture); hero() generalised from
// build-baustrom.cjs L51 (+ page-label / header-subline), meta() from build-static.cjs; module dispatch by the capture's section classes; chrome copied from the gated
// index prototype; <head>/CSS/JS includes identical to privatkunden-strom-stromtarife-proposed.html so the clone slots into the same encoder.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const cheerio = require('/app/node_modules/cheerio');
const ROOT = '/workspace/dc15da58'; const SLUG = process.argv[2]; if (!SLUG) { console.error('usage: node build-program.cjs <slug>'); process.exit(2); }
const ARCH = 'privatkunden-strom-stromtarife';
const $ = cheerio.load(fs.readFileSync(path.join(ROOT, `stardust/current/pages/${SLUG}.html`), 'utf8'));
const assetMap = JSON.parse(fs.readFileSync(path.join(ROOT, `stardust/replica/lift/${SLUG}-asset-map.json`), 'utf8'));
const HOST = 'https://www.thueringerenergie.de'; const missing = new Set(); const unknown = [];
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
function inline(el) { let out = ''; $(el).contents().each((i, n) => { if (n.type === 'text') { out += esc(n.data); return; } if (n.type !== 'tag') return; const t = n.tagName; if (t === 'input' || t === 'script' || t === 'style') return; if (t === 'br' || t === 'wbr') { out += `<${t}>`; return; } if (n.attribs && /display:\s*none/.test(n.attribs.style || '')) { out += `<span class="hidden">${inline(n)}</span>`; return; } if (t === 'a') { out += `<a${attr('href', href(n.attribs.href))}${attr('class', iconClass(n))}${attr('data-icon', n.attribs['data-icon'])}${aria(n)}>${inline(n)}</a>`; return; } if (t === 'nobr') { out += `<span class="nowrap">${inline(n)}</span>`; return; } if (['b', 'strong', 'i', 'em', 'u', 'sup', 'sub'].includes(t)) { out += `<${t}>${inline(n)}</${t}>`; return; } if (t === 'span' || t === 'label' || t === 'div' || t === 'p' || t === 'ul' || t === 'li' || t === 'h2' || t === 'h3' || t === 'h4' || t === 'img' || t === 'figure' || t === 'figcaption' || t === 'picture' || t === 'source' || t === 'section' || t === 'header' || t === 'option' || t === 'select') { out += clean(n); return; } out += inline(n); }); return out; }
function clean(n) { const t = n.tagName; if (t === 'img') return imgTag(n); if (t === 'picture') return pictureTag(n); if (t === 'source') return ''; const cls = (n.attribs.class || '').split(/\s+/).filter(c => c && !/^i\d+-\d+$/.test(c) && !/^(clear-fix|update-panel|aspNetDisabled|do-not-priorizes|uses-startUp-animations|initialized|not-smartphone-mode|-style|default-style|dynamic-list-detail-page-link)$/.test(c)).join(' '); const dataIcon = n.attribs['data-icon']; return `<${t}${attr('class', cls)}${attr('href', t === 'a' ? href(n.attribs.href) : null)}${attr('data-icon', dataIcon)}${aria(n)}>${inline(n)}</${t}>`; }
const lb = (el) => { if (!el) return ''; const a = el.attribs || {}; const cls = (a.class || '').split(/\s+/).filter(c => ['link-button', 'blue', 'enlarge', 'full-size', 'dynamic-size', 'hover-dark-blue', 'float-right'].includes(c)).join(' '); const bg = dataUrlFile(a.style); const m = (a.style || '').match(/width:\s*([\d.]+)px/); const style = [bg ? `background-image:url(${bg})` : '', m && !/full-size/.test(cls) ? `width:${m[1]}px` : ''].filter(Boolean).join(';'); const ic = $(el).children('span.icon').get(0); return `<a class="${cls}"${attr('href', href(a.href))}${attr('style', style)}${aria(el)}>${esc(txt(el))}${ic ? `<span class="${iconClass(ic)}"></span>` : ''}</a>`; };

/* ---------------------------------------------------------------- generic cleaner (build-stromtarife.cjs) */
const KEEP_ID = /^(PCS\d+|List\d+|Heading\d+|Header\d+|MainContent_(PCS\d+|CPMList\d+|Boxes\d+|FootnoteContainer\d+|contentheader(top)?|h1HeaderImagePage|h3HeaderImagePage|divHeaderImagePageLabel|headerPictureCredits|Faqs1_(FaqModul|ServiceRow|pnlFilter|pnlFilterSub|pnlSearch|tbSearch|lbSearch|ListContainer)|ul\d+|liste\d+)|TeaserModulContainer\d+)$/;
const DROP_CLS = /^(i\d+-\d+|update-panel|aspNetDisabled|do-not-priorizes|uses-startUp-animations|initialized|is-animating|manually-initialization|not-smartphone-mode|-style|default-style|is-initialized-for-redirect|has-external-link-icon|dynamic-list-detail-page-link|animated|previous-section-has-header-subline)$/;
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
  const tag = t; const hiddenInline = /display:\s*none/.test(a.style || '');
  let cls = classes(n); if (hiddenInline && !/\bhidden\b/.test(cls)) cls = (cls + ' hidden').trim();
  let style = ''; if (opts.keepWidth && /width:\s*\d+px/.test(a.style || '') && (t === 'img' || t === 'table')) style = (a.style.match(/width:\s*\d+px/) || [''])[0];
  const open = `<${tag}${attr('id', KEEP_ID.test(a.id || '') ? a.id : null)}${attr('class', cls)}${attr('href', t === 'a' ? href(a.href) : null)}${attr('data-icon', a['data-icon'])}${attr('aria-label', a['aria-label'])}${attr('title', a.title)}${attr('alt', t === 'img' ? (a.alt || '') : null)}${attr('style', style)}${attr('for', a.for)}${attr('colspan', a.colspan)}${attr('role', a.role)}>`;
  if (VOID.has(t)) return open;
  return open + $(n).contents().toArray().map(c => gen(c, opts)).join('') + `</${tag}>`;
}
const genSel = (sel, opts) => $(sel).toArray().map(n => gen(n, opts)).join('');

/* ---------------------------------------------------------------- modules (archetype markup; parametrised by section element) */
function hero(sec) { // build-baustrom.cjs hero() + the archetype's header subline + easie's page label; bar style only on the plain (no-subline) hero, as baustrom did
  const h = $(sec).find('#MainContent_contentheader'); const fig = h.find('> figure').get(0); const bar = h.find('> .bar').get(0);
  const style = /with-header-subline/.test(sec.attribs.class || '') ? '' : (bar.attribs.style || '').replace(/\s+/g, ' ').trim();
  const label = h.find('.bar .page-label').get(0); const h2 = h.find('.bar h2').get(0);
  return `<section id="MainContent_contentheadertop" class="${classes(sec)}"><div class="center"><header id="MainContent_contentheader"><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig).replace('<div class="picture-credits">', '<div id="MainContent_headerPictureCredits" class="picture-credits">')}</figcaption></figure><div class="bar clear-fix"${attr('style', style)}><div class="container">${label ? `<p id="MainContent_divHeaderImagePageLabel" class="page-label">${esc(txt(label))}</p>` : ''}<h1 id="MainContent_h1HeaderImagePage" class="title">${esc(txt(h.find('h1.title')))}</h1>${h2 ? `<h2 id="MainContent_h3HeaderImagePage">${esc(txt(h2))}</h2>` : ''}</div></div></header></div></section>`;
}
function meta() { // build-static.cjs
  const items = $('#MainContent_BreadCrumbList > li').toArray().map(li => { const a = $(li).children('a').get(0); const ic = $(a).children('span.icon').get(0); return `<li${attr('class', classes(li))}><a href="${esc(a.attribs.href || '#')}">${ic ? `<span class="icon"${attr('data-icon', ic.attribs['data-icon'])}></span>` : ''}${esc(txt(a))}</a></li>`; }).join('');
  return `<section class="page-meta-section"><div class="center clear-fix"><div class="clear-fix"><div class="bread-crumb clear-fix"><ul id="MainContent_BreadCrumbList" class="clear-fix">${items}</ul></div></div></div></section>`;
}
function availabilityCheck(vc) { // build-stromtarife.cjs availabilityCheck(): the archetype's verfuegbarkeitscheck markup (the encoder's static-tier input); filter link only when the capture has one
  const id = (vc.attribs.id.match(/Verfuegbarkeitscheck(\d+)/) || [])[1];
  const form = $(vc).find(`#MainContent_Verfuegbarkeitscheck${id}_Form`).get(0);
  const sr = txt($(form).find('p.screen-reader'));
  const plzLabel = txt($(form).find('.plz-city-container > label'));
  const filterEl = $(form).find('.filter-settings-open-button').first(); const filter = filterEl.length ? txt(filterEl) : '';
  const filterHtml = filter ? `<div class="settings-link-container"><ul class="linklist"><li><a class="bold filter-settings-open-button" href="#">${esc(filter)}</a></li></ul></div>` : '';
  const personsLabel = txt($(form).find('.consumption-selection-container > label'));
  const dots = $(form).find('.consumption-selection ul li').toArray().map(li => { const a = $(li).children('a').get(0); const n = txt(a); return `<li><a class="${/\bactive\b/.test(a.attribs.class) ? 'active' : 'inactive'}" href="javascript: void(0)" data-n="${n}"${aria(a)}><span data-n="${n}">${esc(n)}</span></a></li>`; }).join(''); const minusA = aria($(form).find('a.fa-minus').get(0)), plusA = aria($(form).find('a.fa-plus').get(0)); const receiver = $(form).find('a.consumption-change-event-receiver').get(0); const panelAria = aria($(vc).find('> .container > .update-panel').get(0));
  const kwhLabel = txt($(form).find('.float-right > label').first());
  const unit = txt($(form).find('.unity-field .flex-box label'));
  const calc = $(form).find('.calculate-button').get(0);
  const medium = (vc.attribs.class.match(/medium-(\w+)/) || [])[1] || '';
  const hiddenBlocks = $(vc).find('> .container > .update-panel > div.hidden').toArray().map(d => `<div class="hidden">${inline(d)}</div>`).join('') + $(vc).find('> .container > .working-visualization').toArray().map(d => `<div class="hidden working-visualization">${inline(d)}</div>`).join('');
  return `<section class="verfuegbarkeitscheck-modul form medium-${medium}"><div class="container"><div class="update-panel"${panelAria}><form action="" onsubmit="return false" class="left-content">
<p class="screen-reader">${esc(sr)}</p>
<div class="form-row">
<div class="address-fields form-fields"><div class="plz-city-container"><label for="plz-${id}">${esc(plzLabel)}</label><div class="form-field auto-complete-field"><input type="text" id="plz-${id}" class="plz-city-field" autocomplete="off" placeholder="PLZ"><label class="extender" for="plz-${id}"><i class="fa fa-circle-o-notch fa-spin"></i></label></div></div>${filterHtml}</div>
<div class="consumption-fields"><div class="consumption-selection-container"><label>${esc(personsLabel)}</label><div class="consumption-selection items-5"><div class="line"></div><a class="fa fa-minus" href="javascript: void(0)"${minusA}></a><ul>${dots}</ul><a class="fa fa-plus" href="javascript: void(0)"${plusA}></a></div></div>
<div class="consumption-input"><label for="kwh-${id}">${esc(kwhLabel)}</label>${receiver ? `<a class="consumption-change-event-receiver hidden" href="#">${esc(txt(receiver))}</a>` : ''}<div class="form-field required-field unity-field"><span class="flex-box"><input type="text" id="kwh-${id}" class="consumption-field consumption-ht" maxlength="8" placeholder="Jahresverbrauch"><label for="kwh-${id}">${esc(unit)}</label></span></div>${filterHtml}<div class="form-commands-container active">${lb(calc)}</div></div></div>
</div></form></div>${hiddenBlocks}</div></section>`;
}
function tariff(sec) { // build-stromtarife.cjs tariff() by section
  const secId = sec.attribs.id; const li = $(sec).find('.tab-control > ul > li').get(0); const vc = $(li).find('section.verfuegbarkeitscheck-modul').get(0);
  const info = $(li).find('p.info-message-for-availability-check').get(0); const infoHtml = info ? `<section class="info-section">${gen(info.parent).replace(/^<[^>]+>/, '').replace(/<\/[a-z]+>$/, '')}</section>` : '';
  const a = $(li).children('a.shadow').get(0);
  const seals = $(sec).find('.siegel-row ul > li').length;
  return `<section id="${secId}" class="${classes(sec)}"><div class="center clear-fix"><div class="tab-control icon-text-align-horizontal columns-1 static-integration"><ul class="contains-cards tabs-1"><li class="complex-content type-card active">${gen(a).replace(/^<a /, '<a class="shadow hidden" ').replace(/ class="[^"]*"(?= href)/, '')}<div class="container shadow">${availabilityCheck(vc)}${infoHtml}</div></li></ul></div><div class="columns-1 siegel-row"><div class="column-1"><ul>${'<li></li>'.repeat(seals)}</ul></div></div></div></section>`;
}
function productTeaser(sec) { // build-stromtarife.cjs productTeaser() + optional section header (easie)
  const secId = sec.attribs.id; const ul = $(sec).find('> .center > ul').get(0); const hd = $(sec).find('> .center > header').get(0);
  const hdHtml = hd ? `<header${attr('id', KEEP_ID.test(hd.attribs.id || '') ? hd.attribs.id : null)}${attr('class', classes(hd))}>${$(hd).children().toArray().map(n => gen(n)).join('')}</header>` : '';
  const items = $(ul).children('li').toArray().map(li => { const fig = $(li).find('> div > figure').get(0); const c = $(fig).find('> figcaption > .container').get(0); const cr = $(fig).find('> figcaption > .picture-credits').get(0);
    const crHtml = cr ? `<div class="${classes(cr)}"><span class="fa fa-copyright"></span> <span>${esc(txt($(cr).find('span').last()))}</span></div>` : '';
    return `<li id="${li.attribs.id}" class="${classes(li)}"><div><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${crHtml}<div class="container">${$(c).contents().toArray().map(n => gen(n)).join('')}</div></figcaption></figure></div></li>`; }).join('\n');
  return `<section id="${secId}" class="${classes(sec)}"><div class="center">${hdHtml}<ul id="${ul.attribs.id}" class="${classes(ul)}">${items}</ul></div></section>`;
}
function channel(sec) { const secId = sec.attribs.id; const n = $(sec).find('.boxes > li').length; const bullets = Array.from({ length: n }, (_, i) => `<li${i === 0 ? ' class="active"' : ''}><a href="#" aria-label="Zu dieser Folie"><span class="bullet"></span></a></li>`).join('');
  const html = genSel(`#${secId} > .center > section.modul-content`).replace('<a class="arrow-left inactive" href="#">', '<a class="arrow-left inactive" href="#" aria-label="Vorherige Folie">').replace('<a class="arrow-right" href="#">', '<a class="arrow-right" href="#" aria-label="Nächste Folie">').replace('<ul class="hidden"></ul>', `<ul>${bullets}</ul>`);
  return `<section id="${secId}" class="${classes(sec)}"><div class="center">${html}</div></section>`; }
function teaserModul(secEl) {
  const secId = secEl.attribs.id; const sec = $(secEl).find('> .center > section').get(0); const eye = $(secEl).find('> .center > .eye-catcher-container').get(0);
  return `<section id="${secId}" class="${classes(secEl)}"><div class="center"><section><header><h3>${esc(txt($(sec).find('header h3')))}</h3></header><div id="${$(sec).find('> .container').attr('id')}" class="container"><div class="spacer"></div><p class="description">${inline($(sec).find('p.description').get(0))}</p><div class="commands">${lb($(sec).find('.commands a').get(0))}</div></div></section>${eye ? `<div class="eye-catcher-container"><figure>${imgTag($(eye).find('img').get(0))}</figure></div>` : ''}</div></section>`;
}
function textModul(sec) { return `<section${attr('id', sec.attribs.id)} class="${classes(sec)}"><div class="center clear-fix"><div class="columns-1">${$(sec).find('> .center > .columns-1 > section.text-modul').toArray().map(n => gen(n, { keepWidth: true })).join('')}</div></div></section>`; }
function steps(sec) {
  const mod = $(sec).find('section.step-by-step-123-modul').get(0);
  const h3 = txt($(mod).find('> header h3'));
  const parts = $(mod).find('> .container > *').toArray().map(el => { if (/step/.test(el.attribs.class || '') && !/connector/.test(el.attribs.class || '')) { return `<section class="step"><div class="symbol"><span>${esc(txt($(el).find('.symbol span')))}</span></div><div class="content"><header><h4>${esc(txt($(el).find('header h4')))}</h4></header><p>${inline($(el).find('> .content > p').get(0))}</p></div><div class="connector-vertical"></div></section>`; } return `<div class="connector-horizontal"><div class="bow"><div class="cover"></div></div></div>`; }).join('');
  return `<section class="page-content-section"><div class="center"><section class="step-by-step-123-modul clear-fix center-content"><header class="extra-margin-bottom"><h3>${esc(h3)}</h3></header><div class="container">${parts}</div></section></div></section>`;
}
function faq(sec) { // build-stromtarife.cjs faq(); column + header classes from the capture (ersatzversorgung: columns-2-3 + plain header + empty marginal column)
  const col = $(sec).find('> .center > div').first().get(0); const hdr = $(sec).find('section.default > header').first(); const h2 = txt(hdr.find('h2')); const hdrCls = classes(hdr.get(0));
  const marginal = $(sec).find('> .center > .marginal-column').get(0);
  const yt = genSel('#MainContent_Faqs1_YouTubeVideoActivator1_upYouTubeVideoActivator'); const filters = genSel('#MainContent_Faqs1_ServiceRow'); const list = genSel('#MainContent_Faqs1_ListContainer');
  return `<section class="${classes(sec)}"><div class="center clear-fix"><div class="${classes(col)}"><section class="default"><header${attr('class', hdrCls)}><h2>${esc(h2)}</h2>${/widget-header/.test(hdrCls) ? '<span class="divider"></span>' : ''}</header><div id="MainContent_Faqs1_FaqModul" class="module-faq filter_drop-down-list_modul">${yt}${filters}${list}</div></section></div>${marginal ? `<div class="${classes(marginal)}"></div>` : ''}</div></section>`;
}

/* ---------------------------------------------------------------- dispatch by the capture's section classes */
const parts = [];
$('#Content > article > section, #Content > section').each((i, el) => {
  const c = el.attribs.class || ''; const $el = $(el);
  if (/\bpage-header-section\b/.test(c)) parts.push(hero(el));
  else if (/\bpage-meta-section\b/.test(c)) parts.push(meta());
  else if (/\bdock-to-previous-section\b/.test(c) && $el.find('.tab-control').length) parts.push(tariff(el));
  else if (/\bproduct-teasers-modul\b/.test(c)) parts.push(productTeaser(el));
  else if (/\bchannel-products-modul\b/.test(c)) parts.push(channel(el));
  else if (/\bteaser-modul\b/.test(c)) parts.push(teaserModul(el));
  else if ($el.find('> .center > section.step-by-step-123-modul').length) parts.push(steps(el));
  else if ($el.find('.module-faq').length) parts.push(faq(el));
  else if ($el.find('> .center > .columns-1 > section.text-modul').length) parts.push(textModul(el));
  else { unknown.push(c || '(no class)'); parts.push(gen(el)); }
});
const chrome = fs.readFileSync(path.join(ROOT, 'stardust/prototypes/index-proposed.html'), 'utf8');
const headerHtml = chrome.slice(chrome.indexOf('<header id="PageHeader">'), chrome.indexOf('<main id="Content">')).replace(/<li class="(level-1-1[^"]*)"(?=><a href="\/privatkunden">)/g, '<li class="$1 active"'); // nav-active: live marks the current channel
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
<link rel="stylesheet" href="css/${ARCH}.css">
</head>
<body class="site">
${headerHtml}<main id="Content">
${parts.join('\n')}
<div class="scroll-up" role="button" aria-label="Zum Seitenanfang" tabindex="0"></div></main>
${footerHtml}<script src="js/${ARCH}.js"></script>
</body>
</html>
`;
const spaced = page.replace(/>(<(?:div|p|h[1-6]|ul|li|section|header|figure|figcaption|form|nav|label|select|option|table|thead|tbody|tr|span class="divider")\b)/g, '>\n$1');
fs.writeFileSync(path.join(ROOT, `stardust/prototypes/${SLUG}-proposed.html`), spaced.replace(/<\/span>\n<h3/g, '</span><h3'));
console.log('written', spaced.length, 'bytes; sections:', parts.length, '; unknown sections:', unknown, '; missing assets:', [...missing].slice(0, 20), 'btn pngs:', fs.readdirSync(BTN).length);

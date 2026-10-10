// build-stromtarife.cjs — assemble stardust/prototypes/privatkunden-strom-stromtarife-proposed.html from the captured page (query helper, not a DOM copier):
// shared chrome (#PageHeader/#PageFooter/#Widgets/.chat-teaser) is copied verbatim from the gated index prototype; shared module builders come from build-index.cjs (id-parametrised); new modules go through a permissive cleaner.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const cheerio = require('/app/node_modules/cheerio');
const ROOT = '/workspace/dc15da58'; const SLUG = 'privatkunden-strom-stromtarife';
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
function availabilityCheck(vc) {
  const id = (vc.attribs.id.match(/Verfuegbarkeitscheck(\d+)/) || [])[1];
  const form = $(vc).find(`#MainContent_Verfuegbarkeitscheck${id}_Form`).get(0);
  const sr = txt($(form).find('p.screen-reader'));
  const plzLabel = txt($(form).find('.plz-city-container > label'));
  const filter = txt($(form).find('.filter-settings-open-button').first());
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
<div class="address-fields form-fields"><div class="plz-city-container"><label for="plz-${id}">${esc(plzLabel)}</label><div class="form-field auto-complete-field"><input type="text" id="plz-${id}" class="plz-city-field" autocomplete="off" placeholder="PLZ"><label class="extender" for="plz-${id}"><i class="fa fa-circle-o-notch fa-spin"></i></label></div></div><div class="settings-link-container"><ul class="linklist"><li><a class="bold filter-settings-open-button" href="#">${esc(filter)}</a></li></ul></div></div>
<div class="consumption-fields"><div class="consumption-selection-container"><label>${esc(personsLabel)}</label><div class="consumption-selection items-5"><div class="line"></div><a class="fa fa-minus" href="javascript: void(0)"${minusA}></a><ul>${dots}</ul><a class="fa fa-plus" href="javascript: void(0)"${plusA}></a></div></div>
<div class="consumption-input"><label for="kwh-${id}">${esc(kwhLabel)}</label>${receiver ? `<a class="consumption-change-event-receiver hidden" href="#">${esc(txt(receiver))}</a>` : ''}<div class="form-field required-field unity-field"><span class="flex-box"><input type="text" id="kwh-${id}" class="consumption-field consumption-ht" maxlength="8" placeholder="Jahresverbrauch"><label for="kwh-${id}">${esc(unit)}</label></span></div><div class="settings-link-container"><ul class="linklist"><li><a class="bold filter-settings-open-button" href="#">${esc(filter)}</a></li></ul></div><div class="form-commands-container active">${lb(calc)}</div></div></div>
</div></form></div>${hiddenBlocks}</div></section>`;
}
function energyTab(container) {
  const items = $(container).find('ul.teaser > li').toArray().map(li => { const icon = $(li).find('header .icon').get(0); return `<li><section><header><span class="icon"${attr('data-icon', icon && icon.attribs['data-icon'])}></span><h3>${esc(txt($(li).find('h3')))}</h3></header><div class="container"><p>${inline($(li).find('.container p').get(0))}</p></div><div class="commands">${lb($(li).find('.commands a').get(0))}</div></section></li>`; }).join('');
  const more = $(container).find('> section > .container > .commands > a').get(0);
  return `<section><div class="container"><ul class="teaser tab-teaser-list center-content">${items}</ul><div class="commands tab-teaser-commands"><a${attr('href', href(more.attribs.href))}>${esc(txt(more))}</a></div></div></section>`;
}

/* ---------------------------------------------------------------- content sections */
function keyFacts() {
  const h2 = txt($('#PCS15395 header h2'));
  const items = $('#List15395 > li').toArray().map(li => { const icon = $(li).find('> section > .icon').get(0); return `<li><section class="icon-rounded-border icon-inverted"><span class="icon"${attr('data-icon', icon.attribs['data-icon'])}></span><div class="container"><header><h3>${esc(txt($(li).find('h3')))}</h3></header><p>${inline($(li).find('p').get(0))}</p></div></section></li>`; }).join('');
  return `<section id="PCS15395" class="page-content-section"><div class="center clear-fix"><div class="columns-1"><section class="default text-modul"><header class="center-content"><h2>${esc(h2)}</h2></header><div class="keyFacts-modul"><ul id="List15395" class="teaser columns-3">${items}</ul></div></section></div></div></section>`;
}
function steps() {
  const mod = $('#Content section.step-by-step-123-modul').get(0);
  const h3 = txt($(mod).find('> header h3'));
  const parts = $(mod).find('> .container > *').toArray().map(el => { if (/step/.test(el.attribs.class || '') && !/connector/.test(el.attribs.class || '')) { return `<section class="step"><div class="symbol"><span>${esc(txt($(el).find('.symbol span')))}</span></div><div class="content"><header><h4>${esc(txt($(el).find('header h4')))}</h4></header><p>${inline($(el).find('> .content > p').get(0))}</p></div><div class="connector-vertical"></div></section>`; } return `<div class="connector-horizontal"><div class="bow"><div class="cover"></div></div></div>`; }).join('');
  return `<section class="page-content-section"><div class="center"><section class="step-by-step-123-modul clear-fix center-content"><header class="extra-margin-bottom"><h3>${esc(h3)}</h3></header><div class="container">${parts}</div></section></div></section>`;
}
function widgetHeader(sec) { return `<header class="widget-header"><h3>${esc(txt($(sec).find('> header h3')))}</h3><span class="divider"></span></header>`; }
function iconList(il) { if (!il) return ''; return `<div class="icon-list"><ul>${$(il).find('> ul > li').toArray().map(li => `<li class="${(li.attribs.class || '').replace('clear-fix', '').trim()}">${inline(li)}</li>`).join('')}</ul></div>`; }
function linkList(ll) { if (!ll) return ''; return `<div class="link-list"><ul>${$(ll).find('> ul > li').toArray().map(li => `<li>${inline(li)}</li>`).join('')}</ul></div>`; }
function serviceBoxes() {
  const boxes = $('#MainContent_Boxes15425 > li').toArray().map(li => {
    const secs = $(li).children('section').toArray().map(sec => {
      if ($(sec).find('.call-back').length) return `<section>${widgetHeader(sec)}<div class="container">${callBack($(sec).find('.call-back').get(0))}</div></section>`;
      const fig = $(sec).children('figure').get(0);
      const p = $(sec).find('> .container > p.service-text').get(0);
      return `<section${attr('class', /netzstoerung/.test(sec.attribs.class || '') ? 'netzstoerung' : null)}>${widgetHeader(sec)}${fig ? `<figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig)}</figcaption></figure>` : ''}<div class="container">${p ? `<p class="service-text">${inline(p)}</p>` : ''}${iconList($(sec).find('> .container > .icon-list').get(0))}${linkList($(sec).find('> .container > .link-list').get(0))}</div></section>`;
    }).join('');
    return `<li class="box${/multiple-sections/.test(li.attribs.class || '') ? ' multiple-sections' : ''}">${secs}</li>`;
  }).join('\n');
  return `<section id="PCS15424" class="page-content-section alternative-background-color"><div class="center clear-fix"><section id="PCS15425" class="service-boxes campaign"><ul id="MainContent_Boxes15425" class="boxes columns-3 list">${boxes}</ul></section></div></section>`;
}
function callBack(cb) {
  const p1 = $(cb).find('p.no-margin').get(0), p2 = $(cb).find('p.spc').get(0);
  const labels = $(cb).find('section label').toArray().filter(l => !$(l).closest('.checkBox').length).map(l => txt(l));
  const sel = $(cb).find('select').get(0); const opts = $(sel).find('option').toArray().map(o => `<option${attr('value', o.attribs.value)}>${esc(txt(o))}</option>`).join('');
  const cbLabel = $(cb).find('.checkBox label').get(0);
  const send = $(cb).find('a.link-button').get(0);
  return `<div class="update-panel"${aria($(cb).closest('.update-panel').get(0))}><div class="call-back form"><form action="" onsubmit="return false"><p class="no-margin">${inline(p1)}</p><p class="spc">${inline(p2)}</p><section class="clear-fix">
<div class="name-wrapper clear-fix"><label for="cb-first">${esc(labels[0])}</label><input type="text" id="cb-first" class="float-left" maxlength="255" placeholder="Ihr Vorname" aria-label="${esc(labels[0])}"><label for="cb-last">${esc(labels[1])}</label><input type="text" id="cb-last" class="float-right" maxlength="255" placeholder="Ihr Nachname" aria-label="${esc(labels[1])}"></div>
<label for="cb-date">${esc(labels[2])}</label><span class="flex-box with-extender"><input type="text" id="cb-date" class="calendar-extender-input" autocomplete="off" maxlength="10" placeholder="Ihr Wunschrückrufdatum"${aria($(cb).find('input.calendar-extender-input').get(0))}><a class="extender icon icon-calendar calendar-extender-button" href="javascript: void(0);"${aria($(cb).find('a.extender').get(0))}></a></span>
<label for="cb-phone">${esc(labels[3])}</label><input type="text" id="cb-phone" maxlength="255" placeholder="Ihre Telefonnummer" aria-label="${esc(labels[3])}">
<label for="cb-topic">${esc(labels[4])}</label><select id="cb-topic" class="watermarked" aria-label="${esc(labels[4])}">${opts}</select>
<div class="clear-fix"><div><div class="checkBox block opt-in check-box-agb"><input type="checkbox" id="cb-agb"><label for="cb-agb">${inline(cbLabel)}</label></div></div></div>
${lb(send)}</section></form></div></div>`;
}
/* ---------------------------------------------------------------- generic cleaner for this page's new modules */
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
function hero() {
  const h = $('#MainContent_contentheader'); const fig = h.find('> figure').get(0);
  return `<section id="MainContent_contentheadertop" class="page-header-section extra-wide with-header-subline has-docked-section"><div class="center"><header id="MainContent_contentheader"><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig).replace('<div class="picture-credits">', '<div id="MainContent_headerPictureCredits" class="picture-credits">')}</figcaption></figure><div class="bar clear-fix"><div class="container"><h1 id="MainContent_h1HeaderImagePage" class="title">${esc(txt(h.find('h1')))}</h1><h2 id="MainContent_h3HeaderImagePage">${esc(txt(h.find('.bar h2')))}</h2></div></div></header></div></section>`;
}
function tariff() {
  const sec = $('#MainContent_PCS16073'); const li = sec.find('.tab-control > ul > li').get(0); const vc = $(li).find('section.verfuegbarkeitscheck-modul').get(0);
  const info = $(li).find('p.info-message-for-availability-check').get(0); const infoHtml = info ? `<section class="info-section">${gen(info.parent).replace(/^<[^>]+>/, '').replace(/<\/[a-z]+>$/, '')}</section>` : '';
  const a = $(li).children('a.shadow').get(0);
  const seals = sec.find('.siegel-row ul > li').length;
  return `<section id="MainContent_PCS16073" class="page-content-section modul-section dock-to-previous-section alternative-background-color"><div class="center clear-fix"><div class="tab-control icon-text-align-horizontal columns-1 static-integration"><ul class="contains-cards tabs-1"><li class="complex-content type-card active">${gen(a).replace(/^<a /, '<a class="shadow hidden" ').replace(/ class="[^"]*"(?= href)/, '')}<div class="container shadow">${availabilityCheck(vc)}${infoHtml}</div></li></ul></div><div class="columns-1 siegel-row"><div class="column-1"><ul>${'<li></li>'.repeat(seals)}</ul></div></div></div></section>`;
}
function productTeaser(secId) {
  const sec = $('#' + secId); const ul = sec.find('> .center > ul').get(0);
  const items = $(ul).children('li').toArray().map(li => { const fig = $(li).find('> div > figure').get(0); const c = $(fig).find('> figcaption > .container').get(0); const cr = $(fig).find('> figcaption > .picture-credits').get(0);
    const crHtml = cr ? `<div class="${classes(cr)}"><span class="fa fa-copyright"></span> <span>${esc(txt($(cr).find('span').last()))}</span></div>` : '';
    return `<li id="${li.attribs.id}" class="${classes(li)}"><div><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${crHtml}<div class="container">${$(c).contents().toArray().map(n => gen(n)).join('')}</div></figcaption></figure></div></li>`; }).join('\n');
  return `<section id="${secId}" class="${classes(sec.get(0))}"><div class="center"><ul id="${ul.attribs.id}" class="${classes(ul)}">${items}</ul></div></section>`;
}
function channel(secId) { const sec = $('#' + secId).get(0); const n = $(sec).find('.boxes > li').length; const bullets = Array.from({ length: n }, (_, i) => `<li${i === 0 ? ' class="active"' : ''}><a href="#" aria-label="Zu dieser Folie"><span class="bullet"></span></a></li>`).join(''); // live JS builds the mobile slider controls at runtime (arrows + one bullet per card)
  const html = genSel(`#${secId} > .center > section.modul-content`).replace('<a class="arrow-left inactive" href="#">', '<a class="arrow-left inactive" href="#" aria-label="Vorherige Folie">').replace('<a class="arrow-right" href="#">', '<a class="arrow-right" href="#" aria-label="Nächste Folie">').replace('<ul class="hidden"></ul>', `<ul>${bullets}</ul>`);
  return `<section id="${secId}" class="${classes(sec)}"><div class="center">${html}</div></section>`; }
function teaserModul(secId) {
  const sec = $(`#${secId} > .center > section`).get(0); const eye = $(`#${secId} > .center > .eye-catcher-container`).get(0);
  return `<section id="${secId}" class="${classes($('#' + secId).get(0))}"><div class="center"><section><header><h3>${esc(txt($(sec).find('header h3')))}</h3></header><div id="${$(sec).find('> .container').attr('id')}" class="container"><div class="spacer"></div><p class="description">${inline($(sec).find('p.description').get(0))}</p><div class="commands">${lb($(sec).find('.commands a').get(0))}</div></div></section>${eye ? `<div class="eye-catcher-container"><figure>${imgTag($(eye).find('img').get(0))}</figure></div>` : ''}</div></section>`;
}
function textModul(secId) { const sec = $('#' + secId).get(0); return `<section id="${secId}" class="${classes(sec)}"><div class="center clear-fix"><div class="columns-1">${genSel(`#${secId} .columns-1 > section.text-modul`, { keepWidth: true })}</div></div></section>`; }
function faq() {
  const sec = $('#MainContent_Faqs1_FaqModul').closest('section.page-content-section').get(0); const h2 = txt($(sec).find('header.widget-header h2'));
  const mod = $('#MainContent_Faqs1_FaqModul');
  const yt = genSel('#MainContent_Faqs1_YouTubeVideoActivator1_upYouTubeVideoActivator'); const filters = genSel('#MainContent_Faqs1_ServiceRow'); const list = genSel('#MainContent_Faqs1_ListContainer');
  return `<section class="page-content-section"><div class="center clear-fix"><div class="columns-1 float-left"><section class="default"><header class="widget-header"><h2>${esc(h2)}</h2><span class="divider"></span></header><div id="MainContent_Faqs1_FaqModul" class="module-faq filter_drop-down-list_modul">${yt}${filters}${list}</div></section></div></div></section>`;
}
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
<link rel="stylesheet" href="css/${SLUG}.css">
</head>
<body class="site">
${headerHtml}<main id="Content">
${hero()}
${tariff()}
${productTeaser('MainContent_PCS26438')}
${keyFacts()}
${channel('PCS15997')}
${teaserModul('MainContent_PCS16420')}
${channel('PCS15996')}
${productTeaser('MainContent_PCS21931')}
${productTeaser('MainContent_PCS23137')}
${productTeaser('MainContent_PCS16169')}
${steps()}
${teaserModul('MainContent_PCS15963')}
${productTeaser('MainContent_PCS15749')}
${textModul('PCS16174')}
${textModul('PCS16173')}
${faq()}
${serviceBoxes().replace('<section id="PCS15425" class="service-boxes campaign">', `<section id="PCS15425" class="service-boxes campaign"><header class="center-content widget-header"><h2>${esc(txt($('#PCS15425 > header h2')))}</h2><span class="divider"></span></header>`)}
<div class="scroll-up" role="button" aria-label="Zum Seitenanfang" tabindex="0"></main>
${footerHtml}<script src="js/${SLUG}.js"></script>
</body>
</html>
`;
const spaced = page.replace(/>(<(?:div|p|h[1-6]|ul|li|section|header|figure|figcaption|form|nav|label|select|option|table|thead|tbody|tr|span class="divider")\b)/g, '>\n$1');
fs.writeFileSync(path.join(ROOT, `stardust/prototypes/${SLUG}-proposed.html`), spaced.replace(/<\/span>\n<h3/g, '</span><h3'));
console.log('written', spaced.length, 'bytes; missing assets:', [...missing].slice(0, 20), 'btn pngs:', fs.readdirSync(BTN).length);

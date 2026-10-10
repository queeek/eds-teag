// build-index.cjs — authors stardust/prototypes/index-proposed.html from the captured content
// (stardust/current/pages/index.html + index.json). Content (text, hrefs, alt, option lists, image
// renditions) is read from the capture; the markup is authored here through templates with the
// replica's own class vocabulary. Hidden/non-visual containers (mega-menu, tooltips, hidden tab
// panels) are re-emitted through a whitelist serializer (tag + href/alt/src/data-icon only) so the
// content-diff inventories match DOM granularity without ASP.NET ids/inline styles.
const fs = require('fs'); const path = require('path'); const crypto = require('crypto');
const cheerio = require('/app/node_modules/cheerio');
const ROOT = '/workspace/dc15da58';
const $ = cheerio.load(fs.readFileSync(path.join(ROOT, 'stardust/current/pages/index.html'), 'utf8'));
const assetMap = JSON.parse(fs.readFileSync(path.join(ROOT, 'stardust/replica/lift/index-asset-map.json'), 'utf8'));
const dataUrls = JSON.parse(fs.readFileSync(path.join(ROOT, 'stardust/replica/lift/data-urls.json'), 'utf8'));
const HOST = 'https://www.thueringerenergie.de';
const missing = new Set();

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attr = (k, v) => v == null || v === '' ? '' : ` ${k}="${esc(v)}"`;
const txt = el => $(el).text().replace(/\s+/g, ' ').trim();
const local = u => { if (!u) return ''; u = u.trim().split(/\s+/)[0]; const p = u.startsWith(HOST) ? u.slice(HOST.length) : u; if (assetMap[p]) return assetMap[p]; if (!/^data:/.test(u)) missing.add(u); return ''; };
const aria = el => el && el.attribs ? attr('aria-label', el.attribs['aria-label']) + attr('title', el.attribs.title) : '';
const href = h => { if (!h) return '#'; if (/^javascript:(var options|__doPostBack)/.test(h)) return '#'; return h; };
const dataUrlFile = s => { const m = String(s || '').match(/url\((["']?)(data:[^)"']+)\1\)/); if (!m) return ''; const k = 'd' + crypto.createHash('md5').update(m[2]).digest('hex').slice(0, 8); return dataUrls[k] ? `assets/index/btn/${k}.png` : ''; };

// srcset → local 1x candidate list (gate runs at DPR 1; only the 1x renditions are harvested)
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
  const a = el.attribs || {}; const cls = (a.class || '').split(/\s+/).filter(c => ['link-button', 'blue', 'enlarge', 'full-size', 'dynamic-size', 'hover-dark-blue', 'float-right'].includes(c)).join(' '); const bg = dataUrlFile(a.style); const m = (a.style || '').match(/width:\s*([\d.]+)px/); const style = [bg ? `background-image:url(${bg})` : '', m && !/full-size/.test(cls) ? `width:${m[1]}px` : ''].filter(Boolean).join(';'); return `<a class="${cls}"${attr('href', href(a.href))}${attr('style', style)}${aria(el)}>${esc(txt(el))}</a>`; };

/* ---------------------------------------------------------------- header */
function header() {
  const logo = $('#PageHeader .section-1 .logo img').get(0);
  const quick = $('#divMenuContainer .menu > ul > li').toArray().map(li => { const a = $(li).children('a').get(0); const icon = $(a).children('.icon').get(0); const title = $(a).children('.title'); return `<li${attr('class', (li.attribs.class || '').includes('smartphone-mode') ? 'smartphone-mode' : null)}><a${attr('href', href(a.attribs.href))}${aria(a)}><span class="icon"${attr('data-icon', icon && icon.attribs['data-icon'])}></span>${title.length ? `<span class="title">${esc(txt(title))}</span>` : ''}</a></li>`; }).join('');
  const searchIcon = $('#lbSearch').attr('data-icon'); const searchA = aria($('#lbSearch').get(0)); const contrastA = aria($('.contrast-modus-switch a.icon').get(0));
  const nav = $('#DesktopMenu > ul.level-1 > li').toArray().map(li => { const cls = (li.attribs.class || '').trim(); if (/nav-button/.test(cls)) { const widgets = $(li).find('ul.mobile-widgets > li').toArray().map(w => `<li class="${(w.attribs.class || '').trim()}"><a href="javascript:void(0)"><span class="${iconClass($(w).find('.icon').get(0))}"></span><span class="title">${esc(txt($(w).find('.title')))}</span></a></li>`).join(''); return `<li class="nav-button"><a href="javascript:void(0)"${aria($(li).children('a').get(0))}><span class="icon icon-icons-menu"></span><span class="icon icon-icons-close-menu"></span></a><div class="mobile-nav-container" hidden><ul class="mobile-nav"></ul><ul class="mobile-widgets widgets-2">${widgets}</ul></div></li>`; } const a = $(li).children('a').get(0); const panel = $(li).children('div').get(0); return `<li class="${cls}"><a${attr('href', href(a.attribs.href))}>${esc(txt(a))}</a>${panel ? `<div class="mega ${(panel.attribs.class || '').replace(/-style\b|default-style/g, '').trim()}" hidden>${inline(panel)}</div>` : ''}</li>`; }).join('\n');
  const combinedLogo = $('.combined-header li.logo img').get(0);
  const combined = $('.combined-header ul.level-1 > li.nav-link').toArray().map(li => { const a = $(li).children('a').get(0); return `<li class="${(li.attribs.class || '').trim()}"><a${attr('href', href(a.attribs.href))}>${esc(txt(a))}</a></li>`; }).join('');
  return `<header id="PageHeader">
<a class="skip-link" href="#Content" aria-label="Weiter zum Inhalt">Weiter zum Inhalt</a>
<div class="section-1"><div class="center">
<div class="logo"><a href="/default">${imgTag(logo)}</a></div>
<div class="header-tools">
<ul class="quick-links">${quick}</ul>
<div class="search-panel" aria-label="Suchformular"><div class="search"><input type="text" id="tbSearch" aria-label="Suche"><a class="icon" data-icon="${esc(searchIcon)}" href="#"${searchA}></a></div></div>
<div class="header-buttons"><div class="contrast-switch"><span class="visualization"><a class="unchecked icon icon-Kontrastmodus" href="javascript:void(0)"${contrastA}></a><span class="checked icon icon-Kontrastmodus"></span></span><label for="contrast-mode">Kontrast</label><span class="hidden"><input type="checkbox" id="contrast-mode"></span></div></div>
</div></div></div>
<div class="section-2 seperated-header"><div class="center"><nav aria-label="Hauptnavigation"><div id="DesktopMenu" class="menu mega-style"><ul class="level-1">
${nav}
</ul></div></nav></div></div>
<div class="section-2 combined-header"><div class="center"><nav><div class="menu mega-style"><ul class="level-1"><li class="logo"><a href="/">${imgTag(combinedLogo)}</a></li>${combined}<li class="search-container"><div class="search collapsed" aria-label="Suchformular"><input type="text" id="tbSearch2" aria-label="Suche"><a class="icon" data-icon="${esc(searchIcon)}" href="#"${searchA}></a></div></li></ul></div></nav></div></div>
</header>`;
}

/* ---------------------------------------------------------------- hero + tabs */
function hero() {
  const fig = $('#Content section.slider-section .slider > ul > li figure').get(0);
  const bar = $(fig).find('.bar a').get(0);
  const slide = `<li><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig)}</figcaption><div class="bar"><a${attr('href', href(bar.attribs.href))}><h2 class="title" id="slideHeadline26857">${esc(txt($(bar).find('.title')))}</h2>\n<div class="description">${inline($(bar).find('.description').get(0))}</div></a></div></figure></li>`;
  const C = s => $('#Content section.slider-section .controls ' + s).get(0); const controls = `<div class="controls slider-pager auto-switch paused"${aria($('#Content section.slider-section .controls').get(0))}><div class="group"><a class="icon icon-teag-arrow-left-pos arrow-left" href="javascript:void(0)"${aria(C('a.arrow-left'))}></a><ul><li class="active"><a class="bullet" href="javascript:void(0)"${aria(C('a.bullet'))}></a></li></ul><a class="icon icon-teag-arrow-right-pos arrow-right" href="javascript:void(0)"${aria(C('a.arrow-right'))}></a></div><div class="group"><a class="icon icon-pause" href="javascript:void(0)"${aria(C('a.icon-pause'))}></a><a class="icon icon-play" href="javascript:void(0)"${aria(C('a.icon-play'))}></a></div></div>`;
  return `<section class="slider-section extra-wide alternative-background-color">
<div class="center full-size"><div class="slider"><ul>${slide}</ul>${controls}</div></div>
<div class="center tab-wrap">${tabControl()}</div>
</section>`;
}
function tabControl() {
  const lis = $('#MainContent_liste16185 > li').toArray();
  const items = lis.map((li, i) => { const a = $(li).children('a.shadow').get(0); const label = $(a).find('.label'); const icon = label.find('.icon').get(0); const text = txt(label.find('.link-text')); const active = /\bactive\b/.test(li.attribs.class || ''); const cls = ['type-card', active ? 'active' : '', /previous-is-active/.test(li.attribs.class || '') ? 'previous-is-active' : ''].filter(Boolean).join(' '); let panel; const vc = $(li).find('section.verfuegbarkeitscheck-modul').get(0); if (vc) panel = availabilityCheck(vc) + `<section class="info-section">${inline($(li).find('p.info-message-for-availability-check').get(0).parent)}</section>`.replace('<section class="info-section"><section>', '<section class="info-section">').replace('</section></section>', '</section>'); else panel = energyTab($(li).children('.container').get(0)); return `<li class="${cls}"><a class="shadow" href="javascript:void(0)"><span class="hide-shadow bottom"></span><span class="hide-shadow left"></span><span class="label text-link"><span class="icon"${attr('data-icon', icon && icon.attribs['data-icon'])}></span><span class="link-text">${esc(text)}</span></span></a><div class="container shadow">${panel}</div></li>`; });
  return `<div class="tab-control"><ul class="tabs-3 contains-cards">${items.join('\n')}</ul></div>`;
}
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
function seals() { const n = $('#PCS16444 .siegel-row ul > li').length; return `<section id="PCS16444" class="page-content-section alternative-background-color"><div class="center clear-fix"><div class="siegel-row"><ul>${'<li></li>'.repeat(n)}</ul></div></div></section>`; }
function keyFacts() {
  const h2 = txt($('#PCS15732 header h2'));
  const items = $('#List15732 > li').toArray().map(li => { const icon = $(li).find('> section > .icon').get(0); return `<li><section class="icon-rounded-border icon-inverted"><span class="icon"${attr('data-icon', icon.attribs['data-icon'])}></span><div class="container"><header><h3>${esc(txt($(li).find('h3')))}</h3></header><p>${inline($(li).find('p').get(0))}</p></div></section></li>`; }).join('');
  return `<section id="PCS15732" class="page-content-section"><div class="center clear-fix"><div class="columns-1"><section class="default text-modul"><header class="center-content"><h2>${esc(h2)}</h2></header><div class="keyFacts-modul"><ul id="List15732" class="teaser columns-3">${items}</ul></div></section></div></div></section>`;
}
function productTeasers() {
  const items = $('#List15736 > li').toArray().map(li => { const fig = $(li).find('figure').get(0); const c = $(fig).find('figcaption .container'); return `<li class="box product-teaser"${attr('id', li.attribs.id)}><div><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig)}<div class="container"><h2>${esc(txt(c.find('h2')))}</h2><span class="divider"></span><div class="description"><p>${inline(c.find('.description p').get(0))}</p></div><div class="link">${lb(c.find('.link a').get(0))}</div></div></figcaption></figure></div></li>`; }).join('\n');
  return `<section id="MainContent_PCS15736" class="page-content-section product-teasers-modul"><div class="center"><ul id="List15736" class="list list-style-1 products">${items}</ul></div></section>`;
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
  const boxes = $('#MainContent_Boxes16441 > li').toArray().map(li => {
    const secs = $(li).children('section').toArray().map(sec => {
      if ($(sec).find('.call-back').length) return `<section>${widgetHeader(sec)}<div class="container">${callBack($(sec).find('.call-back').get(0))}</div></section>`;
      const fig = $(sec).children('figure').get(0);
      const p = $(sec).find('> .container > p.service-text').get(0);
      return `<section${attr('class', /netzstoerung/.test(sec.attribs.class || '') ? 'netzstoerung' : null)}>${widgetHeader(sec)}${fig ? `<figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig)}</figcaption></figure>` : ''}<div class="container">${p ? `<p class="service-text">${inline(p)}</p>` : ''}${iconList($(sec).find('> .container > .icon-list').get(0))}${linkList($(sec).find('> .container > .link-list').get(0))}</div></section>`;
    }).join('');
    return `<li class="box${/multiple-sections/.test(li.attribs.class || '') ? ' multiple-sections' : ''}">${secs}</li>`;
  }).join('\n');
  return `<section id="PCS16424" class="page-content-section alternative-background-color"><div class="center clear-fix"><section id="PCS16441" class="service-boxes campaign"><ul id="MainContent_Boxes16441" class="boxes columns-3 list">${boxes}</ul></section></div></section>`;
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
function teaserModul() {
  const sec = $('#MainContent_PCS15318 > .center > section').get(0);
  return `<section id="MainContent_PCS15318" class="page-content-section teaser-modul coloring-background dock-to-previous-section"><div class="center"><section><header><h3>${esc(txt($(sec).find('header h3')))}</h3></header><div class="container"><div class="spacer"></div><p class="description">${inline($(sec).find('p.description').get(0))}</p><div class="commands">${lb($(sec).find('.commands a').get(0))}</div></div></section></div></section>`;
}
function themes() {
  const sec = $('#Content section.themen-section').get(0);
  const items = $(sec).find('ul.teaser-list > li').toArray().map(li => { const a = $(li).children('a').get(0); const fig = $(a).find('figure').get(0); const c = $(fig).find('figcaption .container'); return `<li class="list-entry"><a class="detail-page-link"${attr('href', href(a.attribs.href))}><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig)}<div class="container"><h3 class="title">${esc(txt(c.find('.title')))}</h3><span class="divider"></span><div class="description">${inline(c.find('.description').get(0))}</div></div></figcaption></figure></a></li>`; }).join('\n');
  const more = $(sec).find('.commands a.link-button').get(0);
  return `<section class="themen-section extra-wide alternative-background-color"><div class="center"><header class="extra-margin-bottom center-content"><h2>${esc(txt($(sec).find('> .center > header h2')))}</h2></header><div class="dynamic-list"><ul class="teaser-list">${items}</ul><div><ul class="teaser-list-reloaded hidden"></ul><div class="commands">${lb(more)}</div></div></div></div></section>`;
}
function post(li) {
  const cls = (li.attribs.class || '').split(/\s+/).filter(c => /post|list-entry|shadow|video-container-cutted/.test(c)).join(' ');
  const a = $(li).children('a').get(0);
  const inner = a ? $(a).children('.container').get(0) : $(li).children('.container').get(0);
  const kids = $(inner).children().toArray().map(k => {
    const kc = k.attribs.class || '';
    if (/\bcarousel\b/.test(kc)) return carousel(k).replace('</div></div></div>', `</div></div>${$(k).children('span').toArray().map(s => `<span class="${iconClass(s)}"></span>`).join('')}</div>`);
    if (/\bvideo\b/.test(kc)) { const img = $(k).children('img').get(0); return `<div class="${kc.replace('clear-fix', '').trim()}">${img ? imgTag(img) : ''}${$(k).children('span').toArray().map(s => `<span class="${iconClass(s)}"></span>`).join('')}</div>`; }
    if (/\bdate\b/.test(kc)) return `<div class="date">${inline(k)}</div>`;
    if (/post-label/.test(kc)) return `<div class="post-label">${esc(txt(k))}</div>`;
    if (k.tagName === 'p') return `<p class="${kc.trim()}">${inline(k)}</p>`;
    if (/post-content/.test(kc)) { return `<div class="post-content">${$(k).contents().toArray().map(c => { if (c.type === 'text') return esc(c.data); if (c.type !== 'tag') return ''; if (c.tagName === 'a') return `<a${attr('href', href(c.attribs.href))}>${inline(c)}</a>`; if (c.tagName === 'p') return `<p>${inline(c)}</p>`; if (/wrapper/.test(c.attribs.class || '')) return `<div class="wrapper">${carousel($(c).find('.carousel').get(0))}</div>`; return clean(c); }).join('')}</div>`; }
    if (/commands/.test(kc)) return `<div class="commands">${inline(k)}</div>`;
    return clean(k);
  }).join('');
  return `<li class="${cls}"${attr('id', li.attribs.id)}>${a ? `<a class="read-on detail-page-link"${attr('href', href(a.attribs.href))}${aria(a)}><div class="container">${kids}</div></a>` : `<div class="container">${kids}</div>`}</li>`;
}
function carousel(c) { if (!c) return ''; const ul = $(c).find('.slider > ul').get(0); const slides = $(ul).children('li').toArray().map(li => `<li>${$(li).children('img').toArray().map(i => imgTag(i)).join('')}${$(li).children('span').toArray().map(s => `<span class="${iconClass(s)}"></span>`).join('')}</li>`).join(''); const n = $(ul).children('li').length; const dots = $(c).find('.controls > ul > li').toArray().map(li => `<li><a class="${iconClass($(li).children('a').get(0))}" href="javascript:void(0)"${aria($(li).children('a').get(0))}></a></li>`).join(''); const bl = aria($(c).find('.controls > a.btn-left').get(0)), br = aria($(c).find('.controls > a.btn-right').get(0)); return `<div class="carousel"><div class="slider"><ul class="slides-${n}">${slides}</ul><div class="controls"><a class="btn-left" href="javascript: void(0);"${bl}><span class="fa fa-arrow-circle-left"></span></a><ul>${dots}</ul><a class="btn-right" href="javascript: void(0);"${br}><span class="fa fa-arrow-circle-right"></span></a></div></div></div>`; }
function aktuelles(sectionEl) {
  const tm = $(sectionEl).find('> .center > .text-modul').get(0);
  const h2 = txt($(tm).find('header h2'));
  const editor = $(tm).find('.text-editor-container').get(0);
  const tip = $(tm).find('.toolTip').get(0);
  const ul = $(sectionEl).find('ul.posts').get(0); const ulId = ul.attribs.id;
  const cols = $(ul).children('li.column').toArray().map(col => `<li class="column"><ul>${$(col).find('> ul > li').toArray().map(post).join('\n')}</ul></li>`).join('\n');
  const more = $(sectionEl).find('.commands a.link-button').get(0);
  return `<section class="page-foot-section aktuelles alternative-background-color"><div class="center"><div class="text-modul${editor ? ' extra-margin-bottom' : ''}"><header class="${editor ? 'center-content' : 'extra-margin-bottom center-content'}"><h2>${esc(h2)}</h2></header>${editor ? `<div class="text-editor-container center-content"><p>${inline($(editor).find('p').get(0))}</p></div>` : ''}<div class="toolTip">${inline(tip)}</div></div><div class="modul"><div class="dynamic-list"><ul id="${ulId}" class="boxes-unsized posts columns-4">${cols}</ul><div><ul class="hidden posts-reloaded"></ul><div class="commands"><div class="center center-content">${lb(more)}</div></div></div></div></div></div></section>`;
}
function events() {
  const sec = $('#Content section.veranstaltungen').get(0);
  const h2 = txt($(sec).find('> .center > header h2'));
  const entry = $(sec).find('.details-view .list-entry').get(0);
  const teaser = $(entry).children('a.teaser').get(0); const fig = $(teaser).find('figure').get(0); const bar = $(fig).find('.bar');
  const back = $(entry).find('a.button-back').get(0), next = $(entry).find('a.button-next').get(0);
  const quartals = $(sec).find('ul.list-quartals').get(0);
  const months = $(quartals).children('li').toArray().map(li => { const cls = (li.attribs.class || '').trim(); if (/navigation-button/.test(cls)) { return `<li class="${cls}"><a class="no-more-months" href="javascript:void(0);"${aria($(li).children('a').get(0))}><span class="icon"></span></a></li>`; } const name = txt($(li).children('.month-name')); const days = $(li).children('ul').get(0); const dayItems = days ? $(days).children('li').toArray().map(d => { const a = $(d).children('a').get(0); const bg = dataUrlFile(a.attribs.style); const menu = $(d).children('ul.days-menu').get(0); return `<li${attr('class', /active/.test(d.attribs.class || '') ? 'active' : null)} style="left:${(d.attribs.style.match(/left:\s*([\d.]+)px/) || [])[1]}px"><a class="${iconClass(a)} day-link ${/more/.test(a.attribs.class) ? 'more' : 'single'}" href="#"${attr('style', bg ? `background-image:url(${bg})` : null)}><span>${esc(txt($(a).children('span')))}</span></a>${menu ? `<ul class="days-menu more">${$(menu).children('li').toArray().map(m => /caret/.test(m.attribs.class || '') ? `<li class="caret"><span class="fa fa-caret-down"></span></li>` : `<li class="menu-item"><a class="day-menu-link" href="javascript:void(0)"><div><span class="appointment-title">${esc(txt(m))}</span></div></a></li>`).join('')}</ul>` : ''}</li>`; }).join('') : ''; const w = (li.attribs.style || '').match(/width:\s*([\d.]+)px/); const uw = days ? ((days.attribs.style || '').match(/width:\s*([\d.]+)px/) || [])[1] : null; return `<li class="${cls}"><span class="month-name">${esc(name)}</span>${days ? `<ul${attr('style', uw ? `width:${uw}px` : null)}>${dayItems}</ul>` : ''}</li>`; }).join('');
  return `<section class="veranstaltungen extra-wide"><div class="center"><header><h2>${esc(h2)}</h2></header><div class="panel shadow"><div class="dynamic-list appointment details-view clear-fix"><div class="list-entry">
<a class="navigation-button button-back no-more" href="#"${aria(back)}><span class="arrow arrow-left"></span></a>
<a class="teaser detail-page-link"${attr('href', href(teaser.attribs.href))}${aria(teaser)}><figure>${pictureTag($(fig).children('picture').get(0))}<figcaption>${credits(fig)}</figcaption><div class="bar"><div class="title">${esc(txt(bar.find('.title')))}</div><div class="meta-data">${inline(bar.find('.meta-data').get(0))}</div></div></figure></a>
<a class="navigation-button button-next" href="#"${aria(next)}><span class="arrow arrow-right"></span></a>
</div></div><div class="update-panel-for-timeline"><ul class="list-quartals months_1-2">${months}</ul><div class="timeline"></div></div></div><div class="cached-appointments"></div><div class="commands">${lb($(sec).find('> .center > .commands a').get(0))}</div></div></section>`;
}

/* ---------------------------------------------------------------- footer */
function footer() {
  const contact = $('#PageFooter .contact li').toArray().map(li => `<li class="icon"><span class="label">${esc(txt($(li).find('.label')))}</span>${inline($(li).find('a').get(0).parent === li ? $(li).children('a').get(0) : $(li).find('a').get(0)) ? `<a class="hilite"${attr('href', $(li).find('a').attr('href'))}>${esc(txt($(li).find('a')))}</a>` : ''}</li>`).join('');
  const social = $('#PageFooter .social ul > li').toArray().map(li => { const a = $(li).children('a').get(0); return `<li><a class="${iconClass(a)}"${attr('href', a.attribs.href)}${aria(a)}></a></li>`; }).join('');
  const tip = $('#PageFooter .social .toolTip').get(0);
  const nl = $('#pnlNewsletter').get(0);
  const nav = $('#PageFooter .section-2 nav > ul > li').toArray().map(li => { const a = $(li).children('a').get(0); return a ? `<li><a${attr('href', href(a.attribs.href))}>${esc(txt(a))}</a></li>` : '<li></li>'; }).join('\n');
  return `<footer id="PageFooter">
<div class="section-1"><div class="center">
<div class="contact"><h3>${esc(txt($('#PageFooter .contact h3')))}</h3><ul>${contact}</ul></div>
<div class="social"><h3>${esc(txt($('#PageFooter .social h3').contents().filter((i, n) => n.type === 'text')))} <a class="toolTip-opener" href="javascript:void(0)"${aria($('#PageFooter .social h3 a').get(0))}><span class="fa fa-info"></span></a></h3><div class="toolTip">${inline(tip)}</div><ul>${social}</ul></div>
<div class="newsletter"><h3>${esc(txt($(nl).find('h3')))}</h3><p>${inline($(nl).find('p').get(0))}</p><form action="" onsubmit="return false" class="clear-fix"><input type="text" id="nl_email" placeholder="E-Mail-Adresse"${aria($('#nl_email').get(0))}> ${lb($('#lbNewsletter').get(0))}</form></div>
</div></div>
<div class="section-2"><div class="center"><nav${aria($('#PageFooter .section-2 nav').get(0))}><ul>\n${nav}\n</ul></nav><div class="copyright"><span>${esc(txt($('#PageFooter .copyright span')))}</span></div></div></div>
</footer>`;
}

function widgets() { const items = $('#Widgets > ul > li').toArray().map(li => { const a = $(li).children('a.shadow').get(0); const icon = $(a).find('.icon').get(0); return `<li class="${(li.attribs.class || '').trim()}"><a class="shadow" href="javascript:void(0)"${aria(a)}><span class="hide-shadow"></span><span class="icon"${attr('data-icon', icon && icon.attribs['data-icon'])}></span><span class="title">${esc(txt($(a).find('.title')))}</span></a></li>`; }).join(''); return `<div id="Widgets"><ul>${items}</ul></div>`; }
/* ---------------------------------------------------------------- page */
const aktSections = $('#Content > section.aktuelles').toArray();
const page = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc($('title').first().text().trim())}</title>
<meta name="description" content="${esc($('meta[name=description]').attr('content') || '')}">
<link rel="icon" href="assets/index/favicon.png">
<link rel="stylesheet" href="css/canon.css">
<link rel="stylesheet" href="css/index.css">
</head>
<body class="site">
${header()}
<main id="Content">
<h1 class="screen-reader visible-only">${esc(txt($('#MainContent_h1Alternative')))}</h1>
${hero()}
${seals()}
${keyFacts()}
${productTeasers()}
${steps()}
${serviceBoxes()}
${teaserModul()}
${themes()}
${aktuelles(aktSections[0])}
${aktuelles(aktSections[1])}
${events()}
</div>
<div class="scroll-up" role="button" aria-label="Zum Seitenanfang" tabindex="0"></main>
${footer()}
${widgets()}
<div class="chat-teaser" aria-hidden="true"><div class="chat-teaser-panel"><div class="chat-teaser-message">Wie kann ich Ihnen helfen?</div><span class="chat-teaser-close">×</span><span class="chat-teaser-qr qr-1">Frage stellen</span><span class="chat-teaser-qr qr-2">Zählerstand melden</span><span class="chat-teaser-qr qr-3">Abschlag ändern</span></div><div class="chat-teaser-button"><img src="assets/index/site/moin-avatar.png" alt=""></div></div>
<script src="js/index.js"></script>
</body>
</html>
`;
const spaced = page.replace(/>(<(?:div|p|h[1-6]|ul|li|section|header|figure|figcaption|form|nav|label|select|option|span class="divider")\b)/g, '>\n$1');
fs.writeFileSync(path.join(ROOT, 'stardust/prototypes/index-proposed.html'), spaced);
console.log('written', page.length, 'bytes; missing assets:', [...missing].slice(0, 20));

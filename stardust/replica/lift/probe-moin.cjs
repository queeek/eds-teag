// probe-moin.cjs — one live navigation: list moin.ai teaser elements (tag/class/rect) and Usercentrics shadow buttons, 12 s after load
const { chromium } = require('/app/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', locale: 'de-DE' });
  const p = await ctx.newPage(); await p.goto('https://www.thueringerenergie.de/default', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(12000);
  const out = await p.evaluate(() => { const r = []; document.querySelectorAll('[class*="moin" i], [id*="moin" i]').forEach(e => { const b = e.getBoundingClientRect(); r.push(`${e.tagName}#${e.id}.${String(e.className).slice(0, 80)} ${Math.round(b.x)},${Math.round(b.y)} ${Math.round(b.width)}x${Math.round(b.height)} ${getComputedStyle(e).position} txt=${(e.textContent || '').trim().slice(0, 40)}`); }); const uc = document.querySelector('#usercentrics-root'); let ucb = []; if (uc && uc.shadowRoot) uc.shadowRoot.querySelectorAll('button').forEach(x => ucb.push(x.getAttribute('data-testid') + ':' + x.textContent.trim().slice(0, 30))); return { r, uc: !!uc, ucb }; });
  console.log(out.r.slice(0, 40).join('\n')); console.log('uc', out.uc, out.ucb.join(' | ')); await b.close();
})().catch(e => { console.error(e); process.exit(1); });

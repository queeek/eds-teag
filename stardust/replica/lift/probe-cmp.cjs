// probe-cmp.cjs — one live navigation: find the consent CMP host(s) and the buttons inside their shadow roots (ids, text, data attrs)
const { chromium } = require('/app/node_modules/playwright');
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', locale: 'de-DE' });
  const p = await ctx.newPage(); await p.goto('https://www.thueringerenergie.de/default', { waitUntil: 'domcontentloaded' });
  for (const t of [3000, 8000, 15000]) { await p.waitForTimeout(t === 3000 ? 3000 : 5000); const out = await p.evaluate(() => { const hosts = [...document.querySelectorAll('[id*="usercentrics" i], [class*="usercentrics" i], [id*="uc-" i]')].map(h => { const sr = h.shadowRoot; const btns = sr ? [...sr.querySelectorAll('button')].map(x => `${x.id || ''}|${(x.getAttribute('data-testid') || '')}|${(x.getAttribute('data-action-type') || '')}|${x.textContent.trim().slice(0, 25)}`) : []; const r = h.getBoundingClientRect(); return `${h.tagName}#${h.id} shadow=${!!sr} ${Math.round(r.width)}x${Math.round(r.height)} btns=[${btns.join(' ; ')}]`; }); return hosts; }); console.log(`t=${t}`, out.join('\n  ') || '(none)'); }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });

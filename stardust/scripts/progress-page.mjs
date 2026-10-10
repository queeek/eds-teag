#!/usr/bin/env node
// Renders tools/replica/progress.html from stardust/replica/status-page.json + stardust/.labs/run.json.
// Usage: node stardust/scripts/progress-page.mjs [--set key=value ...]   (keys: steps.N, now, next, state, templates(json), pages(json))
import fs from 'node:fs';
const RUN = JSON.parse(fs.readFileSync('stardust/.labs/run.json', 'utf8'));
const SP = 'stardust/replica/status-page.json';
const st = fs.existsSync(SP) ? JSON.parse(fs.readFileSync(SP, 'utf8')) : {
  steps: ['upcoming','upcoming','upcoming','upcoming','upcoming'], // done|progress|upcoming
  templates: [], // {name, pages, desktop:'—'|'Yes'|'Checking', mobile, status}
  pages: [],     // {path, title, ready:bool}
  now: '', next: '', attention: false, extraDone: 0 // extraDone: fraction of "Checking fidelity" step done (0..1)
};
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) if (args[i] === '--set') {
  const [k, ...rest] = args[++i].split('='); const v = rest.join('=');
  const m = k.match(/^steps\.(\d)$/);
  if (m) st.steps[+m[1]] = v;
  else if (k === 'templates' || k === 'pages') st[k] = JSON.parse(v);
  else if (k === 'attention') st.attention = v === 'true';
  else if (k === 'extraDone') st.extraDone = +v;
  else st[k] = v;
}
fs.writeFileSync(SP, JSON.stringify(st, null, 2));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const badge = s => ({done:'<span class="spectrum-badge spectrum-badge--positive">Done</span>', ready:'<span class="spectrum-badge spectrum-badge--positive">Ready</span>', progress:'<span class="spectrum-badge spectrum-badge--informative">In progress</span>', attention:'<span class="spectrum-badge spectrum-badge--notice">Needs attention</span>', upcoming:'<span class="spectrum-badge">Upcoming</span>'}[s] || `<span class="spectrum-badge">${esc(s)}</span>`);
const weights = [10, 10, 40, 10, 30];
const nT = st.templates.length || 1, nP = st.pages.length || 1;
const frac = [
  st.steps[0] === 'done' ? 1 : st.steps[0] === 'progress' ? 0.5 : 0,
  st.steps[1] === 'done' ? 1 : st.steps[1] === 'progress' ? 0.5 : 0,
  st.templates.length ? st.templates.filter(t => t.status === 'done').length / nT : (st.steps[2] === 'done' ? 1 : 0),
  st.steps[3] === 'done' ? 1 : (st.extraDone || 0),
  st.pages.length ? st.pages.filter(p => p.ready).length / nP : 0,
];
const pct = Math.round(frac.reduce((a, f, i) => a + f * weights[i], 0));
const running = (RUN.priorRunningMs || 0) + (Date.now() - Date.parse(RUN.startedAt));
let estimate = 'Estimating…';
if (pct >= 10) {
  const remain = running * (100 - pct) / Math.max(pct, 1);
  const q = 15 * 60e3; const lo = Math.max(q, Math.round(remain * 0.8 / q) * q), hi = Math.max(lo + q, Math.round(remain * 1.3 / q) * q);
  const cap = Date.parse(RUN.deadlineAt) - Date.now();
  const fmt = ms => { ms = Math.min(ms, cap); const h = Math.floor(ms / 36e5), m = Math.round((ms % 36e5) / 6e4 / 15) * 15; return h ? `${h} h${m ? ` ${m} min` : ''}` : `${Math.max(m, 15)} min`; };
  estimate = pct >= 100 ? 'Complete' : `About ${fmt(lo)} to ${fmt(hi)} remaining`;
}
const overall = st.attention ? 'attention' : pct >= 100 ? 'ready' : 'progress';
const stepNames = ['Analyzing your site', 'Capturing brand and design', 'Rebuilding page templates', 'Checking fidelity', 'Migrating your pages'];
const site = RUN.scope.sourceUrl.replace(/\/$/, ''); const preview = RUN.previewUrl.replace(/\/$/, '');
const ready = st.pages.filter(p => p.ready);
const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status — ${esc(site.replace(/^https?:\/\//, ''))}</title>
<link rel="stylesheet" href="spectrum.css">
<style>
  main { max-width: 760px; margin: 0 auto; padding: 40px 24px 64px; }
  header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 24px; }
  header p { margin: 4px 0; }
  .spectrum-panel { margin-bottom: 16px; }
  .spectrum-panel-header { margin: 0; padding: 0 16px; }
  .panel-body { padding: 16px; }
  .panel-body > :last-child { margin-bottom: 0; }
  .bar { height: 8px; border-radius: 9999px; background-color: var(--spectrum-gray-200); overflow: hidden; margin-top: 8px; }
  .bar span { display: block; height: 100%; background-color: var(--spectrum-accent-bg); }
  ol.steps { list-style: none; padding: 0; margin: 0; }
  ol.steps li { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 0; }
  ol.steps li + li, ul.pages li + li { border-top: 1px solid var(--spectrum-gray-200); }
  ul.pages { list-style: none; padding: 0; margin: 8px 0 0; }
  ul.pages li { padding: 8px 0; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--spectrum-gray-200); }
</style>
</head>
<body>
<main>
<header>
  <div>
    <h1>Migration status</h1>
    <p>Source site: <a href="${esc(site)}/">${esc(site.replace(/^https?:\/\//, ''))}</a></p>
    <p>Preview site: <a href="${esc(preview)}/">${esc(preview.replace(/^https?:\/\//, ''))}</a></p>
    <p>Last updated: ${new Date().toISOString().replace('T', ' ').slice(0, 16)} UTC</p>
  </div>
  <div>${badge(overall)}</div>
</header>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Your migration journey</h2>
  <div class="panel-body">
    <ol class="steps">
${stepNames.map((n, i) => `      <li><span>${i + 1}. ${n}</span>${badge(st.steps[i])}</li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Page templates</h2>
  <div class="panel-body">
${st.templates.length ? `    <table>
      <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
      <tbody>
${st.templates.map(t => `        <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
      </tbody>
    </table>` : `    <p>We are identifying the page templates on your site.</p>`}
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Pages migrated: ${ready.length} of ${st.pages.length}</h2>
  <div class="panel-body">
    <details${st.pages.length > 12 ? '' : ' open'}>
      <summary>Pages ready on the preview site</summary>
${ready.length ? `      <ul class="pages">
${ready.map(p => `        <li><a href="${esc(preview + p.path)}">${esc(p.title || p.path)}</a></li>`).join('\n')}
      </ul>` : `      <p>No pages are ready on the preview site yet.</p>`}
    </details>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Progress: ${pct}% complete</h2>
  <div class="panel-body">
    <div class="bar"><span style="width: ${pct}%"></span></div>
    <p>${esc(estimate)}</p>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's happening now</h2>
  <div class="panel-body"><p>${esc(st.now)}</p>${st.attention ? '<p>Some pages need a closer look; we\'re on it.</p>' : ''}</div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's next</h2>
  <div class="panel-body"><p>${esc(st.next)}</p></div>
</section>
</main>
</body>
</html>
`;
fs.writeFileSync('tools/replica/progress.html', html);
console.log(`progress.html written: ${pct}% · ${estimate} · ${overall}`);

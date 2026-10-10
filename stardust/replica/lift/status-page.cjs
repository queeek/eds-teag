// status-page.cjs — rewrites tools/replica/progress.html from stardust/replica/status-page.json + stardust/.labs/run.json
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('stardust/replica/status-page.json','utf8'));
const run=JSON.parse(fs.readFileSync('stardust/.labs/run.json','utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const badge=st=>({done:'<span class="spectrum-badge spectrum-badge--positive">Done</span>',ready:'<span class="spectrum-badge spectrum-badge--positive">Ready</span>',progress:'<span class="spectrum-badge spectrum-badge--informative">In progress</span>',attention:'<span class="spectrum-badge spectrum-badge--notice">Needs attention</span>',upcoming:'<span class="spectrum-badge">Upcoming</span>'})[st];
const weights=[10,10,40,10,30];
const tDone=d.templates.filter(t=>t.status==='done').length, tN=d.templates.length;
const pReady=d.pages.filter(p=>p.ready).length, pN=d.pages.length;
let pct=0; d.steps.forEach((s,i)=>{ if(i===2) pct+=weights[2]*tDone/tN; else if(i===4) pct+=weights[4]*pReady/pN; else if(s==='done') pct+=weights[i]; });
pct=Math.round(pct);
const now=new Date(); const running=(run.priorRunningMs||0)+(now-new Date(run.startedAt));
const deadline=new Date(run.deadlineAt);
const fmt=ms=>{const m=Math.round(ms/900000)*15; const h=Math.floor(m/60), mm=m%60; return (h?`${h} h`:'')+(mm?` ${mm} min`:'')||'15 min';};
let est='Estimating…';
if(pct>=10&&pct<100){ let rem=running*(100-pct)/pct; let lo=rem*0.8, hi=rem*1.3; const maxRem=deadline-now; lo=Math.min(lo,maxRem); hi=Math.min(hi,maxRem); est=`About ${fmt(lo).trim()} to ${fmt(hi).trim()} remaining`; }
if(pct>=100) est='Complete';
const overall=d.attention?'attention':(pct>=100?'ready':'progress');
const overallLabel={attention:'Needs attention',ready:'Ready',progress:'In progress'}[overall];
const stepNames=['Analyzing your site','Capturing brand and design','Rebuilding page templates','Checking fidelity','Migrating your pages'];
const prev=run.previewUrl.replace(/\/$/,'');
const ready=d.pages.filter(p=>p.ready);
const pagesList=ready.length?`<ul class="pages">${ready.map(p=>`<li><a href="${prev}${p.path==='/'?'/':p.path}">${esc(p.title)}</a> <span class="spectrum-badge spectrum-badge--positive">Ready</span></li>`).join('')}</ul>`:'<p>No pages are ready on the preview site yet.</p>';
const ts=now.toISOString().slice(0,16).replace('T',' ')+' UTC';
const html=`<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Migration status — www.thueringerenergie.de</title>
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
  ul.pages li { padding: 8px 0; display: flex; justify-content: space-between; gap: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px; text-align: left; border-bottom: 1px solid var(--spectrum-gray-200); }
</style>
</head>
<body>
<main>
<header>
  <div>
    <h1>Migration status</h1>
    <p>Source site: <a href="https://www.thueringerenergie.de/">www.thueringerenergie.de</a></p>
    <p>Preview site: <a href="${run.previewUrl}">${run.previewUrl.replace(/^https?:\/\//,'').replace(/\/$/,'')}</a></p>
    <p>Last updated: ${ts}</p>
  </div>
  <div>${badge(overall).replace(/>[^<]+</,`>${overallLabel}<`)}</div>
</header>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Your migration journey</h2>
  <div class="panel-body">
    <ol class="steps">
${stepNames.map((n,i)=>`      <li><span>${i+1}. ${n}</span>${badge(d.steps[i])}</li>`).join('\n')}
    </ol>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Page templates</h2>
  <div class="panel-body">
    <table>
      <thead><tr><th>Template</th><th>Pages</th><th>Desktop</th><th>Mobile</th><th>Status</th></tr></thead>
      <tbody>
${d.templates.map(t=>`        <tr><td>${esc(t.name)}</td><td>${t.pages}</td><td>${esc(t.desktop)}</td><td>${esc(t.mobile)}</td><td>${badge(t.status)}</td></tr>`).join('\n')}
      </tbody>
    </table>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Pages migrated: ${pReady} of ${pN}</h2>
  <div class="panel-body">
    <details${pN>12?'':' open'}>
      <summary>Pages ready on the preview site</summary>
      ${pagesList}
    </details>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">Progress: ${pct}% complete</h2>
  <div class="panel-body">
    <div class="bar"><span style="width: ${pct}%"></span></div>
    <p>${est}</p>
  </div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's happening now</h2>
  <div class="panel-body"><p>${esc(d.now)}</p>${d.attention?'<p>Some pages need a closer look; we\'re on it.</p>':''}</div>
</section>

<section class="spectrum-panel">
  <h2 class="spectrum-panel-header">What's next</h2>
  <div class="panel-body"><p>${esc(d.next)}</p></div>
</section>
</main>
</body>
</html>
`;
fs.writeFileSync('tools/replica/progress.html',html);
console.log(`status page: ${pct}% · ${est} · ${ts}`);

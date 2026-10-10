// mdiff.cjs <live.json> <build.json> <width> [tol=4] — per-selector rect deltas (build − live) above tol, plus root heights
const [a,b,w,t]=process.argv.slice(2); const tol=+(t||4); const A=require(a), B=require(b); const pa=A.pages[Object.keys(A.pages)[0]][w], pb=B.pages[Object.keys(B.pages)[0]][w];
const r=x=>Array.isArray(x)&&x[0]&&x[0].rect?x[0].rect:null; const ra=k=>r(pa[k]), rb=k=>r(pb[k]);
const ha=A.pages[Object.keys(A.pages)[0]].root||{}, hb=B.pages[Object.keys(B.pages)[0]].root||{}; console.log('root live', JSON.stringify(pa.root||ha).slice(0,120), 'build', JSON.stringify(pb.root||hb).slice(0,120));
for(const k of Object.keys(pa)){ if(!k.startsWith('#')&&!k.startsWith('.')) continue; const x=ra(k), y=rb(k); if(!x||!y){ console.log(k,'|', !x?'live-missing':'', !y?'BUILD-MISSING':''); continue; } const d=[y.x-x.x,y.y-x.y,y.w-x.w,y.h-x.h]; if(d.some(v=>Math.abs(v)>tol)) console.log(`${k} | live ${x.x} ${x.y} ${x.w} ${x.h} | Δx ${d[0]} Δy ${d[1]} Δw ${d[2]} Δh ${d[3]}`); }

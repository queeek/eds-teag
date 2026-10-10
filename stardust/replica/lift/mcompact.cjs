// mcompact.cjs <measure.json> <width> [terse] — one line per selector: rect | non-default computed props
const j=require(process.argv[2]); const w=process.argv[3]; const terse=process.argv[4]==='terse';
const W=j.pages[Object.keys(j.pages)[0]][w];
const skip=new Set(['0px','auto','none','visible','400','16px','rgb(0, 0, 0)','rgba(0, 0, 0, 0)','static','content-box','block','normal','1','0','0px none rgb(0, 0, 0)','start','matrix(1, 0, 0, 1, 0, 0)']);
const keep=terse?new Set(['display','float','position','fontSize','lineHeight','fontWeight','width','maxWidth','height','paddingTop','paddingRight','paddingBottom','paddingLeft','marginTop','marginRight','marginBottom','marginLeft','top','left','right','bottom']):null;
const short=k=>k.replace(/^padding/,'p').replace(/^margin/,'m').replace('Top','T').replace('Right','R').replace('Bottom','B').replace('Left','L').replace('fontSize','fs').replace('lineHeight','lh').replace('fontWeight','fw').replace('backgroundColor','bg').replace('backgroundImage','bgi').replace('boxShadow','sh').replace('borderRadius','rad').replace('textAlign','ta').replace('textTransform','tt');
const hex=s=>s.replace(/rgb\((\d+), (\d+), (\d+)\)/g,(_,a,b,c)=>'#'+[a,b,c].map(x=>(+x).toString(16).padStart(2,'0')).join('')).replace(/(\.\d{2})\d+/g,'$1').replace(/url\("[^"]*\/([^\/"]+)"\)/g,'url($1)');
for(const [sel,v] of Object.entries(W)){ if(!sel.startsWith('#')&&!sel.startsWith('.')) { console.log(sel, JSON.stringify(v).slice(0,200)); continue; }
  const m=Array.isArray(v)?v[0]:(v.matches?v.matches[0]:v); if(!m){ console.log(sel,'| MISSING'); continue; }
  const r=m.rect||m; const st=m.props||m.styles||m; const parts=[];
  for(const [k,v2] of Object.entries(st)){ if(typeof v2==='object') continue; if(['x','y','w','h','width','height','text','visible','count','selector'].includes(k)&&!(st===m&&['width','height'].includes(k)&&false)) { if(st!==m) {} } if(['x','y','text','visible','count','selector','tag'].includes(k)) continue; if(keep&&!keep.has(k)) continue; let s=String(v2); if(skip.has(s)) continue; parts.push(short(k)+':'+hex(s)); }
  console.log(`${sel} | ${[r.x,r.y,r.w??r.width,r.h??r.height].join(' ')}${m.of>1?" of"+m.of:""}${m.visible===false?" HIDDEN":""} | ${parts.join('; ')}`); }

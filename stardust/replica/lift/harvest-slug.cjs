// harvest-slug.cjs <slug> — download every 1x image rendition referenced by the captured page (img/source src, data-src, srcset) into stardust/prototypes/assets/<slug>/; writes lift/<slug>-asset-map.json (path → local)
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process'),cheerio=require('/app/node_modules/cheerio');
const slug=process.argv[2]; const host='https://www.thueringerenergie.de';
const $=cheerio.load(fs.readFileSync(`stardust/current/pages/${slug}.html`,'utf8'));
const out=`stardust/prototypes/assets/${slug}`; fs.mkdirSync(out,{recursive:true}); const map={}; const urls=new Set();
const add=u=>{ if(!u||/^data:/.test(u)) return; u=u.trim(); if(u.startsWith('/')) u=host+u; if(!u.startsWith(host)) return; if(/@[23]\.(png|jpg|gif)$/.test(u)) return; urls.add(u); };
$('#Content img, #Content source').each((i,el)=>{ const a=el.attribs; add(a.src); add(a['data-src']); (a.srcset||a['data-srcset']||'').split(',').forEach(c=>add(c.trim().split(/\s+/)[0])); });
let n=0; for(const u of urls){ let name=decodeURIComponent(u.split('/').pop()); if(!/\.[a-z0-9]{3,4}$/i.test(name)) name+='.jpg'; const dest=path.join(out,name); if(!fs.existsSync(dest)){ try{ execFileSync('curl',['-sL','--max-time','60','-A','Mozilla/5.0','-o',dest,u]); n++; }catch(e){ console.error('FAIL',u); continue; } } if(fs.statSync(dest).size<100){ console.error('TINY',u); fs.unlinkSync(dest); continue; } map[u.slice(host.length)]=`assets/${slug}/${name}`; }
fs.writeFileSync(`stardust/replica/lift/${slug}-asset-map.json`, JSON.stringify(map,null,1)); console.log('downloaded',n,'mapped',Object.keys(map).length);

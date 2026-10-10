// outline.cjs <html> <selector> [maxDepth] [--text]  — depth-limited tree of captured HTML (query helper, not a DOM copier)
const fs=require('fs'); const cheerio=require('/app/node_modules/cheerio');
const [file, sel, depthArg, ...rest]=process.argv.slice(2); const maxDepth=parseInt(depthArg||'3',10); const showText=rest.includes('--text');
const $=cheerio.load(fs.readFileSync(file,'utf8'));
function sig(el){ const a=el.attribs||{}; let s=el.tagName; if(a.id) s+='#'+a.id; if(a.class) s+='.'+a.class.trim().split(/\s+/).slice(0,4).join('.'); if(el.tagName==='img') s+=` [${(a.src||'').slice(-40)} ${a.width||''}x${a.height||''}]`; if(el.tagName==='a'&&a.href) s+=` →${a.href.slice(0,50)}`; if(a.style) s+=` {${a.style.slice(0,60)}}`; return s; }
function walk(el, d){ if(d>maxDepth) return; const kids=$(el).children().toArray(); let t=''; if(showText||/^h[1-6]$|^a$|^p$|^span$|^label$|^li$|^button$|^legend$/.test(el.tagName)){ t=$(el).text().replace(/\s+/g,' ').trim().slice(0,70); if(t) t=' "'+t+'"'; } console.log('  '.repeat(d)+sig(el)+(kids.length&&d===maxDepth?` (${kids.length} children)`:'')+t); kids.forEach(k=>walk(k,d+1)); }
$(sel).toArray().forEach(e=>walk(e,0));

// styles-dump.cjs <html> <selector> — print full inline style attribute per match, with data URLs hashed to short keys and saved to lift/data-urls.json
const fs=require('fs'); const crypto=require('crypto'); const cheerio=require('/app/node_modules/cheerio');
const [file, sel]=process.argv.slice(2); const $=cheerio.load(fs.readFileSync(file,'utf8'));
const store=fs.existsSync('stardust/replica/lift/data-urls.json')?JSON.parse(fs.readFileSync('stardust/replica/lift/data-urls.json','utf8')):{};
$(sel).toArray().forEach((el,i)=>{ let s=el.attribs.style||''; s=s.replace(/url\((["']?)(data:[^)"']+)\1\)/g,(m,q,d)=>{ const k='d'+crypto.createHash('md5').update(d).digest('hex').slice(0,8); store[k]=d; return `url(@${k})`; }); console.log(`${i}\t${el.tagName}#${el.attribs.id||''}.${(el.attribs.class||'').split(/\s+/).slice(0,3).join('.')}\t${s}`); });
fs.writeFileSync('stardust/replica/lift/data-urls.json', JSON.stringify(store));

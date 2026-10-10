// attrs.cjs <html> <selector> [attr,attr,...] — print selected attributes of every match (query helper)
const fs=require('fs'); const cheerio=require('/app/node_modules/cheerio');
const [file, sel, attrList]=process.argv.slice(2); const attrs=(attrList||'src,srcset,media,sizes,data-src,data-srcset,width,height,alt,href,class,style,type,value,placeholder,name,for,id').split(',');
const $=cheerio.load(fs.readFileSync(file,'utf8'));
$(sel).toArray().forEach((el,i)=>{ const a=el.attribs||{}; const out=[]; attrs.forEach(k=>{ if(a[k]!=null){ let v=a[k]; if(/^data:image/.test(v)) v='data:…'; v=v.replace(/https:\/\/www\.thueringerenergie\.de/g,'~'); out.push(`${k}="${v.length>160?v.slice(0,160)+'…':v}"`);} }); console.log(`${i}\t<${el.tagName}> ${out.join(' ')}`); });

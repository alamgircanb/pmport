const {chromium}=require('playwright');const fs=require('fs');
const out='tests/ui/out';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});const log=[];const L=(...a)=>{const s=a.join(' ');console.log(s);log.push(s);fs.writeFileSync(out+'/log.txt',log.join('\n'));};
setTimeout(()=>{L('GLOBAL TIMEOUT');process.exit(0);},150000);
const U='http://localhost:4200/resources/nine-women-one-month-brooks-law';
(async()=>{try{const b=await chromium.launch();const errors=[];
 for(const vp of [{width:1440,height:900,n:'desk'},{width:390,height:844,n:'mob'}]){const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await p.goto(U);await p.waitForTimeout(1500);
  L(vp.n,'h1',(await p.locator('h1').textContent()).trim(),'| title',await p.title(),'| h2',await p.locator('article h2').count(),'| sources',await p.locator('.sources li').count(),'| img',await p.locator('.article-hero img').evaluate(i=>i.complete&&i.naturalWidth),'| scrollWidth',await p.evaluate(()=>document.documentElement.scrollWidth),'| crumbs',(await p.locator('.crumbs li').allTextContents()).map(t=>t.trim()).join(' › '));
  await p.screenshot({path:out+`/${vp.n}.png`});
  if(vp.n==='desk'){await p.locator('.toc a',{hasText:'Ten better'}).click();await p.waitForTimeout(900);L('toc',p.url(),Math.round(await p.locator('#instead').evaluate(e=>e.getBoundingClientRect().top)));await p.screenshot({path:out+'/instead.png'});
   await p.goto('http://localhost:4200/resources');await p.waitForTimeout(1200);L('resources first card',(await p.locator('.feature-article h2').first().textContent()).trim());}
  await p.close();}
 const html=fs.readFileSync('dist/portfolio/browser/resources/nine-women-one-month-brooks-law/index.html','utf8');L('prerender',(html.match(/<title>[^<]*/)||[''])[0],'| has evidence',/8\.92 months/.test(html),'| og',/og\/nine-women-one-month\.jpg/.test(html));
 const sm=fs.readFileSync('dist/portfolio/browser/sitemap.xml','utf8');L('sitemap',/nine-women-one-month-brooks-law/.test(sm));
 L('errors',JSON.stringify(errors));await b.close();process.exit(0);}catch(e){L('FATAL',e.message.split('\n')[0]);process.exit(0);}})();

const {chromium}=require('playwright');const fs=require('fs');const B=process.argv[2];
(async()=>{const b=await chromium.launch();const out=[];const errs=[];
const html=fs.readFileSync('dist/portfolio/browser/daily-practice/index.html','utf8');
out.push('prerender: title='+/<title>([^<]*)/.exec(html)[1]+' | hasHowItWorks='+html.includes('How it works')+' | og='+/og:image" content="([^"]*)/.exec(html)?.[1]);
out.push('sitemap has page: '+fs.readFileSync('dist/portfolio/browser/sitemap.xml','utf8').includes('/daily-practice<'));
for(const [w,h] of [[1400,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});await p.route(/googletagmanager|google-analytics/,r=>r.abort());
p.on('pageerror',e=>errs.push(w+': '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push(w+' console: '+m.text().slice(0,150))});
await p.goto(B+'/daily-practice');await p.waitForSelector('.stem',{timeout:15000});
const first=(await p.textContent('.stem')).trim();out.push(w+' q1: '+first.slice(0,70)+' | tags: '+(await p.locator('.q-head .tag').allTextContents()).join(', '));
let right=0;for(let i=0;i<5;i++){await p.locator('.option').first().click();if(await p.locator('.option.right').first().getAttribute('class').then(()=>true))right+=0;
 const fb=(await p.textContent('.feedback')).trim().slice(0,40);if(i===0)out.push(w+' feedback: '+fb);await p.click('.question .button.primary');}
await p.waitForSelector('.result');out.push(w+' result: '+(await p.textContent('.result h2')).trim()+' | '+(await p.textContent('.result p:nth-of-type(3)')).trim().replace(/\s+/g,' '));
await p.reload();await p.waitForSelector('.result',{timeout:15000});out.push(w+' after reload still shows result: yes, streak='+(await p.textContent('.streak strong')));
await p.click('.tracks button:has-text("Business analysis")');await p.waitForSelector('.stem');out.push(w+' BA track tags: '+(await p.locator('.q-head .tag').allTextContents()).join(', '));
await p.click('.tracks button:has-text("IT service")');await p.waitForSelector('.stem');out.push(w+' IT track tags: '+(await p.locator('.q-head .tag').allTextContents()).join(', '));
out.push(w+' term: '+(await p.textContent('#term-title')).trim());
const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);out.push(w+' horizontal overflow px: '+ov);
const ev=await p.evaluate(()=>(window.dataLayer||[]).map(a=>Array.from(a)).filter(a=>a[0]==='event'&&/daily/.test(a[1])).map(a=>a[1]+JSON.stringify(a[2])));out.push(w+' events: '+ev.join(' '));
await p.screenshot({path:'shot-'+w+'.png',fullPage:false});
await p.goto(B+'/');await p.waitForTimeout(1200);out.push(w+' home daily links: '+await p.locator('a[href="/daily-practice"]').count());
await p.close()}
console.log(out.join('\n'));console.log('errors',JSON.stringify(errs));await b.close()})();

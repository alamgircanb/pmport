const {chromium}=require('playwright');
const B=process.argv[2];
(async()=>{const b=await chromium.launch();const p=await b.newPage();
const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(()=>{window.__ev=[];const iv=setInterval(()=>{if(window.gtag&&!window.gtag.__w){const g=window.gtag;window.gtag=function(...a){if(a[0]==='event'||a[0]==='config')window.__ev.push(JSON.stringify(a));return g.apply(this,a)};window.gtag.__w=1}},5)});
const r=await p.goto(B+'/?internal=on');console.log('status',r.status(),p.url().slice(0,80));
await p.waitForTimeout(1500);
await p.click('.start a >> nth=0').catch(e=>console.log('noclick',e.message.slice(0,80)));
await p.waitForTimeout(800);
await p.goto(B+'/pm-calculators/communication-channels-calculator');await p.waitForTimeout(1500);
const inp=await p.$('#main-content input');if(inp){await inp.fill('12');await inp.dispatchEvent('input')}
await p.waitForTimeout(500);
await p.goto(B+'/resources/nine-women-one-month-brooks-law');await p.waitForTimeout(1500);
await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>window.__ev.join('\n')));
console.log('errors',errs);await b.close()})();

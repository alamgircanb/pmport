const {chromium}=require('playwright');const fs=require('fs');const B=process.argv[2];
(async()=>{const b=await chromium.launch();const out=[];const errs=[];
const f=p=>fs.readFileSync('dist/portfolio/browser/'+p,'utf8');
const jp=f('journeys/pmp-exam/index.html');out.push('prerender journey: '+/<title>([^<]*)/.exec(jp)[1]+' | steps listed='+(jp.match(/<li><strong>/g)||[]).length+' | og='+/og:image" content="([^"]*)/.exec(jp)?.[1]);
const sm=f('sitemap.xml');out.push('sitemap: journeys='+sm.includes('/journeys<')+' it-service='+sm.includes('/journeys/it-service<')+' my-progress='+sm.includes('/my-progress<'));
try{
for(const [w,h] of [[1400,900],[390,844]]){const ctx=await b.newContext({viewport:{width:w,height:h}});const p=await ctx.newPage();await p.route(/googletagmanager|google-analytics/,r=>r.abort());
p.on('pageerror',e=>errs.push(w+': '+e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED/.test(m.text()))errs.push(w+' console: '+m.text().slice(0,150))});
const ov=async tag=>{const o=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(o>0)out.push(w+' OVERFLOW '+tag+': '+o)};
await p.goto(B+'/journeys');await p.waitForSelector('.journey');out.push(w+' hub cards: '+await p.locator('article.journey').count()+' | chip before any points: '+await p.locator('.xp-chip').count());await ov('hub');
await p.click('.areas button:has-text("Business analysis")');out.push(w+' BA filter cards: '+await p.locator('article.journey').count());
await p.goto(B+'/journeys/pmp-exam');await p.waitForSelector('.path');out.push(w+' pmp steps: '+await p.locator('.path .step').count()+' | status: '+(await p.textContent('.status')).replace(/\s+/g,' ').trim().slice(0,90));await ov('journey');
await p.goto(B+'/pm-faciliter/pmp');await p.waitForTimeout(1500);out.push(w+' toast after visiting step page: '+(await p.locator('.toast').allTextContents()).join(' / ').replace(/\s+/g,' ').slice(0,120));
await p.goto(B+'/pm-calculators/earned-value-calculator');await p.waitForTimeout(1200);const inp=p.locator('#main-content input').first();await inp.fill('1234');await p.waitForTimeout(400);
out.push(w+' toast after using EVM: '+(await p.locator('.toast').allTextContents()).join(' / ').replace(/\s+/g,' ').slice(0,160));
await p.goto(B+'/daily-practice');await p.waitForSelector('.stem',{timeout:15000});for(let i=0;i<5;i++){await p.locator('.option').first().click();await p.click('.question .button.primary')}await p.waitForSelector('.result');await p.waitForTimeout(300);
out.push(w+' toasts after daily: '+(await p.locator('.toast strong').allTextContents()).join(' / '));
await p.goto(B+'/journeys/pmp-exam');await p.waitForSelector('.path');out.push(w+' pmp after: '+(await p.textContent('.status')).replace(/\s+/g,' ').trim().slice(0,70)+' | done nodes='+await p.locator('.path .step.done').count());
await p.locator('.path .step:not(.done) .link').first().click();await p.waitForTimeout(200);out.push(w+' after manual tick done nodes='+await p.locator('.path .step.done').count());
out.push(w+' chip: '+(await p.textContent('.xp-chip')).replace(/\s+/g,' ').trim());
await p.goto(B+'/my-progress');await p.waitForSelector('.level');out.push(w+' my-progress: '+(await p.textContent('.level')).replace(/\s+/g,' ').trim().slice(0,90)+' | streak: '+(await p.textContent('.streak h2')).replace(/\s+/g,' ').trim()+' | badges: '+(await p.textContent('.count'))+' ['+(await p.locator('.badges li.earned strong').allTextContents()).join(', ')+'] | log rows='+await p.locator('.log li').count());await ov('my-progress');
const robots=await p.getAttribute('meta[name=robots]','content');out.push(w+' my-progress robots: '+robots);
await p.goto(B+'/');await p.waitForTimeout(1000);out.push(w+' home links to journeys: '+await p.locator('a[href="/journeys"]').count());await ov('home');
await ctx.close()}
}catch(e){out.push('FAILED: '+e.message.split('\n')[0])}
console.log(out.join('\n'));console.log('errors',JSON.stringify(errs));await b.close()})();

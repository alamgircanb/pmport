const {chromium}=require('playwright');const B=process.argv[2];
(async()=>{const b=await chromium.launch();const out=[];const errs=[];
for(const [w,h] of [[1400,900],[390,844]]){const p=await b.newPage({viewport:{width:w,height:h}});await p.route(/googletagmanager|google-analytics/,r=>r.abort());p.on('pageerror',e=>errs.push(e.message));
await p.goto(B+'/');await p.waitForTimeout(1500);
out.push(w+' login links on home: '+await p.locator('a[href="/login"]').count()+', text "Member login"/"Log in": '+await p.locator('text=/Member login|^Log in$/').count());
await p.goto(B+'/login');await p.waitForTimeout(1500);out.push(w+' /login ends at: '+new URL(p.url()).pathname+' h1: '+(await p.locator('h1').first().textContent()).trim().slice(0,40));
await p.goto(B+'/pm-faciliter');await p.waitForTimeout(1500);out.push(w+' faciliter member links: '+await p.locator('a[href="/pm-faciliter/member"]').count());await p.close()}
console.log(out.join('\n'));console.log('errors',JSON.stringify(errs));await b.close()})();

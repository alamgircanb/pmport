const {chromium}=require('playwright');const fs=require('fs');
const out='tests/ui/out';fs.mkdirSync(out,{recursive:true});const base='http://localhost:4200';const log=[];let fail=0;
const check=(ok,msg)=>{log.push((ok?'PASS ':'FAIL ')+msg);if(!ok)fail++};
(async()=>{
  const b=await chromium.launch();
  for(const vp of [{name:'mob',width:390,height:844},{name:'desk',width:1366,height:900}]){
    const p=await (await b.newContext({viewport:{width:vp.width,height:vp.height}})).newPage();
    p.on('pageerror',e=>log.push(`[${vp.name}] pageerror ${e.message}`));
    const sim=base+'/pm-faciliter/pmp-exam-simulator';
    for(const [label,target] of [['Choose an exam','#exams'],['Practice by domain','#practice']]){
      await p.goto(sim);await p.waitForSelector('.sim-hero');
      await p.click(`.hero-actions >> text=${label}`);await p.waitForTimeout(1200);
      const url=new URL(p.url()).pathname;const top=await p.$eval(target,e=>Math.round(e.getBoundingClientRect().top));
      check(url==='/pm-faciliter/pmp-exam-simulator'&&top>=-5&&top<200,`[${vp.name}] "${label}" stays on ${url}, section top at ${top}px`);
      await p.screenshot({path:`${out}/${vp.name}-${target.slice(1)}.png`});
    }
    await p.goto(base+'/resources/future-project-management-canada');await p.waitForSelector('a[href*="ref1"]');
    await p.click('a[href*="ref1"] >> nth=0');await p.waitForTimeout(800);
    const url=new URL(p.url());const top=await p.$eval('#ref1',e=>Math.round(e.getBoundingClientRect().top));
    check(url.pathname==='/resources/future-project-management-canada'&&url.hash==='#ref1'&&Math.abs(top)<300,`[${vp.name}] article [1] link → ${url.pathname}${url.hash}, ref top ${top}px`);
    await p.goto(sim);await p.waitForSelector('.sim-hero');await p.keyboard.press('Tab');await p.keyboard.press('Enter');await p.waitForTimeout(300);
    check(new URL(p.url()).pathname==='/pm-faciliter/pmp-exam-simulator',`[${vp.name}] skip link stays on page (${new URL(p.url()).pathname})`);
  }
  await b.close();fs.writeFileSync(out+'/log.txt',log.join('\n')+'\n');console.log(log.join('\n'));process.exit(fail?1:0);
})().catch(e=>{fs.writeFileSync(out+'/log.txt',log.join('\n')+'\nFATAL '+e.stack);console.error(e);process.exit(1)});

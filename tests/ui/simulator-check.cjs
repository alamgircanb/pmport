const {chromium}=require('playwright');const fs=require('fs');
const out='tests/ui/out';fs.mkdirSync(out,{recursive:true});
const base='http://localhost:4200';const log=[];const seenCaps=new Set();
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,40);
async function answerCurrent(p){
  if(await p.$('.options .opt-main')){if(await p.$('.hint')){const o=await p.$$('.options .opt-main');await o[1].click();await o[2].click();}else await p.click('.options .opt-main >> nth=1');}
  else if(await p.$('.matching select')){for(const s of await p.$$('.matching select'))await s.selectOption({index:2});}
  else if(await p.$('.pull select'))await p.selectOption('.pull select',{index:2});
  else if(await p.$('.question .hot .region'))await p.click('.question .hot .region >> nth=1');
}
async function shotExhibits(p,tag){
  for(const fig of await p.$$('figure.exhibit')){const id=await fig.getAttribute('data-graphic');const key=tag.split('-')[0]+id;if(seenCaps.has(key))continue;seenCaps.add(key);await fig.scrollIntoViewIfNeeded();await fig.screenshot({path:`${out}/${tag}-exhibit-${id}.png`});}
}
async function takeExam(p,examId,tag,shoot){
  await p.goto(base+'/pm-faciliter/pmp-exam-simulator');await p.waitForSelector('.exam-card');
  await p.click(`.exam-card:nth-child(${examId}) .button.primary`);await p.waitForSelector('.sim-intro');
  if(shoot)await p.screenshot({path:`${out}/${tag}-intro.png`});
  await p.click('text=Start the exam');await p.waitForSelector('.stem');
  if(shoot)await p.screenshot({path:`${out}/${tag}-q1.png`});
  let total=0;
  for(let section=0;section<3;section++){
    for(let i=0;i<200;i++){
      await shotExhibits(p,tag);await answerCurrent(p);total++;
      const meta=await p.textContent('.bar-left span');const [cur,all]=meta.match(/(\d+) of (\d+)/).slice(1).map(Number);
      if(cur===all)break;await p.click('.exam-foot >> text=Next →');
    }
    await p.click('.exam-foot >> text=Review →');await p.waitForSelector('.review-grid');
    await p.click('.review-actions .button.primary');await p.click('text=Yes, continue');
    if(section<2){await p.waitForSelector('.break-card');await p.click('text=End break and continue');await p.waitForSelector('.stem');}
  }
  await p.waitForSelector('.sim-results');const title=await p.textContent('.sim-results .eyebrow');const pct=await p.textContent('.sim-results h1');
  log.push(`[${tag}] answered ${total}; results "${title.trim()}" ${pct.trim()}`);
  if(shoot)await p.screenshot({path:`${out}/${tag}-results.png`});
}
(async()=>{
  const b=await chromium.launch();
  for(const vp of [{name:'desk',width:1366,height:900,exams:[1,2,3]},{name:'mob',width:390,height:844,exams:[2]}]){
    const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height}});const p=await ctx.newPage();
    p.on('console',m=>{if(m.type()==='error')log.push(`[${vp.name}] console: ${m.text()}`)});p.on('pageerror',e=>log.push(`[${vp.name}] pageerror: ${e.message}`));
    // legacy save migration: seed an old v1 save for exam 1 shape
    await p.goto(base+'/pm-faciliter/pmp-exam-simulator');await p.waitForSelector('.exam-card');
    await p.screenshot({path:`${out}/${vp.name}-home.png`,fullPage:true});
    for(const ex of vp.exams)await takeExam(p,ex,`${vp.name}-exam${ex}`,true);
    await p.goto(base+'/pm-faciliter/pmp-exam-simulator');await p.waitForSelector('.exam-card');await p.waitForTimeout(300);
    await p.locator('#exams').screenshot({path:`${out}/${vp.name}-exam-cards-after.png`});
    const statuses=await p.$$eval('.exam-status',els=>els.map(e=>e.textContent.trim()));log.push(`[${vp.name}] card statuses: ${JSON.stringify(statuses)}`);
    // resume results of last exam
    await p.click(`.exam-card:nth-child(${vp.exams[vp.exams.length-1]}) .button.primary`);await p.waitForSelector('.sim-results');log.push(`[${vp.name}] resume shows results OK`);
    // practice with exam filter
    await p.goto(base+'/pm-faciliter/pmp-exam-simulator');await p.waitForSelector('.filters');
    await p.selectOption('.filters label:nth-child(1) select','2');await p.selectOption('.filters label:nth-child(2) select','Process');
    const cnt=await p.textContent('.practice-go .muted');log.push(`[${vp.name}] practice filter exam2+Process: ${cnt.trim()}`);
    await p.click('text=Start practice');await p.waitForSelector('.stem');await answerCurrent(p);await p.click('text=Check answer');await p.screenshot({path:`${out}/${vp.name}-practice.png`});
    log.push(`[${vp.name}] scrollWidth ${await p.evaluate(()=>document.documentElement.scrollWidth)}`);
    await ctx.close();
  }
  await b.close();fs.writeFileSync(out+'/log.txt',log.join('\n')+'\n');console.log(log.join('\n'));
})().catch(e=>{fs.writeFileSync(out+'/log.txt',log.join('\n')+'\nFATAL '+e.stack);console.error(e);process.exit(1)});

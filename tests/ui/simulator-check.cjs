const {chromium}=require('playwright');const fs=require('fs');
const out='tests/ui/out';fs.mkdirSync(out,{recursive:true});
const base='http://localhost:4200';const log=[];
(async()=>{
  const b=await chromium.launch();
  for(const vp of [{name:'desk',width:1366,height:900},{name:'mob',width:390,height:844}]){
    const ctx=await b.newContext({viewport:{width:vp.width,height:vp.height},deviceScaleFactor:1});
    const p=await ctx.newPage();
    p.on('console',m=>{if(m.type()==='error')log.push(`[${vp.name}] console: ${m.text()}`)});p.on('pageerror',e=>log.push(`[${vp.name}] pageerror: ${e.message}`));
    const shot=async n=>{await p.waitForTimeout(250);await p.screenshot({path:`${out}/${vp.name}-${n}.png`,fullPage:n.endsWith('full')})};
    await p.goto(base+'/pm-faciliter');await p.waitForSelector('.sim-feature');await shot('01-faciliter');
    await p.click('.sim-feature');await p.waitForSelector('.sim-hero');await shot('02-home-full');
    await p.click('text=Start full mock exam');await shot('03-intro');
    await p.click('text=Start the exam');await p.waitForSelector('.stem');await shot('04-exam-case');
    // answer every question by picking the first option / first choice / first hotspot
    const answerCurrent=async()=>{
      if(await p.$('.options .opt-main')){const need=await p.$('.hint');if(need){const opts=await p.$$('.options .opt-main');await opts[0].click();await opts[1].click();}else await p.click('.options .opt-main >> nth=0');}
      else if(await p.$('.matching select')){for(const s of await p.$$('.matching select'))await s.selectOption({index:1});}
      else if(await p.$('.pull select')){await p.selectOption('.pull select',{index:1});}
      else if(await p.$('.hot .region')){await p.click('.hot .region >> nth=0');}
    };
    let shots={};
    for(let section=0;section<3;section++){
      for(let i=0;i<200;i++){
        const meta=await p.textContent('.bar-left span');
        const has=async s=>!!(await p.$(s));
        const key=(await has('.matching'))?'matching':(await has('.hot .region'))?'hotspot':(await has('.pull'))?'dropdown':(await has('.hint'))?'multi':(await has('app-exam-graphic'))?'graphic':'';
        if(key&&!shots[key]){shots[key]=1;await answerCurrent();await shot('05-'+key);} else await answerCurrent();
        if(section===0&&i===3){await p.click('text=Flag for review');await p.click('text=Calculator');for(const k of ['4','8','0','/','5','4','0','='])await p.click(`.calc-keys button:text-is("${k}")`);await shot('06-calc-flag');await p.click('text=Calculator');await p.click('text=Navigator');await shot('07-navigator');await p.click('text=Navigator');}
        const [cur,total]=meta.match(/(\d+) of (\d+)/).slice(1).map(Number);
        if(cur===total)break;await p.click('.exam-foot >> text=Next →');
      }
      await p.click('.exam-foot >> text=Review →');await p.waitForSelector('.review-grid');if(section===0)await shot('08-review');
      await p.click('.review-actions .button.primary');await shot(section===0?'09-confirm':'09b-confirm');await p.click('text=Yes, continue');
      if(section<2){await p.waitForSelector('.break-card');if(section===0)await shot('10-break');await p.click('text=End break and continue');await p.waitForSelector('.stem');}
    }
    await p.waitForSelector('.sim-results');await shot('11-results-full');
    await p.click('text=Review incorrect answers');await p.waitForSelector('.sim-answers');await shot('12-answers');
    // resume check: reload keeps results
    await p.goto(base+'/pm-faciliter/pmp-exam-simulator');await p.waitForSelector('.sim-hero');await shot('13-home-saved');
    // practice
    await p.selectOption('.filters label:nth-child(1) select','People');await p.click('text=Start practice');await p.waitForSelector('.stem');await answerCurrent();await p.click('text=Check answer');await shot('14-practice-feedback');
    // home banner on mobile/desktop
    await p.goto(base+'/');await p.waitForSelector('.banner');await shot('15-home');
    log.push(`[${vp.name}] graphic types seen: ${Object.keys(shots).join(',')}`);
    const res=await p.evaluate(()=>document.documentElement.scrollWidth);log.push(`[${vp.name}] scrollWidth home ${res}`);
    await ctx.close();
  }
  await b.close();fs.writeFileSync(out+'/log.txt',log.join('\n')+'\n');console.log(log.join('\n'));
})().catch(e=>{fs.writeFileSync(out+'/log.txt',log.join('\n')+'\nFATAL '+e.stack);console.error(e);process.exit(1)});

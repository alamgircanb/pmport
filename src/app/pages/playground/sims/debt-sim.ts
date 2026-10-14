import {pct,type SimDef} from './sim-engine';

// Technical debt: a product team delivering a backlog sprint by sprint. Shortcuts deliver more now
// but build debt that slows every later sprint. Refactoring, test automation and code review cost
// capacity now and pay back later. One step is one two-week sprint.
export interface DebtState{t:number;done:number;scope:number;debt:number;cov:number;bugs:number;velocity:number;escaped:number;
  cap:{gross:number;features:number;refactor:number;automation:number;bugfix:number;support:number;review:number;drag:number};
  totalBugs:number;finishedAt:number|null;peakVelocity:number}

const drag=(d:number)=>d/(d+150);

export const DEBT:SimDef<DebtState>={
  id:'debt',eyebrow:'Playground 5 · Technical debt',title:'Technical debt: fast now, slow later?',
  intro:'A product team works through a backlog sprint by sprint. Cut corners to go faster, or invest in refactoring, test automation and code review. Watch velocity, technical debt and escaped defects change over time.',
  unit:'Sprint',horizon:p=>p['release']+6,maxSteps:40,
  defaults:{team:6,backlog:500,release:20,legacy:50,shortcuts:10,refactor:10,automation:5,review:1,churn:5,support:5},
  setup:[
    {key:'team',label:'Team',min:2,max:12,step:1,fmt:v=>v+' developers'},
    {key:'backlog',label:'Backlog',min:100,max:1500,step:50,fmt:v=>v+' points'},
    {key:'release',label:'Release target',min:4,max:30,step:1,fmt:v=>'Sprint '+v},
    {key:'legacy',label:'Starting technical debt',min:0,max:500,step:25,fmt:v=>v===0?'Clean codebase':v+' points'},
  ],
  levers:[
    {key:'shortcuts',label:'Shortcuts under pressure',min:0,max:50,step:5,fmt:v=>v+'% of work'},
    {key:'refactor',label:'Refactoring',min:0,max:40,step:5,fmt:v=>v+'% of capacity'},
    {key:'automation',label:'Test automation',min:0,max:30,step:5,fmt:v=>v+'% of capacity'},
    {key:'review',label:'Code review on every change',min:0,max:1,step:1,kind:'toggle'},
  ],
  disturbances:[
    {key:'churn',label:'Requirement churn',min:0,max:30,step:5,fmt:v=>v+'% of delivered work changes'},
    {key:'support',label:'Production support load',min:0,max:40,step:5,fmt:v=>v+'% of capacity'},
  ],
  charts:[
    {title:'Burn-up: features delivered vs scope',fmt:'n',series:[{key:'scope',label:'Scope',color:'#ff8f8f'},{key:'done',label:'Delivered',color:'#49cce1',style:'area'}],
      refs:p=>[{axis:'x',v:p['release'],label:'Release target'}]},
    {title:'Velocity (feature points per sprint)',fmt:'n',series:[{key:'velocity',label:'Velocity',color:'#5fd68a'},{key:'escaped',label:'Escaped defects',color:'#ff8f8f',style:'bars'}]},
    {title:'Technical debt and test coverage',fmt:'n',series:[{key:'debt',label:'Technical debt (points)',color:'#f6c35b',style:'area'},{key:'covPts',label:'Test coverage (% × 5)',color:'#9b8cff',style:'dash'}]},
  ],
  model:{
    create:p=>({t:0,done:0,scope:p['backlog'],debt:p['legacy'],cov:0.2,bugs:0,velocity:0,escaped:0,
      cap:{gross:0,features:0,refactor:0,automation:0,bugfix:0,support:0,review:0,drag:0},totalBugs:0,finishedAt:null,peakVelocity:0}),
    step(s,p){
      const ev:string[]=[];s.t++;const sc=p['shortcuts']/100;const gross=p['team']*8;
      const support=gross*p['support']/100;const review=p['review']?gross*0.08:0;
      const bugfix=Math.min(s.bugs*2,gross*0.5);s.bugs=Math.max(0,s.bugs-bugfix/2);
      const avail=Math.max(0,gross-support-review-bugfix);
      const refactor=avail*p['refactor']/100,automation=avail*p['automation']/100,featCap=avail-refactor-automation;
      const eff=1-0.7*drag(s.debt);const features=Math.min(s.scope-s.done,featCap*eff*(1+0.5*sc));
      s.done+=features;s.velocity=features;s.peakVelocity=Math.max(s.peakVelocity,features);
      const added=features*p['churn']/100;s.scope+=added;
      const newDebt=features*(1.2*sc+0.15*(1-s.cov)*(p['review']?0.5:1));const repaid=Math.min(s.debt+newDebt,refactor*3);
      s.debt=Math.max(0,s.debt+newDebt-repaid);
      s.cov=Math.min(0.95,s.cov+0.02*automation*(1-s.cov))-s.cov*0.25*sc*features/Math.max(1,gross);s.cov=Math.max(0,s.cov);
      const escaped=features*(0.05+0.0004*s.debt)*(1-0.7*s.cov)*(p['review']?0.6:1)*(1+sc);s.bugs+=escaped;s.escaped=escaped;s.totalBugs+=escaped;
      s.cap={gross,features:featCap*eff,refactor,automation,bugfix,support,review,drag:featCap*(1-eff)};
      if(drag(s.debt)>0.4&&s.t%3===0)ev.push(`Technical debt now slows feature work by ${Math.round(0.7*drag(s.debt)*100)}%: every change touches fragile code.`);
      if(escaped>6)ev.push(`${Math.round(escaped)} defects escaped to production this sprint. They will take capacity next sprint.`);
      if(added>5&&s.t%4===0)ev.push(`Requirement churn added ${Math.round(added)} points of changes to the backlog.`);
      if(s.done>=s.scope-0.01&&s.finishedAt===null){s.finishedAt=s.t;ev.push(`Release complete in sprint ${s.t}.`);}
      return {row:{scope:s.scope,done:s.done,velocity:features,escaped,debt:s.debt,covPts:s.cov*500},events:ev};
    },
    finished:s=>s.finishedAt!==null,
    tiles(s,p){const left=s.scope-s.done;const fc=s.finishedAt??(s.velocity>0.5?Math.ceil(s.t+left/s.velocity):null);return [
      {label:'Delivered / scope',value:`${Math.round(s.done)} / ${Math.round(s.scope)}`},
      {label:s.finishedAt?'Released':'Forecast release',value:fc===null?'–':'Sprint '+fc,tone:fc===null?undefined:fc<=p['release']?'good':'bad'},
      {label:s.finishedAt?'Average velocity':'Velocity (last sprint)',value:Math.round(s.finishedAt?s.done/s.t:s.velocity)+' pts',sub:'peak '+Math.round(s.peakVelocity),tone:!s.finishedAt&&s.velocity<s.peakVelocity*0.75&&s.t>3?'bad':undefined},
      {label:'Technical debt',value:Math.round(s.debt)+' pts',sub:'slows work by '+Math.round(0.7*drag(s.debt)*100)+'%',tone:drag(s.debt)>0.4?'bad':drag(s.debt)<0.15?'good':undefined},
      {label:'Test coverage',value:pct(s.cov),tone:s.cov>=0.6?'good':s.cov<0.2?'bad':undefined},
      {label:'Escaped defects',value:Math.round(s.totalBugs)+' total',sub:Math.round(s.bugs)+' still open',tone:s.escaped>5?'bad':undefined},
    ];},
    stack:s=>({title:`Where this sprint's capacity went (${Math.round(s.cap.gross)} pts)`,parts:[
      {label:'New features',v:s.cap.features,color:'#49cce1'},{label:'Lost to debt drag',v:s.cap.drag,color:'#f6c35b'},{label:'Bug fixing',v:s.cap.bugfix,color:'#ff8f8f'},
      {label:'Refactoring',v:s.cap.refactor,color:'#5fd68a'},{label:'Test automation',v:s.cap.automation,color:'#9b8cff'},{label:'Code review',v:s.cap.review,color:'#7aa7d6'},{label:'Support',v:s.cap.support,color:'#2a4a6a'}]}),
    insights(s,p,rows){const out:string[]=[];
      out.push(s.finishedAt?`Released in sprint ${s.finishedAt} against a target of sprint ${p['release']}.`:`Not released after ${s.t} sprints.`);
      const early=rows.slice(0,3).map(r=>r['velocity']),late=rows.slice(-4,-1).map(r=>r['velocity']);const e=early.reduce((a,b)=>a+b,0)/Math.max(1,early.length),l=late.reduce((a,b)=>a+b,0)/Math.max(1,late.length);
      if(p['shortcuts']>=20&&l<e*0.85)out.push(`Shortcuts made the first sprints fast (${Math.round(e)} points), but debt piled up and velocity fell to ${Math.round(l)} points by the end. That is the interest on technical debt.`);
      if(p['refactor']===0&&s.debt>150)out.push(`With no refactoring, debt reached ${Math.round(s.debt)} points and slowed feature work by ${Math.round(0.7*drag(s.debt)*100)}%. Paying some debt back every sprint keeps velocity stable.`);
      if(p['refactor']>=30)out.push(`Spending ${p['refactor']}% on refactoring kept the code clean but left little capacity for features. Balance matters.`);
      if(p['automation']>0&&s.cov>0.5)out.push(`Test automation raised coverage to ${pct(s.cov)}, so fewer defects escaped and less capacity went on bug fixing.`);
      if(!p['review'])out.push('Without code review, more debt and more defects slipped in. Review costs about 8% of capacity and pays for itself on most teams.');
      if(s.totalBugs>40)out.push(`${Math.round(s.totalBugs)} defects escaped to production. Each one cost capacity in a later sprint.`);
      return out;},
  },
  challenges:[
    {id:'feature-factory',title:'The feature factory',story:'Management wants features, nothing else. The team cuts corners on 40% of the work and has stopped refactoring and writing automated tests.',
      goal:'Release by sprint 20.',params:{shortcuts:40,refactor:0,automation:0},
      hint:'Stop the shortcuts and spend 10–15% on refactoring. It feels slower at first, but velocity holds up.',
      check:s=>({ok:s.finishedAt!==null&&s.finishedAt<=20,detail:s.finishedAt?`Released in sprint ${s.finishedAt}.`:'Not released yet.'})},
    {id:'legacy',title:'Inheriting a legacy codebase',story:'You take over a product with years of accumulated debt (300 points) and almost no automated tests.',
      goal:'Release by sprint 21 with fewer than 25 escaped defects.',params:{legacy:300,backlog:400,refactor:5,automation:0,release:21},
      hint:'Invest early: 20% refactoring and 10% test automation pay back within a few sprints.',
      check:s=>({ok:s.finishedAt!==null&&s.finishedAt<=21&&s.totalBugs<25,detail:`${s.finishedAt?`Released in sprint ${s.finishedAt}`:'Not released'}, ${Math.round(s.totalBugs)} escaped defects.`})},
    {id:'quality',title:'Skip the reviews',story:'To go faster, the team drops code review and test automation. Production support already takes 20% of the time.',
      goal:'Release by sprint 21 with fewer than 20 escaped defects.',params:{review:0,automation:0,support:20,release:21},
      hint:'Turn code review back on and add a little test automation (about 5%). Fewer defects means less bug fixing later.',
      check:s=>({ok:s.finishedAt!==null&&s.finishedAt<=21&&s.totalBugs<20,detail:`${s.finishedAt?`Released in sprint ${s.finishedAt}`:'Not released'}, ${Math.round(s.totalBugs)} escaped defects.`})},
  ],
  principles:[
    {title:'Technical debt',text:'Shortcuts save effort now and charge interest later: every change to messy code takes longer and is more likely to break something.'},
    {title:'Paying debt back',text:'A steady share of each sprint spent on refactoring keeps velocity stable. Paying nothing back lets the interest grow.'},
    {title:'Built-in quality',text:'Test automation and code review cost capacity now but cut escaped defects, which are far more expensive to fix in production.'},
    {title:'Sustainable pace',text:'The fastest team over a whole release is rarely the fastest team in the first few sprints.'},
  ],
};

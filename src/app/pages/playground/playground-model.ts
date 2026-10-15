// Playground: a week-by-week teaching model of a software/business project.
// It shows the direction and dynamics of common PM effects (Brooks's law, WIP, overtime, quality, scope creep),
// not precise forecasts. All randomness comes from a seeded generator, so a shared link replays the same run.

export type Approach='agile'|'predictive'|'hybrid';
export interface Params{
  scope:number;          // initial scope in story points (or work units)
  deadline:number;       // planned duration in weeks
  budget:number;         // approved budget ($)
  team:number;           // starting team size (experienced people)
  rate:number;           // points per productive person-week
  costPerWeek:number;    // cost per person-week ($)
  approach:Approach;
  meetings:number;       // % of time in meetings and admin
  wip:number;            // work items in progress per person
  overtime:number;       // % extra hours
  testing:number;        // % of capacity spent on testing and reviews
  creep:number;          // % scope growth per week
  changeControl:boolean; // formal change control (rejects about half the new scope, small overhead)
  risk:number;           // % chance of a risk event each week
  turnover:number;       // % chance per week that one person leaves (replaced by a new hire)
  seed:number;
}
export const DEFAULT_PARAMS:Params={scope:300,deadline:18,budget:450000,team:5,rate:8,costPerWeek:5000,approach:'agile',meetings:15,wip:2,overtime:0,testing:20,creep:0,changeControl:false,risk:10,turnover:0,seed:7};

interface Member{tenure:number}           // weeks on the project (new hires ramp up over 4 weeks)
export interface WeekLog{
  week:number;scope:number;done:number;bugs:number;hiddenBugs:number;cost:number;velocity:number;
  morale:number;fatigue:number;team:number;newcomers:number;channels:number;pv:number;ev:number;cpi:number;spi:number;forecast:number|null;
  capacity:{gross:number;meetings:number;communication:number;switching:number;mentoring:number;testing:number;bugfix:number;net:number};
  events:string[];
}
export interface SimState{params:Params;week:number;scope:number;done:number;bugs:number;hiddenBugs:number;cost:number;morale:number;fatigue:number;
  members:Member[];history:WeekLog[];finished:boolean;finishWeek:number|null;rand:()=>number;pendingAdds:number;pendingEvents:string[]}

function seeded(seed:number){let s=Math.floor(seed*1e5)>>>0||1;return ()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
const clamp=(v:number,a:number,b:number)=>Math.min(b,Math.max(a,v));

export function createSim(p:Params):SimState{
  return {params:{...p},week:0,scope:p.scope,done:0,bugs:0,hiddenBugs:0,cost:0,morale:0.8,fatigue:0,
    members:Array.from({length:Math.max(1,Math.round(p.team))},()=>({tenure:20})),history:[],finished:false,finishWeek:null,rand:seeded(p.seed),pendingAdds:0,pendingEvents:[]};
}

/** Adds people at the start of the next week (they need onboarding and mentoring). */
export function addPeople(s:SimState,n:number){s.pendingAdds+=n;}

/** Advances the project by one week and returns that week's log. */
export function step(s:SimState):WeekLog{
  const p=s.params;const events:string[]=[...s.pendingEvents];s.pendingEvents=[];
  s.week++;
  if(s.pendingAdds>0){for(let i=0;i<s.pendingAdds;i++)s.members.push({tenure:0});events.push(`${s.pendingAdds} new ${s.pendingAdds===1?'person joins':'people join'} the team (onboarding starts).`);s.pendingAdds=0;}
  // Turnover: an experienced person leaves and is replaced by a new hire.
  if(p.turnover>0&&s.rand()<p.turnover/100&&s.members.length>1){
    const i=s.members.findIndex(m=>m.tenure>=6);if(i>=0){s.members.splice(i,1);s.members.push({tenure:0});events.push('An experienced team member leaves; a new hire replaces them.');s.morale=clamp(s.morale-0.05,0,1);}
  }
  const n=s.members.length;const channels=n*(n-1)/2;
  // Productivity per person: new hires ramp from 10% to 100% over 6 weeks.
  const RAMP=6;
  const personOutput=s.members.reduce((sum,m)=>sum+(m.tenure>=RAMP?1:0.1+0.15*m.tenure),0);
  const newcomers=s.members.filter(m=>m.tenure<RAMP).length;
  const productivity=(0.8+0.25*s.morale)*(1-0.5*s.fatigue);
  const gross=personOutput*p.rate*(1+p.overtime/100)*productivity;
  // Deductions, as fractions of gross capacity.
  const agileOverhead=p.approach==='agile'?5:p.approach==='hybrid'?3:0;
  const meetingsPct=clamp((p.meetings+agileOverhead)/100,0,0.8);
  const commPct=clamp(0.004*channels,0,0.35);
  const blockedIdle=Math.pow(0.15,Math.max(1,p.wip));                 // all your items blocked at once
  const switchPct=1-(1/(1+0.12*(Math.max(1,p.wip)-1)))*(1-blockedIdle);
  // Each new hire takes up to half a person-week of mentoring from the experienced team, tapering as they learn.
  const mentoringPct=clamp(s.members.reduce((sum,m)=>sum+(m.tenure<RAMP?0.5-0.07*m.tenure:0),0)/Math.max(1,n),0,0.5);
  const changeCtlPct=p.changeControl?0.03:0;
  let remainingFrac=1-meetingsPct-commPct-mentoringPct-changeCtlPct;remainingFrac=Math.max(0.05,remainingFrac)*(1-switchPct);
  const afterOverheads=gross*remainingFrac;
  const testingPts=afterOverheads*p.testing/100;
  let available=afterOverheads-testingPts;
  // Bug fixing: agile and hybrid fix visible bugs as they go (up to half the capacity).
  let bugfix=0;
  if(s.bugs>0){const share=p.approach==='predictive'?(s.done>=s.scope*0.999?1:0):p.approach==='hybrid'?0.35:0.5;bugfix=Math.min(s.bugs,available*share);s.bugs-=bugfix;available-=bugfix;}
  // New work.
  const remaining=Math.max(0,s.scope-s.done);const work=Math.min(available,remaining);
  // Predictive: once build is complete, all remaining capacity goes to fixing bugs.
  if(p.approach==='predictive'&&remaining<=1e-9&&available>0&&s.bugs>0){const extra=Math.min(s.bugs,available);s.bugs-=extra;bugfix+=extra;available-=extra;}
  s.done+=work;
  // Defects: base 25% of new work, reduced by testing, increased by fatigue and rushing.
  const testCoverage=clamp(p.testing/20,0,1);
  // Bugs are stored as the effort needed to fix them: the later a defect is found, the more it costs to fix.
  const fixCost=p.approach==='predictive'?3.5:p.approach==='hybrid'?2.5:2;
  const defects=work*0.4*(1-0.85*testCoverage)*(1+1.5*s.fatigue)*(p.overtime>20?1.2:1)*fixCost;
  if(p.approach==='predictive'){s.hiddenBugs+=defects;if(s.done>=s.scope*0.8&&s.hiddenBugs>0){s.bugs+=s.hiddenBugs;events.push(`Testing phase finds ${Math.round(s.hiddenBugs)} points of defects that were hidden until now.`);s.hiddenBugs=0;}}
  else if(p.approach==='hybrid'){s.bugs+=defects*0.6;s.hiddenBugs+=defects*0.4;if(s.done>=s.scope*0.8&&s.hiddenBugs>0){s.bugs+=s.hiddenBugs;events.push(`Integration testing finds ${Math.round(s.hiddenBugs)} points of defects.`);s.hiddenBugs=0;}}
  else s.bugs+=defects;
  // Scope creep: in predictive projects late changes also cause rework of finished work.
  if(p.creep>0&&s.done<s.scope){
    let added=s.scope*p.creep/100*(0.6+0.8*s.rand());if(p.changeControl)added*=0.5;
    s.scope+=added;
    if(p.approach!=='agile'){const progress=s.done/s.scope;const rework=added*(p.approach==='predictive'?1.5:0.7)*progress;s.done=Math.max(0,s.done-rework);if(rework>1)events.push(`A late change forces ${Math.round(rework)} points of rework on finished work.`);}
  }
  // Risk events.
  if(p.risk>0&&s.rand()<p.risk/100){
    const kind=s.rand();
    if(kind<0.4){const lost=Math.round(5+s.rand()*15);s.done=Math.max(0,s.done-lost);events.push(`Risk event: an integration problem undoes ${lost} points of work.`);}
    else if(kind<0.7){const extra=Math.round(10+s.rand()*20);s.scope+=extra;events.push(`Risk event: a missed requirement adds ${extra} points of scope.`);}
    else{const c=Math.round((15000+s.rand()*25000)/1000)*1000;s.cost+=c;events.push(`Risk event: a supplier price increase costs $${c.toLocaleString('en-CA')}.`);}
  }
  // Cost (overtime is paid at 1.5×).
  s.cost+=n*p.costPerWeek*(1+1.5*p.overtime/100);
  // Fatigue and morale.
  if(p.overtime>0)s.fatigue=clamp(s.fatigue+p.overtime/100*0.35-0.02,0,1);else s.fatigue=clamp(s.fatigue-0.12,0,1);
  const behind=s.week>p.deadline&&s.done<s.scope;
  s.morale=clamp(s.morale+(work>0?0.01:0)-0.12*s.fatigue-(behind?0.02:0)-(s.bugs>s.scope*0.15?0.02:0)+(p.overtime===0&&s.fatigue<0.1?0.01:0),0.05,1);
  if(s.fatigue>0.5&&!s.history.some(h=>h.fatigue>0.5))events.push('The team is exhausted: fatigue is now cutting productivity and raising defects.');
  for(const m of s.members)m.tenure++;
  // Earned value (against the current scope).
  const pv=p.budget*Math.min(1,s.week/p.deadline);
  const ev=p.budget*clamp(s.done/Math.max(1,s.scope),0,1)*(s.scope>0?1:0);
  const velocity=work;
  s.finished=s.done>=s.scope-1e-6&&s.bugs<0.5&&s.hiddenBugs<0.5;
  if(s.finished&&s.finishWeek===null){s.finishWeek=s.week;events.push(`Project complete in week ${s.week}.`);}
  // Forecast: remaining work and bugs divided by recent net throughput.
  const recent=[...s.history.slice(-2).map(h=>h.capacity.net),work+bugfix];const avg=recent.reduce((a,b)=>a+b,0)/recent.length;
  const left=Math.max(0,s.scope-s.done)+s.bugs+s.hiddenBugs;
  const forecast=s.finished?s.week:avg>0.5?Math.ceil(s.week+left/avg):null;
  const log:WeekLog={week:s.week,scope:s.scope,done:s.done,bugs:s.bugs,hiddenBugs:s.hiddenBugs,cost:s.cost,velocity,morale:s.morale,fatigue:s.fatigue,team:n,newcomers,channels,pv,ev,
    cpi:s.cost>0?ev/s.cost:1,spi:pv>0?ev/pv:1,forecast,
    capacity:{gross,meetings:gross*meetingsPct,communication:gross*commPct,switching:gross*(1-meetingsPct-commPct-mentoringPct-changeCtlPct)*switchPct,mentoring:gross*mentoringPct,testing:testingPts,bugfix,net:work+bugfix},events};
  s.history.push(log);return log;
}

/** Runs until the project finishes or reaches the week limit (used for previews and tests). */
export function runAll(p:Params,maxWeeks=60,adds:{week:number;n:number}[]=[]):SimState{
  const s=createSim(p);
  while(!s.finished&&s.week<maxWeeks){const a=adds.find(x=>x.week===s.week+1);if(a)addPeople(s,a.n);step(s);}
  return s;
}

/* ---------- Challenges ---------- */
export interface Challenge{id:string;title:string;story:string;goal:string;params:Partial<Params>;check:(s:SimState)=>{ok:boolean;detail:string};hint:string}
const budgetUse=(s:SimState)=>s.cost/s.params.budget;
export const CHALLENGES:Challenge[]=[
  {id:'rescue',title:'Rescue the late project',story:'Five people, 360 points, 16 weeks. The team juggles four items each, a quarter of the week goes to meetings and testing was cut. The sponsor says "just add more people!"',
    goal:'Finish by week 22 and spend no more than 125% of the budget.',params:{scope:360,deadline:16,budget:450000,team:5,meetings:25,wip:4,testing:5,risk:10,creep:0,overtime:0,approach:'agile',changeControl:false,turnover:0,seed:7},
    hint:'Adding people late costs onboarding, mentoring and communication time. Fix the system first: limit WIP, cut meetings and restore testing.',
    check:s=>({ok:s.finishWeek!==null&&s.finishWeek<=22&&budgetUse(s)<=1.25,detail:`Finished in week ${s.finishWeek??'–'}, ${Math.round(budgetUse(s)*100)}% of budget used.`})},
  {id:'burnout',title:'Hit the date without burning out',story:'A tight deadline: 330 points in 15 weeks with six people. The team has been told to work 30% overtime.',
    goal:'Finish by week 16 with team morale at 50% or higher.',params:{scope:330,deadline:15,budget:480000,team:6,overtime:30,meetings:15,wip:2,testing:20,risk:5,creep:0,approach:'agile',changeControl:false,turnover:0,seed:7},
    hint:'Sustained overtime builds fatigue, which lowers productivity and adds defects. A sustainable pace often finishes sooner.',
    check:s=>{const m=s.history[s.history.length-1]?.morale??0;return {ok:s.finishWeek!==null&&s.finishWeek<=16&&m>=0.5,detail:`Finished in week ${s.finishWeek??'–'}, final morale ${Math.round(m*100)}%.`};}},
  {id:'change',title:'Absorb heavy scope change',story:'Requirements keep moving: about 2% new scope arrives every week, and the project is planned the traditional (predictive) way.',
    goal:'Finish by week 22 and spend no more than 125% of the budget.',params:{scope:300,deadline:18,budget:450000,team:5,approach:'predictive',creep:2,changeControl:false,meetings:15,wip:2,testing:20,risk:5,overtime:0,turnover:0,seed:7},
    hint:'In a predictive plan, late changes cause rework of finished work. Try an agile approach, and switch on change control.',
    check:s=>({ok:s.finishWeek!==null&&s.finishWeek<=22&&budgetUse(s)<=1.25,detail:`Finished in week ${s.finishWeek??'–'}, ${Math.round(budgetUse(s)*100)}% of budget used.`})},
  {id:'quality',title:'Quality pays for itself',story:'To "save time", the team skipped testing on a hybrid project. Bugs are piling up behind the progress bar.',
    goal:'Finish by week 19 and spend no more than 105% of the budget.',params:{scope:300,deadline:18,budget:450000,team:5,testing:0,meetings:15,wip:2,risk:5,overtime:0,creep:0,approach:'hybrid',changeControl:false,turnover:0,seed:7},
    hint:'Testing costs capacity now but prevents far more bug-fixing later. Somewhere around 20% is a good place to start.',
    check:s=>({ok:s.finishWeek!==null&&s.finishWeek<=19&&budgetUse(s)<=1.05,detail:`Finished in week ${s.finishWeek??'–'}, ${Math.round(budgetUse(s)*100)}% of budget used.`})},
];

/** Plain-English lessons drawn from what happened in a run. */
export function insights(s:SimState):string[]{
  const h=s.history,p=s.params,out:string[]=[];if(!h.length)return out;
  const last=h[h.length-1];
  const joins=h.filter(x=>x.events.some(e=>/join/.test(e)));
  for(const j of joins){const before=h.find(x=>x.week===j.week-1)?.velocity??0;const dip=h.filter(x=>x.week>=j.week&&x.week<j.week+3).map(x=>x.velocity);
    if(dip.length&&Math.min(...dip)<before)out.push(`Brooks's law: after people joined in week ${j.week}, velocity fell from ${before.toFixed(0)} to ${Math.min(...dip).toFixed(0)} points while they were onboarded and mentored, and communication channels grew to ${j.channels}.`);}
  if(p.wip>=4)out.push(`High WIP (${p.wip} items per person) cost about ${Math.round(last.capacity.switching/Math.max(1,last.capacity.gross)*100)}% of capacity to context switching. Limiting WIP to 1–2 usually finishes work sooner.`);
  if(Math.max(...h.map(x=>x.fatigue))>0.4)out.push('Overtime built up fatigue. Output rose briefly, then productivity fell and defects rose. Sustainable pace usually wins on anything longer than a couple of weeks.');
  const fixed=h.reduce((a,x)=>a+x.capacity.bugfix,0);if(fixed>p.scope*0.15)out.push(`The team spent ${Math.round(fixed)} points of capacity fixing defects (${Math.round(fixed/p.scope*100)}% of the original scope). More testing earlier would have prevented much of it.`);
  if(h.some(x=>x.events.some(e=>/rework/.test(e))))out.push('Late changes in a plan-driven approach forced rework of finished work. Agile absorbs change into the backlog; change control limits how much arrives.');
  if(last.channels>=36)out.push(`With ${last.team} people there are ${last.channels} communication channels, using about ${Math.round(Math.min(0.35,0.004*last.channels)*100)}% of capacity. Consider splitting into smaller teams.`);
  if(p.meetings>=25)out.push(`${p.meetings}% of time in meetings is a large tax on delivery. Review which meetings create decisions.`);
  if(s.finishWeek!==null)out.push(s.finishWeek<=p.deadline?`Delivered in week ${s.finishWeek}, on or before the planned ${p.deadline} weeks.`:`Delivered in week ${s.finishWeek}, ${s.finishWeek-p.deadline} week${s.finishWeek-p.deadline===1?'':'s'} after the plan.`);
  const cpi=last.cpi;if(s.finished)out.push(`Final cost ${Math.round(s.cost/1000)}k vs budget ${Math.round(p.budget/1000)}k (${Math.round(s.cost/p.budget*100)}%).`);
  else if(cpi<0.9)out.push(`CPI is ${cpi.toFixed(2)}: each dollar spent is earning about ${Math.round(cpi*100)} cents of planned work.`);
  return out;
}

/* ---------- Shareable links ---------- */
const KEYS:(keyof Params)[]=['scope','deadline','budget','team','rate','costPerWeek','approach','meetings','wip','overtime','testing','creep','changeControl','risk','turnover','seed'];
export function toQuery(p:Params):Record<string,string>{return Object.fromEntries(KEYS.map(k=>[k,String(p[k])]));}
export function fromQuery(q:Record<string,string|undefined>,base:Params=DEFAULT_PARAMS):Params{
  const p={...base} as Record<string,unknown>;
  for(const k of KEYS){const v=q[k];if(v===undefined)continue;
    if(k==='approach'){if(['agile','predictive','hybrid'].includes(v))p[k]=v;}
    else if(k==='changeControl')p[k]=v==='true';
    else{const x=Number(v);if(isFinite(x))p[k]=x;}}
  const r=p as unknown as Params;
  r.scope=clamp(r.scope,20,2000);r.deadline=clamp(Math.round(r.deadline),2,104);r.team=clamp(Math.round(r.team),1,40);r.rate=clamp(r.rate,1,30);
  r.meetings=clamp(r.meetings,0,60);r.wip=clamp(Math.round(r.wip),1,8);r.overtime=clamp(r.overtime,0,60);r.testing=clamp(r.testing,0,50);
  r.creep=clamp(r.creep,0,10);r.risk=clamp(r.risk,0,50);r.turnover=clamp(r.turnover,0,20);r.budget=clamp(r.budget,1000,1e9);r.costPerWeek=clamp(r.costPerWeek,100,1e6);
  return r;
}

import {clamp,money,seeded,type P,type SimDef} from './sim-engine';

// Risk and reserve: a project with a risk register, a contingency reserve and unknown-unknowns.
// Shows expected monetary value (EMV), the value (and cost) of risk responses, review cadence,
// early-warning triggers and why reserves exist. One step is one week.
// Each risk draws its random numbers when it is created, so changing your decisions changes the outcome of a risk,
// not which random numbers it gets (a fair comparison between runs with the same seed).
interface Risk{name:string;p:number;cost:number;delay:number;from:number;to:number;emergent:boolean;responded:boolean;hit:boolean;u:number;uc:number;ud:number}
export interface RiskState{t:number;rand:()=>number;rem:number;risks:Risk[];spent:{base:number;impact:number;delay:number;mitigation:number;monitoring:number};
  hits:number;unknownHits:number;env:()=>number;lastHitCost:number;respondedCount:number;weekly:number;reserve:number;names:string[]}

const NAMES=['Key supplier delivers late','Regulator changes a requirement','Integration defect found late','Key specialist leaves','Vendor raises prices',
  'Data migration errors','Security review finding','Hardware arrives late','Scope dispute with the client','Test environment unavailable',
  'Permit approval is slow','Exchange rate moves against us','Sponsor reprioritises','Third-party API changes','Performance problems under load',
  'Subcontractor quality issues','Licence costs higher than quoted','Stakeholder rejects the design','Cyber incident at a partner','Weather delays site work'];

const reserveLeft=(s:RiskState)=>s.reserve-(s.spent.impact+s.spent.delay+s.spent.mitigation+s.spent.monitoring);
export const totalCost=(s:RiskState)=>s.spent.base+s.spent.impact+s.spent.delay+s.spent.mitigation+s.spent.monitoring;
/** Strength of risk responses (0–1). Diminishing returns on spend; responses lose force when nobody follows up on them at reviews. */
const mitStrength=(p:P)=>(1-Math.exp(-p['mitigation']/4))*Math.max(0.4,1-0.1*(p['review']-1));
function exposure(s:RiskState,p:P){
  let e=0;const m=mitStrength(p);
  for(const r of s.risks){if(r.hit||r.to<=s.t)continue;const left=(r.to-Math.max(s.t,r.from-1))/(r.to-r.from+1);
    const prob=r.p*(r.responded?1-0.75*m:1)*clamp(left,0,1);e+=prob*r.cost*(r.responded?1-0.4*m:1)*p['severity']/100;}
  return e;
}
function makeRisk(s:RiskState,p:P,from:number,emergent:boolean):Risk{
  const r=s.env;const len=2+Math.floor(r()*5);const name=s.names.length?s.names.splice(Math.floor(r()*s.names.length),1)[0]:'Unexpected issue';
  return {name,p:0.2+r()*0.35,cost:p['budget']*(0.01+r()*0.025),delay:r()<0.3?1:0,from,to:from+len,emergent,responded:false,hit:false,u:r(),uc:r(),ud:r()};
}

export const RISK:SimDef<RiskState>={
  id:'risk',eyebrow:'Playground 3 · Risk and reserve',title:'Risk and reserve: respond, review, or hope',
  intro:'Your project has a risk register and a contingency reserve. Choose how much to spend on risk responses and how often to review risks, then watch which risks hit, how fast the reserve drains and whether the project still lands on budget.',
  unit:'Week',horizon:p=>p['duration']+6,maxSteps:60,
  defaults:{duration:20,budget:1000000,reserve:10,risks:10,mitigation:5,review:2,warning:0,emergent:25,unknowns:1,severity:100,seed:5},
  setup:[
    {key:'duration',label:'Planned duration',min:8,max:40,step:1,fmt:v=>v+' weeks'},
    {key:'budget',label:'Budget (without reserve)',min:100000,max:5000000,step:50000,fmt:money},
    {key:'reserve',label:'Contingency reserve',min:0,max:30,step:1,fmt:v=>v+'% of budget'},
    {key:'risks',label:'Risks in the register at start',min:0,max:20,step:1,fmt:v=>v+' risks'},
  ],
  levers:[
    {key:'mitigation',label:'Spend on risk responses',min:0,max:30,step:1,fmt:v=>v+'% of weekly spend'},
    {key:'review',label:'Review the register every',min:1,max:10,step:1,fmt:v=>v===1?'Week':v+' weeks'},
    {key:'warning',label:'Early-warning triggers and contingency plans',min:0,max:1,step:1,kind:'toggle'},
  ],
  disturbances:[
    {key:'emergent',label:'New risks emerging',min:0,max:80,step:5,fmt:v=>v+'% chance / week'},
    {key:'unknowns',label:'Unknown-unknowns',min:0,max:10,step:1,fmt:v=>v+' expected'},
    {key:'severity',label:'Impact severity',min:50,max:250,step:10,fmt:v=>v+'%'},
  ],
  charts:[
    {title:'Contingency reserve left vs open risk exposure (EMV)',fmt:'money',series:[
      {key:'reserveLeft',label:'Reserve left',color:'#5fd68a',style:'area'},{key:'emv',label:'Open risk exposure (EMV)',color:'#ff8f8f'}]},
    {title:'Cost: actual vs plan',fmt:'money',series:[
      {key:'pv',label:'Planned spend',color:'#7aa7d6'},{key:'ac',label:'Actual cost',color:'#ff8f8f',style:'dash'}],
      refs:p=>[{axis:'y',v:p['budget'],label:'Budget'},{axis:'y',v:p['budget']*(1+p['reserve']/100),label:'Budget + reserve'},{axis:'x',v:p['duration'],label:'Plan'}],
      max:(rows,p)=>Math.max(p['budget']*(1+p['reserve']/100),...rows.map(r=>r['ac']))*1.12},
    {title:'Cost of risks that hit each week',fmt:'money',series:[
      {key:'hitCost',label:'Impact of risks that occurred',color:'#ff8f8f',style:'bars'},{key:'respondSpend',label:'Spend on responses (cumulative)',color:'#49cce1'}]},
  ],
  model:{
    create(p){const s:RiskState={t:0,rand:seeded(p['seed']),env:seeded(p['seed']*7+3),rem:p['duration'],risks:[],spent:{base:0,impact:0,delay:0,mitigation:0,monitoring:0},
      hits:0,unknownHits:0,lastHitCost:0,respondedCount:0,weekly:p['budget']/p['duration'],reserve:p['budget']*p['reserve']/100,names:[...NAMES]};
      for(let i=0;i<p['risks'];i++){const from=1+Math.floor(s.env()*Math.max(1,p['duration']-3));s.risks.push(makeRisk(s,p,from,false));}
      return s;},
    step(s,p){
      const ev:string[]=[];const r=s.env;s.t++;s.reserve=p['budget']*p['reserve']/100;s.weekly=p['budget']/p['duration'];
      const working=s.rem>0;
      if(working){if(s.t<=p['duration'])s.spent.base+=s.weekly;s.rem-=1;} // extra weeks were already charged as delay cost
      if(r()<p['emergent']/100&&s.t<p['duration']){const k=makeRisk(s,p,s.t+1,true);s.risks.push(k);ev.push(`New risk identified: ${k.name}. It has no response until the next review.`);}
      const open=s.risks.filter(k=>!k.hit&&k.to>=s.t);
      if(p['mitigation']>0&&open.length)s.spent.mitigation+=s.weekly*p['mitigation']/100;
      if(p['warning'])s.spent.monitoring+=s.weekly*0.01;
      if((s.t-1)%Math.max(1,p['review'])===0){s.spent.monitoring+=p['budget']*0.0005;
        const fresh=open.filter(k=>!k.responded);
        if(p['mitigation']>0)for(const k of fresh){k.responded=true;s.respondedCount++;}
        if(fresh.length&&p['mitigation']>0)ev.push(`Risk review: responses planned for ${fresh.length} risk${fresh.length===1?'':'s'}.`);}
      const m=mitStrength(p);let hitCost=0;
      for(const k of s.risks){if(k.hit||s.t<k.from||s.t>k.to)continue;
        const len=k.to-k.from+1;const prob=k.p*(k.responded?1-0.75*m:1);
        if(k.u<prob*(s.t-k.from+1)/len){k.hit=true;s.hits++;const caught=!!p['warning']&&k.uc<0.7;
          const cost=k.cost*(k.responded?1-0.4*m:1)*(caught?0.5:1)*p['severity']/100;const delay=caught||(k.responded&&k.ud<m)?0:k.delay;
          s.spent.impact+=cost;hitCost+=cost;if(delay>0){s.rem+=delay;s.spent.delay+=delay*s.weekly;}
          ev.push(`Risk occurred: ${k.name} (${money(cost)}${delay?`, +${delay} week${delay===1?'':'s'}`:''})${caught?'. The early warning caught it, so the contingency plan halved the impact.':k.responded?'. The planned response reduced the impact.':'.'}`);}}
      if(r()<p['unknowns']/Math.max(1,p['duration'])&&s.t<=p['duration']){const cost=p['budget']*(0.02+r()*0.03)*p['severity']/100;const delay=r()<0.3?1:0;
        s.spent.impact+=cost;hitCost+=cost;s.unknownHits++;if(delay){s.rem+=1;s.spent.delay+=s.weekly;}
        ev.push(`Unknown-unknown: something nobody had on the register hit the project (${money(cost)}${delay?', +1 week':''}).`);}
      s.lastHitCost=hitCost;const left=reserveLeft(s);
      if(left<0&&left+hitCost>=0)ev.push('The contingency reserve is used up. Further overruns need management reserve or a change request.');
      if(s.rem<=0&&working)ev.push(`Project complete in week ${s.t}.`);
      return {row:{reserveLeft:Math.max(0,left),emv:exposure(s,p),ac:totalCost(s),pv:p['budget']*Math.min(1,s.t/p['duration']),hitCost,
        respondSpend:s.spent.mitigation,finish:s.t+Math.max(0,s.rem)},events:ev};
    },
    finished:s=>s.rem<=0,
    tiles(s,p){const left=reserveLeft(s);const tc=totalCost(s);const f=s.t+Math.max(0,s.rem);return [
      {label:'Reserve left',value:money(left),sub:'of '+money(s.reserve),tone:left<0?'bad':left>s.reserve*0.3?'good':undefined},
      {label:'Open risk exposure (EMV)',value:money(exposure(s,p))},
      {label:s.rem<=0?'Finished':'Forecast finish',value:'Week '+f,tone:f>p['duration']+2?'bad':f<=p['duration']?'good':undefined},
      {label:'Cost so far',value:money(tc),sub:Math.round(tc/p['budget']*100)+'% of budget',tone:tc>p['budget']*(1+p['reserve']/100)?'bad':undefined},
      {label:'Risks occurred',value:`${s.hits} of ${s.risks.length}`,sub:s.unknownHits?`+ ${s.unknownHits} unknown`:undefined},
      {label:'Spent on responses',value:money(s.spent.mitigation+s.spent.monitoring)},
    ];},
    stack:s=>({title:`Where the money went (${money(totalCost(s))})`,parts:[
      {label:'Planned work',v:s.spent.base,color:'#49cce1'},{label:'Risk impacts',v:s.spent.impact,color:'#ff8f8f'},{label:'Delay (extra weeks)',v:s.spent.delay,color:'#f6c35b'},
      {label:'Risk responses',v:s.spent.mitigation,color:'#5fd68a'},{label:'Reviews and monitoring',v:s.spent.monitoring,color:'#7aa7d6'}]}),
    insights(s,p){const out:string[]=[];const tc=totalCost(s);const resp=s.spent.mitigation+s.spent.monitoring;const impact=s.spent.impact+s.spent.delay;
      out.push(`Final cost ${money(tc)}: ${Math.round(tc/p['budget']*100)}% of the budget, against a limit of ${100+p['reserve']}% with the reserve. Risks and delays cost ${money(impact)}; responses and monitoring cost ${money(resp)}.`);
      if(p['mitigation']===0)out.push('With no budget for risk responses, every risk hit at full strength. Spending a little up front on the biggest risks usually costs less than absorbing them.');
      else if(p['mitigation']>=18)out.push(`Response spending of ${p['mitigation']}% has diminishing returns: the last few percent cost more than the risk they removed. Spend on responses only where the EMV justifies it.`);
      const emergentUnresponded=s.risks.filter(k=>k.emergent&&k.hit&&!k.responded).length;
      if(emergentUnresponded>0&&p['mitigation']>0)out.push(`${emergentUnresponded} newly emerging risk${emergentUnresponded===1?'':'s'} hit before a review gave ${emergentUnresponded===1?'it':'them'} a response. Reviewing the register every ${p['review']} weeks is too slow for this project.`);
      if(s.unknownHits>0)out.push(`${s.unknownHits} unknown-unknown${s.unknownHits===1?'':'s'} hit the project. Responses cannot prevent these; only the reserve can absorb them. That is why contingency reserve exists.`);
      if(p['warning'])out.push('Early-warning triggers caught some risks in time to use a contingency plan, halving their impact.');
      if(reserveLeft(s)>s.reserve*0.5&&p['reserve']>=10)out.push('More than half the reserve was never used. A reserve sized from the EMV of the register, plus a margin for unknowns, ties up less money.');
      return out;},
  },
  challenges:[
    {id:'accept-all',title:'Accept every risk',story:'The project manager decides risk responses are a waste of money and reviews the register only once a month.',
      goal:'Finish at or under 112% of budget and no later than week 21.',params:{mitigation:0,review:8,emergent:40,seed:3},
      hint:'Spend around 4–8% on risk responses and review the register every 1–2 weeks so new risks get a response before they hit.',
      check:(s,p)=>{const f=s.t;const c=totalCost(s)/p['budget'];return {ok:c<=1.12&&f<=21,detail:`Finished in week ${f}, ${Math.round(c*100)}% of budget.`};}},
    {id:'gold-plated',title:'Gold-plated risk management',story:'After a bad project, the sponsor wants every risk mitigated as hard as possible, whatever it costs.',
      goal:'Finish at or under 115% of budget.',params:{mitigation:30,review:1,warning:1},
      hint:'Responses have diminishing returns. Cut the response budget to about 4–8% and keep regular reviews.',
      check:(s,p)=>{const c=totalCost(s)/p['budget'];return {ok:c<=1.15,detail:`Final cost ${Math.round(c*100)}% of budget.`};}},
    {id:'storm',title:'Storm season',story:'A volatile environment: risks keep emerging, unknowns are frequent and impacts are severe. The reserve is only 5%.',
      goal:'Finish at or under 130% of budget and no later than week 22.',params:{reserve:5,emergent:50,unknowns:3,severity:130,mitigation:0,review:6,warning:0,seed:3},
      hint:'In a volatile environment, review risks every week, spend a sensible amount on responses (about 5%) and add early-warning triggers. Size the reserve for the risks you cannot prevent.',
      check:(s,p)=>{const c=totalCost(s)/p['budget'];return {ok:c<=1.3&&s.t<=22,detail:`Finished in week ${s.t}, ${Math.round(c*100)}% of budget.`};}},
  ],
  principles:[
    {title:'Expected monetary value',text:'EMV = probability × impact. The sum of EMV across open risks shows how much money is still at risk, and it helps size the contingency reserve.'},
    {title:'Risk responses',text:'Mitigation costs money now to cut the probability or impact of a risk later. It pays when the reduction in EMV is larger than the cost.'},
    {title:'Review cadence',text:'New risks appear all the time. A register reviewed rarely leaves them without a response until it is too late.'},
    {title:'Contingency vs management reserve',text:'Contingency reserve covers known risks. Unknown-unknowns are covered by management reserve, which needs sponsor approval to use.'},
  ],
};

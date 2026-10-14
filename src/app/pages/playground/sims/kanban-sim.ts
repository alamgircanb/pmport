import {avg,poisson,randn,seeded,type P,type Row,type SimDef} from './sim-engine';

// Kanban flow: work items arrive, wait, get worked on and finish. Shows Little's law, WIP limits,
// context switching, batch size and blockers. One step is one working day.
interface Item{size:number;rem:number;arrived:number;started:number;blockedUntil:number}
export interface KanbanState{t:number;rand:()=>number;upstream:Item[];ready:Item[];active:Item[];
  done:{lead:number;cycle:number;t:number}[];arrived:number;started:number;
  cap:{gross:number;work:number;switching:number;blocked:number;idle:number};
  totals:{gross:number;switching:number;blocked:number;idle:number};blockedDays:number;activeDays:number}

const DAYS=60;
const recent=(s:KanbanState,n=25)=>s.done.slice(-n);
/** Lead time of the last 25 finished items, plus the current age of everything still in the system
 * (so a growing pile of old, unfinished work raises the number instead of hiding). */
export const kanbanLead=(s:KanbanState)=>{const ages=[...s.upstream,...s.ready,...s.active].map(i=>s.t-i.arrived+1).filter(a=>a>3);return avg([...recent(s).map(d=>d.lead),...ages]);};
const cycleT=(s:KanbanState)=>avg(recent(s).map(d=>d.cycle));
const throughput=(s:KanbanState,days=10)=>s.done.filter(d=>d.t>s.t-days).length/Math.min(days,Math.max(1,s.t));

export const KANBAN:SimDef<KanbanState>={
  id:'kanban',eyebrow:'Playground 2 · Kanban flow',title:'Kanban flow: WIP limits, batches and blockers',
  intro:'Requests arrive every day. Watch them queue, get worked on and finish. Limit work in progress, change the batch size and deal with blockers to make work flow faster.',
  unit:'Day',horizon:()=>DAYS,maxSteps:DAYS,
  defaults:{arrival:1.8,team:5,size:2,wip:8,batch:1,swarm:0,blockers:5,variability:50,surge:0,seed:3},
  setup:[
    {key:'arrival',label:'New requests',min:0.5,max:5,step:0.1,fmt:v=>v.toFixed(1)+' / day'},
    {key:'team',label:'Team',min:1,max:12,step:1,fmt:v=>v+' people'},
    {key:'size',label:'Average item size',min:0.5,max:5,step:0.5,fmt:v=>v+' person-days'},
  ],
  levers:[
    {key:'wip',label:'WIP limit',min:0,max:30,step:1,fmt:v=>v===0?'No limit':v+' items'},
    {key:'batch',label:'Release work in batches every',min:1,max:15,step:1,fmt:v=>v===1?'Daily (no batching)':v+' days'},
    {key:'swarm',label:'Swarm on blocked items',min:0,max:1,step:1,kind:'toggle'},
  ],
  disturbances:[
    {key:'blockers',label:'Blockers',min:0,max:25,step:1,fmt:v=>v+'% / item / day'},
    {key:'variability',label:'Item size variability',min:0,max:120,step:10,fmt:v=>v+'%'},
    {key:'surge',label:'Demand surge',min:0,max:100,step:10,fmt:v=>'+'+v+'%'},
  ],
  charts:[
    {title:'Cumulative flow: arrived, started, finished',fmt:'n',series:[
      {key:'arrivedCum',label:'Arrived',color:'#ff8f8f'},{key:'startedCum',label:'Started',color:'#f6c35b'},{key:'doneCum',label:'Finished',color:'#49cce1',style:'area'}]},
    {title:'Lead time and cycle time (days)',fmt:'dec',series:[
      {key:'lead',label:'Lead time (request → done)',color:'#ff8f8f'},{key:'cycle',label:'Cycle time (start → done)',color:'#49cce1'}]},
    {title:'Work in progress and waiting items',fmt:'n',series:[
      {key:'wip',label:'In progress',color:'#f6c35b'},{key:'queue',label:'Waiting',color:'#9b8cff'},{key:'blocked',label:'Blocked',color:'#ff8f8f',style:'bars'}],
      refs:p=>p['wip']>0?[{axis:'y',v:p['wip'],label:'WIP limit'}]:[]},
  ],
  model:{
    create:p=>({t:0,rand:seeded(p['seed']),upstream:[],ready:[],active:[],done:[],arrived:0,started:0,
      cap:{gross:0,work:0,switching:0,blocked:0,idle:0},totals:{gross:0,switching:0,blocked:0,idle:0},blockedDays:0,activeDays:0}),
    step(s,p){
      const ev:string[]=[];s.t++;const r=s.rand;
      const n=poisson(r,p['arrival']*(1+p['surge']/100));const cv=p['variability']/100;
      for(let i=0;i<n;i++){const size=Math.max(0.2,p['size']*Math.exp(randn(r)*cv*0.8-0.32*cv*cv));s.upstream.push({size,rem:size,arrived:s.t,started:0,blockedUntil:0});}
      s.arrived+=n;
      if(p['batch']<=1||s.t%p['batch']===0){if(p['batch']>1&&s.upstream.length)ev.push(`Batch release: ${s.upstream.length} requests handed to the team at once.`);s.ready.push(...s.upstream);s.upstream=[];}
      const limit=p['wip']>0?p['wip']:Infinity;
      while(s.ready.length&&s.active.length<limit){const it=s.ready.shift()!;it.started=s.t;s.active.push(it);s.started++;}
      let newBlocks=0;
      for(const it of s.active)if(it.blockedUntil<=s.t&&r()<p['blockers']/100){const d=1+Math.floor(r()*4);it.blockedUntil=s.t+(p['swarm']?Math.ceil(d/2):d);newBlocks++;}
      if(newBlocks>=3)ev.push(`${newBlocks} items got blocked today (waiting on approvals, other teams or environments).`);
      const working=s.active.filter(i=>i.blockedUntil<=s.t);const blocked=s.active.length-working.length;
      const gross=p['team'];const load=s.active.length/gross;const eff=load<=1?1:1/(1+0.4*(load-1));
      const capacity=gross*eff;const swarmCost=p['swarm']?blocked*0.15:0;const avail=Math.max(0,capacity-swarmCost);
      const per=working.length?Math.min(2,avail/working.length):0;const used=per*working.length;
      for(const it of working)it.rem-=per;
      const fin=s.active.filter(i=>i.rem<=1e-9);s.active=s.active.filter(i=>i.rem>1e-9);
      for(const it of fin)s.done.push({lead:s.t-it.arrived+1,cycle:s.t-it.started+1,t:s.t});
      s.cap={gross,work:used,switching:gross-capacity,blocked:swarmCost+(working.length===0&&blocked>0?avail:0),idle:Math.max(0,avail-used-(working.length===0&&blocked>0?avail:0))};
      s.totals.gross+=gross;s.totals.switching+=gross-capacity;s.totals.blocked+=s.cap.blocked;s.totals.idle+=s.cap.idle;
      s.blockedDays+=blocked;s.activeDays+=s.active.length+fin.length;
      if(s.t%10===0&&s.done.length)ev.push(`Day ${s.t}: ${fin.length} finished today; average lead time is now ${kanbanLead(s).toFixed(1)} days.`);
      return {row:{arrivedCum:s.arrived,startedCum:s.started,doneCum:s.done.length,wip:s.active.length,queue:s.upstream.length+s.ready.length,
        blocked,lead:kanbanLead(s),cycle:cycleT(s),th:throughput(s)},events:ev};
    },
    finished:s=>s.t>=DAYS,
    tiles(s,p){const lt=kanbanLead(s);const th=throughput(s);const util=s.cap.gross?s.cap.work/s.cap.gross:0;return [
      {label:'Finished / arrived',value:`${s.done.length} / ${s.arrived}`},
      {label:'Throughput (last 10 days)',value:th.toFixed(1)+' / day',tone:th>=p['arrival']*(1+p['surge']/100)*0.95?'good':'bad'},
      {label:'Lead time (last 25)',value:s.done.length?lt.toFixed(1)+' days':'–',tone:s.done.length?(lt<=6?'good':lt>12?'bad':undefined):undefined},
      {label:'Cycle time (last 25)',value:s.done.length?cycleT(s).toFixed(1)+' days':'–'},
      {label:'In progress · waiting',value:`${s.active.length} · ${s.upstream.length+s.ready.length}`,tone:s.upstream.length+s.ready.length>20?'bad':undefined},
      {label:'Time on real work',value:Math.round(util*100)+'%',sub:'of team capacity today'},
    ];},
    stack:s=>({title:`Where today's team capacity went (${s.cap.gross} person-days)`,parts:[
      {label:'Working on items',v:s.cap.work,color:'#49cce1'},{label:'Context switching',v:s.cap.switching,color:'#f6c35b'},
      {label:'Stuck on blocked items',v:s.cap.blocked,color:'#ff8f8f'},{label:'Idle (nothing to pull)',v:s.cap.idle,color:'#2a4a6a'}]}),
    insights(s,p,rows){
      const out:string[]=[];const last=rows.slice(-20);const inSystem=avg(last.map(r=>r['wip']+r['queue']));const th=avg(last.map(r=>r['th']));
      if(th>0)out.push(`Little's law: items in the system ÷ throughput = ${inSystem.toFixed(0)} ÷ ${th.toFixed(1)} per day ≈ ${(inSystem/th).toFixed(1)} days, close to the measured lead time of ${kanbanLead(s).toFixed(1)} days. To cut lead time, cut the amount of work in the system.`);
      const sw=s.totals.gross?s.totals.switching/s.totals.gross:0;
      if(sw>0.08)out.push(`About ${Math.round(sw*100)}% of the team's time was lost to context switching because people juggled more than one item each. A WIP limit close to the team size keeps everyone focused.`);
      if(p['wip']>0&&p['wip']<p['team']&&s.totals.idle/Math.max(1,s.totals.gross)>0.05)out.push(`The WIP limit (${p['wip']}) is below the team size (${p['team']}), so some people had nothing to pull. Very low WIP limits starve the team.`);
      if(p['batch']>1)out.push(`Releasing work every ${p['batch']} days made each request wait about ${((p['batch']-1)/2).toFixed(1)} extra days on average before anyone could start it. Smaller, more frequent releases shorten lead time.`);
      const bl=s.activeDays?s.blockedDays/s.activeDays:0;
      if(bl>0.1)out.push(`Items were blocked ${Math.round(bl*100)}% of the time they were in progress.${p['swarm']?' Swarming cleared blockers twice as fast, at a small cost in capacity.':' Swarming on blocked items (helping to clear the blocker instead of starting new work) would clear them faster.'}`);
      const q=rows[rows.length-1]?.['queue']??0;if(q>25)out.push(`The waiting queue grew to ${q} items: more work arrives than the system can finish. Either reduce demand, add capacity or remove waste.`);
      return out;
    },
  },
  challenges:[
    {id:'start-everything',title:'Start everything at once',story:'The team starts every request the moment it arrives, so everyone is juggling many items at once. Stakeholders complain that nothing gets finished.',
      goal:'By day 60, bring the average lead time of the last 25 items to 6 days or less.',params:{wip:0},
      hint:'Set a WIP limit close to the team size (about one item per person). Finish work before starting new work.',
      check:s=>{const lt=kanbanLead(s);return {ok:lt<=6,detail:`Average lead time: ${lt.toFixed(1)} days.`};}},
    {id:'big-batches',title:'Big-batch releases',story:'Requests are collected and handed to the team once every two weeks, so new work waits before anyone sees it.',
      goal:'By day 60, bring the average lead time of the last 25 items to 6 days or less.',params:{batch:10,wip:6},
      hint:'Release work daily (batch of 1) so requests start as soon as there is room.',
      check:s=>{const lt=kanbanLead(s);return {ok:lt<=6,detail:`Average lead time: ${lt.toFixed(1)} days.`};}},
    {id:'blocked',title:'Blocked all the time',story:'Items keep getting stuck waiting on other teams. People start new work while blocked items pile up.',
      goal:'By day 60, finish at least 96 items with an average lead time of 7 days or less.',params:{blockers:15,wip:12,swarm:0},
      hint:'Swarm on blocked items to clear them faster, and keep the WIP limit near the team size so blocked work is visible.',
      check:s=>{const lt=kanbanLead(s);return {ok:s.done.length>=96&&lt<=7,detail:`${s.done.length} items finished, average lead time ${lt.toFixed(1)} days.`};}},
  ],
  principles:[
    {title:"Little's law",text:'Average lead time = average items in the system ÷ average throughput. The only way to shorten lead time without adding people is to have less work in progress.'},
    {title:'WIP limits',text:'A WIP limit stops the team from starting more than it can finish. Too high causes context switching; too low leaves people idle.'},
    {title:'Batch size',text:'Large batches make work wait. Small, frequent batches flow faster and give earlier feedback.'},
    {title:'Swarming',text:'When an item is blocked, helping to unblock it is often worth more than starting something new.'},
  ],
};

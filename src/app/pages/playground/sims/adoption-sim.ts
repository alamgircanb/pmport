import {clamp,money,pct,seeded,type SimDef} from './sim-engine';

// Change adoption: rolling out a new system to a group of people. Uses the ADKAR stages
// (Awareness, Desire, Knowledge, Ability, Reinforcement) and shows the productivity dip after go-live
// (the J-curve). One step is one week.
export interface AdoptionState{t:number;env:()=>number;A:number;D:number;K:number;B:number;U:number;R:number;prof:number;hours:number;
  sponsorGone:boolean;cost:number;benefit:number;peakU:number;reached:number|null;minProd:number;costs:{comms:number;training:number;champions:number;coaching:number}}

const WEEKS=30,VALUE=1000; // value of one person-week of work ($)
const prodOf=(s:AdoptionState,p:Record<string,number>)=>s.t<=p['golive']?1:(1-s.U)*0.85+s.U*s.prof;
const stages=(s:AdoptionState)=>{const a=s.A,d=Math.min(s.D,a),k=Math.min(s.K,d),b=Math.min(s.B,k),u=Math.min(s.U,b);return {a,d,k,b,u};};

export const ADOPTION:SimDef<AdoptionState>={
  id:'adoption',eyebrow:'Playground 4 · Change adoption',title:'Change adoption: will people actually use it?',
  intro:'A new system goes live for a group of people. Choose how visible the sponsor is, how much you communicate, how much training and coaching people get and whether new habits are reinforced. Then watch adoption, resistance and productivity week by week.',
  unit:'Week',horizon:()=>WEEKS,maxSteps:WEEKS,
  defaults:{users:500,golive:6,target:80,sponsor:60,comms:2,training:8,champions:4,reinforce:1,coaching:0,saturation:1,sponsorRisk:0,seed:4},
  setup:[
    {key:'users',label:'People affected',min:20,max:5000,step:10,fmt:v=>v.toLocaleString('en-CA')+' people'},
    {key:'golive',label:'Go-live',min:2,max:15,step:1,fmt:v=>'Week '+v},
    {key:'target',label:'Adoption target',min:50,max:100,step:5,fmt:v=>v+'%'},
  ],
  levers:[
    {key:'sponsor',label:'Sponsor visibility',min:0,max:100,step:5,fmt:v=>v+'%'},
    {key:'comms',label:'Communication',min:0,max:6,step:1,fmt:v=>v+' message'+(v===1?'':'s')+' / week'},
    {key:'training',label:'Training per person',min:0,max:16,step:1,fmt:v=>v+' hours'},
    {key:'champions',label:'Change champions',min:0,max:10,step:1,fmt:v=>v+'% of people'},
    {key:'coaching',label:'Coaching for resisters',min:0,max:1,step:1,kind:'toggle'},
    {key:'reinforce',label:'Reinforcement (recognition, metrics, retire the old way)',min:0,max:1,step:1,kind:'toggle'},
  ],
  disturbances:[
    {key:'saturation',label:'Other changes at the same time',min:0,max:4,step:1,fmt:v=>v===0?'None':v+' other change'+(v===1?'':'s')},
    {key:'sponsorRisk',label:'Chance the sponsor moves on',min:0,max:10,step:1,fmt:v=>v+'% / week'},
  ],
  charts:[
    {title:'ADKAR: share of people at each stage',fmt:'pct',max:()=>1,series:[
      {key:'A',label:'Awareness',color:'#7aa7d6'},{key:'D',label:'Desire',color:'#9b8cff'},{key:'K',label:'Knowledge',color:'#f6c35b'},
      {key:'U',label:'Using the new way',color:'#49cce1',style:'area'},{key:'R',label:'Resistance',color:'#ff8f8f',style:'dash'}],
      refs:p=>[{axis:'y',v:p['target']/100,label:'Target'},{axis:'x',v:p['golive'],label:'Go-live'}]},
    {title:'Productivity (the J-curve)',fmt:'pct',max:(rows)=>Math.max(1.3,...rows.map(r=>r['prod']))*1.05,series:[{key:'prod',label:'Productivity vs before',color:'#5fd68a'}],
      refs:p=>[{axis:'y',v:1,label:'Before the change'},{axis:'x',v:p['golive'],label:'Go-live'}]},
    {title:'Cumulative value of the change',fmt:'money',series:[{key:'net',label:'Net value (benefits − costs)',color:'#49cce1',style:'area'},{key:'cost',label:'Change programme cost',color:'#ff8f8f',style:'dash'}]},
  ],
  model:{
    create:p=>({t:0,env:seeded(p['seed']),A:0.05,D:0.03,K:0,B:0,U:0,R:0.3,prof:0.8,hours:0,sponsorGone:false,cost:0,benefit:0,peakU:0,reached:null,minProd:1,
      costs:{comms:0,training:0,champions:0,coaching:0}}),
    step(s,p){
      const ev:string[]=[];s.t++;const live=s.t>p['golive'];const sat=p['saturation'];
      if(!s.sponsorGone&&p['sponsorRisk']>0&&s.env()<p['sponsorRisk']/100){s.sponsorGone=true;ev.push('The sponsor has moved to another role. Visible sponsorship drops sharply.');}
      const sp=(p['sponsor']/100)*(s.sponsorGone?0.25:1);const ch=p['champions'];
      const ce=(1-Math.exp(-0.6*p['comms']))/(1+0.35*sat);const noise=Math.max(0,p['comms']-3)*0.008*(1+sat);
      s.A+=(1-s.A)*(0.3*ce+0.012*ch);
      s.R+=0.012*sat+noise+(s.t===p['golive']+1?0.08:0)-s.R*(0.04+0.18*p['coaching']+0.1*sp+0.012*ch);s.R=clamp(s.R,0,1);
      // Without reinforcement, enthusiasm fades after go-live.
      const fade=p['reinforce']||!live?1:Math.max(0.65,1-0.02*(s.t-p['golive']));
      const Dt=s.A*fade*clamp(0.5+0.5*sp+0.035*ch-0.7*s.R,0,1);s.D+=(Dt-s.D)*0.3;
      if(s.t>=p['golive']-2){const add=Math.min(4,p['training']-s.hours);if(add>0){s.hours+=add;s.costs.training+=add*60*p['users'];}}
      const Kt=Math.min(1,s.hours/8)*(0.5+0.5*s.D);s.K+=(Kt-s.K)*0.4;
      if(live){s.B+=(Math.min(s.K,s.D)-s.B)*(0.22+0.02*ch+0.008*s.hours);
        // Without reinforcement, the pull of old habits grows the longer the change goes unsupported.
        const since=s.t-p['golive'];const reg=(p['reinforce']?0.004:Math.min(0.06,0.006*since))+(s.sponsorGone?0.015:0)+0.006*sat;
        s.U+=(s.B-s.U)*0.45-s.U*reg;s.U=clamp(s.U,0,1);s.B-=s.B*reg*0.8;
        s.prof+=(1.25-s.prof)*(0.05+0.07*Math.min(1,s.hours/8));}
      if(s.t===p['golive']+1)ev.push(`Go-live: the old way is switched off for new work. ${pct(s.K)} of people have the knowledge to use the new system.`);
      s.costs.comms+=p['comms']*800;s.costs.champions+=ch/100*p['users']*0.1*VALUE;if(p['coaching'])s.costs.coaching+=Math.max(2000,s.R*p['users']*0.05*VALUE*0.3);
      const prod=prodOf(s,p);s.minProd=Math.min(s.minProd,prod);s.benefit+=(prod-1)*p['users']*VALUE;
      s.cost=s.costs.comms+s.costs.training+s.costs.champions+s.costs.coaching;
      if(s.U>s.peakU)s.peakU=s.U;
      if(s.reached===null&&s.U>=p['target']/100){s.reached=s.t;ev.push(`Adoption target of ${p['target']}% reached.`);}
      if(s.peakU-s.U>0.05&&s.t%4===0)ev.push(`Backsliding: adoption has fallen from a peak of ${pct(s.peakU)} to ${pct(s.U)} as people drift back to old habits.`);
      if(noise>0.03&&s.t%5===1)ev.push('People complain about too many change messages. Some stop reading them, and frustration grows.');
      return {row:{A:s.A,D:s.D,K:s.K,U:s.U,R:s.R,prod,net:s.benefit-s.cost,cost:s.cost},events:ev};
    },
    finished:s=>s.t>=WEEKS,
    tiles(s,p){const prod=prodOf(s,p);const net=s.benefit-s.cost;return [
      {label:'Using the new way',value:pct(s.U),sub:'target '+p['target']+'%',tone:s.U>=p['target']/100?'good':s.t>p['golive']+8?'bad':undefined},
      {label:'Resistance',value:pct(s.R),tone:s.R>0.25?'bad':s.R<0.1?'good':undefined},
      {label:'Productivity',value:pct(prod),sub:'lowest '+pct(s.minProd),tone:prod>=1.05?'good':prod<0.9?'bad':undefined},
      {label:'Net value so far',value:money(net),tone:net>0?'good':net<0&&s.t>p['golive']+10?'bad':undefined},
      {label:'Change programme cost',value:money(s.cost)},
      {label:'Target reached',value:s.reached?'Week '+s.reached:'Not yet'},
    ];},
    stack(s){const {a,d,k,b,u}=stages(s);return {title:'Where people are now',parts:[
      {label:'Not aware',v:1-a,color:'#2a4a6a'},{label:'Aware only',v:a-d,color:'#7aa7d6'},{label:'Want to change',v:d-k,color:'#9b8cff'},
      {label:'Trained',v:k-b,color:'#f6c35b'},{label:'Able, not using',v:b-u,color:'#d38cff'},{label:'Using it',v:u,color:'#49cce1'}]};},
    insights(s,p){const out:string[]=[];
      out.push(s.reached?`Adoption reached the ${p['target']}% target in week ${s.reached} and ended at ${pct(s.U)}.`:`Adoption ended at ${pct(s.U)}, short of the ${p['target']}% target.`);
      out.push(`Productivity dropped to ${pct(s.minProd)} after go-live before it recovered: the J-curve. ${p['training']>=8?'Good training kept the dip short.':'More training would make the dip shallower and shorter.'}`);
      if(p['training']<4)out.push('With little training, people who wanted to change could not: knowledge and ability stayed low. Awareness and desire alone do not create adoption.');
      if(p['sponsor']<30||s.sponsorGone)out.push(`${s.sponsorGone?'Once the sponsor moved on':'With a barely visible sponsor'}, desire stayed low and resistance stayed high. Active, visible sponsorship is the strongest driver of change success.`);
      if(s.peakU-s.U>0.04)out.push(`Adoption slipped from ${pct(s.peakU)} to ${pct(s.U)}. Without reinforcement (recognition, measuring use, retiring the old way), people drift back to old habits.`);
      if(p['comms']>3)out.push(`${p['comms']} messages a week was too many${p['saturation']?' alongside other changes':''}: people tuned out and resistance grew. Fewer, clearer messages from the right sender work better.`);
      if(p['coaching'])out.push('Coaching the people who resisted brought resistance down faster than messages alone.');
      out.push(`Over ${s.t} weeks the change created ${money(s.benefit-s.cost)} of net value (benefits ${money(s.benefit)}, programme cost ${money(s.cost)}).`);
      return out;},
  },
  challenges:[
    {id:'no-training',title:'Go-live without training',story:'To save money, the project cancels training. "It\'s intuitive, people will figure it out."',
      goal:'Reach 70% adoption by week 20.',params:{training:0},
      hint:'Without knowledge and ability, desire does not turn into use. Give people about 8 hours of training.',
      check:(s,p,rows)=>{const u=rows.find(r=>r.t===20)?.['U']??s.U;return {ok:u>=0.7,detail:`Adoption at week 20: ${pct(u)}.`};}},
    {id:'absent-sponsor',title:'The absent sponsor',story:'The sponsor approved the budget and then disappeared. There are no champions and only one message a week.',
      goal:'Reach 70% adoption by week 20 with resistance at 20% or less.',params:{sponsor:10,champions:0,comms:1},
      hint:'Make the sponsor visible (60% or more), add change champions (about 5%) and communicate twice a week.',
      check:(s,p,rows)=>{const r=rows.find(x=>x.t===20)??rows[rows.length-1];return {ok:r['U']>=0.7&&r['R']<=0.2,detail:`At week 20: adoption ${pct(r['U'])}, resistance ${pct(r['R'])}.`};}},
    {id:'backsliding',title:'Backsliding',story:'Go-live went well, but the team moved on to the next project straight away. Two other changes are landing on the same people.',
      goal:'Still have 70% or more using the new way at week 30.',params:{reinforce:0,saturation:2},
      hint:'Reinforce the change: recognise people who use it, measure use and retire the old way.',
      check:s=>({ok:s.U>=0.7,detail:`Adoption at week 30: ${pct(s.U)} (peak ${pct(s.peakU)}).`})},
    {id:'spam',title:'Message overload',story:'Worried about resistance, the team sends six messages a week while two other changes are under way.',
      goal:'End with resistance at 15% or less and adoption at 75% or more.',params:{comms:6,saturation:2},
      hint:'Too many messages create noise. Send about two clear messages a week and use coaching for the people who resist.',
      check:s=>({ok:s.R<=0.15&&s.U>=0.75,detail:`Resistance ${pct(s.R)}, adoption ${pct(s.U)}.`})},
  ],
  principles:[
    {title:'ADKAR',text:'People move through Awareness, Desire, Knowledge, Ability and Reinforcement. A gap at any stage stalls adoption, however strong the others are.'},
    {title:'Sponsorship',text:'Visible, active sponsors build desire and reduce resistance more than any other single factor.'},
    {title:'The J-curve',text:'Productivity usually dips after go-live while people learn the new way. Training and support make the dip shallower and shorter.'},
    {title:'Reinforcement',text:'Without recognition, measurement and removing the old way, people drift back to old habits and benefits fade.'},
  ],
};

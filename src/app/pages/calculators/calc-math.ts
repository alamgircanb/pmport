// Pure calculation functions for the PM calculators (no Angular), so they can be tested on their own.

export interface EvmResult{cv:number;sv:number;cpi:number;spi:number;eacCpi:number;eacAtypical:number;eacCpiSpi:number;etc:number;vac:number;tcpiBac:number;tcpiEac:number;percentComplete:number;percentSpent:number}
/** Earned value metrics. Ratios are NaN when their denominator is zero. */
export function evm(bac:number,pv:number,ev:number,ac:number):EvmResult{
  const div=(a:number,b:number)=>b===0?NaN:a/b;
  const cpi=div(ev,ac),spi=div(ev,pv);
  const eacCpi=div(bac,cpi);
  return {cv:ev-ac,sv:ev-pv,cpi,spi,eacCpi,eacAtypical:ac+bac-ev,eacCpiSpi:ac+div(bac-ev,cpi*spi),etc:eacCpi-ac,vac:bac-eacCpi,
    tcpiBac:div(bac-ev,bac-ac),tcpiEac:div(bac-ev,eacCpi-ac),percentComplete:div(ev,bac),percentSpent:div(ac,bac)};
}

export interface PertResult{mean:number;triangular:number;sd:number;variance:number;range68:[number,number];range95:[number,number];range99:[number,number]}
/** Three-point (PERT beta) estimate. */
export function pert(o:number,m:number,p:number):PertResult{
  const mean=(o+4*m+p)/6,sd=(p-o)/6;
  return {mean,triangular:(o+m+p)/3,sd,variance:sd*sd,range68:[mean-sd,mean+sd],range95:[mean-2*sd,mean+2*sd],range99:[mean-3*sd,mean+3*sd]};
}

export interface RiskRow{name:string;probability:number;impact:number;type:'threat'|'opportunity'}
/** Expected monetary value. Threat EMVs are negative, opportunities positive. */
export function emv(rows:RiskRow[]){
  const items=rows.map(r=>({...r,emv:(r.type==='threat'?-1:1)*r.probability*r.impact}));
  const threats=items.filter(i=>i.type==='threat').reduce((s,i)=>s+i.emv,0);
  const opportunities=items.filter(i=>i.type==='opportunity').reduce((s,i)=>s+i.emv,0);
  return {items,threats,opportunities,net:threats+opportunities,contingency:Math.max(0,-(threats+opportunities))};
}

export interface FinanceResult{npv:number;roi:number;totalBenefit:number;payback:number|null;discountedPayback:number|null;irr:number|null;discounted:number[]}
/** Business case metrics for an initial investment followed by yearly net cash flows. Rate as a fraction (0.08 = 8%). */
export function finance(investment:number,flows:number[],rate:number):FinanceResult{
  const discounted=flows.map((f,i)=>f/Math.pow(1+rate,i+1));
  const npv=discounted.reduce((s,d)=>s+d,0)-investment;
  const totalBenefit=flows.reduce((s,f)=>s+f,0);
  const roi=investment===0?NaN:(totalBenefit-investment)/investment;
  const payback=paybackYears(investment,flows),discountedPayback=paybackYears(investment,discounted);
  return {npv,roi,totalBenefit,payback,discountedPayback,irr:irr(investment,flows),discounted};
}
function paybackYears(investment:number,flows:number[]):number|null{
  let remaining=investment;
  for(let i=0;i<flows.length;i++){
    if(flows[i]>0&&flows[i]>=remaining)return i+remaining/flows[i];
    remaining-=flows[i];
  }
  return null;
}
/** Internal rate of return by bisection between -99% and 1000%. Null when there is no sign change. */
export function irr(investment:number,flows:number[]):number|null{
  const f=(r:number)=>flows.reduce((s,c,i)=>s+c/Math.pow(1+r,i+1),0)-investment;
  let lo=-0.99,hi=10,flo=f(lo),fhi=f(hi);
  if(isNaN(flo)||isNaN(fhi)||flo*fhi>0)return null;
  for(let k=0;k<200;k++){const mid=(lo+hi)/2,fm=f(mid);if(Math.abs(fm)<1e-7)return mid;if(flo*fm<0){hi=mid;fhi=fm;}else{lo=mid;flo=fm;}}
  return (lo+hi)/2;
}

/** Number of communication channels for n people. */
export const channels=(n:number)=>n<2?0:n*(n-1)/2;

export interface McTask{name:string;o:number;m:number;p:number}
export interface McResult{runs:number;mean:number;min:number;max:number;p50:number;p80:number;p90:number;p95:number;deterministic:number;bins:{from:number;to:number;count:number}[];probabilityBy:(target:number)=>number}
/** Simple random generator with a seed, so results are repeatable. */
export function seeded(seed:number){let s=seed>>>0||1;return ()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
/** Triangular random value. */
export function triangular(o:number,m:number,p:number,u:number){
  if(p===o)return o;const c=(m-o)/(p-o);
  return u<c?o+Math.sqrt(u*(p-o)*(m-o)):p-Math.sqrt((1-u)*(p-o)*(p-m));
}
/** Beta-PERT random value (via two gamma draws). */
export function betaPert(o:number,m:number,p:number,rand:()=>number){
  if(p===o)return o;
  const a=1+4*(m-o)/(p-o),b=1+4*(p-m)/(p-o);
  const x=gamma(a,rand),y=gamma(b,rand);
  return o+(x/(x+y))*(p-o);
}
function gamma(k:number,rand:()=>number):number{
  if(k<1)return gamma(k+1,rand)*Math.pow(rand()||1e-12,1/k);
  const d=k-1/3,c=1/Math.sqrt(9*d);
  for(;;){
    let x:number,v:number;
    do{const u1=rand()||1e-12,u2=rand();x=Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);v=1+c*x;}while(v<=0);
    v=v*v*v;const u=rand();
    if(u<1-0.0331*x*x*x*x||Math.log(u||1e-12)<0.5*x*x+d*(1-v+Math.log(v)))return d*v;
  }
}
/** Monte Carlo simulation of tasks done one after another (total duration = sum of tasks). */
export function monteCarlo(tasks:McTask[],runs=10000,dist:'pert'|'triangular'='pert',seed=42):McResult{
  const rand=seeded(seed);const totals=new Float64Array(runs);
  for(let r=0;r<runs;r++){let sum=0;for(const t of tasks)sum+=dist==='pert'?betaPert(t.o,t.m,t.p,rand):triangular(t.o,t.m,t.p,rand());totals[r]=sum;}
  const sorted=Array.from(totals).sort((a,b)=>a-b);
  const pct=(q:number)=>sorted[Math.min(sorted.length-1,Math.max(0,Math.ceil(q*sorted.length)-1))];
  const min=sorted[0],max=sorted[sorted.length-1],nb=20,w=(max-min)/nb||1;
  const bins=Array.from({length:nb},(_,i)=>({from:min+i*w,to:min+(i+1)*w,count:0}));
  for(const v of sorted)bins[Math.min(nb-1,Math.floor((v-min)/w))].count++;
  const mean=sorted.reduce((s,v)=>s+v,0)/sorted.length;
  return {runs,mean,min,max,p50:pct(.5),p80:pct(.8),p90:pct(.9),p95:pct(.95),deterministic:tasks.reduce((s,t)=>s+t.m,0),bins,
    probabilityBy:(target:number)=>{let lo=0,hi=sorted.length;while(lo<hi){const mid=(lo+hi)>>1;if(sorted[mid]<=target)lo=mid+1;else hi=mid;}return lo/sorted.length;}};
}

export interface Member{name:string;daysAvailable:number;hoursPerDay:number;focus:number}
/** Sprint capacity in hours and a forecast from past velocity. Focus as a fraction (0.7 = 70%). */
export function sprintCapacity(members:Member[],velocities:number[],backlogPoints:number){
  const hours=members.reduce((s,m)=>s+m.daysAvailable*m.hoursPerDay*m.focus,0);
  const valid=velocities.filter(v=>v>0);
  const avg=valid.length?valid.reduce((s,v)=>s+v,0)/valid.length:0;
  const low=valid.length?Math.min(...valid):0,high=valid.length?Math.max(...valid):0;
  const sprints=(v:number)=>v>0?Math.ceil(backlogPoints/v):null;
  return {hours,avgVelocity:avg,low,high,sprintsAvg:sprints(avg),sprintsWorst:sprints(low),sprintsBest:sprints(high)};
}

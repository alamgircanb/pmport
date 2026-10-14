// Shared types and helpers for the extra PM Playground simulations (Kanban flow, risk and reserve,
// change adoption, technical debt). Each simulation is a pure model plus a description of its controls,
// charts and challenges; one panel component renders any of them.

/** Parameters are plain numbers. Toggles are 0 or 1. */
export type P=Record<string,number>;
/** One row of history per time step. */
export type Row={t:number;[key:string]:number};
export type Fmt='n'|'dec'|'money'|'pct';

export interface Control{key:string;label:string;min:number;max:number;step:number;
  kind?:'range'|'toggle'|'choice';options?:{v:number;label:string}[];fmt?:(v:number)=>string}
export interface Series{key:string;label:string;color:string;style?:'line'|'dash'|'area'|'bars'}
export interface RefLine{axis:'x'|'y';v:number;label:string}
export interface ChartDef{title:string;fmt:Fmt;series:Series[];max?:(rows:Row[],p:P)=>number;refs?:(p:P)=>RefLine[]}
export interface Tile{label:string;value:string;sub?:string;tone?:'good'|'bad'}
export interface Part{label:string;v:number;color:string}
export interface StepResult{row:Omit<Row,'t'>;events:string[]}

export interface Model<S>{
  create(p:P):S;
  step(s:S,p:P):StepResult;
  finished(s:S,p:P):boolean;
  tiles(s:S,p:P,rows:Row[]):Tile[];
  stack(s:S,p:P):{title:string;parts:Part[]};
  insights(s:S,p:P,rows:Row[]):string[];
}
export interface SimChallenge<S>{id:string;title:string;story:string;goal:string;params:P;hint:string;
  check:(s:S,p:P,rows:Row[])=>{ok:boolean;detail:string}}
export interface SimDef<S=any>{
  id:string;eyebrow:string;title:string;intro:string;
  unit:string;               // label of one time step, e.g. 'Week' or 'Day'
  horizon:(p:P)=>number;     // planned length, used for the chart x-axis
  maxSteps:number;           // safety stop
  defaults:P;setup:Control[];levers:Control[];disturbances:Control[];
  charts:ChartDef[];model:Model<S>;challenges:SimChallenge<S>[];
  principles:{title:string;text:string}[];
}

/** Small seeded random generator (mulberry32), so a run can be replayed. */
export function seeded(seed:number){let a=(seed*2654435761)>>>0||1;return()=>{a=(a+0x6D2B79F5)>>>0;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
export function poisson(r:()=>number,lambda:number){if(lambda<=0)return 0;const L=Math.exp(-lambda);let k=0,p=1;do{k++;p*=r();}while(p>L&&k<100);return k-1;}
export function randn(r:()=>number){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}
export const clamp=(v:number,lo:number,hi:number)=>Math.max(lo,Math.min(hi,v));
export const money=(v:number)=>(v<0?'-':'')+(Math.abs(v)>=1e6?'$'+(Math.abs(v)/1e6).toFixed(2)+'M':'$'+Math.round(Math.abs(v)/1000)+'k');
export const pct=(v:number)=>Math.round(v*100)+'%';
export const avg=(a:number[])=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;

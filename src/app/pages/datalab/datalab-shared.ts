import {Component,Input} from '@angular/core';
import {RouterLink,RouterLinkActive} from '@angular/router';

export const DATALAB_MODULES=[
  {id:'sql',path:'/pm-datalab/sql',title:'SQL for analysts',short:'SQL',blurb:'Write real SQL against a sample project database and get instant, graded feedback.'},
  {id:'excel',path:'/pm-datalab/excel',title:'Excel for project managers',short:'Excel',blurb:'Formula challenges on real PM problems: earned value, RAG status, SUMIFS, lookups and more.'},
  {id:'dax',path:'/pm-datalab/power-bi-dax',title:'Power BI & DAX',short:'Power BI & DAX',blurb:'Case-style DAX questions on measures, CALCULATE, filter context and time intelligence.'},
  {id:'python',path:'/pm-datalab/python',title:'Python for data',short:'Python',blurb:'pandas exercises that run in your browser: filter, group, join, reshape and clean project data.'},
  {id:'report',path:'/pm-datalab/status-report',title:'Data reporting',short:'Status report',blurb:'Build a portfolio status report step by step: KPIs, RAG status, top risks and an executive summary.'},
] as const;
export type ModuleId=typeof DATALAB_MODULES[number]['id'];

/** Remembers completed exercises in this browser only (no account needed). */
export const progress={
  key:(m:ModuleId)=>`pmport-datalab-${m}`,
  get(m:ModuleId):string[]{try{const v=JSON.parse(localStorage.getItem(this.key(m))??'[]');return Array.isArray(v)?v:[];}catch{return [];}},
  mark(m:ModuleId,id:string):string[]{const s=new Set(this.get(m));s.add(id);const out=[...s];try{localStorage.setItem(this.key(m),JSON.stringify(out));}catch{}return out;},
  clear(m:ModuleId){try{localStorage.removeItem(this.key(m));}catch{}},
};

const loading=new Map<string,Promise<void>>();
/** Loads an external script once (used for the in-browser SQL and Python engines). */
export function loadScript(src:string):Promise<void>{
  if(!loading.has(src))loading.set(src,new Promise<void>((resolve,reject)=>{
    const s=document.createElement('script');s.src=src;s.async=true;s.crossOrigin='anonymous';
    s.onload=()=>resolve();s.onerror=()=>{loading.delete(src);reject(new Error(`Could not load ${src}. Check your internet connection and try again.`));};
    document.head.appendChild(s);
  }));
  return loading.get(src)!;
}

/** Tabs shown at the top of every PM DataLab page. */
@Component({
  standalone:true,selector:'app-datalab-nav',imports:[RouterLink,RouterLinkActive],
  template:`<nav class="dl-nav" aria-label="PM DataLab modules">
    <a routerLink="/pm-datalab" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Overview</a>
    @for(m of modules;track m.id){<a [routerLink]="m.path" routerLinkActive="active">{{m.short}}</a>}
  </nav>`,
  styles:[`.dl-nav{display:flex;flex-wrap:wrap;gap:.45rem;margin-bottom:2rem}.dl-nav a{padding:.5rem .85rem;border:1px solid var(--line);border-radius:99px;background:#082039;color:#d9eef7;text-decoration:none;font-weight:700;font-size:.88rem}.dl-nav a.active{background:var(--accent);border-color:var(--accent);color:#041223}`]
})
export class DatalabNavComponent{@Input() current='';readonly modules=DATALAB_MODULES;}

/** Shared look for the lab pages (exercise list, editor, results). */
export const LAB_STYLES=`
  .lab-head{max-width:900px;margin-bottom:1.5rem}.lab-head h1{font-size:clamp(2.2rem,5vw,3.6rem)!important}
  .lab{display:grid;grid-template-columns:280px minmax(0,1fr);gap:1.25rem;align-items:start}
  .task{min-width:0}
  .ex-list{position:sticky;top:88px;max-height:calc(100vh - 104px);overflow:auto;background:#081d34;border:1px solid var(--line);border-radius:14px;padding:.8rem}
  .ex-list h3{font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin:.9rem .4rem .4rem}
  .ex-list h3:first-child{margin-top:.2rem}
  .ex-list button{display:flex;gap:.5rem;align-items:flex-start;width:100%;text-align:left;background:transparent;border:1px solid transparent;color:#d6e4f0;border-radius:8px;padding:.45rem .5rem;cursor:pointer;font-size:.88rem;line-height:1.35}
  .ex-list button:hover{background:#0c2a49}.ex-list button.active{border-color:var(--accent);background:#0c2a49}
  .ex-list .tick{flex:none;width:1.1rem;color:#5fd68a;font-weight:800}.ex-list .num{flex:none;width:1.4rem;color:var(--muted)}
  .progress-line{font-size:.82rem;color:var(--muted);margin:0 .4rem .4rem}
  .task h2{font-size:clamp(1.5rem,3vw,2rem)!important;margin:.2rem 0 .7rem!important}
  .prompt{color:#d7e5f2;line-height:1.7;font-size:1.02rem}
  .editor{width:100%;min-height:150px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',monospace;font-size:.92rem;line-height:1.55;background:#06162a;color:#e8f4ff;border:1px solid #315370;border-radius:10px;padding:.85rem;resize:vertical;tab-size:4}
  .editor:focus{outline:2px solid var(--accent);border-color:transparent}
  .toolbar{display:flex;flex-wrap:wrap;gap:.5rem;margin:.8rem 0}
  .feedback{padding:.8rem 1rem;border-radius:10px;margin:.6rem 0;line-height:1.55;background:#0c2b49;color:#c9dcec}
  .feedback.ok{background:#0f3b2b;color:#c9f5dc;border:1px solid #2f8a5f}.feedback.bad{background:#401c2a;color:#ffd3dc;border:1px solid #8a3a4e}
  .hint{background:#14304f;border-left:3px solid var(--accent);padding:.7rem .9rem;border-radius:6px;color:#d8e8f5;margin:.6rem 0}
  pre.code{background:#06162a;border:1px solid #23466a;border-radius:8px;padding:.75rem;overflow:auto;color:#e8f4ff;font-size:.88rem;white-space:pre-wrap}
  .result-wrap{overflow:auto;max-height:420px;border:1px solid var(--line);border-radius:10px;margin-top:.6rem}
  table.result{border-collapse:collapse;width:100%;font-size:.86rem}
  table.result th,table.result td{padding:.4rem .6rem;border-bottom:1px solid #1b3a5c;text-align:left;white-space:nowrap}
  table.result th{position:sticky;top:0;background:#0e2d4e;color:#cfe3f3}
  table.result td.n{text-align:right;font-variant-numeric:tabular-nums}
  .nav-row{display:flex;justify-content:space-between;gap:.5rem;margin-top:1.2rem}
  details.panel{background:#081d34;border:1px solid var(--line);border-radius:12px;padding:.7rem 1rem;margin:1rem 0}
  details.panel summary{cursor:pointer;font-weight:700;color:#d9eef7}
  .kbd{font-size:.78rem;color:var(--muted)}
  @media(max-width:900px){.lab{grid-template-columns:minmax(0,1fr)}.ex-list{position:static;max-height:260px}}
`;

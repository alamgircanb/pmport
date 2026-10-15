import {Component,Input} from '@angular/core';
import {RouterLink} from '@angular/router';

export const CALCULATORS=[
  {slug:'earned-value-calculator',title:'Earned Value (EVM) Calculator',short:'Earned value',blurb:'CV, SV, CPI, SPI, EAC, ETC, VAC and TCPI from BAC, PV, EV and AC, with a plain-English verdict.'},
  {slug:'pert-three-point-estimate-calculator',title:'PERT Three-Point Estimate Calculator',short:'PERT estimate',blurb:'Beta and triangular estimates, standard deviation and confidence ranges from optimistic, most likely and pessimistic values.'},
  {slug:'risk-emv-calculator',title:'Risk EMV Calculator',short:'Risk EMV',blurb:'Expected monetary value of threats and opportunities, with a suggested contingency reserve.'},
  {slug:'npv-roi-payback-calculator',title:'NPV, ROI, IRR & Payback Calculator',short:'NPV / ROI / payback',blurb:'Business case numbers from an investment and yearly cash flows: NPV, ROI, IRR, payback and discounted payback.'},
  {slug:'monte-carlo-schedule-simulator',title:'Monte Carlo Schedule Simulator',short:'Monte Carlo',blurb:'Run 10,000 simulations of your task estimates to see P50, P80 and P90 dates and the chance of hitting a deadline.'},
  {slug:'sprint-capacity-velocity-calculator',title:'Sprint Capacity & Velocity Forecast Calculator',short:'Sprint capacity',blurb:'Team capacity in hours and how many sprints your backlog needs, based on past velocity.'},
  {slug:'communication-channels-calculator',title:'Communication Channels Calculator',short:'Communication channels',blurb:'How many communication paths a team has, using n(n − 1) ÷ 2, and how many each new person adds.'},
] as const;

/** Links to the other calculators, shown at the bottom of each calculator page. */
@Component({
  standalone:true,selector:'app-calc-more',imports:[RouterLink],
  template:`<nav class="calc-more" aria-label="More calculators"><p class="eyebrow">More free calculators</p><div class="links">
    @for(c of calculators;track c.slug){@if(c.slug!==current){<a [routerLink]="'/pm-calculators/'+c.slug">{{c.short}}</a>}}
    <a routerLink="/pm-calculators">All calculators</a><a routerLink="/pm-glossary">Glossary</a></div></nav>`,
  styles:[`.calc-more{margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--line)}.links{display:flex;flex-wrap:wrap;gap:.5rem}
    .links a{padding:.5rem .85rem;border:1px solid var(--line);border-radius:99px;background:#082039;color:#d9eef7;text-decoration:none;font-weight:700;font-size:.88rem}.links a:hover{border-color:var(--accent)}`]
})
export class CalcMoreComponent{@Input() current='';readonly calculators=CALCULATORS;}

export const money=(n:number)=>!isFinite(n)?'–':(n<0?'−$':'$')+Math.abs(Math.round(n)).toLocaleString('en-CA');
export const num=(n:number,d=2)=>!isFinite(n)?'–':n.toLocaleString('en-CA',{minimumFractionDigits:d,maximumFractionDigits:d});
export const pct=(n:number,d=1)=>!isFinite(n)?'–':(n*100).toLocaleString('en-CA',{minimumFractionDigits:d,maximumFractionDigits:d})+'%';

export const CALC_STYLES=`
  .calc{max-width:1100px}.back{display:inline-block;margin-bottom:1rem;color:var(--accent);font-weight:700}
  .calc-head{max-width:860px;margin-bottom:1.5rem}.calc-head h1{font-size:clamp(2.2rem,5vw,3.6rem)!important;line-height:1.05!important}
  .tool{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:1.25rem;align-items:start}
  .inputs{display:grid;gap:.9rem}
  .inputs label{display:grid;gap:.35rem;font-size:.85rem;font-weight:700;color:#b8cada}
  .inputs label small{font-weight:500;color:var(--muted)}
  .inputs input,.inputs select,.grid-input input,.grid-input select{width:100%;border:1px solid #315370;background:#071a30;color:#fff;border-radius:10px;padding:.7rem .8rem;font-size:1rem}
  .inputs input:focus,.grid-input input:focus,.grid-input select:focus{outline:2px solid var(--accent);border-color:transparent}
  .results{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.7rem}
  .r{background:#0b2340;border:1px solid var(--line);border-radius:12px;padding:.85rem}
  .r span{display:block;font-size:.78rem;color:var(--muted);font-weight:700}
  .r strong{display:block;font-size:1.45rem;color:#fff;margin:.15rem 0;font-variant-numeric:tabular-nums}
  .r small{display:block;color:#9fb6cb;font-size:.78rem;line-height:1.35}
  .r.good strong{color:#5fd68a}.r.bad strong{color:#ff8f8f}.r.warn strong{color:#f6c35b}
  .verdict{margin-top:.9rem;padding:.9rem 1rem;border-radius:10px;background:#0c2b49;color:#d6e6f3;line-height:1.6}
  .grid-input{width:100%;border-collapse:collapse}.grid-input th{font-size:.78rem;color:var(--muted);text-align:left;padding:.3rem}.grid-input td{padding:.25rem}
  .grid-input button{background:transparent;border:1px solid #3b5874;color:#c9d9e7;border-radius:8px;padding:.45rem .6rem;cursor:pointer}
  .row-actions{display:flex;gap:.5rem;margin-top:.6rem;flex-wrap:wrap}
  .explain{margin-top:3rem}.explain h2{font-size:clamp(1.6rem,3vw,2.2rem)!important;margin:2rem 0 .8rem!important;letter-spacing:-.02em!important}
  .explain h3{margin:1.3rem 0 .4rem}.explain p,.explain li{line-height:1.8;color:#c9d9e7}
  .explain a{color:var(--accent)}
  .formula{font-family:Consolas,'Liberation Mono',monospace;background:#06162a;border:1px solid #23466a;border-radius:8px;padding:.8rem 1rem;color:#e8f4ff;overflow-x:auto;line-height:1.8}
  .table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:12px}
  table.data{border-collapse:collapse;width:100%;font-size:.92rem}table.data th,table.data td{padding:.6rem .8rem;border-bottom:1px solid #1b3a5c;text-align:left;color:#d6e4f0}table.data th{background:#0e2d4e;color:#fff}
  @media(max-width:860px){.tool{grid-template-columns:minmax(0,1fr)}}
`;

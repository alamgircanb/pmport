import {Component,OnInit} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {DatalabNavComponent,LAB_STYLES,progress} from './datalab-shared';
import {DATASET} from './datalab-data';

type Rag='Green'|'Amber'|'Red';
interface Project{id:string;name:string;department:string;status:string;budget:number;ac:number;pc:number;pp:number;ev:number;pv:number;cpi:number|null;spi:number;rag:Rag}
interface Risk{id:string;project:string;description:string;probability:number;impact:number;emv:number}

function rows<T>(table:string,map:(get:(c:string)=>string|number)=>T):T[]{
  const t=DATASET[table];return t.rows.map(r=>map(c=>r[t.columns.indexOf(c)]));
}
const ragOf=(pc:number,pp:number):Rag=>pp===0||pc/pp>=0.95?'Green':pc/pp>=0.85?'Amber':'Red';

/** DataLab, Data reporting module: build a portfolio status report in four guided steps. */
@Component({
  standalone:true,selector:'app-report-lab',imports:[DecimalPipe,FormsModule,RouterLink,DatalabNavComponent],
  template:`
  <section class="page">
    <app-datalab-nav></app-datalab-nav>
    <header class="lab-head"><p class="eyebrow">DataLab · Data reporting</p><h1>Build a portfolio status report</h1>
      <p class="lead">You are the PMO analyst at Prairie Logistics. Leadership wants this month's portfolio status report. Work through four steps: headline KPIs, RAG status, top risks and an executive summary. At the end you'll have a finished one-page report.</p></header>

    <ol class="stepper" aria-label="Steps">
      @for(s of steps;track $index){<li><button type="button" [class.active]="stepIx===$index" [class.done]="done.includes(s.id)" (click)="stepIx=$index">{{$index+1}}. {{s.title}}</button></li>}
    </ol>

    @if(stepIx<4){
      <details class="panel" [open]="stepIx<2"><summary>Project data (status date: this month)</summary>
        <div class="result-wrap"><table class="result"><thead><tr><th>ID</th><th>Project</th><th>Department</th><th>Status</th><th>Budget (BAC)</th><th>Actual cost (AC)</th><th>% complete</th><th>Planned %</th></tr></thead>
        <tbody>@for(p of projects;track p.id){<tr><td>{{p.id}}</td><td>{{p.name}}</td><td>{{p.department}}</td><td>{{p.status}}</td><td class="n">{{p.budget|number}}</td><td class="n">{{p.ac|number}}</td><td class="n">{{p.pc*100|number:'1.0-0'}}%</td><td class="n">{{p.pp*100|number:'1.0-0'}}%</td></tr>}</tbody></table></div>
        <p class="kbd">EV = Budget × % complete · PV = Budget × Planned % · CPI = EV ÷ AC · SPI = EV ÷ PV. Tip: you can calculate these in the <a routerLink="/pm-datalab/excel">Excel lab</a> or <a routerLink="/pm-datalab/sql">SQL lab</a>.</p>
      </details>
    }

    @switch(stepIx){
      @case(0){
        <div class="card step"><h2>Step 1: Headline KPIs</h2>
          <p class="prompt">Calculate the portfolio totals for the KPI tiles at the top of the report. Enter money as whole dollars and ratios to 2 decimals.</p>
          <div class="kpi-form">
            @for(k of kpis;track k.key){<label class="field"><span>{{k.label}}</span><input type="number" inputmode="decimal" [(ngModel)]="answers[k.key]" [attr.aria-label]="k.label">
              @if(checked){<small [class.okc]="kpiOk(k.key)" [class.badc]="!kpiOk(k.key)">{{kpiOk(k.key)?'✓ Correct':'✗ Check this one'}}</small>}</label>}
          </div>
          <div class="toolbar"><button type="button" class="button primary" (click)="checkKpis()">Check KPIs</button><button type="button" class="button secondary" (click)="showHint=!showHint">{{showHint?'Hide hint':'Hint'}}</button></div>
          @if(showHint){<div class="hint">Total EV = sum of each project's Budget × % complete (don't multiply the totals). Portfolio CPI = Total EV ÷ Total AC, and Portfolio SPI = Total EV ÷ Total PV.</div>}
          @if(msg){<div class="feedback" [class.ok]="msgOk" [class.bad]="!msgOk" role="status">{{msg}}</div>}
        </div>
      }
      @case(1){
        <div class="card step"><h2>Step 2: RAG status per project</h2>
          <p class="prompt">Use the schedule rule: <strong>Green</strong> if SPI ≥ 0.95 (or nothing was planned yet), <strong>Amber</strong> if SPI ≥ 0.85, otherwise <strong>Red</strong>. SPI = % complete ÷ planned %.</p>
          <div class="rag-list">
            @for(p of projects;track p.id){<div class="rag-row"><span><strong>{{p.name}}</strong> <small class="kbd">{{p.pc*100|number:'1.0-0'}}% done vs {{p.pp*100|number:'1.0-0'}}% planned</small></span>
              <span class="rag-pick" role="radiogroup" [attr.aria-label]="'RAG for '+p.name">@for(r of ragValues;track r){<button type="button" role="radio" [attr.aria-checked]="ragAnswers[p.id]===r" [class]="'chip '+r.toLowerCase()+(ragAnswers[p.id]===r?' on':'')" (click)="ragAnswers[p.id]=r">{{r}}</button>}
              @if(checked){<span [class.okc]="ragAnswers[p.id]===p.rag" [class.badc]="ragAnswers[p.id]!==p.rag">{{ragAnswers[p.id]===p.rag?'✓':'✗'}}</span>}</span></div>}
          </div>
          <div class="toolbar"><button type="button" class="button primary" (click)="checkRag()">Check RAG</button></div>
          @if(msg){<div class="feedback" [class.ok]="msgOk" [class.bad]="!msgOk" role="status">{{msg}}</div>}
        </div>
      }
      @case(2){
        <div class="card step"><h2>Step 3: Top 3 risks</h2>
          <p class="prompt">Leadership only has time for three risks. Pick the three <strong>open</strong> risks with the highest expected monetary value (EMV = probability × impact).</p>
          <div class="result-wrap"><table class="result"><thead><tr><th>Pick</th><th>Risk</th><th>Project</th><th>Probability</th><th>Impact ($)</th></tr></thead>
            <tbody>@for(k of openRisks;track k.id){<tr><td><input type="checkbox" [checked]="picked.has(k.id)" (change)="toggle(k.id)" [attr.aria-label]="'Pick '+k.description"></td><td>{{k.description}}</td><td>{{k.project}}</td><td class="n">{{k.probability*100|number:'1.0-0'}}%</td><td class="n">{{k.impact|number}}</td></tr>}</tbody></table></div>
          <div class="toolbar"><button type="button" class="button primary" (click)="checkRisks()">Check my top 3</button></div>
          @if(msg){<div class="feedback" [class.ok]="msgOk" [class.bad]="!msgOk" role="status">{{msg}}</div>}
        </div>
      }
      @case(3){
        <div class="card step"><h2>Step 4: Executive summary</h2>
          <p class="prompt">Write 4 to 6 sentences for leadership. A good status summary:</p>
          <ul class="check">
            <li>opens with the overall status in one line (on track, at risk, off track);</li>
            <li>gives the key numbers: CPI, SPI and how much over or under budget the work is;</li>
            <li>names the red projects and why;</li>
            <li>names the top risk and its exposure;</li>
            <li>ends with the decision or help you need from leadership.</li>
          </ul>
          <label class="sr-only" for="summary">Your executive summary</label>
          <textarea id="summary" class="editor prose" [(ngModel)]="summary" placeholder="Overall, the portfolio is…"></textarea>
          <div class="toolbar"><button type="button" class="button primary" (click)="finishSummary()">Save summary</button><button type="button" class="button secondary" (click)="showModel=!showModel">{{showModel?'Hide':'Show'}} a model answer</button></div>
          @if(showModel){<div class="hint">{{modelSummary}}</div>}
          @if(msg){<div class="feedback" [class.ok]="msgOk" [class.bad]="!msgOk" role="status">{{msg}}</div>}
        </div>
      }
      @case(4){
        <article class="report" aria-label="Portfolio status report">
          <header class="report-head"><div><p class="eyebrow">Prairie Logistics · PMO</p><h2>Portfolio status report</h2></div><span [class]="'chip big '+overall.toLowerCase()">Overall: {{overall}}</span></header>
          <div class="tiles">
            <div class="tile"><span>Budget (BAC)</span><strong>{{totals.budget|number:'1.0-0'}}</strong></div>
            <div class="tile"><span>Earned value</span><strong>{{totals.ev|number:'1.0-0'}}</strong></div>
            <div class="tile"><span>Actual cost</span><strong>{{totals.ac|number:'1.0-0'}}</strong></div>
            <div class="tile"><span>CPI</span><strong [class.warn]="totals.cpi<0.95">{{totals.cpi|number:'1.2-2'}}</strong></div>
            <div class="tile"><span>SPI</span><strong [class.warn]="totals.spi<0.95">{{totals.spi|number:'1.2-2'}}</strong></div>
          </div>
          <h3>Projects</h3>
          <div class="bars">
            @for(p of projects;track p.id){<div class="bar-row"><span class="pname">{{p.name}}</span>
              <span class="track" [attr.aria-label]="'SPI '+(p.spi|number:'1.2-2')"><span [class]="'fill '+p.rag.toLowerCase()" [style.width.%]="barWidth(p.spi)"></span><span class="one"></span></span>
              <span class="val">SPI {{p.spi|number:'1.2-2'}} · CPI {{p.cpi===null?'n/a':(p.cpi|number:'1.2-2')}}</span><span [class]="'chip '+p.rag.toLowerCase()">{{p.rag}}</span></div>}
            <p class="kbd">Bars show SPI; the line marks 1.00 (on plan).</p>
          </div>
          <h3>Top risks</h3>
          <ol class="risks">@for(k of topRisks;track k.id){<li><strong>{{k.description}}</strong> ({{k.project}}): {{k.probability*100|number:'1.0-0'}}% × {{k.impact|number}} = EMV {{k.emv|number:'1.0-0'}}</li>}</ol>
          <h3>Executive summary</h3>
          <p class="summary">{{summary||modelSummary}}</p>
          <div class="toolbar no-print"><button type="button" class="button primary" (click)="print()">Print or save as PDF</button><button type="button" class="button secondary" (click)="restart()">Start again</button></div>
        </article>
      }
    }
  </section>`,
  styles:[LAB_STYLES+`
    .stepper{list-style:none;padding:0;margin:0 0 1rem;display:flex;flex-wrap:wrap;gap:.4rem}
    .stepper button{background:#0b2340;color:#d6e4f0;border:1px solid var(--line);border-radius:99px;padding:.45rem .85rem;cursor:pointer;font-weight:700;font-size:.86rem}
    .stepper button.active{border-color:var(--accent);color:#fff}.stepper button.done::before{content:'✓ ';color:#5fd68a}
    .step h2{font-size:clamp(1.4rem,3vw,1.9rem)!important;margin:0 0 .6rem!important}
    .kpi-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.8rem;margin:1rem 0}
    .kpi-form .field span{font-size:.82rem;color:#b8cada;font-weight:700}
    .kpi-form input{width:100%;border:1px solid #315370;background:#071a30;color:#fff;border-radius:10px;padding:.7rem}
    .okc{color:#5fd68a;font-weight:700}.badc{color:#ff9fb1;font-weight:700}
    .rag-list{display:grid;gap:.4rem;margin:1rem 0}
    .rag-row{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.6rem;padding:.55rem .7rem;border:1px solid var(--line);border-radius:10px;background:#0a2038}
    .rag-pick{display:flex;gap:.3rem;align-items:center}
    .chip{display:inline-block;border-radius:99px;padding:.25rem .7rem;font-weight:800;font-size:.78rem;border:1px solid transparent;cursor:pointer;opacity:.55;background:#1b3a5c;color:#fff}
    .chip.on,.report .chip{opacity:1;cursor:default}
    .chip.green{background:#1f7a46}.chip.amber{background:#b7791f}.chip.red{background:#b42318}
    .chip.on{outline:2px solid #fff}
    .chip.big{font-size:.95rem;padding:.4rem .9rem}
    .check{color:#c9dcec;line-height:1.7}
    .editor.prose{font-family:inherit;min-height:170px}
    .report{background:#f7f9fc;color:#16222f;border-radius:16px;padding:clamp(1rem,3vw,2rem)}
    .report .eyebrow{color:#1f6f8b}.report h2{color:#0b2340;font-size:clamp(1.6rem,3vw,2.2rem)!important;margin:0!important}
    .report .button.secondary{color:#0b2340;border-color:#9fb3c8}
    .report h3{color:#0b2340;margin:1.6rem 0 .6rem}.report .kbd{color:#5a6b7c}
    .report-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
    .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.7rem;margin-top:1.2rem}
    .tile{background:#fff;border:1px solid #d9e2ec;border-radius:12px;padding:.8rem}.tile span{display:block;font-size:.78rem;color:#5a6b7c;font-weight:700}
    .tile strong{font-size:1.5rem;color:#0b2340}.tile strong.warn{color:#b42318}
    .bars{display:grid;gap:.45rem}
    .bar-row{display:grid;grid-template-columns:minmax(150px,1.2fr) 2fr 12.5rem 4.5rem;gap:.6rem;align-items:center;font-size:.88rem}
    .track{position:relative;height:12px;background:#e3e9f0;border-radius:99px;overflow:hidden}
    .fill{position:absolute;left:0;top:0;bottom:0;border-radius:99px}.fill.green{background:#1f7a46}.fill.amber{background:#d69e2e}.fill.red{background:#c53030}
    .one{position:absolute;left:66.67%;top:-2px;bottom:-2px;width:2px;background:#0b2340}
    .val{color:#3c4c5c;font-variant-numeric:tabular-nums;white-space:nowrap}
    .risks{line-height:1.7}.summary{line-height:1.75;white-space:pre-wrap}
    @media(max-width:700px){.bar-row{grid-template-columns:1fr auto}.bar-row .track{grid-column:1/-1}}
    @media print{.no-print,app-datalab-nav,.stepper,.lab-head{display:none!important}.report{background:#fff}}
  `]
})
export class ReportLabComponent implements OnInit{
  readonly steps=[{id:'r1',title:'Headline KPIs'},{id:'r2',title:'RAG status'},{id:'r3',title:'Top risks'},{id:'r4',title:'Executive summary'},{id:'r5',title:'Your report'}];
  readonly ragValues:Rag[]=['Green','Amber','Red'];
  readonly projects:Project[]=rows('projects',g=>{
    const budget=+g('budget'),ac=+g('actual_cost'),pc=+g('percent_complete'),pp=+g('planned_percent');
    return {id:String(g('project_id')),name:String(g('name')),department:String(g('department')),status:String(g('status')),budget,ac,pc,pp,
      ev:budget*pc,pv:budget*pp,cpi:ac>0?budget*pc/ac:null,spi:pp>0?pc/pp:1,rag:ragOf(pc,pp)};
  });
  private readonly names=Object.fromEntries(this.projects.map(p=>[p.id,p.name]));
  readonly openRisks:Risk[]=rows('risks',g=>({id:String(g('risk_id')),project:this.names[String(g('project_id'))],description:String(g('description')),
    probability:+g('probability'),impact:+g('impact_cost'),emv:+g('probability')*+g('impact_cost'),status:String(g('status'))}))
    .filter(r=>r.status==='Open').map(({status,...r})=>r);
  readonly topRisks=[...this.openRisks].sort((a,b)=>b.emv-a.emv).slice(0,3);
  readonly totals=(()=>{const s=(f:(p:Project)=>number)=>this.projects.reduce((a,p)=>a+f(p),0);
    const budget=s(p=>p.budget),ev=s(p=>p.ev),ac=s(p=>p.ac),pv=s(p=>p.pv);return {budget,ev,ac,pv,cpi:ev/ac,spi:ev/pv};})();
  readonly kpis=[{key:'budget',label:'Total budget (BAC) $'},{key:'ev',label:'Total earned value (EV) $'},{key:'ac',label:'Total actual cost (AC) $'},{key:'cpi',label:'Portfolio CPI'},{key:'spi',label:'Portfolio SPI'}] as const;
  readonly overall:Rag=ragOf(this.totals.spi,1)==='Green'&&this.totals.cpi>=0.95?'Green':this.totals.spi<0.85||this.totals.cpi<0.85?'Red':'Amber';

  stepIx=0;done:string[]=[];checked=false;msg='';msgOk=false;showHint=false;showModel=false;
  answers:Record<string,number|null>={budget:null,ev:null,ac:null,cpi:null,spi:null};
  ragAnswers:Record<string,Rag|undefined>={};
  picked=new Set<string>();
  summary='';

  ngOnInit(){this.done=progress.get('report');}

  get modelSummary():string{
    const t=this.totals,red=this.projects.filter(p=>p.rag==='Red'),top=this.topRisks[0];
    const money=(n:number)=>'$'+Math.round(n).toLocaleString('en-CA');
    return `Overall the portfolio is ${this.overall==='Green'?'on track':this.overall==='Amber'?'at risk':'off track'}: across ${this.projects.length} projects (${money(t.budget)} budget) we have earned ${money(t.ev)} of value for ${money(t.ac)} spent, a CPI of ${t.cpi.toFixed(2)}, so we are getting about ${Math.round(t.cpi*100)} cents of planned work for every dollar. `+
      `Schedule is also behind plan with an SPI of ${t.spi.toFixed(2)}. ${red.length} project${red.length===1?' is':'s are'} red on schedule: ${red.map(p=>`${p.name} (${Math.round(p.pc*100)}% done vs ${Math.round(p.pp*100)}% planned)`).join(', ')}. `+
      `The largest open risk is "${top.description}" on ${top.project}, with an expected exposure of ${money(top.emv)}. `+
      `We ask leadership to approve a recovery plan for ${red[0]?.name??'the red projects'} and to help escalate the supplier risk this month.`;
  }

  kpiOk(k:string):boolean{
    const v=this.answers[k];if(v===null||v===undefined||isNaN(+v))return false;
    const exp=this.totals[k as 'budget'|'ev'|'ac'|'cpi'|'spi'];
    return k==='cpi'||k==='spi'?Math.abs(+v-exp)<=0.006:Math.abs(+v-exp)<=1;
  }
  checkKpis(){this.checked=true;const ok=this.kpis.every(k=>this.kpiOk(k.key));
    this.say(ok?'All five KPIs are correct. On to the RAG status.':'Some KPIs need another look. Fields marked ✗ are not right yet.',ok);if(ok)this.complete('r1');}
  checkRag(){this.checked=true;const wrong=this.projects.filter(p=>this.ragAnswers[p.id]!==p.rag).length;
    this.say(wrong?`${wrong} project${wrong===1?' is':'s are'} not right yet. Calculate SPI = % complete ÷ planned % for those rows.`:'All RAG ratings are correct.',!wrong);if(!wrong)this.complete('r2');}
  toggle(id:string){this.picked.has(id)?this.picked.delete(id):this.picked.add(id);}
  checkRisks(){
    if(this.picked.size!==3){this.say(`Pick exactly 3 risks (you have ${this.picked.size}).`,false);return;}
    const ok=this.topRisks.every(r=>this.picked.has(r.id));
    this.say(ok?`Correct. EMVs: ${this.topRisks.map(r=>`${r.description} ${Math.round(r.emv).toLocaleString('en-CA')}`).join('; ')}.`:'Not quite. Multiply probability by impact for each risk and take the three largest.',ok);
    if(ok)this.complete('r3');
  }
  finishSummary(){
    const words=this.summary.trim().split(/\s+/).filter(Boolean).length;
    if(words<30){this.say('Write a little more: aim for 4 to 6 sentences (at least 30 words).',false);return;}
    this.say('Summary saved. Your report is ready.',true);this.complete('r4');this.complete('r5');setTimeout(()=>this.go(4),600);
  }
  barWidth(spi:number){return Math.max(2,Math.min(100,spi/1.5*100));}
  print(){window.print();}
  restart(){this.answers={budget:null,ev:null,ac:null,cpi:null,spi:null};this.ragAnswers={};this.picked.clear();this.summary='';this.go(0);}
  private complete(id:string){this.done=progress.mark('report',id);const i=this.steps.findIndex(s=>s.id===id);if(i<3)setTimeout(()=>this.go(i+1),900);}
  private go(i:number){this.stepIx=i;this.checked=false;this.msg='';this.showHint=false;}
  private say(m:string,ok:boolean){this.msg=m;this.msgOk=ok;}
}
